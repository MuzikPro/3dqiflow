import { useState } from 'react';
import * as THREE from 'three';
import { ThreeEvent } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { Organ } from '@/data/organs';
import { SCENE_TEXT } from '@/styles/theme';

/** 点击联动状态（2026-08-19 审查修正 C3） */
export type OrganHighlight = 'selected' | 'paired' | 'dimmed' | 'normal';

interface Props {
  organ: Organ;
  highlight: OrganHighlight;
  /** 节气/病理联动：当令（或病理受累）五行增强，其余减弱（无点击选中时生效） */
  seasonEmphasis: boolean | null;
  onSelect: (organ: Organ) => void;
  /**
   * 经典圆运动图式（owner 2026-08-19 决定）：常态只显示 心/肝/肺/肾 四正
   * （脾胃即中轴），其余脏腑仅在被选中/配对时作为卫星出现。
   */
  visible: boolean;
  /** 子午流注：当前时辰当令脏腑（名签加「当令」标） */
  clockBadge?: boolean;
  /** 迷你舞台用：名签缩号（条文阅读病机台，owner 2026-08-26） */
  compactLabel?: boolean;
  /** 名签挂球下方（如 6 点肾球，避免压住圆心签） */
  labelBelow?: boolean;
}

/** 每种状态的缩放/发光/透明度（review_report 修改8） */
function visualFor(highlight: OrganHighlight, seasonEmphasis: boolean | null, hovered: boolean) {
  if (highlight === 'selected') return { scale: 1.6, emissive: 1.5, opacity: 0.95 };
  if (highlight === 'paired') return { scale: 1.0, emissive: 0.9, opacity: 0.95 };
  if (highlight === 'dimmed') return { scale: 0.8, emissive: 0.25, opacity: 0.2 };
  // 无点击选中：节气联动生效
  if (seasonEmphasis === true) return { scale: 1.2, emissive: 1.0, opacity: 0.95 };
  if (seasonEmphasis === false) return { scale: 0.9, emissive: 0.3, opacity: 0.5 };
  return { scale: hovered ? 1.15 : 1, emissive: hovered ? 1.2 : 0.5, opacity: 0.9 };
}

export function OrganMesh({ organ, highlight, seasonEmphasis, onSelect, visible, clockBadge = false, compactLabel = false, labelBelow = false }: Props) {
  const [hovered, setHovered] = useState(false);
  if (!visible) return null;

  // 四正（心肝肺肾，皆脏）等大；卫星腑略小——层级由"是否常驻"表达，而非球径杂乱
  const size = organ.yin ? 0.4 : 0.3;
  const v = visualFor(highlight, seasonEmphasis, hovered);
  const dimmed = highlight === 'dimmed';

  return (
    <mesh
      position={organ.position}
      scale={v.scale}
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
      <sphereGeometry args={[size, 32, 32]} />
      <meshPhongMaterial
        color={organ.color}
        emissive={organ.color}
        emissiveIntensity={v.emissive}
        transparent
        opacity={v.opacity}
      />
      {/* 光晕（BackSide：只画球背面的辉光，不遮挡本体） */}
      <mesh scale={1.4}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshBasicMaterial
          color={organ.color}
          transparent
          opacity={dimmed ? 0.03 : hovered || highlight === 'selected' ? 0.15 : 0.1}
          side={THREE.BackSide}
        />
      </mesh>
      {/* 常显名签：名 + 气机角色（回应"看不懂球是什么"） */}
      {!dimmed && (
        <Html center distanceFactor={compactLabel ? 8 : 10}
              position={[0, labelBelow ? -(size + 0.42) : size + 0.32, 0]}
              style={{ pointerEvents: 'none' }}>
          <div style={{ textAlign: 'center', textShadow: '0 0 6px rgba(0,0,0,0.95)', lineHeight: 1.25 }}>
            <div style={{ color: organ.colorHex, fontSize: compactLabel ? '10px' : '13px', fontWeight: 'bold', whiteSpace: 'nowrap' }}>
              {organ.name}
              {clockBadge && (
                <span
                  style={{
                    fontSize: '9px', marginLeft: '4px', padding: '0 4px',
                    border: `1px solid ${organ.colorHex}`, borderRadius: '6px', verticalAlign: 'middle'
                  }}
                >
                  当令
                </span>
              )}
            </div>
            <div style={{ color: SCENE_TEXT.muted, fontSize: compactLabel ? '7px' : '9px', whiteSpace: 'nowrap' }}>{organ.desc}</div>
          </div>
        </Html>
      )}
    </mesh>
  );
}
