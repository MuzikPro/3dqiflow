import { Article, articleLabel } from '@/data/articles';
import { UI, RADIUS } from '@/styles/theme';
import { tr } from '@/i18n';
import { panelStyle } from '../UI/panelStyle';

interface Props {
  articles: Article[];
  selectedId: number;
  onSelect: (article: Article) => void;
  /** 顶部搜索/筛选控件（由 ArticleReader 注入） */
  header?: React.ReactNode;
  /** 布局类（窄屏由 index.css 折叠/悬浮，见 reader-list） */
  className?: string;
}

/** 按篇章分组 */
function groupByChapter(articles: Article[]): Array<{ chapter: string; articles: Article[] }> {
  const groups: Array<{ chapter: string; articles: Article[] }> = [];
  for (const article of articles) {
    const group = groups.find((g) => g.chapter === article.chapter);
    if (group) group.articles.push(article);
    else groups.push({ chapter: article.chapter, articles: [article] });
  }
  return groups;
}

export function ArticleList({ articles, selectedId, onSelect, header, className }: Props) {
  const GROUPS = groupByChapter(articles);
  return (
    <div
      className={className}
      style={{
        ...panelStyle,
        position: 'fixed',
        left: '20px',
        top: '90px',
        bottom: '20px',
        width: '215px',
        zIndex: 100,
        borderRadius: RADIUS.md,
        padding: '12px 10px',
        overflowY: 'auto'
      }}
    >
      {header}
      {GROUPS.length === 0 && (
        <div style={{ fontSize: '12px', color: UI.textMuted, padding: '8px' }}>{tr('无匹配条文')}</div>
      )}
      {GROUPS.map((group) => (
        <div key={group.chapter} style={{ marginBottom: '12px' }}>
          <div style={{ fontSize: '11px', color: UI.textMuted, padding: '0 6px 6px' }}>
            {group.chapter}
          </div>
          {group.articles.map((article) => {
            const active = article.id === selectedId;
            return (
              <button
                key={article.id}
                onClick={() => onSelect(article)}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  border: 'none',
                  padding: '6px 8px',
                  borderRadius: RADIUS.sm,
                  cursor: 'pointer',
                  background: active ? UI.panelBorder : 'transparent'
                }}
              >
                <span style={{ fontSize: '12px', color: active ? UI.accent : UI.textPrimary }}>
                  {articleLabel(article)}
                </span>
                <span style={{ fontSize: '11px', color: UI.textMuted, marginLeft: '6px' }}>
                  {'★'.repeat(article.difficulty)}
                  {'☆'.repeat(3 - article.difficulty)}
                </span>
                <div
                  style={{
                    fontSize: '11px',
                    color: UI.textSecondary,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {article.originalText}
                </div>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
