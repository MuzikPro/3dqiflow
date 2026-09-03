/**
 * 十二经流注顺序 + 升降方向数据
 * 
 * 用法：
 *   import { MERIDIAN_FLOW, getMeridianById } from '@/data/meridians';
 * 
 * 在 3D 十二经剧场中：
 *   - 粒子沿流注顺序依次亮起
 *   - 六升经（左路）用绿色向上箭头
 *   - 六降经（右路）用白色向下箭头
 */

export interface Meridian {
  id: number;          // 流注顺序 0-11
  name: string;        // 经脉名
  nameEn: string;      // 英文名
  element: ElementKey; // 五行归属
  color: number;       // Three.js Hex
  colorHex: string;   // CSS 颜色
  direction: 'ascend' | 'descend'; // 升降
  path: string;       // 走法描述
  yin: boolean;       // true=阴经(脏), false=阳经(腑)
  pairId: number;      // 表里配对的经脉 id
  symptomsIfAbnormal: string[]; // 升降失常的病症
}

export type ElementKey = 'fire' | 'wood' | 'earth' | 'metal' | 'water' | 'minister';

/**
 * 十二经流注顺序（如环无端）
 * 
 * 口诀：肺大胃脾心小肠，膀肾包焦胆肝藏
 * 六降经（右路）：胃、胆、心包、心、膀胱、肺
 * 六升经（左路）：脾、肝、三焦、小肠、肾、大肠
 */
export const MERIDIAN_FLOW: Meridian[] = [
  {
    id: 0, name: '肺经', nameEn: 'lung',
    element: 'metal', color: 0xFFD700, colorHex: '#FFD700',
    direction: 'descend', path: '自胸走手', yin: true,
    pairId: 1, symptomsIfAbnormal: ['咳喘', '痰多', '胸闷', '水肿', '鼻塞']
  },
  {
    id: 1, name: '大肠经', nameEn: 'largeIntestine',
    element: 'metal', color: 0xECF0F1, colorHex: '#ECF0F1',
    direction: 'ascend', path: '自手走头', yin: false,
    pairId: 0, symptomsIfAbnormal: ['便秘', '腹胀', '痔疮']
  },
  {
    id: 2, name: '胃经', nameEn: 'stomach',
    element: 'earth', color: 0xE67E22, colorHex: '#E67E22',
    direction: 'descend', path: '自头走足', yin: false,
    pairId: 3, symptomsIfAbnormal: ['脘痞', '嗳气', '便秘', '纳呆']
  },
  {
    id: 3, name: '脾经', nameEn: 'spleen',
    element: 'earth', color: 0xF39C12, colorHex: '#F39C12',
    direction: 'ascend', path: '自足走胸', yin: true,
    pairId: 2, symptomsIfAbnormal: ['腹胀', '腹泻', '头晕乏力', '内脏下垂']
  },
  {
    id: 4, name: '心经', nameEn: 'heart',
    element: 'fire', color: 0xE74C3C, colorHex: '#E74C3C',
    direction: 'descend', path: '自胸走手', yin: true,
    pairId: 5, symptomsIfAbnormal: ['心烦', '失眠', '口舌生疮', '上热下寒']
  },
  {
    id: 5, name: '小肠经', nameEn: 'smallIntestine',
    element: 'fire', color: 0xC0392B, colorHex: '#C0392B',
    direction: 'ascend', path: '自手走头', yin: false,
    pairId: 4, symptomsIfAbnormal: ['腹痛', '消化不良']
  },
  {
    id: 6, name: '膀胱经', nameEn: 'bladder',
    element: 'water', color: 0x0288D1, colorHex: '#0288D1',
    direction: 'descend', path: '自头走足', yin: false,
    pairId: 7, symptomsIfAbnormal: ['小便不利', '腰背酸痛']
  },
  {
    id: 7, name: '肾经', nameEn: 'kidney',
    element: 'water', color: 0x4FC3F7, colorHex: '#4FC3F7',
    direction: 'ascend', path: '自足走胸', yin: true,
    pairId: 6, symptomsIfAbnormal: ['畏寒', '腰膝酸软', '遗精', '阳越发热']
  },
  {
    id: 8, name: '心包经', nameEn: 'pericardium',
    element: 'minister', color: 0xCE93D8, colorHex: '#CE93D8',
    direction: 'descend', path: '自胸走手', yin: true,
    pairId: 9, symptomsIfAbnormal: ['心悸', '烦躁', '胸胁胀痛']
  },
  {
    id: 9, name: '三焦经', nameEn: 'tripleBurner',
    element: 'minister', color: 0xAB47BC, colorHex: '#AB47BC',
    direction: 'ascend', path: '自手走头', yin: false,
    pairId: 8, symptomsIfAbnormal: ['水肿', '小便不利', '耳鸣']
  },
  {
    id: 10, name: '胆经', nameEn: 'gallbladder',
    element: 'wood', color: 0x2ECC71, colorHex: '#2ECC71',
    direction: 'descend', path: '自头走足', yin: false,
    pairId: 11, symptomsIfAbnormal: ['口苦', '胁痛', '目眩']
  },
  {
    id: 11, name: '肝经', nameEn: 'liver',
    element: 'wood', color: 0x27AE60, colorHex: '#27AE60',
    direction: 'ascend', path: '自足走胸', yin: true,
    pairId: 10, symptomsIfAbnormal: ['痛', '遗', '淋', '痢', '痔', '脱肛', '盗汗', '疝', '带下', '目疾']
  }
];

/**
 * 六升经（左路）
 */
export const ASCEND_MERIDIANS = MERIDIAN_FLOW.filter(m => m.direction === 'ascend');

/**
 * 六降经（右路）
 */
export const DESCEND_MERIDIANS = MERIDIAN_FLOW.filter(m => m.direction === 'descend');

/**
 * 口诀：
 * 胃胆包心膀肺降（六降经·右路）
 * 脾肝三焦肾肠升（六升经·左路）
 */
export const MNEMONIC = {
  descend: '胃胆包心膀肺降',
  ascend: '脾肝三焦肾肠升'
};

/**
 * 获取表里配对
 */
export function getPairedMeridian(id: number): Meridian | undefined {
  const m = MERIDIAN_FLOW.find(x => x.id === id);
  if (!m) return undefined;
  return MERIDIAN_FLOW.find(x => x.id === m.pairId);
}

/**
 * 流注路径的 3D 坐标序列（用于粒子沿路径运动）
 * 返回一个椭圆轨迹上的点
 */
export function getFlowPathPoints(count: number = 200, radius: number = 4.5): [number, number, number][] {
  const points: [number, number, number][] = [];
  for (let i = 0; i < count; i++) {
    const t = (i / count) * Math.PI * 2;
    const x = Math.cos(t) * radius * 1.1;
    const y = Math.sin(t) * radius * 0.9;
    const z = Math.sin(t * 2) * 0.8;
    points.push([x, y, z]);
  }
  return points;
}
