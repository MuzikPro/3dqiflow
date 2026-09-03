import { useRef, useState } from 'react';
import * as THREE from 'three';
import { ThreeEvent, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Organ } from '@/data/organs';
import { UI } from '@/styles/theme';
import { Vec3 } from './flowGeometry';

interface Props {
  organ: Organ;
  /** 脏腑位置（解剖位/教学位可切换，由场景传入） */
  position: Vec3;
  /** 流注到达该脏腑时点亮 */
  active: boolean;
  onSelect: (organ: Organ) => void;
}

/** 固定在解剖位的脏腑节点：微光脉动，流注到达时放大发亮（节点永不移动） */
export function OrganNode({ organ, position, active, onSelect }: Props) {
  const matRef = useRef<THREE.MeshPhongMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (matRef.current) {
      const base = active ? 1.1 : hovered ? 0.9 : 0.45;
      matRef.current.emissiveIntensity = base + 0.15 * Math.sin(t * 3 + organ.position[0]);
    }
    if (meshRef.current) {
      const target = active ? 1.3 : hovered ? 1.15 : 1;
      meshRef.current.scale.setScalar(
        meshRef.current.scale.x + (target - meshRef.current.scale.x) * 0.15
      );
    }
  });


  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = 'default';
        }}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          onSelect(organ);
        }}
      >
        <sphereGeometry args={[organ.yin ? 0.17 : 0.14, 20, 20]} />
        <meshPhongMaterial
          ref={matRef}
          color={organ.color}
          emissive={organ.color}
          emissiveIntensity={0.45}
        />
      </mesh>
      <Html center distanceFactor={8} position={[0, 0.32, 0]} style={{ pointerEvents: 'none' }}>
        <div
          style={{
            color: active ? organ.colorHex : UI.textSecondary,
            fontSize: active ? '14px' : '11px',
            whiteSpace: 'nowrap',
            textShadow: '0 0 6px rgba(0,0,0,0.9)'
          }}
        >
          {organ.name}
        </div>
      </Html>
    </group>
  );
}
