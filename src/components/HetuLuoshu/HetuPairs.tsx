import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { ThreeEvent, useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { HETU_PAIRS, HetuPair } from '@/data/hetuLuoshu';
import { ELEMENT_COLORS, ElementKey } from '@/data/organs';
import { UI } from '@/styles/theme';

/** 五行 → 多面体（规格书：土居中最复杂） */
function ElementGeometry({ element, size }: { element: ElementKey; size: number }) {
  switch (element) {
    case 'water':
      return <boxGeometry args={[size, size, size]} />;
    case 'fire':
      return <octahedronGeometry args={[size * 0.72]} />;
    case 'wood':
      return <tetrahedronGeometry args={[size * 0.82]} />;
    case 'metal':
      return <dodecahedronGeometry args={[size * 0.6]} />;
    default:
      return <icosahedronGeometry args={[size * 0.62]} />;
  }
}

/** 天地之间的双向能量粒子流（天→地亮；地→天暗）。from/to 任意两点，
 *  中轴剖面（横向）与常态（前后向）共用。 */
function EnergyFlow({ from, to, color, active }: {
  from: [number, number, number]; to: [number, number, number];
  color: string; active: boolean;
}) {
  const brightRef = useRef<THREE.Points>(null);
  const dimRef = useRef<THREE.Points>(null);
  const phase = useRef(0);
  const N = 8;
  const bright = useMemo(() => new Float32Array(N * 3), []);
  const dim = useMemo(() => new Float32Array(N * 3), []);
  // 两股流错开一点：沿与走向垂直的方向各偏 0.09
  const perp = useMemo(() => {
    const d = new THREE.Vector3(to[0] - from[0], to[1] - from[1], to[2] - from[2]).normalize();
    const p = Math.abs(d.z) > 0.7 ? new THREE.Vector3(1, 0, 0) : new THREE.Vector3(0, 0, 1);
    return p.cross(d).normalize().multiplyScalar(0.09);
  }, [from, to]);

  useFrame((_, delta) => {
    phase.current += Math.min(delta, 0.1) * (active ? 0.9 : 0.35);
    const put = (array: Float32Array, i: number, t: number, sign: number) => {
      array[i * 3] = from[0] + (to[0] - from[0]) * t + perp.x * sign;
      array[i * 3 + 1] = from[1] + (to[1] - from[1]) * t + perp.y * sign;
      array[i * 3 + 2] = from[2] + (to[2] - from[2]) * t + perp.z * sign;
    };
    if (brightRef.current) {
      const array = brightRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < N; i++) put(array, i, (phase.current + i / N) % 1, 1);
      brightRef.current.geometry.attributes.position.needsUpdate = true;
    }
    if (dimRef.current) {
      const array = dimRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < N; i++) put(array, i, 1 - ((phase.current + i / N) % 1), -1);
      dimRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      <points ref={brightRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[bright, 3]} />
        </bufferGeometry>
        <pointsMaterial color={color} size={0.09} transparent opacity={active ? 1 : 0.6} blending={THREE.AdditiveBlending} sizeAttenuation depthWrite={false} />
      </points>
      <points ref={dimRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dim, 3]} />
        </bufferGeometry>
        <pointsMaterial color={color} size={0.06} transparent opacity={active ? 0.5 : 0.25} sizeAttenuation depthWrite={false} />
      </points>
    </group>
  );
}

interface Props {
  /** 阴阳比滑块：天地两层的间距（半距） */
  layerZ: number;
  selected: HetuPair | null;
  onSelect: (pair: HetuPair) => void;
  /** 合一视图时整体后移 */
  zShift?: number;
  /** 合一视图：天地两数合显一体，每元素只出现一枚，虚线恰从此发出 */
  merged?: boolean;
  /** 中轴剖面：五组叠成一根轴——天列在左（升），地列在右（降） */
  axis?: boolean;
}

const NUM = '一二三四五六七八九十';

/** 中轴剖面（脚本E交互：「天在左·升，地在右·降」）：五组按圆运动
 *  剖面自下而上叠放——水底、木下、土中、金上、火顶 */
const AXIS_Y: Record<string, number> = {
  water: -2.3, wood: -1.1, earth: 0.15, metal: 1.4, fire: 2.6
};
const AXIS_X = 1.15;

/** 某组配对当前的天/地几何位（本组件与人体联动线共用，勿各算各的） */
export function pairDisplayPos(
  pair: HetuPair,
  opts: { axis?: boolean; merged?: boolean; layerZ: number; zShift?: number }
): { heaven: [number, number, number]; earth: [number, number, number] } {
  const z0 = opts.zShift ?? 0;
  if (opts.merged) {
    const [x, y] = pair.position;
    return { heaven: [x, y + 0.3, z0], earth: [x, y + 0.3, z0] };
  }
  if (opts.axis) {
    const y = AXIS_Y[pair.element] + 0.3;
    return { heaven: [-AXIS_X, y, z0], earth: [AXIS_X, y, z0] };
  }
  const [x, y] = pair.position;
  return { heaven: [x, y + 0.3, z0 - opts.layerZ], earth: [x, y + 0.3, z0 + opts.layerZ] };
}

/** 河图五组配对：天（阳·奇·后层·实心发光）＋地（阴·偶·前层·线框半透明）＋能量连线 */
export function HetuPairs({ layerZ, selected, onSelect, zShift = 0, merged = false, axis = false }: Props) {
  return (
    <group position={[0, 0.3, zShift]}>
      {HETU_PAIRS.map((pair) => {
        const color = ELEMENT_COLORS[pair.element].hex;
        const active = selected?.element === pair.element;
        const dimmed = selected !== null && !active;
        // 组内坐标：pairDisplayPos 给的是世界位（含 group 的 y+0.3 与 zShift），减回去
        const dp = pairDisplayPos(pair, { axis, merged, layerZ, zShift });
        const hv: [number, number, number] = [dp.heaven[0], dp.heaven[1] - 0.3, dp.heaven[2] - zShift];
        const ea: [number, number, number] = [dp.earth[0], dp.earth[1] - 0.3, dp.earth[2] - zShift];
        const mid: [number, number, number] = [(hv[0] + ea[0]) / 2, (hv[1] + ea[1]) / 2, (hv[2] + ea[2]) / 2];
        const [x, y] = pair.position;
        const pick = (e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          onSelect(pair);
        };
        if (merged) {
          return (
            <group key={pair.element}>
              <mesh position={[x, y, 0]} onClick={pick} scale={active ? 1.25 : 1}>
                <ElementGeometry element={pair.element} size={0.62} />
                <meshStandardMaterial
                  color={color}
                  emissive={color}
                  emissiveIntensity={active ? 1.1 : 0.6}
                  transparent
                  opacity={dimmed ? 0.25 : 1}
                />
              </mesh>
              <Html center distanceFactor={10} position={[x, y + 0.78, 0]} style={{ pointerEvents: 'none' }}>
                <div style={{ color, fontSize: '12px', whiteSpace: 'nowrap', textShadow: '0 0 6px rgba(0,0,0,0.9)' }}>
                  天{NUM[pair.heavenNumber - 1]}·地{NUM[pair.earthNumber - 1]}·{pair.label}
                </div>
              </Html>
            </group>
          );
        }
        return (
          <group key={pair.element}>
            {/* 天·后层（中轴剖面时=左列·升）：实心发光 */}
            <mesh position={hv} onClick={pick} scale={active ? 1.25 : 1}>
              <ElementGeometry element={pair.element} size={0.62} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={active ? 1.1 : 0.6}
                transparent
                opacity={dimmed ? 0.25 : 1}
              />
            </mesh>
            {/* 地·前层（中轴剖面时=右列·降）：线框半透明 */}
            <mesh position={ea} onClick={pick} scale={active ? 1.25 : 1}>
              <ElementGeometry element={pair.element} size={0.62} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.4}
                wireframe
                transparent
                opacity={dimmed ? 0.12 : 0.55}
              />
            </mesh>
            {/* 能量连线 */}
            <mesh position={mid} rotation={axis ? [0, 0, Math.PI / 2] : [Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.015, 0.015, axis ? AXIS_X * 2 : layerZ * 2, 6]} />
              <meshBasicMaterial color={color} transparent opacity={dimmed ? 0.1 : 0.4} depthWrite={false} />
            </mesh>
            <EnergyFlow from={hv} to={ea} color={color} active={active} />
            <Html center distanceFactor={10} position={[hv[0], hv[1] + 0.75, hv[2]]} style={{ pointerEvents: 'none' }}>
              <div style={{ color, fontSize: '12px', whiteSpace: 'nowrap', textShadow: '0 0 6px rgba(0,0,0,0.9)' }}>
                天{NUM[pair.heavenNumber - 1]}·{pair.label}{axis ? ' ↑升' : ''}
              </div>
            </Html>
            <Html center distanceFactor={10} position={[ea[0], ea[1] - 0.75, ea[2]]} style={{ pointerEvents: 'none' }}>
              <div style={{ color: UI.textSecondary, fontSize: '11px', whiteSpace: 'nowrap', textShadow: '0 0 6px rgba(0,0,0,0.9)' }}>
                地{NUM[pair.earthNumber - 1]}{axis ? ' ↓降' : ''}
              </div>
            </Html>
          </group>
        );
      })}
    </group>
  );
}
