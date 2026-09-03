import { Organ, ORGANS } from '@/data/organs';
import { SOLAR_TERMS } from '@/data/solarTerms';
import { MERIDIAN_CLOCK } from '@/data/meridianClock';
import { CHAPTER_SOLAR_MAP } from '@/data/chapterSolarMap';
import { LEARNING_STAGES } from '@/data/learningPath';
import { checkAcademic, getAcademicDisclaimer } from '@/utils/academicCheck';
import { COLORS, RADIUS, ELEMENT_LABELS, UI } from '@/styles/theme';
import { panelStyle, toggleButtonStyle } from '../UI/panelStyle';
import { QiMode } from './qiMotion';
import { tr } from '@/i18n';

interface Props {
  selectedOrgan: Organ | null;
  pairedOrgan: Organ | null;
  onCloseCard: () => void;
  seasonIndex: number;
  onSeasonChange: (index: number) => void;
  mode: QiMode;
  onModeChange: (mode: QiMode) => void;
  onOpenFormula: (name: string) => void;
  /** 图例点击：召出该五行组的脏腑（常态只显示四正，脾胃/心包三焦由此召出） */
  onSelectElement: (key: string) => void;
  // ── 子午流注时辰条（owner 2026-08-19 需求） ──
  clockIndex: number;
  clockLive: boolean;
  onClockSelect: (index: number) => void;
  onClockLive: () => void;
  onOpenMeridian?: (name: string) => void;
  // ── 节气实时/手动 ──
  seasonLive: boolean;
  onSeasonToday: () => void;
  // ── 节气皮肤（DELIVERY_MERGE_ENERGY）──
  skin: 'classic' | 'solar';
  onSkinChange: (skin: 'classic' | 'solar') => void;
  solarStage: number;
  onSolarStageChange: (stage: number) => void;
  todayTermIndex: number;
}


export function Controls(props: Props) {
  const {
    selectedOrgan, pairedOrgan, onCloseCard, seasonIndex, onSeasonChange,
    onSelectElement,
    clockIndex, clockLive, onClockSelect, onClockLive, onOpenMeridian,
    seasonLive, onSeasonToday,
    skin, onSkinChange, solarStage, onSolarStageChange, todayTermIndex
  } = props;
  const solarEntry = CHAPTER_SOLAR_MAP[solarStage - 1];
  const solarStageMeta = LEARNING_STAGES[solarStage - 1];
  const todayTerm = SOLAR_TERMS[todayTermIndex];
  const currentSeason = SOLAR_TERMS[seasonIndex];
  const clockEntry = MERIDIAN_CLOCK[clockIndex];
  const clockOrganColor = ORGANS.find((o) => o.name === clockEntry.organ)?.colorHex ?? UI.accent;
  const academicResult = selectedOrgan ? checkAcademic(selectedOrgan.detail) : null;


  return (
    <>
      {/* 视图皮肤 + 病理教学 */}
      <div
        className="panel-left"
        style={{
          ...panelStyle,
          position: 'fixed',
          left: '20px',
          top: '90px',
          zIndex: 100,
          borderRadius: RADIUS.md,
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          width: '190px'
        }}
      >
        {/* 视图皮肤：经典轴轮 / 节气能量圈（同一场景换叙事） */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button style={toggleButtonStyle(skin === 'classic')} onClick={() => onSkinChange('classic')}>
            {tr('经典')}
          </button>
          <button style={toggleButtonStyle(skin === 'solar')} onClick={() => onSkinChange('solar')}>
            {tr('节气')}
          </button>
        </div>
        {/* owner 2026-08-26：病理教学（轴坏/轮滞/复常）按钮组撤下 */}
        {/* 节气皮肤：六经↔节气 天人相应卡（绑定学习路径） */}
        {skin === 'solar' && solarEntry && (
          <>
            <div style={{ fontSize: '11px', color: UI.textMuted }}>{tr('六经 ↔ 节气（默认=当前所学）')}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {CHAPTER_SOLAR_MAP.map((entry) => (
                <button
                  key={entry.stage}
                  title={`${LEARNING_STAGES[entry.stage - 1].name} · ${entry.oneLiner}`}
                  style={{
                    ...toggleButtonStyle(entry.stage === solarStage),
                    fontSize: '10px', padding: '2px 7px'
                  }}
                  onClick={() => onSolarStageChange(entry.stage)}
                >
                  {LEARNING_STAGES[entry.stage - 1].chapter.replace('辨', '').replace('病脉证并治上', '').replace('病脉证并治', '')}
                </button>
              ))}
            </div>
            <div style={{ fontSize: '12px', color: UI.accent, fontWeight: 'bold' }}>
              {solarStageMeta.name} ↔ {solarEntry.pointsOnly
                ? `${solarEntry.solarStart}·${solarEntry.solarEnd} ${tr('二分点')}`
                : solarEntry.solarStart === solarEntry.solarEnd
                  ? solarEntry.solarStart
                  : `${solarEntry.solarStart}→${solarEntry.solarEnd}`}
            </div>
            <div style={{ fontSize: '11px', color: UI.textPrimary, lineHeight: 1.7 }}>
              {solarEntry.oneLiner}
              <br />
              {solarEntry.detail}
            </div>
            <div style={{ fontSize: '11px', color: UI.textSecondary, lineHeight: 1.7 }}>
              {tr('今日')} · {todayTerm.name} · {todayTerm.desc}
              {todayTerm.gua && (
                <>
                  <br />
                  {tr('消息卦：')}{todayTerm.gua}（{tr('阳爻')}{todayTerm.yangCount}·{tr('阴爻')}{todayTerm.yinCount}）
                </>
              )}
            </div>
            <div style={{ fontSize: '9px', color: UI.textFaint, lineHeight: 1.5 }}>
              {tr('六经与节气的对应为教学措辞，非逐字引文。')}
            </div>
          </>
        )}
      </div>

      {/* 子午流注时辰条：实时（跟随系统时间）/ 手动点选 */}
      <div
        className="bar-bottom"
        style={{
          ...panelStyle,
          position: 'fixed',
          bottom: '108px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          borderRadius: RADIUS.pill,
          padding: '6px 14px'
        }}
      >
        <button
          onClick={onClockLive}
          title={tr('跟随系统时间')}
          style={{
            ...toggleButtonStyle(clockLive),
            fontSize: '11px', padding: '2px 8px'
          }}
        >
          {clockLive ? `● ${tr('实时')}` : tr('实时')}
        </button>
        <div style={{ display: 'flex', gap: '2px' }}>
          {MERIDIAN_CLOCK.map((entry, i) => {
            const active = i === clockIndex;
            const color = ORGANS.find((o) => o.name === entry.organ)?.colorHex ?? UI.accent;
            return (
              <button
                key={entry.shichen}
                onClick={() => onClockSelect(i)}
                title={`${entry.shichen}${tr('时')} ${entry.hours} · ${entry.meridianFull}`}
                style={{
                  width: '26px', padding: '2px 0', fontSize: '10px', lineHeight: 1.25,
                  background: active ? `${color}22` : 'transparent',
                  border: `1px solid ${active ? color : UI.panelBorder}`,
                  borderRadius: '6px', cursor: 'pointer',
                  color: active ? color : UI.textMuted
                }}
              >
                {entry.shichen}
                <br />
                {entry.organ.length > 1 ? entry.organ[0] : entry.organ}
              </button>
            );
          })}
        </div>
        <div style={{ fontSize: '11px', color: clockOrganColor, whiteSpace: 'nowrap' }}>
          {clockEntry.hours}{tr('时')} {clockEntry.meridianFull}{tr('当令')}
          <span style={{ color: UI.textMuted }}> · {clockEntry.note}</span>
        </div>
        {onOpenMeridian && (
          <button
            onClick={() => onOpenMeridian(clockEntry.meridian)}
            style={{ ...toggleButtonStyle(false), fontSize: '10px', padding: '2px 8px' }}
          >
            {tr('经络→3D')}
          </button>
        )}
      </div>

      {/* 图例 */}
      <div
        className="bar-bottom"
        style={{
          ...panelStyle,
          position: 'fixed',
          bottom: '70px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          display: 'flex',
          gap: '16px',
          borderRadius: RADIUS.pill,
          padding: '6px 20px'
        }}
      >
        {ELEMENT_LABELS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onSelectElement(key)}
            title={`${tr('点击召出')} ${label}`}
            style={{
              display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px',
              color: UI.textSecondary, background: 'transparent', border: 'none',
              cursor: 'pointer', padding: 0
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: COLORS[key].primary
              }}
            />
            {label}
          </button>
        ))}
        <span className="hide-narrow" style={{ fontSize: '10px', color: UI.textFaint }}>{tr('点击召出对应脏腑')}</span>
      </div>

      {/* 节气滑块 */}
      <div
        className="bar-bottom"
        style={{
          ...panelStyle,
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 100,
          padding: '12px 24px',
          borderRadius: RADIUS.pill,
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        <span style={{ fontSize: '12px', color: UI.accent }}>🌸</span>
        <input
          type="range"
          min={0}
          max={23}
          value={seasonIndex}
          aria-label={tr('二十四节气')}
          onChange={(e) => onSeasonChange(parseInt(e.target.value, 10))}
          style={{ width: '300px', accentColor: UI.accent }}
        />
        <span style={{ fontSize: '13px', color: UI.accent, minWidth: '100px' }}>
          {seasonLive ? `${tr('今日')}·` : ''}{currentSeason.name} · {currentSeason.desc}
        </span>
        {!seasonLive && (
          <button
            onClick={onSeasonToday}
            title={tr('回到今日节气（按日期推算，与地理位置无关）')}
            style={{ ...toggleButtonStyle(false), fontSize: '11px', padding: '2px 8px' }}
          >
            {tr('回到今日')}
          </button>
        )}
      </div>

      {/* 脏腑信息卡 */}
      {selectedOrgan && (
        <div
          className="panel-pop"
          style={{
            ...panelStyle,
            position: 'fixed',
            right: '20px',
            top: '80px',
            zIndex: 100,
            width: '280px',
            background: UI.panelBgStrong,
            borderRadius: RADIUS.md,
            padding: '20px',
            animation: 'fadeIn 0.3s'
          }}
        >
          <button
            onClick={onCloseCard}
            aria-label={tr('关闭信息卡')}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'none',
              border: 'none',
              color: UI.textMuted,
              fontSize: '18px',
              cursor: 'pointer'
            }}
          >
            ×
          </button>
          <div
            style={{
              fontSize: '16px',
              fontWeight: 'bold',
              color: selectedOrgan.colorHex,
              marginBottom: '4px'
            }}
          >
            {selectedOrgan.name}（{selectedOrgan.meridian}）
          </div>
          <div style={{ fontSize: '11px', color: UI.textMuted, marginBottom: '10px' }}>
            {selectedOrgan.symbol} · {selectedOrgan.desc}
          </div>
          <div style={{ fontSize: '13px', lineHeight: 1.8, color: UI.textPrimary }}>
            <strong style={{ color: UI.accent }}>{tr('升降：')}</strong>
            {selectedOrgan.direction === 'ascend' ? `↑ ${tr('升')}` : `↓ ${tr('降')}`}
            {pairedOrgan && (
              <>
                <br />
                <strong style={{ color: UI.accent }}>{tr('表里配对：')}</strong>
                <span style={{ color: pairedOrgan.colorHex }}>{pairedOrgan.name}</span>
                （{pairedOrgan.direction === 'ascend' ? `↑ ${tr('升')}` : `↓ ${tr('降')}`}）{tr('—— 一升一降合成')}
                {selectedOrgan.desc.slice(0, 2)}{tr('圆运动')}
              </>
            )}
            <br />
            <strong style={{ color: UI.accent }}>{tr('详情：')}</strong>
            {selectedOrgan.detail}
          </div>
          {academicResult && !academicResult.pass && (
            <div
              style={{
                marginTop: '10px',
                padding: '8px',
                background: COLORS.fire.glow,
                borderRadius: RADIUS.sm,
                fontSize: '11px',
                color: COLORS.fire.primary
              }}
            >
              ⚠️ {academicResult.suggestion}
            </div>
          )}
          <div style={{ marginTop: '12px', fontSize: '10px', color: UI.textFaint, lineHeight: 1.6 }}>
            {getAcademicDisclaimer()}·{tr('仅供学习，非医疗建议')}
          </div>
        </div>
      )}
    </>
  );
}
