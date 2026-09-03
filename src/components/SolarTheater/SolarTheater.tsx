import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { SOLAR_TERMS } from '@/data/solarTerms';
import { BACKGROUND, COLORS, THREE_DEFAULTS, UI } from '@/styles/theme';
import { BodyFigure } from '../MeridianTheater/BodyFigure';
import { Axle } from '../AxisWheel/Axle';
import { QiLoop } from '../AxisWheel/QiLoop';
import { Starfield } from '../AxisWheel/Starfield';
import { createQiMotion } from '../AxisWheel/qiMotion';
import { SunSystem } from './SunSystem';
import { SolarControls } from './SolarControls';
import { termPhase, phasePosition, RING_RADIUS, RING_CENTER_Y } from './sunPath';

/** 节气刻度光点（垂直圆圈上，位置固定） */
function TermMarkers({
  activeIndex,
  onPick
}: {
  activeIndex: number;
  onPick: (index: number) => void;
}) {
  const positions = useMemo(
    () => SOLAR_TERMS.map((_, k) => phasePosition(termPhase(k)).toArray() as [number, number, number]),
    []
  );
  return (
    <group>
      {SOLAR_TERMS.map((term, k) => {
        const active = k === activeIndex;
        return (
          <group key={term.name} position={positions[k]}>
            <mesh
              scale={active ? 1.9 : 1}
              onClick={(e: ThreeEvent<MouseEvent>) => {
                e.stopPropagation();
                onPick(k);
              }}
              onPointerOver={(e: ThreeEvent<PointerEvent>) => {
                e.stopPropagation();
                document.body.style.cursor = 'pointer';
              }}
              onPointerOut={() => {
                document.body.style.cursor = 'default';
              }}
            >
              <sphereGeometry args={[0.09, 10, 10]} />
              <meshBasicMaterial color={term.color} transparent opacity={active ? 1 : 0.65} />
            </mesh>
            <Html center distanceFactor={11} position={[0, 0.26, 0]} style={{ pointerEvents: 'none' }}>
              <div
                style={{
                  color: active ? UI.accent : UI.textMuted,
                  fontSize: active ? '13px' : '10px',
                  whiteSpace: 'nowrap',
                  textShadow: '0 0 6px rgba(0,0,0,0.9)'
                }}
              >
                {term.name}
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}

/**
 * 二十四节气垂直圆圈剧场（脚本B / T007）：
 * 太阳热沿"垂直"圆圈左升右降 —— 冬至沉于底，夏至浮于顶；
 * 右侧小人体同步联动，展示"节气即人体圆运动的年度放大版"。
 */
export function SolarTheater() {
  const phaseRef = useRef(0); // 从冬至出发
  const [playing, setPlaying] = useState(true);
  const [slowmo, setSlowmo] = useState(false);
  const [compare, setCompare] = useState(false);
  const [humanSync, setHumanSync] = useState(true);
  const [termIndex, setTermIndex] = useState(() => SOLAR_TERMS.findIndex((t) => t.name === '冬至'));
  const [detailIndex, setDetailIndex] = useState<number | null>(null);

  const humanMotion = useMemo(createQiMotion, []);

  const jumpToTerm = (k: number) => {
    phaseRef.current = termPhase(k);
    setTermIndex(k);
  };
  const pickMarker = (k: number) => {
    jumpToTerm(k);
    setDetailIndex(k);
  };

  const { camera, lights } = THREE_DEFAULTS;

  return (
    <div style={{ width: '100vw', height: '100vh', background: BACKGROUND.gradient }}>
      {/* 渲染管线设置与其他暗夜场景一致（见项目备忘） */}
      <Canvas
        flat
        legacy
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.LinearSRGBColorSpace;
        }}
        camera={{ fov: camera.fov, near: camera.near, far: camera.far, position: [0.8, 0.5, 12.5] }}
        style={{ background: BACKGROUND.gradient }}
        onPointerMissed={() => setDetailIndex(null)}
      >
        <ambientLight color={lights.ambient.color} intensity={lights.ambient.intensity} />
        <pointLight color={lights.center.color} intensity={0.6} distance={30} decay={0} position={[0, 2, 8]} />

        <Starfield />

        {/* 垂直圆圈轨道（正面朝观察者，不是水平黄道！） */}
        <mesh position={[0, RING_CENTER_Y, 0]}>
          <torusGeometry args={[RING_RADIUS, 0.02, 12, 96]} />
          <meshBasicMaterial color={COLORS.earth.primary} transparent opacity={0.3} />
        </mesh>

        <TermMarkers activeIndex={termIndex} onPick={pickMarker} />

        <SunSystem
          phaseRef={phaseRef}
          playing={playing}
          slowmo={slowmo}
          compare={compare}
          onTermChange={setTermIndex}
          humanMotion={humanMotion}
        />

        {/* 人体联动：右侧小人体（轴 + 左升右降轨道）随节气同步 */}
        {humanSync && (
          <group position={[6.3, -0.6, 0]} scale={0.52}>
            <BodyFigure />
            <Axle motion={humanMotion} />
            <QiLoop motion={humanMotion} />
          </group>
        )}

        <OrbitControls
          enableDamping
          dampingFactor={THREE_DEFAULTS.orbitControls.dampingFactor}
          enablePan={false}
          target={[0.8, 0.4, 0]}
          minDistance={7}
          maxDistance={20}
        />
      </Canvas>

      <SolarControls
        termIndex={termIndex}
        detailIndex={detailIndex}
        onCloseDetail={() => setDetailIndex(null)}
        onJump={jumpToTerm}
        playing={playing}
        onPlayToggle={() => setPlaying((v) => !v)}
        slowmo={slowmo}
        onSlowmoToggle={() => setSlowmo((v) => !v)}
        compare={compare}
        onCompareToggle={() => setCompare((v) => !v)}
        humanSync={humanSync}
        onHumanSyncToggle={() => setHumanSync((v) => !v)}
      />
    </div>
  );
}
