/**
 * 学术校验工具 —— 防止 AI 生成内容中出现常见错误
 * 
 * 用法：
 *   import { checkAcademic, ACADEMIC_REDLINES } from '@/utils/academicCheck';
 * 
 *   const result = checkAcademic('中气即肺气');
 *   if (!result.pass) console.warn(result.reason);
 */

export interface CheckResult {
  pass: boolean;
  reason?: string;
  suggestion?: string;
}

/**
 * 学术红线清单（来自附件"三个纠错点"）
 * 
 * 这些是彭子益原书 + 中医经典明确界定的正确表述。
 * AI 在生成任何内容前，必须对照此清单自检。
 */
export const ACADEMIC_REDLINES = {
  // 红线1：中气定义
  zhongqi: {
    wrong: ['中气即肺气', '中气就是肺气', '中气指肺'],
    right: '中气 = 脾胃之气（土气）。肺主气、肾藏精是右降路径上的两个关键节点，不是中气本身。',
    source: '彭子益《圆运动的古中医学》原理上篇'
  },

  // 红线2：方剂名称
  formulas: {
    wrong: ['泻火汤'],
    right: '应标注具体经方原名，如"大黄黄芩黄连泻心汤"或"黄连阿胶汤"',
    source: '《伤寒论》'
  },

  // 红线3：太乙神
  taiyi: {
    wrong: ['太乙神是经典术语', '太乙神出自内经'],
    right: '"太乙神"是教学术语（胃经+肾经的统称），非经典原文固定称谓，使用时应标注"教学术语"。',
    source: '附件学习卡片05'
  },

  // 红线4：二十四节气对应
  jieqi: {
    wrong: ['节气与人体气机完全对应', '每个节气精确对应某经'],
    right: '二十四节气与人体气机的对应是模型简化。临床必须辨证，不可机械套用"某节气必某病"。',
    source: '彭子益："学知二十四节气，须用功夫，一点不可含糊。"'
  },

  // 红线5：相火归属
  xianghuo: {
    wrong: ['相火只属于心包', '三焦不是相火'],
    right: '相火寄于水火之间，心包（手厥阴）与三焦（手少阳）同属相火系统。',
    source: '《圆运动的古中医学》原理上篇'
  },

  // 红线6：六经统属
  liujing: {
    wrong: ['三阳统于太阳', '三阴统于少阴'],
    right: '彭子益提出"三阳统于阳明，三阴统于太阴"——把六经辨证简化为脾胃中气升降问题。',
    source: '《圆运动的古中医学》古方篇'
  },

  // 红线7：凡病皆本气自病
  benqi: {
    wrong: ['外邪直接致病', '邪气是疾病的主因'],
    right: '彭子益："凡病皆本气自病。"外邪是诱因，根本是自身圆运动先乱。治病关键是恢复本气圆运动。',
    source: '《圆运动的古中医学》原理上篇'
  }
} as const;

/**
 * 检查文本是否触碰学术红线
 */
export function checkAcademic(text: string): CheckResult {
  const checks = [
    {
      key: 'zhongqi',
      wrong: ACADEMIC_REDLINES.zhongqi.wrong,
      right: ACADEMIC_REDLINES.zhongqi.right
    },
    {
      key: 'formulas',
      wrong: ACADEMIC_REDLINES.formulas.wrong,
      right: ACADEMIC_REDLINES.formulas.right
    },
    {
      key: 'taiyi',
      wrong: ACADEMIC_REDLINES.taiyi.wrong,
      right: ACADEMIC_REDLINES.taiyi.right
    },
    {
      key: 'jieqi',
      wrong: ACADEMIC_REDLINES.jieqi.wrong,
      right: ACADEMIC_REDLINES.jieqi.right
    },
    {
      key: 'xianghuo',
      wrong: ACADEMIC_REDLINES.xianghuo.wrong,
      right: ACADEMIC_REDLINES.xianghuo.right
    },
    {
      key: 'liujing',
      wrong: ACADEMIC_REDLINES.liujing.wrong,
      right: ACADEMIC_REDLINES.liujing.right
    },
    {
      key: 'benqi',
      wrong: ACADEMIC_REDLINES.benqi.wrong,
      right: ACADEMIC_REDLINES.benqi.right
    }
  ];

  for (const check of checks) {
    for (const wrong of check.wrong) {
      if (text.includes(wrong)) {
        return {
          pass: false,
          reason: `触碰学术红线 [${check.key}]：使用了"${wrong}"`,
          suggestion: check.right
        };
      }
    }
  }

  return { pass: true };
}

/**
 * 生成学术声明（用于页面底部/卡片底部）
 */
export function getAcademicDisclaimer(): string {
  return '彭子益《圆运动的古中医学》·仅供学习研究使用·临床请遵医嘱';
}

/**
 * 为方剂数据添加学术标注
 */
export function annotateFormula(formulaName: string): string {
  const annotations: Record<string, string> = {
    '泻火汤': '⚠️ 非经方原名，请使用具体方名如"大黄黄芩黄连泻心汤"',
    '理中丸': '✅ 运轴代表方·《伤寒论》+《圆运动的古中医学》古方上篇',
    '小建中汤': '✅ 运轮代表方·桂枝汤倍芍药+饴糖',
    '乌梅丸': '✅ 轴轮并运代表方·十味药分四组双线作战',
    '桂枝汤': '✅ 调和营卫第一方·圆运动视角=调木气升降',
    '四逆汤': '✅ 回阳救逆·先救命门之火，火复轴运轮行',
    '通脉四逆汤': '✅ 四逆汤加量·破阴通脉，救阴盛格阳',
    '白通汤': '✅ 四逆去甘草加葱白·为被格拒的阳气开通路',
    '真武汤': '✅ 温阳利水·阳复水化，水火重新交媾',
    '白头翁汤': '✅ 厥阴唯一清法·热清血宁，凉降回环',
    '小柴胡汤': '✅ 运枢第一方·柴胡升左黄芩降右，枢转轮行',
    '白虎汤': '✅ 清降第一方·石膏如秋凉，清轮热不伤轴',
    '大承气汤': '✅ 峻下·釜底抽薪，痞满燥实坚俱全方可投',
    '小承气汤': '✅ 轻下·无芒硝，治痞满，和之非攻',
    '调胃承气汤': '✅ 润燥微下·有硝无枳朴，甘草缓中',
    '麻子仁丸': '✅ 润下·脾约（胃强脾弱），蜜丸缓攻',
    '旋覆代赭汤': '✅ 运轴降逆·一轻一重拉回逆气',
    '黄连汤': '✅ 清上温下·黄连干姜等量，一清一温',
    '四逆散': '✅ 运枢解郁·阳郁非阳虚，与四逆汤天壤之别',
    '桂枝加芍药汤': '✅ 运轮复轴·倍芍药入太阴和脾',
    '炙甘草汤': '✅ 轴轮并运·阴阳双补复脉，清酒行药',
    '麻黄汤': '✅ 辛温发汗之祖·与桂枝汤并列表证双祖，开肺闭',
    '大青龙汤': '✅ 麻黄汤+石膏·表寒里热，汗清并施',
    '小青龙汤': '✅ 表寒里饮·姜辛化饮五味锁肺，一散一收',
    '葛根汤': '✅ 桥梁方·桂枝底+麻黄开表，太阳阳明合病',
    '桂枝加葛根汤': '✅ 有汗+项背强·桂枝底加葛根升津（无麻黄）',
    '桂枝加厚朴杏子汤': '✅ 有汗而喘·厚朴降胃杏仁降肺',
    '桂枝去芍药汤': '✅ 误下胸满脉促·去降存升，专升胸阳',
    '桂枝去芍药加附子汤': '✅ 兼微恶寒·升阳+附子温固表阳',
    '桂枝加大黄汤': '✅ 大实痛·倍芍药和脾+大黄二两微下',
    '桂枝麻黄各半汤': '✅ 如疟状热多寒少·两方各半小发汗',
    '桂枝去桂加茯苓白术汤': '✅ 千古争议方·水停气闭，去桂加苓术运轴利水',
    '甘草干姜汤': '✅ 二味·辛甘化阳先复其阳，次第之先',
    '芍药甘草汤': '✅ 二味·酸甘化阴后复其阴，次第之后',
    '白虎加人参汤': '✅ 白虎+人参·清轮补轴，大渴津气两伤',
    '附子理中汤': '✅ 后世方（局方）·温肾生脾，火生土',
    '乌梅白糖汤': '✅ 彭子益温病第一方·酸收相火甘润养中',
    '白术枳实干姜白蜜汤': '✅ 太阴脾气不转·运轴润轮，非承气之攻',
    '黄芪五物汤加干姜半夏': '✅ 金匮黄芪桂枝五物加味·补气升阳+降逆',
    '桂枝加附子汤': '✅ 宋本20条·保留芍药+附子固表止漏（≠去芍药加附子）'
  };
  return annotations[formulaName] || '';
}
