/**
 * 六经章节 ↔ 节气段映射（DELIVERY_MERGE_ENERGY，2026-08-21）
 *
 * 交付核心洞见：节气剧场与轴轮模型是同一张图——节气内容降级为
 * 轴轮模型的"节气"皮肤，并绑定学习路径才有教学价值。
 *
 * 誊写勘误：
 * - 交付 getTodaySolarTerm() 推算错位（8/20 误得处暑）——弃用，
 *   改用本工程 meridianClock.currentSolarTermIndex（交节日期表）。
 * - 少阳条目其计划书写"高亮春分/秋分二分点"，js 数据却写整段
 *   春分→秋分（半年 12 个节气，失去高亮意义）——取计划书之意，
 *   少阳只点亮二分两点（pointsOnly）。
 * - 交付色值为硬编码 Material 色——弃用，节气色沿用 theme 的
 *   SOLAR_TERMS。
 *
 * detail 文案为交付教学措辞（其学术自检自注"非逐字引文"）。
 */
import { SOLAR_TERMS } from './solarTerms';
import { LEARNING_STAGES, loadReadIds, stageProgress } from './learningPath';

export interface ChapterSolarEntry {
  /** 1-6，对应 LEARNING_STAGES / 六经章节 */
  stage: number;
  solarStart: string;
  solarEnd: string;
  /** 少阳特例：不取区间，只点亮首尾两点（二分点=枢） */
  pointsOnly?: boolean;
  oneLiner: string;
  detail: string;
}

export const CHAPTER_SOLAR_MAP: ChapterSolarEntry[] = [
  {
    stage: 1, solarStart: '春分', solarEnd: '清明',
    oneLiner: '木气升发 · 太阳主开',
    detail: '春分至清明，木气当令，万物升发。对应太阳病"开"的机理——桂枝汤助肝木左升，正合此时令。'
  },
  {
    stage: 2, solarStart: '夏至', solarEnd: '小暑',
    oneLiner: '火气盛长 · 阳明主合',
    detail: '夏至至小暑，火气最盛。对应阳明病"合"的机理——白虎汤清降右路，正合此时令的收敛之势。'
  },
  {
    stage: 3, solarStart: '春分', solarEnd: '秋分', pointsOnly: true,
    oneLiner: '二分之间 · 少阳为枢',
    detail: '春分、秋分两个二分点，恰是少阳"枢"的位置——半表半里，枢转则升降自调。小柴胡汤运枢，正合此象。'
  },
  {
    stage: 4, solarStart: '立秋', solarEnd: '白露',
    oneLiner: '金气始收 · 太阴主湿',
    detail: '立秋至白露，金气始收，湿土当令。对应太阴病"轴坏"——理中丸温中健脾，正合此时令的收降之机。'
  },
  {
    stage: 5, solarStart: '冬至', solarEnd: '冬至',
    oneLiner: '一阳初生 · 少阴主水火',
    detail: '冬至一阳生，为少阴水火之宅。对应少阴病"根本分离"——四逆汤温肾回阳，正合此时令的封藏之始。'
  },
  {
    stage: 6, solarStart: '大寒', solarEnd: '立春',
    oneLiner: '阴尽阳生 · 厥阴主交接',
    detail: '大寒至立春，阴尽阳生之地。对应厥阴病"阴阳交接紊乱"——乌梅丸复阴阳交接，正合此时令的回环之机。'
  }
];

function termIndex(name: string): number {
  return SOLAR_TERMS.findIndex((t) => t.name === name);
}

/** 章节映射 → 需点亮的节气索引（区间沿环取，跨年回绕；少阳只取两点） */
export function highlightIndicesFor(entry: ChapterSolarEntry): number[] {
  const a = termIndex(entry.solarStart);
  const b = termIndex(entry.solarEnd);
  if (a < 0 || b < 0) return [];
  if (entry.pointsOnly) return a === b ? [a] : [a, b];
  const out: number[] = [];
  let i = a;
  for (let guard = 0; guard <= SOLAR_TERMS.length; guard++) {
    out.push(i);
    if (i === b) break;
    i = (i + 1) % SOLAR_TERMS.length;
  }
  return out;
}

/** 学习者当前所在阶（第一个未读完的章；全部读完则第 6 阶） */
export function currentLearningStage(): number {
  const read = loadReadIds();
  for (const meta of LEARNING_STAGES) {
    if (stageProgress(meta.stage, read).pct < 100) return meta.stage;
  }
  return 6;
}
