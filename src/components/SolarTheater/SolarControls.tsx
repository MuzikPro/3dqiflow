import { SOLAR_TERMS, SEASON_PHASES } from '@/data/solarTerms';
import { getAcademicDisclaimer } from '@/utils/academicCheck';
import { UI, RADIUS } from '@/styles/theme';
import { panelStyle, toggleButtonStyle } from '../UI/panelStyle';

interface Props {
  termIndex: number;
  detailIndex: number | null;
  onCloseDetail: () => void;
  onJump: (index: number) => void;
  playing: boolean;
  onPlayToggle: () => void;
  slowmo: boolean;
  onSlowmoToggle: () => void;
  compare: boolean;
  onCompareToggle: () => void;
  humanSync: boolean;
  onHumanSyncToggle: () => void;
}

/** 节气所属季段标签（春木/夏火/秋金/冬水） */
function phaseLabel(index: number): string {
  for (const phase of Object.values(SEASON_PHASES)) {
    if (index >= phase.start && index <= phase.end) return phase.label;
  }
  return '';
}

export function SolarControls(props: Props) {
  const {
    termIndex, detailIndex, onCloseDetail, onJump,
    playing, onPlayToggle, slowmo, onSlowmoToggle,
    compare, onCompareToggle, humanSync, onHumanSyncToggle
  } = props;

  const term = SOLAR_TERMS[termIndex];
  const detail = detailIndex !== null ? SOLAR_TERMS[detailIndex] : null;

  return (
    <>
      {/* 左侧：播放控制 */}
      <div
        style={{
          ...panelStyle,
          position: 'fixed', left: '20px', top: '90px', zIndex: 100,
          borderRadius: RADIUS.md, padding: '14px 16px',
          display: 'flex', flexDirection: 'column', gap: '8px', width: '170px'
        }}
      >
        <button style={toggleButtonStyle(playing)} onClick={onPlayToggle}>
          {playing ? '⏸ 暂停' : '▶ 播放'}
        </button>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          <button style={toggleButtonStyle(slowmo)} onClick={onSlowmoToggle}>慢动作</button>
          <button style={toggleButtonStyle(compare)} onClick={onCompareToggle}>对比</button>
          <button style={toggleButtonStyle(humanSync)} onClick={onHumanSyncToggle}>人体联动</button>
        </div>
        <div style={{ fontSize: '11px', color: UI.textMuted, lineHeight: 1.7, marginTop: '4px' }}>
          冬至沉于底 · 夏至浮于顶
          <br />
          左半圈升 · 右半圈降
        </div>
      </div>

      {/* 当前节气 + 消息卦 */}
      <div
        style={{
          ...panelStyle,
          position: 'fixed', right: '20px', top: '90px', zIndex: 100,
          borderRadius: RADIUS.md, padding: '14px 18px', width: '190px'
        }}
      >
        <div style={{ fontSize: '20px', color: UI.accent, letterSpacing: '2px' }}>{term.name}</div>
        <div style={{ fontSize: '12px', color: UI.textSecondary, margin: '4px 0' }}>
          {term.desc} · {phaseLabel(termIndex)}
        </div>
        {term.gua && (
          <div style={{ fontSize: '12px', color: UI.textPrimary, lineHeight: 1.8 }}>
            <strong style={{ color: UI.accent }}>消息卦：</strong>
            {term.gua}（阳爻 {term.yangCount} · 阴爻 {term.yinCount}）
          </div>
        )}
      </div>

      {/* 节气详情卡（点击刻度光点） */}
      {detail && (
        <div
          style={{
            ...panelStyle,
            position: 'fixed', right: '20px', top: '230px', zIndex: 101,
            width: '250px', background: UI.panelBgStrong,
            borderRadius: RADIUS.md, padding: '18px', animation: 'fadeIn 0.3s'
          }}
        >
          <button
            onClick={onCloseDetail}
            aria-label="关闭详情"
            style={{
              position: 'absolute', top: '10px', right: '10px',
              background: 'none', border: 'none', color: UI.textMuted, fontSize: '18px', cursor: 'pointer'
            }}
          >
            ×
          </button>
          <div style={{ fontSize: '16px', fontWeight: 'bold', color: detail.colorHex }}>{detail.name}</div>
          <div style={{ fontSize: '12px', color: UI.textMuted, margin: '6px 0' }}>
            {detail.desc} · {phaseLabel(detailIndex!)}
          </div>
          <div style={{ fontSize: '12px', color: UI.textPrimary, lineHeight: 1.9 }}>
            {detail.gua && (
              <>
                <strong style={{ color: UI.accent }}>消息卦：</strong>
                {detail.gua}（阳爻 {detail.yangCount} · 阴爻 {detail.yinCount}）
                <br />
              </>
            )}
            <strong style={{ color: UI.accent }}>人体气机：</strong>
            {detailIndex !== null && (termPhaseText(detailIndex))}
          </div>
          <div style={{ marginTop: '12px', fontSize: '10px', color: UI.textFaint, lineHeight: 1.6 }}>
            节气与人体气机的对应是教学模型简化，临床必须辨证。
            {getAcademicDisclaimer()}·仅供学习，非医疗建议
          </div>
        </div>
      )}

      {/* 底部：节气滑块 */}
      <div
        style={{
          ...panelStyle,
          position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 100, padding: '12px 24px', borderRadius: RADIUS.pill,
          display: 'flex', alignItems: 'center', gap: '12px'
        }}
      >
        <span style={{ fontSize: '12px', color: UI.accent }}>🌸</span>
        <input
          type="range"
          min={0}
          max={SOLAR_TERMS.length - 1}
          value={termIndex}
          aria-label="二十四节气"
          onChange={(e) => onJump(parseInt(e.target.value, 10))}
          style={{ width: '320px', accentColor: UI.accent }}
        />
        <span style={{ fontSize: '13px', color: UI.accent, minWidth: '110px' }}>
          {term.name} · {term.desc}
        </span>
      </div>
    </>
  );
}

/** 人体气机对应（左升右降在年尺度上的位置描述，派生自圆圈相位） */
function termPhaseText(index: number): string {
  const label = phaseLabel(index);
  if (label.startsWith('春')) return '左路升气渐旺（人体左半暖）';
  if (label.startsWith('夏')) return '阳气浮于上（中轴明亮全速）';
  if (label.startsWith('秋')) return '右路降气渐旺（人体右半凉）';
  return '阳气沉藏于下（气机收敛缓行）';
}
