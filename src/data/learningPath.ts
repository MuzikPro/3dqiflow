/**
 * A+B+C 三件套数据层（DELIVERY_ABC_INTEGRATE，2026-08-19）
 *
 * A. 六阶学习路径：阶名/副标/通关语出自交付原文；每阶条文清单不用交付
 *    节选（各阶只列 2-3 条且是章节相对编号），改为按真实章节从 ARTICLES
 *    实时推导——各阶即全章。
 * B. 彭子益点睛语录：DELIVERY_WISDOM 补交了完整 peng_quotes.js（此前
 *    仅有节选），已全量誊写为本工程 key。
 * C. 首次引导 6 屏：文案逐字取自交付。
 *
 * 进度持久化：localStorage（项目规则：学习进度本地保存，无遥测）。
 */
import { ARTICLES, Article } from './articles';
import { COLORS } from '@/styles/theme';

export interface LearningStage {
  stage: number;
  name: string;
  subtitle: string;
  chapter: string;      // 与 Article.chapter 精确对应
  color: string;        // theme 语义色
  unlockQuote: string;  // 通关语（交付原文）
  /** 本阶核心要点（DELIVERY_WISDOM learning_path.js） */
  keyConcepts: string[];
}

export const LEARNING_STAGES: LearningStage[] = [
  { stage: 1, name: '轮病（表）', subtitle: '学会「运轮」', chapter: '辨太阳病脉证并治上', color: COLORS.fire.primary, unlockQuote: '桂枝汤非发汗之方，乃和营卫、运圆运动之方。——彭子益', keyConcepts: ['中气如轴，四维如轮——太阳病是轮的最外层', '桂枝汤非发汗之方，乃和营卫、运圆运动之方', '麻黄汤是辛温发汗之祖，开太阳之闭', '有汗用桂枝（营卫不和），无汗用麻黄（卫闭营郁）'] },
  { stage: 2, name: '轮病（里）', subtitle: '学会「降右」', chapter: '辨阳明病脉证并治', color: COLORS.metal.primary, unlockQuote: '阳明为阖，胃家实是右降闭塞之极。——彭子益', keyConcepts: ['阳明为阖，胃家实是右降闭塞之极', '白虎汤清降气分弥漫之热（无形热盛）', '承气汤攻下有形燥屎（痞满燥实坚）', '三阳统于阳明——阳明一通，三阳皆和'] },
  { stage: 3, name: '枢病', subtitle: '学会「运枢」', chapter: '辨少阳病脉证并治', color: COLORS.wood.primary, unlockQuote: '少阳为枢，枢转则轮降、轴自复。——彭子益', keyConcepts: ['少阳为枢，枢转则轮降、轴自复', '小柴胡汤：柴胡升左+黄芩降右=运枢', '往来寒热是正邪交争半表半里之特征', '少阳不可发汗、不可吐下——只能和'] },
  { stage: 4, name: '轴病', subtitle: '学会「运轴」', chapter: '辨太阴病脉证并治', color: COLORS.earth.primary, unlockQuote: '中气者，圆运动之轴。轴立则轮自行。——彭子益', keyConcepts: ['三阴统于太阴——太阴一转，三阴皆和', '中气者，圆运动之轴。轴立则轮自行', '理中丸：干姜温中+白术健脾=直运轴', '自利不渴属太阴（脏有寒），自利而渴属少阴'] },
  { stage: 5, name: '根本病', subtitle: '学会「固根本」', chapter: '辨少阴病脉证并治', color: COLORS.water.primary, unlockQuote: '附子如将帅，将外散的相火一把拉回命门。——彭子益', keyConcepts: ['少阴是水火之宅——肾中水火是圆运动的动力源', '脉微细但欲寐=水火分离=圆运动根本动摇', '四逆汤：附子如将帅，将外散的相火一把拉回命门', '通脉四逆汤是四逆汤加量版——阴盛格阳之极'] },
  { stage: 6, name: '交接病', subtitle: '学会「复阴阳交接」', chapter: '辨厥阴病脉证并治', color: COLORS.minister.primary, unlockQuote: '厥阴者，阴尽阳生之地。圆运动复环，全在此处。——彭子益', keyConcepts: ['厥阴者，阴尽阳生之地——圆运动在回环处断裂', '消渴、气上撞心、心中疼热=上热；饥不欲食=下寒', '乌梅丸：酸收相火+苦寒清热+辛温助阳=三组同时出击', '厥热胜负定预后：热多厥少=愈，厥多热少=进'] }
];

/** 某阶（=某章）的全部条文 */
export function stageArticles(stage: number): Article[] {
  const meta = LEARNING_STAGES[stage - 1];
  if (!meta) return [];
  return ARTICLES.filter((a) => a.chapter === meta.chapter);
}

// ── 本地进度（统一 yy_* 前缀，交付修坑#1） ──
const KEY_READ = 'yy_read_articles';
const KEY_CELEBRATED = 'yy_stage_celebrated';
export const KEY_ONBOARDED = 'yy_onboarded';
export const KEY_QUOTE_COLLAPSED = 'yy_quote_collapsed';

function lsGet(key: string): string | null {
  try { return localStorage.getItem(key); } catch { return null; }
}
function lsSet(key: string, value: string): void {
  try { localStorage.setItem(key, value); } catch { /* 本地存储不可用时静默降级 */ }
}

export function loadReadIds(): Set<number> {
  try { return new Set<number>(JSON.parse(lsGet(KEY_READ) ?? '[]')); } catch { return new Set(); }
}
export function saveReadIds(ids: Set<number>): void {
  lsSet(KEY_READ, JSON.stringify([...ids]));
}
export function loadCelebrated(): Set<number> {
  try { return new Set<number>(JSON.parse(lsGet(KEY_CELEBRATED) ?? '[]')); } catch { return new Set(); }
}
export function saveCelebrated(stages: Set<number>): void {
  lsSet(KEY_CELEBRATED, JSON.stringify([...stages]));
}

export function stageProgress(stage: number, readIds: Set<number>): { read: number; total: number; pct: number } {
  const list = stageArticles(stage);
  const read = list.filter((a) => readIds.has(a.id)).length;
  return { read, total: list.length, pct: list.length ? Math.round((read / list.length) * 100) : 0 };
}

// ══════════ B. 彭子益点睛语录（交付逐字条目） ══════════
export interface PengQuote {
  text: string;
  modern?: string;
  source: string;
}

/**
 * key 约定：方剂名 / 'pulse_脉名' / 'article_内部id'。
 * 语录库为 DELIVERY_WISDOM peng_quotes.js 全量誊写（39 方中 29 方 +
 * 4 提纲条文 + 8 脉），key 由其英文 id 映射为本工程中文名/内部 id。
 * 誊写勘误：原文件四逆汤 key 误作 'sin_i_tang'（拼写断裂）。
 */
export const PENG_QUOTES: Record<string, PengQuote> = {
  // ── 方剂 ──
  桂枝汤: { text: '桂枝汤非发汗之方，乃和营卫、运圆运动之方。', modern: '桂枝汤不是用来发汗的，是调和营卫、恢复圆运动的。', source: '《圆运动的古中医学》古方篇' },
  麻黄汤: { text: '麻黄汤是辛温发汗之祖方，开太阳之闭。', modern: '麻黄汤是发汗第一方，专门打开太阳经的表闭。', source: '《圆运动的古中医学》古方篇' },
  葛根汤: { text: '葛根汤是太阳阳明合病之方，葛根升阳明经气，麻黄开太阳表闭。', modern: '葛根汤管太阳+阳明两条经，葛根升津、麻黄发汗。', source: '《圆运动的古中医学》古方篇' },
  桂枝加葛根汤: { text: '葛根升提太阳经气，使津液上达项背。', modern: '葛根把津液往上拉，缓解项背的拘紧。', source: '《圆运动的古中医学》古方篇' },
  桂枝加厚朴杏子汤: { text: '此方是运轮之后专降右路——胃肺一气贯通，喘自平。', modern: '桂枝汤恢复营卫后，厚朴降胃、杏仁降肺，喘就平了。', source: '《圆运动的古中医学》古方篇' },
  桂枝去芍药汤: { text: '芍药主降，胸满忌降，故去之。桂枝主升，胸阳宜升，故独任之。', modern: '胸满不能用降药芍药，所以去掉；桂枝能升阳，所以单独重用。', source: '《圆运动的古中医学》古方篇' },
  桂枝去芍药加附子汤: { text: '附子如将帅，将外散的相火一把拉回命门。', modern: '附子这味药像将军，能把散到外面的相火强行拉回肾里。', source: '《圆运动的古中医学》古方篇' },
  桂枝加附子汤: { text: '汗漏不止是相火外泄太过，附子一把将外散的相火拉回。', modern: '出汗太多导致阳气外泄，附子把阳气收回肾中。', source: '《圆运动的古中医学》古方篇' },
  桂枝加芍药汤: { text: '桂枝汤是运轮之方，倍芍药则变为运轮以复轴——轮转轴自复。', modern: '桂枝汤原本是恢复轮转的，加倍芍药就变成通过轮转来修复中轴。', source: '《圆运动的古中医学》古方篇' },
  桂枝加大黄汤: { text: '此方一和一下，虚实并治。大黄仅二两，是微下而非峻攻。', modern: '既用芍药和脾，又用少量大黄微下，太阴虚人受不了大承气。', source: '《圆运动的古中医学》古方篇' },
  小建中汤: { text: '建中者，建立中气也。中气者，圆运动之轴。轴立则轮自行。', modern: '建中就是建立中气。中气是圆运动的轴心，轴立住了轮子自己会转。', source: '《圆运动的古中医学》古方篇' },
  桂枝麻黄各半汤: { text: '此方如和风细雨，微微发汗，令小邪随汗而解，不伤圆运动之津液。', modern: '小剂量微微发汗，像和风细雨，既解了表邪又不伤津液。', source: '《圆运动的古中医学》古方篇' },
  桂枝去桂加茯苓白术汤: { text: '水停则气闭，去桂枝者，因非营卫不和，乃水停也。茯苓白术运轴利水。', modern: '无汗不是营卫不和，是水停在里面堵住了。用茯苓白术运轴利水。', source: '《圆运动的古中医学》古方篇' },
  大承气汤: { text: '大承气汤是釜底抽薪之法——去其燥屎，右降自通。', modern: '把锅底下的柴抽掉，燥屎一除，胃气自然往下走。', source: '《圆运动的古中医学》古方篇' },
  小承气汤: { text: '小承气是微下之法，无芒硝之软坚，但通降胃气而已。', modern: '小承气是轻量版攻下，没有芒硝软坚，只通降胃气。', source: '《圆运动的古中医学》古方篇' },
  调胃承气汤: { text: '调胃承气润燥微下，有芒硝无枳朴，力缓而不伤中。', modern: '调胃承气用芒硝润燥，没有枳实厚朴，力道缓和，不伤中气。', source: '《圆运动的古中医学》古方篇' },
  白虎汤: { text: '白虎汤是清降右降轮之热，石膏辛寒直清肺胃弥漫之热。', modern: '白虎汤是清降右路的药，石膏专门清掉肺胃里弥漫的热。', source: '《圆运动的古中医学》古方篇' },
  白虎加人参汤: { text: '白虎汤是清降右降轮之热，人参是补回中轴已伤之津液。轮清轴润，圆运动复。', modern: '白虎汤清右路的热，人参补回被热伤的津液。两边都修好，圆运动恢复。', source: '《圆运动的古中医学》古方篇' },
  小柴胡汤: { text: '柴胡升左，黄芩降右，一升一降，枢机复转。枢转则轮降、轴自复。', modern: '柴胡往上升、黄芩往下降，枢机一转，该降的降、该升的升。', source: '《圆运动的古中医学》古方篇' },
  黄连汤: { text: '黄连汤清上温下、和中降逆，使枢机复转。上为热下为寒，非纯寒纯热之证。', modern: '上面有热、下面有寒，用黄连清上、干姜温下，让枢机重新转起来。', source: '《圆运动的古中医学》古方篇' },
  理中丸: { text: '中气者，圆运动之轴。轴立则轮自行。干姜温中，白术健脾，四味直运轴。', modern: '理中丸四味药直接温补中轴，轴一立住，轮子自己会转。', source: '《圆运动的古中医学》古方篇' },
  附子理中汤: { text: '附子理中者，温肾以生脾也。肾为先天之本，脾为后天之本。火生土。', modern: '附子理中丸是温肾来补脾。肾是先天之本，脾是后天之本，肾火旺了脾自然健。', source: '《圆运动的古中医学》古方篇' },
  四逆汤: { text: '附子如将帅，将外散的相火一把拉回命门。姜草和中，四逆回阳。', modern: '附子像将军一样把散掉的相火拉回肾里，干姜甘草护住中气。', source: '《圆运动的古中医学》古方篇' },
  通脉四逆汤: { text: '通脉四逆是四逆汤之重剂，附子干姜加倍，救欲绝之脉。', modern: '通脉四逆汤是四逆汤的加强版，附子干姜加倍，抢救快断的阳气。', source: '《圆运动的古中医学》古方篇' },
  白通汤: { text: '白通汤加葱白，通阳破阴。葱白通达上下，引姜附之温入肾。', modern: '白通汤多了一味葱白，能把姜附的温热直接送到肾里破阴寒。', source: '《圆运动的古中医学》古方篇' },
  真武汤: { text: '真武汤温肾阳以制水，苓术健脾以利水。水火重新交媾，圆运动复。', modern: '真武汤用附子温肾阳、苓术健脾利水，让水和火重新配合，圆运动恢复。', source: '《圆运动的古中医学》古方篇' },
  乌梅丸: { text: '乌梅丸酸收相火、苦寒清热、辛温助阳，三组同时出击，使阴阳重新交接。', modern: '乌梅丸三路并进：酸味收相火、苦味清热、辛味温阳，让阴阳重新接上。', source: '《圆运动的古中医学》古方篇' },
  乌梅白糖汤: { text: '温病者，木火之气疏泄太过也。乌梅酸收相火，白糖养中润燥。', modern: '温病是木火之气散得太厉害。乌梅酸收相火，白糖养中润燥。', source: '《圆运动的古中医学》温病本气篇' },
  白头翁汤: { text: '白头翁汤清热凉血，使圆运动回环归于平和。', modern: '白头翁汤清掉血分的热，让圆运动的回环回到平和状态。', source: '《圆运动的古中医学》古方篇' },
  // ── 条文（提纲） ──
  article_3001: { text: '口苦咽干目眩，皆相火上炎——枢机不转之始。', modern: '口苦咽干目眩都是胆火往上冲的表现，是枢机不转的开始。', source: '少阳提纲·彭子益解读' },
  article_273: { text: '太阴病=中轴停转。轴不转则轮不行——此即轴坏则轮停。', modern: '太阴病是中轴（脾）停了。轴不转，轮子也不转——轴坏了轮子就停。', source: '太阴提纲·彭子益解读' },
  article_281: { text: '脉微细但欲寐，水火两虚——圆运动根本动摇。', modern: '脉微是阳气衰、脉细是阴血亏，水火都虚了，圆运动的根本在动摇。', source: '少阴提纲·彭子益解读' },
  article_326: { text: '厥阴者，阴尽阳生之地。阴阳交接失败，则圆运动在回环处断裂。', modern: '厥阴是阴到头、阳要生的地方。阴阳接不上，圆运动就在最关键处断了。', source: '厥阴提纲·彭子益解读' },
  // ── 脉象 ──
  pulse_平脉: { text: '平脉者，从容和缓，左升右降各得其常。圆运动如常之象。', modern: '正常脉象从容和缓，左升右降都正常，圆运动在健康运转。', source: '《圆运动的古中医学》脉法篇' },
  pulse_浮脉: { text: '浮为表证，左升波外推=营卫不和。如水漂木，轻取即得。', modern: '浮脉主表证，说明邪气在表、营卫不和，轻按就能摸到。', source: '《圆运动的古中医学》脉法篇' },
  pulse_沉脉: { text: '沉为里证，左升波内缩=邪入于里。如石投水，必重按乃得。', modern: '沉脉主里证，邪气已经入里，要重按才能摸到。', source: '《圆运动的古中医学》脉法篇' },
  pulse_迟脉: { text: '迟为寒，阳不足而运行慢。一息三至，如冬日之迟缓。', modern: '迟脉主寒，阳气不足所以跳得慢，一呼一吸只跳三次。', source: '《圆运动的古中医学》脉法篇' },
  pulse_数脉: { text: '数为热，阳有余而运行速。一息六至，如夏日之炎蒸。', modern: '数脉主热，阳气有余所以跳得快，一呼一吸跳六次。', source: '《圆运动的古中医学》脉法篇' },
  pulse_弦脉: { text: '弦为少阳主脉，胆气不舒之象。如按琴弦，端直而长。', modern: '弦脉是少阳病的代表脉，胆气不舒畅就呈现紧绷如琴弦的感觉。', source: '《圆运动的古中医学》脉法篇' },
  pulse_滑脉: { text: '滑为阳气有余、阴血亦充。如盘走珠，流利不停。', modern: '滑脉表示阳气充足、阴血也充实，脉象流利如珠子在盘上滚动。', source: '《圆运动的古中医学》脉法篇' },
  pulse_细脉: { text: '细为气血两虚，脉道不充。如丝如线，应指显然。', modern: '细脉主气血两虚，脉管充不满，细得像丝线一样。', source: '《圆运动的古中医学》脉法篇' }
};

/** 全局圆运动模型（顶部微缩图 · DELIVERY_WISDOM learning_path.js） */
export const YUANYUNDONG_MODEL = {
  axis: { name: '中气（脾胃）', description: '圆运动之轴。轴立则轮自行。' },
  dimensions: [
    { name: '肝木', direction: '升', arrow: '↗', color: COLORS.wood.primary },
    { name: '心火', direction: '宣通', arrow: '↑', color: COLORS.fire.primary },
    { name: '肺金', direction: '收敛', arrow: '↓', color: COLORS.metal.primary },
    { name: '肾水', direction: '封藏', arrow: '↘', color: COLORS.water.primary }
  ],
  cycle: '木→火→金→水→木……一气周流，形成闭合之环',
  coreQuote: '人身与宇宙同一大气的物质势力圆运动之学。——彭子益'
};

export function getPengQuote(key: string): PengQuote | null {
  return PENG_QUOTES[key] ?? null;
}

// ══════════ C. 首次引导 6 屏（交付原文） ══════════
export interface OnboardingScreen {
  id: number;
  title: string;
  narration: string;
  /** 屏2：圆环变形（生病=圆转失常） */
  deformed?: boolean;
  /** 屏 3-6 的彭子益点睛（DELIVERY_WISDOM onboarding_script.js） */
  quote?: string;
}

export const ONBOARDING_SCREENS: OnboardingScreen[] = [
  { id: 1, title: '健康时的圆运动', narration: '这是你健康时的圆运动——中气为轴，四维为轮。一气周流，形成闭合之环。' },
  { id: 2, title: '生病 = 圆转失常', narration: '生病，就是圆转失常——该升的不升，该降的不降。左升受阻，右降闭塞，中轴停转。', deformed: true },
  { id: 3, title: '桂枝汤 · 运轮', narration: '桂枝汤在这里发力——桂枝升左，芍药降右，恢复营卫的圆运动。此谓「运轮」。', quote: '桂枝汤非发汗之方，乃和营卫、运圆运动之方。——彭子益' },
  { id: 4, title: '理中丸 · 运轴', narration: '理中丸在这里发力——干姜温中，白术健脾。中轴一立，轮自行。此谓「运轴」。', quote: '中气者，圆运动之轴。轴立则轮自行。——彭子益' },
  { id: 5, title: '四逆汤 · 固根本', narration: '四逆汤在这里发力——附子如将帅，将外散的相火一把拉回命门。此谓「固根本」。', quote: '附子如将帅，将外散的相火一把拉回命门。——彭子益' },
  { id: 6, title: '治病的本质 = 复圆', narration: '治病的本质，就是「复圆」二字。圆转正常，人就健康；圆转失常，人就生病。现在，开始你的学习之旅。', quote: '人身与宇宙同一大气的物质势力圆运动之学。——彭子益' }
];

export function isOnboarded(): boolean {
  return lsGet(KEY_ONBOARDED) === 'true';
}
export function setOnboarded(done: boolean): void {
  if (done) lsSet(KEY_ONBOARDED, 'true');
  else {
    try { localStorage.removeItem(KEY_ONBOARDED); } catch { /* ignore */ }
  }
}
export function isQuoteCollapsed(): boolean {
  return lsGet(KEY_QUOTE_COLLAPSED) === '1';
}
export function setQuoteCollapsed(collapsed: boolean): void {
  lsSet(KEY_QUOTE_COLLAPSED, collapsed ? '1' : '0');
}
