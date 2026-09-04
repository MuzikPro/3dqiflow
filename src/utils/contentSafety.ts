/**
 * 内容安全闸（owner 2026-09-04）：把项目红线变成可执行断言。
 *
 * 本文件描述的是**产品边界**，不是免责声明：应用不得成为「症状 → 取穴/用方」
 * 的推荐器，也不得出现任何操作性医嘱（针刺深度角度、放血、灸量、剂量指令）。
 * 这些规则由 test/content-safety.test.ts 对全部随仓库分发的数据逐条执行，
 * 违反即构建失败——而不是靠人工复核记得住。
 *
 * 说明：本闸检的是**本项目自己写的说明与界面文案**。经典原文（伤寒论条文等）
 * 可能本身含有操作性语句，那属于历史文本引用，不在本闸范围，也从不作为
 * 指引呈现；见 PROSE_FIELDS 的取用范围。
 */

/** 操作性医嘱：针法/灸法/放血/剂量指令——任何一条都不得出现在项目自撰文案里 */
export const PROHIBITED_PROCEDURE = [
  { id: 'needle-depth', zh: '针刺深度', pattern: /(针刺|針刺|直刺|斜刺|平刺|横刺)\s*[0-9０-９.．]+\s*(寸|分|mm|毫米|cm)/ },
  { id: 'needle-angle', zh: '针刺角度', pattern: /(针尖|針尖|进针|進針)[^。；;]{0,12}(角度|向上|向下|朝向)[^。；;]{0,12}(度|°)/ },
  { id: 'moxa-dose', zh: '灸量', pattern: /(艾灸|温灸|溫灸|隔姜灸|隔薑灸)\s*[0-9０-９]+\s*(壮|壯|分钟|分鐘|min)/ },
  { id: 'bloodletting', zh: '放血', pattern: /(点刺|點刺|刺络|刺絡|放血|三棱针|三棱針)/ },
  { id: 'electro', zh: '电针', pattern: /(电针|電針|电刺激|電刺激)\s*[0-9０-９]/ },
  { id: 'dose-order', zh: '剂量指令', pattern: /(每日|每天|一日)\s*[0-9０-９一二三四五六七八九]+\s*(剂|劑|次)\s*[，,。]?\s*(服|口服|温服|溫服|饮|飲)/ }
] as const;

/** 推荐语气：把教学陈述变成对读者的处置建议 */
export const PROHIBITED_RECOMMENDATION = [
  { id: 'imperative-point', zh: '取穴祈使', pattern: /(建议|建議|推荐|推薦|应当|應當|可以)\s*(取|针|針|灸|按揉|按压|按壓)\s*[^，。；]{0,6}(穴|阴交|陽陵|足三里)/ },
  { id: 'treat-your', zh: '对读者施治', pattern: /(你|您|自己)\s*(的)?\s*[^，。；]{0,8}(症状|症狀|病)[^，。；]{0,8}(可|应|應|请|請)\s*(取|用|服|针|針|灸)/ },
  { id: 'cure-claim', zh: '疗效承诺', pattern: /(可治愈|能治愈|根治|保证|保證)[^。；]{0,10}(病|症)/ }
] as const;

export interface SafetyHit {
  ruleId: string;
  ruleZh: string;
  kind: 'procedure' | 'recommendation';
  excerpt: string;
}

/** 逐条扫描一段文案；返回命中的规则（空数组＝通过） */
export function scanText(text: string): SafetyHit[] {
  const hits: SafetyHit[] = [];
  for (const r of PROHIBITED_PROCEDURE) {
    const m = r.pattern.exec(text);
    if (m) hits.push({ ruleId: r.id, ruleZh: r.zh, kind: 'procedure', excerpt: m[0] });
  }
  for (const r of PROHIBITED_RECOMMENDATION) {
    const m = r.pattern.exec(text);
    if (m) hits.push({ ruleId: r.id, ruleZh: r.zh, kind: 'recommendation', excerpt: m[0] });
  }
  return hits;
}

/** 穴位定位文本的审核状态取值（数据层唯一合法集合） */
export const LOC_REVIEW_STATES = ['source_checked', 'content_pack_only'] as const;
export type LocReviewState = typeof LOC_REVIEW_STATES[number];

export function isLocReviewState(v: string): v is LocReviewState {
  return (LOC_REVIEW_STATES as readonly string[]).includes(v);
}
