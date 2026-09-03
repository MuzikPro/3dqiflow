import { useRef } from 'react';
import * as THREE from 'three';
import { ThreeEvent, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { LUOSHU_PALACES, LuoshuPalace } from '@/data/hetuLuoshu';
import { ELEMENT_COLORS } from '@/data/organs';
import { UI } from '@/styles/theme';

/** 单个宫格：半透明立方体 + 数字/卦象/脏腑标注 + 内部微缩脏腑旋转 */
function Palace({
  palace,
  brightness,
  selected,
  onSelect
}: {
  palace: LuoshuPalace;
  brightness: number;
  selected: boolean;
  onSelect: (palace: LuoshuPalace) => void;
}) {
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const color = ELEMENT_COLORS[palace.element].hex;

  useFrame((_, delta) => {
    if (matRef.current) {
      const target = selected ? 1.2 : brightness;
      matRef.current.emissiveIntensity += (target - matRef.current.emissiveIntensity) * 0.12;
    }
    if (innerRef.current) innerRef.current.rotation.y += Math.min(delta, 0.1) * 0.8;
  });

  const [x, y] = palace.position;

  return (
    <group position={[x, y, 0]}>
      <mesh
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          onSelect(palace);
        }}
        onPointerOver={(e: ThreeEvent<PointerEvent>) => {
          e.stopPropagation();
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          document.body.style.cursor = 'default';
        }}
      >
        <boxGeometry args={[1.05, 1.05, 1.05]} />
        <meshStandardMaterial
          ref={matRef}
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          transparent
          opacity={0.32}
        />
      </mesh>
      {/* 内部微缩"脏腑"（示意小球，随宫格五行着色，缓慢旋转） */}
      <mesh ref={innerRef}>
        <sphereGeometry args={[0.22, 14, 14]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.7} />
      </mesh>
      <Html center distanceFactor={9} position={[0, 0.14, 0.56]} style={{ pointerEvents: 'none' }}>
        <div style={{ textAlign: 'center', textShadow: '0 0 6px rgba(0,0,0,0.9)', lineHeight: 1.25 }}>
          <div style={{ color, fontSize: '15px', fontWeight: 'bold' }}>
            {palace.guaSymbol} {palace.gua}
            {palace.number}
          </div>
          <div style={{ color: UI.textSecondary, fontSize: '10px', whiteSpace: 'nowrap' }}>
            {palace.bodyPart}·{palace.organRole}
          </div>
        </div>
      </Html>
    </group>
  );
}

interface Props {
  /** 节气相位 0-1（冬至=0），驱动"当令之宫最亮"的波浪 */
  seasonPhase: number;
  selected: LuoshuPalace | null;
  onSelect: (palace: LuoshuPalace) => void;
  zShift?: number;
}

/** 洛书九宫（戴九履一，左三右七）：固定网格，亮度随节气流转 */
export function LuoshuGrid({ seasonPhase, selected, onSelect, zShift = 0 }: Props) {
  return (
    <group position={[0, 0.3, zShift]}>
      {LUOSHU_PALACES.map((palace) => {
        let brightness = 0.45; // 中五：常明（轴不随四时改其位）
        if (palace.ringPhase !== null) {
          const dt = Math.abs(((seasonPhase - palace.ringPhase + 1.5) % 1) - 0.5);
          brightness = 0.18 + 0.95 * Math.pow(Math.max(0, Math.cos(dt * Math.PI * 2)), 2);
        }
        return (
          <Palace
            key={palace.number}
            palace={palace}
            brightness={brightness}
            selected={selected?.number === palace.number}
            onSelect={onSelect}
          />
        );
      })}
    </group>
  );
}
