import { useMemo } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { TongueCoating, TONGUE_REGIONS } from '@/data/tongueCoatings';
import { ELEMENT_COLORS } from '@/data/organs';
import { UI } from '@/styles/theme';

/**
 * 塑形舌体（owner 2026-08-27「找更好的呈现」）：不再用光椭球——
 * 球体顶点位移出舌形：向舌尖收窄、尖端圆收、舌面中央纵沟、背面微拱。
 * 仍是教学示意，非解剖模型。
 */
function buildTongueGeometry(): THREE.BufferGeometry {
  const geometry = new THREE.SphereGeometry(1, 48, 32);
  const pos = geometry.attributes.position as THREE.BufferAttribute;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    // 基准椭球比例
    let x = v.x * 0.85, y = v.y * 0.3, z = v.z * 1.25;
    // 向舌尖（+z）收窄并微微上翘
    const tip = Math.max(0, z / 1.25);
    x *= 1 - 0.38 * tip * tip;
    y *= 1 - 0.25 * tip * tip;
    y += 0.06 * tip * tip * tip;
    // 舌根（-z）加宽增厚
    const root = Math.max(0, -z / 1.25);
    x *= 1 + 0.1 * root;
    y *= 1 + 0.22 * root;
    // 舌面中央纵沟（只在上表面）
    if (v.y > 0) {
      y -= 0.05 * Math.exp(-Math.pow(x / 0.16, 2)) * (0.4 + 0.6 * (1 - Math.abs(z) / 1.3));
    }
    pos.setXYZ(i, x, y, z);
  }
  geometry.computeVertexNormals();
  return geometry;
}

/** v3 苔质 → 粗糙度 */
const COAT_ROUGH: Record<string, number> = {
  fine: 0.45, coarse: 0.75, grainy: 0.85, slippery: 0.12, peeling: 0.9
};
/** v3 络脉粗细档 → 管径 */
const VEIN_R: Record<string, number> = {
  very_thin: 0.014, thin: 0.022, normal: 0.03, thick: 0.046
};

export function TongueModel({
  coating,
  showRegions
}: {
  coating: TongueCoating;
  showRegions: boolean;
}) {
  const v3 = coating.visual3D;
  const tongueGeo = useMemo(buildTongueGeometry, []);

  // 舌体参数：优先 v3 逐字段；灰黑苔/剥苔（交付无 v3）回落旧字段
  const body = useMemo(() => {
    if (v3) {
      return {
        color: new THREE.Color(v3.tongueBody.color),
        emissive: new THREE.Color(v3.tongueBody.emissive),
        emissiveIntensity: 1,
        roughness: v3.tongueBody.roughness,
        thickness: v3.tongueBody.thickness,
        cracks: !!v3.tongueBody.cracks,
        crackDepth: v3.tongueBody.crackDepth ?? 0.15,
        teethMarks: !!v3.tongueBody.teethMarks
      };
    }
    return {
      color: new THREE.Color(coating.bodyColor),
      emissive: new THREE.Color(coating.bodyColor),
      emissiveIntensity: coating.bodyEmissive,
      roughness: 0.6,
      thickness: coating.bodyScale ?? 1,
      cracks: !!coating.cracks,
      crackDepth: 0.15,
      teethMarks: !!coating.teethMarks
    };
  }, [coating, v3]);

  // 苔层：v3 coverage 为 0-1 比例（自舌根向舌尖铺）；thickness → 壳层厚度
  const coat = useMemo(() => {
    if (v3) {
      if (v3.coating.coverage <= 0.12 || v3.coating.thickness <= 0) return null;
      return {
        color: new THREE.Color(v3.coating.color),
        emissive: v3.coating.emissive != null ? new THREE.Color(v3.coating.emissive) : null,
        thickness: v3.coating.thickness,
        coverage: v3.coating.coverage,
        roughness: COAT_ROUGH[v3.coating.texture] ?? 0.5,
        gradient: v3.coating.colorGradient ? Object.values(v3.coating.colorGradient) : null
      };
    }
    if (coating.coverage === 'none') return null;
    const coverage = coating.coverage === 'front' ? 0.5 : coating.coverage === 'rear' ? 0.5 : 0.95;
    return {
      color: new THREE.Color(coating.coatColor), emissive: null,
      thickness: 0.15, coverage, roughness: coating.roughness, gradient: null
    };
  }, [coating, v3]);

  // 舌下络脉（v3：色/粗细/显隐逐字段）
  const veins = useMemo(() => {
    const r = v3 ? VEIN_R[v3.sublingualVeins.thickness] ?? 0.03 : 0.03;
    const color = v3 ? v3.sublingualVeins.color : ELEMENT_COLORS.water.three;
    const visibility = v3 ? v3.sublingualVeins.visibility : 0.5;
    const curves = [-0.16, 0.16].map(
      (x) =>
        new THREE.CatmullRomCurve3([
          new THREE.Vector3(x, -0.18, -0.7),
          new THREE.Vector3(x * 1.5, -0.23, 0.1),
          new THREE.Vector3(x * 0.9, -0.17, 0.85)
        ])
    );
    // 侧支小络脉：主脉两侧各一条短支
    const branches = [-0.16, 0.16].flatMap((x) => [
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(x * 1.2, -0.2, -0.2),
        new THREE.Vector3(x * 2.4, -0.16, 0.2)
      ]),
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(x * 1.3, -0.21, 0.35),
        new THREE.Vector3(x * 2.1, -0.15, 0.7)
      ])
    ]);
    return { r, color, visibility, curves, branches };
  }, [v3]);

  // 裂纹：v3 crackDepth 控制沟宽/深浅（燥裂 0.3=宽深沟，红舌浅纹）
  const crackTubes = useMemo(() => {
    if (!body.cracks) return [];
    const d = body.crackDepth;
    const paths: [number, number, number][][] = [
      [[0, 0.26, 1.0], [0, 0.3, 0.2], [0, 0.31, -0.6]],
      [[-0.28, 0.27, 0.65], [0.1, 0.29, -0.1], [0.2, 0.28, -0.45]],
      [[0.3, 0.26, 0.55], [-0.05, 0.29, 0.0], [-0.25, 0.27, -0.5]],
      [[-0.14, 0.28, 0.35], [-0.4, 0.24, -0.2]],
      [[0.12, 0.29, 0.8], [0.38, 0.24, 0.25]]
    ];
    const used = d >= 0.25 ? paths : paths.slice(0, 3);
    return used.map((pts) => {
      const curve = new THREE.CatmullRomCurve3(
        pts.map(([x, y, z]) => new THREE.Vector3(x, y * body.thickness, z))
      );
      return new THREE.TubeGeometry(curve, 24, 0.012 + d * 0.05, 5, false);
    });
  }, [body.cracks, body.crackDepth, body.thickness]);

  return (
    <group>
      {/* 塑形舌体（thickness：胖大/瘦薄） */}
      <mesh geometry={tongueGeo} scale={[Math.sqrt(body.thickness), body.thickness, 1]}>
        <meshStandardMaterial
          color={body.color}
          emissive={body.emissive}
          emissiveIntensity={body.emissiveIntensity}
          roughness={body.roughness}
        />
      </mesh>
      {/* 裂纹沟（深暗色管，crackDepth 定宽窄） */}
      {crackTubes.map((geometry, i) => (
        <mesh key={`crack-${i}`} geometry={geometry}>
          <meshStandardMaterial color={'#3a0c06'} roughness={0.95} />
        </mesh>
      ))}
      {/* 齿痕（脾虚湿盛：舌边扇贝状压痕） */}
      {body.teethMarks &&
        [-1, 1].map((sideSign) =>
          [0.8, 0.45, 0.08, -0.3].map((z) => (
            <mesh
              key={`tm-${sideSign}-${z}`}
              position={[sideSign * (0.72 - 0.2 * Math.max(0, z / 1.25) ** 2) * Math.sqrt(body.thickness), 0.16 * body.thickness, z]}
              scale={[0.1, 0.06, 0.15]}
            >
              <sphereGeometry args={[1, 10, 10]} />
              <meshStandardMaterial color={'#B58A85'} roughness={0.9} />
            </mesh>
          ))
        )}
      {/* 苔层：贴舌面的壳（coverage 自舌根铺开；渐变苔分三段由浅到深） */}
      {coat &&
        (coat.gradient ? (
          // 渐变苔（黄苔浅→中→老黄）：三层嵌套壳自舌根叠起——
          // 舌尖只见浅色，越往根叠得越深，天然成"热由浅入深"的梯度
          coat.gradient.map((_, i) => {
            const n = coat.gradient!.length;
            const cov = coat.coverage * (1 - i / n) + 0.001;
            return (
              <mesh key={`coat-${i}`} geometry={tongueGeo}
                    position={[0, 0.02 + coat.thickness * 0.16 + i * 0.012, -1.25 * (1 - cov)]}
                    scale={[1.01 * Math.sqrt(body.thickness), body.thickness * (1.02 + coat.thickness * 0.3), cov * 1.02]}>
                <meshStandardMaterial color={new THREE.Color(coat.gradient![n - 1 - i])} transparent opacity={0.7}
                                      roughness={coat.roughness} depthWrite={false} />
              </mesh>
            );
          })
        ) : (
          <mesh geometry={tongueGeo}
                position={[0, 0.02 + coat.thickness * 0.16, -1.25 * (1 - coat.coverage)]}
                scale={[1.01 * Math.sqrt(body.thickness), body.thickness * (1.02 + coat.thickness * 0.3), coat.coverage * 1.02]}>
            <meshStandardMaterial
              color={coat.color}
              emissive={coat.emissive ?? coat.color}
              emissiveIntensity={coat.emissive ? 0.5 : 0.05}
              transparent
              opacity={0.82}
              roughness={coat.roughness}
              depthWrite={false}
            />
          </mesh>
        ))}
      {/* 舌下络脉（舌底视角；v3 色/粗细/显隐） */}
      {[...veins.curves, ...veins.branches].map((curve, i) => (
        <mesh key={`vein-${i}`}>
          <tubeGeometry args={[curve, 20, i < 2 ? veins.r : veins.r * 0.55, 6, false]} />
          <meshStandardMaterial color={veins.color} emissive={veins.color}
                                emissiveIntensity={0.3} transparent opacity={Math.min(1, veins.visibility + 0.15)} />
        </mesh>
      ))}
      {/* 舌面分区光环（彭子益：尖心/中脾胃/根肾/边肝胆） */}
      {showRegions &&
        TONGUE_REGIONS.map((region) => (
          <group key={region.key} position={region.position}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <torusGeometry args={[region.radius, 0.02, 8, 40]} />
              <meshBasicMaterial
                color={ELEMENT_COLORS[region.element].hex}
                transparent
                opacity={0.85}
                depthWrite={false}
              />
            </mesh>
            {region.key !== 'sideR' && (
              <Html center distanceFactor={7} position={[0, 0.22, 0]} style={{ pointerEvents: 'none' }}>
                <div
                  style={{
                    color: ELEMENT_COLORS[region.element].hex,
                    fontSize: '11px',
                    whiteSpace: 'nowrap',
                    textShadow: '0 0 6px rgba(0,0,0,0.9)'
                  }}
                >
                  {region.label}
                </div>
              </Html>
            )}
          </group>
        ))}
      <Html center distanceFactor={9} position={[0, -0.7, 1.3]} style={{ pointerEvents: 'none' }}>
        <div style={{ color: UI.textMuted, fontSize: '10px', whiteSpace: 'nowrap' }}>舌尖（前）</div>
      </Html>
    </group>
  );
}
