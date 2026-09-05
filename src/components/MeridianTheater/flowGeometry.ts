/**
 * 十二经流注环几何（"圆圈运动"纠偏规格书 · 脚本A）
 *
 * 核心几何：脏腑节点固定在人体解剖位（永不移动），十二条管状路径把
 * 相邻脏腑首尾相接成一个闭环（肺→大肠→…→肝→肺），金色气血粒子沿
 * 管道流动 —— 流动的是气，不是脏腑。
 *
 * 路径形态按规格书"3D路径的几何形态"：贴人体表面的曲线（经手臂/头/
 * 腿绕行），背面路径（膀胱/肾）z<0，剖面模式下可见。
 *
 * owner 2026-08-22：四肢段 via 点已按 Visible Human 皮肤网格实测重定位
 * （scripts/measure-limbs.py 量轴线与半径，逐点保持"沿肢体的相对位置"
 * 与"离体表的余量"不变）。躯干与头面点未动 —— 本次只改四肢。
 * 经络归属与循行侧别沿用原教学设定，本次只换坐标，未新增循行主张。
 */
import * as THREE from 'three';
import { COLORS } from '@/styles/theme';

export type Vec3 = [number, number, number];

export type OrganNodeMap = Record<string, Vec3>;

/**
 * 教学位：圆运动"左升右降"的示意布局（肝生于左等）。
 * 这是本项目原有的一套，非解剖真实位。
 */
export const TEACHING_NODES: OrganNodeMap = {
  肺: [0.45, 2.0, 0.3],      // 右上胸
  大肠: [0.5, 0.35, 0.35],   // 右下腹
  胃: [0.35, 1.0, 0.4],      // 中上腹右
  脾: [-0.4, 1.0, 0.4],      // 中上腹左
  心: [-0.4, 2.05, 0.35],    // 左上胸
  小肠: [-0.5, 0.35, 0.35],  // 左下腹
  // owner 2026-08-19 背视对称修正：膀胱本居中线；肾为左右一对，
  // 单节点以中线代表两肾——背视双侧孪生经各抱本侧、居中收束
  膀胱: [0, 0.25, -0.4],     // 腰后正中
  肾: [0, 0.55, -0.45],      // 腰后正中偏上（两肾之间）
  心包: [0, 1.85, 0.4],      // 中上胸
  三焦: [0.65, 0.75, 0],     // 右腰侧
  胆: [0.55, 1.35, 0.25],    // 右胁
  肝: [-0.5, 1.45, 0.3]      // 左下胸（肝生于左的教学方位）
};

/**
 * 解剖位：NIH 3D / Visible Human 男性全解剖模型实测形心
 * （scripts/measure-organs.py，与 body-skin.glb 同一套缩放平移；
 *  模型 +x 为人体左侧，此处已取负以符合项目"+x=右"的约定）。
 *
 * 三处不是直接量来的，按下述依据推定并在此写明，不得当作实测值：
 *   胃   —— 模型无胃网格，取"肝之胃压迹 / 脾之胃面 / 十二指肠上部"三者形心，
 *           即胃所占的腔隙；
 *   心包 —— 模型无心包膜，心包为心之外膜，取心形心后前移 0.15 以便与心区分；
 *   三焦 —— 无任何西医对应结构，只能沿用教学位。
 * 另两处为可视化取舍，也一并写明：
 *   大肠 —— 全段形心落在腹正中(-0.03)，与小肠形心几乎重合，改取回盲部
 *           （升结肠起始，人体右下腹）作代表点；
 *   肺/肾 —— 成对脏器，单节点取两侧形心之中点（肾左(-0.26,1.26)/右(0.23,1.19)）。
 */
export const ANATOMICAL_NODES: OrganNodeMap = {
  肺: [0, 1.94, 0.02],         // 双肺形心（居中线）
  大肠: [0.30, 1.05, 0.18],    // 回盲部·右下腹
  胃: [-0.11, 1.54, 0.10],     // 由胃压迹推定
  脾: [-0.35, 1.50, -0.13],    // 左季肋
  心: [-0.02, 1.90, 0.14],     // 心形心（略偏左）
  小肠: [-0.14, 1.04, 0.22],   // 腹中
  膀胱: [0, 0.27, 0.06],       // 盆腔正中
  肾: [0, 1.23, -0.06],        // 两肾之中（下肋后方，远高于原教学位）
  心包: [-0.02, 1.90, 0.29],   // 取心形心前移
  三焦: [0.65, 0.75, 0],       // 无解剖对应，沿用教学位
  胆: [0.27, 1.45, 0.21],      // 肝下·人体右侧
  肝: [0.20, 1.52, 0.09]       // 人体右侧 —— 与"肝生于左"的教学位左右相反
};


interface FlowSegment {
  /** 对应 MERIDIAN_FLOW 的 id（0=肺经 … 11=肝经） */
  id: number;
  from: keyof typeof TEACHING_NODES & string;
  to: keyof typeof TEACHING_NODES & string;
  /** 中途控制点（贴体表绕行：手臂/头/腿） */
  via: Vec3[];
  color: string;
  /**
   * 双侧镜像（owner 2026-08-19：十二经左右对称，四肢段应两侧皆有环）。
   * 途经四肢/头面的段生成镜像孪生：脏腑节点是共享的单点（脏无左右），
   * 只镜像 via 途经点——左右两条经同出同入本脏，与人体实际一致。
   */
  mirror?: boolean;
  /** 同一经的多段（如肾经=腿段+躯干段），用于 key 区分 */
  part?: string;
  /** 覆盖起/终点（肢体交接点，非脏腑；镜像时随 via 一起取负） */
  fromPoint?: Vec3;
  toPoint?: Vec3;
}

/** 足部交接点（膀胱经→肾经 / 胆经→肝经 的换经处，经典起于足） */
/**
 * 指端 / 趾端（scripts 实测：右手指端沿 x 展开 1.51~1.86，右足五趾 x 0.68~0.96）。
 * 归属按经典井穴所在的指/趾——肺出拇指、大肠起食指、心包出中指、三焦起无名指、
 * 心/小肠在小指，胃止次趾、胆止四趾、膀胱止小趾，脾起大趾内侧、肝起大趾外侧、
 * 肾起小趾下斜走足心。坐标是网格实测的指/趾位置，不作具体穴位定位之用。
 */
const neg = ([x, y, z]: Vec3): Vec3 => [-x, y, z];

// 注意：拇指与四指在这具网格里分属两块 —— 拇指 y 0.41–0.74，四指 y -0.04–0.39。
// 旧表五个锚点的 y 全在 -0.04..0.12，即五个值其实都落在**四指**那一块上，
// 拇指没有锚点，少商离拇指 0.291（owner 2026-08-23 "thumb is lost"）。
// 拇指一项已按实测改正；四指仍是粘连的一整块，分指依据不足，暂不动。
const THUMB: Vec3 = [1.857, 0.436, 0.207];   // 拇指甲角·肺经终（少商）
const INDEX: Vec3 = [1.910, 0.119, 0.133];   // 食指·大肠经起（商阳）
const MIDDLE: Vec3 = [1.797, 0.046, 0.139];   // 中指·心包经终（中冲）
const RING: Vec3 = [1.777, -0.010, 0.164];   // 无名指·三焦经起（关冲）
const LITTLE: Vec3 = [1.658, -0.024, 0.179];   // 小指·心经终 / 小肠经起

const TOE_1_MED: Vec3 = [0.666, -3.129, 0.155];   // 大趾内侧·脾经起（隐白）
const TOE_1_LAT: Vec3 = [0.773, -3.084, 0.208];   // 大趾外侧·肝经起（大敦）
const TOE_2: Vec3 = [0.778, -3.118, 0.322];   // 次趾·胃经终（厉兑）
const TOE_4: Vec3 = [0.884, -3.128, 0.240];   // 四趾·胆经终（足窍阴）
const TOE_5: Vec3 = [0.938, -3.121, 0.195];   // 小趾·膀胱经终（至阴）
const SOLE: Vec3 = [0.747, -3.200, 0.100];   // 足心·肾经（涌泉）

/** 分段配色按规格书路径表（全部取自 theme 五行色） */
const GOLD = COLORS.metal.primary;    // #FFD700
const GREEN = COLORS.wood.primary;    // #27AE60
const RED = COLORS.fire.primary;      // #E74C3C
const BLUE = COLORS.water.primary;    // #4FC3F7
const PURPLE = COLORS.minister.dark;  // #8E44AD

export const FLOW_SEGMENTS: FlowSegment[] = [
  { id: 0, mirror: true, from: '肺', to: '大肠', color: GOLD,
    via: [[0.85, 2.09, 0.12], [1.05, 1.55, 0.10], [1.31, 0.96, 0.01], [1.55, 0.55, 0.04], THUMB, [1.02, 1.25, 0.05], [0.95, 1.40, 0.02], [0.55, 1.48, 0.02]] }, // 胸→臂→拇指→原路经腋下回右下腹
  { id: 1, mirror: true, from: '大肠', to: '胃', color: GOLD,
    via: [[0.55, 1.48, 0.02], [0.95, 1.40, 0.02], [1.02, 1.25, 0.05], INDEX, [1.22, 1.02, 0.09], [1.00, 1.57, 0.14], [0.80, 2.19, 0.14], [0.45, 2.35, 0.15], [0.28, 2.50, 0.05], [0.19, 2.66, 0.17], [0.15, 3.1, 0.4], [0.14, 2.62, 0.14], [0.30, 2.45, 0.06], [0.38, 2.30, 0.20], [0.35, 2.0, 0.45]] }, // 食指→臂→颈侧→头(鼻旁)→沿颈下行
  // owner 2026-08-22：胃/脾同为足经，此前只画了腹内短弧、缺整条腿段
  // （膀胱/肾、胆/肝 早已成对补全，唯独此对遗漏）。按同一"足部换经"结构补：
  // 胃经下行止于足趾，脾经自足趾上行入脾。
  { id: 2, mirror: true, from: '胃', toPoint: TOE_2, to: '脾', color: GOLD,
    // 胃→腹前(近前正中旁)→大腿前外→胫骨前缘→踝前→止于次趾（换经处）
    via: [[0.45, 0.25, 0.38], [0.60, -0.60, 0.30], [0.68, -1.90, 0.00], [0.74, -2.68, -0.16], [0.75, -3.00, 0.04]] },
  { id: 3, part: 'leg', mirror: true, fromPoint: TOE_2, from: '胃', to: '脾', color: GREEN,
    // 脾经·腿段：经足背至大趾内侧起→内踝前→小腿内侧→大腿内侧→下腹→入脾
    via: [TOE_1_MED, [0.64, -3.02, 0.04], [0.64, -2.92, -0.17], [0.62, -2.72, -0.22], [0.56, -2.40, -0.23], [0.30, -1.70, -0.19], [0.22, -0.60, 0.10], [0.15, 0.30, 0.40]] },
  { id: 3, part: 'trunk', from: '脾', to: '心', color: GREEN,
    via: [[-0.55, 1.55, 0.31]] },                                                               // 脾经·躯干段：左腹→左上胸短弧
  { id: 4, mirror: true, from: '心', to: '小肠', color: RED,
    via: [[-0.87, 2.05, 0.11], [-1.06, 1.55, 0.09], [-1.31, 0.96, 0.01], [-1.48, 0.55, 0.05], neg(LITTLE), [-1.02, 1.25, 0.05], [-0.95, 1.40, 0.02], [-0.55, 1.48, 0.02]] }, // 心→腋下→臂→小指→原路经腋下回左下腹
  { id: 5, mirror: true, from: '小肠', to: '膀胱', color: RED,
    // 手→臂外→绕肩胛(背侧)→头→颈后→夹脊下行→腰（背侧审计：小肠经肩胛段走背）
    via: [[-0.55, 1.48, 0.02], [-0.95, 1.40, 0.02], [-1.02, 1.25, -0.12], neg(LITTLE), [-1.22, 1.02, -0.22], [-0.86, 2.09, -0.18], [-0.26, 2.62, -0.30], [-0.1, 3.1, -0.2], [0, 2.4, -0.4], [0.1, 1.2, -0.45]] },
  { id: 6, mirror: true, from: '膀胱', toPoint: TOE_5, to: '肾', color: BLUE,
    // 膀胱经：背→腿后下行→绕外踝后→沿足外侧→止于小趾（换经处）
    via: [[0.47, -1.04, -0.24], [0.55, -1.45, -0.36], [0.59, -2.14, -0.52], [0.88, -2.90, -0.22]] },
  { id: 7, part: 'leg', mirror: true, fromPoint: TOE_5, from: '膀胱', to: '肾', color: BLUE,
    // 肾经·腿段：起于小趾之下→斜走足心→内踝→腿内后上行→肾
    via: [SOLE, [0.57, -2.55, -0.34], [0.46, -1.59, -0.38], [0.36, -1.15, -0.20], [0.26, -0.30, -0.28]] },
  { id: 7, part: 'trunk', from: '肾', to: '心包', color: BLUE,
    via: [[-0.2, 0.9, 0.15], [-0.1, 1.35, 0.45]] },                                            // 肾经·躯干段：腰后→腹→中上胸
  { id: 8, mirror: true, from: '心包', to: '三焦', color: PURPLE,
    via: [[0.65, 1.83, 0.10], [0.55, 1.48, 0.02], [0.95, 1.40, 0.02], [1.02, 1.25, 0.08], [1.27, 0.90, 0.10], MIDDLE, [1.02, 1.25, 0.06], [0.95, 1.40, 0.02], [0.55, 1.48, 0.02]] }, // 胸→腋下→上臂→臂内→中指→原路经腋下回右腰侧
  { id: 9, mirror: true, from: '三焦', to: '胆', color: PURPLE,
    // 手→臂外→肩颈后侧(背侧审计)→耳后→面→下行
    via: [[0.55, 1.48, 0.05], [0.95, 1.40, 0.05], [1.02, 1.25, -0.10], RING, [1.22, 1.08, -0.22], [1.05, 1.60, -0.24], [0.88, 2.00, -0.26], [0.75, 2.25, -0.25], [0.40, 2.45, -0.28], [0.26, 2.62, -0.24], [0.28, 3.05, 0.10], [0.24, 2.62, 0.01], [0.67, 2.21, 0.25]] },
  { id: 10, mirror: true, from: '胆', toPoint: TOE_4, to: '肝', color: GREEN,
    // 胆经：侧头→胁→腿外下行→外踝前→止于第四趾（换经处）
    via: [[0.62, 2.2, 0.15], [0.58, 0.70, 0.20], [0.76, -0.06, 0.12], [0.81, -1.69, -0.08], [0.88, -2.72, -0.27]] },
  { id: 11, part: 'leg', mirror: true, fromPoint: TOE_4, from: '胆', to: '肝', color: GREEN,
    // 肝经·腿段：经足背至大趾外侧起→内踝前→腿内上行→入肝
    via: [TOE_1_LAT, [0.66, -2.98, -0.04], [0.60, -2.45, -0.21], [0.46, -1.59, 0.05], [0.29, -0.30, 0.34]] },
  { id: 11, part: 'trunk', from: '肝', to: '肺', color: GREEN,
    via: [[-0.15, 1.75, 0.42]] }                                                                // 肝经·躯干段：腹→胸短弧
];

import { FEMALE_SEGMENT_POINTS } from './flowViaFemale';

export type TheaterSex = 'male' | 'female';

/** 按体别取分段：女体换上生成表（男线贴她体表＋她本人指趾端），男体原表 */
export function flowSegmentsFor(sex: TheaterSex): FlowSegment[] {
  if (sex !== 'female') return FLOW_SEGMENTS;
  return FLOW_SEGMENTS.map((seg) => {
    const o = FEMALE_SEGMENT_POINTS[`${seg.id}|${seg.part ?? ''}`];
    if (!o) return seg;
    const out: FlowSegment = { ...seg, via: o.via };
    if (o.fromPoint) out.fromPoint = o.fromPoint;
    if (o.toPoint) out.toPoint = o.toPoint;
    return out;
  });
}

export interface FlowPath {
  id: number;
  part: string;
  fromOrgan: string;
  toOrgan: string;
  color: string;
  curve: THREE.CatmullRomCurve3;
  /** 镜像孪生（对侧肢体的同名经） */
  mirrored?: boolean;
}

/** 镜像规则：via 与肢体交接点（fromPoint/toPoint）取负 x；脏腑节点不动 */
function buildCurve(segment: FlowSegment, mirror: boolean, nodes: OrganNodeMap): THREE.CatmullRomCurve3 {
  const flip = ([x, y, z]: Vec3): Vec3 => (mirror ? [-x, y, z] : [x, y, z]);
  const start = segment.fromPoint ? flip(segment.fromPoint) : nodes[segment.from];
  const end = segment.toPoint ? flip(segment.toPoint) : nodes[segment.to];
  const mid = segment.via.map(flip);
  // 低张力 catmullrom：默认(centripetal/0.5)在控制点稀疏处会向外鼓出体表，
  // 张力降到 0.2 明显收敛，又不至于把曲线拉成折线。
  return new THREE.CatmullRomCurve3(
    [start, ...mid, end].map((p) => new THREE.Vector3(...p)),
    false,
    'catmullrom',
    0.2
  );
}

/** 按给定脏腑位置表构建流注环（脏腑位可切换，故为函数而非常量） */
export function buildFlowPaths(nodes: OrganNodeMap, segments: FlowSegment[] = FLOW_SEGMENTS): FlowPath[] {
  return segments.flatMap((segment) => {
    const base: FlowPath = {
      id: segment.id,
      part: segment.part ?? 'main',
      fromOrgan: segment.from,
      toOrgan: segment.to,
      color: segment.color,
      curve: buildCurve(segment, false, nodes)
    };
    if (!segment.mirror) return [base];
    return [base, { ...base, mirrored: true, curve: buildCurve(segment, true, nodes) }];
  });
}
