import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { COLORS } from '@/styles/theme';
import { QiMotion, LOOP } from './qiMotion';

const PARTICLES_PER_TRACK = 40;
const BASE_SPEED = 0.09; // 每单位轴速下，每秒走完半环的比例

/**
 * 左升右降双螺旋轨道（2026-08-19 人体气机重构核心）：
 * - 左半环（绿）：肾/肝（左下）→ 心/肺（顶），主升，向前鼓弧
 * - 右半环（白）：心/肺（顶）→ 胃/肾（右下），主降，向后鼓弧
 * - 粒子沿轨道单向流动，速度 = 轴速 × 该侧流量（轴转则轮行）
 * - 复圆时整个椭圆闭环点亮（loopGlow）
 */

export function buildHalfCurve(
  side: 'left' | 'right',
  rx: number = LOOP.rx,
  ry: number = LOOP.ry,
  zBow: number = LOOP.zBow
): THREE.CatmullRomCurve3 {
  const pts: THREE.Vector3[] = [];
  const n = 32;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    // 左：底(-90°) 经 180°(左) 到 顶(90°)；右：顶(90°) 经 0°(右) 到 底(-90°)
    const angle = side === 'left' ? -Math.PI / 2 - t * Math.PI : Math.PI / 2 - t * Math.PI;
    const bow = side === 'left' ? zBow : -zBow;
    pts.push(
      new THREE.Vector3(
        Math.cos(angle) * rx,
        LOOP.centerY + Math.sin(angle) * ry,
        Math.sin(t * Math.PI) * bow
      )
    );
  }
  return new THREE.CatmullRomCurve3(pts);
}

function buildFullLoop(rx: number = LOOP.rx, ry: number = LOOP.ry): THREE.CatmullRomCurve3 {
  const pts: THREE.Vector3[] = [];
  const n = 64;
  for (let i = 0; i < n; i++) {
    const angle = (i / n) * Math.PI * 2;
    pts.push(
      new THREE.Vector3(
        Math.cos(angle) * rx,
        LOOP.centerY + Math.sin(angle) * ry,
        Math.sin(angle) * -0.15
      )
    );
  }
  return new THREE.CatmullRomCurve3(pts, true);
}

/** 单侧轨道：管道 + 方向锥 + 流动粒子 */
function Track({
  side,
  color,
  motion,
  starry = false,
  rx = LOOP.rx,
  ry = LOOP.ry,
  zBow = LOOP.zBow
}: {
  side: 'left' | 'right';
  color: number;
  motion: QiMotion;
  /** 星流风格：撤管道与方向锥，只以星点粒子成环（方剂详解页用） */
  starry?: boolean;
  rx?: number;
  ry?: number;
  zBow?: number;
}) {
  const curve = useMemo(() => buildHalfCurve(side, rx, ry, zBow), [side, rx, ry, zBow]);
  const count = starry ? 220 : PARTICLES_PER_TRACK;
  const pointsRef = useRef<THREE.Points>(null);
  const matRef = useRef<THREE.PointsMaterial>(null);
  const tubeMatRef = useRef<THREE.MeshPhongMaterial>(null);
  const phase = useRef(0);

  const positions = useMemo(() => new Float32Array(count * 3), [count]);
  // 星流螺旋（owner 2026-08-25：环上星点如中轴星流一样螺旋行进）：
  // 每颗星绕环管轴心公转——seeds=[初始相位, 螺旋半径]，正圆下管轴的
  // 法向即径向，副法向即 z 轴，无需逐帧取切线。
  const seeds = useMemo(() => {
    const j = new Float32Array(count * 2);
    for (let i = 0; i < count; i++) {
      j[i * 2] = Math.random() * Math.PI * 2;
      j[i * 2 + 1] = 0.05 + Math.random() * 0.09;
    }
    return j;
  }, [count]);
  const scratch = useMemo(() => new THREE.Vector3(), []);

  const cones = useMemo(
    () =>
      [0.3, 0.65].map((t) => {
        const point = curve.getPointAt(t);
        const tangent = curve.getTangentAt(t);
        const quaternion = new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          tangent
        );
        return { point, quaternion };
      }),
    [curve]
  );

  useFrame((_, delta) => {
    const flow = motion.axleSpeed.v * (side === 'left' ? motion.leftFlow.v : motion.rightFlow.v);
    // 星流环加速（owner 2026-08-25：小行星带要跑出与中轴星流同拍的动感）
    phase.current += Math.min(delta, 0.1) * BASE_SPEED * (starry ? 5.2 : 1) * flow;

    if (pointsRef.current) {
      const array = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        const t = (phase.current + i / count) % 1;
        curve.getPointAt(t, scratch);
        if (starry) {
          // 绕管轴心的螺旋相位：随流速转动（堵塞侧停旋）
          const ang = seeds[i * 2] + phase.current * 26;
          const hr = seeds[i * 2 + 1];
          const dx = scratch.x;
          const dy = scratch.y - LOOP.centerY;
          const dl = Math.hypot(dx, dy) || 1;
          array[i * 3] = scratch.x + Math.cos(ang) * hr * (dx / dl);
          array[i * 3 + 1] = scratch.y + Math.cos(ang) * hr * (dy / dl);
          array[i * 3 + 2] = scratch.z + Math.sin(ang) * hr;
        } else {
          array[i * 3] = scratch.x;
          array[i * 3 + 1] = scratch.y;
          array[i * 3 + 2] = scratch.z;
        }
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
    // 堵塞侧（flow≈0）轨道与粒子一起变暗
    const strength = Math.min(1, (side === 'left' ? motion.leftFlow.v : motion.rightFlow.v) + 0.1);
    if (matRef.current) matRef.current.opacity = 0.25 + 0.7 * strength;
    if (tubeMatRef.current) tubeMatRef.current.emissiveIntensity = 0.25 + 0.5 * strength;
  });

  return (
    <group>
      {!starry && <mesh>
        <tubeGeometry args={[curve, 48, 0.035, 8, false]} />
        <meshPhongMaterial
          ref={tubeMatRef}
          color={color}
          emissive={color}
          emissiveIntensity={0.6}
          transparent
          opacity={0.7}
        />
      </mesh>}
      {!starry && cones.map((cone, i) => (
        <mesh key={i} position={cone.point} quaternion={cone.quaternion}>
          <coneGeometry args={[0.1, 0.28, 10]} />
          <meshPhongMaterial color={color} emissive={color} emissiveIntensity={0.8} />
        </mesh>
      ))}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={matRef}
          color={color}
          size={starry ? 0.055 : 0.14}
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  );
}

export function QiLoop({
  motion,
  starry = false,
  rx = LOOP.rx,
  ry = LOOP.ry,
  zBow = LOOP.zBow
}: {
  motion: QiMotion;
  starry?: boolean;
  rx?: number;
  ry?: number;
  zBow?: number;
}) {
  const fullLoop = useMemo(() => buildFullLoop(rx, ry), [rx, ry]);
  const loopMatRef = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(() => {
    // 星流风格下复圆金环只作淡淡衬光，别盖过绿白星带
    if (loopMatRef.current) loopMatRef.current.opacity = (starry ? 0.18 : 0.55) * motion.loopGlow.v;
  });

  return (
    <group>
      {/* 复圆闭环光带（演示第三步点亮） */}
      <mesh>
        <tubeGeometry args={[fullLoop, 72, starry ? 0.028 : 0.055, 8, true]} />
        <meshBasicMaterial
          ref={loopMatRef}
          color={COLORS.earth.light}
          transparent
          opacity={0.14}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <Track side="left" color={COLORS.wood.three} motion={motion} starry={starry} rx={rx} ry={ry} zBow={zBow} />
      <Track side="right" color={COLORS.metal.secondaryThree} motion={motion} starry={starry} rx={rx} ry={ry} zBow={zBow} />
    </group>
  );
}
