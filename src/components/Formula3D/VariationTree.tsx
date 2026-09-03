import { useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { ThreeEvent, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { FORMULAS, Formula } from '@/data/formulas';
import { COLORS, UI } from '@/styles/theme';
import { tr } from '@/i18n';

/**
 * 方剂化裁树（DELIVERY_FORMULA_TREE_FIX：数据驱动，两棵独立树）。
 * 节点来自 FORMULAS 的 familyRoot/parentFormula 字段：
 *   桂枝汤树（纯加减方 + 葛根汤桥梁）与 麻黄汤家族 各自成树。
 * 节点色编码：母方=金，加味=绿，减味=灰白，倍/换味=紫；桥梁方带徽章。
 * 二级化裁（如 桂枝加大黄汤←桂枝加芍药汤）沿父节点方向外推一层。
 */

interface TreeNode {
  formula: Formula;
  label: string;
  color: string;
  position: [number, number, number];
  isRoot: boolean;
  parentName: string | null;
}

function nodeColor(f: Formula): string {
  if (f.derivativeType === 'base') return COLORS.earth.primary;
  if (f.derivativeType === 'remove') return COLORS.metal.secondary;
  if (f.derivativeType === 'modify') return COLORS.minister.primary;
  return COLORS.wood.primary; // add
}

/** 加减标签：-去味 ±倍换 +加味，按数据字段拼出 */
function deriveLabel(f: Formula): string {
  if (f.derivativeType === 'base') return '母方';
  const parts: string[] = [];
  if (f.removedHerbs?.length) parts.push('-' + f.removedHerbs.join('-'));
  if (f.modifiedHerbs?.length) parts.push(...f.modifiedHerbs.map((m) => `${m.name}${m.from}→${m.to}`));
  if (f.addedHerbs?.length) parts.push('+' + f.addedHerbs.join('+'));
  return parts.join(' ') || f.categoryLabel;
}

function buildNodes(rootName: string): TreeNode[] {
  const members = FORMULAS.filter((f) => f.familyRoot === rootName);
  const root = members.find((f) => f.derivativeType === 'base');
  if (!root) return [];
  // 一级子节点（直接挂母方）环形铺开；二级子节点沿父方向外推
  const firstLevel = members.filter((f) => f.parentFormula === root.name);
  const nodes: TreeNode[] = [
    { formula: root, label: '母方', color: nodeColor(root), position: [0, 0.5, 0], isRoot: true, parentName: null }
  ];
  const angleOf = new Map<string, number>();
  firstLevel.forEach((f, i) => {
    const angle = (i / firstLevel.length) * Math.PI * 2 + Math.PI / 7;
    angleOf.set(f.name, angle);
    nodes.push({
      formula: f,
      label: deriveLabel(f),
      color: nodeColor(f),
      position: [Math.cos(angle) * 2.9, 0.5 + Math.sin(angle) * 2.1, Math.sin(angle * 2) * 0.4],
      isRoot: false,
      parentName: root.name
    });
  });
  members
    .filter((f) => f !== root && f.parentFormula && f.parentFormula !== root.name)
    .forEach((f) => {
      const angle = angleOf.get(f.parentFormula!) ?? 0;
      nodes.push({
        formula: f,
        label: deriveLabel(f),
        color: nodeColor(f),
        position: [Math.cos(angle) * 4.6, 0.5 + Math.sin(angle) * 3.3, Math.sin(angle * 2) * 0.4],
        isRoot: false,
        parentName: f.parentFormula!
      });
    });
  return nodes;
}

interface Props {
  /** 家族母方名（'桂枝汤' / '麻黄汤'） */
  rootName: string;
  /** 点击"进入3D"跳到该方剂的动画场景 */
}

/** 对比两方药物：各自独有 + 共有但剂量不同（交付指令⑥：对比模式） */
function diffHerbs(a: Formula, b: Formula) {
  const mapA = new Map(a.drugs.map((d) => [d.name, d.dose]));
  const mapB = new Map(b.drugs.map((d) => [d.name, d.dose]));
  const onlyA = a.drugs.filter((d) => !mapB.has(d.name)).map((d) => `${d.name}${d.dose}`);
  const onlyB = b.drugs.filter((d) => !mapA.has(d.name)).map((d) => `${d.name}${d.dose}`);
  const doseDiff = a.drugs
    .filter((d) => mapB.has(d.name) && mapB.get(d.name) !== d.dose)
    .map((d) => `${d.name} ${d.dose}→${mapB.get(d.name)}`);
  return { onlyA, onlyB, doseDiff };
}

export function VariationTree({ rootName }: Props) {
  const nodes = useMemo(() => buildNodes(rootName), [rootName]);
  const [selected, setSelected] = useState<TreeNode | null>(null);
  const [compareBase, setCompareBase] = useState<TreeNode | null>(null);
  const groupRef = useRef<THREE.Group>(null);

  const links = useMemo(() => {
    return nodes
      .filter((n) => n.parentName)
      .map((n) => {
        const parent = nodes.find((p) => p.formula.name === n.parentName) ?? nodes[0];
        const geometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(...parent.position),
          new THREE.Vector3(...n.position)
        ]);
        return { geometry, color: n.color };
      });
  }, [nodes]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.25) * 0.18;
    }
  });

  if (nodes.length === 0) return null;

  return (
    <group>
      <group ref={groupRef}>
        {links.map((link, i) => (
          <primitive
            key={i}
            object={new THREE.Line(link.geometry, new THREE.LineBasicMaterial({ color: link.color, transparent: true, opacity: 0.45 }))}
          />
        ))}
        {nodes.map((node) => {
          const active =
            selected?.formula.name === node.formula.name ||
            compareBase?.formula.name === node.formula.name;
          const bridge = Boolean(node.formula.bridgeNote);
          return (
            <group key={node.formula.name} position={node.position}>
              <mesh
                scale={active ? 1.3 : 1}
                onClick={(e: ThreeEvent<MouseEvent>) => {
                  e.stopPropagation();
                  setSelected(node);
                }}
                onPointerOver={(e: ThreeEvent<PointerEvent>) => {
                  e.stopPropagation();
                  document.body.style.cursor = 'pointer';
                }}
                onPointerOut={() => {
                  document.body.style.cursor = 'default';
                }}
              >
                <sphereGeometry args={[node.isRoot ? 0.5 : 0.3, 24, 24]} />
                <meshPhongMaterial color={node.color} emissive={node.color} emissiveIntensity={active ? 1 : 0.5} />
              </mesh>
              {/* 桥梁方外环标识 */}
              {bridge && (
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                  <torusGeometry args={[0.44, 0.03, 8, 28]} />
                  <meshBasicMaterial color={COLORS.fire.primary} transparent opacity={0.8} />
                </mesh>
              )}
              <Html center distanceFactor={10} position={[0, node.isRoot ? 0.8 : 0.52, 0]} style={{ pointerEvents: 'none' }}>
                <div style={{ textAlign: 'center', textShadow: '0 0 6px rgba(0,0,0,0.9)', lineHeight: 1.3 }}>
                  <div style={{ color: node.color, fontSize: node.isRoot ? '14px' : '11px', whiteSpace: 'nowrap' }}>
                    {node.formula.name}
                    {bridge && <span style={{ color: COLORS.fire.primary }}> ⇄{tr('桥梁')}</span>}
                  </div>
                  {!node.isRoot && (
                    <div style={{ color: UI.textMuted, fontSize: '9px', whiteSpace: 'nowrap' }}>{tr(node.label)}</div>
                  )}
                </div>
              </Html>
            </group>
          );
        })}
      </group>
      {/* 对比模式：基准 vs 当前选中，列出药物差异（交付指令⑥） */}
      {compareBase && selected && compareBase.formula.name !== selected.formula.name && (
        <Html center position={[0, -3.1, 1]} distanceFactor={9}>
          {(() => {
            const diff = diffHerbs(compareBase.formula, selected.formula);
            return (
              <div
                style={{
                  background: UI.panelBgStrong, border: `1px solid ${UI.panelBorder}`,
                  borderRadius: '10px', padding: '10px 14px', width: '300px',
                  color: UI.textPrimary, fontSize: '12px', lineHeight: 1.8
                }}
              >
                <strong style={{ color: compareBase.color }}>{compareBase.formula.name}</strong>
                <span style={{ color: UI.textMuted }}> ⇄ </span>
                <strong style={{ color: selected.color }}>{selected.formula.name}</strong>
                {diff.onlyA.length > 0 && (
                  <div><span style={{ color: COLORS.metal.secondary }}>{tr('仅前方有：')}</span>{diff.onlyA.join('、')}</div>
                )}
                {diff.onlyB.length > 0 && (
                  <div><span style={{ color: COLORS.wood.primary }}>{tr('仅后方有：')}</span>{diff.onlyB.join('、')}</div>
                )}
                {diff.doseDiff.length > 0 && (
                  <div><span style={{ color: COLORS.minister.primary }}>{tr('剂量变化：')}</span>{diff.doseDiff.join('、')}</div>
                )}
                {diff.onlyA.length + diff.onlyB.length + diff.doseDiff.length === 0 && (
                  <div style={{ color: UI.textMuted }}>{tr('两方药物组成相同。')}</div>
                )}
                <button
                  onClick={() => setCompareBase(null)}
                  style={{
                    marginTop: '4px', background: 'transparent', border: `1px solid ${UI.panelBorder}`,
                    color: UI.textMuted, borderRadius: '10px', padding: '1px 10px', cursor: 'pointer', fontSize: '11px'
                  }}
                >
                  {tr('退出对比')}
                </button>
              </div>
            );
          })()}
        </Html>
      )}
      {/* 选中节点的说明卡（3D 内嵌，靠底部） */}
      {selected && !(compareBase && compareBase.formula.name !== selected.formula.name) && (
        <Html center position={[0, -3.1, 1]} distanceFactor={9}>
          <div
            style={{
              background: UI.panelBgStrong,
              border: `1px solid ${UI.panelBorder}`,
              borderRadius: '10px',
              padding: '10px 14px',
              width: '270px',
              color: UI.textPrimary,
              fontSize: '12px',
              lineHeight: 1.7
            }}
          >
            <strong style={{ color: selected.color }}>{selected.formula.name}</strong>
            {!selected.isRoot && <span style={{ color: UI.textMuted }}>（{tr(selected.label)}）</span>}
            <div>{selected.formula.keyConcept ?? selected.formula.categoryLabel}</div>
            {selected.formula.bridgeNote && (
              <div style={{ color: COLORS.fire.primary, fontSize: '11px', marginTop: '4px' }}>
                {selected.formula.bridgeNote}
              </div>
            )}
            {/* owner 2026-08-26：「进入 3D 动画」钮撤下（3D 方剂动画已下线且钮已失灵） */}
            <button
              onClick={() => setCompareBase(selected)}
              style={{
                marginTop: '6px', marginLeft: '6px', background: 'transparent',
                border: `1px solid ${UI.panelBorder}`, color: UI.textSecondary,
                borderRadius: '10px', padding: '2px 10px', cursor: 'pointer', fontSize: '12px'
              }}
            >
              ⇄ {tr('设为对比基准（再点另一节点）')}
            </button>
          </div>
        </Html>
      )}
    </group>
  );
}
