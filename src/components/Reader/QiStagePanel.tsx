import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { QiState } from '@/data/articles';
import { ORGANS, Organ } from '@/data/organs';
import { BACKGROUND, THREE_DEFAULTS, UI, RADIUS, COLORS } from '@/styles/theme';
import { panelStyle } from '../UI/panelStyle';
import { QiLoop, buildHalfCurve } from '../AxisWheel/QiLoop';
import { AxisVortex } from '../AxisWheel/AxisVortex';
import { OrganMesh } from '../AxisWheel/OrganMesh';
import { CIRCLE_R, CLOCK_POS, EARTH_CENTER } from '../AxisWheel/clockLayout';
import { createQiMotion, QiMotion, LOOP } from '../AxisWheel/qiMotion';

/** 病机状态 → 气机仪表盘目标值（文字驱动3D的映射规则，脚本F） */
function targetsFrom(state: QiState | null) {
  const t = { axleSpeed: 0.8, axleGlow: 1, leftFlow: 1, rightFlow: 1, loopGlow: 0.25 };
  if (!state) return t;

  // ascend/descend＝欲解自复：受累轨道反而增速，轴明亮 —— 圆运动自复之象
  if (state.direction === 'ascend' || state.direction === 'descend') {
    if (state.affectedTrack === 'left' || state.affectedTrack === 'both') t.leftFlow = 1.6;
    if (state.affectedTrack === 'right' || state.affectedTrack === 'both') t.rightFlow = 1.6;
    if (state.affectedTrack === 'center') {
      t.axleSpeed = 1.3;
      t.axleGlow = 1.2;
    }
    t.loopGlow = 0.4;
    return t;
  }

  const hit = 0.12 - (state.direction === 'reversed' ? 0.05 : 0);
  if (state.affectedTrack === 'left' || state.affectedTrack === 'both') t.leftFlow = hit;
  if (state.affectedTrack === 'right' || state.affectedTrack === 'both') t.rightFlow = hit;
  if (state.affectedTrack === 'center') {
    t.axleSpeed = 0.08;
    t.axleGlow = 0.2;
  }
  // 严重程度 → 中轴受累
  t.axleSpeed = Math.min(t.axleSpeed, 0.9 - state.severity * 0.22);
  t.axleGlow = Math.min(t.axleGlow, 1.05 - state.severity * 0.25);
  t.loopGlow = state.direction === 'reversed' ? 0.04 : 0.12;
  return t;
}

/** 病机一句话（写在台上，3D 不再哑巴）：左升受阻·重2/3 这样的话 */
export function qiStatePhrase(state: QiState | null): string | null {
  if (!state) return null;
  const track = { left: '左升', right: '右降', center: '中轴', both: '左右两路' }[state.affectedTrack];
  const dir = {
    stagnant: '受阻', reversed: '逆乱', ascend: '升发欲解', descend: '降复欲解'
  }[state.direction];
  return `${track}${dir} · ${state.severity}/3`;
}

function Lerper({ motion, state }: { motion: QiMotion; state: QiState | null }) {
  const targetRef = useRef(targetsFrom(state));
  targetRef.current = targetsFrom(state);
  useFrame((_, delta) => {
    const k = Math.min(1, delta * 3);
    const t = targetRef.current;
    motion.axleSpeed.v += (t.axleSpeed - motion.axleSpeed.v) * k;
    motion.axleGlow.v += (t.axleGlow - motion.axleGlow.v) * k;
    motion.leftFlow.v += (t.leftFlow - motion.leftFlow.v) * k;
    motion.rightFlow.v += (t.rightFlow - motion.rightFlow.v) * k;
    motion.loopGlow.v += (t.loopGlow - motion.loopGlow.v) * k;
  });
  return null;
}

/** 圆上某段角度的弧（用于上热/下寒着色带），角度按数学习惯（3点=0°，逆时针增） */
function arcCurve(a0: number, a1: number): THREE.CatmullRomCurve3 {
  const pts: THREE.Vector3[] = [];
  const n = 16;
  for (let i = 0; i <= n; i++) {
    const a = a0 + ((a1 - a0) * i) / n;
    pts.push(new THREE.Vector3(Math.cos(a) * CIRCLE_R, LOOP.centerY + Math.sin(a) * CIRCLE_R, 0.05));
  }
  return new THREE.CatmullRomCurve3(pts);
}

/**
 * 病灶标记：受累半环上一条脉动红弧（stagnant/reversed），
 * 欲解则换成金色明弧；中轴受累时红晕落在脾胃球上。
 * 「看得见的病位」——只靠流速差异用户读不出病在哪，这条弧才是主角。
 */
function AffectedMark({ state }: { state: QiState | null }) {
  const leftMat = useRef<THREE.MeshBasicMaterial>(null);
  const rightMat = useRef<THREE.MeshBasicMaterial>(null);
  const centerMat = useRef<THREE.MeshBasicMaterial>(null);
  const leftCurve = useMemo(() => buildHalfCurve('left', CIRCLE_R, CIRCLE_R, 0), []);
  const rightCurve = useMemo(() => buildHalfCurve('right', CIRCLE_R, CIRCLE_R, 0), []);

  const recovering = state?.direction === 'ascend' || state?.direction === 'descend';
  const color = recovering ? COLORS.earth.three : COLORS.fire.three;

  useFrame(({ clock }) => {
    const pulse = 0.25 + 0.2 * Math.sin(clock.elapsedTime * (recovering ? 2 : 5));
    const on = (hit: boolean) => (hit ? pulse : 0);
    if (leftMat.current)
      leftMat.current.opacity = on(state?.affectedTrack === 'left' || state?.affectedTrack === 'both');
    if (rightMat.current)
      rightMat.current.opacity = on(state?.affectedTrack === 'right' || state?.affectedTrack === 'both');
    if (centerMat.current)
      centerMat.current.opacity = (state?.affectedTrack === 'center' ? pulse * 1.4 : 0);
  });

  return (
    <group>
      <mesh>
        <tubeGeometry args={[leftCurve, 32, 0.09, 8, false]} />
        <meshBasicMaterial ref={leftMat} color={color} transparent opacity={0}
                           blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh>
        <tubeGeometry args={[rightCurve, 32, 0.09, 8, false]} />
        <meshBasicMaterial ref={rightMat} color={color} transparent opacity={0}
                           blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <mesh position={[0, LOOP.centerY, 0.4]}>
        <sphereGeometry args={[0.75, 20, 20]} />
        <meshBasicMaterial ref={centerMat} color={color} transparent opacity={0}
                           blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}

interface Props {
  state: QiState | null;
  /** 卡片标题行（当前条文显示编号） */
  label: string | null;
  /** 少阴证：命门根本受损——肾位红晕 + 中土黯淡（太阴 vs 少阴之3D鉴别） */
  ministerBroken?: boolean;
  /** 上热下寒（厥阴等）：圆顶弧红、圆底弧蓝，冰火分界 */
  heatCold?: boolean;
}

/** 条文阅读页右栏：实时响应当前条文病机的迷你圆运动舞台（星流正圆语言，owner 2026-08-26） */
export function QiStagePanel({ state, label, ministerBroken = false, heatCold = false }: Props) {
  const motion = useMemo(createQiMotion, []);
  const { camera, lights } = THREE_DEFAULTS;
  const four = useMemo(
    () => ORGANS.filter((o: Organ) => ['心', '肝', '肺', '肾'].includes(o.name)), []
  );
  const noop = () => undefined;
  const topArc = useMemo(() => arcCurve(Math.PI * 0.25, Math.PI * 0.75), []);
  const bottomArc = useMemo(() => arcCurve(-Math.PI * 0.75, -Math.PI * 0.25), []);
  const phrase = qiStatePhrase(state);

  return (
    <div
      style={{
        ...panelStyle,
        borderRadius: RADIUS.md,
        overflow: 'hidden',
        height: '46vh',
        position: 'relative'
      }}
    >
      <Canvas
        flat
        legacy
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.LinearSRGBColorSpace;
        }}
        camera={{ fov: camera.fov, near: camera.near, far: camera.far, position: [0, 0, 7.5] }}
        style={{ background: BACKGROUND.gradient }}
      >
        <ambientLight color={lights.ambient.color} intensity={lights.ambient.intensity} />
        <pointLight color={lights.center.color} intensity={lights.center.intensity} distance={lights.center.distance} decay={0} position={[0, 0.7, 3]} />
        <Lerper motion={motion} state={state} />

        {/* 整台下移 centerY：默认相机盯着原点，圆心得落到原点才真居中 */}
        <group position={[0, -LOOP.centerY, 0]}>
        {/* 星流正圆 + 中轴星流 + 四正与脾胃球（与轴轮/方剂同一套语言） */}
        <QiLoop motion={motion} starry rx={CIRCLE_R} ry={CIRCLE_R} zBow={0} />
        <group position={[0, LOOP.centerY, 0]}>
          <AxisVortex height={3.4} radius={0.36} speedRef={motion.axleSpeed} />
        </group>
        {four.map((organ) => (
          <OrganMesh
            key={organ.nameEn}
            organ={CLOCK_POS[organ.name] ? { ...organ, position: CLOCK_POS[organ.name] } : organ}
            highlight="normal"
            seasonEmphasis={null}
            onSelect={noop}
            visible
            compactLabel
            labelBelow={organ.name === '肾'}
          />
        ))}
        <OrganMesh organ={EARTH_CENTER} highlight="normal" seasonEmphasis={null} onSelect={noop} visible compactLabel />

        {/* 病位标记：受累弧红脉动 / 欲解金弧 / 中轴红晕 */}
        <AffectedMark state={state} />

        {/* 少阴命门伤：肾位（6点）红晕常亮 */}
        {ministerBroken && (
          <mesh position={CLOCK_POS['肾']}>
            <sphereGeometry args={[0.62, 20, 20]} />
            <meshBasicMaterial color={COLORS.fire.three} transparent opacity={0.22}
                               blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
        )}

        {/* 上热下寒：顶弧红、底弧蓝 */}
        {heatCold && (
          <group>
            <mesh>
              <tubeGeometry args={[topArc, 24, 0.12, 8, false]} />
              <meshBasicMaterial color={COLORS.fire.three} transparent opacity={0.35}
                                 blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>
            <mesh>
              <tubeGeometry args={[bottomArc, 24, 0.12, 8, false]} />
              <meshBasicMaterial color={COLORS.water.three} transparent opacity={0.4}
                                 blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>
          </group>
        )}
        </group>
      </Canvas>
      <div
        style={{
          position: 'absolute', top: '8px', left: '12px',
          fontSize: '11px', color: UI.textMuted, pointerEvents: 'none'
        }}
      >
        {label ? `${label} · 圆运动实时病机` : '圆运动实时病机'}
      </div>
      {/* 台上的话：这一条病在哪、多重——3D 不再哑巴 */}
      {(phrase || ministerBroken || heatCold) && (
        <div
          style={{
            position: 'absolute', bottom: '8px', left: '12px', right: '12px',
            fontSize: '12px', color: UI.textPrimary, pointerEvents: 'none',
            textShadow: '0 0 6px rgba(0,0,0,0.9)'
          }}
        >
          {phrase && <span style={{ color: UI.accent, fontWeight: 'bold' }}>{phrase}</span>}
          {ministerBroken && <span style={{ color: COLORS.fire.primary, marginLeft: '8px' }}>命门根本受损</span>}
          {heatCold && <span style={{ color: COLORS.water.primary, marginLeft: '8px' }}>上热下寒</span>}
        </div>
      )}
    </div>
  );
}
