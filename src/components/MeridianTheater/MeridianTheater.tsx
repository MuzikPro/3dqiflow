import { useEffect, useMemo, useRef, useState, Suspense} from 'react';
import * as THREE from 'three';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { MERIDIAN_FLOW, Meridian } from '@/data/meridians';
import { ORGANS, Organ } from '@/data/organs';
import { BACKGROUND, THREE_DEFAULTS } from '@/styles/theme';
import { BodyFigure } from './BodyFigure';
import { BodyMesh } from './BodyMesh';
import { OrganNode } from './OrganNode';
import { FlowRing } from './FlowRing';
import { TEACHING_NODES, ANATOMICAL_NODES, buildFlowPaths } from './flowGeometry';
import { TheaterControls } from './TheaterControls';
import { CAMERA_VIEWS, CameraViewKey } from './bodyGeometry';

const FLOW_STEP_MS = 1500; // 规格书：每 1.5s 切换一条经（再除以流速倍率）

/** drei 自带的控件实例类型，无需从 three-stdlib 这类传递依赖里取 */
type OrbitRef = React.ElementRef<typeof OrbitControls>;

/**
 * 视角切换 / 复位：把相机移回预设机位，并把 OrbitControls 的注视点归位。
 * 注意 target 必须命令式设置：作为 prop 传给 OrbitControls 时，每次重渲染
 * （本场景每 1.5s 自动轮播一经就会重渲染）都会把注视点拉回原点，用户刚
 * 平移到的位置当场被抹掉。
 */
function CameraRig({
  view, resetTick, controls
}: { view: CameraViewKey; resetTick: number; controls: React.RefObject<OrbitRef> }) {
  const camera = useThree((s) => s.camera);
  useEffect(() => {
    camera.position.set(...CAMERA_VIEWS[view]);
    if (import.meta.env.DEV) (window as unknown as Record<string, unknown>).__orbit = controls.current;
    if (controls.current) {
      controls.current.target.set(0, 0.5, 0);
      controls.current.update();
    } else {
      camera.lookAt(0, 0.5, 0);
    }
  }, [view, resetTick, camera, controls]);
  return null;
}

/** 经名 → 脏腑（'肺经'→'肺'） */
function organOfMeridian(m: Meridian): Organ | undefined {
  return ORGANS.find((o) => o.name === m.name.replace('经', ''));
}

interface Props {
  /** 双书联动：从条文页跳转时预选中的经脉名（如 '膀胱经'） */
  initialMeridianName?: string | null;
}

/**
 * 十二经流注剧场（"圆圈运动"纠偏规格书 · 脚本A）：
 * 脏腑固定在解剖位，金色气血沿十二条首尾相接的管道循环 —— 如环无端。
 */
export function MeridianTheater({ initialMeridianName }: Props) {
  const initial = MERIDIAN_FLOW.find((m) => m.name === initialMeridianName) ?? null;
  const [view, setView] = useState<CameraViewKey>('front');
  const [activeId, setActiveId] = useState(initial?.id ?? 0);
  const [selected, setSelected] = useState<Meridian | null>(initial);
  const [selectedOrgan, setSelectedOrgan] = useState<Organ | null>(null);
  const [speed, setSpeed] = useState(1);       // 流注速度 0.5x–3x
  const [seeThrough, setSeeThrough] = useState(false); // 剖面：看见背面膀胱/肾路径       // 圆运动叠加
  // 逐经显隐（owner 2026-08-20）：默认全显，可任意组合/只看升/只看降
  // owner 2026-08-22：解剖体剪影（NIH VH 皮肤网格）/ 示意体（几何剪影）可切换
  // owner 2026-08-22：脏腑位可切换——解剖位(NIH 实测) / 教学位(左升右降示意)
  const [anatomicalNodes, setAnatomicalNodes] = useState(true);
  // 平移/缩放后可一键归位（平移会改变注视点，光靠视角按钮回不来）
  const [resetTick, setResetTick] = useState(0);
  // owner 2026-08-22：平移原先只绑右键，触控板上根本做不出来（双指=滚动→被当成缩放）。
  // 改为可切换左键拖动的行为；按住 Shift 亦临时切平移。
  const [dragMode, setDragMode] = useState<'rotate' | 'pan'>('rotate');
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

  // 左键（及单指触控）在旋转/平移之间切换
  const panning = dragMode === 'pan' || shiftHeld;
  useEffect(() => {
    const c = controlsRef.current;
    if (!c) return;
    c.mouseButtons.LEFT = panning ? THREE.MOUSE.PAN : THREE.MOUSE.ROTATE;
    c.touches.ONE = panning ? THREE.TOUCH.PAN : THREE.TOUCH.ROTATE;
  }, [panning, resetTick]);
  const nodes = anatomicalNodes ? ANATOMICAL_NODES : TEACHING_NODES;
  const flowPaths = useMemo(() => buildFlowPaths(nodes), [nodes]);
  const [visibleIds, setVisibleIds] = useState<Set<number>>(
    () => new Set(MERIDIAN_FLOW.map((m) => m.id))
  );
  const toggleVisible = (id: number) =>
    setVisibleIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const showGroup = (filter: 'all' | 'ascend' | 'descend' | 'yin' | 'yang' | 'hand' | 'foot') =>
    setVisibleIds(
      new Set(
        MERIDIAN_FLOW.filter((m) => {
          switch (filter) {
            case 'all': return true;
            case 'ascend': case 'descend': return m.direction === filter;
            case 'yin': return m.yin;
            case 'yang': return !m.yin;
            // 走法描述里手足互斥（自胸走手/从手走头 vs 从头走足/从足走胸腹）
            case 'hand': return m.path.includes('手');
            case 'foot': return m.path.includes('足');
          }
        }).map((m) => m.id)
      )
    );

  // 流注循环：肺→大肠→…→肝→肺（查看信息卡时暂停；跳过隐藏经）
  useEffect(() => {
    if (selected || selectedOrgan || visibleIds.size === 0) return;
    const timer = window.setInterval(() => {
      setActiveId((id) => {
        let next = id;
        for (let step = 1; step <= MERIDIAN_FLOW.length; step++) {
          next = (id + step) % MERIDIAN_FLOW.length;
          if (visibleIds.has(next)) return next;
        }
        return id;
      });
    }, FLOW_STEP_MS / speed);
    return () => window.clearInterval(timer);
  }, [selected, selectedOrgan, speed, visibleIds]);

  const pickMeridian = (m: Meridian) => {
    setSelected(m);
    setSelectedOrgan(null);
    setActiveId(m.id);
  };
  const pickOrgan = (organ: Organ) => {
    setSelectedOrgan(organ);
    setSelected(null);
  };

  const { camera, lights } = THREE_DEFAULTS;

  return (
    <div className="scene-root" style={{ width: '100vw', height: '100vh', background: BACKGROUND.gradient }}>
      {/* 渲染管线设置与轴轮场景一致（见项目备忘） */}
      <Canvas
        flat
        legacy
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.LinearSRGBColorSpace;
        }}
        camera={{ fov: camera.fov, near: camera.near, far: camera.far, position: CAMERA_VIEWS.front }}
        style={{ background: BACKGROUND.gradient }}
        onPointerMissed={() => {
          setSelected(null);
          setSelectedOrgan(null);
        }}
      >
        <ambientLight color={lights.ambient.color} intensity={lights.ambient.intensity} />
        <pointLight color={lights.center.color} intensity={lights.center.intensity} distance={lights.center.distance} decay={0} position={[0, 1, 3]} />
        <pointLight color={lights.top.color} intensity={lights.top.intensity} distance={lights.top.distance} decay={0} position={[0, 6, 2]} />
        <pointLight color={lights.bottom.color} intensity={lights.bottom.intensity} distance={lights.bottom.distance} decay={0} position={[0, -5, 2]} />

        {/* 人体：NIH 男体（owner 2026-08-25：五场景统一，与经穴图同一具）；
            示意体退场，仅作加载占位。剖面模式变透明以显露背面路径 */}
        <Suspense fallback={<BodyFigure opacity={seeThrough ? 0.12 : 0.5} />}>
          <BodyMesh opacity={seeThrough ? 0.1 : 0.45} />
        </Suspense>

        {/* 十二脏腑：固定解剖位节点（永不绕转） */}
        {ORGANS.map((organ) => {
          const meridianId = MERIDIAN_FLOW.find((m) => m.name === `${organ.name}经`)?.id ?? -1;
          return (
            <OrganNode key={organ.nameEn} organ={organ} position={nodes[organ.name]} active={meridianId === activeId} onSelect={pickOrgan} />
          );
        })}

        {/* 流注闭环 + 金色气血（受逐经显隐控制） */}
        <FlowRing paths={flowPaths} activeId={activeId} speed={speed} visibleIds={visibleIds} onSelect={pickMeridian} />

        <CameraRig view={view} resetTick={resetTick} controls={controlsRef} />
        {/* 拖动旋转 · 右键/双指平移 · 滚轮缩放；可凑近到手指/足趾细看 */}
        <OrbitControls
          ref={controlsRef}
          makeDefault
          enableDamping
          dampingFactor={THREE_DEFAULTS.orbitControls.dampingFactor}
          enablePan
          screenSpacePanning
          minDistance={0.8}
          maxDistance={22}
        />
      </Canvas>

      <TheaterControls
        view={view}
        onViewChange={setView}
        onResetView={() => setResetTick((t) => t + 1)}
        activeId={activeId}
        onPickMeridian={pickMeridian}
        selected={selected}
        selectedOrgan={selectedOrgan}
        onCloseCard={() => {
          setSelected(null);
          setSelectedOrgan(null);
        }}
        speed={speed}
        onSpeedChange={setSpeed}
        seeThrough={seeThrough}
        onSeeThroughToggle={() => setSeeThrough((v) => !v)}
        visibleIds={visibleIds}
        onToggleVisible={toggleVisible}
        onShowGroup={showGroup}
        dragMode={panning ? 'pan' : 'rotate'}
        onDragModeChange={setDragMode}
        anatomicalNodes={anatomicalNodes}
        onAnatomicalNodesToggle={() => setAnatomicalNodes((v) => !v)}
      />
    </div>
  );
}

export { organOfMeridian };
