import { useState } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { FORMULAS, Formula, getFormulaByName } from '@/data/formulas';
import { BACKGROUND, THREE_DEFAULTS } from '@/styles/theme';
import { VariationTree } from './VariationTree';
import { toggleButtonStyle } from '../UI/panelStyle';
import { FormulaControls } from './FormulaControls';
import { FormulaWheel } from './FormulaWheel';
import { useNarrow } from '@/hooks/useNarrow';
import { tr } from '@/i18n';

// owner 2026-08-26：3D 球环舞台撤下——本页改为纯内容页：左选方、
// 中部读方（FormulaControls 的 formula-card）。Canvas 只在查看
// 化裁树时挂载（VariationTree 仍是 3D 件）。

interface Props {
  /** 双书联动：从条文页跳转时预选中的方剂名 */
  initialFormulaName?: string | null;
  /** 相关条文跳读：跳到条文阅读页并定位该条 */
  onOpenArticle?: (id: number) => void;
}

export function Formula3D({ initialFormulaName, onOpenArticle }: Props) {
  const [formula, setFormula] = useState<Formula>(
    () => (initialFormulaName && getFormulaByName(initialFormulaName)) || FORMULAS[0] // 默认桂枝汤
  );
  const [showTree, setShowTree] = useState(false); // 桂枝汤加减化裁树（场景4）

  const pickFormula = (next: Formula) => {
    setFormula(next);
    setShowTree(false);
  };

  const { camera, lights } = THREE_DEFAULTS;
  // 方义圆运动台：宽屏常驻右侧；窄屏让位给内容卡（轴轮模型页仍可看全图）
  const compact = useNarrow(1180);
  const wheelVisible = !showTree && !compact;

  return (
    <div className="scene-root" style={{ width: '100vw', height: '100vh', background: BACKGROUND.gradient }}>
      {showTree && formula.familyRoot && (
        <Canvas
          flat
          legacy
          onCreated={({ gl }) => {
            gl.outputColorSpace = THREE.LinearSRGBColorSpace;
          }}
          camera={{ fov: camera.fov, near: camera.near, far: camera.far, position: [0, 0.6, 12.5] }}
          style={{ background: BACKGROUND.gradient }}
        >
          <ambientLight color={lights.ambient.color} intensity={lights.ambient.intensity} />
          <pointLight color={lights.center.color} intensity={lights.center.intensity} distance={lights.center.distance} decay={0} position={[0, 0, 4]} />
          <VariationTree rootName={formula.familyRoot} />
        </Canvas>
      )}

      {/* 家族化裁树切换（桂枝汤树 / 麻黄汤家族，数据驱动）。
          owner 2026-08-26：钉在右上角——最显眼且不压选方栏/内容卡 */}
      {formula.familyRoot && (
        <button
          className="tree-toggle"
          style={{
            ...toggleButtonStyle(showTree),
            position: 'fixed',
            right: '20px',
            top: '90px',
            zIndex: 120,
            fontSize: '13px',
            padding: '8px 14px'
          }}
          onClick={() => setShowTree((v) => !v)}
        >
          🌳 {formula.familyRoot}{tr('化裁树')}{showTree ? ` · ${tr('收起')}` : ''}
        </button>
      )}

      {/* 看树时只留左侧选方，中部内容卡让位给 3D 树 */}
      {wheelVisible && <FormulaWheel formula={formula} />}
      <FormulaControls formula={formula} onPickFormula={pickFormula} cardVisible={!showTree}
                       onOpenArticle={onOpenArticle} rightInset={wheelVisible ? 'calc(clamp(340px, 30vw, 460px) + 40px)' : 180} />
    </div>
  );
}
