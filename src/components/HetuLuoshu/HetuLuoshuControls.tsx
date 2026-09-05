import { HetuPair, LuoshuPalace } from '@/data/hetuLuoshu';
import { ELEMENT_COLORS } from '@/data/organs';
import { SOLAR_TERMS } from '@/data/solarTerms';
import { getAcademicDisclaimer } from '@/utils/academicCheck';
import { tr } from '@/i18n';
import { UI, RADIUS } from '@/styles/theme';
import { panelStyle, toggleButtonStyle } from '../UI/panelStyle';

export type HetuLuoshuMode = 'hetu' | 'luoshu' | 'unity';

interface Props {
  mode: HetuLuoshuMode;
  onModeChange: (mode: HetuLuoshuMode) => void;
  layerZ: number;
  onLayerZChange: (z: number) => void;
  termIndex: number;
  onTermChange: (index: number) => void;
  humanSync: boolean;
  onHumanSyncToggle: () => void;
  selectedPair: HetuPair | null;
  selectedPalace: LuoshuPalace | null;
  onCloseCard: () => void;
}

const MODE_LABELS: Record<HetuLuoshuMode, string> = { hetu: '河图', luoshu: '洛书', unity: '合一视图' };

export function HetuLuoshuControls(props: Props) {
  const {
    mode, onModeChange, layerZ, onLayerZChange, termIndex, onTermChange,
    humanSync, onHumanSyncToggle, selectedPair, selectedPalace, onCloseCard
  } = props;
  const term = SOLAR_TERMS[termIndex];

  return (
    <>
      {/* 左侧：模式 + 控制 */}
      <div
        className="panel-left"
        style={{
          ...panelStyle,
          position: 'fixed', left: '20px', top: '90px', zIndex: 100,
          borderRadius: RADIUS.md, padding: '14px 16px',
          display: 'flex', flexDirection: 'column', gap: '10px', width: '200px'
        }}
      >
        {/* 三键放不下一行时换行（合一视图曾溢出面板边框） */}
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {(Object.keys(MODE_LABELS) as HetuLuoshuMode[]).map((key) => (
            <button key={key} style={toggleButtonStyle(mode === key)} onClick={() => onModeChange(key)}>
              {tr(MODE_LABELS[key])}
            </button>
          ))}
        </div>
        {mode === 'hetu' && (
          <>
            <div style={{ fontSize: '11px', color: UI.textMuted }}>{tr('阴阳比 · 天地层距')}</div>
            <input
              type="range" min={0.4} max={2} step={0.05} value={layerZ}
              aria-label={tr('阴阳比')}
              onChange={(e) => onLayerZChange(parseFloat(e.target.value))}
              style={{ width: '150px', accentColor: UI.accent }}
            />
            <button style={toggleButtonStyle(humanSync)} onClick={onHumanSyncToggle}>
              {tr('人体联动')}
            </button>
          </>
        )}
        {mode !== 'hetu' && (
          <>
            <div style={{ fontSize: '11px', color: UI.textMuted }}>
              {tr('节气 · ')}{term.name}{tr('（当令之宫最亮）')}
            </div>
            <input
              type="range" min={0} max={SOLAR_TERMS.length - 1} value={termIndex}
              aria-label={tr('节气')}
              onChange={(e) => onTermChange(parseInt(e.target.value, 10))}
              style={{ width: '150px', accentColor: UI.accent }}
            />
          </>
        )}
        <div style={{ fontSize: '11px', color: UI.textMuted, lineHeight: 1.7 }}>
          {mode === 'hetu' && tr('天(奇·阳)在后层实心，地(偶·阴)在前层线框——如脏在里、腑在表。')}
          {mode === 'luoshu' && tr('戴九履一，左三右七。宫位固定，亮度随节气流转。')}
          {mode === 'unity' && tr('河图为体（后·天地两数合显一体），洛书为用（前·九宫方位），同气以虚线相连。')}
        </div>
      </div>

      {/* 右侧：信息卡 */}
      {(selectedPair || selectedPalace) && (
        <div
          className="panel-pop"
          style={{
            ...panelStyle,
            position: 'fixed', right: '20px', top: '90px', zIndex: 101,
            width: '265px', background: UI.panelBgStrong,
            borderRadius: RADIUS.md, padding: '18px', animation: 'fadeIn 0.3s'
          }}
        >
          <button
            onClick={onCloseCard}
            aria-label={tr('关闭信息卡')}
            style={{
              position: 'absolute', top: '10px', right: '10px',
              background: 'none', border: 'none', color: UI.textMuted, fontSize: '18px', cursor: 'pointer'
            }}
          >
            ×
          </button>
          {selectedPair && (
            <>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: ELEMENT_COLORS[selectedPair.element].hex }}>
                {selectedPair.label}{tr(' · 天')}{selectedPair.heavenNumber}{tr(' 地')}{selectedPair.earthNumber}
              </div>
              <div style={{ fontSize: '12px', color: UI.textMuted, margin: '6px 0 10px' }}>
                {selectedPair.direction}{tr('方 · ')}{selectedPair.nature} · {selectedPair.organs}
              </div>
              <div style={{ fontSize: '12px', lineHeight: 1.9, color: UI.textPrimary }}>{selectedPair.meaning}</div>
            </>
          )}
          {selectedPalace && (
            <>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: ELEMENT_COLORS[selectedPalace.element].hex }}>
                {selectedPalace.guaSymbol} {selectedPalace.gua}
                {selectedPalace.number}{tr(' 宫')}
              </div>
              <div style={{ fontSize: '12px', color: UI.textMuted, margin: '6px 0 10px' }}>
                {selectedPalace.bodyPart} · {selectedPalace.organRole}
              </div>
              <div style={{ fontSize: '12px', lineHeight: 1.9, color: UI.textPrimary }}>
                {tr('洛书九宫是圆运动的空间定位系统：此宫居')}{selectedPalace.bodyPart}{tr('，主')}
                {selectedPalace.organRole}{tr('。拖动节气滑块可见"当令之宫最亮"的时空流转。')}
              </div>
            </>
          )}
          <div style={{ marginTop: '12px', fontSize: '10px', color: UI.textFaint, lineHeight: 1.6 }}>
            {tr('河图洛书与人体的对应是教学模型。')}{tr(getAcademicDisclaimer())}{tr('·仅供学习，非医疗建议')}
          </div>
        </div>
      )}
    </>
  );
}
