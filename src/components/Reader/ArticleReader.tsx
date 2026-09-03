import { useEffect, useRef, useState } from 'react';
import { ARTICLES, Article, articleLabel } from '@/data/articles';
import {
  LEARNING_STAGES,
  stageArticles,
  stageProgress,
  loadReadIds,
  saveReadIds,
  loadCelebrated,
  saveCelebrated,
  getPengQuote
} from '@/data/learningPath';
import { BACKGROUND, UI, RADIUS, COLORS } from '@/styles/theme';
import { tr, getLang } from '@/i18n';
import { panelStyle, toggleButtonStyle } from '../UI/panelStyle';
import { getAcademicDisclaimer } from '@/utils/academicCheck';
import { ArticleList } from './ArticleList';
import { ArticleBlock, ReadingMode } from './ArticleBlock';
import { QiStagePanel } from './QiStagePanel';

/**
 * 条文阅读页（脚本F"文字驱动3D"）：
 * 中栏条文滚动流 —— 滚到哪条，右侧 3D 圆运动舞台就实时演示哪条的病机。
 */
// 六经筛选：把 '太阳/少阴' 这类复合归属拆成单经 token（chips 才不杂乱）
const MERIDIAN_FILTERS = [
  '全部',
  ...new Set(
    ARTICLES.flatMap((a) => a.syndrome?.meridian.split('/') ?? [])
  )
];

export function ArticleReader({
  onOpenFormula,
  onOpenMeridian,
  onOpenPulseTongue,
  initialArticleId = null
}: {
  onOpenFormula: (name: string) => void;
  onOpenMeridian: (name: string) => void;
  /** 脉舌联动（v3 指令⑤）：跳到脉舌3D并预选脉+舌 */
  onOpenPulseTongue?: (pulse: string, tongue: string) => void;
  /** 跨场景跳入时定位的条文 id */
  initialArticleId?: number | null;
}) {
  const [activeId, setActiveId] = useState<number>(ARTICLES[0].id);
  const [mode, setMode] = useState<ReadingMode>('full');
  // 已读进度本地持久化（DELIVERY_ABC · 六阶学习路径）
  const [readIds, setReadIds] = useState<Set<number>>(() => {
    const stored = loadReadIds();
    stored.add(ARTICLES[0].id);
    return stored;
  });
  // 通关庆祝：某阶（=某章）全读完时弹一次通关语
  const [celebration, setCelebration] = useState<number | null>(null);
  useEffect(() => {
    saveReadIds(readIds);
    const celebrated = loadCelebrated();
    for (const meta of LEARNING_STAGES) {
      if (celebrated.has(meta.stage)) continue;
      if (stageProgress(meta.stage, readIds).pct === 100) {
        celebrated.add(meta.stage);
        saveCelebrated(celebrated);
        setCelebration(meta.stage);
        break;
      }
    }
  }, [readIds]);
  const [query, setQuery] = useState('');
  const [meridianFilter, setMeridianFilter] = useState('全部');
  // 手机窄屏：目录默认折叠，悬浮"目录"钮展开（桌面布局不受此态影响，见 index.css reader-list）
  const [listOpen, setListOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 搜索/筛选（规格书场景7：按经/按方/按关键词）
  const filtered = ARTICLES.filter((article) => {
    if (meridianFilter !== '全部' && !article.syndrome?.meridian.split('/').includes(meridianFilter)) return false;
    if (!query.trim()) return true;
    const q = query.trim();
    return (
      article.originalText.includes(q) ||
      article.modernText.includes(q) ||
      article.yuanundongInterpretation.includes(q) ||
      article.tags.some((tag) => tag.includes(q)) ||
      article.relatedFormulas.some((name) => name.includes(q)) ||
      String(article.id).includes(q)
    );
  });

  // 条文进入视口上部触发带 → 激活。
  // 用 rootMargin 而非高 threshold（補齊文档的方案）：超过一屏高的长条文
  // 永远达不到 50% 可见比，threshold 0.5 会漏掉它们。
  // 维护"当前在触发带内"的集合，取文档序最靠上的一条为激活——
  // 两条同时跨带时不再取决于回调顺序。
  const inBandRef = useRef<Set<number>>(new Set());
  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    inBandRef.current.clear();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = parseInt(entry.target.id.replace('article-', ''), 10);
          if (entry.isIntersecting) inBandRef.current.add(id);
          else inBandRef.current.delete(id);
        }
        const topmost = [...inBandRef.current]
          .map((id) => ({ id, top: document.getElementById(`article-${id}`)?.offsetTop ?? Infinity }))
          .sort((a, b) => a.top - b.top)[0];
        if (topmost) {
          setActiveId(topmost.id);
          setReadIds((prev) => (prev.has(topmost.id) ? prev : new Set(prev).add(topmost.id)));
        }
      },
      { root, rootMargin: '0px 0px -60% 0px', threshold: 0.1 }
    );
    root.querySelectorAll('[id^="article-"]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [mode, filtered.length]);

  const active = ARTICLES.find((a) => a.id === activeId) ?? ARTICLES[0];

  // 手动计算滚动量（scrollIntoView 在长流+固定容器组合下可能过冲到底部）
  const scrollTo = (article: Article) => {
    const el = document.getElementById(`article-${article.id}`);
    const root = scrollRef.current;
    if (!el || !root) return;
    root.scrollTo({ top: el.offsetTop - root.clientHeight * 0.25, behavior: 'smooth' });
  };

  // 交叉链接跳转：目标被筛选掉时先清筛选，等重渲染后再滚
  const pendingJumpRef = useRef<number | null>(null);
  useEffect(() => {
    if (pendingJumpRef.current == null) return;
    const target = ARTICLES.find((a) => a.id === pendingJumpRef.current);
    pendingJumpRef.current = null;
    if (target) scrollTo(target);
  });
  // 跨场景跳入（脉舌3D/方剂详解的关联条文）：挂载后定位到目标条文。
  // 96 条长流的布局晚于首帧稳定——两次定时重申仍会拿到过期 offsetTop
  // （实测停在 81px）。改为每 250ms 重申一次，直到 scrollHeight 连续
  // 两拍不再变化（布局已定）为止，上限 3 秒。
  useEffect(() => {
    if (initialArticleId == null) return;
    const target = ARTICLES.find((a) => a.id === initialArticleId);
    if (!target) return;
    let lastHeight = -1;
    let stable = 0;
    let ticks = 0;
    const iv = window.setInterval(() => {
      const root = scrollRef.current;
      const el = document.getElementById(`article-${target.id}`);
      ticks += 1;
      if (root && el) {
        root.scrollTo({ top: el.offsetTop - root.clientHeight * 0.25, behavior: 'auto' });
        if (root.scrollHeight === lastHeight) stable += 1;
        else stable = 0;
        lastHeight = root.scrollHeight;
      }
      if (stable >= 2 || ticks >= 12) window.clearInterval(iv);
    }, 250);
    return () => window.clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialArticleId]);

  const jumpToArticle = (id: number) => {
    const target = ARTICLES.find((a) => a.id === id);
    if (!target) return;
    if (filtered.some((a) => a.id === id)) {
      scrollTo(target);
    } else {
      pendingJumpRef.current = id;
      setQuery('');
      setMeridianFilter('全部');
    }
  };

  return (
    <div className="scene-root" style={{ width: '100vw', height: '100vh', background: BACKGROUND.gradient }}>
      <ArticleList
        articles={filtered}
        selectedId={activeId}
        className={listOpen ? 'reader-list open-narrow' : 'reader-list'}
        onSelect={(article) => {
          scrollTo(article);
          setListOpen(false);
        }}
        header={
          <div style={{ padding: '2px 6px 10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={tr('搜索：条文/方剂/关键词')}
              aria-label={tr('搜索条文')}
              style={{
                background: 'transparent',
                border: `1px solid ${UI.panelBorder}`,
                borderRadius: RADIUS.sm,
                color: UI.textPrimary,
                fontSize: '12px',
                padding: '5px 8px'
              }}
            />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {MERIDIAN_FILTERS.map((m) => (
                <button key={m} style={toggleButtonStyle(meridianFilter === m)} onClick={() => setMeridianFilter(m)}>
                  {tr(m)}
                </button>
              ))}
            </div>
          </div>
        }
      />

      {/* 手机：悬浮目录开关（桌面隐藏，见 index.css show-narrow） */}
      <button
        className="show-narrow"
        onClick={() => setListOpen((v) => !v)}
        style={{
          ...toggleButtonStyle(listOpen),
          position: 'fixed', left: '8px', bottom: '62px', zIndex: 141
        }}
      >
        {listOpen ? tr('× 收起目录') : tr('☰ 目录')}
      </button>

      {/* 中栏：条文滚动流 */}
      <div
        className="reader-stream"
        ref={scrollRef}
        style={{
          position: 'fixed',
          left: '255px',
          right: '412px',
          top: '90px',
          bottom: '58px',
          zIndex: 100,
          overflowY: 'auto',
          paddingRight: '6px'
        }}
      >
        {/* 首尾留白，让第一条/最后一条也能滚到视口中心 */}
        <div style={{ height: '12vh' }} />
        {filtered.map((article) => (
          <ArticleBlock
            key={article.id}
            article={article}
            mode={mode}
            active={article.id === activeId}
            onOpenFormula={onOpenFormula}
            onOpenMeridian={onOpenMeridian}
            onJumpToArticle={jumpToArticle}
          />
        ))}
        <div style={{ height: '30vh' }} />
      </div>

      {/* 右栏：实时 3D + 条文信息卡 */}
      <div
        className="reader-right"
        style={{
          position: 'fixed', right: '20px', top: '90px', bottom: '58px',
          width: '375px', zIndex: 100,
          display: 'flex', flexDirection: 'column', gap: '10px'
        }}
      >
        <div style={{ display: 'flex', gap: '6px' }}>
          <button style={toggleButtonStyle(mode === 'full')} onClick={() => setMode('full')}>
            {tr('对照模式')}
          </button>
          <button style={toggleButtonStyle(mode === 'plain')} onClick={() => setMode('plain')}>
            {tr('原文模式')}
          </button>
        </div>
        {getLang() === 'en' && (
          <div style={{ fontSize: '10px', color: UI.textFaint, lineHeight: 1.5 }}>
            Classical texts are shown in the original Chinese — no machine translations. UI only is translated.
          </div>
        )}
        <QiStagePanel
          state={active.syndrome?.qiState ?? null}
          label={articleLabel(active)}
          ministerBroken={active.syndrome?.meridian.includes('少阴') ?? false}
          heatCold={active.syndrome?.pathogen.includes('上热下寒') ?? false}
        />
        <div style={{ ...panelStyle, borderRadius: RADIUS.md, padding: '14px 18px', overflowY: 'auto', flex: 1 }}>
          <div style={{ fontSize: '14px', fontWeight: 'bold', color: UI.accent }}>
            {articleLabel(active)} · {tr('条文信息卡')}
          </div>
          {active.syndrome ? (
            <div style={{ fontSize: '12px', color: UI.textPrimary, lineHeight: 2, marginTop: '8px' }}>
              <strong style={{ color: UI.accent }}>{tr('所属经：')}</strong>
              {active.syndrome.meridian}{tr('病')}
              <br />
              <strong style={{ color: UI.accent }}>{tr('病机：')}</strong>
              {active.syndrome.pathogen}
              <br />
              <strong style={{ color: UI.accent }}>{tr('圆运动状态：')}</strong>
              <span
                style={{
                  color: statusColor(active.syndrome.qiState.direction),
                  border: `1px solid ${statusColor(active.syndrome.qiState.direction)}`,
                  borderRadius: '9px',
                  padding: '0 8px',
                  fontSize: '11px'
                }}
              >
                {tr(trackText(active.syndrome.qiState.affectedTrack))}
                {tr(directionText(active.syndrome.qiState.direction))} · {active.syndrome.qiState.severity}/3
              </span>
              <br />
              <strong style={{ color: UI.accent }}>{tr('对应方剂：')}</strong>
              {active.relatedFormulas.length > 0 ? active.relatedFormulas.join('、') : tr('本条无方（辨证/预后条文）')}
              {active.formulaAction && (
                <>
                  <br />
                  <strong style={{ color: UI.accent }}>{tr('方剂作用：')}</strong>
                  {active.formulaAction}
                </>
              )}
              {active.pulseTongue && (
                <>
                  <br />
                  <strong style={{ color: UI.accent }}>{tr('脉舌：')}</strong>
                  {onOpenPulseTongue ? (
                    <button
                      onClick={() => onOpenPulseTongue(active.pulseTongue!.pulse, active.pulseTongue!.tongue)}
                      style={{
                        fontSize: '11px', color: UI.accent, background: 'transparent',
                        border: `1px solid ${UI.accent}`, borderRadius: '9px',
                        padding: '0 8px', cursor: 'pointer'
                      }}
                    >
                      {active.pulseTongue.label} →3D
                    </button>
                  ) : (
                    active.pulseTongue.label
                  )}
                </>
              )}
            </div>
          ) : (
            <div style={{ fontSize: '12px', color: UI.textMuted, marginTop: '8px' }}>{tr('本条暂无病机标注。')}</div>
          )}
          {/* 彭子益点睛（DELIVERY_ABC · B，仅交付逐字条目） */}
          {getPengQuote(`article_${active.id}`) && (
            <div
              style={{
                marginTop: '10px', padding: '8px 10px', borderRadius: RADIUS.sm,
                border: `1px solid ${UI.accent}`, fontSize: '12px', lineHeight: 1.7
              }}
            >
              <span style={{ color: UI.accent, fontWeight: 'bold' }}>💡 {tr('彭子益点睛：')}</span>
              <span style={{ color: UI.accent }}>“{getPengQuote(`article_${active.id}`)!.text}”</span>
              {getPengQuote(`article_${active.id}`)!.modern && (
                <div style={{ color: UI.textSecondary, fontSize: '11px', marginTop: '3px' }}>
                  {tr('白话：')}{getPengQuote(`article_${active.id}`)!.modern}
                </div>
              )}
            </div>
          )}
          <div style={{ marginTop: '10px', fontSize: '10px', color: UI.textFaint, lineHeight: 1.6 }}>
            {tr('病机标注提炼自本条圆运动解读，属学习笔记，未经专家审核。')}
            {getAcademicDisclaimer()}{tr('·仅供学习，非医疗建议')}
          </div>
        </div>
      </div>

      {/* 底部：阅读进度 + 六阶学习路径（DELIVERY_ABC · A） */}
      <div
        className="reader-progress"
        style={{
          ...panelStyle,
          position: 'fixed', bottom: '14px', left: '255px', right: '412px',
          zIndex: 100, borderRadius: RADIUS.pill, padding: '8px 18px',
          display: 'flex', alignItems: 'center', gap: '10px'
        }}
      >
        <span style={{ fontSize: '11px', color: UI.textMuted, whiteSpace: 'nowrap' }}>
          {tr('已读')} {readIds.size}/{ARTICLES.length}
        </span>
        <div style={{ flex: 1, height: '6px', borderRadius: '3px', background: UI.panelBorder }}>
          <div
            style={{
              width: `${(readIds.size / ARTICLES.length) * 100}%`,
              height: '100%',
              borderRadius: '3px',
              background: UI.accent,
              transition: 'width 0.4s'
            }}
          />
        </div>
        {/* 六阶：点击跳到该阶首条；进度=该章已读比例 */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {LEARNING_STAGES.map((meta) => {
            const p = stageProgress(meta.stage, readIds);
            const done = p.pct === 100;
            return (
              <button
                key={meta.stage}
                title={`${tr('第')}${meta.stage}${tr('阶')} ${meta.name} · ${meta.subtitle} · ${p.read}/${p.total}`}
                onClick={() => {
                  const first = stageArticles(meta.stage)[0];
                  if (first) jumpToArticle(first.id);
                }}
                style={{
                  fontSize: '10px', width: '22px', height: '22px', borderRadius: '50%',
                  border: `1px solid ${meta.color}`, cursor: 'pointer',
                  background: done ? meta.color : 'transparent',
                  color: done ? '#1a1a1a' : meta.color,
                  opacity: p.pct > 0 || done ? 1 : 0.55
                }}
              >
                {meta.stage}
              </button>
            );
          })}
        </div>
      </div>

      {/* 通关庆祝（每阶只弹一次；通关语为交付原文） */}
      {celebration != null && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 200,
            background: 'rgba(5,5,12,0.7)', display: 'flex',
            alignItems: 'center', justifyContent: 'center'
          }}
          onClick={() => setCelebration(null)}
        >
          <div
            style={{ ...panelStyle, borderRadius: RADIUS.md, padding: '26px 34px', maxWidth: '420px', textAlign: 'center' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: '17px', color: LEARNING_STAGES[celebration - 1].color, fontWeight: 'bold' }}>
              🎉 {tr('第')}{celebration}{tr('阶')}「{LEARNING_STAGES[celebration - 1].name}」{tr('通关！')}
            </div>
            <div style={{ fontSize: '13px', color: UI.textPrimary, lineHeight: 1.9, marginTop: '10px' }}>
              {LEARNING_STAGES[celebration - 1].unlockQuote}
            </div>
            {/* 本阶要点回顾（DELIVERY_WISDOM keyConcepts） */}
            <ul
              style={{
                fontSize: '11px', color: UI.textSecondary, lineHeight: 1.8,
                textAlign: 'left', paddingLeft: '18px', margin: '10px 0 0'
              }}
            >
              {LEARNING_STAGES[celebration - 1].keyConcepts.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '14px' }}>
              {celebration < 6 && (
                <button
                  onClick={() => {
                    const next = stageArticles(celebration + 1)[0];
                    setCelebration(null);
                    if (next) jumpToArticle(next.id);
                  }}
                  style={{
                    background: UI.accent, border: 'none', color: '#1a1a1a', fontWeight: 'bold',
                    borderRadius: RADIUS.pill, padding: '5px 16px', cursor: 'pointer', fontSize: '13px'
                  }}
                >
                  {tr('进入第')}{celebration + 1}{tr('阶')} →
                </button>
              )}
              <button
                onClick={() => setCelebration(null)}
                style={{
                  background: 'transparent', border: `1px solid ${UI.panelBorder}`, color: UI.textMuted,
                  borderRadius: RADIUS.pill, padding: '5px 14px', cursor: 'pointer', fontSize: '13px'
                }}
              >
                {tr('继续当前阅读')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function trackText(track: 'left' | 'right' | 'center' | 'both'): string {
  if (track === 'left') return '左升';
  if (track === 'right') return '右降';
  if (track === 'center') return '中轴';
  return '左右两路';
}

function directionText(direction: 'stagnant' | 'reversed' | 'ascend' | 'descend'): string {
  if (direction === 'reversed') return '逆乱';
  if (direction === 'ascend') return '升发/欲解';
  if (direction === 'descend') return '降复/欲解';
  return '受阻';
}

/** 状态色（红/黄/绿语义：逆乱=红，受阻=黄，升发·降复/欲解=绿） */
function statusColor(direction: 'stagnant' | 'reversed' | 'ascend' | 'descend'): string {
  if (direction === 'reversed') return COLORS.fire.primary;
  if (direction === 'ascend' || direction === 'descend') return COLORS.wood.primary;
  return COLORS.earth.primary;
}
