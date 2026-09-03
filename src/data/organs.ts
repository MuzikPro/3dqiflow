/**
 * 脏腑数据 —— 六组经气圆运动
 * 
 * 用法：
 *   import { ORGANS } from '@/data/organs';
 * 
 * 在 3D 场景中，每个 organ 对应一个 Mesh：
 *   - position 是 3D 坐标
 *   - color 是五行色（Hex）
 *   - yin = true 表示脏（阴经），false 表示腑（阳经）
 */

export interface Organ {
  name: string;        // 中文名
  nameEn: string;      // 英文名（用于代码/ID）
  element: ElementKey; // 五行归属
  color: number;       // Hex 颜色（Three.js 格式，如 0xE74C3C）
  colorHex: string;    // CSS 格式（如 '#E74C3C'）
  position: [number, number, number]; // 3D 坐标
  yin: boolean;       // true=脏(阴经), false=腑(阳经)
  meridian: string;    // 经脉名称
  symbol: string;      // 天干符号（如 辛金、癸水）
  direction: 'ascend' | 'descend'; // 升降方向
  desc: string;       // 一句话描述
  detail: string;     // 详细说明（用于信息卡）
}

export type ElementKey = 'fire' | 'wood' | 'earth' | 'metal' | 'water' | 'minister';

/**
 * 五行配色规范（全局统一）
 */
// 2026-08-19 审查修正（review_report D1-D3）：金/水/相火在暗背景下不可见，改亮色
export const ELEMENT_COLORS = {
  fire:    { hex: '#E74C3C', rgb: '231, 76, 60',   three: 0xE74C3C },
  wood:    { hex: '#27AE60', rgb: '39, 174, 96',    three: 0x27AE60 },
  earth:   { hex: '#F39C12', rgb: '243, 156, 18',  three: 0xF39C12 },
  metal:   { hex: '#FFD700', rgb: '255, 215, 0',   three: 0xFFD700 },
  water:   { hex: '#4FC3F7', rgb: '79, 195, 247',  three: 0x4FC3F7 },
  minister:{ hex: '#CE93D8', rgb: '206, 147, 216', three: 0xCE93D8 },
} as const;

/**
 * 六组经气圆运动 —— 完整数据
 *
 * 空间布局（2026-08-19 人体气机重构：正面站立人体 + 中轴 + 左升右降大圆）：
 *
 *            🔴 心/小肠（顶·火）
 *     🟣 心包/三焦        🤍 肺（右上·金）
 *  🟢 胆（左）    中轴     ⚪ 大肠（右）
 *  🟢 肝（左下） 脾│胃    （右下·胃）
 *            🔵 肾/膀胱（底·水）
 *  左半环＝升（绿·肾肝→心）  右半环＝降（白·心肺→胃肾）
 */
export const ORGANS: Organ[] = [
  // ===== 火气（顶部） =====
  {
    name: '心', nameEn: 'heart',
    element: 'fire', color: 0xE74C3C, colorHex: '#E74C3C',
    position: [0, 2.35, 0.55], yin: true,
    meridian: '手少阴心经', symbol: '丁火', direction: 'descend',
    desc: '火气宣通·主降',
    detail: '心主火气，位于圆运动顶部。心经自胸走手(降)，小肠经自手走头(升)。心火不降→心烦、失眠、口舌生疮、上热下寒。代表方：黄连阿胶汤。'
  },
  {
    name: '小肠', nameEn: 'smallIntestine',
    element: 'fire', color: 0xC0392B, colorHex: '#C0392B',
    position: [0.85, 2.05, 0], yin: false,
    meridian: '手太阳小肠经', symbol: '丙火', direction: 'ascend',
    desc: '火气宣通·主升',
    detail: '小肠与心为表里，主火气之升。小肠经自手走头(升)，与心经一降一升合成火气圆运动。'
  },

  // ===== 相火（贯穿上下） =====
  {
    name: '心包', nameEn: 'pericardium',
    element: 'minister', color: 0xCE93D8, colorHex: '#CE93D8',
    position: [-0.85, 1.9, 0], yin: true,
    meridian: '手厥阴心包经', symbol: '相火', direction: 'descend',
    desc: '相火·主降',
    detail: '心包代心受邪，主相火之降。心包经自胸走手(降)，与三焦经一降一升合成相火圆运动。代表方：乌梅丸。'
  },
  {
    name: '三焦', nameEn: 'tripleBurner',
    element: 'minister', color: 0xAB47BC, colorHex: '#AB47BC',
    position: [-1.35, 1.2, 0], yin: false,
    meridian: '手少阳三焦经', symbol: '相火', direction: 'ascend',
    desc: '相火·主升',
    detail: '三焦为相火之腑，贯穿上中下三焦。三焦经自手走头(升)，与心包经一降一升合成相火圆运动。'
  },

  // ===== 木气（左侧·主升） =====
  {
    name: '肝', nameEn: 'liver',
    element: 'wood', color: 0x27AE60, colorHex: '#27AE60',
    position: [-1.55, -0.45, 0], yin: true,
    meridian: '足厥阴肝经', symbol: '乙木', direction: 'ascend',
    desc: '木气疏泄·主升',
    detail: '肝主木气疏泄，位于圆运动左侧。肝经自足走胸(升)，胆经自头走足(降)。肝经不升→痛、遗、淋、痢、痔、脱肛、盗汗、疝、带下、目疾。代表方：当归生姜羊肉汤。'
  },
  {
    name: '胆', nameEn: 'gallbladder',
    element: 'wood', color: 0x2ECC71, colorHex: '#2ECC71',
    position: [-2.0, 0.7, 0], yin: false,
    meridian: '足少阳胆经', symbol: '甲木', direction: 'descend',
    desc: '木气疏泄·主降',
    detail: '胆与肝为表里，主木气之降。胆经自头走足(降)，与肝经一升一降合成木气圆运动。'
  },

  // ===== 土气（中轴） =====
  {
    name: '脾', nameEn: 'spleen',
    element: 'earth', color: 0xF39C12, colorHex: '#F39C12',
    position: [-0.95, -0.35, 0], yin: true,
    meridian: '足太阴脾经', symbol: '己土', direction: 'ascend',
    desc: '土气运化·主升',
    detail: '脾主升清，为圆运动之轴。脾经自足走胸(升)，与胃经一升一降合成土气圆运动。脾经不升→腹胀、腹泻、头晕乏力、内脏下垂。代表方：理中丸。'
  },
  {
    name: '胃', nameEn: 'stomach',
    element: 'earth', color: 0xE67E22, colorHex: '#E67E22',
    position: [0.95, -0.35, 0], yin: false,
    meridian: '足阳明胃经', symbol: '戊土', direction: 'descend',
    desc: '土气运化·主降',
    detail: '胃主降浊，为圆运动之轴。胃经自头走足(降)，与脾经一升一降合成土气圆运动。胃经不降→脘痞、嗳气、便秘、纳呆。'
  },

  // ===== 金气（右侧·主降） =====
  {
    name: '肺', nameEn: 'lung',
    element: 'metal', color: 0xFFD700, colorHex: '#FFD700',
    position: [1.55, 1.75, 0], yin: true,
    meridian: '手太阴肺经', symbol: '辛金', direction: 'descend',
    desc: '金气收敛·主降',
    detail: '肺主金气收敛，位于圆运动右侧。肺经自胸走手(降)，大肠经自手走头(升)。肺经不降→咳喘、痰多、胸闷、水肿、鼻塞。代表方：麦门冬汤。'
  },
  {
    name: '大肠', nameEn: 'largeIntestine',
    element: 'metal', color: 0xECF0F1, colorHex: '#ECF0F1',
    position: [2.0, 0.7, 0], yin: false,
    meridian: '手阳明大肠经', symbol: '庚金', direction: 'ascend',
    desc: '金气收敛·主升',
    detail: '大肠与肺为表里，主金气之升。大肠经自手走头(升)，与肺经一降一升合成金气圆运动。'
  },

  // ===== 水气（底部） =====
  {
    name: '肾', nameEn: 'kidney',
    element: 'water', color: 0x4FC3F7, colorHex: '#4FC3F7',
    position: [0, -1.05, 0.5], yin: true,
    meridian: '足少阴肾经', symbol: '癸水', direction: 'ascend',
    desc: '水气封藏·主升',
    detail: '肾主水气封藏，位于圆运动底部。肾经自足走胸(升)，膀胱经自头走足(降)。肾水不藏→畏寒、腰膝酸软、遗精、阳越发热。代表方：肾气丸。'
  },
  {
    name: '膀胱', nameEn: 'bladder',
    element: 'water', color: 0x0288D1, colorHex: '#0288D1',
    position: [0.75, -0.95, 0], yin: false,
    meridian: '足太阳膀胱经', symbol: '壬水', direction: 'descend',
    desc: '水气封藏·主降',
    detail: '膀胱与肾为表里，主水气之降。膀胱经自头走足(降)，与肾经一升一降合成水气圆运动。'
  }
];

/**
 * 相火路径（2026-08-19 人体气机重构）：
 * 相火自心包沿中轴下潜归于肾水，渲染为轴旁的紫色虚线曲线。
 */
type Vec3 = [number, number, number];
export const MINISTER_FIRE_LINE = {
  points: [
    [-0.85, 1.9, 0.35],
    [0, 0.5, 0.3],
    [0, -1.05, 0.35]
  ] as Vec3[],
  color: 0xCE93D8
};

/**
 * 工具函数：取表里配对脏腑（同一五行的另一味：肝↔胆、心↔小肠……）
 */
export function getPairedOrgan(organ: Organ): Organ | undefined {
  return ORGANS.find(o => o.element === organ.element && o.name !== organ.name);
}

/**
 * 工具函数：按五行筛选脏腑
 */
export function getOrgansByElement(element: ElementKey): Organ[] {
  return ORGANS.filter(o => o.element === element);
}

/**
 * 工具函数：获取阴经（脏）
 */
export function getYinOrgans(): Organ[] {
  return ORGANS.filter(o => o.yin);
}

/**
 * 工具函数：获取阳经（腑）
 */
export function getYangOrgans(): Organ[] {
  return ORGANS.filter(o => !o.yin);
}
