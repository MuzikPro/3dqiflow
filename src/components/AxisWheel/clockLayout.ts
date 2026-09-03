import { Organ } from '@/data/organs';

/**
 * 正圆钟面布局（owner 2026-08-25）：人体撤下后两页共用的圆运动几何——
 * 四正落钟面 12/3/6/9（心上肺右肾下肝左），中土以脾胃球居中。
 */
export const CIRCLE_R = 2.0;

export const CLOCK_POS: Record<string, [number, number, number]> = {
  心: [0, 0.7 + CIRCLE_R, 0],
  肺: [CIRCLE_R, 0.7, 0],
  肾: [0, 0.7 - CIRCLE_R, 0],
  肝: [-CIRCLE_R, 0.7, 0],
  // 胆/大肠的数据位恰是 9/3 点——被肝肺占了，卫星沿径向外推一档
  胆: [-CIRCLE_R - 0.75, 0.7, 0],
  大肠: [CIRCLE_R + 0.75, 0.7, 0]
};

/** 中土球：名取脾胃（中气是二者合运），色即中轴土金色。仅供展示。 */
export const EARTH_CENTER: Organ = {
  name: '脾胃', nameEn: 'spleenStomachAxis',
  element: 'earth', color: 0xF39C12, colorHex: '#F39C12',
  position: [0, 0.7, 0.5], yin: true,
  meridian: '足太阴脾经·足阳明胃经', symbol: '己戊土', direction: 'ascend',
  desc: '中气之轴·轴转轮行',
  detail: '脾升胃降，中气斡旋，为圆运动之轴。'
};
