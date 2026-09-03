import { useState } from 'react';
import { Lang, LANGS, ThemeMode, t } from '@/i18n';
import { UI, RADIUS } from '@/styles/theme';
import { panelStyle, toggleButtonStyle } from './UI/panelStyle';

interface Props {
  lang: Lang;
  themeMode: ThemeMode;
  onLang: (lang: Lang) => void;
  onTheme: (mode: ThemeMode) => void;
  onReplayOnboarding: () => void;
  onClose: () => void;
}

/** 设置面板（owner 2026-08-19）：语言 / 主题 / 重看引导 / 重置进度 */
export function SettingsModal({ lang, themeMode, onLang, onTheme, onReplayOnboarding, onClose }: Props) {
  const [resetDone, setResetDone] = useState(false);

  const resetProgress = () => {
    try {
      ['yy_read_articles', 'yy_stage_celebrated', 'yy_quote_collapsed'].forEach((k) =>
        localStorage.removeItem(k)
      );
    } catch { /* ignore */ }
    setResetDone(true);
  };

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: 'rgba(5,5,12,0.6)', display: 'flex',
        alignItems: 'center', justifyContent: 'center'
      }}
      onClick={onClose}
    >
      <div
        style={{ ...panelStyle, borderRadius: RADIUS.md, padding: '24px 28px', width: '340px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: '16px', fontWeight: 'bold', color: UI.accent, marginBottom: '14px' }}>
          ⚙ {t(lang, 'settings')}
        </div>

        <div style={{ fontSize: '11px', color: UI.textMuted, marginBottom: '6px' }}>{t(lang, 'language')}</div>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
          {LANGS.map((entry) => (
            <button key={entry.key} style={toggleButtonStyle(lang === entry.key)} onClick={() => onLang(entry.key)}>
              {entry.label}
            </button>
          ))}
        </div>

        <div style={{ fontSize: '11px', color: UI.textMuted, marginBottom: '6px' }}>{t(lang, 'theme')}</div>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
          {(['dark', 'light', 'system'] as ThemeMode[]).map((mode) => (
            <button key={mode} style={toggleButtonStyle(themeMode === mode)} onClick={() => onTheme(mode)}>
              {mode === 'dark' ? `🌙 ${t(lang, 'themeDark')}` : mode === 'light' ? `☀️ ${t(lang, 'themeLight')}` : `🖥 ${t(lang, 'themeSystem')}`}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
          <button
            style={toggleButtonStyle(false)}
            onClick={() => {
              onClose();
              onReplayOnboarding();
            }}
          >
            {t(lang, 'replayOnboarding')}
          </button>
          <button style={toggleButtonStyle(false)} onClick={resetProgress}>
            {resetDone ? `✓ ${t(lang, 'resetDone')}` : t(lang, 'resetProgress')}
          </button>
        </div>

        <div style={{ fontSize: '10px', color: UI.textFaint, lineHeight: 1.7 }}>{t(lang, 'contentNote')}</div>

        <button
          onClick={onClose}
          style={{
            marginTop: '12px', background: 'transparent', border: `1px solid ${UI.panelBorder}`,
            color: UI.textMuted, borderRadius: RADIUS.pill, padding: '4px 14px',
            cursor: 'pointer', fontSize: '12px'
          }}
        >
          {t(lang, 'close')}
        </button>
      </div>
    </div>
  );
}
