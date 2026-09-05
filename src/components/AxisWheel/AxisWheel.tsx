import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useNarrow } from '@/hooks/useNarrow';
import { ORGANS, Organ, getPairedOrgan } from '@/data/organs';
import { SOLAR_TERMS } from '@/data/solarTerms';
import { MERIDIAN_CLOCK, currentShichenIndex, currentSolarTermIndex } from '@/data/meridianClock';
import { CHAPTER_SOLAR_MAP, highlightIndicesFor, currentLearningStage } from '@/data/chapterSolarMap';
import { BACKGROUND, THREE_DEFAULTS } from '@/styles/theme';
import { OrganMesh, OrganHighlight } from './OrganMesh';
import { AxisVortex } from './AxisVortex';
import { CIRCLE_R, CLOCK_POS, EARTH_CENTER } from './clockLayout';
import { QiLoop } from './QiLoop';
import { Starfield } from './Starfield';
import { SeasonRing } from './SeasonRing';
import { Controls } from './Controls';
import { QiMode, createQiMotion, targetsFor } from './qiMotion';
import { FORMULAS, Formula } from '@/data/formulas';
import { FormulaPlay, Phase, phaseColor, phaseText } from '../Formula3D/FormulaPlay';
import { panelStyle, toggleButtonStyle } from '../UI/panelStyle';
import { UI, RADIUS } from '@/styles/theme';
import { tr } from '@/i18n';

/** 演示剧本时间点（ms）：运轴 → 运轮 → 复圆 → 回到常态 */

/** 每帧把仪表盘数值向目标插值（不触发 React 重渲染） */
function MotionLerper({
  motion,
  targetsRef
}: {
  motion: ReturnType<typeof createQiMotion>;
  targetsRef: React.MutableRefObject<ReturnType<typeof targetsFor>>;
}) {
  useFrame((_, delta) => {
    const k = Math.min(1, delta * 2.5);
    const t = targetsRef.current;
    motion.axleSpeed.v += (t.axleSpeed - motion.axleSpeed.v) * k;
    motion.axleGlow.v += (t.axleGlow - motion.axleGlow.v) * k;
    motion.leftFlow.v += (t.leftFlow - motion.leftFlow.v) * k;
    motion.rightFlow.v += (t.rightFlow - motion.rightFlow.v) * k;
    motion.loopGlow.v += (t.loopGlow - motion.loopGlow.v) * k;
  });
  return null;
}

interface Props {
  /** 病理演示联动：跳到方剂详解（理中丸/桂枝汤） */
  onOpenFormula: (name: string) => void;
  /** 时辰条联动：跳到十二经剧场看当令经络 */
  onOpenMeridian?: (name: string) => void;
  /** 时辰条→经穴图子午流注 */
  onOpenClock?: (index: number) => void;
}

export function AxisWheel({ onOpenFormula, onOpenMeridian, onOpenClock }: Props) {
  // 窄屏拉远相机：竖屏横向视野不足，否则圆环/人体被切边
  const narrow = useNarrow();
  const [selectedOrgan, setSelectedOrgan] = useState<Organ | null>(null);
  // 节气默认取"今日"（由日期/时区推算，与地理位置无关）；拖滑块转手动
  const [seasonIndex, setSeasonIndex] = useState(() => currentSolarTermIndex());
  const [seasonLive, setSeasonLive] = useState(true);
  const [seasonTouched, setSeasonTouched] = useState(false);
  // 子午流注时辰：null=跟随系统时间，数字=手动选定
  const [clockManual, setClockManual] = useState<number | null>(null);
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    if (seasonLive) setSeasonIndex(currentSolarTermIndex(now));
  }, [now, seasonLive]);
  const clockIndex = clockManual ?? currentShichenIndex(now);
  const clockEntry = MERIDIAN_CLOCK[clockIndex];
  // 节气皮肤（DELIVERY_MERGE_ENERGY）：同一场景换叙事——节气环常显、
  // 六经章节映射段点亮；默认跟随学习者当前所在阶，可用章节 chips 切换
  const [skin, setSkin] = useState<'classic' | 'solar'>('classic');
  const [solarStage, setSolarStage] = useState<number>(() => currentLearningStage());
  const solarEntry = CHAPTER_SOLAR_MAP[solarStage - 1];
  const todayTermIndex = currentSolarTermIndex(now);
  const [mode, setMode] = useState<QiMode>('normal');
  // 方剂上轮（owner 2026-09-05）：方剂详解侧台的「修圆」放到全图上演——选方即演
  const [formula, setFormula] = useState<Formula | null>(null);
  const [replay, setReplay] = useState(0);
  const [phase, setPhase] = useState<Phase>('disturbed');
  const tight = useNarrow(1000);

  const motion = useMemo(createQiMotion, []);
  const targetsRef = useRef(targetsFor('normal'));
  targetsRef.current = targetsFor(mode);

  const season = SOLAR_TERMS[seasonIndex];

  // 脏腑强调：点击选中 > 病理演示 > 节气当令
  const paired = selectedOrgan ? getPairedOrgan(selectedOrgan) : null;
  const highlightFor = (organ: Organ): OrganHighlight => {
    if (!selectedOrgan) return 'normal';
    if (organ.name === selectedOrgan.name) return 'selected';
    if (paired && organ.name === paired.name) return 'paired';
    return 'dimmed';
  };
  const emphasisFor = (organ: Organ): boolean | null => {
    if (selectedOrgan) return null;
    // 子午流注当令：常态下当令脏腑增强（病理演示时让位）
    if (mode === 'normal' && organ.name === clockEntry.organ) return true;
    if (mode === 'lunZhi') {
      // 上热下寒：火亢于上、水寒于下
      if (organ.element === 'fire') return true;
      if (organ.element === 'water') return false;
      return null;
    }
    if (mode === 'zhouHuai') return organ.element === 'earth' ? false : null;
    if (seasonTouched && mode === 'normal') return organ.element === season.qi;
    return null;
  };

  // 节气光环：仅在滑块使用中及其后 5 秒显示（回应"外圈小球看不懂"——
  // 不用时不占画面；节气教学主场在节气剧场）
  const [ringVisible, setRingVisible] = useState(false);
  const ringTimerRef = useRef<number | null>(null);
  const handleSeasonChange = (index: number) => {
    setSeasonIndex(index);
    setSeasonTouched(true);
    setRingVisible(true);
    if (ringTimerRef.current) window.clearTimeout(ringTimerRef.current);
    ringTimerRef.current = window.setTimeout(() => setRingVisible(false), 5000);
  };
  useEffect(() => () => {
    if (ringTimerRef.current) window.clearTimeout(ringTimerRef.current);
  }, []);

  // 经典圆运动图式：常态只显示四正（心肝肺肾）；脾胃=中轴本身；
  // 其余脏腑在被选中/配对时出现（左侧图例可召出任意一组）
  const CANONICAL = ['心', '肝', '肺', '肾'];
  const visibleFor = (organ: Organ): boolean => {
    if (CANONICAL.includes(organ.name)) return true;
    if (selectedOrgan && organ.name === selectedOrgan.name) return true;
    if (paired && organ.name === paired.name) return true;
    // 当令脏腑（子午流注）始终可见并带「当令」标
    if (organ.name === clockEntry.organ) return true;
    return false;
  };

  const { camera, lights } = THREE_DEFAULTS;
  // 环境点光随"当下"着色（只染灯光，不改轨道/轴的教义色）：
  // 优先级：节气手动查看 > 子午流注当令脏腑 > 默认琥珀
  const clockOrganColor = ORGANS.find((o) => o.name === clockEntry.organ)?.color;
  const centerLightColor =
    mode !== 'normal'
      ? lights.center.color
      : ringVisible
        ? season.color
        : clockOrganColor ?? lights.center.color;

  return (
    <div className="scene-root" style={{ width: '100vw', height: '100vh', background: BACKGROUND.gradient }}>
      {/* flat + legacy + 线性输出：还原原型渲染管线（见项目备忘），否则五行色发灰 */}
      <Canvas
        flat
        legacy
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.LinearSRGBColorSpace;
        }}
        camera={{ fov: camera.fov, near: camera.near, far: camera.far, position: [0, 0.8, narrow ? 15.5 : 10] }}
        style={{ background: BACKGROUND.gradient }}
        onPointerMissed={() => setSelectedOrgan(null)}
      >
        <ambientLight color={lights.ambient.color} intensity={lights.ambient.intensity} />
        {/* decay=0：three r155+ 默认物理衰减会让点光源照不到场景 */}
        <pointLight
          color={centerLightColor}
          intensity={lights.center.intensity}
          distance={lights.center.distance}
          decay={0}
          position={[0, 0.7, 3]}
        />
        <pointLight
          color={lights.top.color}
          intensity={lights.top.intensity}
          distance={lights.top.distance}
          decay={0}
          position={[0, 5, 2]}
        />
        <pointLight
          color={lights.bottom.color}
          intensity={lights.bottom.intensity}
          distance={lights.bottom.distance}
          decay={0}
          position={[0, -4, 2]}
        />

        <Starfield />
        <MotionLerper motion={motion} targetsRef={targetsRef} />

        {/* owner 2026-08-25：人体与旧椭圆管环撤下，改用方剂页同款正圆星流舞台——
            中轴圆柱换上升星流，中土立脾胃球（点它=看脾的信息卡） */}
        <group position={[0, 0.7, 0]}>
          <AxisVortex height={4.2} radius={0.42} speedRef={motion.axleSpeed} />
        </group>
        <OrganMesh
          organ={EARTH_CENTER}
          highlight="normal"
          seasonEmphasis={emphasisFor(ORGANS.find((o) => o.name === '脾') ?? EARTH_CENTER)}
          onSelect={() => {
            const spleen = ORGANS.find((o) => o.name === '脾');
            if (spleen) setSelectedOrgan(spleen);
          }}
          visible
        />

        {/* 左升右降星流正圆 */}
        <QiLoop motion={motion} starry rx={CIRCLE_R} ry={CIRCLE_R} zBow={0} />

        {/* 脏腑：常态=四正（心肝肺肾），点选/配对时召出卫星 */}
        {ORGANS.map((organ) => (
          <OrganMesh
            key={organ.nameEn}
            organ={CLOCK_POS[organ.name] ? { ...organ, position: CLOCK_POS[organ.name] } : organ}
            highlight={highlightFor(organ)}
            seasonEmphasis={emphasisFor(organ)}
            onSelect={setSelectedOrgan}
            visible={visibleFor(organ)}
            clockBadge={organ.name === clockEntry.organ}
          />
        ))}

        {/* 方剂上轮：写入本场景的仪表目标，由 MotionLerper 统一插值 */}
        {formula && (
          <FormulaPlay formula={formula} motion={motion} targetsRef={targetsRef}
                       replayKey={replay} labelDistance={10} onPhase={setPhase} />
        )}

        {/* 二十四节气光环：经典皮肤=滑块使用中显示；节气皮肤=常显+章节段点亮 */}
        {skin === 'solar' ? (
          <SeasonRing
            activeIndex={seasonTouched ? seasonIndex : null}
            todayIndex={todayTermIndex}
            radius={5}
            highlight={highlightIndicesFor(solarEntry)}
          />
        ) : (
          ringVisible && <SeasonRing activeIndex={seasonTouched ? seasonIndex : null} radius={5} />
        )}

        {/* 相机锁定正面：只允许缩放，不允许旋转/平移 */}
        <OrbitControls
          enableRotate={false}
          enablePan={false}
          target={[0, 0.7, 0]}
          minDistance={6}
          maxDistance={16}
        />
      </Canvas>

      <Controls
        selectedOrgan={selectedOrgan}
        pairedOrgan={paired ?? null}
        onCloseCard={() => setSelectedOrgan(null)}
        onSelectElement={(key) => {
          const primary: Record<string, string> = {
            fire: '心', wood: '肝', earth: '脾', metal: '肺', water: '肾', minister: '心包'
          };
          const organ = ORGANS.find((o) => o.name === primary[key]);
          if (organ) setSelectedOrgan(organ);
        }}
        seasonIndex={seasonIndex}
        onSeasonChange={(index) => {
          setSeasonLive(false);
          handleSeasonChange(index);
        }}
        seasonLive={seasonLive}
        onSeasonToday={() => {
          setSeasonLive(true);
          handleSeasonChange(currentSolarTermIndex(new Date()));
        }}
        clockIndex={clockIndex}
        clockLive={clockManual === null}
        onClockSelect={(index) => setClockManual(index)}
        onClockLive={() => setClockManual(null)}
        onOpenMeridian={onOpenMeridian}
        onOpenClock={onOpenClock}
        skin={skin}
        onSkinChange={setSkin}
        solarStage={solarStage}
        onSolarStageChange={setSolarStage}
        todayTermIndex={todayTermIndex}
        mode={mode}
        onModeChange={setMode}
        onOpenFormula={onOpenFormula}
      />

      {/* 方剂上轮面板：右下角，避开中央时辰条与右上脏腑卡 */}
      {!tight && (
        <div
          className="panel-formula"
          style={{
            ...panelStyle, position: 'fixed', right: '16px', bottom: '16px', zIndex: 100,
            width: '206px', borderRadius: RADIUS.md, padding: '11px 12px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', color: UI.textMuted, letterSpacing: '1px', flex: 1 }}>{tr('方义圆运动')}</span>
            {formula && (
              <button style={{ ...toggleButtonStyle(false), fontSize: '10px', padding: '1px 7px' }}
                      onClick={() => setFormula(null)}>{tr('清除')}</button>
            )}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
            {FORMULAS.map((f) => (
              <button key={f.name} style={{ ...toggleButtonStyle(formula?.name === f.name), fontSize: '11px', padding: '3px 9px' }}
                      onClick={() => { setFormula(f); setReplay((v) => v + 1); }}>
                {f.name}
              </button>
            ))}
          </div>
          {formula ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '9px', fontSize: '11px' }}>
              <span style={{ color: phaseColor(phase), fontWeight: 'bold', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {formula.categoryLabel} · {phaseText(formula, phase)}
              </span>
              <button style={{ ...toggleButtonStyle(false), fontSize: '10px', padding: '2px 8px' }}
                      onClick={() => setReplay((v) => v + 1)} title={tr('重播')}>↻</button>
            </div>
          ) : (
            <div style={{ marginTop: '8px', fontSize: '10px', color: UI.textFaint, lineHeight: 1.5 }}>{tr('选一方，看它如何修圆')}</div>
          )}
        </div>
      )}
    </div>
  );
}
