import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Formula, FormulaDrug } from '@/data/formulas';
import { UI, SCENE_TEXT, COLORS } from '@/styles/theme';
import { CIRCLE_R } from '../AxisWheel/clockLayout';
import { QiMotion, QiTargets, targetsFor } from '../AxisWheel/qiMotion';
import { tr } from '@/i18n';

/**
 * 方剂上轮（owner 2026-09-05）：任一轴轮舞台都能演的「方剂修圆」——
 * 方剂详解的侧台与轴轮模型全图共用此件。
 *
 * 每味药按其「作用」落到所修之段：升者在左弧随左流上行，降者在右弧随右流
 * 下行，和中者绕中土转。选方即演：先按方类呈现病态（轴坏／轮滞／轴轮俱病／
 * 枢机不利），君臣佐使依序就位，仪表回常——「复圆」。
 * 位置只读方向词（升／降／中），不碰功效主治；病态由 category 决定。
 */

export type Phase = 'disturbed' | 'restoring' | 'restored';
type Zone = 'rise' | 'fall' | 'center';

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
export const DISTURBED_LABEL: Record<Formula['category'], string> = {
  yun_zhou: '轴坏', yun_lun: '轮滞', zhou_lun_bing_yun: '轴轮俱病', yun_shu: '枢机不利'
};
export function phaseText(formula: Formula, phase: Phase): string {
  return phase === 'disturbed' ? tr(DISTURBED_LABEL[formula.category])
    : phase === 'restoring' ? tr('君臣佐使就位') : tr('复圆');
}
export function phaseColor(phase: Phase): string {
  return phase === 'restored' ? COLORS.wood.primary : phase === 'restoring' ? UI.accent : COLORS.fire.primary;
}

/** 演出时间线（秒）：病态 → 君臣佐使依序就位 → 复圆 */
const T_FIRST = 1.4;
const T_STEP = 0.55;
const T_TAIL = 0.6;
const restoreAt = (n: number) => T_FIRST + (n - 1) * T_STEP + T_TAIL;

interface Clock { start: number; n: number }

/** 每帧写目标；无外部仪表插值器时自己插值 */
function Director({ motion, targetsRef, own, clockRef, disturbed }: {
  motion: QiMotion; targetsRef: React.MutableRefObject<QiTargets>; own: boolean;
  clockRef: React.MutableRefObject<Clock>; disturbed: QiTargets;
}) {
  useFrame((state, delta) => {
    const c = clockRef.current;
    if (c.start < 0) c.start = state.clock.elapsedTime;
    const t = state.clock.elapsedTime - c.start;
    targetsRef.current = t < restoreAt(c.n) ? disturbed : targetsFor('normal');
    if (!own) return;
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

/** 一味药：落在所修之段，随该侧流量漂行；就位时弹出 */
function DrugMarker({ drug, zone, slot, slots, order, motion, clockRef, labelDistance }: {
  drug: FormulaDrug; zone: Zone; slot: number; slots: number; order: number;
  motion: QiMotion; clockRef: React.MutableRefObject<Clock>; labelDistance: number;
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
    angle.current -= delta * 0.28 * flow;
    if (zone !== 'center' && angle.current < base - span) angle.current = base;
    const a = angle.current;
    ref.current.position.set(Math.cos(a) * r, 0.7 + Math.sin(a) * r, 0.15);
    const t = state.clock.elapsedTime - clockRef.current.start;
    const due = T_FIRST + order * T_STEP;
    const s = t < due ? 0 : Math.min(1, (t - due) / 0.35);
    ref.current.scale.setScalar(s * (s < 1 ? 1.35 - 0.35 * s : 1));
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
      <Html center distanceFactor={labelDistance} position={[0, -(size + 0.28), 0]} style={{ pointerEvents: 'none' }}>
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

export function FormulaPlay({ formula, motion, targetsRef, replayKey = 0, labelDistance = 8, onPhase }: {
  formula: Formula;
  motion: QiMotion;
  /** 宿主已有仪表插值器（轴轮模型）时传入其目标引用，本件只写目标不插值 */
  targetsRef?: React.MutableRefObject<QiTargets>;
  replayKey?: number;
  labelDistance?: number;
  onPhase?: (phase: Phase) => void;
}) {
  const ownTargets = useRef<QiTargets>(targetsFor('normal'));
  const clockRef = useRef<Clock>({ start: -1, n: 1 });

  const placed = useMemo(() => {
    const sorted = [...formula.drugs].sort(
      (a, b) => (ROLE_ORDER[a.role ?? '使'] ?? 9) - (ROLE_ORDER[b.role ?? '使'] ?? 9)
    );
    const zones = sorted.map(zoneOf);
    const count: Record<Zone, number> = { rise: 0, fall: 0, center: 0 };
    const slotOf = zones.map((z) => count[z]++);
    return sorted.map((drug, i) => ({ drug, zone: zones[i], slot: slotOf[i], slots: count[zones[i]], order: i }));
  }, [formula]);

  useEffect(() => {
    clockRef.current = { start: -1, n: placed.length };
    onPhase?.('disturbed');
    const a = window.setTimeout(() => onPhase?.('restoring'), T_FIRST * 1000);
    const b = window.setTimeout(() => onPhase?.('restored'), restoreAt(placed.length) * 1000 + 400);
    return () => { window.clearTimeout(a); window.clearTimeout(b); };
  }, [formula, replayKey, placed.length, onPhase]);

  const disturbed = useMemo(() => disturbedFor(formula.category), [formula.category]);

  return (
    <>
      <Director motion={motion} targetsRef={targetsRef ?? ownTargets} own={!targetsRef} clockRef={clockRef} disturbed={disturbed} />
      {placed.map((p) => (
        <DrugMarker key={`${formula.name}-${p.drug.name}-${replayKey}`} {...p} motion={motion} clockRef={clockRef} labelDistance={labelDistance} />
      ))}
    </>
  );
}
