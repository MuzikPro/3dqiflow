/**
 * 内容安全闸的执行处（owner 2026-09-04）。
 *
 * 这些用例断言的是产品边界而非风格偏好：应用不得成为症状→取穴推荐器，
 * 不得出现操作性医嘱，坐标与出处不得谎报状态。任何一条失败都应视为
 * 发布阻断，而不是待办。
 */
import { describe, it, expect } from 'vitest';
import { scanText, isLocReviewState, LOC_REVIEW_STATES } from '../src/utils/contentSafety';
import { ACUPOINTS, MERIDIAN_META } from '../src/data/acupoints';
import { DERIVED_POINTS } from '../src/data/acupointsDerived';
import { FORMULAS } from '../src/data/formulas';
import { ARTICLES } from '../src/data/articles';
import { EN } from '../src/i18nDict';

/** 项目自撰文案的取用范围：界面词典、推导规则说明、方剂的项目解读字段。
 *  经典原文（条文 originalText 等）是历史引用，不在闸内——见 contentSafety.ts 头注。 */
function projectProse(): Array<{ where: string; text: string }> {
  const out: Array<{ where: string; text: string }> = [];
  for (const [zh, en] of Object.entries(EN)) {
    out.push({ where: `i18nDict[${zh}]`, text: en });
    out.push({ where: `i18nDict key ${zh}`, text: zh });
  }
  for (const p of DERIVED_POINTS) {
    if (p.rule) out.push({ where: `derived ${p.code}.rule`, text: p.rule });
    if (p.note) out.push({ where: `derived ${p.code}.note`, text: p.note });
  }
  for (const f of FORMULAS) {
    for (const k of ['yuanundongMeaning', 'analogy', 'differentiation'] as const) {
      const v = (f as Record<string, unknown>)[k];
      if (typeof v === 'string') out.push({ where: `formula ${f.name}.${k}`, text: v });
    }
  }
  for (const a of ARTICLES) {
    out.push({ where: `article ${a.id}.yuanundong`, text: a.yuanundongInterpretation });
    out.push({ where: `article ${a.id}.modern`, text: a.modernText });
  }
  return out;
}

describe('prohibited medical-guidance wording', () => {
  it('no project-written prose contains procedural or recommendation language', () => {
    const offenders = projectProse()
      .map((p) => ({ ...p, hits: scanText(p.text) }))
      .filter((p) => p.hits.length > 0)
      .map((p) => `${p.where}: ${p.hits.map((h) => `${h.ruleZh}("${h.excerpt}")`).join(', ')}`);
    expect(offenders).toEqual([]);
  });

  it('the scanner actually catches what it claims to catch', () => {
    // 闸本身必须可证伪：这些串必须被拦下，否则上面的通过毫无意义
    expect(scanText('直刺 0.5 寸')).not.toEqual([]);
    expect(scanText('三棱针点刺放血')).not.toEqual([]);
    expect(scanText('艾灸 15 分钟')).not.toEqual([]);
    expect(scanText('建议取足三里穴')).not.toEqual([]);
    expect(scanText('可治愈此病')).not.toEqual([]);
    // 而正常教学陈述必须放行
    expect(scanText('肺经自胸走手，属降')).toEqual([]);
    expect(scanText('The Lung meridian runs from chest to hand.')).toEqual([]);
  });
});

describe('search stays name-only (no symptom → point recommender)', () => {
  it('the searchable index exposes names, codes and pinyin only', () => {
    // 与 AcupointControls.nameIndex() 同构：可搜的键只由这些字段构成
    const searchable = [
      ...MERIDIAN_META.map((m) => m.zh),
      ...ACUPOINTS.map((p) => p.zh),
      ...ACUPOINTS.map((p) => p.code),
      ...ACUPOINTS.map((p) => p.pinyin)
    ];
    // 主治/功效类词汇一旦可搜，应用即成为推荐器——必须一个都搜不到
    const symptomTerms = ['头痛', '失眠', '腹泻', '咳嗽', '发热', '主治', '功效', '适应症'];
    const leaked = symptomTerms.filter((t) => searchable.some((s) => s.includes(t)));
    expect(leaked).toEqual([]);
  });

  it('acupoint records carry no indication/treats field at all', () => {
    const forbiddenKeys = ['indications', 'treats', 'zhuzhi', '主治', 'gongxiao', '功效'];
    const present = Object.keys(ACUPOINTS[0]).filter((k) => forbiddenKeys.includes(k));
    expect(present).toEqual([]);
  });
});

describe('per-point provenance is declared, not implied', () => {
  it('every acupoint declares a legal review state', () => {
    const bad = ACUPOINTS
      .filter((p) => !isLocReviewState(p.locReview))
      .map((p) => `${p.code}: ${p.locReview}`);
    expect(bad).toEqual([]);
    expect(LOC_REVIEW_STATES.length).toBeGreaterThan(0);
  });

  it('location text and its review state never disagree', () => {
    // 有定位文本 ⇔ 已核对来源；随内容包发布的点必须是空文本，不得半真半假
    const mismatched = ACUPOINTS.filter((p) =>
      (p.loc.trim().length > 0) !== (p.locReview === 'source_checked')
    ).map((p) => `${p.code}: loc="${p.loc.slice(0, 12)}" review=${p.locReview}`);
    expect(mismatched).toEqual([]);
  });

  it('every derived point states the rule it was derived by', () => {
    const ruleless = DERIVED_POINTS
      .filter((p) => !p.rule || p.rule.trim().length === 0)
      .map((p) => p.code);
    expect(ruleless).toEqual([]);
  });
});
