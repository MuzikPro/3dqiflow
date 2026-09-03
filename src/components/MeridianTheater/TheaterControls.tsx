import { Meridian, MERIDIAN_FLOW, MNEMONIC } from '@/data/meridians';
import { Organ } from '@/data/organs';
import { ARTICLES, articleLabel } from '@/data/articles';
import { getAcademicDisclaimer } from '@/utils/academicCheck';
import { UI, RADIUS, COLORS } from '@/styles/theme';
import { panelStyle, toggleButtonStyle } from '../UI/panelStyle';
import { CameraViewKey } from './bodyGeometry';
import { useNarrow } from '@/hooks/useNarrow';
import { useState } from 'react';
import { tr } from '@/i18n';

interface Props {
  view: CameraViewKey;
  onViewChange: (view: CameraViewKey) => void;
  /** 平移/缩放后一键归位（owner 2026-08-22） */
  onResetView: () => void;
  /** 左键拖动行为：旋转 / 平移（触控板做不出右键拖动） */
  dragMode: 'rotate' | 'pan';
  onDragModeChange: (mode: 'rotate' | 'pan') => void;
  activeId: number;
  onPickMeridian: (m: Meridian) => void;
  selected: Meridian | null;
  selectedOrgan: Organ | null;
  onCloseCard: () => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  seeThrough: boolean;
  onSeeThroughToggle: () => void;
  /** 逐经显隐（owner 2026-08-20） */
  visibleIds: ReadonlySet<number>;
  onToggleVisible: (id: number) => void;
  onShowGroup: (filter: 'all' | 'ascend' | 'descend' | 'yin' | 'yang' | 'hand' | 'foot') => void;
  // 解剖体/示意体切换已退场：owner 2026-08-25 决定五场景统一用 NIH 男体
  /** 脏腑位：解剖实测位 / 圆运动教学位（owner 2026-08-22） */
  anatomicalNodes: boolean;
  onAnatomicalNodesToggle: () => void;
}

const VIEW_LABELS: Record<CameraViewKey, string> = { front: '前视', back: '背视', side: '侧视', top: '俯视' };

export function TheaterControls(props: Props) {
  const {
    view, onViewChange, onResetView, dragMode, onDragModeChange, activeId, onPickMeridian, selected, selectedOrgan, onCloseCard,
    speed, onSpeedChange, seeThrough, onSeeThroughToggle,
    visibleIds, onToggleVisible, onShowGroup,
    anatomicalNodes, onAnatomicalNodesToggle
  } = props;

  const card = selected ?? null;
  // 手机上两块面板并排会把头胸手臂连同脏腑标签整个盖住（owner 2026-08-22 截图），
  // 故窄屏默认收起，点角标才展开，一次只开一块。
  const narrow = useNarrow();
  const [openPanel, setOpenPanel] = useState<'none' | 'left' | 'right'>('none');
  const showLeft = !narrow || openPanel === 'left';
  const showRight = !narrow || openPanel === 'right';

  return (
    <>
      {narrow && (
        <div style={{ position: 'fixed', top: '72px', left: '8px', right: '8px', zIndex: 120,
                      display: 'flex', justifyContent: 'space-between', pointerEvents: 'none' }}>
          <button
            style={{ ...toggleButtonStyle(openPanel === 'left'), pointerEvents: 'auto' }}
            onClick={() => setOpenPanel((v) => (v === 'left' ? 'none' : 'left'))}
          >
            {(openPanel === 'left' ? '× ' : '⚙ ') + tr('视角设置')}
          </button>
          <button
            style={{ ...toggleButtonStyle(openPanel === 'right'), pointerEvents: 'auto' }}
            onClick={() => setOpenPanel((v) => (v === 'right' ? 'none' : 'right'))}
          >
            {(openPanel === 'right' ? '× ' : '☰ ') + tr('十二经')}
          </button>
        </div>
      )}
      {/* 左侧：视角 + 流速 + 剖面/叠加 + 口诀 */}
      {showLeft && (
      <div
        className="panel-left"
        style={{
          ...panelStyle,
          position: 'fixed', left: '20px', top: '90px', zIndex: 100,
          borderRadius: RADIUS.md, padding: '14px 16px',
          display: 'flex', flexDirection: 'column', gap: '10px', width: '190px'
        }}
      >
        <div style={{ fontSize: '11px', color: UI.textMuted }}>{tr('视角')}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {(Object.keys(VIEW_LABELS) as CameraViewKey[]).map((key) => (
            <button key={key} style={toggleButtonStyle(view === key)} onClick={() => onViewChange(key)}>
              {tr(VIEW_LABELS[key])}
            </button>
          ))}
          <button style={toggleButtonStyle(false)} onClick={onResetView} title={tr('回到默认机位与注视点')}>
            {tr('复位')}
          </button>
        </div>
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
          {tr('选「平移」后直接拖动人体到画面中央；按住 Shift 可临时平移。滚轮缩放，复位回正。')}
        </div>
        <div style={{ fontSize: '11px', color: UI.textMuted }}>{tr('流注速度')} · {speed.toFixed(1)}x</div>
        <input
          type="range"
          min={0.5}
          max={3}
          step={0.1}
          value={speed}
          aria-label={tr('流注速度')}
          onChange={(e) => onSpeedChange(parseFloat(e.target.value))}
          style={{ width: '140px', accentColor: UI.accent }}
        />
        {/* 三键放不下一行时换行（加入"解剖体"后圆运动叠加曾溢出面板边框） */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <button style={toggleButtonStyle(seeThrough)} onClick={onSeeThroughToggle}>
            {tr('剖面')}
          </button>
        </div>
        <div style={{ fontSize: '11px', color: UI.textMuted, marginTop: '4px' }}>{tr('脏腑位')}</div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          <button
            style={toggleButtonStyle(anatomicalNodes)}
            onClick={() => anatomicalNodes || onAnatomicalNodesToggle()}
            title={tr('NIH Visible Human 实测形心')}
          >
            {tr('解剖位')}
          </button>
          <button
            style={toggleButtonStyle(!anatomicalNodes)}
            onClick={() => anatomicalNodes && onAnatomicalNodesToggle()}
            title={tr('圆运动左升右降示意位（肝生于左）')}
          >
            {tr('教学位')}
          </button>
        </div>
        <div style={{ fontSize: '9px', color: UI.textFaint, lineHeight: 1.5 }}>
          {anatomicalNodes
            ? tr('肝胆在右、肾在下肋——解剖真实位，与左升右降的示意布局不同')
            : tr('肝生于左等圆运动示意布局，非解剖真实位')}
        </div>
        <div style={{ fontSize: '11px', color: UI.textMuted, marginTop: '4px' }}>{tr('升降口诀')}</div>
        <div style={{ fontSize: '12px', lineHeight: 1.7 }}>
          <div style={{ color: COLORS.metal.primary }}>{tr(MNEMONIC.descend)}</div>
          <div style={{ color: COLORS.wood.primary }}>{tr(MNEMONIC.ascend)}</div>
        </div>
        {/* CC BY 4.0 署名：短句随屏，全文与核对记录在「声明」页与 public/models/README.md */}
        <div style={{ fontSize: '9px', color: UI.textFaint, lineHeight: 1.5, marginTop: '2px' }}>
          {tr('人体模型：NIH 3D（Visible Human, NLM）· CC BY 4.0 · 详见「声明」页')}
        </div>
      </div>
      )}

      {/* 右侧：流注顺序列表（如环无端）· 每经可显隐，可只看升/降 */}
      {showRight && (
      <div
        className="panel-right"
        style={{
          ...panelStyle,
          position: 'fixed', right: '20px', top: '90px', zIndex: 100,
          borderRadius: RADIUS.md, padding: '12px 14px', width: '195px'
        }}
      >
        <div style={{ fontSize: '11px', color: UI.textMuted, marginBottom: '6px' }}>
          {tr('流注顺序')} · {tr('如环无端')}
        </div>
        {/* 组合快捷键：全部/升降（2026-08-20）＋ 阴阳/手足（owner 2026-08-27） */}
        {([
          [
            { key: 'all', label: '全部', pred: () => true },
            { key: 'ascend', label: '只看↑升', pred: (m: typeof MERIDIAN_FLOW[number]) => m.direction === 'ascend' },
            { key: 'descend', label: '只看↓降', pred: (m: typeof MERIDIAN_FLOW[number]) => m.direction === 'descend' }
          ],
          [
            { key: 'yin', label: '只看阴', pred: (m: typeof MERIDIAN_FLOW[number]) => m.yin },
            { key: 'yang', label: '只看阳', pred: (m: typeof MERIDIAN_FLOW[number]) => !m.yin },
            { key: 'foot', label: '只看足经', pred: (m: typeof MERIDIAN_FLOW[number]) => m.path.includes('足') },
            { key: 'hand', label: '只看手经', pred: (m: typeof MERIDIAN_FLOW[number]) => m.path.includes('手') }
          ]
        ] as const).map((row, ri) => (
          <div key={ri} style={{ display: 'flex', gap: '4px', marginBottom: ri === 1 ? '8px' : '4px', flexWrap: 'wrap' }}>
            {row.map((g) => (
              <button
                key={g.key}
                style={{
                  ...toggleButtonStyle(
                    visibleIds.size > 0 &&
                    MERIDIAN_FLOW.every((m) => visibleIds.has(m.id) === g.pred(m))
                  ),
                  fontSize: '10px', padding: '2px 7px'
                }}
                onClick={() => onShowGroup(g.key)}
              >
                {tr(g.label)}
              </button>
            ))}
          </div>
        ))}
        {MERIDIAN_FLOW.map((m) => {
          const isActive = m.id === activeId;
          const isVisible = visibleIds.has(m.id);
          return (
            <div
              key={m.id}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px', width: '100%',
                borderRadius: RADIUS.sm,
                background: isActive && isVisible ? UI.panelBorder : 'transparent',
                opacity: isVisible ? 1 : 0.45
              }}
            >
              {/* 显隐勾选（不触发选中） */}
              <button
                onClick={() => onToggleVisible(m.id)}
                title={tr(isVisible ? '隐藏此经' : '显示此经')}
                aria-label={`${tr(m.name)} ${tr('显隐')}`}
                style={{
                  width: '18px', height: '18px', flexShrink: 0, cursor: 'pointer',
                  background: 'transparent', border: `1px solid ${isVisible ? m.colorHex : UI.panelBorder}`,
                  borderRadius: '4px', color: m.colorHex, fontSize: '11px', lineHeight: 1, padding: 0
                }}
              >
                {isVisible ? '✓' : ''}
              </button>
              <button
                onClick={() => onPickMeridian(m)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '7px', flex: 1,
                  fontSize: '12px', padding: '3px 4px', border: 'none',
                  borderRadius: RADIUS.sm, cursor: 'pointer',
                  color: isActive ? UI.accent : UI.textSecondary,
                  background: 'transparent'
                }}
              >
                <span
                  style={{
                    width: '8px', height: '8px', borderRadius: '50%',
                    background: m.colorHex, flexShrink: 0
                  }}
                />
                {tr(m.name)}
                <span style={{ marginLeft: 'auto', fontSize: '11px' }}>
                  {tr(m.direction === 'ascend' ? '↑升' : '↓降')}
                </span>
              </button>
            </div>
          );
        })}
      </div>
      )}

      {/* 经络信息卡 */}
      {card && (
        <div
          className="panel-pop"
          style={{
            ...panelStyle,
            position: 'fixed', right: '210px', top: '90px', zIndex: 101,
            width: '260px', background: UI.panelBgStrong,
            borderRadius: RADIUS.md, padding: '18px', animation: 'fadeIn 0.3s'
          }}
        >
          <CloseButton onClose={onCloseCard} />
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: card.colorHex }}>{tr(card.name)}</div>
          <div style={{ fontSize: '12px', color: UI.textMuted, margin: '6px 0 10px' }}>
            {tr(card.path)} · {tr(card.direction === 'ascend' ? '↑ 升（左路）' : '↓ 降（右路）')} ·{' '}
            {tr(card.yin ? '阴经（脏）' : '阳经（腑）')}
          </div>
          <div style={{ fontSize: '12px', lineHeight: 1.8, color: UI.textPrimary }}>
            <strong style={{ color: UI.accent }}>{tr('升降失常：')}</strong>
            {card.symptomsIfAbnormal.map((s) => tr(s)).join(tr('、'))}
          </div>
          {(() => {
            const refs = ARTICLES.filter((a) => a.relatedMeridians.includes(card.name));
            return refs.length > 0 ? (
              <div style={{ fontSize: '11px', color: UI.textSecondary, lineHeight: 1.8, marginTop: '6px' }}>
                <strong style={{ color: UI.accent }}>{tr('对应条文：')}</strong>
                {refs.map((a) => tr(articleLabel(a))).join(tr('、'))}{tr('（见"条文阅读"）')}
              </div>
            ) : null;
          })()}
          <Disclaimer />
        </div>
      )}

      {/* 脏腑信息卡（点击解剖位节点） */}
      {selectedOrgan && (
        <div
          className="panel-pop"
          style={{
            ...panelStyle,
            position: 'fixed', right: '210px', top: '90px', zIndex: 101,
            width: '270px', background: UI.panelBgStrong,
            borderRadius: RADIUS.md, padding: '18px', animation: 'fadeIn 0.3s'
          }}
        >
          <CloseButton onClose={onCloseCard} />
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: selectedOrgan.colorHex }}>
            {tr(selectedOrgan.name)}（{tr(selectedOrgan.meridian)}）
          </div>
          <div style={{ fontSize: '11px', color: UI.textMuted, margin: '6px 0 10px' }}>
            {tr(selectedOrgan.symbol)} · {tr(selectedOrgan.desc)}
          </div>
          <div style={{ fontSize: '12px', lineHeight: 1.8, color: UI.textPrimary }}>
            {tr(selectedOrgan.detail)}
          </div>
          <Disclaimer />
        </div>
      )}
    </>
  );
}

function CloseButton({ onClose }: { onClose: () => void }) {
  return (
    <button
      onClick={onClose}
      aria-label={tr('关闭信息卡')}
      style={{
        position: 'absolute', top: '10px', right: '10px',
        background: 'none', border: 'none', color: UI.textMuted,
        fontSize: '18px', cursor: 'pointer'
      }}
    >
      ×
    </button>
  );
}

function Disclaimer() {
  return (
    <div style={{ marginTop: '12px', fontSize: '10px', color: UI.textFaint, lineHeight: 1.6 }}>
      {tr(getAcademicDisclaimer())}·{tr('仅供学习，非医疗建议')}
    </div>
  );
}
