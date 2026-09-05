import { Suspense, useMemo, useState } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { HETU_PAIRS, LUOSHU_PALACES, HetuPair, LuoshuPalace } from '@/data/hetuLuoshu';
import { ELEMENT_COLORS } from '@/data/organs';
import { SOLAR_TERMS } from '@/data/solarTerms';
import { BACKGROUND, THREE_DEFAULTS } from '@/styles/theme';
import { useNarrow } from '@/hooks/useNarrow';
import { BodyFigure } from '../MeridianTheater/BodyFigure';
import { BodyMesh } from '../MeridianTheater/BodyMesh';
import { Starfield } from '../AxisWheel/Starfield';
import { termPhase } from '../SolarTheater/sunPath';
import { HetuPairs, pairDisplayPos } from './HetuPairs';
import { LuoshuGrid } from './LuoshuGrid';
import { HetuLuoshuControls, HetuLuoshuMode } from './HetuLuoshuControls';

/**
 * 合一视图：河图合体（后）→ 同五行洛书宫格（前）的虚线。
 * 端点必须与两侧几何中心重合（河图 group y+0.3 z=-1.9，洛书 group y+0.3 z=0.9），
 * 否则侧视时虚线悬在半空、不接任何形体。
 */
/** 人体联动的锚点（圆运动示意位，非解剖位——肝左肺右心上肾下脾中，
 *  与轴轮/河图同一套教学布局；身体组在 [0,0.2,-2.6]，锚点取体前表面） */
const BODY_ANCHOR: Record<string, [number, number, number]> = {
  fire: [0, 2.0, -2.25],
  metal: [0.55, 1.15, -2.3],
  earth: [0, 0.45, -2.25],
  wood: [-0.55, 0.45, -2.3],
  water: [0, -0.75, -2.25]
};

/** 人体联动：每组配对 → 人体对应区（脚本E：天一/地六=肾/膀胱在底…） */
function BodyLinks({ mode, layerZ, selected }: {
  mode: HetuLuoshuMode; layerZ: number;
  selected: HetuPair | null;
}) {
  const lines = useMemo(() => {
    return HETU_PAIRS.map((pair) => {
      const dp = pairDisplayPos(pair, {
        merged: mode === 'unity', layerZ,
        zShift: mode === 'unity' ? -1.9 : 0
      });
      const anchor = BODY_ANCHOR[pair.element];
      const geometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(...dp.heaven),
        new THREE.Vector3(...anchor)
      ]);
      const material = new THREE.LineDashedMaterial({
        color: ELEMENT_COLORS[pair.element].three,
        dashSize: 0.14, gapSize: 0.1, transparent: true, opacity: 0.5
      });
      const line = new THREE.Line(geometry, material);
      line.computeLineDistances();
      return { pair, anchor, line };
    });
  }, [mode, layerZ]);
  return (
    <group>
      {lines.map(({ pair, anchor, line }) => {
        const dimmed = selected !== null && selected.element !== pair.element;
        return (
          <group key={pair.element}>
            <primitive object={line} visible={!dimmed} />
            <mesh position={anchor}>
              <sphereGeometry args={[0.09, 12, 12]} />
              <meshBasicMaterial color={ELEMENT_COLORS[pair.element].three}
                                 transparent opacity={dimmed ? 0.25 : 0.95} depthWrite={false} />
            </mesh>
            {!dimmed && (
              <HtmlLabel position={[anchor[0] + (anchor[0] >= 0 ? 0.3 : -0.3), anchor[1], anchor[2]]}
                         color={ELEMENT_COLORS[pair.element].hex} text={pair.organs} />
            )}
          </group>
        );
      })}
    </group>
  );
}

function HtmlLabel({ position, color, text }: {
  position: [number, number, number]; color: string; text: string;
}) {
  return (
    <Html center distanceFactor={10} position={position} style={{ pointerEvents: 'none' }}>
      <div style={{ color, fontSize: '10px', whiteSpace: 'nowrap', textShadow: '0 0 6px rgba(0,0,0,0.95)' }}>
        {text}
      </div>
    </Html>
  );
}

function UnityLinks() {
  const lines = useMemo(() => {
    const out: THREE.Line[] = [];
    for (const pair of HETU_PAIRS) {
      const palaces = LUOSHU_PALACES.filter((p) => p.element === pair.element);
      for (const palace of palaces) {
        const geometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(pair.position[0], pair.position[1] + 0.3, -1.9),
          new THREE.Vector3(palace.position[0], palace.position[1] + 0.3, 0.9)
        ]);
        const material = new THREE.LineDashedMaterial({
          color: ELEMENT_COLORS[pair.element].three,
          dashSize: 0.16,
          gapSize: 0.12,
          transparent: true,
          opacity: 0.45
        });
        const line = new THREE.Line(geometry, material);
        line.computeLineDistances();
        out.push(line);
      }
    }
    return out;
  }, []);
  return (
    <group>
      {lines.map((line, i) => (
        <primitive key={i} object={line} />
      ))}
    </group>
  );
}

/**
 * 河图洛书 3D 模块（脚本E；owner 2026-09-05 撤下「中轴剖面」——五组叠轴的
 * 变体与轴轮模型重复，河图页只留固定方位的本相）：
 * 河图=生成数理（体），洛书=九宫方位（用）。全部位置固定 —— 圆圈运动，
 * 流动的只有能量粒子与亮度波浪，绝无"平面圆盘旋转"。
 */
export function HetuLuoshu() {
  // 窄屏拉远相机：竖屏横向视野不足，否则圆环/人体被切边
  const narrow = useNarrow();
  const [mode, setMode] = useState<HetuLuoshuMode>('hetu');
  const [layerZ, setLayerZ] = useState(1.2);      // 阴阳比：天地层间距（半距）
  const [termIndex, setTermIndex] = useState(() => SOLAR_TERMS.findIndex((t) => t.name === '冬至'));
  const [humanSync, setHumanSync] = useState(false);
  const [selectedPair, setSelectedPair] = useState<HetuPair | null>(null);
  const [selectedPalace, setSelectedPalace] = useState<LuoshuPalace | null>(null);

  const seasonPhase = termPhase(termIndex);
  const { camera, lights } = THREE_DEFAULTS;

  return (
    <div className="scene-root" style={{ width: '100vw', height: '100vh', background: BACKGROUND.gradient }}>
      {/* 渲染管线设置与其他暗夜场景一致（见项目备忘） */}
      <Canvas
        flat
        legacy
        onCreated={({ gl }) => {
          gl.outputColorSpace = THREE.LinearSRGBColorSpace;
        }}
        camera={{ fov: camera.fov, near: camera.near, far: camera.far, position: [1.5, 1.2, narrow ? 14 : 9.5] }}
        style={{ background: BACKGROUND.gradient }}
        onPointerMissed={() => {
          setSelectedPair(null);
          setSelectedPalace(null);
        }}
      >
        <ambientLight color={lights.ambient.color} intensity={0.8} />
        <pointLight color={lights.center.color} intensity={1.1} distance={30} decay={0} position={[2, 3, 6]} />

        <Starfield />

        {humanSync && mode !== 'luoshu' && (
          <group position={[0, 0.2, -2.6]}>
            <Suspense fallback={<BodyFigure opacity={0.25} />}>
              <BodyMesh opacity={0.2} />
            </Suspense>
          </group>
        )}
        {humanSync && mode !== 'luoshu' && (
          <BodyLinks mode={mode} layerZ={mode === 'unity' ? 0.7 : layerZ} selected={selectedPair} />
        )}

        {(mode === 'hetu' || mode === 'unity') && (
          <HetuPairs
            layerZ={mode === 'unity' ? 0.7 : layerZ}
            zShift={mode === 'unity' ? -1.9 : 0}
            merged={mode === 'unity'}
            selected={selectedPair}
            onSelect={(pair) => {
              setSelectedPair(pair);
              setSelectedPalace(null);
            }}
          />
        )}

        {(mode === 'luoshu' || mode === 'unity') && (
          <LuoshuGrid
            seasonPhase={seasonPhase}
            zShift={mode === 'unity' ? 0.9 : 0}
            selected={selectedPalace}
            onSelect={(palace) => {
              setSelectedPalace(palace);
              setSelectedPair(null);
            }}
          />
        )}

        {mode === 'unity' && <UnityLinks />}

        <OrbitControls
          enableDamping
          dampingFactor={THREE_DEFAULTS.orbitControls.dampingFactor}
          enablePan={false}
          target={[0, 0.3, 0]}
          minDistance={5}
          maxDistance={18}
        />
      </Canvas>

      <HetuLuoshuControls
        mode={mode}
        onModeChange={(next) => {
          setMode(next);
          setSelectedPair(null);
          setSelectedPalace(null);
        }}
        layerZ={layerZ}
        onLayerZChange={setLayerZ}
        termIndex={termIndex}
        onTermChange={setTermIndex}
        humanSync={humanSync}
        onHumanSyncToggle={() => setHumanSync((v) => !v)}
        selectedPair={selectedPair}
        selectedPalace={selectedPalace}
        onCloseCard={() => {
          setSelectedPair(null);
          setSelectedPalace(null);
        }}
      />
    </div>
  );
}
