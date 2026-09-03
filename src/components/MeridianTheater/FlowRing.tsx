import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { ThreeEvent, useFrame } from '@react-three/fiber';
import { Meridian, MERIDIAN_FLOW } from '@/data/meridians';
import { COLORS } from '@/styles/theme';
import { FlowPath } from './flowGeometry';

const GOLD_PER_PATH = 10;
const UP = new THREE.Vector3(0, 1, 0);

/**
 * 缩放联动（owner 2026-08-22）：管径、箭头、粒子按相机距离缩放，
 * 推近时不至于糊成一团，拉远时也不至于细到看不见。
 * 参考距离取默认机位 9.5；管径改几何要重建，故量化成档位，跨档才重建。
 */
const REF_DIST = 9.5;
const TUBE_R = 0.0123;
export function zoomFactor(dist: number): number {
  return Math.min(2.2, Math.max(0.45, dist / REF_DIST));
}
const bucket = (f: number) => Math.round(f * 4) / 4;

interface PathProps {
  path: FlowPath;
  active: boolean;
  /** 流速倍率（滑块 0.5–3x） */
  speed: number;
  onSelect: (meridian: Meridian) => void;
}

/**
 * 单条流注管道：半透明管 + 金色气血粒子 + 随流移动的方向浮标（箭头）。
 * 管道固定不动 —— 流动的只有粒子。
 */
function FlowTube({ path, active, speed, onSelect }: PathProps) {
  const tubeMatRef = useRef<THREE.MeshPhongMaterial>(null);
  const pointsRef = useRef<THREE.Points>(null);
  const pointsMatRef = useRef<THREE.PointsMaterial>(null);
  const buoyRef = useRef<THREE.Mesh>(null);
  // 相位按"经段"确定性播种（黄金比错开各段），镜像孪生同种同速——
  // 左右两侧的箭头浮标与粒子完全同步、镜像运动（owner 2026-08-20）
  const phase = useRef((path.id * 0.618 + (path.part === 'leg' ? 0.31 : 0)) % 1);
  const positions = useMemo(() => new Float32Array(GOLD_PER_PATH * 3), []);
  const scratch = useMemo(() => new THREE.Vector3(), []);
  const tangent = useMemo(() => new THREE.Vector3(), []);
  const quat = useMemo(() => new THREE.Quaternion(), []);

  const meridian = MERIDIAN_FLOW[path.id];
  // 管径按档位重建（每帧重建 TubeGeometry 太贵）；箭头与粒子每帧直接缩放
  const [tubeStep, setTubeStep] = useState(1);

  useFrame((state, delta) => {
    const f = zoomFactor(state.camera.position.distanceTo(state.controls
      ? (state.controls as unknown as { target: THREE.Vector3 }).target
      : new THREE.Vector3(0, 0.5, 0)));
    const b = bucket(f);
    if (b !== tubeStep) setTubeStep(b);
    if (buoyRef.current) buoyRef.current.scale.setScalar(f);
    if (pointsMatRef.current) pointsMatRef.current.size = (active ? 0.15 : 0.09) * f;
    phase.current += Math.min(delta, 0.1) * 0.16 * speed * (active ? 1.4 : 1);

    if (pointsRef.current) {
      const array = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < GOLD_PER_PATH; i++) {
        const t = (phase.current + i / GOLD_PER_PATH) % 1;
        path.curve.getPointAt(t, scratch);
        array[i * 3] = scratch.x;
        array[i * 3 + 1] = scratch.y;
        array[i * 3 + 2] = scratch.z;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
    // 方向浮标：像水流中的浮标一样随流移动并指向流向
    if (buoyRef.current) {
      const t = phase.current % 1;
      path.curve.getPointAt(t, scratch);
      path.curve.getTangentAt(t, tangent);
      buoyRef.current.position.copy(scratch);
      quat.setFromUnitVectors(UP, tangent);
      buoyRef.current.quaternion.copy(quat);
    }
    if (tubeMatRef.current) tubeMatRef.current.opacity = active ? 0.8 : 0.15;
    if (pointsMatRef.current) {
      pointsMatRef.current.opacity = active ? 1 : 0.4;
    }
  });

  return (
    <group>
      <mesh
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          onSelect(meridian);
        }}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default';
        }}
      >
        {/* owner 2026-08-22：管径 0.035 → 0.0245(−30%) → 0.0123(再 −50%)；
            拾取层仍保持 0.13，线再细也不影响点击命中 */}
        <tubeGeometry args={[path.curve, 64, TUBE_R * tubeStep, 8, false]} />
        <meshPhongMaterial
          ref={tubeMatRef}
          color={path.color}
          emissive={path.color}
          emissiveIntensity={0.5}
          transparent
          opacity={0.15}
        />
      </mesh>
      {/* 加宽的隐形拾取层 */}
      <mesh
        visible={false}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          onSelect(meridian);
        }}
      >
        <tubeGeometry args={[path.curve, 32, 0.13, 6, false]} />
        <meshBasicMaterial />
      </mesh>
      {/* 金色气血粒子（金色=气血，管色=经络归属） */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={pointsMatRef}
          color={COLORS.metal.primary}
          size={0.09}
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
      <mesh ref={buoyRef}>
        <coneGeometry args={[0.06, 0.18, 8]} />
        <meshPhongMaterial color={path.color} emissive={path.color} emissiveIntensity={0.9} />
      </mesh>
    </group>
  );
}

interface Props {
  /** 流注环（脏腑位可切换，故由场景构建后传入） */
  paths: FlowPath[];
  activeId: number;
  speed: number;
  /** 逐经显隐（owner 2026-08-20：右栏可勾选任意组合，含只看升/降） */
  visibleIds: ReadonlySet<number>;
  onSelect: (meridian: Meridian) => void;
}

/** 十二经流注闭环：肺→大肠→…→肝→肺，首尾相接（如环无端） */
export function FlowRing({ paths, activeId, speed, visibleIds, onSelect }: Props) {
  return (
    <group>
      {paths.filter((path) => visibleIds.has(path.id)).map((path) => (
        <FlowTube
          key={`${path.id}-${path.part}-${path.mirrored ? 'mirror' : 'base'}`}
          path={path}
          active={path.id === activeId}
          speed={speed}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}
