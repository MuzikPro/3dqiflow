/**
 * 界面多语言（owner 2026-08-19：中文/English/日本語）。
 *
 * 范围界定：本表只覆盖 UI 骨架（标题/导航/设置/引导按钮等）。
 * 内容数据（96 条文、39 方剂、语录等经典文本与交付解读）不做机器
 * 翻译——项目规则"不虚构翻译"；待有真实译本再接入。
 */
export type Lang = 'zh' | 'en' | 'ja';

export const LANGS: Array<{ key: Lang; label: string }> = [
  { key: 'zh', label: '中文' },
  { key: 'en', label: 'English' },
  { key: 'ja', label: '日本語' }
];

const STRINGS = {
  // 品牌名（owner 2026-08-19 定名）：中文按 owner 原文；日文暂用英文品牌名，
  // 待 owner 给出日文名再替换（不自行创译品牌）。
  appTitle: {
    zh: '3DQiFlow',
    en: '3DQiFlow',
    ja: '3DQiFlow'
  },
  appSubtitle: {
    zh: '3D INTERACTIVE · 中气如轴 · 四维如轮',
    en: '3D INTERACTIVE · The center qi as axle, the four aspects as wheel',
    ja: '3D INTERACTIVE · 中気は軸、四維は輪'
  },
  sceneAxis: { zh: '轴轮模型', en: 'Axle & Wheel', ja: '軸輪モデル' },
  sceneAcupoint: { zh: '经穴图', en: 'Acupoints', ja: '経穴図' },
  sceneMeridian: { zh: '十二经运行', en: 'Meridian Flow', ja: '十二経運行' },
  sceneFormula: { zh: '方剂详解', en: 'Formulas 3D', ja: '方剤詳解' },
  sceneSolar: { zh: '节气剧场', en: 'Solar Terms', ja: '節気シアター' },
  sceneHetu: { zh: '河图洛书', en: 'Hetu & Luoshu', ja: '河図洛書' },
  scenePulse: { zh: '脉舌3D', en: 'Pulse & Tongue', ja: '脈舌3D' },
  sceneReader: { zh: '条文阅读', en: 'Article Reader', ja: '条文リーダー' },
  sceneAbout: { zh: '声明', en: 'Notices', ja: '声明' },
  settings: { zh: '设置', en: 'Settings', ja: '設定' },
  language: { zh: '语言 / Language', en: 'Language', ja: '言語' },
  theme: { zh: '主题', en: 'Theme', ja: 'テーマ' },
  themeDark: { zh: '暗色', en: 'Dark', ja: 'ダーク' },
  themeLight: { zh: '亮色', en: 'Light', ja: 'ライト' },
  themeSystem: { zh: '跟随系统', en: 'System', ja: 'システム' },
  replayOnboarding: { zh: '🎬 重看引导', en: '🎬 Replay intro', ja: '🎬 ガイドを再生' },
  resetProgress: { zh: '重置学习进度', en: 'Reset learning progress', ja: '学習進捗をリセット' },
  resetDone: { zh: '已重置', en: 'Reset done', ja: 'リセット済み' },
  close: { zh: '关闭', en: 'Close', ja: '閉じる' },
  contentNote: {
    zh: '界面已多语言化；条文/方剂/语录等经典内容暂为中文（不做机器翻译，待真实译本）。',
    en: 'The interface is multilingual; classical content (articles, formulas, quotes) remains in Chinese until authentic translations are sourced — no machine-invented translations.',
    ja: 'UIは多言語対応済み。条文・方剤・語録などの古典内容は、真正な訳が用意されるまで中国語のままです（機械翻訳による捏造はしません）。'
  },
  onboardNext: { zh: '下一步 →', en: 'Next →', ja: '次へ →' },
  onboardPrev: { zh: '← 上一步', en: '← Back', ja: '← 戻る' },
  onboardSkip: { zh: '跳过', en: 'Skip', ja: 'スキップ' },
  onboardStart: { zh: '开始学习 ✓', en: 'Start learning ✓', ja: '学習を始める ✓' }
} as const;

export type StringKey = keyof typeof STRINGS;

export function t(lang: Lang, key: StringKey): string {
  return STRINGS[key][lang];
}

const KEY_LANG = 'yy_lang';
const KEY_THEME = 'yy_theme';
export type ThemeMode = 'dark' | 'light' | 'system';

export function loadLang(): Lang {
  try {
    const v = localStorage.getItem(KEY_LANG);
    return v === 'en' || v === 'ja' ? v : 'zh';
  } catch {
    return 'zh';
  }
}
export function saveLang(lang: Lang): void {
  try { localStorage.setItem(KEY_LANG, lang); } catch { /* ignore */ }
}
export function loadThemeMode(): ThemeMode {
  try {
    const v = localStorage.getItem(KEY_THEME);
    return v === 'light' || v === 'system' ? v : 'dark';
  } catch {
    return 'dark';
  }
}
export function saveThemeMode(mode: ThemeMode): void {
  try { localStorage.setItem(KEY_THEME, mode); } catch { /* ignore */ }
}
export function resolveTheme(mode: ThemeMode): 'dark' | 'light' {
  if (mode !== 'system') return mode;
  try {
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}
