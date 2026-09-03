import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { COLORS } from '@/styles/theme';

const COUNT = 300;

interface Props {
  /** 漩涡总高度（居中于所在 group 原点） */
  height?: number;
  /** 漩涡半径 */
  radius?: number;
  /** 转速引用：轴速驱动漩涡（轴停则漩涡停） */
  speedRef?: { v: number };
}

/**
 * 中轴漩涡粒子（审查修正 B1 / 人体气机重构）：
 * 土金色粒子绕中轴螺旋上升，速度跟随轴速。
 */
export function AxisVortex({ height = 7.5, radius = 0.95, speedRef }: Props) {
  const pointsRef = useRef<THREE.Points>(null);
  const phase = useRef(0);

  const { positions, seeds } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3);
    const seeds = new Float32Array(COUNT * 3); // [初始角, 半径比例, 初始高度]
    for (let i = 0; i < COUNT; i++) {
      seeds[i * 3] = Math.random() * Math.PI * 2;
      seeds[i * 3 + 1] = 0.55 + Math.random() * 0.45;
      seeds[i * 3 + 2] = Math.random() * height;
    }
    return { positions, seeds };
  }, [height]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const speed = speedRef ? speedRef.v : 1;
    phase.current += Math.min(delta, 0.1) * speed;
    const t = phase.current;
    const array = pointsRef.current.geometry.attributes.position.array as Float32Array;

    for (let i = 0; i < COUNT; i++) {
      const angle = seeds[i * 3] + t * 1.5;
      const r = seeds[i * 3 + 1] * radius;
      const h = (seeds[i * 3 + 2] + t * 0.6) % height;
      array[i * 3] = Math.cos(angle) * r;
      array[i * 3 + 1] = h - height / 2;
      array[i * 3 + 2] = Math.sin(angle) * r;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color={COLORS.earth.three}
        size={0.055}
        transparent
        opacity={0.7}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
