/**
 * 河图·洛书参考数据（脚本E规格书）
 *
 * 河图 = 生成之数的空间方位模型（固定，不旋转）：
 *   天一生水，地六成之（北·寒·肾/膀胱）
 *   地二生火，天七成之（南·热·心/小肠）
 *   天三生木，地八成之（东·温·肝/胆）
 *   地四生金，天九成之（西·凉·肺/大肠）
 *   天五生土，地十成之（中·湿·脾/胃）
 * 注：规格书立方体表把二/四误标为"天"，与其自述"地二生火、地四生金"
 * 及奇数=天、偶数=地的通例矛盾，此处按通例修正。
 *
 * 洛书 = 九宫方位（戴九履一，左三右七，四二为肩，六八为足），
 * 叠加节气时间维度（当令之宫最亮）。
 */
import { ElementKey } from './organs';

export interface HetuPair {
  element: ElementKey;
  label: string;          // 如 '水'
  heavenNumber: number;   // 天数（奇·阳·后层）
  earthNumber: number;    // 地数（偶·阴·前层）
  direction: string;      // 方位（北/南/东/西/中）
  nature: string;         // 寒/热/温/凉/湿
  organs: string;         // 对应脏腑（脏/腑）
  position: [number, number]; // 正面视图 x,y（z 由天/地层决定）
  meaning: string;        // 生成数含义 + 圆运动角色
}

export const HETU_PAIRS: HetuPair[] = [
  {
    element: 'water', label: '水', heavenNumber: 1, earthNumber: 6,
    direction: '北', nature: '寒', organs: '肾（脏）／膀胱（腑）',
    position: [0, -2.3],
    meaning: '天一生水，地六成之。水居北方之寒，为圆运动之最低点——阳气封藏于此，冬至一阳来复的起点。'
  },
  {
    element: 'fire', label: '火', heavenNumber: 7, earthNumber: 2,
    direction: '南', nature: '热', organs: '心（脏）／小肠（腑）',
    position: [0, 2.7],
    meaning: '地二生火，天七成之。火居南方之热，为圆运动之最高点——阳气宣通至极，夏至一阴始生之处。'
  },
  {
    element: 'wood', label: '木', heavenNumber: 3, earthNumber: 8,
    direction: '东', nature: '温', organs: '肝（脏）／胆（腑）',
    position: [-2.5, 0.2],
    meaning: '天三生木，地八成之。木居东方之温，主左路升发——肝木带动圆运动的上升之半。'
  },
  {
    element: 'metal', label: '金', heavenNumber: 9, earthNumber: 4,
    direction: '西', nature: '凉', organs: '肺（脏）／大肠（腑）',
    position: [2.5, 0.2],
    meaning: '地四生金，天九成之。金居西方之凉，主右路收降——肺金带动圆运动的下降之半。'
  },
  {
    element: 'earth', label: '土', heavenNumber: 5, earthNumber: 10,
    direction: '中', nature: '湿', organs: '脾（脏）／胃（腑）',
    position: [0, 0.2],
    meaning: '天五生土，地十成之。土居中央，为轴——四维之轮皆绕脾胃之轴而转，中气如轴即源于此。'
  }
];

export interface LuoshuPalace {
  number: number;        // 洛书数 1-9
  gua: string;           // 卦名（中五无卦）
  guaSymbol: string;     // 卦象 Unicode（中五为 ·）
  bodyPart: string;      // 对应人体部位
  organRole: string;     // 对应脏腑气机
  element: ElementKey;
  position: [number, number]; // 3×3 网格 x,y
  /** 在八宫环上的相位（0=坎一·底，左升右降与节气环同向；中五为 null） */
  ringPhase: number | null;
}

export const LUOSHU_PALACES: LuoshuPalace[] = [
  { number: 4, gua: '巽', guaSymbol: '☴', bodyPart: '左肩', organRole: '肝木升极', element: 'wood', position: [-1.3, 1.3], ringPhase: 0.375 },
  { number: 9, gua: '离', guaSymbol: '☲', bodyPart: '头顶', organRole: '心火宣通', element: 'fire', position: [0, 1.3], ringPhase: 0.5 },
  { number: 2, gua: '坤', guaSymbol: '☷', bodyPart: '右肩', organRole: '肺金始降', element: 'metal', position: [1.3, 1.3], ringPhase: 0.625 },
  { number: 3, gua: '震', guaSymbol: '☳', bodyPart: '左腰', organRole: '肝木升发', element: 'wood', position: [-1.3, 0], ringPhase: 0.25 },
  { number: 5, gua: '中', guaSymbol: '·', bodyPart: '中轴', organRole: '脾胃斡旋', element: 'earth', position: [0, 0], ringPhase: null },
  { number: 7, gua: '兑', guaSymbol: '☱', bodyPart: '右腰', organRole: '肺金降敛', element: 'metal', position: [1.3, 0], ringPhase: 0.75 },
  { number: 8, gua: '艮', guaSymbol: '☶', bodyPart: '左腿', organRole: '阳气始升', element: 'wood', position: [-1.3, -1.3], ringPhase: 0.125 },
  { number: 1, gua: '坎', guaSymbol: '☵', bodyPart: '脚底', organRole: '肾水封藏', element: 'water', position: [0, -1.3], ringPhase: 0 },
  { number: 6, gua: '乾', guaSymbol: '☰', bodyPart: '右腿', organRole: '阳气归藏', element: 'metal', position: [1.3, -1.3], ringPhase: 0.875 }
];
