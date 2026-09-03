import { useState } from 'react';
import { getPengQuote, isQuoteCollapsed, setQuoteCollapsed } from '@/data/learningPath';
import { UI, RADIUS } from '@/styles/theme';
import { panelStyle } from './panelStyle';
import { useNarrow } from '@/hooks/useNarrow';

/**
 * B · 彭子益点睛侧边卡（DELIVERY_ABC）：
 * 语录库只含交付逐字条目；折叠状态本地记忆（yy_quote_collapsed）。
 * 默认停靠左下角胶囊，不遮场景主体。
 */
export function PengQuoteCard({ quoteKey, bottom = 20, anchor = 'left' }: { quoteKey: string; bottom?: number; anchor?: 'left' | 'right' }) {
  const quote = getPengQuote(quoteKey);
  // 手机竖屏上展开的语录卡会吃掉半屏（owner 2026-08-22），故窄屏默认收起；
  // 桌面沿用 yy_quote_collapsed 记忆。
  const narrow = useNarrow();
  const [collapsed, setCollapsed] = useState(() => narrow || isQuoteCollapsed());
  const [expanded, setExpanded] = useState(false);
  if (!quote) return null;

  const toggle = () => {
    const next = !collapsed;
    setCollapsed(next);
    setQuoteCollapsed(next);
    if (next) setExpanded(false);
  };

  const short = quote.text.length > 40 ? quote.text.slice(0, 40) + '…' : quote.text;

  return (
    <div
      className="quote-card"
      style={{
        ...panelStyle,
        position: 'fixed', ...(anchor === 'right' ? { right: '20px' } : { left: '20px' }), bottom: `${bottom}px`, zIndex: 105,
        borderRadius: RADIUS.md, padding: collapsed ? '6px 12px' : '10px 14px',
        maxWidth: '300px', border: `1px solid ${UI.accent}`
      }}
    >
      <button
        onClick={toggle}
        style={{
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: UI.accent, fontSize: '12px', fontWeight: 'bold', padding: 0
        }}
      >
        💡 彭子益点睛 {collapsed ? '▸' : '▾'}
      </button>
      {!collapsed && (
        <div style={{ marginTop: '6px' }}>
          <div style={{ fontSize: '13px', color: UI.accent, lineHeight: 1.7 }}>
            “{expanded ? quote.text : short}”
          </div>
          {quote.modern && (
            <div style={{ fontSize: '11px', color: UI.textSecondary, lineHeight: 1.6, marginTop: '4px' }}>
              白话：{quote.modern}
            </div>
          )}
          <div style={{ fontSize: '10px', color: UI.textFaint, marginTop: '4px' }}>{quote.source}</div>
          {!expanded && quote.text.length > 40 && (
            <button
              onClick={() => setExpanded(true)}
              style={{
                marginTop: '4px', background: 'transparent', border: `1px solid ${UI.panelBorder}`,
                color: UI.textMuted, borderRadius: RADIUS.pill, padding: '1px 8px',
                cursor: 'pointer', fontSize: '11px'
              }}
            >
              查看完整解读 →
            </button>
          )}
        </div>
      )}
    </div>
  );
}
