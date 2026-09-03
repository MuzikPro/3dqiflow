/**
 * 子午流注 · 十二时辰经络当令表（owner 2026-08-19 需求：轴轮模型实时时辰条）
 *
 * 传统十二时辰配十二经（子胆丑肝……戌心包亥三焦），为经典通行内容，
 * 属教学展示，非诊疗依据。organ 与 src/data/organs.ts、meridian 与
 * src/data/meridians.ts 的名称一一对应，供 3D 高亮与经络剧场深链。
 *
 * 节气"今日"推算：二十四节气由太阳黄经决定，只随日期/时区变化，
 * 与地理位置无关（无需定位权限）。下表为常年近似交节日（±1 天浮动），
 * 教学用途足够；精确交节时刻逐年不同。
 */
import { SOLAR_TERMS } from './solarTerms';

export interface ShichenEntry {
  shichen: string;   // 时辰名
  hours: string;     // 现代钟点区间
  startHour: number; // 区间起点（24h 制；子时=23）
  organ: string;     // 对应脏腑（ORGANS.name）
  meridian: string;  // 对应经络（MERIDIAN_FLOW.name）
  meridianFull: string;
  note: string;      // 一句当令提示（经典通说）
}

export const MERIDIAN_CLOCK: ShichenEntry[] = [
  { shichen: '子', hours: '23–01', startHour: 23, organ: '胆', meridian: '胆经', meridianFull: '足少阳胆经', note: '一阳初生，胆气生发' },
  { shichen: '丑', hours: '01–03', startHour: 1, organ: '肝', meridian: '肝经', meridianFull: '足厥阴肝经', note: '肝藏血，血归于肝' },
  { shichen: '寅', hours: '03–05', startHour: 3, organ: '肺', meridian: '肺经', meridianFull: '手太阴肺经', note: '气血注肺，肺朝百脉' },
  { shichen: '卯', hours: '05–07', startHour: 5, organ: '大肠', meridian: '大肠经', meridianFull: '手阳明大肠经', note: '大肠传导，排浊之时' },
  { shichen: '辰', hours: '07–09', startHour: 7, organ: '胃', meridian: '胃经', meridianFull: '足阳明胃经', note: '胃受纳，宜进早餐' },
  { shichen: '巳', hours: '09–11', startHour: 9, organ: '脾', meridian: '脾经', meridianFull: '足太阴脾经', note: '脾主运化，中轴最旺' },
  { shichen: '午', hours: '11–13', startHour: 11, organ: '心', meridian: '心经', meridianFull: '手少阴心经', note: '心气宣通，阳气之极' },
  { shichen: '未', hours: '13–15', startHour: 13, organ: '小肠', meridian: '小肠经', meridianFull: '手太阳小肠经', note: '小肠泌别清浊' },
  { shichen: '申', hours: '15–17', startHour: 15, organ: '膀胱', meridian: '膀胱经', meridianFull: '足太阳膀胱经', note: '膀胱气化行水' },
  { shichen: '酉', hours: '17–19', startHour: 17, organ: '肾', meridian: '肾经', meridianFull: '足少阴肾经', note: '肾藏精，封藏之本' },
  { shichen: '戌', hours: '19–21', startHour: 19, organ: '心包', meridian: '心包经', meridianFull: '手厥阴心包经', note: '心包护心，相火下行' },
  { shichen: '亥', hours: '21–23', startHour: 21, organ: '三焦', meridian: '三焦经', meridianFull: '手少阳三焦经', note: '三焦通调，百脉归息' }
];

/** 当前时辰索引（子时跨 23:00–01:00） */
export function currentShichenIndex(date: Date = new Date()): number {
  return Math.floor(((date.getHours() + 1) % 24) / 2);
}

/** 常年近似交节日（月, 日），按节气名索引 */
const TERM_DATES: Record<string, [number, number]> = {
  立春: [2, 4], 雨水: [2, 19], 惊蛰: [3, 6], 春分: [3, 21], 清明: [4, 5], 谷雨: [4, 20],
  立夏: [5, 6], 小满: [5, 21], 芒种: [6, 6], 夏至: [6, 21], 小暑: [7, 7], 大暑: [7, 23],
  立秋: [8, 8], 处暑: [8, 23], 白露: [9, 8], 秋分: [9, 23], 寒露: [10, 8], 霜降: [10, 24],
  立冬: [11, 7], 小雪: [11, 22], 大雪: [12, 7], 冬至: [12, 22], 小寒: [1, 6], 大寒: [1, 20]
};

/** 今日所属节气在 SOLAR_TERMS 中的索引（近似±1天） */
export function currentSolarTermIndex(date: Date = new Date()): number {
  const value = (m: number, d: number) => m * 100 + d;
  const today = value(date.getMonth() + 1, date.getDate());
  let bestIndex = 0;
  let bestValue = -1;
  SOLAR_TERMS.forEach((term, i) => {
    const md = TERM_DATES[term.name];
    if (!md) return;
    const v = value(md[0], md[1]);
    if (v <= today && v > bestValue) {
      bestValue = v;
      bestIndex = i;
    }
  });
  if (bestValue === -1) {
    // 年初 1/1–1/5：仍属去年冬至节气区间
    const winterSolstice = SOLAR_TERMS.findIndex((t) => t.name === '冬至');
    return winterSolstice >= 0 ? winterSolstice : 0;
  }
  return bestIndex;
}
