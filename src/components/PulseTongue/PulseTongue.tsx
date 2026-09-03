import { Suspense, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { PULSES, PulseType } from '@/data/pulses';
import { TONGUE_COATINGS, TongueCoating, COMBINED_DIAGNOSIS, CombinedDiagnosis } from '@/data/tongueCoatings';
import { ARTICLES, articleLabel } from '@/data/articles';
import { getFormulaByName } from '@/data/formulas';
import { BACKGROUND, THREE_DEFAULTS, UI, RADIUS, COLORS } from '@/styles/theme';
import { panelStyle, toggleButtonStyle } from '../UI/panelStyle';
import { getAcademicDisclaimer } from '@/utils/academicCheck';
import { BodyFigure } from '../MeridianTheater/BodyFigure';
import { BodyMesh } from '../MeridianTheater/BodyMesh';
import { PulseWaves } from './PulseWaves';
import { TongueModel } from './TongueModel';
import { PengQuoteCard } from '../UI/PengQuoteCard';

type Tab = 'pulse' | 'tongue';
type TongueView = 'front' | 'side' | 'under';

const TONGUE_CAMERAS: Record<TongueView, [number, number, number]> = {
  front: [0, 1.6, 3.6],
  side: [3.6, 0.8, 0.4],
  under: [0, -3.4, 1.6]
};

function TongueCameraRig({ view }: { view: TongueView }) {
  const camera = useThree((s) => s.camera);
  useEffect(() => {
    camera.position.set(...TONGUE_CAMERAS[view]);
    camera.lookAt(0, 0, 0.2);
  }, [view, camera]);
  return null;
}

function SectionTitle({ text }: { text: string }) {
  return (
    <div style={{ fontSize: '10px', color: UI.textMuted, letterSpacing: '2px', margin: '10px 0 5px' }}>
      {text}
    </div>
  );
}

function Chip({ text, color, onClick }: { text: string; color: string; onClick?: () => void }) {
  const style = {
    display: 'inline-block', fontSize: '10px', padding: '2px 8px', borderRadius: RADIUS.pill,
    marginRight: '4px', marginBottom: '4px', color, border: `1px solid ${color}`,
    background: 'transparent', cursor: onClick ? 'pointer' : 'default'
  } as const;
  return onClick ? (
    <button onClick={onClick} style={style}>{text} →</button>
  ) : (
    <span style={style}>{text}</span>
  );
}

/** 特征五维 + 解读 + 鉴别 + 关联 + 学习要点（脉/舌通用信息卡主体） */
function InfoBody({
  characteristics,
  labels,
  interpretation,
  keyPoint,
  analogy,
  diffs,
  articleIds,
  formulaNames,
  studyPoints,
  onOpenArticle,
  onOpenFormula
}: {
  characteristics?: Record<string, string>;
  labels: Record<string, string>;
  interpretation?: string;
  keyPoint?: string;
  analogy?: string;
  diffs?: Array<{ vs: string; diff: string }>;
  articleIds?: number[];
  formulaNames?: string[];
  studyPoints?: string[];
  onOpenArticle: (id: number) => void;
  onOpenFormula: (name: string) => void;
}) {
  const citedArticles = (articleIds ?? [])
    .map((id) => ARTICLES.find((a) => a.id === id))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));
  return (
    <>
      {characteristics && (
        <>
          <SectionTitle text="特征" />
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
            <tbody>
              {Object.entries(characteristics).map(([key, val]) => (
                <tr key={key}>
                  <td style={{ color: UI.textMuted, padding: '2px 6px 2px 0', width: '38px', verticalAlign: 'top' }}>
                    {labels[key] ?? key}
                  </td>
                  <td style={{ color: UI.textPrimary, padding: '2px 0' }}>{val}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      {interpretation && (
        <>
          <SectionTitle text="圆运动解读" />
          <div
            style={{
              fontSize: '12px', color: UI.textPrimary, lineHeight: 1.8,
              borderLeft: `3px solid ${COLORS.earth.primary}`, paddingLeft: '10px'
            }}
          >
            {interpretation}
            {keyPoint && <div style={{ color: UI.accent, marginTop: '4px' }}>🔑 {keyPoint}</div>}
          </div>
        </>
      )}
      {analogy && (
        <>
          <SectionTitle text="比喻" />
          <div style={{ fontSize: '11px', color: UI.textSecondary, fontStyle: 'italic', lineHeight: 1.7 }}>
            💡 {analogy}
          </div>
        </>
      )}
      {diffs && diffs.length > 0 && (
        <>
          <SectionTitle text="鉴别要点" />
          <div style={{ fontSize: '11px', color: UI.textPrimary, lineHeight: 1.7 }}>
            {diffs.map((d) => (
              <div key={d.vs}>
                <span style={{ color: COLORS.earth.primary }}>vs {d.vs}：</span>
                {d.diff}
              </div>
            ))}
          </div>
        </>
      )}
      {citedArticles.length > 0 && (
        <>
          <SectionTitle text="关联条文" />
          <div>
            {citedArticles.map((a) => (
              <Chip key={a.id} text={articleLabel(a)} color={COLORS.water.primary} onClick={() => onOpenArticle(a.id)} />
            ))}
          </div>
        </>
      )}
      {formulaNames && formulaNames.length > 0 && (
        <>
          <SectionTitle text="关联方剂" />
          <div>
            {formulaNames.map((name) => (
              <Chip
                key={name}
                text={name}
                color={UI.accent}
                onClick={getFormulaByName(name) ? () => onOpenFormula(name) : undefined}
              />
            ))}
          </div>
        </>
      )}
      {studyPoints && studyPoints.length > 0 && (
        <>
          <SectionTitle text="学习要点" />
          <ul style={{ fontSize: '11px', color: UI.textPrimary, lineHeight: 1.8, paddingLeft: '16px', margin: 0 }}>
            {studyPoints.map((sp) => (
              <li key={sp}>{sp}</li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}

const PULSE_CHAR_LABELS = { rate: '至数', rhythm: '节律', strength: '力量', depth: '深度', shape: '形态' };
const TONGUE_CHAR_LABELS = { color: '舌色', coating: '舌苔', moisture: '润燥', shape: '形态', texture: '质地' };

interface Props {
  onOpenFormula: (name: string) => void;
  onOpenArticle: (id: number) => void;
  /** 双书联动：条文页跳入时预选的脉/舌 */
  initialPulse?: string | null;
  initialTongue?: string | null;
}

/**
 * 脉法 / 舌苔 3D（场景5 + DELIVERY_PULSE_TONGUE_V3）：
 * 脉法页——波形沿左右升降轨传播；舌苔页——舌模型（8 种舌象，含裂纹/齿痕/胖瘦）。
 * v3 新增：全 8 脉完整解读、六经脉舌联合诊断矩阵、条文/方剂交叉链接。
 */
export function PulseTongue({ onOpenFormula, onOpenArticle, initialPulse, initialTongue }: Props) {
  const [tab, setTab] = useState<Tab>(initialTongue && !initialPulse ? 'tongue' : 'pulse');
  const [pulse, setPulse] = useState<PulseType>(
    () => PULSES.find((p) => p.name === initialPulse) ?? PULSES[0]
  );
  const [compare, setCompare] = useState(false);
  const [coating, setCoating] = useState<TongueCoating>(
    () => TONGUE_COATINGS.find((c) => c.name === initialTongue) ?? TONGUE_COATINGS[0]
  );
  const [showRegions, setShowRegions] = useState(true);
  const [tongueView, setTongueView] = useState<TongueView>('front');
  const [combined, setCombined] = useState<CombinedDiagnosis | null>(null);

  const { camera, lights } = THREE_DEFAULTS;
  const normal = PULSES[0];

  const pickPulse = (p: PulseType) => {
    setPulse(p);
    setCombined(null);
  };
  const pickCoating = (c: TongueCoating) => {
    setCoating(c);
    setCombined(null);
  };
  // 联合诊断：同时定位脉+舌（3D 演示主脉，标签保留原文复合脉名）
  const pickCombined = (entry: CombinedDiagnosis) => {
    const p = PULSES.find((x) => x.name === entry.pulseKey);
    const c = TONGUE_COATINGS.find((x) => x.name === entry.tongueKey);
    if (p) setPulse(p);
    if (c) setCoating(c);
    setCombined(entry);
  };

  return (
    <div className="scene-root" style={{ width: '100vw', height: '100vh', background: BACKGROUND.gradient }}>
      {/* 渲染管线设置与其他暗夜场景一致（见项目备忘） */}
      <Canvas
        key={tab}
        flat
        legacy
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.LinearSRGBColorSpace;
        }}
        camera={{
          fov: camera.fov,
          near: camera.near,
          far: camera.far,
          position: tab === 'pulse' ? [0, 0.8, 10] : TONGUE_CAMERAS.front
        }}
        style={{ background: BACKGROUND.gradient }}
      >
        <ambientLight color={lights.ambient.color} intensity={tab === 'tongue' ? 0.7 : lights.ambient.intensity} />
        <pointLight color={lights.center.color} intensity={1.2} distance={30} decay={0} position={[1, 3, 5]} />
        {/* 塑形舌体要有方向光才显出沟壑起伏 */}
        {tab === 'tongue' && <directionalLight position={[2, 4, 5]} intensity={0.9} />}
        {tab === 'tongue' && <directionalLight position={[-3, 1, 2]} intensity={0.3} />}
        {/* 舌底视角的补光：否则舌下络脉黑成一团 */}
        {tab === 'tongue' && <directionalLight position={[0, -4, 3]} intensity={0.55} />}

        {tab === 'pulse' ? (
          <>
            <Suspense fallback={<BodyFigure />}>
              {/* v3 humanSilhouette.opacity 照搬（交付按剪影设计，NIH 网格乘 0.6 等效） */}
              <BodyMesh opacity={(pulse.visual3D?.humanSilhouette.opacity ?? 0.65) * 0.6} />
            </Suspense>
            <PulseWaves left={compare ? normal : pulse} right={pulse} />
            <OrbitControls enableRotate={false} enablePan={false} target={[0, 0.7, 0]} minDistance={6} maxDistance={16} />
          </>
        ) : (
          <>
            <TongueModel coating={coating} showRegions={showRegions} />
            <TongueCameraRig view={tongueView} />
            <OrbitControls enableDamping dampingFactor={0.1} enablePan={false} target={[0, 0, 0.2]} minDistance={2} maxDistance={8} />
          </>
        )}
      </Canvas>

      {/* 左侧：选择器 + 联合诊断矩阵 */}
      <div
        className="panel-left"
        style={{
          ...panelStyle,
          position: 'fixed', left: '20px', top: '90px', zIndex: 100,
          borderRadius: RADIUS.md, padding: '14px 16px',
          display: 'flex', flexDirection: 'column', gap: '10px', width: '220px',
          maxHeight: '78vh', overflowY: 'auto'
        }}
      >
        <div style={{ display: 'flex', gap: '6px' }}>
          <button style={toggleButtonStyle(tab === 'pulse')} onClick={() => setTab('pulse')}>脉法</button>
          <button style={toggleButtonStyle(tab === 'tongue')} onClick={() => setTab('tongue')}>舌象</button>
        </div>
        {tab === 'pulse' ? (
          <>
            <div style={{ fontSize: '11px', color: UI.textMuted }}>脉象（位·数·形·势）</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {PULSES.map((p) => (
                <button key={p.name} style={toggleButtonStyle(pulse.name === p.name)} onClick={() => pickPulse(p)}>
                  {p.name}
                </button>
              ))}
            </div>
            <button style={toggleButtonStyle(compare)} onClick={() => setCompare((v) => !v)}>
              对比（左平右病）
            </button>
          </>
        ) : (
          <>
            <div style={{ fontSize: '11px', color: UI.textMuted }}>舌象（舌质+苔型）</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {TONGUE_COATINGS.map((c) => (
                <button key={c.name} style={toggleButtonStyle(coating.name === c.name)} onClick={() => pickCoating(c)}>
                  {c.name.split('（')[0]}
                </button>
              ))}
            </div>
            <div style={{ fontSize: '11px', color: UI.textMuted }}>视角</div>
            <div style={{ display: 'flex', gap: '6px' }}>
              {(['front', 'side', 'under'] as TongueView[]).map((view) => (
                <button key={view} style={toggleButtonStyle(tongueView === view)} onClick={() => setTongueView(view)}>
                  {view === 'front' ? '正面' : view === 'side' ? '侧面' : '舌底'}
                </button>
              ))}
            </div>
            <button style={toggleButtonStyle(showRegions)} onClick={() => setShowRegions((v) => !v)}>
              五行分区光环
            </button>
          </>
        )}

        {/* 六经脉舌联合诊断矩阵（v3） */}
        <div style={{ fontSize: '11px', color: UI.textMuted, marginTop: '4px' }}>六经脉舌联合诊断</div>
        <div>
          {COMBINED_DIAGNOSIS.map((entry) => (
            <button
              key={entry.syndrome}
              onClick={() => pickCombined(entry)}
              style={{
                display: 'flex', width: '100%', alignItems: 'center', gap: '6px',
                background: combined?.syndrome === entry.syndrome ? UI.panelBorder : 'transparent',
                border: 'none', borderRadius: RADIUS.sm, padding: '4px 6px',
                cursor: 'pointer', textAlign: 'left'
              }}
            >
              <span style={{ fontSize: '11px', color: UI.textPrimary, whiteSpace: 'nowrap' }}>{entry.syndrome}</span>
              <span style={{ fontSize: '10px', color: COLORS.wood.primary }}>{entry.pulseLabel}</span>
              <span style={{ fontSize: '10px', color: UI.textMuted, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {entry.tongueLabel}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 彭子益点睛（DELIVERY_ABC · B）：脉法页有语录的脉象显示 */}
      {tab === 'pulse' && <PengQuoteCard quoteKey={`pulse_${pulse.name}`} />}

      {/* 右侧：解读面板 */}
      <div
        className="panel-right"
        style={{
          ...panelStyle,
          position: 'fixed', right: '20px', top: '90px', zIndex: 100,
          borderRadius: RADIUS.md, padding: '14px 18px', width: '290px',
          maxHeight: '78vh', overflowY: 'auto'
        }}
      >
        {/* 联合诊断态：四联总览 */}
        {combined && (
          <div
            style={{
              border: `1px solid ${UI.accent}`, borderRadius: RADIUS.sm,
              padding: '8px 10px', marginBottom: '10px', fontSize: '11px',
              color: UI.textPrimary, lineHeight: 1.8
            }}
          >
            <div style={{ color: UI.accent, fontWeight: 'bold' }}>{combined.syndrome} · 四联对应</div>
            脉：{combined.pulseLabel} · 舌：{combined.tongueLabel}
            <br />
            {combined.yuanYundong}
            <div style={{ marginTop: '4px' }}>
              <Chip
                text={`代表方 ${combined.formula}`}
                color={UI.accent}
                onClick={getFormulaByName(combined.formula) ? () => onOpenFormula(combined.formula) : undefined}
              />
            </div>
          </div>
        )}

        {tab === 'pulse' ? (
          <>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: UI.accent }}>
              {pulse.name}
              {pulse.pinyin && (
                <span style={{ fontSize: '11px', color: UI.textMuted, fontWeight: 'normal' }}> {pulse.pinyin}</span>
              )}
            </div>
            <div style={{ fontSize: '12px', color: UI.textPrimary, lineHeight: 1.8, marginTop: '6px' }}>
              {pulse.desc}
            </div>
            <InfoBody
              characteristics={pulse.characteristics}
              labels={PULSE_CHAR_LABELS}
              interpretation={pulse.interpretation}
              keyPoint={pulse.keyPoint}
              analogy={pulse.modernAnalogy}
              diffs={pulse.differentialDiagnosis}
              articleIds={pulse.relatedArticleIds}
              formulaNames={pulse.relatedFormulaNames}
              studyPoints={pulse.studyPoints}
              onOpenArticle={onOpenArticle}
              onOpenFormula={onOpenFormula}
            />
            {compare && (
              <div style={{ fontSize: '11px', color: UI.textMuted, marginTop: '8px' }}>
                对比模式：左轨=平脉（参照），右轨={pulse.name}。
              </div>
            )}
          </>
        ) : (
          <>
            <div style={{ fontSize: '16px', fontWeight: 'bold', color: UI.accent }}>
              {coating.name}
              {coating.pinyin && (
                <span style={{ fontSize: '11px', color: UI.textMuted, fontWeight: 'normal' }}> {coating.pinyin}</span>
              )}
            </div>
            <InfoBody
              characteristics={coating.characteristics}
              labels={TONGUE_CHAR_LABELS}
              interpretation={coating.interpretation}
              keyPoint={coating.keyPoint}
              analogy={coating.modernAnalogy}
              diffs={coating.differentialDiagnosis}
              articleIds={coating.relatedArticleIds}
              formulaNames={coating.relatedFormulaNames}
              studyPoints={coating.studyPoints}
              onOpenArticle={onOpenArticle}
              onOpenFormula={onOpenFormula}
            />
            <div style={{ fontSize: '11px', color: UI.textSecondary, lineHeight: 1.8, marginTop: '8px' }}>
              舌面分区：舌尖=心火，舌中=脾胃（中轴），舌根=肾水，舌边=肝胆。
            </div>
          </>
        )}
        <div style={{ marginTop: '10px', fontSize: '10px', color: UI.textFaint, lineHeight: 1.6 }}>
          脉舌与圆运动的对应是教学示意，非诊断工具；解读属学习笔记，未经专家审核。
          {getAcademicDisclaimer()}·仅供学习，非医疗建议
        </div>
      </div>
    </div>
  );
}
