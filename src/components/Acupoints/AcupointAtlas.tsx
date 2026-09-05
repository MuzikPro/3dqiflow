import { Suspense, createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { tr } from '@/i18n';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { BACKGROUND, THREE_DEFAULTS, SCENE_TEXT } from '@/styles/theme';
import { useNarrow } from '@/hooks/useNarrow';
import { BodyFigure } from '../MeridianTheater/BodyFigure';
import { BodyMesh, BodySex } from '../MeridianTheater/BodyMesh';
import { MeridianLine as SharedMeridianLine, QiFlow as SharedQiFlow } from '../three/MeridianSystem';
import { CAMERA_VIEWS, CameraViewKey } from '../MeridianTheater/bodyGeometry';
import { MERIDIAN_CLOCK, currentShichenIndex } from '@/data/meridianClock';
import { UI, RADIUS } from '@/styles/theme';
import { panelStyle, toggleButtonStyle } from '../UI/panelStyle';
import { PlacedPoint, TWELVE, EXTRA, VESSEL_SIX, NO_MIRROR, VESSEL_POINTS, Vec3, BodySexKey, meridianColor, placedPoints, flowLabel } from './pointGeometry';
import { AcupointControls } from './AcupointControls';

type OrbitRef = React.ElementRef<typeof OrbitControls>;

/** 经线/气流已抽为共用件（components/three/MeridianSystem）；此处只把
 *  经穴图的镜头缩放档位喂给管径。 */
function MeridianLine(props: { code: string; mirrored: boolean; dim: boolean; sex: BodySexKey }) {
  const zs = useContext(ZoomScaleContext).mark;
  return <SharedMeridianLine {...props} radiusScale={zs} />;
}
const QiFlow = SharedQiFlow;

/**
 * 穴点与经络线随镜头缩放（owner 2026-08-23）。
 *
 * 原先穴点是固定世界半径 0.017–0.034，而手指宽只有 0.06 上下——
 * 一个点就盖掉半根指头，且比例不随缩放改变，推到手上也永远看不见手指，
 * 于是"经脉终于拇指"这件事在图上根本读不出来。
 * 改成按相机距离缩放（近处变小、远处变大，屏幕上大致恒定），
 * 与 FlowRing 的做法一致；半径量化成档位，跨档才改，免得每帧重建几何。
 */
const REF_DIST = 9.5;
/**
 * mark = 穴点/管径的缩放：与距离成正比，屏幕上大小大致恒定。
 * label = 穴名的缩放：取 sqrt。字若也严格恒定，推到手足机位时仍是那 4 px，
 * 小到读不出名字（就是加了部位机位后第一版的样子）；若不缩放又会涨 7 倍
 * 盖满整只手。取平方根：默认机位处与原来一致，推近时放大到约 2.6 倍。
 */
const ZoomScaleContext = createContext({ mark: 1, label: 1 });
const zoomBucket = (d: number) => Math.round(Math.min(2.0, Math.max(0.25, d / REF_DIST)) * 8) / 8;

function ZoomScaleProvider({ children }: { children: React.ReactNode }) {
  const [scale, setScale] = useState({ mark: 1, label: 1 });
  useFrame((state) => {
    const target = state.controls
      ? (state.controls as unknown as { target: THREE.Vector3 }).target
      : new THREE.Vector3(0, 0, 0);
    const b = zoomBucket(state.camera.position.distanceTo(target));
    if (b !== scale.mark) setScale({ mark: b, label: Math.sqrt(b) });
    // DEV 校验句柄（同项目既有 __orbit/__tl 惯例）：缩放联动只能靠推近镜头才看得出来
    if (import.meta.env.DEV) {
      (window as unknown as Record<string, unknown>).__atlas = {
        dist: state.camera.position.distanceTo(target), scale: b,
        camera: state.camera, controls: state.controls, scene: state.scene,
        // 世界坐标 -> 画布像素。用来核对"某穴到底画在哪根手指上"，
        // 光靠离皮肤的距离分不出隔壁手指（见 scripts/audit-wells.py 的说明）。
        project: (x: number, y: number, z: number) => {
          const v = new THREE.Vector3(x, y, z).project(state.camera);
          return [(v.x * 0.5 + 0.5) * state.size.width, (-v.y * 0.5 + 0.5) * state.size.height];
        },
        // 画布像素 -> 打到人体网格上的世界坐标
        pick: (px: number, py: number) => {
          const rc = new THREE.Raycaster();
          rc.setFromCamera(new THREE.Vector2(px / state.size.width * 2 - 1,
                                             -(py / state.size.height) * 2 + 1), state.camera);
          const hit = rc.intersectObjects(state.scene.children, true)
            .filter((h) => (h.object as THREE.Mesh).geometry?.attributes?.position?.count > 5000);
          return hit.length ? hit[0].point.toArray() : null;
        }
      };
    }
  });
  return <ZoomScaleContext.Provider value={scale}>{children}</ZoomScaleContext.Provider>;
}

/** 单个穴位标记 */
function PointMark({
  p, color, dim, selected, showLabel, onSelect
}: { p: PlacedPoint; color: string; dim: boolean; selected: boolean; showLabel: boolean;
     onSelect: (p: PlacedPoint) => void }) {
  const [hover, setHover] = useState(false);
  const zs = useContext(ZoomScaleContext).mark;
  const zl = useContext(ZoomScaleContext).label;
  const r = (selected ? 0.021 : hover ? 0.016 : 0.010) * zs;
  return (
    <group position={p.at}>
      {/* 可见标记：穴点本身很小，触屏点不中，故另加隐形拾取球（同 FlowRing 的做法） */}
      <mesh>
        <sphereGeometry args={[r, 10, 10]} />
        <meshBasicMaterial color={color} transparent opacity={dim ? 0.18 : 1} depthWrite={false} />
      </mesh>
      <mesh
        visible={false}
        onClick={(e) => { e.stopPropagation(); onSelect(p); }}
        onPointerOver={(e) => { e.stopPropagation(); setHover(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHover(false); document.body.style.cursor = 'default'; }}
      >
        <sphereGeometry args={[0.085 * zs, 8, 8]} />
        <meshBasicMaterial />
      </mesh>
      {/* 穴名：常显时只标本侧，对侧不再重复一遍，免得糊成两排 */}
      {(hover || selected || showLabel) && (
        <Html center distanceFactor={7} position={[0, 0.075 * zs, 0]} style={{ pointerEvents: 'none' }}>
          <div style={{
            color: hover || selected ? SCENE_TEXT.accent : color,
            // drei 的 distanceFactor 让标签保持"世界尺寸"，推近镜头字就跟着涨；
            // 穴点已按缩放缩小，字若不同步就会盖满整只脚（推到足部时约涨 7 倍）。
            // 字号乘上同一个缩放系数，屏幕上的大小才大致恒定。
            fontSize: ((hover || selected ? 9 : 5.5) * zl).toFixed(2) + 'px',
            letterSpacing: '0.5px', whiteSpace: 'nowrap', opacity: hover || selected ? 1 : 0.9,
            textShadow: '0 0 5px rgba(0,0,0,0.98), 0 0 2px rgba(0,0,0,1)'
          }}>
            {tr(p.zh)}{(hover || selected) && ` ${p.code}`}
          </div>
        </Html>
      )}
    </group>
  );
}

/**
 * 部位机位（owner 2026-08-23）。
 *
 * 整体视角只给了前/背/侧/俯，要看手足只能自己拖，而手指宽不过 0.06、
 * 五个井穴挤在一处，拖到位并不容易。这里直接给两个部位机位，
 * 数值取自 measure-digits.py 量出的指趾锚点中心。
 *
 * 与整体视角的差别在于**镜头要对准部位**，不再对着身体中心；
 * 所以这里显式设 OrbitControls 的 target（这也是给 OrbitControls 加
 * makeDefault 的原因，否则拿不到 controls）。
 */
// 机位取 -x 侧：数据本侧（带穴名标签的一侧）在 -x，对侧镜像不重复标名。
// 原机位对着 +x 镜像侧，手/足视角里永远看不到穴名（owner 2026-08-27 报「看不到申脈」）
const REGION_VIEWS = {
  hand: { target: [-1.66, 0.22, 0.08] as Vec3, pos: [-1.72, 0.42, 1.42] as Vec3 },
  foot: { target: [-0.77, -3.08, 0.20] as Vec3, pos: [-0.60, -2.52, 1.38] as Vec3 }
} as const;

export type AtlasViewKey = CameraViewKey | keyof typeof REGION_VIEWS;
const isRegion = (v: AtlasViewKey): v is keyof typeof REGION_VIEWS => v in REGION_VIEWS;

function CameraRig({ view, narrow }: { view: AtlasViewKey; narrow: boolean }) {
  const camera = useThree((s) => s.camera);
  const controls = useThree((s) => s.controls) as { target: THREE.Vector3; update: () => void } | null;
  useMemo(() => {
    const k = narrow ? 1.5 : 1;
    if (isRegion(view)) {
      const { target, pos } = REGION_VIEWS[view];
      // 部位机位：按窄屏放远一点，但要绕着 target 放远，不是绕原点
      const p = pos.map((v, i) => target[i] + (v - target[i]) * k) as unknown as Vec3;
      camera.position.set(p[0], p[1], p[2]);
      if (controls) {
        controls.target.set(target[0], target[1], target[2]);
        controls.update();
      } else {
        camera.lookAt(target[0], target[1], target[2]);
      }
      return;
    }
    const [x, y, z] = CAMERA_VIEWS[view];
    camera.position.set(x * k, y, z * k);
    if (controls) {
      controls.target.set(0, 0.5, 0);
      controls.update();
    } else {
      camera.lookAt(0, 0.5, 0);
    }
  }, [view, narrow, camera, controls]);
  return null;
}

/** 子午流注：MERIDIAN_CLOCK 各时辰对应的本页经络码（子胆丑肝…顺序对齐） */
const CLOCK_CODE = ['GB', 'LR', 'LU', 'LI', 'ST', 'SP', 'HT', 'SI', 'BL', 'KI', 'PC', 'TE'];

/** 搜索定位请求：穴位→镜头推近该穴（连带周边参照）；经/脉→独显整条并回全身位 */
type FocusReq = { kind: 'point'; at: Vec3; n: number } | { kind: 'fit'; n: number };

function FocusRig({ req }: { req: FocusReq | null }) {
  const camera = useThree((s) => s.camera);
  const controls = useThree((s) => s.controls) as
    { target: THREE.Vector3; update: () => void } | null;
  useEffect(() => {
    if (!req || !controls) return;
    if (req.kind === 'point') {
      const t = new THREE.Vector3(req.at[0], req.at[1], req.at[2]);
      // 保持当前观察方向，把镜头拉到穴位近旁——放大同时留出邻近参照
      const dir = camera.position.clone().sub(controls.target);
      if (dir.lengthSq() < 1e-6) dir.set(0, 0, 1); else dir.normalize();
      controls.target.copy(t);
      camera.position.copy(t.clone().add(dir.multiplyScalar(1.7)));
      controls.update();
    } else {
      const [x, y, z] = CAMERA_VIEWS.front;
      controls.target.set(0, 0.5, 0);
      camera.position.set(x, y, z);
      controls.update();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [req]);
  return null;
}

/**
 * 经穴图：十二正经 + 其经穴，落在人体上（本场景不画脏腑）。
 * 坐标为示意定位，非解剖测量值 —— 见 src/data/acupoints.ts 头部说明。
 */
interface AtlasProps {
  /** 从别页带时辰进来：直接开启子午流注并对到该时辰 */
  initialClockIndex?: number | null;
  /** 来路页名（有则显示「← 返回 …」） */
  returnLabel?: string | null;
  onReturn?: () => void;
}

export function AcupointAtlas({ initialClockIndex = null, returnLabel = null, onReturn }: AtlasProps = {}) {
  const narrow = useNarrow();
  const [view, setView] = useState<AtlasViewKey>('front');
  const [visible, setVisible] = useState<Set<string>>(() => new Set(TWELVE));
  const [selected, setSelected] = useState<PlacedPoint | null>(null);
  // 人体三档：隐藏 / 淡（只要个位置感）/ 清晰（看得出肌肉骨性起伏，好定穴）
  // 默认给"清晰"——之前那档太淡，整具身体是一块没有起伏的影子，
  // 穴位没有可参照的体表标志，等于白标。
  const [bodyLevel, setBodyLevel] = useState<'off' | 'faint' | 'clear'>('clear');
  const showBody = bodyLevel !== 'off';
  // 穴名：自动＝显示的穴不多时才标（全开 618 穴会糊成一片）
  const [labelMode, setLabelMode] = useState<'auto' | 'always' | 'off'>('auto');
  // 气机流动：沿穴序推进，方向即经气方向
  const [qi, setQi] = useState(true);
  const [qiSpeed, setQiSpeed] = useState(1);
  // 拖动行为（自十二经运行搬来）：平移原先只绑右键，触控板上做不出来
  // （双指=滚动→被当成缩放）。手部/足部机位下想把某根指头挪到画面中央，
  // 没有平移几乎对不准，所以这里同样给左键拖动一个可切换的行为。
  // 男/女体表。穴位是按**男性**体表与其骨性标志逐条推导的，
  // 换到女体表上实测中位偏差 12.8 mm、107/362 超过 20 mm、踝周最远 74 mm
  // （大鐘/崑崙/太溪 一带，她的踝小得多）。所以女体只作体型参照，
  // 不在其上显示穴位与走线——摆上去就是明知故错。
  const [sex, setSex] = useState<BodySex>('male');
  const [dragMode, setDragMode] = useState<'rotate' | 'pan'>('rotate');
  const [focusReq, setFocusReq] = useState<FocusReq | null>(null);
  // 子午流注（owner 2026-08-27）：当令经全亮+流速增，余十一经压暗为影
  const [liuzhu, setLiuzhu] = useState(false);
  const [shichenIdx, setShichenIdx] = useState(() => currentShichenIndex());
  const [liveClock, setLiveClock] = useState(true);
  const [handoffFrom, setHandoffFrom] = useState<string | null>(null); // 交接中的上一经
  const savedVisibleRef = useRef<Set<string> | null>(null);
  const handoffTimer = useRef<number | null>(null);
  const [shiftHeld, setShiftHeld] = useState(false);
  const controlsRef = useRef<OrbitRef>(null);

  useEffect(() => {
    const down = (e: KeyboardEvent) => e.key === 'Shift' && setShiftHeld(true);
    const up = (e: KeyboardEvent) => e.key === 'Shift' && setShiftHeld(false);
    // 切到别的窗口时 keyup 收不到，回来会卡在平移态，故 blur 一并清掉
    const clear = () => setShiftHeld(false);
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    window.addEventListener('blur', clear);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      window.removeEventListener('blur', clear);
    };
  }, []);

  const panning = dragMode === 'pan' || shiftHeld;
  useEffect(() => {
    const c = controlsRef.current;
    if (!c) return;
    c.mouseButtons.LEFT = panning ? THREE.MOUSE.PAN : THREE.MOUSE.ROTATE;
    c.touches.ONE = panning ? THREE.TOUCH.PAN : THREE.TOUCH.ROTATE;
  }, [panning]);
  const points = useMemo(() => placedPoints(sex), [sex]);
  // DEV 取穴句柄（同项目既有 __tl/__orbit 惯例）：穴点很小，自动化里点不中
  if (import.meta.env.DEV) {
    (window as unknown as Record<string, unknown>).__pickAcupoint = (code: string) =>
      setSelected(points.find((p) => p.code === code) ?? null);
  }
  const { camera, lights } = THREE_DEFAULTS;
  const dangCode = CLOCK_CODE[shichenIdx];
  const clockEntry = MERIDIAN_CLOCK[shichenIdx];

  const shown = useMemo(() => {
    if (liuzhu) return points.filter((p) => p.meridian === dangCode);
    const base = points.filter((p) => visible.has(p.meridian));
    // 奇经交会穴：奇经除任督无本经穴，显示奇经时借其交会穴亮出（点本属
    // 其原经；原经同时可见时不重复加，保留原经身份）。多脉共穴去重。
    const have = new Set(base.map((p) => p.key));
    const extra: PlacedPoint[] = [];
    for (const v of VESSEL_SIX) {
      if (!visible.has(v)) continue;
      for (const code of VESSEL_POINTS[v] ?? []) {
        for (const p of points) {
          if (p.code === code && !visible.has(p.meridian) && !have.has(p.key)) {
            have.add(p.key);
            extra.push({ ...p, viaVessel: v });
          }
        }
      }
    }
    return [...base, ...extra];
  }, [liuzhu, points, visible, dangCode]);
  const labelOn = labelMode === 'always' || (labelMode === 'auto' && shown.length <= 120);

  /** 换时辰（含交接动画：上一经先涌一秒，再让位） */
  const gotoShichen = (idx: number, live: boolean) => {
    setShichenIdx((prev) => {
      if (prev !== idx) {
        setHandoffFrom(CLOCK_CODE[prev]);
        if (handoffTimer.current) window.clearTimeout(handoffTimer.current);
        handoffTimer.current = window.setTimeout(() => setHandoffFrom(null), 1200);
      }
      return idx;
    });
    setLiveClock(live);
  };

  const toggleLiuzhu = () => {
    if (!liuzhu) {
      savedVisibleRef.current = new Set(visible);
      setVisible(new Set(TWELVE));
      gotoShichen(currentShichenIndex(), true);
      setLiuzhu(true);
    } else {
      setLiuzhu(false);
      setHandoffFrom(null);
      if (savedVisibleRef.current) setVisible(savedVisibleRef.current);
    }
  };

  // 带时辰进入（轴轮模型时辰条 → 这里）：等同手动开启子午流注后拨到该时辰
  useEffect(() => {
    if (initialClockIndex === null || initialClockIndex === undefined) return;
    savedVisibleRef.current = new Set(visible);
    setVisible(new Set(TWELVE));
    setLiuzhu(true);
    gotoShichen(initialClockIndex, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialClockIndex]);

  // 实时模式：每分钟对表，跨时辰即交接
  useEffect(() => {
    if (!liuzhu || !liveClock) return;
    const iv = window.setInterval(() => {
      const now = currentShichenIndex();
      setShichenIdx((prev) => {
        if (prev === now) return prev;
        setHandoffFrom(CLOCK_CODE[prev]);
        if (handoffTimer.current) window.clearTimeout(handoffTimer.current);
        handoffTimer.current = window.setTimeout(() => setHandoffFrom(null), 1200);
        return now;
      });
    }, 60_000);
    return () => window.clearInterval(iv);
  }, [liuzhu, liveClock]);

  const toggle = (code: string) =>
    setVisible((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code); else next.add(code);
      return next;
    });

  // 搜索选中一个穴：亮出所属经、选中信息卡、镜头推近
  const focusPoint = (code: string) => {
    const p = points.find((x) => x.code === code && !x.mirrored);
    if (!p) return;
    // 流注模式下：搜到的穴把预览拨到其经当令的时辰（亮出该经）
    if (liuzhu && CLOCK_CODE.includes(p.meridian)) {
      gotoShichen(CLOCK_CODE.indexOf(p.meridian), false);
    } else {
      setVisible((prev) => (prev.has(p.meridian) ? prev : new Set(prev).add(p.meridian)));
    }
    setSelected(p);
    setFocusReq({ kind: 'point', at: p.at, n: Date.now() });
  };
  // 搜索选中一条经/脉：独显整条，回全身正面位
  const focusMeridian = (code: string) => {
    if (liuzhu && CLOCK_CODE.includes(code)) {
      gotoShichen(CLOCK_CODE.indexOf(code), false);
    } else {
      setVisible(new Set([code]));
    }
    setSelected(null);
    setView('front');
    setFocusReq({ kind: 'fit', n: Date.now() });
  };

  return (
    <div className="scene-root" style={{ width: '100vw', height: '100vh', background: BACKGROUND.gradient }}>
      {onReturn && returnLabel && (
        <button
          className="back-chip"
          style={{ ...toggleButtonStyle(false), position: 'fixed', left: '20px', top: '58px', zIndex: 120, fontSize: '11px', padding: '3px 10px' }}
          onClick={onReturn}
        >
          ← {tr('返回')} {returnLabel}
        </button>
      )}
      <Canvas
        flat
        legacy
        onCreated={({ gl }) => { gl.outputColorSpace = THREE.LinearSRGBColorSpace; }}
        camera={{ fov: camera.fov, near: camera.near, far: camera.far, position: CAMERA_VIEWS.front }}
        style={{ background: BACKGROUND.gradient }}
        onPointerMissed={() => setSelected(null)}
      >
        <ambientLight color={lights.ambient.color} intensity={lights.ambient.intensity} />
        <pointLight color={lights.center.color} intensity={lights.center.intensity}
                    distance={lights.center.distance} decay={0} position={[0, 1, 4]} />

        <ZoomScaleProvider>
        {showBody && (
          <Suspense fallback={<BodyFigure opacity={0.3} />}>
            <BodyMesh variant="atlas" sex={sex}
                      opacity={bodyLevel === 'clear' ? 0.24 : 0.10} />
          </Suspense>
        )}

        {(liuzhu ? TWELVE : [...TWELVE, ...EXTRA, ...VESSEL_SIX].filter((c) => visible.has(c))).map((code) => {
          // 流注模式：当令经全亮流速增，交接中的上一经涌一秒，余经压暗为影
          const active = !liuzhu || code === dangCode || code === handoffFrom;
          const dimmed = liuzhu && !active;
          const speed = !liuzhu ? qiSpeed : code === handoffFrom ? qiSpeed * 4 : qiSpeed * 1.6;
          const flow = qi && active;
          return (
            <group key={code}>
              <MeridianLine code={code} mirrored={false} dim={dimmed} sex={sex} />
              {flow && <QiFlow code={code} mirrored={false} speed={speed} sex={sex} />}
              {!NO_MIRROR.has(code) && <MeridianLine code={code} mirrored dim={dimmed} sex={sex} />}
              {!NO_MIRROR.has(code) && flow && <QiFlow code={code} mirrored speed={speed} sex={sex} />}
            </group>
          );
        })}

        {shown.map((p) => (
          <PointMark
            key={p.key}
            p={p}
            color={meridianColor(p.viaVessel ?? p.meridian)}
            dim={false}
            selected={selected?.key === p.key}
            showLabel={labelOn && !p.mirrored}
            onSelect={setSelected}
          />
        ))}

        </ZoomScaleProvider>

        <CameraRig view={view} narrow={narrow} />
        <FocusRig req={focusReq} />
        <OrbitControls ref={controlsRef} makeDefault enableDamping
                       dampingFactor={THREE_DEFAULTS.orbitControls.dampingFactor}
                       enablePan screenSpacePanning minDistance={0.8} maxDistance={24} />
      </Canvas>

      <AcupointControls
        view={view}
        onViewChange={setView}
        onFocusPoint={focusPoint}
        onFocusMeridian={focusMeridian}
        liuzhu={liuzhu}
        onToggleLiuzhu={toggleLiuzhu}
        visible={visible}
        onToggle={toggle}
        onSetAll={(codes) => setVisible(new Set(codes))}
        selected={selected}
        onClose={() => setSelected(null)}
        bodyLevel={bodyLevel}
        onCycleBody={() =>
          setBodyLevel((v) => (v === 'clear' ? 'faint' : v === 'faint' ? 'off' : 'clear'))}
        pointCount={shown.length}
        labelMode={labelMode}
        onCycleLabel={() =>
          setLabelMode((m) => (m === 'auto' ? 'always' : m === 'always' ? 'off' : 'auto'))}
        labelOn={labelOn}
        qi={qi}
        onToggleQi={() => setQi((v) => !v)}
        qiSpeed={qiSpeed}
        onQiSpeed={setQiSpeed}
        flowOf={flowLabel}
        dragMode={panning ? 'pan' : 'rotate'}
        onDragModeChange={setDragMode}
        sex={sex}
        onSexChange={setSex}
      />

      {/* 子午流注 · 底部时辰条（与轴轮模型同语汇；教学展示，非诊疗依据） */}
      {liuzhu && (
        <div
          className="bar-bottom"
          style={{
            ...panelStyle,
            position: 'fixed', bottom: '16px', left: '50%', transform: 'translateX(-50%)',
            zIndex: 100, borderRadius: RADIUS.pill, padding: '8px 16px',
            display: 'flex', alignItems: 'center', gap: '8px', maxWidth: '94vw'
          }}
        >
          <button
            style={{ ...toggleButtonStyle(liveClock), whiteSpace: 'nowrap' }}
            onClick={() => gotoShichen(currentShichenIndex(), true)}
            title={tr('跟随当前时辰（每分钟对表）')}
          >
            ● {tr('实时')}
          </button>
          <span style={{ display: 'flex', gap: '3px', flexShrink: 0 }}>
            {MERIDIAN_CLOCK.map((entry, i) => {
              const on = i === shichenIdx;
              const c = meridianColor(CLOCK_CODE[i]);
              return (
                <button
                  key={entry.shichen}
                  onClick={() => gotoShichen(i, false)}
                  title={`${entry.hours}${tr('时')} ${tr(entry.meridianFull)}${tr('当令')}`}
                  style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    width: '30px', padding: '2px 0', border: 'none', cursor: 'pointer',
                    borderRadius: RADIUS.sm,
                    background: on ? UI.panelBorder : 'transparent'
                  }}
                >
                  <span style={{ fontSize: '12px', color: on ? c : UI.textSecondary, fontWeight: on ? 'bold' : 'normal' }}>
                    {tr(entry.shichen)}
                  </span>
                  <span style={{ fontSize: '8px', color: on ? c : UI.textFaint, whiteSpace: 'nowrap' }}>
                    {tr(entry.organ)}
                  </span>
                </button>
              );
            })}
          </span>
          <span style={{
            fontSize: '12px', color: UI.textPrimary, whiteSpace: 'nowrap',
            overflow: 'hidden', textOverflow: 'ellipsis'
          }}>
            <span style={{ color: meridianColor(dangCode), fontWeight: 'bold' }}>
              {clockEntry.hours}{tr('时')} {tr(clockEntry.meridianFull)}{tr('当令')}
            </span>
            <span style={{ color: UI.textMuted }}> · {tr(clockEntry.note)}</span>
          </span>
        </div>
      )}
    </div>
  );
}
