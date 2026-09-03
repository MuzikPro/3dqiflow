import { ReactNode } from 'react';
import { ARTICLES, Article, articleLabel } from '@/data/articles';
import { getFormulaByName } from '@/data/formulas';
import { MERIDIAN_FLOW } from '@/data/meridians';
import { UI, RADIUS, BACKGROUND, FONTS, COLORS } from '@/styles/theme';
import { panelStyle } from '../UI/panelStyle';

export type ReadingMode = 'plain' | 'full';

interface Props {
  article: Article;
  mode: ReadingMode;
  active: boolean;
  onOpenFormula: (name: string) => void;
  onOpenMeridian: (name: string) => void;
  /** 冲突双保留条文：跳到另一视角的条文（滚动流内跳转） */
  onJumpToArticle: (id: number) => void;
}

function Section({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ marginTop: '14px' }}>
      <div style={{ fontSize: '11px', color: UI.accent, letterSpacing: '2px', marginBottom: '6px' }}>
        {label}
      </div>
      {children}
    </div>
  );
}

/** 联动 chip：有对应 3D 场景的可点击跳转；没有的显示为纯文本 */
function LinkChip({ text, onOpen }: { text: string; onOpen?: () => void }) {
  const base = {
    display: 'inline-block',
    fontSize: '12px',
    padding: '3px 10px',
    borderRadius: RADIUS.pill,
    marginRight: '6px',
    marginBottom: '6px'
  } as const;
  if (!onOpen) {
    return (
      <span style={{ ...base, color: UI.textMuted, border: `1px solid ${UI.panelBorder}` }}>{text}</span>
    );
  }
  return (
    <button
      onClick={onOpen}
      style={{ ...base, color: UI.accent, background: 'transparent', border: `1px solid ${UI.accent}`, cursor: 'pointer' }}
    >
      {text} →3D
    </button>
  );
}

/** 单条条文块（滚动流中的一节；进入视口即驱动右侧 3D） */
export function ArticleBlock({ article, mode, active, onOpenFormula, onOpenMeridian, onJumpToArticle }: Props) {
  const crossTarget = article.crossLink
    ? ARTICLES.find((a) => a.id === article.crossLink!.targetId)
    : undefined;
  return (
    <div id={`article-${article.id}`} style={{ marginBottom: '18px', opacity: active ? 1 : 0.75 }}>
      {/* 原文：宣纸卡片 */}
      <div
        style={{
          background: BACKGROUND.paper,
          color: BACKGROUND.paperText,
          borderRadius: RADIUS.md,
          padding: '20px 24px',
          border: active ? `2px solid ${UI.accent}` : '2px solid transparent'
        }}
      >
        <div style={{ fontSize: '12px', opacity: 0.65, marginBottom: '8px' }}>
          《伤寒论》· {article.chapter} · {articleLabel(article)} · {'★'.repeat(article.difficulty)}
          {'☆'.repeat(3 - article.difficulty)}
        </div>
        <div style={{ fontFamily: FONTS.ancient, fontSize: '20px', lineHeight: 1.9 }}>
          {article.originalText}
        </div>
        {article.pinyinText && (
          <div style={{ fontSize: '12px', opacity: 0.6, marginTop: '8px', lineHeight: 1.7 }}>
            {article.pinyinText}
          </div>
        )}
      </div>

      {mode === 'full' && (
        <div style={{ ...panelStyle, borderRadius: RADIUS.md, padding: '14px 20px', marginTop: '8px' }}>
          <Section label="白话解读">
            <div style={{ fontSize: '13px', color: UI.textPrimary, lineHeight: 1.9 }}>{article.modernText}</div>
          </Section>
          <Section label="圆运动视角（彭子益理论解读）">
            <div
              style={{
                fontSize: '13px', color: UI.textPrimary, lineHeight: 1.9,
                borderLeft: `3px solid ${COLORS.earth.primary}`, paddingLeft: '12px'
              }}
            >
              {article.yuanundongInterpretation}
            </div>
          </Section>
          {article.huXishuComment && (
            <Section label="六经辨证视角（胡希恕注解）">
              <div
                style={{
                  fontSize: '13px', color: UI.textSecondary, lineHeight: 1.9,
                  borderLeft: `3px solid ${COLORS.water.primary}`, paddingLeft: '12px'
                }}
              >
                {article.huXishuComment}
              </div>
            </Section>
          )}
          {article.crossLink && crossTarget && (
            <Section label="双视角对照（同一条文·两种编次）">
              <button
                onClick={() => onJumpToArticle(crossTarget.id)}
                style={{
                  display: 'inline-block',
                  fontSize: '12px',
                  padding: '3px 10px',
                  borderRadius: RADIUS.pill,
                  color: UI.accent,
                  background: 'transparent',
                  border: `1px solid ${UI.accent}`,
                  cursor: 'pointer'
                }}
              >
                另见 {articleLabel(crossTarget)} ⇄
              </button>
              <div style={{ fontSize: '11px', color: UI.textMuted, lineHeight: 1.7, marginTop: '4px' }}>
                {article.crossLink.reason}
              </div>
            </Section>
          )}
          <Section label="双书联动">
            {article.relatedFormulas.map((name) => (
              <LinkChip key={name} text={name} onOpen={getFormulaByName(name) ? () => onOpenFormula(name) : undefined} />
            ))}
            {article.relatedMeridians.map((name) => (
              <LinkChip
                key={name}
                text={name}
                onOpen={MERIDIAN_FLOW.some((m) => m.name === name) ? () => onOpenMeridian(name) : undefined}
              />
            ))}
            {article.tags.map((tag) => (
              <LinkChip key={tag} text={tag} />
            ))}
          </Section>
        </div>
      )}
    </div>
  );
}
