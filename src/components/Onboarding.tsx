import { useState } from 'react';
import { ONBOARDING_SCREENS, setOnboarded } from '@/data/learningPath';
import { COLORS, UI, RADIUS } from '@/styles/theme';
import { Lang, t } from '@/i18n';
import { panelStyle } from './UI/panelStyle';

/**
 * C · 首次进入引导 6 屏（DELIVERY_ABC，文案逐字）：
 * 金色圆环=圆运动；第2屏变形红环=圆转失常。完成/跳过写 yy_onboarded。
 * 按钮已多语言；叙述文案为交付原文（中文，见 i18n 范围说明）。
 */
export function Onboarding({ lang = 'zh', onDone }: { lang?: Lang; onDone: () => void }) {
  const [index, setIndex] = useState(0);
  const screen = ONBOARDING_SCREENS[index];

  const finish = () => {
    setOnboarded(true);
    onDone();
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: 'rgba(5,5,12,0.88)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}
    >
      <style>{'@keyframes yySpin { to { transform: rotate(360deg); } }'}</style>
      <div
        style={{
          ...panelStyle, borderRadius: RADIUS.md, padding: '32px 40px',
          maxWidth: '480px', textAlign: 'center'
        }}
      >
        <div
          style={{
            width: '90px', height: '90px', margin: '0 auto 16px', borderRadius: '50%',
            border: screen.deformed
              ? `5px solid ${COLORS.fire.primary}`
              : `3px solid ${UI.accent}`,
            borderLeftWidth: screen.deformed ? '2px' : '3px',
            borderRightWidth: screen.deformed ? '2px' : '3px',
            animation: `yySpin ${screen.deformed ? 7 : 4}s linear infinite`
          }}
        />
        <div style={{ fontSize: '17px', color: UI.accent, fontWeight: 'bold' }}>{screen.title}</div>
        <div style={{ fontSize: '13px', color: UI.textPrimary, lineHeight: 1.9, marginTop: '10px' }}>
          {screen.narration}
        </div>
        {screen.quote && (
          <div style={{ fontSize: '11px', color: UI.accent, fontStyle: 'italic', marginTop: '8px' }}>
            “{screen.quote}”
          </div>
        )}
        <div style={{ fontSize: '11px', color: UI.textMuted, marginTop: '12px' }}>
          {index + 1} / {ONBOARDING_SCREENS.length}
        </div>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '14px' }}>
          {index > 0 && (
            <button
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              style={{
                background: 'transparent', border: `1px solid ${UI.panelBorder}`, color: UI.textPrimary,
                borderRadius: RADIUS.pill, padding: '5px 16px', cursor: 'pointer', fontSize: '13px'
              }}
            >
              {t(lang, 'onboardPrev')}
            </button>
          )}
          <button
            onClick={() => (index >= ONBOARDING_SCREENS.length - 1 ? finish() : setIndex((i) => i + 1))}
            style={{
              background: UI.accent, border: 'none', color: '#1a1a1a', fontWeight: 'bold',
              borderRadius: RADIUS.pill, padding: '5px 18px', cursor: 'pointer', fontSize: '13px'
            }}
          >
            {index >= ONBOARDING_SCREENS.length - 1 ? t(lang, 'onboardStart') : t(lang, 'onboardNext')}
          </button>
          <button
            onClick={finish}
            style={{
              background: 'transparent', border: `1px solid ${UI.panelBorder}`, color: UI.textMuted,
              borderRadius: RADIUS.pill, padding: '5px 14px', cursor: 'pointer', fontSize: '13px'
            }}
          >
            {t(lang, 'onboardSkip')}
          </button>
        </div>
      </div>
    </div>
  );
}
