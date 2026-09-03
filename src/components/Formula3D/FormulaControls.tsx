import { useState } from 'react';
import { Formula, FormulaDrug, FORMULAS, getFormulaByName } from '@/data/formulas';
import { ARTICLES, articleLabel } from '@/data/articles';
import { getPengQuote } from '@/data/learningPath';
import { getAcademicDisclaimer, annotateFormula } from '@/utils/academicCheck';
import { UI, RADIUS, COLORS } from '@/styles/theme';
import { panelStyle, toggleButtonStyle } from '../UI/panelStyle';
import { tr } from '@/i18n';

interface Props {
  formula: Formula;
  onPickFormula: (f: Formula) => void;
  /** 化裁树占场时收起中部内容卡 */
  cardVisible?: boolean;
  /** 相关条文：跳到条文阅读并定位该条 */
  onOpenArticle?: (id: number) => void;
}

/** ④ 圆运动定位 chip 色（DELIVERY_WISDOM：运轮红/运轴黄/运枢绿/轴轮并运紫） */
const CATEGORY_CHIP: Record<Formula['category'], { label: string; color: string }> = {
  yun_lun: { label: '运轮', color: COLORS.fire.primary },
  yun_zhou: { label: '运轴', color: COLORS.earth.primary },
  yun_shu: { label: '运枢', color: COLORS.wood.primary },
  zhou_lun_bing_yun: { label: '轴轮并运', color: COLORS.minister.primary }
};

/** 君臣佐使角色色（theme 语义色：君=火红 臣=土黄 佐=水蓝 使=木绿） */
const ROLE_COLORS: Record<NonNullable<FormulaDrug['role']>, string> = {
  君: COLORS.fire.primary,
  臣: COLORS.earth.primary,
  佐: COLORS.water.primary,
  使: COLORS.wood.primary,
  佐使: COLORS.water.primary
};

function Tag({ text, color, onClick }: { text: string; color: string; onClick?: () => void }) {
  const style = {
    display: 'inline-block',
    fontSize: '10px',
    padding: '2px 8px',
    borderRadius: RADIUS.pill,
    marginRight: '4px',
    marginBottom: '4px',
    color,
    border: `1px solid ${color}`,
    background: 'transparent',
    cursor: onClick ? 'pointer' : 'default'
  } as const;
  return onClick ? (
    <button onClick={onClick} style={style}>
      {text} →
    </button>
  ) : (
    <span style={style}>{text}</span>
  );
}

/** 来源路径：沿 parentFormula 链回溯到母方（如 桂枝汤 → 桂枝加芍药汤 → 桂枝加大黄汤） */
function lineagePath(formula: Formula): string[] {
  const chain = [formula.name];
  let cursor = formula.parentFormula;
  let guard = 0;
  while (cursor && guard++ < 6) {
    chain.unshift(cursor);
    cursor = FORMULAS.find((f) => f.name === cursor)?.parentFormula;
  }
  return chain;
}

function SectionTitle({ text }: { text: string }) {
  return (
    <div style={{ fontSize: '10px', color: UI.textMuted, letterSpacing: '2px', margin: '10px 0 5px' }}>
      {text}
    </div>
  );
}

/** 君臣佐使排序（无角色的排最后，保持数据序） */
const ROLE_ORDER: Record<string, number> = { 君: 0, 臣: 1, 佐: 2, 佐使: 3, 使: 4 };
function sortedDrugs(formula: Formula): FormulaDrug[] {
  return [...formula.drugs].sort(
    (a, b) => (a.role ? ROLE_ORDER[a.role] : 9) - (b.role ? ROLE_ORDER[b.role] : 9)
  );
}

/** 一味药的一行：名/角色/剂量/归经/作用 各归其列（对齐由 .drug-grid 定） */
function FragmentRow({ d }: { d: FormulaDrug }) {
  return (
    <>
      <span style={{ fontSize: '13px', color: UI.textPrimary, fontWeight: 'bold', whiteSpace: 'nowrap' }}>
        <span style={{
          display: 'inline-block', width: '9px', height: '9px', borderRadius: '50%',
          background: d.colorHex, border: `1px solid ${UI.panelBorder}`, marginRight: '7px'
        }} />
        {d.name}
      </span>
      <span>
        {d.role && (
          <span style={{
            fontSize: '10px', color: ROLE_COLORS[d.role], border: `1px solid ${ROLE_COLORS[d.role]}`,
            borderRadius: '8px', padding: '0 6px', whiteSpace: 'nowrap'
          }}>{tr(d.role)}</span>
        )}
      </span>
      <span style={{ fontSize: '12px', color: UI.textPrimary, whiteSpace: 'nowrap' }}>{d.dose}</span>
      <span style={{ fontSize: '11px', color: UI.textMuted }}>{tr('归经')} {d.meridian}</span>
      <span className="drug-action" style={{ fontSize: '11px', color: UI.textSecondary, lineHeight: 1.6 }}>
        {d.action}
      </span>
    </>
  );
}

export function FormulaControls(props: Props) {
  const { formula, onPickFormula, cardVisible = true, onOpenArticle } = props;
  // 相关条文就地引文：点条号先在卡内展开原文，再决定是否跳条文阅读
  const [openCiteId, setOpenCiteId] = useState<number | null>(null);
  const quote = getPengQuote(formula.name);
  // 相关条文实时从条文库推导（不信任静态引用数，保持与阅读页一致）；认别名（理中汤=理中丸）
  const citingArticles = ARTICLES.filter((a) =>
    a.relatedFormulas.some((n) => n === formula.name || formula.aliases?.includes(n))
  );

  return (
    <>
      {/* 左侧：方剂选择 + 信息卡（formula_detail_v2 扩展） */}
      <div
        className="panel-left"
        style={{
          ...panelStyle,
          position: 'fixed', left: '20px', top: '90px', zIndex: 100,
          borderRadius: RADIUS.md, padding: '14px 16px', width: '250px',
          maxHeight: '78vh', overflowY: 'auto'
        }}
      >
        <div style={{ fontSize: '11px', color: UI.textMuted, marginBottom: '8px' }}>{tr('经方三路 · 选方')}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {FORMULAS.map((f) => (
            <button key={f.name} style={toggleButtonStyle(f.name === formula.name)} onClick={() => onPickFormula(f)}>
              {f.name}
            </button>
          ))}
        </div>
      </div>

      {/* 中部：方剂内容卡（owner 2026-08-26：球与圆撤下，选中即在页面中部读方） */}
      {cardVisible && <div
        className="formula-card"
        style={{
          ...panelStyle,
          position: 'fixed', left: '300px', right: '180px', top: '90px', bottom: '24px',
          zIndex: 90, borderRadius: RADIUS.md, padding: '22px 28px',
          maxWidth: '780px', margin: '0 auto', overflowY: 'auto'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: UI.accent, letterSpacing: '2px' }}>{formula.name}</div>
          <div style={{ fontSize: '11px', color: UI.textMuted }}>
            {formula.pinyin && <em>{formula.pinyin} · </em>}
            {formula.source} · {formula.categoryLabel}
          </div>
        </div>
        {/* ④ 圆运动定位标签组（数据驱动：category + keyConcept） */}
        <div style={{ margin: '8px 0 4px' }}>
          <Tag text={tr(CATEGORY_CHIP[formula.category].label)} color={CATEGORY_CHIP[formula.category].color} />
          {formula.keyConcept &&
            formula.keyConcept.split('·').slice(0, 3).map((part) => (
              <Tag key={part} text={part} color={UI.textMuted} />
            ))}
        </div>

        <SectionTitle text={tr('药物组成 · 君臣佐使')} />
        <div className="drug-grid">
          {sortedDrugs(formula).map((d) => (
            <FragmentRow key={d.name} d={d} />
          ))}
        </div>

        {formula.parentFormula && (
          <>
            <SectionTitle text={tr('化裁 · 来源路径')} />
            <div style={{ fontSize: '11px', color: UI.textPrimary, lineHeight: 1.7 }}>
              <span style={{ color: UI.accent }}>{lineagePath(formula).join(' → ')}</span>
              {formula.removedHerbs?.length ? ` · ${tr('去')} ${formula.removedHerbs.join('、')}` : ''}
              {formula.modifiedHerbs?.length
                ? ' · ' + formula.modifiedHerbs.map((m) => `${m.name} ${m.from}→${m.to}`).join('、')
                : ''}
              {formula.addedHerbs?.length ? ` · ${tr('加')} ${formula.addedHerbs.join('、')}` : ''}
              {formula.bridgeNote && (
                <div style={{ color: COLORS.fire.primary, marginTop: '3px' }}>⇄ {formula.bridgeNote}</div>
              )}
            </div>
          </>
        )}
        <SectionTitle text={tr('适用证型')} />
        <div>
          {formula.applicableSyndromes.map((sy) => (
            <Tag key={sy} text={sy} color={COLORS.wood.primary} />
          ))}
        </div>

        {formula.contraindications && (
          <>
            <SectionTitle text={tr('禁忌')} />
            <div>
              {formula.contraindications.map((c) => (
                <Tag key={c} text={c} color={COLORS.fire.primary} />
              ))}
            </div>
          </>
        )}

        {formula.keyDifferentiation && (
          <>
            <SectionTitle text={tr('鉴别要点')} />
            <div style={{ fontSize: '11px', color: UI.textPrimary, lineHeight: 1.7 }}>
              {formula.keyDifferentiation}
            </div>
          </>
        )}

        {formula.formulaStructure && (
          <>
            <SectionTitle text={tr('圆运动方义')} />
            <div style={{ fontSize: '11px', color: UI.textPrimary, lineHeight: 1.7 }}>
              {formula.formulaStructure}
              {formula.keyConcept && (
                <div style={{ color: UI.accent, marginTop: '3px' }}>🔑 {formula.keyConcept}</div>
              )}
            </div>
          </>
        )}

        {formula.modernAnalogy && (
          <>
            <SectionTitle text={tr('比喻')} />
            <div
              style={{
                fontSize: '11px', color: UI.textSecondary, lineHeight: 1.7,
                borderLeft: `3px solid ${COLORS.water.primary}`, paddingLeft: '10px'
              }}
            >
              💡 {formula.modernAnalogy}
            </div>
          </>
        )}

        {formula.specialNotes && (
          <>
            <SectionTitle text={tr('服法要点')} />
            <ul style={{ fontSize: '11px', color: UI.textPrimary, lineHeight: 1.8, paddingLeft: '16px', margin: 0 }}>
              {formula.specialNotes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </>
        )}

        {formula.doseComparison && (
          <>
            <SectionTitle text={tr('剂量对比')} />
            <div
              style={{
                fontSize: '11px', color: UI.textPrimary, lineHeight: 1.7,
                border: `1px solid ${UI.panelBorder}`, borderRadius: RADIUS.sm, padding: '8px 10px'
              }}
            >
              {formula.doseComparison}
            </div>
          </>
        )}

        {formula.relatedFormulaNames && (
          <>
            <SectionTitle text={tr('相关方剂')} />
            <div>
              {formula.relatedFormulaNames.map((rel) => {
                const base = rel.split('（')[0].trim();
                const target = getFormulaByName(base);
                return (
                  <Tag
                    key={rel}
                    text={rel}
                    color={COLORS.minister.primary}
                    onClick={target ? () => onPickFormula(target) : undefined}
                  />
                );
              })}
            </div>
          </>
        )}

        {citingArticles.length > 0 && (
          <>
            <SectionTitle text={`${tr('相关条文')}（${citingArticles.length}）`} />
            <div>
              {citingArticles.map((a) => (
                <Tag
                  key={a.id}
                  text={articleLabel(a)}
                  color={openCiteId === a.id ? UI.accent : COLORS.water.primary}
                  onClick={() => setOpenCiteId(openCiteId === a.id ? null : a.id)}
                />
              ))}
            </div>
            {openCiteId !== null && (() => {
              const cite = citingArticles.find((a) => a.id === openCiteId);
              if (!cite) return null;
              return (
                <div style={{
                  border: `1px solid ${UI.panelBorder}`, borderLeft: `3px solid ${COLORS.water.primary}`,
                  borderRadius: RADIUS.sm, padding: '10px 12px', margin: '6px 0 2px'
                }}>
                  <div style={{ fontSize: '11px', color: UI.textMuted, marginBottom: '4px' }}>
                    {articleLabel(cite)} · {cite.chapter}
                  </div>
                  <div style={{ fontSize: '13px', color: UI.textPrimary, lineHeight: 1.8 }}>{cite.originalText}</div>
                  <div style={{ fontSize: '11px', color: UI.textSecondary, lineHeight: 1.7, marginTop: '4px' }}>
                    {tr('白话：')}{cite.modernText}
                  </div>
                  {onOpenArticle && (
                    <button
                      onClick={() => onOpenArticle(cite.id)}
                      style={{
                        marginTop: '8px', background: 'transparent', border: `1px solid ${UI.accent}`,
                        color: UI.accent, borderRadius: RADIUS.pill, padding: '3px 12px',
                        cursor: 'pointer', fontSize: '12px'
                      }}
                    >
                      {tr('去条文阅读读全条')} →
                    </button>
                  )}
                </div>
              );
            })()}
          </>
        )}

        {formula.notes && (
          <div style={{ fontSize: '11px', color: UI.textSecondary, lineHeight: 1.7, marginTop: '10px' }}>
            {formula.notes}
          </div>
        )}
        {quote && (
          <>
            <SectionTitle text={tr('彭子益点睛')} />
            <div style={{
              borderLeft: `3px solid ${UI.accent}`, paddingLeft: '12px',
              margin: '2px 0 4px'
            }}>
              <div style={{ fontSize: '13px', color: UI.accent, lineHeight: 1.8 }}>“{quote.text}”</div>
              {quote.modern && (
                <div style={{ fontSize: '11px', color: UI.textSecondary, lineHeight: 1.7, marginTop: '4px' }}>
                  {tr('白话：')}{quote.modern}
                </div>
              )}
              <div style={{ fontSize: '10px', color: UI.textFaint, marginTop: '4px' }}>{quote.source}</div>
            </div>
          </>
        )}
        <div style={{ fontSize: '10px', color: UI.textFaint, marginTop: '8px' }}>{annotateFormula(formula.name)}</div>
        <div style={{ fontSize: '10px', color: UI.textFaint, lineHeight: 1.6, marginTop: '6px' }}>
          {getAcademicDisclaimer()}·{tr('仅供学习，非医疗建议')}
        </div>
      </div>}

    </>
  );
}
