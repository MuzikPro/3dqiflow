import { useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useThree } from '@react-three/fiber';
import { Formula } from '@/data/formulas';
import { ORGANS } from '@/data/organs';
import { BACKGROUND, THREE_DEFAULTS, UI, RADIUS } from '@/styles/theme';
import { panelStyle, toggleButtonStyle } from '../UI/panelStyle';
import { OrganMesh } from '../AxisWheel/OrganMesh';
import { AxisVortex } from '../AxisWheel/AxisVortex';
import { QiLoop } from '../AxisWheel/QiLoop';
import { CIRCLE_R, CLOCK_POS, EARTH_CENTER } from '../AxisWheel/clockLayout';
import { createQiMotion } from '../AxisWheel/qiMotion';
import { FormulaPlay, Phase, phaseColor, phaseText } from './FormulaPlay';
import { tr } from '@/i18n';

/**
 * 方义圆运动侧台（owner 2026-09-05）：轴轮模型以合适的形与尺寸并入方剂详解。
 * 台面取正方（内容本近方），宽随视口 clamp；相机按画布纵横比自动取距，
 * 保证四正签、外弧药签一个都不出框（owner 实录：旧版 330px 台面右弧药签被切）。
 */

/** 内容包络（世界坐标）：外弧药标 + 签 / 心签顶 / 肾签底 */
const HALF_W = CIRCLE_R + 0.62 + 0.8;
const TOP = 0.7 + CIRCLE_R + 0.4 + 0.6;
const BOTTOM = 0.7 - CIRCLE_R - 0.4 - 0.6;

function FitCamera() {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  useEffect(() => {
    const aspect = size.width / Math.max(1, size.height);
    const tanHalf = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const cy = (TOP + BOTTOM) / 2;
    const halfH = (TOP - BOTTOM) / 2;
    const d = Math.max(halfH / tanHalf, HALF_W / (tanHalf * aspect)) * 1.04;
    camera.position.set(0, cy, d);
    camera.lookAt(0, cy, 0);
    camera.updateProjectionMatrix();
  }, [camera, size]);
  return null;
}

export function FormulaWheel({ formula }: { formula: Formula }) {
  const [replay, setReplay] = useState(0);
  const [phase, setPhase] = useState<Phase>('disturbed');
  const motion = useMemo(createQiMotion, []);
  const { camera, lights } = THREE_DEFAULTS;

  return (
    <div
      className="formula-wheel"
      style={{
        ...panelStyle,
        position: 'fixed', right: '20px', top: '134px', zIndex: 95,
        width: 'clamp(340px, 30vw, 460px)', maxHeight: 'calc(100vh - 160px)',
        borderRadius: RADIUS.md, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column'
      }}
    >
      <div style={{ width: '100%', aspectRatio: '1 / 1', maxHeight: 'calc(100vh - 236px)', minHeight: 0 }}>
        <Canvas
          flat
          legacy
          onCreated={({ gl }) => { gl.outputColorSpace = THREE.LinearSRGBColorSpace; }}
          camera={{ fov: camera.fov, near: camera.near, far: camera.far, position: [0, 0.7, 8] }}
          style={{ background: BACKGROUND.gradient }}
        >
          <FitCamera />
          <ambientLight color={lights.ambient.color} intensity={lights.ambient.intensity} />
          <pointLight color={lights.center.color} intensity={lights.center.intensity} distance={lights.center.distance} decay={0} position={[0, 0.7, 3]} />
          <pointLight color={lights.top.color} intensity={lights.top.intensity} distance={lights.top.distance} decay={0} position={[0, 5, 2]} />
          <pointLight color={lights.bottom.color} intensity={lights.bottom.intensity} distance={lights.bottom.distance} decay={0} position={[0, -4, 2]} />

          <group position={[0, 0.7, 0]}>
            <AxisVortex height={3.6} radius={0.36} speedRef={motion.axleSpeed} />
          </group>
          <OrganMesh organ={EARTH_CENTER} highlight="normal" seasonEmphasis={null} onSelect={() => {}} visible compactLabel />
          <QiLoop motion={motion} starry rx={CIRCLE_R} ry={CIRCLE_R} zBow={0} />
          {ORGANS.filter((o) => ['心', '肝', '肺', '肾'].includes(o.name)).map((organ) => (
            <OrganMesh
              key={organ.nameEn}
              organ={{ ...organ, position: CLOCK_POS[organ.name] }}
              highlight="normal" seasonEmphasis={null} onSelect={() => {}} visible compactLabel
              labelBelow={organ.name === '肾'}
            />
          ))}
          <FormulaPlay formula={formula} motion={motion} replayKey={replay} labelDistance={8} onPhase={setPhase} />
        </Canvas>
      </div>

      {/* 相位字幕 + 重播 */}
      <div style={{ padding: '7px 12px 8px', borderTop: `1px solid ${UI.panelBorder}`, fontSize: '11px' }}>
        <div style={{ color: UI.textMuted, fontSize: '10px', letterSpacing: '1px', marginBottom: '3px' }}>
          {tr('方义圆运动')} · {formula.categoryLabel}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ color: phaseColor(phase), fontWeight: 'bold', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {phaseText(formula, phase)}
          </span>
          <button style={{ ...toggleButtonStyle(false), fontSize: '10px', padding: '2px 8px' }}
                  onClick={() => setReplay((v) => v + 1)} title={tr('重播')}>
            ↻ {tr('重播')}
          </button>
        </div>
      </div>
    </div>
  );
}
