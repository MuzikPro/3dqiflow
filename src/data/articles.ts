/**
 * ⚠️ OPEN-SOURCE SAMPLE DATA — 示例数据（8 条）。完整 96 条标注数据集属于
 * 3DQiFlow 商业内容包，不随开源仓库分发。
 *
 * 伤寒论条文数据 + 圆运动解读
 * 
 * 用法：
 *   import { ARTICLES, getArticleByNumber } from '@/data/articles';
 * 
 * 在 3D 双栏阅读页中：
 *   - 左栏显示原文 + 拼音
 *   - 右栏显示 3D 圆运动解读 + 彭子益注解
 */

/** 圆运动病机状态（脚本F"文字驱动3D"用；由本条 yuanundongInterpretation 提炼，非新增临床判断） */
export interface QiState {
  affectedTrack: 'left' | 'right' | 'center' | 'both';
  /** stagnant=受阻；reversed=逆乱；ascend=升发欲解；descend=降复欲解（少阳篇引入：右降恢复） */
  direction: 'stagnant' | 'reversed' | 'ascend' | 'descend';
  severity: 1 | 2 | 3;
}

export interface Article {
  id: number;          // 条文编号
  bookSource: 'shanghan' | 'yuanundong';
  chapter: string;      // 篇章
  originalText: string; // 原文
  pinyinText?: string;  // 拼音标注
  modernText: string;   // 白话解读
  yuanundongInterpretation: string; // 圆运动视角解读
  relatedMeridians: string[];  // 涉及经络
  relatedFormulas: string[];     // 涉及方剂
  related3DScene?: string;       // 关联 3D 场景 ID
  difficulty: 1 | 2 | 3;     // 难度
  tags: string[];               // 标签
  /** 六经归属（取自 chapter）+ 病机短语（摘自本条解读原文） */
  syndrome?: { meridian: string; pathogen: string; qiState: QiState };
  /** 胡希恕六经辨证视角注解（补齐数据提供者才有） */
  huXishuComment?: string;
  /** 对应方剂在圆运动中的作用一句话（补齐数据 formula.action） */
  formulaAction?: string;
  /**
   * 冲突双保留的交叉链接（DELIVERY_FINAL 裁决）：同一条文既按伤寒论原编次
   * 保留在少阳篇，又按圆运动病机定位保留在少阴篇，两条互指。
   */
  crossLink?: { targetId: number; reason: string };
  /** 脉舌联动（DELIVERY_PULSE_TONGUE_V3 指令⑤）：本条典型脉+舌，链接脉舌3D */
  pulseTongue?: { pulse: string; tongue: string; label: string };
  /** 显示编号。阳明篇交付数据用篇内序号（2.1…），非宋本条文号——
   *  不伪造canonical编号，显示为"阳明·第N条"；缺省时显示"第{id}条" */
  displayLabel?: string;
}

/** 条文显示编号（阳明篇为篇内序号，太阳篇为通行条文号） */
export function articleLabel(article: Article): string {
  return article.displayLabel ?? `第${article.id}条`;
}

/**
 * 伤寒论前 30 条（太阳病篇为主）
 */
export const ARTICLES: Article[] = [
  {
    id: 1,
    bookSource: 'shanghan',
    chapter: '辨太阳病脉证并治上',
    originalText: '太阳之为病，脉浮，头项强痛而恶寒。',
    pulseTongue: { pulse: '浮脉', tongue: '薄白苔（正常·淡红舌）', label: '浮缓脉 + 淡红舌薄白苔' },
    pinyinText: 'tài yáng zhī wéi bìng, mài fú, tóu xiàng qiáng tòng ér wù hán.',
    modernText: '太阳经发生病变，脉象浮，头痛、后脖子发紧疼痛，并且怕风怕冷。',
    yuanundongInterpretation: '太阳病者，营卫不和也。营卫者，气血之表也。太阳经主一身之表，营卫之气运行于体表，如球体最外层之粒子流动。营卫不和，则球体表面粒子紊乱，失去正常的顺时针旋转。',
    relatedMeridians: ['膀胱经', '小肠经'],
    relatedFormulas: ['桂枝汤', '麻黄汤'],
    related3DScene: 'taiyang_yingwei',
    difficulty: 1,
    tags: ['太阳病', '总纲', '营卫'],
    syndrome: { meridian: '太阳', pathogen: '营卫不和（球体表面粒子紊乱）', qiState: { affectedTrack: 'left', direction: 'stagnant', severity: 1 } }
  },
  {
    id: 2,
    bookSource: 'shanghan',
    chapter: '辨太阳病脉证并治上',
    originalText: '太阳病，发热汗出，恶风脉缓者，名为中风。',
    pinyinText: 'tài yáng bìng, fā rè hàn chū, wù fēng mài huǎn zhě, míng wéi zhòng fēng.',
    modernText: '太阳病，出现发热、出汗、怕风、脉缓的，叫做中风。',
    yuanundongInterpretation: '中风者，营弱卫强也。卫气外浮而不得收敛（金气不降），营气内弱而不得升发（木气不升）。桂枝汤者，桂枝升肝木以助营，芍药降胆木以收卫，生姜温胃，大枣补脾，炙甘草和中。一升一降，营卫乃和。',
    relatedMeridians: ['膀胱经', '肺经', '脾经'],
    relatedFormulas: ['桂枝汤'],
    related3DScene: 'guizhi_tang',
    difficulty: 1,
    tags: ['太阳中风', '桂枝汤证', '营卫不和'],
    syndrome: { meridian: '太阳', pathogen: '营弱卫强：金气不降·木气不升', qiState: { affectedTrack: 'left', direction: 'stagnant', severity: 1 } }
  },
  {
    id: 3,
    bookSource: 'shanghan',
    chapter: '辨太阳病脉证并治上',
    originalText: '太陽病，或已發熱，或未發熱，必惡寒，體痛，嘔逆，脈陰陽俱緊者，名為傷寒。',
    pinyinText: 'tài yáng bìng, huò yǐ fā rè, huò wèi fā rè, bì wù hán, tǐ tòng, ǒu nì, mài yīn yáng jù jǐn zhě, míng wéi shāng hán.',
    modernText: '太阳病，有的已经发热，有的还没有发热，但一定怕冷，身体疼痛，呕吐气逆，脉象尺寸都紧的，叫做伤寒。',
    yuanundongInterpretation: '伤寒者，寒伤营也。寒性收敛，卫气被寒所束不得外达，营气亦被凝滞不得流通。体痛者，寒伤皮毛，经气不通。呕逆者，胃气因寒而上逆。脉紧者，气血被寒收敛之象。圆运动中，寒令收敛，左升之木气被寒束于表，不得外发，故用麻黄汤开表散寒——麻黄轻清升发（升左），桂枝温通血脉（助升），杏仁降肺气（降右），甘草和中（运轴）。一升一降一和，圆运动复。',
    relatedMeridians: ['膀胱经', '小肠经'],
    relatedFormulas: ['麻黄汤'],
    difficulty: 2,
    tags: ['伤寒', '麻黄汤', '脉紧', '无汗'],
    syndrome: { meridian: '太阳', pathogen: '寒邪伤营，卫阳被遏', qiState: { affectedTrack: 'left', direction: 'stagnant', severity: 2 } },
    formulaAction: '麻黄升卫开表 + 桂枝温通助升 + 杏仁降肺 + 甘草和中'
  },
  {
    id: 4,
    bookSource: 'shanghan',
    chapter: '辨太阳病脉证并治上',
    originalText: '傷寒一日，太陽受之，脈若靜者，為不傳；頗欲吐，若躁煩，脈數急者，為傳也。',
    pinyinText: 'shāng hán yī rì, tài yáng shòu zhī, mài ruò jìng zhě, wéi bù chuán; pǒ yù tù, ruò zào fán, mài shuò jí zhě, wéi chuán yě.',
    modernText: '伤寒第一天，太阳经受病，脉象平静的，说明病不会传变；如果很想呕吐，或者烦躁不安，脉象数急的，说明病在传变。',
    yuanundongInterpretation: '圆运动传变之理：太阳病若中气充足（胃气强），圆运动本身力量足以抗邪于表，则脉静而不传。若中气虚（胃弱），邪乘虚而入，由表入里——或传阳明（胃），或传少阳（胆）。颇欲吐者，胃气上逆，有传阳明之势；躁烦者，相火不降，有传少阳之象。脉数急者，圆运动加速紊乱之象。',
    relatedMeridians: ['膀胱经', '小肠经'],
    relatedFormulas: [],
    difficulty: 1,
    tags: ['传变', '脉静', '中气'],
    syndrome: { meridian: '太阳', pathogen: '邪在表，传变与否取决于中气强弱', qiState: { affectedTrack: 'center', direction: 'ascend', severity: 1 } }
  },
  {
    id: 5,
    bookSource: 'shanghan',
    chapter: '辨太阳病脉证并治上',
    originalText: '傷寒二三日，陽明、少陽證不見者，為不傳也。',
    pinyinText: 'shāng hán èr sān rì, yáng míng, shào yáng zhèng bù jiàn zhě, wéi bù chuán yě.',
    modernText: '伤寒过了两三天，如果没有出现阳明病或少阳病的症状，说明病没有传变。',
    yuanundongInterpretation: '二三日仍不见阳明之燥渴、少阳之口苦咽干，说明圆运动之力足以将邪留在太阳表层，未向内传。此即\'正气存内，邪不可干\'之圆运动解释——中轴（脾胃）有力，轮圈自然运转不紊。',
    relatedMeridians: ['膀胱经', '小肠经'],
    relatedFormulas: [],
    difficulty: 1,
    tags: ['不传', '阳明', '少阳'],
    syndrome: { meridian: '太阳', pathogen: '邪留太阳，未传阳明少阳', qiState: { affectedTrack: 'center', direction: 'ascend', severity: 1 } }
  },
  {
    id: 6,
    bookSource: 'shanghan',
    chapter: '辨太阳病脉证并治上',
    originalText: '太陽病，發熱而渴，不惡寒者，為溫病。',
    pinyinText: 'tài yáng bìng, fā rè ér kě, bù wù hán zhě, wéi wēn bìng.',
    modernText: '太阳病，发热而口渴，不怕冷的，是温病。',
    yuanundongInterpretation: '温病与伤寒截然不同！伤寒是寒伤营（收敛），温病是木火之气疏泄太过（开泄）。发热而渴者，津液已被热伤；不恶寒者，表气已开，非寒邪闭表。圆运动视角：温病是\'相火不藏，木气疏泄\'——左升太过，右降不及。彭子益强调：温病忌用桂枝汤（桂枝更助疏泄），当用乌梅白糖汤收敛相火，或三豆饮清热养津。误用辛温发汗则津竭火炽。',
    relatedMeridians: ['膀胱经', '小肠经'],
    relatedFormulas: ['乌梅白糖汤'],
    difficulty: 2,
    tags: ['温病', '忌汗', '相火', '乌梅白糖汤'],
    syndrome: { meridian: '太阳', pathogen: '温邪犯表，津液已伤', qiState: { affectedTrack: 'left', direction: 'reversed', severity: 2 } },
    formulaAction: '乌梅酸收相火 + 白糖养中润燥'
  },
  {
    id: 7,
    bookSource: 'shanghan',
    chapter: '辨太阳病脉证并治上',
    originalText: '病有發熱惡寒者，發於陽也；無熱惡寒者，發於陰也。發於陽者七日愈，發於陰者六日愈。',
    pinyinText: 'bìng yǒu fā rè wù hán zhě, fā yú yáng yě; wú rè wù hán zhě, fā yú yīn yě. fā yú yáng zhě qī rì yù, fā yú yīn zhě liù rì yù.',
    modernText: '病有发热怕冷的，是发于阳；没有发热只怕冷的，是发于阴。发于阳的七天痊愈，发于阴的六天痊愈。',
    yuanundongInterpretation: '发于阳者，卫气与外邪相争于表，故发热恶寒——太阳病也。发于阴者，无热恶寒，邪直中三阴（太阴/少阴/厥阴），中气已虚，圆运动之力不足抗邪于表。七日愈者，行其经尽（太阳经气循环一周）；六日愈者，阴经气数也。此即圆运动\'经气周流\'的时间节律。',
    relatedMeridians: ['膀胱经', '小肠经'],
    relatedFormulas: [],
    difficulty: 1,
    tags: ['发于阳', '发于阴', '七日愈', '六日愈'],
    syndrome: { meridian: '太阳/三阴', pathogen: '发于阳=表证；发于阴=里虚寒', qiState: { affectedTrack: 'both', direction: 'stagnant', severity: 1 } }
  },
  {
    id: 8,
    bookSource: 'shanghan',
    chapter: '辨太阳病脉证并治上',
    originalText: '太陽病，頭痛至七日以上自愈者，以行其經盡故也。',
    pinyinText: 'tài yáng bìng, tóu tòng zhì qī rì yǐ shàng zì yù zhě, yǐ xíng qí jīng jìn gù yě.',
    modernText: '太阳病，头痛等症状到七天后自行痊愈的，是因为邪气在太阳经已经行尽一周。',
    yuanundongInterpretation: '七日者，太阳经气一周之数。圆运动本身有自愈之力——若中气不虚，七日经气来复，邪自退。此即\'正气存内\'之自然恢复。若七日不愈，则须药助其圆运动。',
    relatedMeridians: ['膀胱经', '小肠经'],
    relatedFormulas: [],
    difficulty: 1,
    tags: ['七日自愈', '行其经尽'],
    syndrome: { meridian: '太阳', pathogen: '邪在太阳，经尽自愈', qiState: { affectedTrack: 'left', direction: 'ascend', severity: 1 } }
  },
];

/**
 * 按条文编号查找
 */
export function getArticleByNumber(num: number): Article | undefined {
  return ARTICLES.find(a => a.id === num);
}

/**
 * 按六经分类
 */
export function getArticlesByMeridian(meridian: string): Article[] {
  return ARTICLES.filter(a => a.relatedMeridians.includes(meridian));
}

/**
 * 按难度筛选
 */
export function getArticlesByDifficulty(level: 1 | 2 | 3): Article[] {
  return ARTICLES.filter(a => a.difficulty === level);
}
