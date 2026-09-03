/**
 * 方剂数据 —— 3D 君臣佐使图谱 + 气机恢复动画
 * 
 * 用法：
 *   import { FORMULAS, getFormulaByName } from '@/data/formulas';
 * 
 * 在 3D 方剂详解页中：
 *   - 每个药物是一个 3D 球体
 *   - 球体大小 = 剂量比例
 *   - 球体颜色 = 药性（温热红 / 寒凉蓝 / 平和中黄）
 *   - 球体位置 = 归经方位（左肝/右肺/顶心/底肾/中脾胃）
 */

export interface FormulaDrug {
  name: string;       // 药名
  dose: string;       // 剂量（原文）
  ratio: number;      // 比例（用于球体大小）
  nature: 'warm' | 'cold' | 'neutral' | 'cool' | 'hot' | 'sour';
  color: number;       // Three.js Hex 颜色
  colorHex: string;   // CSS 颜色
  meridian: string;   // 归经
  position: [number, number, number]; // 3D 坐标（归经方位）
  action: string;     // 在圆运动中的作用
  /** 君臣佐使角色（formula_detail_v2 交付；只在交付提供时填写，不自行推断） */
  role?: '君' | '臣' | '佐' | '使' | '佐使';
}

export interface AnimationStep {
  time: number;    // 秒（时间轴上的触发点）
  action: string;  // 动画动作（show_normal / disrupt / move_drug / restore …）
  target: string;  // 目标对象（sphere / 药名）
  desc: string;    // 该步骤的解说文字
}

export interface Formula {
  name: string;         // 方剂名
  source: string;       // 出处
  category: 'yun_zhou' | 'yun_lun' | 'zhou_lun_bing_yun' | 'yun_shu';
  categoryLabel: string; // 运轴/运轮/轴轮并运/运枢
  /** 别名（条文可能写汤/丸异名，如'理中汤'）——搜索与联动都认 */
  aliases?: string[];
  drugs: FormulaDrug[]; // 药物组成
  applicableSyndromes: string[]; // 适用证型
  animationScript: AnimationStep[]; // 3D 动画脚本
  notes?: string;       // 补充说明
  // ── formula_detail_v2 交付的信息卡扩展（可选，逐方补齐）──
  pinyin?: string;
  contraindications?: string[];   // 禁忌
  keyDifferentiation?: string;    // 鑑別要點
  /** 相关方剂（可含括注说明；UI 取括号前的方名尝试深链） */
  relatedFormulaNames?: string[];
  formulaStructure?: string;      // 君臣佐使一行式
  keyConcept?: string;            // 圆运动关键词
  modernAnalogy?: string;         // 💡 现代比喻
  specialNotes?: string[];        // 服法要点（桂枝汤特有）
  doseComparison?: string;        // 剂量对比（通脉四逆汤 vs 四逆汤）
  // ── 化裁树字段（DELIVERY_FORMULA_TREE_FIX：两棵独立树 + 桥梁）──
  /** 所属家族树的母方名（'桂枝汤' / '麻黄汤'）；母方自身也填 */
  familyRoot?: string;
  /** 直接母方名（树的父节点，如 桂枝加大黄汤 → 桂枝加芍药汤） */
  parentFormula?: string;
  derivativeType?: 'base' | 'add' | 'remove' | 'modify';
  addedHerbs?: string[];
  removedHerbs?: string[];
  modifiedHerbs?: Array<{ name: string; from: string; to: string }>;
  /** 桥梁方注记（葛根汤：挂桂枝树下，治法已跨入麻黄汤家族） */
  bridgeNote?: string;
}

/**
 * 药性配色
 */
export const DRUG_COLORS = {
  hot:     { hex: '#C0392B', three: 0xC0392B },  // 大热·深红
  warm:    { hex: '#E74C3C', three: 0xE74C3C },  // 温·红
  neutral: { hex: '#F39C12', three: 0xF39C12 },  // 平·黄
  cool:    { hex: '#3498DB', three: 0x3498DB },  // 凉·蓝
  cold:    { hex: '#2C3E50', three: 0x2C3E50 },  // 寒·深蓝
  sour:    { hex: '#8E44AD', three: 0x8E44AD },  // 酸收·紫（乌梅）
};

// ==================== 桂枝汤 ====================
const GUIZHI_TANG: Formula = {
  name: '桂枝汤',
  familyRoot: '桂枝汤',
  derivativeType: 'base',
  source: '《伤寒论》第12条',
  category: 'yun_lun',
  categoryLabel: '运轮（先调木）',
  drugs: [
    {
      name: '桂枝', dose: '三两', ratio: 1.0,
      nature: 'warm', color: 0xE74C3C, colorHex: '#E74C3C',
      meridian: '肺/膀胱', position: [-2, 1.5, 0],
      action: '升肝木——从左侧向上升，恢复木气升发',
      role: '君'
    },
    {
      name: '芍药', dose: '三两', ratio: 1.0,
      nature: 'cool', color: 0x3498DB, colorHex: '#3498DB',
      meridian: '肝/脾', position: [2, -1, 0],
      action: '降胆木——从右侧向下降，恢复木气收敛',
      role: '臣'
    },
    {
      name: '生姜', dose: '三两', ratio: 0.8,
      nature: 'warm', color: 0xE67E22, colorHex: '#E67E22',
      meridian: '肺/脾', position: [0.5, 0.5, 1],
      action: '温胃降逆——从中轴向上，温散胃中寒气',
      role: '佐'
    },
    {
      name: '大枣', dose: '十二枚', ratio: 0.6,
      nature: 'neutral', color: 0xF39C12, colorHex: '#F39C12',
      meridian: '脾/胃', position: [-0.5, -0.5, 0.5],
      action: '补脾益气——居中，调和脾胃',
      role: '佐'
    },
    {
      name: '炙甘草', dose: '二两', ratio: 0.5,
      nature: 'neutral', color: 0x8B6914, colorHex: '#8B6914',
      meridian: '心/肺/脾/胃', position: [0, 0, 0],
      action: '调和诸药——居中，缓急和中',
      role: '使'
    }
  ],
  pinyin: 'guì zhī tāng',
  applicableSyndromes: ['太阳中风', '汗出恶风', '头痛发热', '脉浮缓', '营卫不和'],
  contraindications: ['太阳伤寒无汗脉紧（用麻黄汤）', '酒客病（湿热内蕴）', '阳盛阴虚'],
  keyDifferentiation: '与"麻黄汤"区别：桂枝汤治中风（有汗脉缓·营卫不和），麻黄汤治伤寒（无汗脉紧·肺气不宣）。一治疏泄太过，一治收敛太过。',
  relatedFormulaNames: ['桂枝加葛根汤（项背强几几）', '桂枝加厚朴杏子汤（喘家）', '桂枝去芍药汤（胸满阳郁）', '小建中汤（倍芍药+饴糖）'],
  formulaStructure: '君（桂枝）升左 · 臣（芍药）降右 · 佐（姜枣）和中 · 使（甘草）调和',
  keyConcept: '一升一降·营卫调和·圆运动平衡',
  modernAnalogy: '交通十字路口的红绿灯坏了。桂枝=修好绿灯（通行），芍药=修好红灯（节制），姜枣=路面维修，甘草=交通指挥中心。修好后车流重新有序循环。',
  specialNotes: [
    '服已须臾，啜热稀粥一升余——助药力发汗',
    '温覆令一时许——保暖助汗',
    '遍身漐漐微似有汗者益佳——微汗即可，不可大汗淋漓',
    '若一服汗出病差，停后服——中病即止，不可过服'
  ],
  animationScript: [
    { time: 0,    action: 'show_normal',  target: 'sphere', desc: '正常圆运动状态' },
    { time: 2,    action: 'disrupt',     target: 'sphere', desc: '营卫不和→球体表面粒子紊乱' },
    { time: 4,    action: 'move_drug',   target: '桂枝',   desc: '桂枝↑升肝木，左侧绿色增强' },
    { time: 6,    action: 'move_drug',   target: '芍药',   desc: '芍药↓降胆木，右侧蓝色增强' },
    { time: 8,    action: 'move_drug',   target: '生姜',   desc: '生姜温胃，中轴暖光' },
    { time: 10,   action: 'move_drug',   target: '大枣',   desc: '大枣补脾，中轴黄色增强' },
    { time: 12,   action: 'move_drug',   target: '炙甘草', desc: '炙甘草居中调和' },
    { time: 14,   action: 'restore',     target: 'sphere', desc: '圆运动恢复平稳旋转' },
  ],
  notes: '桂枝汤是《伤寒论》第一方，彭子益用圆运动理论解读为"调营卫即调木气之升降"。桂枝升木、芍药降木，一升一降，木气圆运动恢复。'
};

// ==================== 理中丸 ====================
const LIZHONG_WAN: Formula = {
  name: '理中丸',
  aliases: ['理中汤', '理中丸（汤）'],
  source: '《伤寒论》·《圆运动的古中医学》古方上篇',
  category: 'yun_zhou',
  categoryLabel: '运轴（直接修轴）',
  drugs: [
    {
      name: '人参', dose: '三两', ratio: 1.0,
      nature: 'warm', color: 0xE74C3C, colorHex: '#E74C3C',
      meridian: '脾/肺', position: [0, 0.5, 0.5],
      action: '补中益气——直补中轴，恢复脾的升清功能（君）',
      role: '君'
    },
    {
      name: '白术', dose: '三两', ratio: 1.0,
      nature: 'warm', color: 0xD35400, colorHex: '#D35400',
      meridian: '脾/胃', position: [-0.5, -0.3, 0],
      action: '健脾燥湿——助脾运化水谷（臣）',
      role: '臣'
    },
    {
      name: '干姜', dose: '三两', ratio: 1.0,
      nature: 'hot', color: 0xC0392B, colorHex: '#C0392B',
      meridian: '脾/胃/心/肺', position: [0.5, -0.5, 0],
      action: '温中散寒——恢复胃的降浊功能（臣）',
      role: '臣'
    },
    {
      name: '炙甘草', dose: '三两', ratio: 0.8,
      nature: 'neutral', color: 0x8B6914, colorHex: '#8B6914',
      meridian: '心/肺/脾/胃', position: [0, 0, 0],
      action: '调和诸药，缓急和中（使）',
      role: '使'
    }
  ],
  pinyin: 'lǐ zhōng wán',
  applicableSyndromes: ['腹满而吐', '自利不渴', '时腹自痛', '喜温喜按', '中气大虚'],
  contraindications: ['阳明腑实（承气证）', '少阳枢不转（小柴胡证）', '湿热内蕴（酒客）'],
  keyDifferentiation: '与"桂枝加芍药汤"：理中直运轴（轴大虚·重证），彼运轮复轴（轴微损·轻证）。与"四逆汤"：理中治太阴（脾阳虚·中焦），四逆治少阴（肾阳虚·下焦根本）。',
  relatedFormulaNames: ['四逆汤（少阴根本）', '附子理中汤（兼温肾阳）', '桂枝加芍药汤（运轮复轴）'],
  formulaStructure: '君（人参）补气 · 臣（白术）燥湿（干姜）温中 · 使（甘草）固轴',
  keyConcept: '直运轴·轴转则轮自行',
  modernAnalogy: '像给一台彻底冻住的发动机点火：干姜是火花塞，白术是除霜剂，人参是燃油，甘草是固定支架。点火后发动机自己就转起来了。',
  specialNotes: ['丸剂：炼蜜为丸如鸡子黄大，日三四服、夜二服；汤剂水煎日三服', '腹中未热，益至三四丸——丸剂可加量至腹中觉热'],
  animationScript: [
    { time: 0,  action: 'show_normal',  target: 'sphere', desc: '正常圆运动状态' },
    { time: 2,  action: 'disrupt_axis', target: 'axis',   desc: '中轴损坏→球体旋转减速/停止' },
    { time: 4,  action: 'move_drug',   target: '人参',   desc: '人参飞向中心轴→补中益气' },
    { time: 6,  action: 'move_drug',   target: '白术',   desc: '白术飞向中心轴→健脾燥湿' },
    { time: 8,  action: 'move_drug',   target: '干姜',   desc: '干姜飞向中心轴→温中散寒' },
    { time: 10, action: 'move_drug',   target: '炙甘草', desc: '炙甘草飞向中心轴→调和' },
    { time: 12, action: 'restore_axis', target: 'axis',   desc: '轴开始旋转→外围轮叶跟着转' },
    { time: 14, action: 'restore',     target: 'sphere', desc: '整个球体恢复平稳旋转' },
  ],
  notes: '理中丸是"运轴"的代表方。彭子益说："轴运轮行，轮运轴灵。"轴先坏，不管轮，直接修轴。四味药全冲中焦脾胃，轴一转，轮自己跟着转。'
};

// ==================== 小建中汤 ====================
const XIAO_JIAN_ZHONG_TANG: Formula = {
  name: '小建中汤',
  familyRoot: '桂枝汤',
  parentFormula: '桂枝汤',
  derivativeType: 'modify',
  modifiedHerbs: [{ name: '芍药', from: '三两', to: '六两' }],
  addedHerbs: ['饴糖'],
  source: '《伤寒论》·《圆运动的古中医学》古方上篇',
  category: 'yun_lun',
  categoryLabel: '运轮（治轮救轴）',
  drugs: [
    {
      name: '桂枝', dose: '三两', ratio: 0.8,
      nature: 'warm', color: 0xE74C3C, colorHex: '#E74C3C',
      meridian: '肺/膀胱', position: [-1.5, 1, 0],
      action: '桂枝汤底——调和营卫（君）',
      role: '君'
    },
    {
      name: '倍芍药', dose: '六两', ratio: 1.5,
      nature: 'cool', color: 0x2980B9, colorHex: '#2980B9',
      meridian: '肝/脾', position: [2, -1.5, 0],
      action: '倍用芍药——把上冲的相火收降下来（关键！君）',
      role: '君'
    },
    {
      name: '生姜', dose: '三两', ratio: 0.8,
      nature: 'warm', color: 0xE67E22, colorHex: '#E67E22',
      meridian: '肺/脾', position: [0.5, 0.5, 1],
      action: '温胃散邪（臣）',
      role: '臣'
    },
    {
      name: '大枣', dose: '十二枚', ratio: 0.6,
      nature: 'neutral', color: 0xF39C12, colorHex: '#F39C12',
      meridian: '脾/胃', position: [-0.5, -0.5, 0.5],
      action: '补脾益气（佐使）',
      role: '佐使'
    },
    {
      name: '炙甘草', dose: '二两', ratio: 0.5,
      nature: 'neutral', color: 0x8B6914, colorHex: '#8B6914',
      meridian: '心/肺/脾/胃', position: [0, 0, 0],
      action: '调和诸药（佐使）',
      role: '佐使'
    },
    {
      name: '饴糖', dose: '一升', ratio: 1.2,
      nature: 'warm', color: 0xF5B041, colorHex: '#F5B041',
      meridian: '脾/胃', position: [0, -0.8, 0],
      action: '甜味入脾，趁机补中——这是"建中"的关键药物（君）',
      role: '君'
    }
  ],
  pinyin: 'xiǎo jiàn zhōng tāng',
  applicableSyndromes: ['心中悸而烦', '腹中急痛', '喜温喜按', '虚劳里急', '面色无华'],
  contraindications: ['纯实热（承气证）', '阳明腑实', '湿热内蕴'],
  keyDifferentiation: '与"理中丸"：小建中是桂枝汤底+饴糖（轮轴并运·轻证），理中直运轴（轴大虚·重证）。与"桂枝加芍药汤"：小建中多饴糖（建中更强），彼无饴糖（和脾为主）。',
  relatedFormulaNames: ['桂枝加芍药汤（无饴糖）', '理中丸（直运轴）', '黄芪建中汤（加黄芪）'],
  formulaStructure: '君（桂枝·芍药·饴糖）运轮+和里+建中 · 臣（生姜）和胃 · 佐使（枣草）和中',
  keyConcept: '建中气·轮轴并运（先轮后轴）',
  modernAnalogy: '像先调皮带（桂枝调营卫）、给轴承加倍润滑（倍芍药），再直接给油箱加满蜜一样的好油（饴糖建中）。',
  specialNotes: ['水煎去滓，纳饴糖微火消解', '饴糖须后下，不可久煎——否则失其甘温建中之性'],
  animationScript: [
    { time: 0,  action: 'show_normal',  target: 'sphere', desc: '正常圆运动状态' },
    { time: 2,  action: 'disrupt_left', target: 'left',   desc: '左侧肝木卡住→相火上冲→左上角紫色过强' },
    { time: 4,  action: 'highlight_drug', target: '倍芍药', desc: '倍芍药（关键！）——把上冲的相火拉下来' },
    { time: 6,  action: 'move_drug',   target: '饴糖',   desc: '饴糖甜味入脾→趁机补中' },
    { time: 8,  action: 'move_drug',   target: '桂枝',   desc: '桂枝调和营卫' },
    { time: 10, action: 'restore_left', target: 'left',   desc: '左侧恢复升降→相火归位' },
    { time: 12, action: 'restore',     target: 'sphere', desc: '轮转了→轴间接恢复→球体平稳' },
  ],
  notes: '小建中汤是"运轮"的代表方。思路：轮先卡（肝木不升、郁而化火），先治轮（倍芍药降相火+饴糖补中），轮转了轴自然恢复。'
};

// ==================== 乌梅丸 ====================
const WUMEI_WAN: Formula = {
  name: '乌梅丸',
  source: '《伤寒论》·《圆运动的古中医学》古方上篇',
  category: 'zhou_lun_bing_yun',
  categoryLabel: '轴轮并运（双线作战）',
  drugs: [
    // 第一组：酸苦收降（清上热）
    {
      name: '乌梅', dose: '三百枚', ratio: 1.5,
      nature: 'sour', color: 0x8E44AD, colorHex: '#8E44AD',
      meridian: '肝/脾/肺', position: [-1, 2, 0],
      action: '酸收——收敛上冲的木火',
      role: '君'
    },
    {
      name: '黄连', dose: '十六两', ratio: 1.3,
      nature: 'cold', color: 0x1A252F, colorHex: '#1A252F',
      meridian: '心/肝/胃/大肠', position: [1, 2.5, 0],
      action: '苦降——清降上焦热',
      role: '佐'
    },
    {
      name: '黄柏', dose: '六两', ratio: 1.0,
      nature: 'cold', color: 0x2C3E50, colorHex: '#2C3E50',
      meridian: '肾/膀胱', position: [0, -2.5, 0],
      action: '苦降——清降下焦湿热',
      role: '佐'
    },
    // 第二组：辛温散寒（温下寒+补中）
    {
      name: '干姜', dose: '十两', ratio: 1.2,
      nature: 'hot', color: 0xC0392B, colorHex: '#C0392B',
      meridian: '脾/胃/心/肺', position: [0.8, -0.5, 0],
      action: '温中散寒——恢复中轴',
      role: '臣'
    },
    {
      name: '附子', dose: '六两', ratio: 1.0,
      nature: 'hot', color: 0xA93226, colorHex: '#A93226',
      meridian: '心/肾/脾', position: [-0.5, -2, 0],
      action: '温肾回阳——恢复肾的封藏',
      role: '佐'
    },
    {
      name: '人参', dose: '六两', ratio: 1.0,
      nature: 'warm', color: 0xE74C3C, colorHex: '#E74C3C',
      meridian: '脾/肺', position: [0, 0.3, 0.5],
      action: '补中益气——恢复脾的升清',
      role: '使'
    },
    // 第三组：养血通脉
    {
      name: '当归', dose: '四两', ratio: 0.8,
      nature: 'warm', color: 0xE67E22, colorHex: '#E67E22',
      meridian: '肝/心/脾', position: [-2, 0.5, 0],
      action: '养血和血——疏通经脉',
      role: '佐'
    },
    {
      name: '桂枝', dose: '六两', ratio: 1.0,
      nature: 'warm', color: 0xD35400, colorHex: '#D35400',
      meridian: '肺/膀胱', position: [-1.5, 1.5, 0],
      action: '温通经脉——助阳化气',
      role: '使'
    },
    // 第四组：辛温散寒
    {
      name: '细辛', dose: '六两', ratio: 0.8,
      nature: 'hot', color: 0x922B21, colorHex: '#922B21',
      meridian: '肺/肾', position: [-2.5, -0.5, 0],
      action: '温经散寒——助阳气升发',
      role: '臣'
    },
    {
      name: '蜀椒', dose: '四两', ratio: 0.7,
      nature: 'hot', color: 0xBA4A00, colorHex: '#BA4A00',
      meridian: '脾/胃/肾', position: [1.5, -1.5, 0],
      action: '温中散寒——助阳气升发',
      role: '佐'
    }
  ],
  pinyin: 'wū méi wán',
  applicableSyndromes: ['上热下寒', '蛔厥', '久利不止', '寒热错杂', '厥阴病'],
  contraindications: ['纯热证无寒象', '纯寒证无热象'],
  keyDifferentiation: '与"四逆汤"区别：四逆是纯寒亡阳（单层面），乌梅丸是寒热错杂（双层面）。四逆=一把火救全局，乌梅丸=同时处理上下两个战场。',
  relatedFormulaNames: ['四逆汤（纯阳救逆）', '干姜黄芩黄连人参汤（上热下寒轻证）', '黄连汤（胸热胃寒）'],
  formulaStructure: '君（乌梅）酸收相火 · 苦寒组（连柏）清上热 · 辛热组（姜辛附椒）温下寒 · 养血组（归桂参）通交接',
  keyConcept: '三组齐发·酸收苦降辛温·复阴阳交接',
  modernAnalogy: '一栋楼的电梯坏了。酸收组=把跑到顶楼的人（相火）请回中间层，苦寒组=给顶楼降温，辛温组=给地下室供暖，养血组=修理电梯让上下畅通。同时开工，整栋楼重新正常运转。',
  specialNotes: ['蜜丸如梧桐子大，先食（空腹）饮服十丸，日三服，稍加至二十丸', '禁生冷、滑物、臭食等', '此为原文服法记载，仅供学习'],
  animationScript: [
    { time: 0,  action: 'show_normal',  target: 'sphere', desc: '正常圆运动状态' },
    { time: 2,  action: 'disrupt_all',  target: 'sphere', desc: '上下同时出问题→球体颜色混乱、旋转不稳' },
    { time: 4,  action: 'group_attack', target: 'group1',  desc: '第一组出击：乌梅+黄连+黄柏→清降上热' },
    { time: 7,  action: 'group_attack', target: 'group2',  desc: '第二组出击：干姜+附子+人参→温补下寒、恢复中轴' },
    { time: 10, action: 'group_attack', target: 'group3',  desc: '第三组出击：当归+桂枝→养血通脉' },
    { time: 13, action: 'group_attack', target: 'group4',  desc: '第四组出击：细辛+蜀椒→温通散寒' },
    { time: 16, action: 'restore',     target: 'sphere', desc: '十味药合力→球体恢复平稳旋转' },
  ],
  notes: '乌梅丸是"轴轮并运"的代表方，也是《伤寒论》厥阴病的核心方。彭子益说：上下皆病，必须双线作战。十味药分四组同时出击，上热清、下寒温、中轴复、经脉通。'
};

// ==================== 四逆汤（DELIVERY_FINAL P0-A · rescue_root）====================
// ==================== 通脉四逆汤（P1 · 四逆汤加量版）====================
// ==================== 白通汤（P1 · 葱白通阳）====================
// 注意：DELIVERY_FINAL 规格误把炙甘草列入白通汤。宋本第314条白通汤只有
// 葱白四茎、干姜一两、附子一枚（生用），无甘草——甘缓恋阴，急通阳气时不用。
// ==================== 真武汤（DELIVERY_FINAL P0-B · water_transform）====================
// ==================== 白头翁汤（P1 · cool_blood）====================
// ════════════ DELIVERY_REMAINING_11（2026-08-19 交付）════════════
// 通用轴轮播放器驱动（drugs 布局 + animationScript）；信息卡字段齐全。
// 交付自检勘误：炙甘草汤补回宋本原方的生姜三两（交付遗漏）。

// ==================== 小柴胡汤（P0 · 运枢第一方）====================
// ==================== 白虎汤（P0 · 清降·阳明经证）====================
// ==================== 大承气汤（P0 · 峻下·釜底抽薪）====================
// ==================== 小承气汤（P1 · 轻下）====================
// ==================== 调胃承气汤（P2 · 润燥微下）====================
// ==================== 麻子仁丸（P2 · 润下·脾约）====================
// ==================== 旋覆代赭汤（P2 · 降逆和胃）====================
// ==================== 黄连汤（P2 · 清上温下）====================
// ==================== 四逆散（P2 · 运枢解郁）====================
// ==================== 桂枝加芍药汤（P1 · 运轮复轴）====================
// ==================== 炙甘草汤（P2 · 阴阳双补·复脉）====================
// 交付遗漏生姜——宋本原方有生姜三两，已按原文补回。
// ════════════ DELIVERY_FORMULA_TREE_FIX（2026-08-19 交付）════════════
// 两棵独立树：麻黄汤家族（表证双祖之一）+ 桂枝汤化裁树（纯加减方）。
// 葛根汤为桥梁方：挂桂枝树下、bridgeNote 注明治法已跨入麻黄汤家族。
// 勘误：交付称葛根汤"真实数据在麻黄汤家族"（realId: gegen_tang），
// 但麻黄汤家族文件并无此条——桥梁存根自带完整数据，即以其为正条。

// ==================== 麻黄汤（独立母方 · 表证双祖）====================
// ==================== 大青龙汤（麻黄汤+石膏 · 表寒里热）====================
// ==================== 小青龙汤（麻黄汤化裁 · 表寒里饮）====================
// ==================== 葛根汤（桥梁方：桂枝树下·治法跨入麻黄家族）====================
// ==================== 桂枝加葛根汤（真·桂枝汤加味）====================
// ==================== 桂枝加厚朴杏子汤 ====================
// ==================== 桂枝去芍药汤 ====================
// ==================== 桂枝去芍药加附子汤 ====================
// ==================== 桂枝加大黄汤 ====================
// ==================== 桂枝麻黄各半汤 ====================
// ==================== 桂枝去桂加茯苓白术汤 ====================
// ════════════ DELIVERY_FINAL_8_ONLY（2026-08-19 交付·收官批次）════════════
// 交付 8 首中麻黄汤为重复交付（库中已有且服法已按宋本修正），实收 7 首；
// 另：交付把"桂枝加附子汤"错等同于"桂枝去芍药加附子汤"——宋本第20条
// 桂枝加附子汤保留芍药、第22条去芍药加附子，是两首方。为真正补齐 100%，
// 桂枝加附子汤按宋本组成自行补录（解读为编辑内容，非交付内容）。

// ==================== 甘草干姜汤（二味·先复其阳）====================
// ==================== 芍药甘草汤（二味·后复其阴）====================
// ==================== 白虎加人参汤（清轮+补轴）====================
// ==================== 附子理中汤（理中+附子·火生土）====================
// ==================== 乌梅白糖汤（彭子益温病第一方）====================
// ==================== 白术枳实干姜白蜜汤（太阴脾气不转）====================
// ==================== 黄芪五物汤加干姜半夏（补气升阳+降逆）====================
// ==================== 桂枝加附子汤（宋本第20条·交付缺失自行补录）====================
// 交付错把本方等同于"桂枝去芍药加附子汤"——宋本第20条桂枝加附子汤保留芍药
// （桂枝汤原方+附子一枚），第22条才去芍药。组成/服法按宋本，解读为编辑内容。
// ==================== 全部方剂导出 ====================
export const FORMULAS: Formula[] = [
  // ⚠️ 开源示例：经方三路四方（运轴/运轮/轴轮并运）。
  // 完整 39 方数据集（含化裁树/动画脚本全集）属于商业内容包。
  GUIZHI_TANG,
  LIZHONG_WAN,
  XIAO_JIAN_ZHONG_TANG,
  WUMEI_WAN,
];

/**
 * 按名称查找方剂
 */
export function getFormulaByName(name: string): Formula | undefined {
  return FORMULAS.find(f => f.name === name || f.aliases?.includes(name));
}

/**
 * 按治法分类获取方剂
 */
export function getFormulasByCategory(cat: Formula['category']): Formula[] {
  return FORMULAS.filter(f => f.category === cat);
}

/**
 * 经方三路概览（用于 3D 对比展示）
 */
export const SAN_LU_OVERVIEW = {
  yun_zhou: {
    label: '运轴',
    desc: '轴先坏，不管轮，直接修轴',
    formula: '理中丸',
    drugs: '人参、白术、干姜、炙甘草',
    visualMetaphor: '修好发动机，车轮自己转',
    color: '#F39C12'
  },
  yun_lun: {
    label: '运轮',
    desc: '轮先卡（肝木不升），治轮救轴',
    formula: '小建中汤',
    drugs: '桂枝汤倍芍药+饴糖',
    visualMetaphor: '先修一个轮子，带动轴',
    color: '#27AE60'
  },
  zhou_lun_bing_yun: {
    label: '轴轮并运',
    desc: '轴轮俱损（上热下寒），双线作战',
    formula: '乌梅丸',
    drugs: '乌梅+连柏+姜附参+归桂+辛椒（十味）',
    visualMetaphor: '同时修发动机和多个轮子',
    color: '#8E44AD'
  }
} as const;

/**
 * 桂枝汤加减化裁树（3D 可展开）
 */
export const GUIZHI_DERIVATIVES = [
  { name: '桂枝汤',          action: 'base',    desc: '调和营卫，恢复木气升降' },
  { name: '桂枝加葛根汤',    action: '+葛根',  desc: '项背强几几，加葛根升津舒筋' },
  { name: '桂枝加厚朴杏子汤', action: '+厚朴杏子', desc: '喘家，加厚朴杏子降气平喘' },
  { name: '桂枝加附子汤',    action: '+附子',  desc: '发汗太过，加附子回阳固表' },
  { name: '桂枝去芍药汤',    action: '-芍药',  desc: '胸满脉促，去芍药之酸收' },
  { name: '小建中汤',        action: '倍芍药+饴糖', desc: '腹中急痛，倍芍药降相火，饴糖补中' },
  { name: '桂枝加龙骨牡蛎汤', action: '+龙牡',  desc: '梦失精，加龙骨牡蛎潜镇安神' },
];
