/**
 * 数据审计（owner 2026-09-04）：`npm run audit`。
 *
 * 生成端（读体表网格、量骨性标志、按骨度分寸落位的 Python 管线）随内容工具
 * 保管，不在本仓。可公开复核的是它的**产物不变量**——本文件逐条执行：
 * 坐标必须落在人体框内、镜像位必须真为镜像、男女两套必须覆盖同一批穴、
 * 编号不得重复、经络路线不得含退化重复点。
 *
 * 这套断言不能证明某穴解剖学正确（坐标本就是示意位，见 README「已知缺口」），
 * 能证明的是：数据没有悄悄漂移、没有半套改动、没有自相矛盾。
 */
import { describe, it, expect } from 'vitest';
import { ACUPOINTS } from '../src/data/acupoints';
import { DERIVED_POINTS } from '../src/data/acupointsDerived';
import { DERIVED_POINTS as DERIVED_FEMALE } from '../src/data/acupointsDerivedFemale';
import { MERIDIAN_ROUTES } from '../src/data/meridianRoutes';
import { meridianPolyline } from '../src/components/Acupoints/pointGeometry';

// 人体坐标框：脚底 y=-3.2、头顶 y=3.5（public/models/README.md，与 bodyGeometry.BODY 同框）
// 双臂外展时指端可及 |x|≈1.8，故横向框放宽；此框只捉离谱漂移，不做解剖判定
const Y_MIN = -3.4, Y_MAX = 3.7, XZ_MAX = 2.0;

describe('coordinate frame', () => {
  it('every acupoint sits inside the body frame', () => {
    const outside = ACUPOINTS
      .filter(({ pos: [x, y, z] }) =>
        y < Y_MIN || y > Y_MAX || Math.abs(x) > XZ_MAX || Math.abs(z) > XZ_MAX)
      .map((p) => `${p.code} @ ${p.pos.join(',')}`);
    expect(outside).toEqual([]);
  });

  it('no coordinate is NaN or non-finite', () => {
    const bad = [...ACUPOINTS, ...DERIVED_POINTS, ...DERIVED_FEMALE]
      .filter((p) => p.pos.some((v) => !Number.isFinite(v)))
      .map((p) => p.code);
    expect(bad).toEqual([]);
  });
});

describe('derived points', () => {
  it('point codes are unique within each body', () => {
    for (const [label, set] of [['male', DERIVED_POINTS], ['female', DERIVED_FEMALE]] as const) {
      const seen = new Set<string>();
      const dupes = set.filter((p) => (seen.has(p.code) ? true : (seen.add(p.code), false)))
                       .map((p) => `${label}:${p.code}`);
      expect(dupes).toEqual([]);
    }
  });

  it('both bodies cover the same set of points (no half-finished re-derivation)', () => {
    const m = new Set(DERIVED_POINTS.map((p) => p.code));
    const f = new Set(DERIVED_FEMALE.map((p) => p.code));
    expect([...m].filter((c) => !f.has(c))).toEqual([]);
    expect([...f].filter((c) => !m.has(c))).toEqual([]);
  });

  it('the mirrored position really is the mirror (same height, opposite side)', () => {
    const wrong = [...DERIVED_POINTS, ...DERIVED_FEMALE]
      .filter((p) => p.posM)
      // 体表并非左右全等，允许贴面产生的小差；只断言「同高、异侧」
      // 近正中的穴（|x| < 5cm）镜像后可能仍在同侧，属正常；只对明确偏侧的穴断言异侧
      .filter((p) => Math.abs(p.posM![1] - p.pos[1]) > 0.05 ||
                     (Math.abs(p.pos[0]) > 0.05 &&
                      Math.sign(p.posM![0]) === Math.sign(p.pos[0])))
      .map((p) => `${p.code}: ${p.pos.join(',')} vs ${p.posM!.join(',')}`);
    expect(wrong).toEqual([]);
  });
});

describe('meridian routes', () => {
  it('the render layer emits no consecutive duplicate points', () => {
    // 已知缺口（见 README「已知缺口」）：原始路线数据含退化重复点——阳跷镜像
    // 1239 点中 737 个与前一点重合。喂给 CatmullRom+Tube 会整条静默不画：
    // 数值全对、状态全对，就是不出画。修在渲染层（meridianPolyline 去重），
    // 未回修数据，因为生成端不在本仓。此处断言真正成立的那条保证。
    const offenders: string[] = [];
    for (const code of Object.keys(MERIDIAN_ROUTES)) {
      for (const mirrored of [false, true]) {
        const path = meridianPolyline(code, mirrored);
        for (let i = 1; i < path.length; i++) {
          const [a, b] = [path[i - 1], path[i]];
          if (Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]) <= 1e-6) {
            offenders.push(`${code}${mirrored ? ' (mirrored)' : ''} @ index ${i}`);
            break;
          }
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it('records how much degenerate data the render layer is absorbing', () => {
    // 缺口的量化留痕：数字变大＝数据又退化了，应当回头修生成端而不是加厚补丁
    let raw = 0, deduped = 0;
    for (const code of Object.keys(MERIDIAN_ROUTES)) {
      raw += (MERIDIAN_ROUTES[code] as unknown[]).length;
      deduped += meridianPolyline(code, false).length;
    }
    const absorbed = raw - deduped;
    expect(absorbed).toBeGreaterThanOrEqual(0);
    // 当前基线：若这条失败，说明退化点显著增多，需查生成端
    expect(absorbed).toBeLessThan(raw * 0.5);
  });
});
