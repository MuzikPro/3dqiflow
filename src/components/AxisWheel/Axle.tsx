import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { COLORS } from '@/styles/theme';
import { QiMotion } from './qiMotion';
import { AxisVortex } from './AxisVortex';

const AXLE_GRAY = new THREE.Color(0x555555);
const AXLE_GOLD = new THREE.Color(COLORS.earth.three);

/**
 * 中轴（脾胃土·"轴"）——2026-08-19 人体气机重构：
 * 垂直旋转圆柱，呼吸式脉动发光（中气斡旋）；轴坏时停转并变灰。
 */
export function Axle({ motion }: { motion: QiMotion }) {
  const groupRef = useRef<THREE.Group>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * motion.axleSpeed.v;
    }
    if (matRef.current) {
      const glow = motion.axleGlow.v;
      // 呼吸脉动：亮度随时间起伏，轴坏（glow≈0）时几乎熄灭
      matRef.current.emissiveIntensity = glow * (0.45 + 0.25 * Math.sin(t * 2));
      // 轴坏时颜色向灰暗过渡
      matRef.current.color.copy(AXLE_GRAY).lerp(AXLE_GOLD, Math.min(1, glow));
    }
  });

  return (
    <group position={[0, 0.7, 0]}>
      <group ref={groupRef}>
        <mesh>
          <cylinderGeometry args={[0.3, 0.3, 4.2, 32]} />
          <meshStandardMaterial
            ref={matRef}
            color={COLORS.earth.three}
            emissive={COLORS.earth.three}
            emissiveIntensity={0.5}
            metalness={0.4}
            roughness={0.3}
          />
        </mesh>
        {/* 轴面刻线：让旋转肉眼可见 */}
        <mesh position={[0.3, 0, 0]}>
          <boxGeometry args={[0.03, 4.2, 0.1]} />
          <meshBasicMaterial color={COLORS.earth.secondary} transparent opacity={0.8} />
        </mesh>
      </group>
      <AxisVortex height={4.2} radius={0.42} speedRef={motion.axleSpeed} />
    </group>
  );
}
