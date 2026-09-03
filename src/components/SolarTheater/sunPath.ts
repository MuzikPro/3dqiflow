/**
 * 二十四节气垂直圆圈的几何与太阳热球插值（脚本B规格书）
 *
 * 关键几何：圆圈是"垂直"的（正面朝观察者），不是水平黄道！
 * 冬至在底、夏至在顶；冬至→春分→夏至走左半边（左升），
 * 夏至→秋分→冬至走右半边（右降）——左升右降在一年尺度上的体现。
 */
import * as THREE from 'three';
import { SOLAR_TERMS } from '@/data/solarTerms';

export const RING_RADIUS = 3.5;
export const RING_CENTER_Y = 0.4;

/** 太阳热球体的视觉插值端点（规格书表：冬至暗红小 → 夏至金白大） */
export const SUN_STOPS = {
  winter: { color: '#8B0000', radius: 0.6, glow: 0.2 },  // 沉极
  mid: { color: '#FF8C00', radius: 0.9, glow: 0.5 },     // 春分/秋分
  summer: { color: '#FFF8DC', radius: 1.4, glow: 1.0 }   // 浮极
} as const;

const WINTER_INDEX = SOLAR_TERMS.findIndex((t) => t.name === '冬至');

/** 节气 k（SOLAR_TERMS 下标）在圆圈上的相位 t∈[0,1)：冬至=0（底），左升右降 */
export function termPhase(k: number): number {
  return ((k - WINTER_INDEX + SOLAR_TERMS.length) % SOLAR_TERMS.length) / SOLAR_TERMS.length;
}

/** 相位 t 对应的当前节气下标 */
export function phaseTerm(t: number): number {
  const steps = SOLAR_TERMS.length;
  return (WINTER_INDEX + Math.floor(((t % 1) + 1 / (2 * steps)) * steps)) % steps;
}

/** 相位 t 的 3D 位置：t=0 底（冬至），t=0.25 左（春分），t=0.5 顶（夏至），t=0.75 右（秋分） */
export function phasePosition(t: number, out?: THREE.Vector3): THREE.Vector3 {
  const angle = t * Math.PI * 2;
  const v = out ?? new THREE.Vector3();
  return v.set(-Math.sin(angle) * RING_RADIUS, RING_CENTER_Y - Math.cos(angle) * RING_RADIUS, 0);
}

/** 高度系数 0（冬至底）→1（夏至顶） */
export function heightFactor(y: number): number {
  return THREE.MathUtils.clamp((y - (RING_CENTER_Y - RING_RADIUS)) / (2 * RING_RADIUS), 0, 1);
}

const cWinter = new THREE.Color(SUN_STOPS.winter.color);
const cMid = new THREE.Color(SUN_STOPS.mid.color);
const cSummer = new THREE.Color(SUN_STOPS.summer.color);

/** 太阳热球体颜色：三段插值 深红→橙→金白 */
export function sunColor(h: number, out: THREE.Color): THREE.Color {
  if (h < 0.5) return out.copy(cWinter).lerp(cMid, h * 2);
  return out.copy(cMid).lerp(cSummer, (h - 0.5) * 2);
}

export function sunRadius(h: number): number {
  return SUN_STOPS.winter.radius + (SUN_STOPS.summer.radius - SUN_STOPS.winter.radius) * h;
}

export function sunGlow(h: number): number {
  return SUN_STOPS.winter.glow + (SUN_STOPS.summer.glow - SUN_STOPS.winter.glow) * h;
}
