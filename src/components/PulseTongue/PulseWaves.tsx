import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { PulseType, PulseWaveVisual } from '@/data/pulses';
import { COLORS } from '@/styles/theme';
import { buildHalfCurve } from '../AxisWheel/QiLoop';

const POINTS = 72;

/** v3 交付 waveShape：sharp_peak=锯齿（弦）、round_peak=圆峰（滑）、narrow=窄尖（细） */
function waveShape(x: number, shape?: string, sawtoothFallback?: boolean): number {
  const f = x - Math.floor(x);
  if (shape === 'sharp_peak' || (!shape && sawtoothFallback)) return 2 * Math.abs(2 * f - 1) - 1;
  const s = Math.sin(x * Math.PI * 2);
  if (shape === 'round_peak') return Math.sign(s) * Math.pow(Math.abs(s), 0.55);
  if (shape === 'narrow') return Math.sign(s) * Math.pow(Math.abs(s), 3);
  return s;
}

/**
 * 单侧脉象波形：沿升/降轨道传播（规格书：左"蛇爬树"向上，右"瀑布"向下）。
 * v3 visual3D 逐字段照搬：amplitude/frequency/color/opacity/waveShape/outwardPush。
 * 位（浮中沉）仍由 pulse.position 给前后深度。
 */
function PulseWaveLine({ side, pulse }: { side: 'left' | 'right'; pulse: PulseType }) {
  const curve = useMemo(() => buildHalfCurve(side), [side]);
  const scratch = useMemo(() => new THREE.Vector3(), []);
  const vw: PulseWaveVisual | undefined =
    pulse.visual3D && (side === 'left' ? pulse.visual3D.leftWave : pulse.visual3D.rightWave);

  const object = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(POINTS * 3), 3));
    const material = new THREE.LineBasicMaterial({
      color: vw ? vw.color : side === 'left' ? COLORS.wood.primary : COLORS.metal.secondary,
      transparent: true,
      opacity: vw ? vw.opacity : 0.8
    });
    return new THREE.Line(geometry, material);
  }, [side, vw]);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    const geometry = object.geometry;
    const array = geometry.attributes.position.array as Float32Array;
    // 传播方向：左轨自下而上（t 增），右轨自上而下（曲线本身即顶→底）
    const zBase = pulse.position === 'float' ? 0.55 : pulse.position === 'deep' ? -0.55 : 0;
    const amp = (vw ? vw.amplitude : pulse.amplitude / 0.5) * 0.28;
    const freq = (vw ? vw.frequency : pulse.frequency / 3) * 1.05;
    // 浮脉 outwardPush：整条波推离体表（向外 = 左侧 -x / 右侧 +x）
    const push = vw?.outwardPush ? 0.35 : 0;
    for (let i = 0; i < POINTS; i++) {
      const t = i / (POINTS - 1);
      curve.getPointAt(t, scratch);
      const phase = t * 4 - time * freq;
      const wave = waveShape(phase, vw?.waveShape, pulse.sawtooth) * amp;
      const out = side === 'left' ? -1 : 1;
      array[i * 3] = scratch.x + wave * out + push * out;
      array[i * 3 + 1] = scratch.y;
      array[i * 3 + 2] = scratch.z + zBase;
    }
    geometry.attributes.position.needsUpdate = true;
    const material = object.material as THREE.LineBasicMaterial;
    material.opacity = vw ? vw.opacity : 0.25 + 0.65 * pulse.strength;
  });

  return <primitive object={object} />;
}

/**
 * 中轴（v3 centerAxis 逐字段照搬）：星流柱，转速/色/辉光/稳定性/倾斜/
 * 震颤（弦）/冷热感（迟数）/细瘦（细）全部由交付参数驱动。
 */
const AXIS_N = 160;
function PulseAxis({ pulse }: { pulse: PulseType }) {
  const ax = pulse.visual3D?.centerAxis;
  const groupRef = useRef<THREE.Group>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const phase = useRef(0);
  const height = 3.6;
  const seeds = useMemo(() => {
    const j = new Float32Array(AXIS_N * 3);
    for (let i = 0; i < AXIS_N; i++) {
      j[i * 3] = Math.random() * Math.PI * 2;
      j[i * 3 + 1] = 0.5 + Math.random() * 0.5;
      j[i * 3 + 2] = Math.random() * height;
    }
    return j;
  }, []);
  const buf = useMemo(() => new Float32Array(AXIS_N * 3), []);

  useFrame((state, delta) => {
    if (!ax) return;
    const t = state.clock.elapsedTime;
    phase.current += Math.min(delta, 0.1) * ax.rotationSpeed;
    const radius = 0.34 * (ax.thinEffect ? 0.45 : 1);
    if (pointsRef.current) {
      const array = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < AXIS_N; i++) {
        const a = seeds[i * 3] + phase.current * 1.5;
        const r = seeds[i * 3 + 1] * radius;
        const h = (seeds[i * 3 + 2] + phase.current * 0.5) % height;
        array[i * 3] = Math.cos(a) * r;
        array[i * 3 + 1] = h - height / 2;
        array[i * 3 + 2] = Math.sin(a) * r;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
      const material = pointsRef.current.material as THREE.PointsMaterial;
      // 冷感沉暗、热感搏动（迟/数），辉光取 glow
      const beat = ax.heatEffect ? 0.15 * Math.sin(t * 6) : 0;
      material.opacity = Math.min(1, 0.25 + ax.glow * 0.75 + beat) * (ax.coldEffect ? 0.75 : 1);
    }
    if (groupRef.current) {
      // 不稳=轻晃；弦=高频震颤；tilt=向左/右倾
      const wobble = ax.stable ? 0 : Math.sin(t * 1.7) * 0.05;
      const vib = ax.vibration ? Math.sin(t * (ax.vibrationFreq ?? 3) * Math.PI * 2) * 0.035 : 0;
      const tilt = ax.tilt === 'left_heavy' ? -0.08 : ax.tilt === 'right_heavy' ? 0.08 : 0;
      groupRef.current.rotation.z = wobble + tilt;
      groupRef.current.position.x = vib;
    }
  });

  if (!ax) return null;
  return (
    <group ref={groupRef} position={[0, 0.7, 0]}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[buf, 3]} />
        </bufferGeometry>
        <pointsMaterial color={ax.color} size={0.05} transparent opacity={0.6}
                        blending={THREE.AdditiveBlending} sizeAttenuation depthWrite={false} />
      </points>
    </group>
  );
}

/**
 * 人体气息环（v3 humanSilhouette 逐字段照搬）：躯干一圈呼吸光环，
 * color/opacity 取交付值；pulseWave 定向——outward 外扩（浮·表）、
 * inward 内收（沉·里）、fast_hot 快而红、slow_cold 慢、tense_string 绷紧
 * 微颤、smooth_ball 圆匀、thin_weak 细弱、gentle 从容。
 */
function SilhouetteAura({ pulse }: { pulse: PulseType }) {
  const hs = pulse.visual3D?.humanSilhouette;
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!hs || !matRef.current || !meshRef.current) return;
    const t = state.clock.elapsedTime;
    const speed = hs.pulseWave === 'fast_hot' ? 3 : hs.pulseWave === 'slow_cold' ? 0.5
      : hs.pulseWave === 'tense_string' ? 2.2 : 1;
    const cyc = (t * speed) % 1;
    let scale = 1;
    let fade = 1;
    if (hs.pulseWave === 'inward') { scale = 1.18 - 0.18 * cyc; fade = cyc; }
    else if (hs.pulseWave === 'thin_weak') { scale = 1 + 0.03 * Math.sin(t * 2); fade = 0.5; }
    else if (hs.pulseWave === 'tense_string') { scale = 1.02 + 0.01 * Math.sin(t * 14); fade = 0.9; }
    else if (hs.pulseWave === 'smooth_ball') { scale = 1 + 0.08 * (0.5 + 0.5 * Math.sin(t * speed * Math.PI)); fade = 0.8; }
    else { scale = 1 + 0.18 * cyc; fade = 1 - cyc; } // outward / gentle / fast_hot / slow_cold
    meshRef.current.scale.setScalar(scale);
    matRef.current.opacity = hs.opacity * 0.55 * fade;
  });

  if (!hs) return null;
  return (
    <mesh ref={meshRef} position={[0, 0.7, 0]}>
      <torusGeometry args={[1.35, 0.035, 8, 64]} />
      <meshBasicMaterial ref={matRef} color={hs.color} transparent opacity={0}
                         blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );
}

interface Props {
  /** 左右两轨的脉象（对比模式下左=平脉、右=所选脉） */
  left: PulseType;
  right: PulseType;
}

export function PulseWaves({ left, right }: Props) {
  return (
    <group>
      <PulseWaveLine side="left" pulse={left} />
      <PulseWaveLine side="right" pulse={right} />
      <PulseAxis pulse={right} />
      <SilhouetteAura pulse={right} />
    </group>
  );
}
