import { useState } from 'react';
import { tr, getLang } from '@/i18n';
import { ACUPOINTS, MERIDIAN_META } from '@/data/acupoints';
import { UI, RADIUS } from '@/styles/theme';
import { panelStyle, toggleButtonStyle } from '../UI/panelStyle';
import { useNarrow } from '@/hooks/useNarrow';
import type { AtlasViewKey } from './AcupointAtlas';
import { vesselsThrough, PlacedPoint, TWELVE, EXTRA, HAND_SIX, FOOT_SIX, YANG_SIX, YIN_SIX,
         VESSEL_SIX, VESSELS_EIGHT, VESSEL_META, meridianColor } from './pointGeometry';

// 经络分组按钮。前三个是"看多少条"，后四个是十二经的常用分法（手/足、阴/阳），
// 学的时候多按这几组过一遍，所以直接给按钮，不必逐条点。
const GROUPS: { label: string; codes: string[] }[] = [
  { label: '十二经', codes: TWELVE },
  { label: '加任督', codes: [...TWELVE, ...EXTRA] },
  { label: '全不看', codes: [] },
  { label: '手六经', codes: HAND_SIX },
  { label: '足六经', codes: FOOT_SIX },
  { label: '阳经', codes: YANG_SIX },
  { label: '阴经', codes: YIN_SIX },
  { label: '奇经八脉', codes: VESSELS_EIGHT },
  // 十四经（十二正经+任督）与奇经六脉一键全开
  { label: '十四经+奇经', codes: [...TWELVE, ...VESSELS_EIGHT] }
];

/** 当前显示的经与某一组完全相同时，该组按钮高亮——看得出正处在哪一组。 */
function sameSet(codes: string[], visible: ReadonlySet<string>): boolean {
  return codes.length === visible.size && codes.every((c) => visible.has(c));
}

// 整体视角 + 部位机位。手指宽仅 0.06、五个井穴挤在一处，
// 只靠拖拽很难对准，故直接给"手部/足部"两个机位。
const VIEW_LABELS: Record<AtlasViewKey, string> = {
  front: '前视', back: '背视', side: '侧视', top: '俯视', hand: '手部', foot: '足部'
};

interface Props {
  /** 搜索定位：只搜名（穴位/经络/奇经），不搜功效或症状 */
  onFocusPoint: (code: string) => void;
  onFocusMeridian: (code: string) => void;
  /** 子午流注：当令经随时辰高亮（底部时辰条在 Atlas 主件） */
  liuzhu: boolean;
  onToggleLiuzhu: () => void;
  view: AtlasViewKey;
  onViewChange: (v: AtlasViewKey) => void;
  visible: ReadonlySet<string>;
  onToggle: (code: string) => void;
  onSetAll: (codes: string[]) => void;
  selected: PlacedPoint | null;
  onClose: () => void;
  bodyLevel: 'off' | 'faint' | 'clear';
  onCycleBody: () => void;
  pointCount: number;
  labelMode: 'auto' | 'always' | 'off';
  onCycleLabel: () => void;
  labelOn: boolean;
  /** 气机流动（沿穴序推进，方向即经气方向） */
  qi: boolean;
  onToggleQi: () => void;
  qiSpeed: number;
  onQiSpeed: (v: number) => void;
  flowOf: (code: string) => string;
  /** 左键拖动行为：旋转 / 平移（触控板做不出右键拖动） */
  dragMode: 'rotate' | 'pan';
  onDragModeChange: (mode: 'rotate' | 'pan') => void;
  /** 体表用男体还是女体；女体只作体型参照，不显示穴位（见下方说明） */
  sex: 'male' | 'female';
  onSexChange: (s: 'male' | 'female') => void;
}

/** 名内繁体（含 沖/衝 双形）→ 简体归一表：查询与名字两边都归一后再比，
 *  简体、繁体、混着打都能中。覆盖 618 穴名+14 经+8 脉的全部用字。 */
const TRAD2SIMP: Record<string, string> = {
  來: '来', 俠: '侠', 倉: '仓', 僕: '仆', 兌: '兑', 內: '内', 勞: '劳',
  卻: '却', 厭: '厌', 厲: '厉', 參: '参', 啞: '哑', 帶: '带', 庫: '库',
  強: '强', 後: '后', 復: '复', 懸: '悬', 戶: '户', 揚: '扬', 攢: '攒',
  會: '会', 條: '条', 極: '极', 榮: '荣', 樞: '枢', 機: '机', 橫: '横',
  歷: '历', 歸: '归', 氣: '气', 沖: '冲', 淵: '渊', 溝: '沟', 溫: '温',
  滿: '满', 漿: '浆', 澤: '泽', 濼: '泺', 瀆: '渎', 營: '营', 犢: '犊',
  璣: '玑', 環: '环', 竅: '窍', 竇: '窦', 築: '筑', 結: '结', 絡: '络',
  絲: '丝', 經: '经', 維: '维', 綱: '纲', 縮: '缩', 聽: '听', 腎: '肾',
  腦: '脑', 腸: '肠', 膽: '胆', 臨: '临', 華: '华', 蓋: '盖', 處: '处',
  虛: '虚', 衝: '冲', 谿: '溪', 豐: '丰', 賓: '宾', 蹻: '跷', 車: '车',
  輒: '辄', 輔: '辅', 邊: '边', 鄉: '乡', 釐: '厘', 鐘: '钟', 長: '长',
  門: '门', 間: '间', 闕: '阙', 關: '关', 陰: '阴', 陽: '阳', 隱: '隐',
  雲: '云', 靈: '灵', 頂: '顶', 頭: '头', 頰: '颊', 頷: '颔', 顖: '囟',
  顱: '颅', 顴: '颧', 風: '风', 飛: '飞', 養: '养', 鬢: '鬓', 魚: '鱼',
  鳩: '鸠', 齦: '龈', 崑: '昆', 崙: '仑', 湧: '涌', 脈: '脉'
};
const norm = (x: string) => [...x].map((c) => TRAD2SIMP[c] ?? c).join('');

type Entry = { kind: 'point' | 'meridian'; code: string; zh: string; sub: string; key: string; pinyin?: string };
let INDEX: Entry[] | null = null;
function nameIndex(): Entry[] {
  if (INDEX) return INDEX;
  INDEX = [
    ...MERIDIAN_META.map((m) => ({
      kind: 'meridian' as const, code: m.code, zh: m.zh, sub: '经络', key: norm(m.zh)
    })),
    ...VESSEL_META.map((v) => ({
      kind: 'meridian' as const, code: v.code, zh: v.zh, sub: '奇经八脉', key: norm(v.zh)
    })),
    ...ACUPOINTS.map((p) => {
      const m = MERIDIAN_META.find((x) => x.code === p.meridian);
      return {
        kind: 'point' as const, code: p.code, zh: p.zh,
        sub: `${p.code} · ${m?.zh ?? p.meridian}`, key: norm(p.zh), pinyin: p.pinyin.toLowerCase()
      };
    })
  ];
  return INDEX;
}

type SearchHit = Entry;

/** 只按「名」检索：穴名/拼音/代号、经名、脉名。功效与症状不入索引（红线）。 */
function searchNames(q: string): SearchHit[] {
  const raw = q.trim();
  if (!raw) return [];
  const t = norm(raw);
  const low = raw.toLowerCase();
  const hits: SearchHit[] = [];
  for (const e of nameIndex()) {
    if (e.key.includes(t) || e.code.toLowerCase() === low ||
        (e.pinyin && e.pinyin.includes(low) && low.length >= 2)) {
      hits.push(e);
      if (hits.length >= 14) break;
    }
  }
  return hits;
}

export function AcupointControls(props: Props) {
  const { view, onViewChange, visible, onToggle, onSetAll, selected, onClose,
          onFocusPoint, onFocusMeridian, liuzhu, onToggleLiuzhu,
          bodyLevel, onCycleBody, pointCount, labelMode, onCycleLabel, labelOn,
          qi, onToggleQi, qiSpeed, onQiSpeed, flowOf, dragMode, onDragModeChange, sex, onSexChange } = props;
  const narrow = useNarrow();
  // 手机上两块面板都常驻会盖住人体（同十二经运行的处理），改为角标点开、一次一块
  const [open, setOpen] = useState<'none' | 'view' | 'list'>('none');
  const showList = !narrow || open === 'list';
  const showView = !narrow || open === 'view';

  // 搜索（只搜名）：输入即出候选，点选即定位
  const [query, setQuery] = useState('');
  const hits = searchNames(query);
  const pickHit = (h: SearchHit) => {
    setQuery('');
    if (h.kind === 'point') onFocusPoint(h.code); else onFocusMeridian(h.code);
  };

  return (
    <>
      {narrow && (
        <div style={{ position: 'fixed', top: '72px', left: '8px', right: '8px', zIndex: 120,
                      display: 'flex', justifyContent: 'space-between', pointerEvents: 'none' }}>
          <button
            style={{ ...toggleButtonStyle(open === 'view'), pointerEvents: 'auto' }}
            onClick={() => setOpen((v) => (v === 'view' ? 'none' : 'view'))}
          >
            {open === 'view' ? `× ${tr('视角')}` : `⚙ ${tr('视角')}`}
          </button>
          <button
            style={{ ...toggleButtonStyle(open === 'list'), pointerEvents: 'auto' }}
            onClick={() => setOpen((v) => (v === 'list' ? 'none' : 'list'))}
          >
            {open === 'list' ? `× ${tr('经脉')}` : `☰ ${tr('经脉')}`}
          </button>
        </div>
      )}

      {/* 左：视角 + 人体显隐 + 免责 */}
      {showView && (
      <div
        className="panel-left"
        style={{
          ...panelStyle, position: 'fixed', left: '20px', top: '90px', zIndex: 100,
          borderRadius: RADIUS.md, padding: '14px 16px', width: '190px',
          display: 'flex', flexDirection: 'column', gap: '8px',
          maxHeight: 'calc(100vh - 110px)', overflowY: 'auto'
        }}
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={tr('搜索：穴位 / 经络 / 脉 名')}
          aria-label={tr('按名称搜索穴位、经络与奇经')}
          style={{
            width: '100%', boxSizing: 'border-box', padding: '6px 9px',
            fontSize: '12px', color: UI.textPrimary, background: 'transparent',
            border: `1px solid ${UI.panelBorder}`, borderRadius: RADIUS.sm, outline: 'none'
          }}
        />
        {query.trim() && (
          <div style={{
            border: `1px solid ${UI.panelBorder}`, borderRadius: RADIUS.sm,
            maxHeight: '180px', overflowY: 'auto', flexShrink: 0
          }}>
            {hits.length === 0 && (
              <div style={{ fontSize: '11px', color: UI.textFaint, padding: '6px 9px' }}>
                {tr('没有这个名字（只按名检索）')}
              </div>
            )}
            {hits.map((h) => (
              <button
                key={h.kind + h.code}
                onClick={() => pickHit(h)}
                style={{
                  display: 'block', width: '100%', textAlign: 'left', border: 'none',
                  background: 'transparent', cursor: 'pointer', padding: '5px 9px'
                }}
              >
                <span style={{ fontSize: '12px', color: UI.textPrimary }}>{tr(h.zh)}</span>
                <span style={{ fontSize: '10px', color: UI.textFaint, marginLeft: '8px' }}>{tr(h.sub)}</span>
              </button>
            ))}
          </div>
        )}
        <div style={{ fontSize: '11px', color: UI.textMuted }}>{tr('视角')}</div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {(Object.keys(VIEW_LABELS) as AtlasViewKey[]).map((k) => (
            <button key={k} style={toggleButtonStyle(view === k)} onClick={() => onViewChange(k)}>
              {tr(VIEW_LABELS[k])}
            </button>
          ))}
        </div>
        <div style={{ fontSize: '11px', color: UI.textMuted }}>{tr('体表')}</div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <button style={toggleButtonStyle(sex === 'male')} onClick={() => onSexChange('male')}
                  title={tr('Visible Human 男性体表；穴位即按此体表推导')}>
            {tr('男体')}
          </button>
          <button style={toggleButtonStyle(sex === 'female')} onClick={() => onSexChange('female')}
                  title={tr('Visible Human 女性体表；穴位按她自己的骨性标志重推')}>
            {tr('女体')}
          </button>
        </div>
        {/* 女体重推方法全文移「声明」页（owner 2026-08-26），按钮 title 留一句 */}
        <button style={toggleButtonStyle(liuzhu)} onClick={onToggleLiuzhu}
                title={tr('十二时辰经络当令：当令经全亮加速，余经压暗为影。经典通行内容，教学展示')}>
          {tr('子午流注')}{liuzhu ? tr('·开') : ''}
        </button>
        <div style={{ fontSize: '11px', color: UI.textMuted }}>{tr('拖动')}</div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <button
            style={toggleButtonStyle(dragMode === 'rotate')}
            onClick={() => onDragModeChange('rotate')}
            title={tr('左键拖动＝转动人体')}
          >
            {tr('旋转')}
          </button>
          <button
            style={toggleButtonStyle(dragMode === 'pan')}
            onClick={() => onDragModeChange('pan')}
            title={tr('左键拖动＝拖动人体，把想看的部位拖到画面中央')}
          >
            {tr('平移')}
          </button>
        </div>
        <div style={{ fontSize: '9px', color: UI.textFaint, lineHeight: 1.5 }}>
          {tr('选「平移」后直接拖动人体到画面中央；按住 Shift 可临时平移。滚轮缩放。')}
        </div>
        <button style={toggleButtonStyle(bodyLevel !== 'off')} onClick={onCycleBody}>
          {bodyLevel === 'clear' ? tr('人体：清晰') : bodyLevel === 'faint' ? tr('人体：淡') : tr('人体：隐藏')}
        </button>
        <button style={toggleButtonStyle(qi)} onClick={onToggleQi}
                title={tr('沿穴序推进，方向即该经气机运行方向')}>
          {tr('气机流动：')}{qi ? tr('开') : tr('关')}
        </button>
        {qi && (
          <input
            type="range" min={0.3} max={3} step={0.1} value={qiSpeed}
            aria-label={tr('气机流速')}
            onChange={(e) => onQiSpeed(parseFloat(e.target.value))}
            style={{ width: '150px', accentColor: UI.accent }}
          />
        )}
        <button style={toggleButtonStyle(labelOn)} onClick={onCycleLabel}
                title={tr('自动：穴少时才标名；常显：一律标名；隐藏：只留穴点')}>
          {tr('穴名：')}{labelMode === 'auto' ? tr('自动') : labelMode === 'always' ? tr('常显') : tr('隐藏')}
        </button>
        <div style={{ fontSize: '11px', color: UI.textMuted }}>
          {tr('当前显示')} {pointCount} {tr('穴')}{labelMode === 'auto' && !labelOn ? tr('（穴多，暂不标名）') : ''}
        </div>
        {/* 安全性一句随内容同屏（源数据标 schematic_unvalidated）；
            方法与许可全文集中在顶栏「声明」页（owner 2026-08-26） */}
        <div style={{ fontSize: '9px', color: UI.textFaint, lineHeight: 1.6, marginTop: '2px' }}>
          {tr('穴位坐标为')}<b>{tr('示意定位')}</b>{tr('，不可用于在真人身上取穴。')}
          {tr('定位方法、数据出处与许可（CC BY 4.0）详见顶栏「声明」页。')}
        </div>
      </div>
      )}

      {/* 右：十二经 + 任督 */}
      {showList && (
      <div
        className="panel-right"
        style={{
          ...panelStyle, position: 'fixed', right: '20px', top: '90px', zIndex: 100,
          borderRadius: RADIUS.md, padding: '12px 14px', width: '205px',
          // 加了奇经小节后列表超出视口，限高到视口内、面板内滚动
          maxHeight: 'calc(100vh - 110px)', overflowY: 'auto'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
          {GROUPS.map((g) => (
            <button
              key={g.label}
              style={{ ...toggleButtonStyle(sameSet(g.codes, visible)),
                       fontSize: '10px', padding: '2px 7px' }}
              onClick={() => onSetAll(g.codes)}
            >
              {tr(g.label)}
            </button>
          ))}
        </div>
        {[...TWELVE, ...EXTRA].map((code) => {
          const m = MERIDIAN_META.find((x) => x.code === code);
          if (!m) return null;
          const on = visible.has(code);
          return (
            <button
              key={code}
              onClick={() => onToggle(code)}
              style={{
                display: 'flex', alignItems: 'center', gap: '7px', width: '100%',
                fontSize: '12px', padding: '3px 4px', border: 'none', cursor: 'pointer',
                borderRadius: RADIUS.sm, background: 'transparent',
                color: on ? UI.textSecondary : UI.textFaint, opacity: on ? 1 : 0.5
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%',
                             background: meridianColor(code), flexShrink: 0 }} />
              <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.25 }}>
                {tr(m.zh)}
                <span style={{ fontSize: '9px', color: UI.textFaint }}>{tr(flowOf(code))}</span>
              </span>
              <span style={{ marginLeft: 'auto', fontSize: '10px', color: UI.textFaint }}>
                {m.count}
              </span>
            </button>
          );
        })}

        {/* 奇经八脉：任督（上方 CV/GV 行）之外的六脉。奇经无本经穴，
            走线为通行教材交会穴序列的教学示意，右侧数字是交会穴数。 */}
        <div style={{ fontSize: '10px', color: UI.textMuted, margin: '8px 0 2px' }}>
          {tr('奇经八脉（任督见上）')}
        </div>
        {VESSEL_SIX.map((code) => {
          const v = VESSEL_META.find((x) => x.code === code);
          if (!v) return null;
          const on = visible.has(code);
          return (
            <button
              key={code}
              onClick={() => onToggle(code)}
              title={tr(v.summary)}
              style={{
                display: 'flex', alignItems: 'center', gap: '7px', width: '100%',
                fontSize: '12px', padding: '3px 4px', border: 'none', cursor: 'pointer',
                borderRadius: RADIUS.sm, background: 'transparent',
                color: on ? UI.textSecondary : UI.textFaint, opacity: on ? 1 : 0.5
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%',
                             background: meridianColor(code), flexShrink: 0 }} />
              <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.25 }}>
                {tr(v.zh)}
                <span style={{ fontSize: '9px', color: UI.textFaint }}>{tr(v.flow)}</span>
              </span>
              <span style={{ marginLeft: 'auto', fontSize: '10px', color: UI.textFaint }}
                    title={tr('交会穴数（奇经无本经穴）')}>
                {v.count}
              </span>
            </button>
          );
        })}
      </div>
      )}

      {/* 穴位信息卡 */}
      {selected && (
        <div
          className="panel-pop"
          style={{
            ...panelStyle, position: 'fixed', right: getLang() === 'zh' ? '240px' : '302px', top: '90px', zIndex: 101,
            width: '285px', background: UI.panelBgStrong, borderRadius: RADIUS.md,
            padding: '16px', animation: 'fadeIn 0.3s'
          }}
        >
          <button onClick={onClose} aria-label={tr('关闭穴位卡')}
                  style={{ position: 'absolute', top: '8px', right: '10px', background: 'none',
                           border: 'none', color: UI.textMuted, fontSize: '18px', cursor: 'pointer' }}>
            ×
          </button>
          <div style={{ fontSize: '17px', fontWeight: 'bold', color: meridianColor(selected.meridian) }}>
            {tr(selected.zh)} <span style={{ fontSize: '12px', color: UI.textMuted }}>{selected.code}</span>
          </div>
          <div style={{ fontSize: '11px', color: UI.textMuted, margin: '4px 0 10px' }}>
            {selected.pinyin} · {selected.region}
            {selected.mirrored ? ` · ${tr('对侧')}` : ''}
            <span style={{ color: UI.accent }}> · {tr(flowOf(selected.meridian))}</span>
          </div>
          {/* 交会穴身份：奇经借行此穴——借来仍属本经，如实双标 */}
          {vesselsThrough(selected.code).length > 0 && (
            <div style={{ fontSize: '11px', margin: '-4px 0 10px', lineHeight: 1.7 }}>
              {vesselsThrough(selected.code).map((v) => {
                const meta = VESSEL_META.find((x) => x.code === v);
                if (!meta) return null;
                return (
                  <span key={v} style={{
                    color: meridianColor(v), border: `1px solid ${meridianColor(v)}`,
                    borderRadius: '8px', padding: '0 6px', marginRight: '5px', whiteSpace: 'nowrap'
                  }}>
                    {tr(meta.zh)}{tr('交会穴')}
                  </span>
                );
              })}
              <span style={{ color: UI.textFaint }}>
                {tr('本属')}{tr(MERIDIAN_META.find((m) => m.code === selected.meridian)?.zh ?? selected.meridian)}
              </span>
            </div>
          )}
          {selected.loc && (
            <>
              <div style={{ fontSize: '10px', color: UI.textMuted, letterSpacing: '2px', marginBottom: '4px' }}>
                {tr('定位')}
              </div>
              <div style={{ fontSize: '13px', color: UI.textPrimary, lineHeight: 1.9 }}>{tr(selected.loc)}</div>
            </>
          )}
          {selected.derived && (
            <div style={{ marginTop: '10px', padding: '8px 10px', borderRadius: RADIUS.sm,
                          border: `1px solid ${UI.accent}`, fontSize: '11px', lineHeight: 1.8 }}>
              <span style={{ color: UI.accent, fontWeight: 'bold' }}>{tr('逐穴推导位')}</span>
              <div style={{ color: UI.textPrimary, marginTop: '2px' }}>{tr(selected.rule ?? '')}</div>
              {selected.deriveNote && (
                <div style={{ color: UI.textMuted, marginTop: '2px' }}>※ {tr(selected.deriveNote)}</div>
              )}
            </div>
          )}
          <div style={{ marginTop: '12px', fontSize: '10px', color: UI.textFaint, lineHeight: 1.7 }}>
            {selected.loc
              ? `${tr('定位文本审核：')}${selected.locReview}${tr('；')}`
              : tr('定位文本随内容包提供（开源版示例见肺经）；')}
            {selected.derived
              ? tr('此穴按定位文本与骨度分寸逐条推导，仍属教学示意。')
              : tr('图上坐标为整经重定位的示意位（schematic_unvalidated）。')}
            {tr('取穴请依定位文本与专业指导。')}
          </div>
        </div>
      )}
    </>
  );
}
