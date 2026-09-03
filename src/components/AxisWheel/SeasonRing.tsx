import { Html } from '@react-three/drei';
import { SOLAR_TERMS, getSeasonPosition } from '@/data/solarTerms';
import { SCENE_TEXT } from '@/styles/theme';
import { tr } from '@/i18n';

interface Props {
  /** 当前节气索引；null 表示尚未拖动滑块 */
  activeIndex: number | null;
  /** 光环半径（默认 7，人体场景用 5） */
  radius?: number;
  /**
   * 节气皮肤（DELIVERY_MERGE_ENERGY）：章节映射段——列出的索引
   * 点亮放大并标名，其余暗淡；null=经典行为（全部同亮）。
   */
  highlight?: number[] | null;
  /** 今日节气索引（标「·今」；与 activeIndex 可以不同——滑块手动时） */
  todayIndex?: number | null;
}

export function SeasonRing({ activeIndex, radius = 7, highlight = null, todayIndex = null }: Props) {
  const highlightSet = highlight ? new Set(highlight) : null;
  return (
    <group>
      {SOLAR_TERMS.map((term, i) => {
        const isToday = todayIndex === i;
        const active = activeIndex === i || isToday;
        const inSegment = highlightSet?.has(i) ?? false;
        const dimmed = highlightSet !== null && !inSegment && !active;
        const scale = active ? 2 : inSegment ? 1.7 : dimmed ? 0.7 : 1;
        const opacity = active ? 1 : inSegment ? 0.95 : dimmed ? 0.22 : 0.6;
        const labeled = active || inSegment;
        return (
          <group key={term.name} position={getSeasonPosition(i, radius)}>
            <mesh scale={scale}>
              <sphereGeometry args={[0.12, 8, 8]} />
              <meshBasicMaterial color={term.color} transparent opacity={opacity} />
            </mesh>
            {labeled && (
              <Html center distanceFactor={11} position={[0, 0.34, 0]} style={{ pointerEvents: 'none' }}>
                <div style={{ textAlign: 'center', textShadow: '0 0 6px rgba(0,0,0,0.95)', lineHeight: 1.2 }}>
                  <div style={{ color: term.colorHex, fontSize: '11px', whiteSpace: 'nowrap', fontWeight: active ? 'bold' : 'normal' }}>
                    {term.name}
                    {isToday && <span style={{ color: SCENE_TEXT.accent }}> ·{tr('今')}</span>}
                  </div>
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}
