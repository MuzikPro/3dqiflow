import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Formula, FormulaDrug } from '@/data/formulas';
import { ORGANS } from '@/data/organs';
import { BACKGROUND, THREE_DEFAULTS, UI, RADIUS, SCENE_TEXT, COLORS } from '@/styles/theme';
import { panelStyle, toggleButtonStyle } from '../UI/panelStyle';
import { OrganMesh } from '../AxisWheel/OrganMesh';
import { AxisVortex } from '../AxisWheel/AxisVortex';
import { QiLoop } from '../AxisWheel/QiLoop';
import { CIRCLE_R, CLOCK_POS, EARTH_CENTER } from '../AxisWheel/clockLayout';
import { QiMotion, QiTargets, createQiMotion, targetsFor } from '../AxisWheel/qiMotion';
import { tr } from '@/i18n';

/**
 * 方义圆运动台（owner 2026-09-05）：把轴轮模型以合适的形与尺寸并入方剂详解。
 *
 * 旧 3D 方剂页撤下是因为「球环」与读方无关；这里反过来——方剂就是圆运动的
 * 修复方案，所以舞台就是轴轮本身：四正球 + 中土球 + 左升右降星流 + 中轴星流，
 * 每味药按其「作用」落到它所修的那一段——升者在左弧随左流上行，降者在右弧
 * 随右流下行，和中者绕中土转。选方即演一遍：先按方类呈现病态（轴坏／轮滞／
 * 轴轮俱病／枢机不利），君臣佐使依序就位，仪表回到常态——「复圆」。
 *
 * 一切来自数据：药的位置由 action 文本判读（缺判读回退 position.x 符号），
 * 病态由 category 决定，不另写脚本。
 */

type Zone = 'rise' | 'fall' | 'center';

/** 由作用文判读该药在圆上的位置——只读方向词，不碰功效主治 */
function zoneOf(d: FormulaDrug): Zone {
  const a = d.action ?? '';
  // 中土之工：凡补/温/健/理/建/守/和/居/运 + 中/脾，及中轴、中焦、调和诸药，皆绕中土
  if (/(补|温|健|理|建|守|和|居|运)(中|脾)|中轴|中焦|调和诸药/.test(a)) return 'center';
  const up = a.indexOf('升');
  const down = a.indexOf('降');
  if (up >= 0 && down < 0) return 'rise';
  if (down >= 0 && up < 0) return 'fall';
  if (up >= 0 && down >= 0) return up < down ? 'rise' : 'fall';
  const x = d.position?.[0] ?? 0;
  return x < -0.8 ? 'rise' : x > 0.8 ? 'fall' : 'center';
}

const ROLE_ORDER: Record<string, number> = { '君': 0, '臣': 1, '佐': 2, '佐使': 3, '使': 4 };
const ROLE_COLOR: Record<string, string> = {
  '君': COLORS.fire.primary, '臣': COLORS.water.primary, '佐': COLORS.wood.primary,
  '佐使': COLORS.wood.primary, '使': COLORS.earth.primary
};

/** 病态仪表：按方类（运轴／运轮／轴轮并运／运枢） */
function disturbedFor(category: Formula['category']): QiTargets {
  switch (category) {
    case 'yun_zhou': return targetsFor('zhouHuai');
    case 'yun_lun': return targetsFor('lunZhi');
    case 'zhou_lun_bing_yun':
      return { axleSpeed: 0.12, axleGlow: 0.2, leftFlow: 0.12, rightFlow: 1.4, loopGlow: 0.05 };
    case 'yun_shu':
      return { axleSpeed: 0.5, axleGlow: 0.6, leftFlow: 0.35, rightFlow: 0.35, loopGlow: 0.08 };
  }
}
const DISTURBED_LABEL: Record<Formula['category'], string> = {
  yun_zhou: '轴坏', yun_lun: '轮滞', zhou_lun_bing_yun: '轴轮俱病', yun_shu: '枢机不利'
};

/** 演出时间线（秒）：病态 → 君臣佐使依序就位 → 复圆 */
const T_FIRST = 1.4;   // 第一味药就位
const T_STEP = 0.55;   // 每味间隔
const T_TAIL = 0.6;    // 末味就位后到复圆

type Phase = 'disturbed' | 'restoring' | 'restored';

/** 共享时钟（可变引用，不触发重渲染） */
interface Clock { start: number; n: number }

function Director({ motion, targetsRef, clockRef, disturbed }: {
  motion: QiMotion; targetsRef: React.MutableRefObject<QiTargets>; clockRef: React.MutableRefObject<Clock>;
  disturbed: QiTargets;
}) {
  useFrame((state, delta) => {
    const c = clockRef.current;
    if (c.start < 0) c.start = state.clock.elapsedTime;
    const t = state.clock.elapsedTime - c.start;
    const tRestore = T_FIRST + (c.n - 1) * T_STEP + T_TAIL;
    targetsRef.current = t < tRestore ? disturbed : targetsFor('normal');
    const k = Math.min(1, delta * 2.2);
    const tg = targetsRef.current;
    motion.axleSpeed.v += (tg.axleSpeed - motion.axleSpeed.v) * k;
    motion.axleGlow.v += (tg.axleGlow - motion.axleGlow.v) * k;
    motion.leftFlow.v += (tg.leftFlow - motion.leftFlow.v) * k;
    motion.rightFlow.v += (tg.rightFlow - motion.rightFlow.v) * k;
    motion.loopGlow.v += (tg.loopGlow - motion.loopGlow.v) * k;
  });
  return null;
}

/** 一味药：按所修之段落在弧上，随该侧流量漂行；就位时弹出 */
function DrugMarker({ drug, zone, slot, slots, order, motion, clockRef }: {
  drug: FormulaDrug; zone: Zone; slot: number; slots: number; order: number;
  motion: QiMotion; clockRef: React.MutableRefObject<Clock>;
}) {
  const ref = useRef<THREE.Group>(null);
  const r = zone === 'center' ? 1.12 : CIRCLE_R + 0.62;
  // 左弧 130°–230°（经 180° 上行＝角度递减），右弧 -50°–50°（经 0° 下行＝角度递减）
  const span = zone === 'center' ? Math.PI * 2 : (100 * Math.PI) / 180;
  const base = zone === 'rise' ? (230 * Math.PI) / 180 : zone === 'fall' ? (50 * Math.PI) / 180 : 0;
  const angle = useRef(base - ((slot + 0.5) / slots) * span);
  const size = 0.13 + 0.11 * Math.min(1, drug.ratio ?? 0.6);

  useFrame((state, delta) => {
    if (!ref.current) return;
    const flow = zone === 'rise' ? motion.leftFlow.v : zone === 'fall' ? motion.rightFlow.v : motion.axleSpeed.v;
    const dir = -1; // 两弧皆为角度递减方向（见 QiLoop 半环参数）
    angle.current += dir * delta * 0.28 * flow;
    if (zone !== 'center') {
      const lo = base - span;
      if (angle.current < lo) angle.current = base;      // 走完本段回到段首，段内循环
    }
    const a = angle.current;
    ref.current.position.set(Math.cos(a) * r, 0.7 + Math.sin(a) * r, 0.15);
    // 就位弹出：君臣佐使依序
    const t = state.clock.elapsedTime - clockRef.current.start;
    const due = T_FIRST + order * T_STEP;
    const s = t < due ? 0 : Math.min(1, (t - due) / 0.35);
    const pop = s < 1 ? 1.35 - 0.35 * s : 1;
    ref.current.scale.setScalar(s * pop);
    ref.current.visible = s > 0.01;
  });

  return (
    <group ref={ref} visible={false}>
      <mesh>
        <sphereGeometry args={[size, 20, 20]} />
        <meshPhongMaterial color={drug.color} emissive={drug.color} emissiveIntensity={0.9} />
      </mesh>
      <mesh scale={1.5}>
        <sphereGeometry args={[size, 12, 12]} />
        <meshBasicMaterial color={drug.color} transparent opacity={0.12} side={THREE.BackSide} />
      </mesh>
      <Html center distanceFactor={8} position={[0, -(size + 0.28), 0]} style={{ pointerEvents: 'none' }}>
        <div style={{ whiteSpace: 'nowrap', textAlign: 'center', textShadow: '0 0 6px rgba(0,0,0,0.95)' }}>
          <span style={{ color: drug.colorHex, fontSize: '11px', fontWeight: 'bold' }}>{drug.name}</span>
          {drug.role && (
            <span style={{ marginLeft: '4px', fontSize: '8px', padding: '0 4px', borderRadius: '6px',
                           border: `1px solid ${ROLE_COLOR[drug.role] ?? UI.panelBorder}`,
                           color: ROLE_COLOR[drug.role] ?? SCENE_TEXT.muted }}>{tr(drug.role)}</span>
          )}
        </div>
      </Html>
    </group>
  );
}

export function FormulaWheel({ formula }: { formula: Formula }) {
  const [replay, setReplay] = useState(0);
  const [phase, setPhase] = useState<Phase>('disturbed');
  const motion = useMemo(createQiMotion, []);
  const targetsRef = useRef<QiTargets>(targetsFor('normal'));
  const clockRef = useRef<Clock>({ start: -1, n: 1 });

  // 药按君臣佐使排序；同段内分槽
  const placed = useMemo(() => {
    const sorted = [...formula.drugs].sort(
      (a, b) => (ROLE_ORDER[a.role ?? '使'] ?? 9) - (ROLE_ORDER[b.role ?? '使'] ?? 9)
    );
    const zones = sorted.map(zoneOf);
    const count: Record<Zone, number> = { rise: 0, fall: 0, center: 0 };
    const slotOf = zones.map((z) => count[z]++);
    return sorted.map((drug, i) => ({ drug, zone: zones[i], slot: slotOf[i], slots: count[zones[i]], order: i }));
  }, [formula]);

  // 选方或重播：重置时钟与相位字幕
  useEffect(() => {
    clockRef.current = { start: -1, n: placed.length };
    motion.axleSpeed.v = 0.8; motion.axleGlow.v = 1; motion.leftFlow.v = 1; motion.rightFlow.v = 1; motion.loopGlow.v = 0.25;
    setPhase('disturbed');
    const tRestore = T_FIRST + (placed.length - 1) * T_STEP + T_TAIL;
    const a = window.setTimeout(() => setPhase('restoring'), T_FIRST * 1000);
    const b = window.setTimeout(() => setPhase('restored'), tRestore * 1000 + 400);
    return () => { window.clearTimeout(a); window.clearTimeout(b); };
  }, [formula, replay, placed.length, motion]);

  const { camera, lights } = THREE_DEFAULTS;
  const disturbed = useMemo(() => disturbedFor(formula.category), [formula.category]);
  const phaseText =
    phase === 'disturbed' ? tr(DISTURBED_LABEL[formula.category])
    : phase === 'restoring' ? tr('君臣佐使就位')
    : tr('复圆');
  const phaseColor = phase === 'restored' ? COLORS.wood.primary : phase === 'restoring' ? UI.accent : COLORS.fire.primary;

  return (
    <div
      className="formula-wheel"
      style={{
        ...panelStyle,
        position: 'fixed', right: '20px', top: '134px', zIndex: 95, width: '330px',
        height: 'min(520px, calc(100vh - 160px))', borderRadius: RADIUS.md, padding: 0,
        overflow: 'hidden', display: 'flex', flexDirection: 'column'
      }}
    >
      <div style={{ flex: 1, minHeight: 0 }}>
        <Canvas
          flat
          legacy
          onCreated={({ gl }) => { gl.outputColorSpace = THREE.LinearSRGBColorSpace; }}
          camera={{ fov: camera.fov, near: camera.near, far: camera.far, position: [0, 0.7, 8.5] }}
          style={{ background: BACKGROUND.gradient }}
        >
          <ambientLight color={lights.ambient.color} intensity={lights.ambient.intensity} />
          <pointLight color={lights.center.color} intensity={lights.center.intensity} distance={lights.center.distance} decay={0} position={[0, 0.7, 3]} />
          <pointLight color={lights.top.color} intensity={lights.top.intensity} distance={lights.top.distance} decay={0} position={[0, 5, 2]} />
          <pointLight color={lights.bottom.color} intensity={lights.bottom.intensity} distance={lights.bottom.distance} decay={0} position={[0, -4, 2]} />

          <Director motion={motion} targetsRef={targetsRef} clockRef={clockRef} disturbed={disturbed} />

          <group position={[0, 0.7, 0]}>
            <AxisVortex height={3.6} radius={0.36} speedRef={motion.axleSpeed} />
          </group>
          <OrganMesh organ={EARTH_CENTER} highlight="normal" seasonEmphasis={null} onSelect={() => {}} visible compactLabel />
          <QiLoop motion={motion} starry rx={CIRCLE_R} ry={CIRCLE_R} zBow={0} />
          {ORGANS.filter((o) => ['心', '肝', '肺', '肾'].includes(o.name)).map((organ) => (
            <OrganMesh
              key={organ.nameEn}
              organ={{ ...organ, position: CLOCK_POS[organ.name] }}
              highlight="normal" seasonEmphasis={null} onSelect={() => {}} visible compactLabel
              labelBelow={organ.name === '肾'}
            />
          ))}
          {placed.map((p) => (
            <DrugMarker key={`${formula.name}-${p.drug.name}-${replay}`} {...p} motion={motion} clockRef={clockRef} />
          ))}
        </Canvas>
      </div>

      {/* 相位字幕 + 重播：舞台之下两行，不压画面 */}
      <div style={{ padding: '7px 12px 8px', borderTop: `1px solid ${UI.panelBorder}`, fontSize: '11px' }}>
        <div style={{ color: UI.textMuted, fontSize: '10px', letterSpacing: '1px', marginBottom: '3px' }}>
          {tr('方义圆运动')} · {formula.categoryLabel}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: phaseColor, fontWeight: 'bold', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {phaseText}
          </span>
          <button style={{ ...toggleButtonStyle(false), fontSize: '10px', padding: '2px 8px' }}
                  onClick={() => setReplay((v) => v + 1)} title={tr('重播')}>
            ↻ {tr('重播')}
          </button>
        </div>
      </div>
    </div>
  );
}
