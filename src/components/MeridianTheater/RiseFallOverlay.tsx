import { useMemo } from 'react';
import { COLORS } from '@/styles/theme';
import { buildHalfCurve } from '../AxisWheel/QiLoop';

/**
 * "圆运动叠加"：在流注环之上叠加左升（绿）右降（白）的大圆，
 * 提示学生：流注闭环与升降大圆是同一气机的两种切面。
 */
export function RiseFallOverlay() {
  const left = useMemo(() => buildHalfCurve('left'), []);
  const right = useMemo(() => buildHalfCurve('right'), []);

  return (
    <group>
      <mesh>
        <tubeGeometry args={[left, 48, 0.05, 8, false]} />
        <meshBasicMaterial color={COLORS.wood.primary} transparent opacity={0.35} depthWrite={false} />
      </mesh>
      <mesh>
        <tubeGeometry args={[right, 48, 0.05, 8, false]} />
        <meshBasicMaterial color={COLORS.metal.secondary} transparent opacity={0.35} depthWrite={false} />
      </mesh>
    </group>
  );
}
