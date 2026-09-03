import { useMemo } from 'react';
import * as THREE from 'three';
import { MINISTER_FIRE_LINE } from '@/data/organs';

/**
 * 相火路径（2026-08-19 审查修正 B5）：
 * 肾区→膀胱→脾→胃→心包 的折线，用 CatmullRom 平滑成曲线后画紫色虚线。
 */
export function MinisterFireLine({
  line,
  opacity = 0.7
}: {
  line: typeof MINISTER_FIRE_LINE;
  /** 相火受损时调低（如少阴证：相火虚线近断） */
  opacity?: number;
}) {
  const object = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(line.points.map((p) => new THREE.Vector3(...p)));
    const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(120));
    const material = new THREE.LineDashedMaterial({
      color: line.color,
      dashSize: 0.28,
      gapSize: 0.18,
      transparent: true,
      opacity
    });
    const dashed = new THREE.Line(geometry, material);
    // 虚线必须计算线段距离，否则渲染为实线
    dashed.computeLineDistances();
    return dashed;
  }, [line, opacity]);

  return <primitive object={object} />;
}
