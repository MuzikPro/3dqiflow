/**
 * 舌象参考数据（ANIMATION_SPECS_COMPLETE 场景5 + DELIVERY_PULSE_TONGUE_V3）
 *
 * 舌面分区（彭子益，规格书 5.3）：
 *   舌尖=心火(上)，舌中=脾胃(中轴)，舌根=肾水(下)，舌边=肝胆(左右)
 *
 * v3 交付新增 3 种舌质（红舌/淡白舌/燥裂舌）并补齐既有苔型的
 * 解读/鉴别/关联；灰黑苔与剥苔为规格书原有条目（v3 未覆盖）。
 */

/** v3 交付 visual3D 逐字段照搬（pulse_tongue_v3/pulse_tongue_data.js；
 *  灰黑苔/剥苔两条交付无 visual3D，按其余字段呈现） */
export interface TongueVisual3D {
  tongueBody: {
    color: number; emissive: number; roughness: number; thickness: number;
    texture: string; cracks?: boolean; crackDepth?: number; teethMarks?: boolean;
  };
  coating: {
    color: number; emissive?: number; thickness: number; coverage: number;
    texture: string; colorGradient?: Record<string, number>;
  };
  sublingualVeins: {
    color: number; thickness: 'very_thin' | 'thin' | 'normal' | 'thick'; visibility: number;
  };
}

export interface TongueCoating {
  name: string;
  pinyin?: string;
  /** 圆运动解读 */
  interpretation: string;
  keyPoint?: string;
  modernAnalogy?: string;
  /** 特征（舌色/舌苔/润燥/形态/质地） */
  characteristics?: { color: string; coating: string; moisture: string; shape: string; texture: string };
  /** 苔层覆盖范围 */
  coverage: 'thin-all' | 'front' | 'full' | 'rear' | 'none';
  coatColor: string;    // 苔色
  coatOpacity: number;
  roughness: number;
  /** 舌体色（剥苔时深红发亮） */
  bodyColor: string;
  bodyEmissive: number;
  /** 舌尖是否偏红（黄苔） */
  redTip: boolean;
  /** 舌体胖瘦（1=常态，>1 胖大，<1 瘦薄） */
  bodyScale?: number;
  /** 燥裂纹 */
  cracks?: boolean;
  /** 齿痕（脾虚湿盛） */
  teethMarks?: boolean;
  relatedArticleIds?: number[];
  relatedFormulaNames?: string[];
  differentialDiagnosis?: Array<{ vs: string; diff: string }>;
  studyPoints?: string[];
  /** v3 交付的 3D 参数，逐字段照搬（owner 2026-08-27：literal port） */
  visual3D?: TongueVisual3D;
}

/** 舌体常色（淡红） */
export const TONGUE_BODY_COLOR = '#D98880';

export const TONGUE_COATINGS: TongueCoating[] = [
  {
    name: '薄白苔（正常·淡红舌）', pinyin: 'dàn hóng shé · báo bái tāi',
    visual3D: { tongueBody: { color: 0xFF6B6B, emissive: 0x441111, roughness: 0.4, thickness: 1, texture: 'smooth', cracks: false, teethMarks: false }, coating: { color: 0xFFF8E1, thickness: 0.1, coverage: 0.7, texture: 'fine' }, sublingualVeins: { color: 0x8B0000, thickness: 'normal', visibility: 0.5 } },
    interpretation: '淡红舌、薄白苔，是圆运动正常运行的舌象标志。彭子益："舌为心之苗，亦为脾胃之外候。"淡红舌=心血充足+脾胃运化正常=中气健旺；薄白苔=胃气尚存、未受邪气熏蒸——"有胃气则生"的舌象体现。',
    keyPoint: '淡红舌薄白苔 = 圆运动正常 = 有胃气',
    modernAnalogy: '淡红舌就像新鲜的三文鱼刺身——颜色粉嫩有光泽，表面微微湿润但不水滑，柔软有弹性。',
    characteristics: { color: '淡红色', coating: '薄白苔', moisture: '润泽', shape: '大小适中', texture: '舌质柔软' },
    coverage: 'thin-all', coatColor: '#F5F0E8', coatOpacity: 0.2, roughness: 0.5,
    bodyColor: TONGUE_BODY_COLOR, bodyEmissive: 0.1, redTip: false,
    relatedArticleIds: [], relatedFormulaNames: [],
    differentialDiagnosis: [],
    studyPoints: [
      '淡红舌是所有病舌的"基准色"——先识正常，再识异常',
      '薄白苔=有胃气——哪怕有病，苔薄白就有救',
      '舌色变深=热/火；变浅=寒/虚；变紫=瘀'
    ]
  },
  {
    name: '红舌（热盛）', pinyin: 'hóng shé',
    visual3D: { tongueBody: { color: 0xFF0000, emissive: 0x880000, roughness: 0.3, thickness: 0.9, texture: 'dry', cracks: true, teethMarks: false }, coating: { color: 0xFFD700, thickness: 0.2, coverage: 0.8, texture: 'coarse' }, sublingualVeins: { color: 0xFF0000, thickness: 'thick', visibility: 0.8 } },
    interpretation: '红舌者，圆运动之"火"太过也。舌红=热入气分或血分。苔薄黄=气分热（白虎汤证）；苔黄燥=热盛伤津（白虎加人参证·大渴）；舌红绛=热入营血。彭子益："舌红为热。舌愈红，热愈深。"',
    keyPoint: '红舌 = 热盛 = 右降受阻（火不降）',
    modernAnalogy: '红舌就像一块被烤得过火的砖——颜色从淡红变成鲜红甚至暗红，表面失去水分变得干燥，轻轻一碰可能还会掉渣（裂纹）。',
    characteristics: { color: '鲜红色', coating: '薄黄或黄燥苔', moisture: '偏干', shape: '大小适中或略瘦', texture: '舌质偏硬' },
    coverage: 'front', coatColor: '#E5C100', coatOpacity: 0.5, roughness: 0.7,
    bodyColor: '#C0392B', bodyEmissive: 0.25, redTip: false, bodyScale: 0.95, cracks: true,
    relatedArticleIds: [2005, 2006, 3001],
    relatedFormulaNames: ['白虎汤', '白虎加人参汤'],
    differentialDiagnosis: [
      { vs: '薄白苔（正常）', diff: '红舌鲜红少津（热盛）vs 淡红舌润泽（正常）' },
      { vs: '燥裂舌', diff: '红舌尚润有苔（热盛未至极）vs 燥裂舌瘦薄干裂无苔（津枯·危）' }
    ],
    studyPoints: [
      '舌红+苔薄黄=气分热（白虎汤）',
      '舌红+苔黄燥+大渴=热盛津伤（白虎加人参）',
      '舌红绛+无苔=热入营血（更深一层）'
    ]
  },
  {
    name: '淡白舌（阳虚/血虚）', pinyin: 'dàn bái shé',
    visual3D: { tongueBody: { color: 0xFFE4E0, emissive: 0x221111, roughness: 0.6, thickness: 1.3, texture: 'soft_pale', cracks: false, teethMarks: true }, coating: { color: 0xE8F4E9, thickness: 0.15, coverage: 0.8, texture: 'slippery' }, sublingualVeins: { color: 0x4A0000, thickness: 'thin', visibility: 0.3 } },
    interpretation: '淡白舌者，圆运动之"火"不足也。舌胖大齿痕=脾虚湿盛（理中丸证）；舌淡白滑润=阳虚水泛（真武汤证）；舌淡白无华=气血大虚（炙甘草汤证）。彭子益："舌淡白为寒。白而滑润为阳虚有湿，白而干枯为血虚无津。"',
    keyPoint: '淡白舌 = 阳虚/血虚 = 圆运动根本火不足',
    modernAnalogy: '淡白舌就像泡发过度的白木耳——颜色不是健康的粉红而是惨白，体积膨胀变大（胖大），边缘还带着牙齿压出来的印子（齿痕）。',
    characteristics: { color: '淡白色', coating: '薄白苔或白滑苔', moisture: '湿润或水滑', shape: '胖大齿痕', texture: '舌质松软' },
    coverage: 'thin-all', coatColor: '#EAF7EF', coatOpacity: 0.35, roughness: 0.35,
    bodyColor: '#F2D7D5', bodyEmissive: 0.05, redTip: false, bodyScale: 1.15, teethMarks: true,
    relatedArticleIds: [273, 4005, 281, 5012],
    relatedFormulaNames: ['理中丸', '四逆汤', '真武汤', '炙甘草汤'],
    differentialDiagnosis: [
      { vs: '薄白苔（正常）', diff: '淡白舌色淡无华（阳虚血虚）vs 淡红舌润泽有神（正常）' },
      { vs: '红舌', diff: '淡白舌白滑湿润（阳虚寒盛）vs 红舌黄燥少津（热盛）' }
    ],
    studyPoints: [
      '舌淡白胖大齿痕=脾虚湿盛（理中丸）',
      '舌淡白滑润=阳虚水泛（真武汤）',
      '舌淡白无华=气血大虚（炙甘草汤）'
    ]
  },
  {
    name: '黄苔（热）', pinyin: 'huáng tāi',
    visual3D: { tongueBody: { color: 0xFF3333, emissive: 0x440000, roughness: 0.3, thickness: 0.9, texture: 'dry_hot' }, coating: { color: 0xFFD700, emissive: 0x443300, thickness: 0.3, coverage: 0.85, texture: 'grainy', colorGradient: { light: 0xFFF8E1, medium: 0xFFD700, dark: 0x8B6914 } }, sublingualVeins: { color: 0xCC0000, thickness: 'thick', visibility: 0.7 } },
    interpretation: '黄苔者，圆运动之"降"受阻也。苔色由淡黄→深黄→老黄，对应热邪由浅入深。薄黄=热在气分（白虎汤）；黄厚干燥=热盛津伤（白虎加人参）；黄燥老裂=热结阳明（承气汤·潮热谵语）。彭子益："黄苔为胃热。苔愈黄愈厚愈燥，热愈深结。"',
    keyPoint: '黄苔 = 胃热不降 = 右降受阻 = 热邪由浅入深',
    modernAnalogy: '黄苔就像锅底烧焦的痕迹——刚开始是薄薄一层淡黄（微热），继续烧变成深黄（热盛），最后变成焦色的老黄（热极）——火力越大，锅底颜色越深越厚。',
    characteristics: { color: '舌体偏红', coating: '黄苔（淡黄→深黄→老黄）', moisture: '干燥少津', shape: '大小适中', texture: '苔质粗糙颗粒' },
    coverage: 'front', coatColor: '#E5C100', coatOpacity: 0.75, roughness: 0.8,
    bodyColor: TONGUE_BODY_COLOR, bodyEmissive: 0.12, redTip: true,
    relatedArticleIds: [2005, 2006, 2007, 2013],
    relatedFormulaNames: ['白虎汤', '白虎加人参汤', '大承气汤', '小承气汤'],
    differentialDiagnosis: [
      { vs: '白厚腻苔', diff: '黄苔（热·右降受阻）vs 白苔（寒/表·左升受阻）' },
      { vs: '灰黑苔', diff: '黄苔（热极将转黑）vs 灰黑苔（热极或寒极·须结合润燥辨）' }
    ],
    studyPoints: [
      '薄黄=气分热（白虎）；黄厚燥=津伤（白虎加人参）',
      '黄燥老裂=热结阳明（承气汤）',
      '黄苔的"干湿度"比"颜色深浅"更能判断津伤程度'
    ]
  },
];

/** 舌面分区 × 圆运动（规格书：光环颜色按五行） */
export const TONGUE_REGIONS = [
  { key: 'tip', label: '舌尖·心火', element: 'fire' as const, position: [0, 0.16, 1.15] as [number, number, number], radius: 0.32 },
  { key: 'center', label: '舌中·脾胃', element: 'earth' as const, position: [0, 0.2, 0.1] as [number, number, number], radius: 0.42 },
  { key: 'root', label: '舌根·肾水', element: 'water' as const, position: [0, 0.22, -0.85] as [number, number, number], radius: 0.4 },
  { key: 'sideL', label: '舌边·肝胆', element: 'wood' as const, position: [-0.62, 0.16, 0.1] as [number, number, number], radius: 0.26 },
  { key: 'sideR', label: '舌边·肝胆', element: 'wood' as const, position: [0.62, 0.16, 0.1] as [number, number, number], radius: 0.26 }
];

/**
 * 六经脉舌联合诊断矩阵（v3 交付）：脉+舌+病机+方剂 四联对应。
 * pulseKey/tongueKey 指向本工程 PULSES / TONGUE_COATINGS 的现有条目
 * （复合脉名如"浮缓"取主脉做 3D 演示，原文标签保留展示）。
 */
export interface CombinedDiagnosis {
  syndrome: string;
  pulseLabel: string;
  pulseKey: string;
  tongueLabel: string;
  tongueKey: string;
  yuanYundong: string;
  formula: string;
}

export const COMBINED_DIAGNOSIS: CombinedDiagnosis[] = [
  { syndrome: '太阳中风', pulseLabel: '浮缓', pulseKey: '浮脉', tongueLabel: '淡红·薄白苔', tongueKey: '薄白苔（正常·淡红舌）', yuanYundong: '左升偏亢（浮）+ 中轴微晃（缓）= 营卫不和', formula: '桂枝汤' },
  { syndrome: '太阳伤寒', pulseLabel: '浮紧', pulseKey: '浮脉', tongueLabel: '淡红·薄白苔', tongueKey: '薄白苔（正常·淡红舌）', yuanYundong: '左升被寒邪束缚（浮紧）= 卫闭营郁', formula: '麻黄汤' },
];
