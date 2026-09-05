import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { COLORS, SCENE_TEXT, UI } from '@/styles/theme';
import { tr, getLang } from '@/i18n';
import { MERIDIAN_FLOW } from '@/data/meridians';

/**
 * 循行口诀图（owner 2026-09-03：借姊妹项目的「站立人形」骨架）——
 * 中列 头/胸/腹 立在一条脊线上（圆环退场，升降教义移到两胁直书「阴升阳降」），
 * 手三阳 自手过顶走头如举臂外缘，手三阴 沿臂内线胸走手，
 * 足三阳 沿躯干外廓头走足，足三阴 内腿合入腹——整图读作举手站立之人。
 * 四句口诀各安其路，随所述之束同色同显。配色仍随本应用教义：
 * 阴经=升=木绿，阳经=降=金色；肝生于左（画面左即人身左）。
 * 气行无先后：四束同速常显，当令束只提亮不提速，与右栏显隐同步。
 */

const GREEN = COLORS.wood.primary;
const GOLD = COLORS.metal.primary;

type BundleKey = 'shouYin' | 'shouYang' | 'zuYang' | 'zuYin';
const BUNDLE_OF: Record<number, BundleKey> = {
  0: 'shouYin', 4: 'shouYin', 8: 'shouYin',
  1: 'shouYang', 5: 'shouYang', 9: 'shouYang',
  2: 'zuYang', 6: 'zuYang', 10: 'zuYang',
  3: 'zuYin', 7: 'zuYin', 11: 'zuYin'
};
const BUNDLE_IDS: Record<BundleKey, number[]> = {
  shouYin: [0, 4, 8], shouYang: [1, 5, 9], zuYang: [2, 6, 10], zuYin: [3, 7, 11]
};
const MNEMONIC: Record<BundleKey, string> = {
  shouYin: '「手之三阴，从胸走手」',
  shouYang: '「手之三阳，从手走头」',
  zuYang: '「足之三阳，从头走足」',
  zuYin: '「足之三阴，从足走腹」'
};

type Vec3 = [number, number, number];
const curveOf = (pts: Vec3[]) =>
  new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p)), false, 'catmullrom', 0.35);

/** 一条口诀路径：管 + 方向锥 + 流动光点；active 时加粗提亮 */
function MnemonicPath({ pts, color, active, speed, vis = 1, onClick }: {
  pts: Vec3[]; color: string; active: boolean; speed: number;
  /** 右栏显隐折算的可见度：束内可见经数/3（0=整束被藏，压成余影） */
  vis?: number; onClick?: () => void;
}) {
  const curve = useMemo(() => curveOf(pts), [pts]);
  const N = 7;
  const buf = useMemo(() => new Float32Array(N * 3), []);
  const ref = useRef<THREE.Points>(null);
  const phase = useRef(Math.random());
  const scratch = useMemo(() => new THREE.Vector3(), []);
  const cone = useMemo(() => {
    const p = curve.getPointAt(0.55);
    const t = curve.getTangentAt(0.55);
    const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), t);
    return { p, q };
  }, [curve]);

  useFrame((_, delta) => {
    // 气行无先后：四束同速同行，当令只提亮不提速
    phase.current = (phase.current + Math.min(delta, 0.1) * 0.2 * speed) % 1;
    if (!ref.current) return;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < N; i++) {
      curve.getPointAt((phase.current + i / N) % 1, scratch);
      arr[i * 3] = scratch.x; arr[i * 3 + 1] = scratch.y; arr[i * 3 + 2] = scratch.z + 0.02;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group>
      <mesh onClick={onClick ? (e) => { e.stopPropagation(); onClick(); } : undefined}>
        <tubeGeometry args={[curve, 48, active ? 0.045 : 0.034, 8, false]} />
        <meshBasicMaterial color={color} transparent
                           opacity={vis === 0 ? 0.08 : (active ? 0.95 : 0.35 + 0.25 * vis)}
                           depthWrite={false} />
      </mesh>
      <mesh position={cone.p} quaternion={cone.q} visible={vis > 0}>
        <coneGeometry args={[active ? 0.13 : 0.1, active ? 0.3 : 0.24, 10]} />
        <meshBasicMaterial color={color} transparent opacity={active ? 1 : 0.55 * vis + 0.25} depthWrite={false} />
      </mesh>
      <points ref={ref} visible={vis > 0}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[buf, 3]} />
        </bufferGeometry>
        <pointsMaterial color={color} size={active ? 0.11 : 0.09} transparent opacity={active ? 1 : 0.85}
                        blending={THREE.AdditiveBlending} sizeAttenuation depthWrite={false} />
      </points>
    </group>
  );
}

function NodeBox({ pos, text, round = false }: { pos: Vec3; text: string; round?: boolean }) {
  return (
    <Html center distanceFactor={10} position={pos} style={{ pointerEvents: 'none' }}>
      <div style={{
        color: SCENE_TEXT.accent, fontSize: '15px', fontWeight: 'bold', letterSpacing: '2px',
        border: `1px solid ${UI.panelBorder}`, borderRadius: round ? '50%' : '8px',
        padding: round ? '10px 11px' : '4px 12px', background: 'rgba(15,15,30,0.75)',
        whiteSpace: 'nowrap'
      }}>{text}</div>
    </Html>
  );
}

function Tag({ pos, text, color, size = 11, pill = false }: {
  pos: Vec3; text: string; color: string; size?: number;
  /** 深色底签：签落在线附近时保持可读 */
  pill?: boolean;
}) {
  return (
    <Html center distanceFactor={10} position={pos} style={{ pointerEvents: 'none' }}>
      <div style={{ color, fontSize: `${size}px`, whiteSpace: 'nowrap',
                    textShadow: '0 0 6px rgba(0,0,0,0.95)',
                    ...(pill ? { background: 'rgba(15,15,30,0.8)', borderRadius: '10px',
                                 padding: '2px 8px', border: `1px solid ${UI.panelBorder}` } : {}) }}>{text}</div>
    </Html>
  );
}

/** 两胁「阴升阳降」：中文正立直书；英文竖排会碎成竖字母，改横排小字 */
function FlankText({ x }: { x: number }) {
  const en = getLang() !== 'zh';
  return (
    <Html center distanceFactor={10} position={[x, -0.1, 0]} style={{ pointerEvents: 'none' }}>
      <div style={{
        ...(en
          ? { maxWidth: '64px', textAlign: 'center' as const, lineHeight: 1.5 }
          : { writingMode: 'vertical-rl' as const, textOrientation: 'upright' as const, letterSpacing: '10px' }),
        color: SCENE_TEXT.muted, fontSize: en ? '11px' : '15px',
        textShadow: '0 0 6px rgba(0,0,0,0.95)'
      }}>{en ? 'Yin rises · Yang descends' : '阴升阳降'}</div>
    </Html>
  );
}

export function MnemonicDiagram({ activeId, speed, visibleIds, onPickMeridian }: {
  activeId: number; speed: number;
  /** 右栏逐经显隐与组合键在此生效：束的亮度=束内可见经数/3 */
  visibleIds: ReadonlySet<number>;
  onPickMeridian: (id: number) => void;
}) {
  const bundle = BUNDLE_OF[activeId] ?? 'shouYin';
  const activeName = MERIDIAN_FLOW[activeId]?.name ?? '';
  const visOf = (key: BundleKey) =>
    BUNDLE_IDS[key].filter((id) => visibleIds.has(id)).length / 3;
  const isActive = (key: BundleKey) => bundle === key && visibleIds.has(activeId);

  // 点某束 → 选中该束里当令的那条（不在或被藏则取束内第一条可见的）
  const pick = (key: BundleKey) => {
    const ids = BUNDLE_IDS[key];
    if (ids.includes(activeId) && visibleIds.has(activeId)) return onPickMeridian(activeId);
    onPickMeridian(ids.find((id) => visibleIds.has(id)) ?? ids[0]);
  };

  // 口诀句安在所述之路旁；束内有经被藏时随句标出 n/3
  const phraseOf = (k: BundleKey) => {
    const n = BUNDLE_IDS[k].filter((id) => visibleIds.has(id)).length;
    return {
      text: n === 3 ? tr(MNEMONIC[k]) : `${tr(MNEMONIC[k])} ${n}/3`,
      color: n === 0 ? SCENE_TEXT.muted : (isActive(k) ? UI.accent : (k === 'shouYin' || k === 'zuYin' ? GREEN : GOLD))
    };
  };

  // 竖屏（iPad 直放）时两侧被面板占住：按视口纵横比横向收束人形，高度不变
  const size = useThree((s) => s.size);
  const sx = Math.max(0.55, Math.min(1, size.width / size.height / 1.35));

  // 蝶翼路径（±x 镜像；画面左=人身左，肝生于左）
  const sides: Array<1 | -1> = [-1, 1];
  return (
    <group scale={[sx, 1, 1]}>
      {/* 中列脊线与 头/胸/腹（站立人形的躯干轴） */}
      <mesh position={[0, 0.85, 0]}>
        <boxGeometry args={[0.022, 3.5, 0.022]} />
        <meshBasicMaterial color={SCENE_TEXT.muted} transparent opacity={0.35} depthWrite={false} />
      </mesh>
      <NodeBox pos={[0, 2.6, 0]} text={tr('头')} round />
      <NodeBox pos={[0, 0.9, 0]} text={tr('胸')} />
      <NodeBox pos={[0, -0.9, 0]} text={tr('腹')} />

      {sides.map((s) => (
        <group key={s}>
          {/* 手三阴：胸 → 手，沿臂内线上行（升，绿） */}
          <MnemonicPath
            pts={[[s * 0.3, 0.95, 0], [s * 1.1, 1.5, 0], [s * 1.9, 2.2, 0], [s * 2.35, 2.65, 0]]}
            color={GREEN} active={isActive('shouYin')} speed={speed} vis={visOf('shouYin')}
            onClick={() => pick('shouYin')}
          />
          {/* 手三阳：手 → 头，过顶如举臂外缘（降，金） */}
          <MnemonicPath
            pts={[[s * 2.55, 3.0, 0], [s * 1.9, 3.15, 0], [s * 1.0, 3.05, 0], [s * 0.4, 2.75, 0]]}
            color={GOLD} active={isActive('shouYang')} speed={speed} vis={visOf('shouYang')}
            onClick={() => pick('shouYang')}
          />
          {/* 足三阳：头 → 足，沿躯干外廓大弧（降，金） */}
          <MnemonicPath
            pts={[[s * 0.45, 2.45, 0], [s * 1.6, 1.4, 0], [s * 2.3, 0, 0], [s * 2.4, -1.6, 0], [s * 1.75, -2.9, 0]]}
            color={GOLD} active={isActive('zuYang')} speed={speed} vis={visOf('zuYang')}
            onClick={() => pick('zuYang')}
          />
          {/* 足三阴：足 → 腹，内腿合入（升，绿） */}
          <MnemonicPath
            pts={[[s * 1.45, -2.85, 0], [s * 0.9, -2.0, 0], [s * 0.45, -1.3, 0], [s * 0.2, -1.0, 0]]}
            color={GREEN} active={isActive('zuYin')} speed={speed} vis={visOf('zuYin')}
            onClick={() => pick('zuYin')}
          />
        </group>
      ))}

      {/* 手足端点 */}
      <NodeBox pos={[-2.55, 3.2, 0]} text={tr('左手')} />
      <NodeBox pos={[2.55, 3.2, 0]} text={tr('右手')} />
      <NodeBox pos={[-1.75, -3.0, 0]} text={tr('左脚')} />
      <NodeBox pos={[1.75, -3.0, 0]} text={tr('右脚')} />

      {/* 两胁直书 */}
      <FlankText x={-3.2} />
      <FlankText x={3.2} />

      {/* 四句口诀各安其路 */}
      <Tag pos={[0, 3.55, 0]} text={phraseOf('shouYang').text} color={phraseOf('shouYang').color} size={12} pill />
      <Tag pos={[0, 1.85, 0]} text={phraseOf('shouYin').text} color={phraseOf('shouYin').color} size={12} pill />
      <Tag pos={[0, -1.95, 0]} text={phraseOf('zuYin').text} color={phraseOf('zuYin').color} size={12} pill />
      <Tag pos={[0, -3.38, 0]} text={phraseOf('zuYang').text} color={phraseOf('zuYang').color} size={12} pill />

      {/* 顶注与当令行 */}
      <Tag pos={[0, 3.9, 0]} text={tr('举手站立 · 十二经同时并行')} color={SCENE_TEXT.muted} size={12} />
      {activeName && visibleIds.has(activeId) && (
        <Tag pos={[0, -3.7, 0]} text={`${tr('当令').trim()} · ${tr(activeName)}`} color={UI.accent} size={13} />
      )}
    </group>
  );
}
