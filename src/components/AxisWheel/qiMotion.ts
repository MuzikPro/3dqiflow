/**
 * 人体气机场景的"仪表盘"（2026-08-19 人体气机重构）
 *
 * 与 Formula3D 的 MotionRefs 同思路：动画状态放在可变引用里，
 * useFrame 每帧向目标值插值，避免高频 setState。
 * 粒子流速 = axleSpeed × 该侧 flow —— "轴转则轮行"，轴停则光点停滞。
 */

export type QiMode = 'normal' | 'zhouHuai' | 'lunZhi';

export interface QiMotion {
  axleSpeed: { v: number };  // 中轴转速（正常 0.8；运轴演示 3；轴坏 0）
  axleGlow: { v: number };   // 中轴亮度 0-1.6（轴坏时熄灭变灰）
  leftFlow: { v: number };   // 左升轨道流量（轮滞时 ≈0）
  rightFlow: { v: number };  // 右降轨道流量
  loopGlow: { v: number };   // 闭环光带亮度（复圆时点亮）
}

export function createQiMotion(): QiMotion {
  return {
    axleSpeed: { v: 0.8 },
    axleGlow: { v: 1 },
    leftFlow: { v: 1 },
    rightFlow: { v: 1 },
    loopGlow: { v: 0.25 }
  };
}

export interface QiTargets {
  axleSpeed: number;
  axleGlow: number;
  leftFlow: number;
  rightFlow: number;
  loopGlow: number;
}

/** 各模式的目标值（「圆运动演示」已于 2026-08-25 整体下线） */
export function targetsFor(mode: QiMode): QiTargets {
  switch (mode) {
    case 'zhouHuai': // 轴坏（理中丸证）：轴停灰暗，流量随轴速自然停滞
      return { axleSpeed: 0.02, axleGlow: 0.08, leftFlow: 1, rightFlow: 1, loopGlow: 0.05 };
    case 'lunZhi': // 轮滞（桂枝汤证）：左升堵塞，右降相对过盛 → 上热下寒
      return { axleSpeed: 0.8, axleGlow: 0.8, leftFlow: 0.03, rightFlow: 1.5, loopGlow: 0.1 };
    default:
      return { axleSpeed: 0.8, axleGlow: 1, leftFlow: 1, rightFlow: 1, loopGlow: 0.25 };
  }
}

/** 大圆几何：椭圆环参数（正面人体躯干范围） */
export const LOOP = {
  centerY: 0.7,
  rx: 2.0,
  ry: 1.7,
  /** 左右半环的前后鼓弧（螺旋感） */
  zBow: 0.55
} as const;
