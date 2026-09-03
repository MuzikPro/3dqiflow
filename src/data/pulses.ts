/**
 * 脉象参考数据（ANIMATION_SPECS_COMPLETE 场景5 + DELIVERY_PULSE_TONGUE_V3）
 *
 * 四个维度（规格书 5.2 的 3D 映射表）：
 *   位（浮/中/沉）→ 波形前后深度；数（迟/缓/数）→ 频率；
 *   形（大/细/弦/滑）→ 振幅与形状；势（有力/无力）→ 亮度。
 * v3 交付补齐了全部 8 脉的圆运动解读/特征/鉴别/关联——属课程输入，
 * 以"学习笔记·未经专家审核"框架展示。
 * 誊写勘误：交付引用的"5.15"条不存在（炙甘草汤条实为少阳·第15条）；
 * 迟脉解读原文误作"少阳病脉迟（第2.7条）"，2.7 在阳明篇，已改。
 */

/** v3 交付 visual3D 逐字段照搬（pulse_tongue_v3/pulse_tongue_data.js，颜色为 0xRRGGBB 数值） */
export interface PulseWaveVisual {
  amplitude: number;
  frequency: number;
  color: number;
  opacity: number;
  sync: string;
  outwardPush?: boolean;
  waveShape?: 'sharp_peak' | 'round_peak' | 'narrow';
}
export interface PulseVisual3D {
  leftWave: PulseWaveVisual;
  rightWave: PulseWaveVisual;
  centerAxis: {
    rotationSpeed: number; color: number; glow: number; stable: boolean;
    tilt?: string; vibration?: boolean; vibrationFreq?: number;
    coldEffect?: boolean; heatEffect?: boolean; thinEffect?: boolean; smoothness?: boolean;
  };
  humanSilhouette: {
    color: number; opacity: number; pulseWave: string;
    skinLayer?: string; temperature?: string; tension?: string; texture?: string; thickness?: string;
  };
}

export interface PulseType {
  name: string;
  pinyin?: string;
  /** 位：float=浮（体表前方） mid=中 deep=沉（体内后方） */
  position: 'float' | 'mid' | 'deep';
  /** 数：每秒波动次数（迟≈1，缓≈3，数≈5） */
  frequency: number;
  /** 形：振幅 0.2细 – 0.8大 */
  amplitude: number;
  /** 弦脉的锯齿波形 */
  sawtooth: boolean;
  /** 势：0–1，映射亮度 */
  strength: number;
  desc: string;
  /** 特征五维（至数/节律/力量/深度/形态） */
  characteristics?: { rate: string; rhythm: string; strength: string; depth: string; shape: string };
  /** 圆运动解读 */
  interpretation?: string;
  keyPoint?: string;
  modernAnalogy?: string;
  /** 关联条文（内部 id，articleLabel() 显示） */
  relatedArticleIds?: number[];
  /** 关联方剂（中文名；在库者可深链） */
  relatedFormulaNames?: string[];
  differentialDiagnosis?: Array<{ vs: string; diff: string }>;
  studyPoints?: string[];
  /** v3 交付的 3D 参数，逐字段照搬（owner 2026-08-27：literal port） */
  visual3D?: PulseVisual3D;
}

export const PULSES: PulseType[] = [
  {
    name: '平脉', pinyin: 'píng mài', position: 'mid', frequency: 3, amplitude: 0.5, sawtooth: false, strength: 0.8,
    desc: '从容和缓，左右升降波形同步、振幅匹配。',
    visual3D: { leftWave: { amplitude: 1, frequency: 1, color: 0x27AE60, opacity: 0.7, sync: 'synchronized' }, rightWave: { amplitude: 1, frequency: 1, color: 0xFFD700, opacity: 0.7, sync: 'synchronized' }, centerAxis: { rotationSpeed: 1, color: 0xF39C12, glow: 0.6, stable: true }, humanSilhouette: { color: 0x2C3E50, opacity: 0.5, pulseWave: 'gentle' } },
    characteristics: { rate: '一息四至（约60-80次/分）', rhythm: '节律均匀', strength: '从容和缓', depth: '不浮不沉', shape: '不大不小' },
    interpretation: '脉来一息四至，不快不慢，是心肺胃肾之气各守其位。左手对应肝（升）心（降）——木火之气左旋；右手对应肺（降）肾（升）——金水之气右转。左右脉象大小相等、节律一致，说明圆运动无偏胜、无阻滞。彭子益："平人之脉，如天之圆，如车之轮，周流不息。"',
    keyPoint: '平脉 = 圆运动正常运行的唯一标准态',
    modernAnalogy: '平脉就像一台调校过的精密钟表——秒针（左升）和分针（右降）同步转动，齿轮（中轴脾胃）咬合精准，不快不慢，不偏不倚。',
    relatedArticleIds: [], relatedFormulaNames: [], differentialDiagnosis: [],
    studyPoints: [
      '平脉是判断一切病脉的"基准线"——先识平，再识病',
      '左右手脉象应大小相等——左>右为升太过，右>左为降太过',
      '脉率和缓=中气充足=脾胃轴运转正常'
    ]
  },
  {
    name: '浮脉', pinyin: 'fú mài', position: 'float', frequency: 3, amplitude: 0.55, sawtooth: false, strength: 0.7,
    desc: '位浮：轻取即得，波形显现于体表前方。',
    visual3D: { leftWave: { amplitude: 1.5, frequency: 1.2, color: 0x27AE60, opacity: 0.85, sync: 'left_dominant', outwardPush: true }, rightWave: { amplitude: 0.7, frequency: 0.9, color: 0xFFD700, opacity: 0.5, sync: 'suppressed' }, centerAxis: { rotationSpeed: 1.1, color: 0xF39C12, glow: 0.5, stable: false, tilt: 'left_heavy' }, humanSilhouette: { color: 0x27AE60, opacity: 0.6, pulseWave: 'outward', skinLayer: 'active' } },
    characteristics: { rate: '随病而异', rhythm: '轻取即得', strength: '举之有余，按之不足', depth: '浮在皮肤', shape: '如水漂木' },
    interpretation: '浮脉轻取即得，如水漂木——气血被邪气压向体表，左升之力偏亢奋。彭子益："浮脉为阳脉，主表证。左升太过，右降不及，中轴略倾。邪在太阳之表，营卫不和。"浮而有力=太阳伤寒（麻黄汤证）；浮而缓=太阳中风（桂枝汤证）；浮而数=表邪有化热之势。',
    keyPoint: '浮脉 = 左升偏亢 = 邪在表 = 太阳病',
    modernAnalogy: '浮脉就像煮沸的水壶——热量（邪气压向体表）让水蒸汽大量往外冒（左升亢奋），壶盖被顶得砰砰响（脉浮有力）。',
    relatedArticleIds: [1, 2, 12, 13],
    relatedFormulaNames: ['桂枝汤', '麻黄汤', '桂枝加葛根汤'],
    differentialDiagnosis: [
      { vs: '沉脉', diff: '浮脉轻取即得（表证）vs 沉脉重按始得（里证）' },
      { vs: '数脉', diff: '浮脉主"位"（浅深）vs 数脉主"率"（快慢）——浮数并见=表热' }
    ],
    studyPoints: [
      '浮脉第一要义：辨表里——浮=表证，沉=里证',
      '浮而有力=表实（麻黄汤）；浮而缓=表虚（桂枝汤）',
      '浮脉的左升亢奋≠健康升发——是被邪气压出来的"假升"'
    ]
  },
  {
    name: '沉脉', pinyin: 'chén mài', position: 'deep', frequency: 3, amplitude: 0.5, sawtooth: false, strength: 0.6,
    desc: '位沉：重按始得，波形沉于体内后方。',
    visual3D: { leftWave: { amplitude: 0.5, frequency: 0.7, color: 0x1A3A2E, opacity: 0.4, sync: 'suppressed' }, rightWave: { amplitude: 0.5, frequency: 0.7, color: 0x8B6914, opacity: 0.4, sync: 'suppressed' }, centerAxis: { rotationSpeed: 0.4, color: 0x8B6914, glow: 0.3, stable: true, tilt: 'centered' }, humanSilhouette: { color: 0x1A1A2E, opacity: 0.7, pulseWave: 'inward', skinLayer: 'dim' } },
    characteristics: { rate: '随病而异', rhythm: '重按始得', strength: '举之不足，按之有余', depth: '沉在筋骨', shape: '如石投水' },
    interpretation: '沉脉重按始得，如石投水——气血被压向体内深层，左升之力不足。彭子益："沉脉为阴脉，主里证。阳气内陷，升发无力。"沉而有力=里实证（承气汤证）；沉而迟=里寒证（四逆汤证）；沉而细=少阴病（脉微细·但欲寐）。',
    keyPoint: '沉脉 = 升发不足 = 邪入里 = 阳陷',
    modernAnalogy: '沉脉就像深井里的水泵——水流（气血）被压到了很深的地方，在井口（轻取）什么都感觉不到，必须下到井底（重按）才能摸到水流。',
    relatedArticleIds: [2001, 3001, 281, 5007],
    relatedFormulaNames: ['大承气汤', '四逆汤', '白虎汤'],
    differentialDiagnosis: [
      { vs: '浮脉', diff: '沉脉重按始得（里证）vs 浮脉轻取即得（表证）' },
      { vs: '微脉', diff: '沉脉按之有余（里实/里寒）vs 微脉似有似无（阳气衰微）' }
    ],
    studyPoints: [
      '沉脉第一要义：辨深浅——沉=里证',
      '沉而有力=里实（承气）；沉而无力=里虚（四逆）',
      '沉脉的中轴转速减慢≠健康稳定——是"升发被压抑"'
    ]
  },
  {
    name: '迟脉', pinyin: 'chí mài', position: 'mid', frequency: 1, amplitude: 0.5, sawtooth: false, strength: 0.55,
    desc: '数迟：一息三至以下，波动缓慢（约每秒一次）。',
    visual3D: { leftWave: { amplitude: 0.8, frequency: 0.4, color: 0x27AE60, opacity: 0.5, sync: 'slow' }, rightWave: { amplitude: 0.8, frequency: 0.4, color: 0xFFD700, opacity: 0.5, sync: 'slow' }, centerAxis: { rotationSpeed: 0.3, color: 0x8B4513, glow: 0.2, stable: true, coldEffect: true }, humanSilhouette: { color: 0x1A3ADE, opacity: 0.6, pulseWave: 'slow_cold', temperature: 'cold' } },
    characteristics: { rate: '一息三至以下（<60次/分）', rhythm: '来去俱慢', strength: '随寒热而异', depth: '随表里而异', shape: '如人行路迟缓' },
    interpretation: '迟脉一息三至，来去俱慢——全身阳气推动无力。彭子益："迟为寒脉。阳气不足，则升降俱慢。"迟而有力=寒实证（如冷积）；迟而无力=阳虚证（四逆汤证）。阳明腑实亦可脉迟（阳明·第7条大承气证）——燥屎内结、气血被敛，非寒也，此为"迟"之变局，须结合潮热谵语分辨。',
    keyPoint: '迟脉 = 阳不足/寒盛 = 升降俱慢（但须辨有力无力）',
    modernAnalogy: '迟脉就像冬天的河流——水流（气血）因为寒冷（阳虚）而变得缓慢，河面甚至开始结冰（迟而无力）；但如果是冰块堵塞（冷积实证），水流也会慢却有力。',
    relatedArticleIds: [2007, 3003, 281],
    relatedFormulaNames: ['四逆汤', '理中丸', '附子理中汤'],
    differentialDiagnosis: [
      { vs: '数脉', diff: '迟脉一息三至以下（寒/阳虚）vs 数脉一息六至以上（热/阴虚）' },
      { vs: '缓脉', diff: '迟脉偏慢（<60/分）vs 缓脉从容和缓（60-80/分·平脉之缓）' }
    ],
    studyPoints: [
      '迟脉≠都是阳虚——须辨有力无力',
      '迟而有力=寒实（冷积）；迟而无力=阳虚（四逆）',
      '阳明·第7条大承气证脉迟=燥屎内结敛气血，是"假迟"，结合潮热谵语可辨'
    ]
  },
];
