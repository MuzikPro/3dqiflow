/**
 * 十四经经穴（362 穴）—— 由 scripts/build-acupoints.py 从 atlas-positions.md 生成，请勿手改。
 *
 * ⚠️ 坐标是**示意定位**，不是解剖测量值。
 * 源数据（Let Energy Flow 项目导出）标注 `schematic_unvalidated`，且写明其 x/y 只对应
 * 它自己那张 400×924 示意图；本脚本按源文件建议，用两边同名的体表标志帧
 * （头顶/颏/颈根/肩/乳/脐/裆/膝/踝/足底，四肢另按肢体折线参数）重定位到本项目人体上，
 * 再沿体表法向贴面。结果可用于空间记忆与经络走向教学，
 * **不可用于在真人身上取穴**。可移植的是每穴的 loc(定位) 文本，不是这里的数字。
 *
 * 归属与来源：
 * · 背部椎骨阶梯源自 HuBMAP CCF 3D Reference Object Library（CC BY 4.0）——
 *   Browne, K., Schlehlein, H., Herr II, B. W., Quardokus, E., Bueckle, A., Börner, K. (2022).
 * · 中文定位措辞依 GB/T 12346-2021《經穴部位》，经该项目编审工作表整理；
 *   公开可查不等于可再发布，按学习材料对待。
 */

export interface Acupoint {
  code: string;
  zh: string;
  en: string;
  pinyin: string;
  region: string;
  view: 'front' | 'back';
  side: string;
  meridian: string;
  /** 定位文本（可移植的那一部分，源标注见 locReview） */
  loc: string;
  locEn: string;
  locReview: string;
  /** 本项目人体上的示意坐标，非解剖测量值 */
  pos: [number, number, number];
}

export interface MeridianMeta {
  code: string;
  zh: string;
  en: string;
  element: string;
  paired: string;
  count: number;
  route?: string;
}

export const MERIDIAN_META: MeridianMeta[] = [
 {
  "code": "LU",
  "zh": "手太陰肺經",
  "en": "Lung meridian (Hand Taiyin)",
  "element": "metal",
  "paired": "LI",
  "count": 11,
  "route": "起於中焦，下絡大腸，回繞胃上口（賁門），上膈屬肺；從肺系（喉嚨）橫行至胸部外上方（中府），沿上肢內側前緣下行（雲門、天府、俠白、尺澤、孔最、列缺、經渠、太淵、魚際），止於拇指橈側端（少商）。"
 },
 {
  "code": "LI",
  "zh": "手陽明大腸經",
  "en": "Large Intestine meridian (Hand Yangming)",
  "element": "metal",
  "paired": "LU",
  "count": 20,
  "route": "起於食指橈側末端（商陽），沿食指橈側上行（二間、三間），經手背第 1–2 掌骨間（合谷）、腕背橈側（陽谿），沿前臂背面橈側上行（偏歷、溫溜、下廉、上廉、手三里），過肘（曲池、肘髎），經臂外側（手五里、臂臑）、肩（肩髃、巨骨），上頸（天鼎、扶突），至面口鼻旁（口禾髎、迎香）止。"
 },
 {
  "code": "ST",
  "zh": "足陽明胃經",
  "en": "Stomach meridian (Foot Yangming)",
  "element": "earth",
  "paired": "SP",
  "count": 45,
  "route": "起於鼻翼旁（迎香），挾鼻上行至鼻根部，入目內眥（承泣），向下沿鼻外側（四白、巨髎）至口角（地倉），環繞口唇（大迎、頰車），沿下頜角（下關）上行至耳前（頭維），經頸側（人迎、水突、氣舍）入缺盆，下膈屬胃絡脾；其直行者從缺盆下胸（氣戶至乳根），經腹（不容至歸來、氣衝），至下肢（髀關至犢鼻），沿脛前外側下行（足三里至豐隆），經足背（解溪至內庭），止於第 2 趾末節外側（厲兌）。"
 },
 {
  "code": "SP",
  "zh": "足太陰脾經",
  "en": "Spleen meridian (Foot Taiyin)",
  "element": "earth",
  "paired": "ST",
  "count": 21,
  "route": "脾足太陰之脈，起於大指之端，循指內側白肉際，過核骨後，上內踝前廉，上腨內，循脛骨後，交出厥陰之前，上膝股內前廉，入腹，屬脾，絡胃，上膈，挾咽，連舌本，散舌下。其支者，復從胃，別上膈，注心中。脾之大絡，名曰大包，出淵腋下三寸，布胸脅。"
 },
 {
  "code": "HT",
  "zh": "手少陰心經",
  "en": "Heart meridian (Hand Shaoyin)",
  "element": "fire",
  "paired": "SI",
  "count": 9,
  "route": "心手少陰之脈，起於心中，出屬心系，下膈，絡小腸。其支者，從心系，上挾咽，系目系。其直者，復從心系，卻上肺，下出腋下，下循臑內後廉，行太陰、心主之後，下肘內，循臂內後廉，抵掌後銳骨之端，入掌內後廉，循小指之內，出其端。"
 },
 {
  "code": "SI",
  "zh": "手太陽小腸經",
  "en": "Small Intestine meridian (Hand Taiyang)",
  "element": "fire",
  "paired": "HT",
  "count": 19,
  "route": "起於手小指尺側端少澤穴，沿手掌尺側上行，出尺骨鷹嘴與肱骨內上髁之間，循臑外後廉上肩，繞肩胛，交肩上，入缺盆，絡心，循咽，下膈，抵胃，屬小腸；其支者從缺盆循頸上頰至目銳眥，入耳中；又一支從頰上目內眥，交足太陽膀胱經。"
 },
 {
  "code": "BL",
  "zh": "足太陽膀胱經",
  "en": "Bladder meridian (Foot Taiyang)",
  "element": "water",
  "paired": "KI",
  "count": 67,
  "route": "起於目內眥睛明穴，上額交巔，入絡腦，還出別下項，循肩膊內，挾脊抵腰中，入循膂，絡腎，屬膀胱；其支者從腰中下挾脊貫臀入膕中；其支者從膊內左右別下貫胛挾脊內，過髀樞，循髀外後廉下合膕中，以下貫踹內，出外踝之後，循京骨至小趾外側端至陰穴。"
 },
 {
  "code": "KI",
  "zh": "足少陰腎經",
  "en": "Kidney meridian (Foot Shaoyin)",
  "element": "water",
  "paired": "BL",
  "count": 27,
  "route": "起於足小趾之下，斜趨足心湧泉，出然谷之下，循內踝後太谿，上行經小腿內側、膝膕陰谷，再沿股內側後緣入脊裡屬腎絡膀胱；直行之脈從腎向上貫肝膈，入肺，循喉嚨，挾舌本；支者從肺出絡心，注胸中。"
 },
 {
  "code": "PC",
  "zh": "手厥陰心包經",
  "en": "Pericardium meridian (Hand Jueyin)",
  "element": "fire",
  "paired": "TE",
  "count": 9,
  "route": "起於胸中，出屬心包絡，向下穿過膈肌，依次聯絡上、中、下三焦；其支者從胸中出脅肋，至腋下三寸處（天池），上行抵腋下，沿上臂內側中線下行至肘窩（曲澤），再沿前臂兩筋之間行至掌中（勞宮），止於中指尖端（中衝）；又一支者從掌中分出，沿無名指出其端，與手少陽三焦經相接。"
 },
 {
  "code": "TE",
  "zh": "手少陽三焦經",
  "en": "Triple Energizer meridian (Hand Shaoyang)",
  "element": "fire",
  "paired": "PC",
  "count": 23,
  "route": "起於無名指尺側端（關衝），上行於第 4、5 指之間，沿手背至腕部（陽池），出前臂外側尺橈兩骨之間（外關、支溝），向上通過肘尖（天井），沿上臂外側中線上行至肩（臑會、肩髎），交會於大椎，入缺盆，布於膻中，散絡心包，下穿膈肌，依次屬上、中、下三焦；其支者從膻中上出缺盆，上項，繫耳後，直上出耳上角（角孫），再屈折下行至頰部；又一支者從耳後入耳中，出走耳前（耳門），至眉梢外端止（絲竹空）。"
 },
 {
  "code": "GB",
  "zh": "足少陽膽經",
  "en": "Gallbladder meridian (Foot Shaoyang)",
  "element": "wood",
  "paired": "LR",
  "count": 44,
  "route": "起於目外眥瞳子髎，上行額角，下至耳後風池，沿頸側下行至肩上，交會大椎，入鎖骨窩；向內進入胸中，貫穿膈肌，聯絡肝臟，歸屬膽腑；再沿脅裡下行，經腹股溝、髖關節外側，沿大腿、小腿外側下行，止於第四足趾外側足竅陰穴。耳部分支：耳後分支入耳中，出走耳前，回至眼外角。足部分支：足背分出一支，走向大腳趾，銜接肝經。"
 },
 {
  "code": "LR",
  "zh": "足厥陰肝經",
  "en": "Liver meridian (Foot Jueyin)",
  "element": "wood",
  "paired": "GB",
  "count": 14,
  "route": "起於足大趾叢毛之際（大敦），沿足背上行至內踝前 1 寸（中封），上行於內踝上 8 寸處交出足太陰脾經之後，上行於膝膕內側（曲泉），沿股內側中線入陰毛中，環繞陰器，至少腹挾胃屬肝絡膽，向上貫膈，布於脅肋，循喉嚨後面，向上入鼻咽部，連接目系，上出額部，與督脈會於巔頂；其支者從目系下頰裡，環唇內；另一支從肝分出，貫膈，上注於肺，接手太陰肺經。"
 },
 {
  "code": "CV",
  "zh": "任脈",
  "en": "Conception Vessel (Ren Mai)",
  "element": "—",
  "paired": "—",
  "count": 24,
  "route": "任脈起於小腹內（胞中），下出會陰，沿腹胸正中線上行，經關元等穴至咽喉，上頤循面入目眶下；分支從會陰別出，與沖脈、督脈同源（一源三岐）。"
 },
 {
  "code": "GV",
  "zh": "督脈",
  "en": "Governor Vessel (Du Mai)",
  "element": "—",
  "paired": "—",
  "count": 29,
  "route": "督脈起於小腹內（胞中），出會陰，向後行於腰背正中，沿脊柱上行，經項後至風府入腦，沿頭部正中線上行至巔頂百會，經前額下行鼻柱至鼻尖素髎，過人中至上齒正中之齦交。"
 }
];

export const ACUPOINTS: Acupoint[] = [
 {
  "code": "LU1",
  "zh": "中府",
  "en": "Central Treasury",
  "pinyin": "zhong fu",
  "region": "chest",
  "view": "front",
  "side": "left",
  "meridian": "LU",
  "loc": "在胸前壁的外上方，雲門下 1 寸，平第 1 肋間隙，距前正中線 6 寸。",
  "locEn": "On the upper lateral chest wall, 1 cun below LU2, level with the first intercostal space, 6 cun lateral to the anterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.8,
   2.184,
   0.117
  ]
 },
 {
  "code": "LU2",
  "zh": "雲門",
  "en": "Cloud Gate",
  "pinyin": "yun men",
  "region": "chest",
  "view": "front",
  "side": "left",
  "meridian": "LU",
  "loc": "在胸前壁的外上方，肩胛骨喙突上方，鎖骨下窩凹陷處，距前正中線 6 寸。",
  "locEn": "On the upper lateral chest wall, above the coracoid process, in the infraclavicular fossa, 6 cun lateral to the anterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.8,
   2.272,
   0.095
  ]
 },
 {
  "code": "LU3",
  "zh": "天府",
  "en": "Celestial Storehouse",
  "pinyin": "tian fu",
  "region": "upper arm",
  "view": "front",
  "side": "left",
  "meridian": "LU",
  "loc": "在臂內側面，肱二頭肌橈側緣，腋前紋頭下 3 寸處。",
  "locEn": "On the medial upper arm, at the radial border of biceps brachii, 3 cun below the anterior axillary fold.",
  "locReview": "source_checked",
  "pos": [
   -1.04,
   1.662,
   0.035
  ]
 },
 {
  "code": "LU4",
  "zh": "俠白",
  "en": "Guarding White",
  "pinyin": "xia bai",
  "region": "upper arm",
  "view": "front",
  "side": "left",
  "meridian": "LU",
  "loc": "在臂內側面，肱二頭肌橈側緣，腋前紋頭下 4 寸，或肘橫紋上 5 寸處。",
  "locEn": "On the medial upper arm at the radial border of biceps brachii, 4 cun below the anterior axillary fold (5 cun above the cubital crease).",
  "locReview": "source_checked",
  "pos": [
   -1.04,
   1.564,
   0.104
  ]
 },
 {
  "code": "LU5",
  "zh": "尺澤",
  "en": "Cubit Marsh",
  "pinyin": "chi ze",
  "region": "elbow",
  "view": "front",
  "side": "left",
  "meridian": "LU",
  "loc": "在肘橫紋中，肱二頭肌腱橈側凹陷處。",
  "locEn": "On the cubital crease, in the depression radial to the biceps brachii tendon.",
  "locReview": "source_checked",
  "pos": [
   -1.16,
   1.073,
   0.07
  ]
 },
 {
  "code": "LU6",
  "zh": "孔最",
  "en": "Collection Hole",
  "pinyin": "kong zui",
  "region": "forearm",
  "view": "front",
  "side": "left",
  "meridian": "LU",
  "loc": "在前臂掌面橈側，當尺澤與太淵連線，腕掌側遠端橫紋上 7 寸。",
  "locEn": "On the radial palmar forearm, on the LU5–LU9 line, 7 cun above the distal wrist crease.",
  "locReview": "source_checked",
  "pos": [
   -1.32,
   0.718,
   0.054
  ]
 },
 {
  "code": "LU7",
  "zh": "列缺",
  "en": "Broken Sequence",
  "pinyin": "lie que",
  "region": "wrist",
  "view": "front",
  "side": "left",
  "meridian": "LU",
  "loc": "在前臂橈側緣，橈骨莖突上方，腕掌側遠端橫紋上 1.5 寸；拇短伸肌腱與拇長展肌腱之間。",
  "locEn": "On the radial border of the forearm, above the radial styloid, 1.5 cun above the distal wrist crease, between the tendons of extensor pollicis brevis and abductor pollicis longus.",
  "locReview": "source_checked",
  "pos": [
   -1.56,
   0.378,
   0.065
  ]
 },
 {
  "code": "LU8",
  "zh": "經渠",
  "en": "Channel Ditch",
  "pinyin": "jing qu",
  "region": "wrist",
  "view": "front",
  "side": "left",
  "meridian": "LU",
  "loc": "在前臂掌面橈側，橈骨莖突與橈動脈之間凹陷處，腕掌側遠端橫紋上 1 寸。",
  "locEn": "On the radial palmar forearm, in the depression between the radial styloid and the radial artery, 1 cun above the distal wrist crease.",
  "locReview": "source_checked",
  "pos": [
   -1.6,
   0.347,
   0.057
  ]
 },
 {
  "code": "LU9",
  "zh": "太淵",
  "en": "Great Abyss",
  "pinyin": "tai yuan",
  "region": "wrist",
  "view": "front",
  "side": "left",
  "meridian": "LU",
  "loc": "在腕掌側橫紋橈側，橈動脈搏動處。",
  "locEn": "At the radial end of the palmar wrist crease, at the radial artery pulse.",
  "locReview": "source_checked",
  "pos": [
   -1.64,
   0.285,
   0.069
  ]
 },
 {
  "code": "LU10",
  "zh": "魚際",
  "en": "Fish Border",
  "pinyin": "yu ji",
  "region": "hand",
  "view": "front",
  "side": "left",
  "meridian": "LU",
  "loc": "在手拇指本節（第 1 掌指關節）後凹陷處，約當第 1 掌骨中點橈側，赤白肉際處。",
  "locEn": "In the depression proximal to the first metacarpophalangeal joint, at the radial midpoint of the first metacarpal, on the red-and-white skin border.",
  "locReview": "source_checked",
  "pos": [
   -1.72,
   0.166,
   0.106
  ]
 },
 {
  "code": "LU11",
  "zh": "少商",
  "en": "Lesser Shang",
  "pinyin": "shao shang",
  "region": "thumb",
  "view": "front",
  "side": "left",
  "meridian": "LU",
  "loc": "在手拇指末節橈側，距指甲根角側上方 0.1 寸（指寸）。",
  "locEn": "On the radial side of the distal thumb, 0.1 finger-cun proximal-lateral to the corner of the nail.",
  "locReview": "source_checked",
  "pos": [
   -1.76,
   0.05,
   0.158
  ]
 },
 {
  "code": "LI1",
  "zh": "商陽",
  "en": "Shang Yang",
  "pinyin": "shang yang",
  "region": "index finger",
  "view": "front",
  "side": "right",
  "meridian": "LI",
  "loc": "在手指，食指末節橈側，距指甲根角側上方 0.1 寸（指寸）。",
  "locEn": "On the radial side of the distal index finger, 0.1 finger-cun proximal-lateral to the corner of the nail.",
  "locReview": "source_checked",
  "pos": [
   1.76,
   0.05,
   0.158
  ]
 },
 {
  "code": "LI2",
  "zh": "二間",
  "en": "Second Space",
  "pinyin": "er jian",
  "region": "index finger",
  "view": "front",
  "side": "right",
  "meridian": "LI",
  "loc": "微握拳，在第 2 掌指關節橈側遠端赤白肉際凹陷處。",
  "locEn": "With a loose fist, in the depression distal to the second metacarpophalangeal joint on its radial side, at the red-and-white skin border.",
  "locReview": "source_checked",
  "pos": [
   1.76,
   0.05,
   0.158
  ]
 },
 {
  "code": "LI3",
  "zh": "三間",
  "en": "Third Space",
  "pinyin": "san jian",
  "region": "hand",
  "view": "front",
  "side": "right",
  "meridian": "LI",
  "loc": "微握拳，在第 2 掌指關節橈側近端凹陷中。",
  "locEn": "With a loose fist, in the depression proximal to the second metacarpophalangeal joint on its radial side.",
  "locReview": "source_checked",
  "pos": [
   1.76,
   0.081,
   0.136
  ]
 },
 {
  "code": "LI4",
  "zh": "合谷",
  "en": "Union Valley",
  "pinyin": "he gu",
  "region": "hand",
  "view": "front",
  "side": "right",
  "meridian": "LI",
  "loc": "在手背，第 1、2 掌骨之間，當第 2 掌骨橈側的中點處。",
  "locEn": "On the dorsum of the hand between the first and second metacarpals, at the radial midpoint of the second metacarpal.",
  "locReview": "source_checked",
  "pos": [
   1.72,
   0.139,
   0.106
  ]
 },
 {
  "code": "LI5",
  "zh": "陽谿",
  "en": "Yang Ravine",
  "pinyin": "yang xi",
  "region": "wrist",
  "view": "front",
  "side": "right",
  "meridian": "LI",
  "loc": "在腕背橈側，橈骨莖突遠端，拇指向上翹起時，拇短伸肌腱與拇長伸肌腱之間的凹陷中。",
  "locEn": "On the radial dorsal wrist, distal to the radial styloid, in the \"snuffbox\" hollow between the tendons of extensor pollicis brevis and longus when the thumb is raised.",
  "locReview": "source_checked",
  "pos": [
   1.64,
   0.254,
   0.074
  ]
 },
 {
  "code": "LI6",
  "zh": "偏歷",
  "en": "Veering Passage",
  "pinyin": "pian li",
  "region": "forearm",
  "view": "front",
  "side": "right",
  "meridian": "LI",
  "loc": "在前臂，陽谿與曲池連線上，腕背側遠端橫紋上 3 寸。",
  "locEn": "On the LI5–LI11 line, 3 cun above the dorsal wrist crease.",
  "locReview": "source_checked",
  "pos": [
   1.48,
   0.471,
   0.071
  ]
 },
 {
  "code": "LI7",
  "zh": "溫溜",
  "en": "Warm Dwelling",
  "pinyin": "wen liu",
  "region": "forearm",
  "view": "front",
  "side": "right",
  "meridian": "LI",
  "loc": "在前臂，陽谿與曲池連線上，腕背側遠端橫紋上 5 寸。",
  "locEn": "On the LI5–LI11 line, 5 cun above the dorsal wrist crease.",
  "locReview": "source_checked",
  "pos": [
   1.4,
   0.594,
   0.057
  ]
 },
 {
  "code": "LI8",
  "zh": "下廉",
  "en": "Lower Ridge",
  "pinyin": "xia lian",
  "region": "forearm",
  "view": "front",
  "side": "right",
  "meridian": "LI",
  "loc": "在前臂背面橈側，陽谿與曲池連線上，肘橫紋下 4 寸。",
  "locEn": "On the radial dorsal forearm, on the LI5–LI11 line, 4 cun below the cubital crease.",
  "locReview": "source_checked",
  "pos": [
   1.28,
   0.78,
   0.052
  ]
 },
 {
  "code": "LI9",
  "zh": "上廉",
  "en": "Upper Ridge",
  "pinyin": "shang lian",
  "region": "forearm",
  "view": "front",
  "side": "right",
  "meridian": "LI",
  "loc": "在前臂背面橈側，陽谿與曲池連線上，肘橫紋下 3 寸。",
  "locEn": "On the radial dorsal forearm, on the LI5–LI11 line, 3 cun below the cubital crease.",
  "locReview": "source_checked",
  "pos": [
   1.24,
   0.842,
   0.051
  ]
 },
 {
  "code": "LI10",
  "zh": "手三里",
  "en": "Arm Three Li",
  "pinyin": "shou san li",
  "region": "forearm",
  "view": "front",
  "side": "right",
  "meridian": "LI",
  "loc": "在前臂背面橈側，陽谿與曲池連線上，肘橫紋下 2 寸。",
  "locEn": "On the radial dorsal forearm, on the LI5–LI11 line, 2 cun below the cubital crease.",
  "locReview": "source_checked",
  "pos": [
   1.2,
   0.914,
   0.05
  ]
 },
 {
  "code": "LI11",
  "zh": "曲池",
  "en": "Pool at the Bend",
  "pinyin": "qu chi",
  "region": "elbow",
  "view": "front",
  "side": "right",
  "meridian": "LI",
  "loc": "在肘區，尺澤（LU5）與肱骨外上髁連線的中點處；屈肘成直角時肘彎橫紋盡頭處。",
  "locEn": "At the elbow, midway between LU5 and the lateral epicondyle of the humerus — at the lateral end of the cubital crease with the elbow flexed to a right angle.",
  "locReview": "source_checked",
  "pos": [
   1.16,
   1.073,
   0.07
  ]
 },
 {
  "code": "LI12",
  "zh": "肘髎",
  "en": "Elbow Bone-Hole",
  "pinyin": "zhou liao",
  "region": "elbow",
  "view": "front",
  "side": "right",
  "meridian": "LI",
  "loc": "在肘區，肱骨外上髁上緣，曲池上 1 寸，肱骨邊緣處。",
  "locEn": "At the elbow, on the upper border of the lateral epicondyle, 1 cun above LI11 at the edge of the humerus.",
  "locReview": "source_checked",
  "pos": [
   1.16,
   1.171,
   0.075
  ]
 },
 {
  "code": "LI13",
  "zh": "手五里",
  "en": "Arm Five Li",
  "pinyin": "shou wu li",
  "region": "upper arm",
  "view": "front",
  "side": "right",
  "meridian": "LI",
  "loc": "在臂外側，曲池與肩髃連線，曲池上 3 寸處。",
  "locEn": "On the lateral upper arm, on the LI11–LI15 line, 3 cun above LI11.",
  "locReview": "source_checked",
  "pos": [
   1.08,
   1.368,
   0.097
  ]
 },
 {
  "code": "LI14",
  "zh": "臂臑",
  "en": "Upper Arm",
  "pinyin": "bi nao",
  "region": "upper arm",
  "view": "front",
  "side": "right",
  "meridian": "LI",
  "loc": "在臂外側，三角肌止點處，曲池與肩髃連線，曲池上 7 寸。",
  "locEn": "On the lateral upper arm at the deltoid insertion, on the LI11–LI15 line, 7 cun above LI11.",
  "locReview": "source_checked",
  "pos": [
   1.0,
   1.76,
   0.042
  ]
 },
 {
  "code": "LI15",
  "zh": "肩髃",
  "en": "Shoulder Bone",
  "pinyin": "jian yu",
  "region": "shoulder",
  "view": "front",
  "side": "right",
  "meridian": "LI",
  "loc": "在肩部，三角肌上，臂外展或向前平伸時，肩峰前下方凹陷處。",
  "locEn": "On the shoulder above the deltoid — the anterior-inferior hollow of the acromion when the arm is raised.",
  "locReview": "source_checked",
  "pos": [
   0.88,
   2.179,
   0.026
  ]
 },
 {
  "code": "LI16",
  "zh": "巨骨",
  "en": "Great Bone",
  "pinyin": "ju gu",
  "region": "shoulder",
  "view": "front",
  "side": "right",
  "meridian": "LI",
  "loc": "在肩上部，鎖骨肩峰端與肩胛岡之間凹陷處。",
  "locEn": "On the upper shoulder, in the depression between the acromial end of the clavicle and the scapular spine.",
  "locReview": "source_checked",
  "pos": [
   0.56,
   2.36,
   0.145
  ]
 },
 {
  "code": "LI17",
  "zh": "天鼎",
  "en": "Celestial Vessel",
  "pinyin": "tian ding",
  "region": "neck",
  "view": "front",
  "side": "right",
  "meridian": "LI",
  "loc": "在頸外側部，胸鎖乳突肌後緣，扶突穴與缺盆穴連線的中點。",
  "locEn": "On the lateral neck at the posterior border of sternocleidomastoid, midway between LI18 and ST12.",
  "locReview": "source_checked",
  "pos": [
   0.2,
   2.535,
   0.081
  ]
 },
 {
  "code": "LI18",
  "zh": "扶突",
  "en": "Protuberance Assistant",
  "pinyin": "fu tu",
  "region": "neck",
  "view": "front",
  "side": "right",
  "meridian": "LI",
  "loc": "在頸部，胸鎖乳突肌前緣，結喉旁，橫平喉結。",
  "locEn": "On the neck at the anterior border of sternocleidomastoid, level with the laryngeal prominence.",
  "locReview": "source_checked",
  "pos": [
   0.12,
   2.673,
   0.219
  ]
 },
 {
  "code": "LI19",
  "zh": "口禾髎",
  "en": "Mouth Grain Bone-Hole",
  "pinyin": "kou he liao",
  "region": "face",
  "view": "front",
  "side": "right",
  "meridian": "LI",
  "loc": "在面部，上唇外側，鼻孔外緣直下，水溝（人中）旁開 0.5 寸。",
  "locEn": "On the face lateral to the upper lip, directly below the outer nostril edge, 0.5 cun lateral to the philtrum midline.",
  "locReview": "source_checked",
  "pos": [
   0.04,
   2.981,
   0.486
  ]
 },
 {
  "code": "LI20",
  "zh": "迎香",
  "en": "Welcome Fragrance",
  "pinyin": "ying xiang",
  "region": "face",
  "view": "front",
  "side": "right",
  "meridian": "LI",
  "loc": "在面部，鼻翼外緣中點旁，鼻唇溝中。",
  "locEn": "On the face beside the midpoint of the outer ala of the nose, in the nasolabial groove.",
  "locReview": "source_checked",
  "pos": [
   0.16,
   2.992,
   0.355
  ]
 },
 {
  "code": "ST1",
  "zh": "承泣",
  "en": "Tear Container",
  "pinyin": "cheng qi",
  "region": "face",
  "view": "front",
  "side": "left",
  "meridian": "ST",
  "loc": "在面部，眼球與眶下緣之間，瞳孔直下。",
  "locEn": "On the face between the eyeball and the infraorbital ridge, directly below the pupil.",
  "locReview": "source_checked",
  "pos": [
   -0.16,
   3.097,
   0.352
  ]
 },
 {
  "code": "ST2",
  "zh": "四白",
  "en": "Four Whites",
  "pinyin": "si bai",
  "region": "face",
  "view": "front",
  "side": "left",
  "meridian": "ST",
  "loc": "在面部，眶下孔凹陷處，瞳孔直下。",
  "locEn": "On the face in the depression at the infraorbital foramen, directly below the pupil.",
  "locReview": "source_checked",
  "pos": [
   -0.16,
   3.036,
   0.349
  ]
 },
 {
  "code": "ST3",
  "zh": "巨髎",
  "en": "Great Crevice",
  "pinyin": "ju liao",
  "region": "face",
  "view": "front",
  "side": "left",
  "meridian": "ST",
  "loc": "在面部，瞳孔直下，平鼻翼下緣處，當鼻唇溝外側。",
  "locEn": "On the face directly below the pupil, level with the lower border of the ala of the nose, lateral to the nasolabial groove.",
  "locReview": "source_checked",
  "pos": [
   -0.16,
   2.998,
   0.355
  ]
 },
 {
  "code": "ST4",
  "zh": "地倉",
  "en": "Earth Granary",
  "pinyin": "di cang",
  "region": "face",
  "view": "front",
  "side": "left",
  "meridian": "ST",
  "loc": "在面部，口角外側，上直瞳孔，旁開約 0.4 寸（指寸）。",
  "locEn": "On the face lateral to the corner of the mouth (about 0.4 finger-cun), directly below the pupil.",
  "locReview": "source_checked",
  "pos": [
   -0.2,
   2.922,
   0.319
  ]
 },
 {
  "code": "ST5",
  "zh": "大迎",
  "en": "Great Reception",
  "pinyin": "da ying",
  "region": "jaw",
  "view": "front",
  "side": "left",
  "meridian": "ST",
  "loc": "在面頰部，下頜角前方，咬肌附著部的前緣，面動脈搏動處。",
  "locEn": "On the cheek anterior to the mandibular angle, at the front border of the masseter attachment, at the facial artery pulse.",
  "locReview": "source_checked",
  "pos": [
   -0.16,
   2.634,
   0.154
  ]
 },
 {
  "code": "ST6",
  "zh": "頰車",
  "en": "Jawbone",
  "pinyin": "jia che",
  "region": "jaw",
  "view": "front",
  "side": "left",
  "meridian": "ST",
  "loc": "在面頰部，下頜角前上方約一橫指（中指），咬緊牙時咬肌隆起的最高處。",
  "locEn": "On the cheek about one middle-finger-breadth antero-superior to the mandibular angle — the highest bulge of the masseter when the teeth are clenched.",
  "locReview": "source_checked",
  "pos": [
   -0.16,
   2.704,
   0.277
  ]
 },
 {
  "code": "ST7",
  "zh": "下關",
  "en": "Below the Joint",
  "pinyin": "xia guan",
  "region": "face",
  "view": "front",
  "side": "left",
  "meridian": "ST",
  "loc": "在面部，顴弓下緣中央與下頜切跡之間的凹陷中；閉口取穴。",
  "locEn": "On the face in the depression between the midpoint of the lower zygomatic arch and the mandibular notch; located with the mouth closed.",
  "locReview": "source_checked",
  "pos": [
   -0.28,
   2.987,
   0.26
  ]
 },
 {
  "code": "ST8",
  "zh": "頭維",
  "en": "Head Corner",
  "pinyin": "tou wei",
  "region": "head",
  "view": "front",
  "side": "left",
  "meridian": "ST",
  "loc": "在頭側部，額角髮際直上 0.5 寸，頭正中線旁開 4.5 寸。",
  "locEn": "On the side of the head, 0.5 cun above the corner of the forehead hairline, 4.5 cun lateral to the head midline.",
  "locReview": "source_checked",
  "pos": [
   -0.28,
   3.353,
   0.026
  ]
 },
 {
  "code": "ST9",
  "zh": "人迎",
  "en": "Man’s Welcome",
  "pinyin": "ren ying",
  "region": "neck",
  "view": "front",
  "side": "left",
  "meridian": "ST",
  "loc": "在頸部，橫平喉結，胸鎖乳突肌前緣，頸總動脈搏動處。",
  "locEn": "On the neck level with the laryngeal prominence, at the anterior border of sternocleidomastoid, at the common carotid pulse.",
  "locReview": "source_checked",
  "pos": [
   -0.12,
   2.673,
   0.219
  ]
 },
 {
  "code": "ST10",
  "zh": "水突",
  "en": "Water Prominence",
  "pinyin": "shui tu",
  "region": "neck",
  "view": "front",
  "side": "left",
  "meridian": "ST",
  "loc": "在頸部，胸鎖乳突肌前緣，人迎與氣舍連線的中點。",
  "locEn": "On the neck at the anterior border of sternocleidomastoid, midway between ST9 and ST11.",
  "locReview": "source_checked",
  "pos": [
   -0.12,
   2.535,
   0.152
  ]
 },
 {
  "code": "ST11",
  "zh": "氣舍",
  "en": "Qi Abode",
  "pinyin": "qi she",
  "region": "neck",
  "view": "front",
  "side": "left",
  "meridian": "ST",
  "loc": "在頸部，鎖骨內側端上緣，胸鎖乳突肌的胸骨頭與鎖骨頭之間凹陷中。",
  "locEn": "On the neck at the upper border of the medial clavicle, in the depression between the sternal and clavicular heads of sternocleidomastoid.",
  "locReview": "source_checked",
  "pos": [
   -0.12,
   2.368,
   0.231
  ]
 },
 {
  "code": "ST12",
  "zh": "缺盆",
  "en": "Empty Basin",
  "pinyin": "que pen",
  "region": "clavicle",
  "view": "front",
  "side": "left",
  "meridian": "ST",
  "loc": "在鎖骨上窩中央，前正中線旁開 4 寸。",
  "locEn": "In the centre of the supraclavicular fossa, 4 cun lateral to the anterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.52,
   2.368,
   0.15
  ]
 },
 {
  "code": "ST13",
  "zh": "氣戶",
  "en": "Qi Door",
  "pinyin": "qi hu",
  "region": "chest",
  "view": "front",
  "side": "left",
  "meridian": "ST",
  "loc": "在胸部，鎖骨下緣，前正中線旁開 4 寸。",
  "locEn": "On the chest at the lower border of the clavicle, 4 cun lateral to the anterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.52,
   2.328,
   0.15
  ]
 },
 {
  "code": "ST14",
  "zh": "庫房",
  "en": "Storehouse",
  "pinyin": "ku fang",
  "region": "chest",
  "view": "front",
  "side": "left",
  "meridian": "ST",
  "loc": "在胸部，第 1 肋間隙，前正中線旁開 4 寸。",
  "locEn": "On the chest in the first intercostal space, 4 cun lateral to the anterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.52,
   2.184,
   0.243
  ]
 },
 {
  "code": "ST15",
  "zh": "屋翳",
  "en": "Roof Screen",
  "pinyin": "wu yi",
  "region": "chest",
  "view": "front",
  "side": "left",
  "meridian": "ST",
  "loc": "在胸部，第 2 肋間隙，前正中線旁開 4 寸。",
  "locEn": "On the chest in the second intercostal space, 4 cun lateral to the anterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.52,
   2.043,
   0.314
  ]
 },
 {
  "code": "ST16",
  "zh": "膺窗",
  "en": "Breast Window",
  "pinyin": "ying chuang",
  "region": "chest",
  "view": "front",
  "side": "left",
  "meridian": "ST",
  "loc": "在胸部，第 3 肋間隙，前正中線旁開 4 寸。",
  "locEn": "On the chest in the third intercostal space, 4 cun lateral to the anterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.52,
   1.901,
   0.401
  ]
 },
 {
  "code": "ST17",
  "zh": "乳中",
  "en": "Breast Centre",
  "pinyin": "ru zhong",
  "region": "chest",
  "view": "front",
  "side": "left",
  "meridian": "ST",
  "loc": "在胸部，乳頭中央，平第 4 肋間隙，前正中線旁開 4 寸。",
  "locEn": "On the chest at the centre of the nipple, level with the fourth intercostal space, 4 cun lateral to the anterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.52,
   1.76,
   0.424
  ]
 },
 {
  "code": "ST18",
  "zh": "乳根",
  "en": "Breast Root",
  "pinyin": "ru gen",
  "region": "chest",
  "view": "front",
  "side": "left",
  "meridian": "ST",
  "loc": "在胸部，第 5 肋間隙，乳頭直下，前正中線旁開 4 寸。",
  "locEn": "On the chest in the fifth intercostal space, directly below the nipple, 4 cun lateral to the anterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.52,
   1.618,
   0.378
  ]
 },
 {
  "code": "ST19",
  "zh": "不容",
  "en": "Not Contained",
  "pinyin": "bu rong",
  "region": "abdomen",
  "view": "front",
  "side": "left",
  "meridian": "ST",
  "loc": "在上腹部，臍中上 6 寸，前正中線旁開 2 寸。",
  "locEn": "On the upper abdomen, 6 cun above the umbilicus, 2 cun lateral to the anterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.28,
   1.312,
   0.502
  ]
 },
 {
  "code": "ST20",
  "zh": "承滿",
  "en": "Assuming Fullness",
  "pinyin": "cheng man",
  "region": "abdomen",
  "view": "front",
  "side": "left",
  "meridian": "ST",
  "loc": "在上腹部，臍中上 5 寸，前正中線旁開 2 寸。",
  "locEn": "On the upper abdomen, 5 cun above the umbilicus, 2 cun lateral to the anterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.28,
   1.222,
   0.504
  ]
 },
 {
  "code": "ST21",
  "zh": "梁門",
  "en": "Beam Gate",
  "pinyin": "liang men",
  "region": "abdomen",
  "view": "front",
  "side": "left",
  "meridian": "ST",
  "loc": "在上腹部，臍中上 4 寸，前正中線旁開 2 寸。",
  "locEn": "On the upper abdomen, 4 cun above the umbilicus, 2 cun lateral to the anterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.28,
   1.131,
   0.506
  ]
 },
 {
  "code": "ST22",
  "zh": "關門",
  "en": "Pass Gate",
  "pinyin": "guan men",
  "region": "abdomen",
  "view": "front",
  "side": "left",
  "meridian": "ST",
  "loc": "在上腹部，臍中上 3 寸，前正中線旁開 2 寸。",
  "locEn": "On the upper abdomen, 3 cun above the umbilicus, 2 cun lateral to the anterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.28,
   1.041,
   0.507
  ]
 },
 {
  "code": "ST23",
  "zh": "太乙",
  "en": "Supreme Unity",
  "pinyin": "tai yi",
  "region": "abdomen",
  "view": "front",
  "side": "left",
  "meridian": "ST",
  "loc": "在上腹部，臍中上 2 寸，前正中線旁開 2 寸。",
  "locEn": "On the upper abdomen, 2 cun above the umbilicus, 2 cun lateral to the anterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.28,
   0.951,
   0.502
  ]
 },
 {
  "code": "ST24",
  "zh": "滑肉門",
  "en": "Slippery Flesh Gate",
  "pinyin": "hua rou men",
  "region": "abdomen",
  "view": "front",
  "side": "left",
  "meridian": "ST",
  "loc": "在上腹部，臍中上 1 寸，前正中線旁開 2 寸。",
  "locEn": "On the upper abdomen, 1 cun above the umbilicus, 2 cun lateral to the anterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.28,
   0.86,
   0.502
  ]
 },
 {
  "code": "ST25",
  "zh": "天樞",
  "en": "Celestial Pivot",
  "pinyin": "tian shu",
  "region": "abdomen",
  "view": "front",
  "side": "left",
  "meridian": "ST",
  "loc": "在腹部，橫平臍中，前正中線旁開 2 寸。",
  "locEn": "On the abdomen level with the centre of the umbilicus, 2 cun lateral to the anterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.28,
   0.77,
   0.507
  ]
 },
 {
  "code": "ST26",
  "zh": "外陵",
  "en": "Outer Mound",
  "pinyin": "wai ling",
  "region": "abdomen",
  "view": "front",
  "side": "left",
  "meridian": "ST",
  "loc": "在下腹部，臍中下 1 寸，前正中線旁開 2 寸。",
  "locEn": "On the lower abdomen, 1 cun below the umbilicus, 2 cun lateral to the anterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.28,
   0.592,
   0.489
  ]
 },
 {
  "code": "ST27",
  "zh": "大巨",
  "en": "Great Gigantic",
  "pinyin": "da ju",
  "region": "abdomen",
  "view": "front",
  "side": "left",
  "meridian": "ST",
  "loc": "在下腹部，臍中下 2 寸，前正中線旁開 2 寸。",
  "locEn": "On the lower abdomen, 2 cun below the umbilicus, 2 cun lateral to the anterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.28,
   0.414,
   0.449
  ]
 },
 {
  "code": "ST28",
  "zh": "水道",
  "en": "Waterway",
  "pinyin": "shui dao",
  "region": "abdomen",
  "view": "front",
  "side": "left",
  "meridian": "ST",
  "loc": "在下腹部，臍中下 3 寸，前正中線旁開 2 寸。",
  "locEn": "On the lower abdomen, 3 cun below the umbilicus, 2 cun lateral to the anterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.28,
   0.236,
   0.404
  ]
 },
 {
  "code": "ST29",
  "zh": "歸來",
  "en": "Return",
  "pinyin": "gui lai",
  "region": "abdomen",
  "view": "front",
  "side": "left",
  "meridian": "ST",
  "loc": "在下腹部，臍中下 4 寸，前正中線旁開 2 寸。",
  "locEn": "On the lower abdomen, 4 cun below the umbilicus, 2 cun lateral to the anterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.28,
   0.058,
   0.354
  ]
 },
 {
  "code": "ST30",
  "zh": "氣衝",
  "en": "Qi Thoroughfare",
  "pinyin": "qi chong",
  "region": "groin",
  "view": "front",
  "side": "left",
  "meridian": "ST",
  "loc": "在腹股溝區，恥骨聯合上緣，前正中線旁開 2 寸，動脈搏動處。",
  "locEn": "In the groin at the upper border of the pubic symphysis, 2 cun lateral to the anterior midline, at the arterial pulse.",
  "locReview": "source_checked",
  "pos": [
   -0.28,
   -0.12,
   0.344
  ]
 },
 {
  "code": "ST31",
  "zh": "髀關",
  "en": "Thigh Joint",
  "pinyin": "bi guan",
  "region": "thigh",
  "view": "front",
  "side": "left",
  "meridian": "ST",
  "loc": "在股前區，髂前上棘與髕底外側端連線上，屈髖時平會陰的凹陷處。",
  "locEn": "On the front of the thigh, on the line from the anterior superior iliac spine to the lateral patella base — in the hollow level with the perineum when the hip is flexed.",
  "locReview": "source_checked",
  "pos": [
   -0.44,
   -0.313,
   0.381
  ]
 },
 {
  "code": "ST32",
  "zh": "伏兔",
  "en": "Crouching Rabbit",
  "pinyin": "fu tu",
  "region": "thigh",
  "view": "front",
  "side": "left",
  "meridian": "ST",
  "loc": "在股前區，髂前上棘與髕底外側端連線上，髕底上 6 寸。",
  "locEn": "On the front of the thigh, on the same line, 6 cun above the patella base.",
  "locReview": "source_checked",
  "pos": [
   -0.52,
   -1.069,
   0.286
  ]
 },
 {
  "code": "ST33",
  "zh": "陰市",
  "en": "Yin Market",
  "pinyin": "yin shi",
  "region": "thigh",
  "view": "front",
  "side": "left",
  "meridian": "ST",
  "loc": "在股前區，髂前上棘與髕底外側端連線上，髕底上 3 寸。",
  "locEn": "On the front of the thigh, on the same line, 3 cun above the patella base.",
  "locReview": "source_checked",
  "pos": [
   -0.52,
   -1.263,
   0.248
  ]
 },
 {
  "code": "ST34",
  "zh": "梁丘",
  "en": "Beam Hill",
  "pinyin": "liang qiu",
  "region": "thigh",
  "view": "front",
  "side": "left",
  "meridian": "ST",
  "loc": "在股前區，髂前上棘與髕底外側端連線上，髕底上 2 寸。",
  "locEn": "On the front of the thigh, on the same line, 2 cun above the patella base.",
  "locReview": "source_checked",
  "pos": [
   -0.52,
   -1.328,
   0.212
  ]
 },
 {
  "code": "ST35",
  "zh": "犢鼻",
  "en": "Calf’s Nose",
  "pinyin": "du bi",
  "region": "knee",
  "view": "front",
  "side": "left",
  "meridian": "ST",
  "loc": "在膝前區，屈膝時髕韌帶外側凹陷中（外膝眼）。",
  "locEn": "At the front of the knee, in the hollow lateral to the patellar ligament with the knee flexed (the outer knee-eye).",
  "locReview": "source_checked",
  "pos": [
   -0.56,
   -1.585,
   0.079
  ]
 },
 {
  "code": "ST36",
  "zh": "足三里",
  "en": "Leg Three Li",
  "pinyin": "zu san li",
  "region": "lower leg",
  "view": "front",
  "side": "left",
  "meridian": "ST",
  "loc": "在小腿前外側，犢鼻（外膝眼）下 3 寸，距脛骨前緣一橫指（中指）。",
  "locEn": "On the antero-lateral lower leg, 3 cun below ST35 (the outer knee-eye), one middle-finger-breadth lateral to the anterior border of the tibia.",
  "locReview": "source_checked",
  "pos": [
   -0.6,
   -1.823,
   0.006
  ]
 },
 {
  "code": "ST37",
  "zh": "上巨虛",
  "en": "Upper Great Hollow",
  "pinyin": "shang ju xu",
  "region": "lower leg",
  "view": "front",
  "side": "left",
  "meridian": "ST",
  "loc": "在小腿前外側，犢鼻下 6 寸，距脛骨前緣一橫指（中指）。",
  "locEn": "On the antero-lateral lower leg, 6 cun below ST35, one middle-finger-breadth lateral to the anterior tibial border.",
  "locReview": "source_checked",
  "pos": [
   -0.64,
   -2.06,
   -0.051
  ]
 },
 {
  "code": "ST38",
  "zh": "條口",
  "en": "Ribbon Opening",
  "pinyin": "tiao kou",
  "region": "lower leg",
  "view": "front",
  "side": "left",
  "meridian": "ST",
  "loc": "在小腿前外側，犢鼻下 8 寸，距脛骨前緣一橫指（中指）。",
  "locEn": "On the antero-lateral lower leg, 8 cun below ST35, one middle-finger-breadth lateral to the anterior tibial border.",
  "locReview": "source_checked",
  "pos": [
   -0.68,
   -2.219,
   -0.089
  ]
 },
 {
  "code": "ST39",
  "zh": "下巨虛",
  "en": "Lower Great Hollow",
  "pinyin": "xia ju xu",
  "region": "lower leg",
  "view": "front",
  "side": "left",
  "meridian": "ST",
  "loc": "在小腿前外側，犢鼻下 9 寸，距脛骨前緣一橫指（中指）。",
  "locEn": "On the antero-lateral lower leg, 9 cun below ST35, one middle-finger-breadth lateral to the anterior tibial border.",
  "locReview": "source_checked",
  "pos": [
   -0.68,
   -2.298,
   -0.121
  ]
 },
 {
  "code": "ST40",
  "zh": "豐隆",
  "en": "Abundant Bulge",
  "pinyin": "feng long",
  "region": "lower leg",
  "view": "front",
  "side": "left",
  "meridian": "ST",
  "loc": "在小腿前外側，外踝尖上 8 寸，脛骨前嵴外 2 橫指（中指），條口外一橫指。",
  "locEn": "On the antero-lateral lower leg, 8 cun above the tip of the lateral malleolus, two middle-finger-breadths lateral to the anterior tibial crest (one finger-breadth lateral to ST38).",
  "locReview": "source_checked",
  "pos": [
   -0.64,
   -2.175,
   -0.098
  ]
 },
 {
  "code": "ST41",
  "zh": "解溪",
  "en": "Stream Divide",
  "pinyin": "jie xi",
  "region": "ankle",
  "view": "front",
  "side": "left",
  "meridian": "ST",
  "loc": "在踝區，踝關節前面中央凹陷中，拇長伸肌腱與趾長伸肌腱之間。",
  "locEn": "At the front-centre hollow of the ankle joint, between the tendons of extensor hallucis longus and extensor digitorum longus.",
  "locReview": "source_checked",
  "pos": [
   -0.76,
   -2.845,
   -0.105
  ]
 },
 {
  "code": "ST42",
  "zh": "衝陽",
  "en": "Surging Yang",
  "pinyin": "chong yang",
  "region": "foot",
  "view": "front",
  "side": "left",
  "meridian": "ST",
  "loc": "在足背最高處，第 2 跖骨基底部與中間楔狀骨關節處，足背動脈搏動處。",
  "locEn": "At the high point of the dorsum of the foot, at the joint of the second metatarsal base and intermediate cuneiform, at the dorsalis pedis pulse.",
  "locReview": "source_checked",
  "pos": [
   -0.76,
   -2.944,
   0.008
  ]
 },
 {
  "code": "ST43",
  "zh": "陷谷",
  "en": "Sunken Valley",
  "pinyin": "xian gu",
  "region": "foot",
  "view": "front",
  "side": "left",
  "meridian": "ST",
  "loc": "在足背，第 2、3 跖骨間，第 2 跖趾關節近端凹陷中。",
  "locEn": "On the dorsum of the foot between the second and third metatarsals, in the depression proximal to the second metatarsophalangeal joint.",
  "locReview": "source_checked",
  "pos": [
   -0.76,
   -3.05,
   0.193
  ]
 },
 {
  "code": "ST44",
  "zh": "內庭",
  "en": "Inner Court",
  "pinyin": "nei ting",
  "region": "foot",
  "view": "front",
  "side": "left",
  "meridian": "ST",
  "loc": "在足背，第 2、3 趾間，趾蹼緣後方赤白肉際處。",
  "locEn": "On the dorsum of the foot between the second and third toes, proximal to the web margin, at the red-and-white skin border.",
  "locReview": "source_checked",
  "pos": [
   -0.76,
   -3.05,
   0.193
  ]
 },
 {
  "code": "ST45",
  "zh": "厲兌",
  "en": "Severe Mouth",
  "pinyin": "li dui",
  "region": "toe",
  "view": "front",
  "side": "left",
  "meridian": "ST",
  "loc": "在足第 2 趾末節外側，距趾甲根角側後方 0.1 寸（指寸）。",
  "locEn": "On the lateral side of the distal second toe, 0.1 finger-cun proximal-lateral to the corner of the nail.",
  "locReview": "source_checked",
  "pos": [
   -0.76,
   -3.05,
   0.193
  ]
 },
 {
  "code": "SP1",
  "zh": "隱白",
  "en": "Hidden White",
  "pinyin": "yin bai",
  "region": "great toe",
  "view": "front",
  "side": "right",
  "meridian": "SP",
  "loc": "在足大趾末節內側，距趾甲角 0.1 寸（指寸）。",
  "locEn": "On the medial side of the distal segment of the great toe, 0.1 finger-cun from the corner of the nail.",
  "locReview": "source_checked",
  "pos": [
   0.76,
   -3.05,
   0.193
  ]
 },
 {
  "code": "SP2",
  "zh": "大都",
  "en": "Great Metropolis",
  "pinyin": "da du",
  "region": "foot",
  "view": "front",
  "side": "right",
  "meridian": "SP",
  "loc": "在足內側緣，當足大趾本節（第 1 蹠趾關節）前下方赤白肉際凹陷處。",
  "locEn": "On the medial border of the foot, in the depression distal and inferior to the first metatarsophalangeal joint, at the red-and-white skin border.",
  "locReview": "source_checked",
  "pos": [
   0.76,
   -3.05,
   0.193
  ]
 },
 {
  "code": "SP3",
  "zh": "太白",
  "en": "Supreme White",
  "pinyin": "tai bai",
  "region": "foot",
  "view": "front",
  "side": "right",
  "meridian": "SP",
  "loc": "在足內側緣，當足大趾本節（第 1 蹠趾關節）後下方赤白肉際凹陷處。",
  "locEn": "On the medial border of the foot, in the depression proximal and inferior to the first metatarsophalangeal joint, at the red-and-white skin border.",
  "locReview": "source_checked",
  "pos": [
   0.76,
   -3.05,
   0.193
  ]
 },
 {
  "code": "SP4",
  "zh": "公孫",
  "en": "Grandfather Grandson",
  "pinyin": "gong sun",
  "region": "foot",
  "view": "front",
  "side": "right",
  "meridian": "SP",
  "loc": "在足內側緣，當第 1 蹠骨基底的前下方。",
  "locEn": "On the medial border of the foot, antero-inferior to the base of the first metatarsal.",
  "locReview": "source_checked",
  "pos": [
   0.76,
   -3.021,
   0.073
  ]
 },
 {
  "code": "SP5",
  "zh": "商丘",
  "en": "Shang Hill",
  "pinyin": "shang qiu",
  "region": "ankle",
  "view": "front",
  "side": "right",
  "meridian": "SP",
  "loc": "在足內踝前下方凹陷中，當舟骨結節與內踝尖連線的中點處。",
  "locEn": "In the depression antero-inferior to the medial malleolus, midway between the navicular tuberosity and the tip of the medial malleolus.",
  "locReview": "source_checked",
  "pos": [
   0.76,
   -2.898,
   -0.058
  ]
 },
 {
  "code": "SP6",
  "zh": "三陰交",
  "en": "Three Yin Intersection",
  "pinyin": "san yin jiao",
  "region": "lower leg",
  "view": "front",
  "side": "right",
  "meridian": "SP",
  "loc": "在小腿內側，當內踝尖上 3 寸，脛骨內側緣後方。",
  "locEn": "On the medial lower leg, 3 cun above the tip of the medial malleolus, posterior to the medial border of the tibia.",
  "locReview": "source_checked",
  "pos": [
   0.72,
   -2.518,
   -0.158
  ]
 },
 {
  "code": "SP7",
  "zh": "漏谷",
  "en": "Leaking Valley",
  "pinyin": "lou gu",
  "region": "lower leg",
  "view": "front",
  "side": "right",
  "meridian": "SP",
  "loc": "在小腿內側，當內踝尖與陰陵泉的連線上，距內踝尖 6 寸，脛骨內側緣後方。",
  "locEn": "On the medial lower leg, on the line from the medial malleolus to SP9, 6 cun above the malleolus, posterior to the medial tibial border.",
  "locReview": "source_checked",
  "pos": [
   0.68,
   -2.226,
   -0.108
  ]
 },
 {
  "code": "SP8",
  "zh": "地機",
  "en": "Earth Foundation",
  "pinyin": "di ji",
  "region": "lower leg",
  "view": "front",
  "side": "right",
  "meridian": "SP",
  "loc": "在小腿內側，當內踝尖與陰陵泉的連線上，陰陵泉下 3 寸。",
  "locEn": "On the medial lower leg, 3 cun below SP9 on the line toward the medial malleolus.",
  "locReview": "source_checked",
  "pos": [
   0.6,
   -1.836,
   -0.006
  ]
 },
 {
  "code": "SP9",
  "zh": "陰陵泉",
  "en": "Yin Mound Spring",
  "pinyin": "yin ling quan",
  "region": "knee",
  "view": "front",
  "side": "right",
  "meridian": "SP",
  "loc": "在小腿內側，當脛骨內側髁後下方凹陷處。",
  "locEn": "On the medial lower leg, in the depression postero-inferior to the medial condyle of the tibia.",
  "locReview": "source_checked",
  "pos": [
   0.56,
   -1.593,
   0.079
  ]
 },
 {
  "code": "SP10",
  "zh": "血海",
  "en": "Sea of Blood",
  "pinyin": "xue hai",
  "region": "thigh",
  "view": "front",
  "side": "right",
  "meridian": "SP",
  "loc": "屈膝，在大腿內側，髕底內側端上 2 寸，當股四頭肌內側頭的隆起處。",
  "locEn": "With the knee flexed, on the medial thigh 2 cun above the medial end of the patella base, on the bulge of vastus medialis.",
  "locReview": "source_checked",
  "pos": [
   0.52,
   -1.33,
   0.212
  ]
 },
 {
  "code": "SP11",
  "zh": "箕門",
  "en": "Winnowing Basket Gate",
  "pinyin": "ji men",
  "region": "thigh",
  "view": "front",
  "side": "right",
  "meridian": "SP",
  "loc": "在股內側，髕底內側端與衝門（SP12）連線的上 1/3 與下 2/3 交點，長收肌與縫匠肌交角的動脈搏動處。",
  "locEn": "On the medial thigh, at the junction of the upper third and lower two-thirds of the line from the medial patella base to SP12, in the angle between adductor longus and sartorius.",
  "locReview": "source_checked",
  "pos": [
   0.48,
   -0.939,
   0.294
  ]
 },
 {
  "code": "SP12",
  "zh": "衝門",
  "en": "Rushing Gate",
  "pinyin": "chong men",
  "region": "groin",
  "view": "front",
  "side": "right",
  "meridian": "SP",
  "loc": "在腹股溝外側，距恥骨聯合上緣中點 3.5 寸，當髂外動脈搏動處的外側。",
  "locEn": "In the groin, 3.5 cun lateral to the midpoint of the upper border of the pubic symphysis, lateral to the arterial pulse.",
  "locReview": "source_checked",
  "pos": [
   0.48,
   -0.12,
   0.378
  ]
 },
 {
  "code": "SP13",
  "zh": "府舍",
  "en": "House Abode",
  "pinyin": "fu she",
  "region": "lower abdomen",
  "view": "front",
  "side": "right",
  "meridian": "SP",
  "loc": "在下腹部，當臍中下 4 寸，衝門上方 0.7 寸，距前正中線 4 寸。",
  "locEn": "On the lower abdomen, 4 cun below the umbilicus and 0.7 cun above SP12, 4 cun lateral to the anterior midline.",
  "locReview": "source_checked",
  "pos": [
   0.52,
   0.058,
   0.361
  ]
 },
 {
  "code": "SP14",
  "zh": "腹結",
  "en": "Abdomen Bind",
  "pinyin": "fu jie",
  "region": "lower abdomen",
  "view": "front",
  "side": "right",
  "meridian": "SP",
  "loc": "在下腹部，大橫下 1.3 寸，距前正中線 4 寸。",
  "locEn": "On the lower abdomen, 1.3 cun below SP15, 4 cun lateral to the anterior midline.",
  "locReview": "source_checked",
  "pos": [
   0.52,
   0.539,
   0.338
  ]
 },
 {
  "code": "SP15",
  "zh": "大橫",
  "en": "Great Horizontal",
  "pinyin": "da heng",
  "region": "abdomen",
  "view": "front",
  "side": "right",
  "meridian": "SP",
  "loc": "在腹中部，距臍中 4 寸。",
  "locEn": "On the mid-abdomen, 4 cun lateral to the centre of the umbilicus.",
  "locReview": "source_checked",
  "pos": [
   0.52,
   0.77,
   0.326
  ]
 },
 {
  "code": "SP16",
  "zh": "腹哀",
  "en": "Abdomen Sorrow",
  "pinyin": "fu ai",
  "region": "upper abdomen",
  "view": "front",
  "side": "right",
  "meridian": "SP",
  "loc": "在上腹部，當臍中上 3 寸，距前正中線 4 寸。",
  "locEn": "On the upper abdomen, 3 cun above the umbilicus, 4 cun lateral to the anterior midline.",
  "locReview": "source_checked",
  "pos": [
   0.52,
   1.041,
   0.316
  ]
 },
 {
  "code": "SP17",
  "zh": "食竇",
  "en": "Food Hole",
  "pinyin": "shi dou",
  "region": "chest",
  "view": "front",
  "side": "right",
  "meridian": "SP",
  "loc": "在胸外側部，當第 5 肋間隙，距前正中線 6 寸。",
  "locEn": "On the lateral chest, in the fifth intercostal space, 6 cun lateral to the anterior midline.",
  "locReview": "source_checked",
  "pos": [
   0.8,
   1.618,
   0.152
  ]
 },
 {
  "code": "SP18",
  "zh": "天溪",
  "en": "Heavenly Stream",
  "pinyin": "tian xi",
  "region": "chest",
  "view": "front",
  "side": "right",
  "meridian": "SP",
  "loc": "在胸外側部，當第 4 肋間隙，距前正中線 6 寸。",
  "locEn": "On the lateral chest, in the fourth intercostal space, 6 cun lateral to the anterior midline.",
  "locReview": "source_checked",
  "pos": [
   0.8,
   1.76,
   0.145
  ]
 },
 {
  "code": "SP19",
  "zh": "胸鄉",
  "en": "Chest Village",
  "pinyin": "xiong xiang",
  "region": "chest",
  "view": "front",
  "side": "right",
  "meridian": "SP",
  "loc": "在胸外側部，當第 3 肋間隙，距前正中線 6 寸。",
  "locEn": "On the lateral chest, in the third intercostal space, 6 cun lateral to the anterior midline.",
  "locReview": "source_checked",
  "pos": [
   0.8,
   1.901,
   0.149
  ]
 },
 {
  "code": "SP20",
  "zh": "周榮",
  "en": "Fullness of the Circumference",
  "pinyin": "zhou rong",
  "region": "chest",
  "view": "front",
  "side": "right",
  "meridian": "SP",
  "loc": "在胸外側部，當第 2 肋間隙，距前正中線 6 寸。",
  "locEn": "On the lateral chest, in the second intercostal space, 6 cun lateral to the anterior midline.",
  "locReview": "source_checked",
  "pos": [
   0.8,
   2.043,
   0.159
  ]
 },
 {
  "code": "SP21",
  "zh": "大包",
  "en": "Great Enveloping",
  "pinyin": "da bao",
  "region": "lateral chest",
  "view": "front",
  "side": "right",
  "meridian": "SP",
  "loc": "在側胸部，腋中線上，當第 6 肋間隙處。",
  "locEn": "On the lateral chest, on the mid-axillary line, in the sixth intercostal space.",
  "locReview": "source_checked",
  "pos": [
   0.92,
   1.476,
   0.162
  ]
 },
 {
  "code": "HT1",
  "zh": "極泉",
  "en": "Great Spring",
  "pinyin": "ji quan",
  "region": "axilla",
  "view": "front",
  "side": "right",
  "meridian": "HT",
  "loc": "在腋窩中央，腋動脈搏動處。",
  "locEn": "At the centre of the axilla, at the axillary arterial pulse.",
  "locReview": "source_checked",
  "pos": [
   0.96,
   1.956,
   -0.023
  ]
 },
 {
  "code": "HT2",
  "zh": "青靈",
  "en": "Green Spirit",
  "pinyin": "qing ling",
  "region": "upper arm",
  "view": "front",
  "side": "right",
  "meridian": "HT",
  "loc": "在臂內側，當極泉與少海的連線上，肘橫紋上 3 寸，肱二頭肌的內側溝中。",
  "locEn": "On the medial upper arm, on the HT1–HT3 line, 3 cun above the cubital crease, in the medial bicipital groove.",
  "locReview": "source_checked",
  "pos": [
   1.08,
   1.367,
   0.097
  ]
 },
 {
  "code": "HT3",
  "zh": "少海",
  "en": "Lesser Sea",
  "pinyin": "shao hai",
  "region": "elbow",
  "view": "front",
  "side": "right",
  "meridian": "HT",
  "loc": "屈肘，在肘橫紋內側端與肱骨內上髁連線的中點處。",
  "locEn": "With the elbow flexed, midway between the medial end of the cubital crease and the medial epicondyle of the humerus.",
  "locReview": "source_checked",
  "pos": [
   1.16,
   1.073,
   0.07
  ]
 },
 {
  "code": "HT4",
  "zh": "靈道",
  "en": "Spirit Path",
  "pinyin": "ling dao",
  "region": "forearm",
  "view": "front",
  "side": "right",
  "meridian": "HT",
  "loc": "在前臂掌側，當尺側腕屈肌腱的橈側緣，腕掌側遠端橫紋上 1.5 寸。",
  "locEn": "On the palmar forearm, at the radial border of the flexor carpi ulnaris tendon, 1.5 cun above the distal wrist crease.",
  "locReview": "source_checked",
  "pos": [
   1.56,
   0.377,
   0.065
  ]
 },
 {
  "code": "HT5",
  "zh": "通里",
  "en": "Connecting Inside",
  "pinyin": "tong li",
  "region": "forearm",
  "view": "front",
  "side": "right",
  "meridian": "HT",
  "loc": "在前臂掌側，當尺側腕屈肌腱的橈側緣，腕掌側遠端橫紋上 1 寸。",
  "locEn": "On the palmar forearm, at the radial border of the flexor carpi ulnaris tendon, 1 cun above the distal wrist crease.",
  "locReview": "source_checked",
  "pos": [
   1.6,
   0.346,
   0.057
  ]
 },
 {
  "code": "HT6",
  "zh": "陰郄",
  "en": "Yin Cleft",
  "pinyin": "yin xi",
  "region": "forearm",
  "view": "front",
  "side": "right",
  "meridian": "HT",
  "loc": "在前臂掌側，當尺側腕屈肌腱的橈側緣，腕掌側遠端橫紋上 0.5 寸。",
  "locEn": "On the palmar forearm, at the radial border of the flexor carpi ulnaris tendon, 0.5 cun above the distal wrist crease.",
  "locReview": "source_checked",
  "pos": [
   1.6,
   0.315,
   0.067
  ]
 },
 {
  "code": "HT7",
  "zh": "神門",
  "en": "Spirit Gate",
  "pinyin": "shen men",
  "region": "wrist",
  "view": "front",
  "side": "right",
  "meridian": "HT",
  "loc": "在腕部，腕掌側橫紋尺側端，尺側腕屈肌腱的橈側凹陷處。",
  "locEn": "At the wrist, at the ulnar end of the palmar wrist crease, in the depression radial to the flexor carpi ulnaris tendon.",
  "locReview": "source_checked",
  "pos": [
   1.64,
   0.284,
   0.069
  ]
 },
 {
  "code": "HT8",
  "zh": "少府",
  "en": "Lesser Palace",
  "pinyin": "shao fu",
  "region": "palm",
  "view": "front",
  "side": "right",
  "meridian": "HT",
  "loc": "在手掌面，第 4、5 掌骨之間，握拳時，當小指尖處。",
  "locEn": "On the palm, between the fourth and fifth metacarpals — where the tip of the little finger rests when a fist is made.",
  "locReview": "source_checked",
  "pos": [
   1.68,
   0.192,
   0.08
  ]
 },
 {
  "code": "HT9",
  "zh": "少沖",
  "en": "Lesser Surge",
  "pinyin": "shao chong",
  "region": "little finger",
  "view": "front",
  "side": "right",
  "meridian": "HT",
  "loc": "在手小指末節橈側，距指甲角 0.1 寸（指寸）。",
  "locEn": "On the radial side of the distal segment of the little finger, 0.1 finger-cun from the corner of the nail.",
  "locReview": "source_checked",
  "pos": [
   1.76,
   0.07,
   0.158
  ]
 },
 {
  "code": "SI1",
  "zh": "少澤",
  "en": "Lesser Marsh",
  "pinyin": "shao ze",
  "region": "little finger",
  "view": "front",
  "side": "left",
  "meridian": "SI",
  "loc": "在手指，小指末節尺側，指甲根角側上方 0.1 寸（指寸）。",
  "locEn": "On the little finger, ulnar side of the distal segment, 0.1 finger-cun from the corner of the nail.",
  "locReview": "source_checked",
  "pos": [
   -1.76,
   0.07,
   0.158
  ]
 },
 {
  "code": "SI2",
  "zh": "前谷",
  "en": "Front Valley",
  "pinyin": "qian gu",
  "region": "hand",
  "view": "front",
  "side": "left",
  "meridian": "SI",
  "loc": "在手指，第 5 掌指關節尺側遠端赤白肉際凹陷中。",
  "locEn": "On the ulnar side of the hand, distal to the 5th metacarpophalangeal joint at the red-and-white skin border.",
  "locReview": "source_checked",
  "pos": [
   -1.72,
   0.154,
   0.106
  ]
 },
 {
  "code": "SI3",
  "zh": "後溪",
  "en": "Back Stream",
  "pinyin": "hou xi",
  "region": "hand",
  "view": "front",
  "side": "left",
  "meridian": "SI",
  "loc": "在手內側，第 5 掌指關節尺側近端赤白肉際凹陷中（握拳取穴）。",
  "locEn": "On the ulnar side of the hand, proximal to the 5th metacarpophalangeal joint at the red-and-white skin border; located with a closed fist.",
  "locReview": "source_checked",
  "pos": [
   -1.68,
   0.194,
   0.08
  ]
 },
 {
  "code": "SI4",
  "zh": "腕骨",
  "en": "Wrist Bone",
  "pinyin": "wan gu",
  "region": "wrist",
  "view": "front",
  "side": "left",
  "meridian": "SI",
  "loc": "在腕區，第 5 掌骨基底與三角骨之間的赤白肉際凹陷處。",
  "locEn": "At the wrist, in the hollow between the base of the 5th metacarpal and the triquetral bone, at the red-and-white skin border.",
  "locReview": "source_checked",
  "pos": [
   -1.64,
   0.277,
   0.069
  ]
 },
 {
  "code": "SI5",
  "zh": "陽谷",
  "en": "Yang Valley",
  "pinyin": "yang gu",
  "region": "wrist",
  "view": "front",
  "side": "left",
  "meridian": "SI",
  "loc": "在腕後區，尺骨莖突與三角骨之間的凹陷中。",
  "locEn": "On the dorsal wrist, in the depression between the ulnar styloid and the triquetral bone.",
  "locReview": "source_checked",
  "pos": [
   -1.64,
   0.28,
   0.069
  ]
 },
 {
  "code": "SI6",
  "zh": "養老",
  "en": "Nourishing the Old",
  "pinyin": "yang lao",
  "region": "forearm",
  "view": "front",
  "side": "left",
  "meridian": "SI",
  "loc": "在前臂後區，腕背橫紋上 1 寸，尺骨頭橈側凹陷中（掌心向胸取穴）。",
  "locEn": "On the dorsal forearm, 1 cun above the dorsal wrist crease, in the depression radial to the head of the ulna; located with the palm facing the chest.",
  "locReview": "source_checked",
  "pos": [
   -1.6,
   0.346,
   0.057
  ]
 },
 {
  "code": "SI7",
  "zh": "支正",
  "en": "Branch of Uprightness",
  "pinyin": "zhi zheng",
  "region": "forearm",
  "view": "front",
  "side": "left",
  "meridian": "SI",
  "loc": "在前臂後區，陽谷與小海連線上，腕背橫紋上 5 寸，尺骨橈側與尺側腕屈肌之間。",
  "locEn": "On the dorsal forearm, on the SI5–SI8 line, 5 cun above the dorsal wrist crease, between the ulna and flexor carpi ulnaris.",
  "locReview": "source_checked",
  "pos": [
   -1.4,
   0.594,
   0.057
  ]
 },
 {
  "code": "SI8",
  "zh": "小海",
  "en": "Small Sea",
  "pinyin": "xiao hai",
  "region": "elbow",
  "view": "front",
  "side": "left",
  "meridian": "SI",
  "loc": "在肘後區，尺骨鷹嘴與肱骨內上髁之間凹陷中。",
  "locEn": "At the back of the elbow, in the hollow between the olecranon and the medial epicondyle of the humerus.",
  "locReview": "source_checked",
  "pos": [
   -1.16,
   1.073,
   0.07
  ]
 },
 {
  "code": "SI9",
  "zh": "肩貞",
  "en": "Shoulder Uprightness",
  "pinyin": "jian zhen",
  "region": "scapula",
  "view": "back",
  "side": "left",
  "meridian": "SI",
  "loc": "在肩胛區，肩關節後下方，腋後紋頭直上 1 寸。",
  "locEn": "On the scapular region, postero-inferior to the shoulder joint, 1 cun above the end of the posterior axillary fold.",
  "locReview": "source_checked",
  "pos": [
   -0.48,
   1.874,
   -0.522
  ]
 },
 {
  "code": "SI10",
  "zh": "臑俞",
  "en": "Upper Arm Shu",
  "pinyin": "nao shu",
  "region": "scapula",
  "view": "back",
  "side": "left",
  "meridian": "SI",
  "loc": "在肩胛區，腋後紋頭直上，肩胛岡下緣凹陷中。",
  "locEn": "On the scapular region, directly above the posterior axillary fold, in the depression below the scapular spine.",
  "locReview": "source_checked",
  "pos": [
   -0.48,
   1.92,
   -0.527
  ]
 },
 {
  "code": "SI11",
  "zh": "天宗",
  "en": "Heavenly Ancestor",
  "pinyin": "tian zong",
  "region": "scapula",
  "view": "back",
  "side": "left",
  "meridian": "SI",
  "loc": "在肩胛區，肩胛岡中點與肩胛骨下角連線上 1/3 與 2/3 交點凹陷中，肩胛岡下窩中央。",
  "locEn": "In the centre of the infraspinous fossa, at the junction of the upper third and lower two-thirds of the line from the midpoint of the scapular spine to the inferior angle.",
  "locReview": "source_checked",
  "pos": [
   -0.4,
   1.718,
   -0.489
  ]
 },
 {
  "code": "SI12",
  "zh": "秉風",
  "en": "Grasping the Wind",
  "pinyin": "bing feng",
  "region": "scapula",
  "view": "back",
  "side": "left",
  "meridian": "SI",
  "loc": "在肩胛區，天宗直上，肩胛岡中點上方岡上窩中。",
  "locEn": "In the supraspinous fossa, directly above SI11, above the midpoint of the scapular spine.",
  "locReview": "source_checked",
  "pos": [
   -0.4,
   2.032,
   -0.519
  ]
 },
 {
  "code": "SI13",
  "zh": "曲垣",
  "en": "Crooked Wall",
  "pinyin": "qu yuan",
  "region": "scapula",
  "view": "back",
  "side": "left",
  "meridian": "SI",
  "loc": "在肩胛區，肩胛岡上緣內側端凹陷中。",
  "locEn": "In the depression at the medial end of the upper border of the scapular spine.",
  "locReview": "source_checked",
  "pos": [
   -0.32,
   2.051,
   -0.509
  ]
 },
 {
  "code": "SI14",
  "zh": "肩外俞",
  "en": "Outer Shoulder Shu",
  "pinyin": "jian wai shu",
  "region": "upper back",
  "view": "back",
  "side": "left",
  "meridian": "SI",
  "loc": "在脊柱區，第 1 胸椎棘突下，後正中線旁開 3 寸（兩手抱肩取穴）。",
  "locEn": "Below the spinous process of T1, 3 cun lateral to the posterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.4,
   2.394,
   -0.36
  ]
 },
 {
  "code": "SI15",
  "zh": "肩中俞",
  "en": "Middle Shoulder Shu",
  "pinyin": "jian zhong shu",
  "region": "upper back",
  "view": "back",
  "side": "left",
  "meridian": "SI",
  "loc": "在脊柱區，第 7 頸椎棘突下，後正中線旁開 2 寸（兩手抱肩取穴）。",
  "locEn": "Below the spinous process of C7, 2 cun lateral to the posterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.28,
   2.489,
   -0.308
  ]
 },
 {
  "code": "SI16",
  "zh": "天窗",
  "en": "Heavenly Window",
  "pinyin": "tian chuang",
  "region": "neck",
  "view": "front",
  "side": "left",
  "meridian": "SI",
  "loc": "在頸部，橫平喉結，胸鎖乳突肌的後緣。",
  "locEn": "On the neck, level with the laryngeal prominence, at the posterior border of sternocleidomastoid.",
  "locReview": "source_checked",
  "pos": [
   -0.16,
   2.673,
   0.154
  ]
 },
 {
  "code": "SI17",
  "zh": "天容",
  "en": "Heavenly Appearance",
  "pinyin": "tian rong",
  "region": "neck",
  "view": "front",
  "side": "left",
  "meridian": "SI",
  "loc": "在頸部，下頜角後方，胸鎖乳突肌的前緣凹陷中。",
  "locEn": "On the neck, behind the angle of the mandible, in the depression at the anterior border of sternocleidomastoid.",
  "locReview": "source_checked",
  "pos": [
   -0.2,
   2.704,
   0.212
  ]
 },
 {
  "code": "SI18",
  "zh": "顴髎",
  "en": "Cheekbone Crevice",
  "pinyin": "quan liao",
  "region": "face",
  "view": "front",
  "side": "left",
  "meridian": "SI",
  "loc": "在面部，顴骨下緣，目外眥直下凹陷中。",
  "locEn": "On the face, at the lower border of the zygomatic bone, directly below the outer canthus.",
  "locReview": "source_checked",
  "pos": [
   -0.24,
   3.061,
   0.309
  ]
 },
 {
  "code": "SI19",
  "zh": "聽宮",
  "en": "Listening Palace",
  "pinyin": "ting gong",
  "region": "ear",
  "view": "front",
  "side": "left",
  "meridian": "SI",
  "loc": "在面部，耳屏正中與下頜骨髁狀突之間的凹陷中（需張口取穴）。",
  "locEn": "On the face, in the depression between the centre of the tragus and the mandibular condyle; located with the mouth open.",
  "locReview": "source_checked",
  "pos": [
   -0.32,
   3.071,
   0.013
  ]
 },
 {
  "code": "BL1",
  "zh": "睛明",
  "en": "Bright Eyes",
  "pinyin": "jing ming",
  "region": "face",
  "view": "front",
  "side": "left",
  "meridian": "BL",
  "loc": "在面部，目內眥角內上方眶內側壁凹陷中。",
  "locEn": "On the face, in the depression superomedial to the inner canthus, on the medial orbital wall.",
  "locReview": "source_checked",
  "pos": [
   -0.08,
   3.159,
   0.399
  ]
 },
 {
  "code": "BL2",
  "zh": "攢竹",
  "en": "Gathered Bamboo",
  "pinyin": "cuan zhu",
  "region": "face",
  "view": "front",
  "side": "left",
  "meridian": "BL",
  "loc": "在面部，眉頭凹陷中，眶上切跡處。",
  "locEn": "On the face, in the depression at the medial end of the eyebrow, at the supraorbital notch.",
  "locReview": "source_checked",
  "pos": [
   -0.08,
   3.226,
   0.382
  ]
 },
 {
  "code": "BL3",
  "zh": "眉衝",
  "en": "Brow Ascension",
  "pinyin": "mei chong",
  "region": "head",
  "view": "front",
  "side": "left",
  "meridian": "BL",
  "loc": "在頭部，攢竹直上入前髮際 0.5 寸，神庭與曲差連線之間。",
  "locEn": "On the head, 0.5 cun above the anterior hairline directly above BL2.",
  "locReview": "source_checked",
  "pos": [
   -0.08,
   3.35,
   0.336
  ]
 },
 {
  "code": "BL4",
  "zh": "曲差",
  "en": "Crooked Difference",
  "pinyin": "qu cha",
  "region": "head",
  "view": "front",
  "side": "left",
  "meridian": "BL",
  "loc": "在頭部，前髮際正中直上 0.5 寸，旁開 1.5 寸。",
  "locEn": "On the head, 0.5 cun above the anterior hairline and 1.5 cun lateral to the midline.",
  "locReview": "source_checked",
  "pos": [
   -0.08,
   3.35,
   0.336
  ]
 },
 {
  "code": "BL5",
  "zh": "五處",
  "en": "Five Places",
  "pinyin": "wu chu",
  "region": "head",
  "view": "front",
  "side": "left",
  "meridian": "BL",
  "loc": "在頭部，前髮際正中直上 1 寸，旁開 1.5 寸。",
  "locEn": "On the head, 1 cun above the anterior hairline, 1.5 cun lateral to the midline.",
  "locReview": "source_checked",
  "pos": [
   -0.08,
   3.364,
   0.336
  ]
 },
 {
  "code": "BL6",
  "zh": "承光",
  "en": "Receiving Light",
  "pinyin": "cheng guang",
  "region": "head",
  "view": "front",
  "side": "left",
  "meridian": "BL",
  "loc": "在頭部，前髮際正中直上 2.5 寸，旁開 1.5 寸。",
  "locEn": "On the head, 2.5 cun above the anterior hairline, 1.5 cun lateral to the midline.",
  "locReview": "source_checked",
  "pos": [
   -0.08,
   3.405,
   0.3
  ]
 },
 {
  "code": "BL7",
  "zh": "通天",
  "en": "Penetrating Heaven",
  "pinyin": "tong tian",
  "region": "head",
  "view": "front",
  "side": "left",
  "meridian": "BL",
  "loc": "在頭部，前髮際正中直上 4 寸，旁開 1.5 寸。",
  "locEn": "On the head, 4 cun above the anterior hairline, 1.5 cun lateral to the midline.",
  "locReview": "source_checked",
  "pos": [
   -0.08,
   3.446,
   0.24
  ]
 },
 {
  "code": "BL8",
  "zh": "絡卻",
  "en": "Declining Connection",
  "pinyin": "luo que",
  "region": "head",
  "view": "front",
  "side": "left",
  "meridian": "BL",
  "loc": "在頭部，前髮際正中直上 5.5 寸，旁開 1.5 寸。",
  "locEn": "On the head, 5.5 cun above the anterior hairline, 1.5 cun lateral to the midline.",
  "locReview": "source_checked",
  "pos": [
   -0.08,
   3.486,
   0.145
  ]
 },
 {
  "code": "BL9",
  "zh": "玉枕",
  "en": "Jade Pillow",
  "pinyin": "yu zhen",
  "region": "occiput",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在後頭部，後髮際正中直上 2.5 寸，旁開 1.3 寸，平枕外隆凸上緣凹陷處。",
  "locEn": "On the back of the head, 2.5 cun above the posterior hairline and 1.3 cun lateral, level with the upper border of the external occipital protuberance.",
  "locReview": "source_checked",
  "pos": [
   -0.16,
   2.916,
   -0.249
  ]
 },
 {
  "code": "BL10",
  "zh": "天柱",
  "en": "Heavenly Pillar",
  "pinyin": "tian zhu",
  "region": "nape",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在項部，後髮際正中旁開 1.3 寸，斜方肌外緣凹陷中。",
  "locEn": "On the nape, 1.3 cun lateral to the midpoint of the posterior hairline, in the depression at the lateral border of trapezius.",
  "locReview": "source_checked",
  "pos": [
   -0.16,
   2.834,
   -0.241
  ]
 },
 {
  "code": "BL11",
  "zh": "大杼",
  "en": "Great Shuttle",
  "pinyin": "da zhu",
  "region": "upper back",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在背部，第 1 胸椎棘突下，後正中線旁開 1.5 寸。",
  "locEn": "Below the spinous process of T1, 1.5 cun lateral to the posterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.2,
   2.394,
   -0.364
  ]
 },
 {
  "code": "BL12",
  "zh": "風門",
  "en": "Wind Gate",
  "pinyin": "feng men",
  "region": "upper back",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在背部，第 2 胸椎棘突下，後正中線旁開 1.5 寸。",
  "locEn": "Below the spinous process of T2, 1.5 cun lateral to the posterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.2,
   2.272,
   -0.427
  ]
 },
 {
  "code": "BL13",
  "zh": "肺俞",
  "en": "Lung Shu",
  "pinyin": "fei shu",
  "region": "upper back",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在背部，第 3 胸椎棘突下，後正中線旁開 1.5 寸。",
  "locEn": "Below the spinous process of T3, 1.5 cun lateral to the posterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.2,
   2.157,
   -0.463
  ]
 },
 {
  "code": "BL14",
  "zh": "厥陰俞",
  "en": "Jueyin Shu",
  "pinyin": "jue yin shu",
  "region": "upper back",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在背部，第 4 胸椎棘突下，後正中線旁開 1.5 寸。",
  "locEn": "Below the spinous process of T4, 1.5 cun lateral to the posterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.2,
   2.043,
   -0.477
  ]
 },
 {
  "code": "BL15",
  "zh": "心俞",
  "en": "Heart Shu",
  "pinyin": "xin shu",
  "region": "upper back",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在背部，第 5 胸椎棘突下，後正中線旁開 1.5 寸。",
  "locEn": "Below the spinous process of T5, 1.5 cun lateral to the posterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.2,
   1.928,
   -0.477
  ]
 },
 {
  "code": "BL16",
  "zh": "督俞",
  "en": "Governor Shu",
  "pinyin": "du shu",
  "region": "upper back",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在背部，第 6 胸椎棘突下，後正中線旁開 1.5 寸。",
  "locEn": "Below the spinous process of T6, 1.5 cun lateral to the posterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.2,
   1.813,
   -0.476
  ]
 },
 {
  "code": "BL17",
  "zh": "膈俞",
  "en": "Diaphragm Shu",
  "pinyin": "ge shu",
  "region": "mid back",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在背部，第 7 胸椎棘突下，後正中線旁開 1.5 寸。",
  "locEn": "Below the spinous process of T7, 1.5 cun lateral to the posterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.2,
   1.698,
   -0.471
  ]
 },
 {
  "code": "BL18",
  "zh": "肝俞",
  "en": "Liver Shu",
  "pinyin": "gan shu",
  "region": "mid back",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在背部，第 9 胸椎棘突下，後正中線旁開 1.5 寸。",
  "locEn": "Below the spinous process of T9, 1.5 cun lateral to the posterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.2,
   1.467,
   -0.444
  ]
 },
 {
  "code": "BL19",
  "zh": "膽俞",
  "en": "Gallbladder Shu",
  "pinyin": "dan shu",
  "region": "mid back",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在背部，第 10 胸椎棘突下，後正中線旁開 1.5 寸。",
  "locEn": "Below the spinous process of T10, 1.5 cun lateral to the posterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.2,
   1.352,
   -0.426
  ]
 },
 {
  "code": "BL20",
  "zh": "脾俞",
  "en": "Spleen Shu",
  "pinyin": "pi shu",
  "region": "mid back",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在背部，第 11 胸椎棘突下，後正中線旁開 1.5 寸。",
  "locEn": "Below the spinous process of T11, 1.5 cun lateral to the posterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.2,
   1.236,
   -0.405
  ]
 },
 {
  "code": "BL21",
  "zh": "胃俞",
  "en": "Stomach Shu",
  "pinyin": "wei shu",
  "region": "mid back",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在背部，第 12 胸椎棘突下，後正中線旁開 1.5 寸。",
  "locEn": "Below the spinous process of T12, 1.5 cun lateral to the posterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.2,
   1.121,
   -0.382
  ]
 },
 {
  "code": "BL22",
  "zh": "三焦俞",
  "en": "Triple Burner Shu",
  "pinyin": "san jiao shu",
  "region": "lower back",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在腰部，第 1 腰椎棘突下，後正中線旁開 1.5 寸。",
  "locEn": "Below the spinous process of L1, 1.5 cun lateral to the posterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.2,
   0.98,
   -0.363
  ]
 },
 {
  "code": "BL23",
  "zh": "腎俞",
  "en": "Kidney Shu",
  "pinyin": "shen shu",
  "region": "lower back",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在腰部，第 2 腰椎棘突下，後正中線旁開 1.5 寸。",
  "locEn": "Below the spinous process of L2, 1.5 cun lateral to the posterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.2,
   0.838,
   -0.338
  ]
 },
 {
  "code": "BL24",
  "zh": "氣海俞",
  "en": "Sea of Qi Shu",
  "pinyin": "qi hai shu",
  "region": "lower back",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在腰部，第 3 腰椎棘突下，後正中線旁開 1.5 寸。",
  "locEn": "Below the spinous process of L3, 1.5 cun lateral to the posterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.2,
   0.697,
   -0.38
  ]
 },
 {
  "code": "BL25",
  "zh": "大腸俞",
  "en": "Large Intestine Shu",
  "pinyin": "da chang shu",
  "region": "lower back",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在腰部，第 4 腰椎棘突下，後正中線旁開 1.5 寸。",
  "locEn": "Below the spinous process of L4, 1.5 cun lateral to the posterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.2,
   0.557,
   -0.457
  ]
 },
 {
  "code": "BL26",
  "zh": "關元俞",
  "en": "Gate of Origin Shu",
  "pinyin": "guan yuan shu",
  "region": "sacral",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在腰部，第 5 腰椎棘突下，後正中線旁開 1.5 寸。",
  "locEn": "Below the spinous process of L5, 1.5 cun lateral to the posterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.2,
   0.416,
   -0.519
  ]
 },
 {
  "code": "BL27",
  "zh": "小腸俞",
  "en": "Small Intestine Shu",
  "pinyin": "xiao chang shu",
  "region": "sacral",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在骶部，骶正中嵴旁 1.5 寸，平第 1 骶後孔。",
  "locEn": "On the sacrum, 1.5 cun lateral to the median sacral crest, level with the 1st posterior sacral foramen.",
  "locReview": "source_checked",
  "pos": [
   -0.2,
   0.276,
   -0.537
  ]
 },
 {
  "code": "BL28",
  "zh": "膀胱俞",
  "en": "Bladder Shu",
  "pinyin": "pang guang shu",
  "region": "sacral",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在骶部，骶正中嵴旁 1.5 寸，平第 2 骶後孔。",
  "locEn": "On the sacrum, 1.5 cun lateral to the median sacral crest, level with the 2nd posterior sacral foramen.",
  "locReview": "source_checked",
  "pos": [
   -0.2,
   0.157,
   -0.533
  ]
 },
 {
  "code": "BL29",
  "zh": "中膂俞",
  "en": "Central Lumbar Shu",
  "pinyin": "zhong lu shu",
  "region": "sacral",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在骶部，骶正中嵴旁 1.5 寸，平第 3 骶後孔。",
  "locEn": "On the sacrum, 1.5 cun lateral to the median sacral crest, level with the 3rd posterior sacral foramen.",
  "locReview": "source_checked",
  "pos": [
   -0.2,
   0.037,
   -0.501
  ]
 },
 {
  "code": "BL30",
  "zh": "白環俞",
  "en": "White Ring Shu",
  "pinyin": "bai huan shu",
  "region": "sacral",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在骶部，骶正中嵴旁 1.5 寸，平第 4 骶後孔。",
  "locEn": "On the sacrum, 1.5 cun lateral to the median sacral crest, level with the 4th posterior sacral foramen.",
  "locReview": "source_checked",
  "pos": [
   -0.2,
   -0.082,
   -0.376
  ]
 },
 {
  "code": "BL31",
  "zh": "上髎",
  "en": "Upper Bone-Hole",
  "pinyin": "shang liao",
  "region": "sacral",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在骶部，髂後上棘與後正中線之間，適對第 1 骶後孔處。",
  "locEn": "On the sacrum, between the posterior superior iliac spine and the midline, over the 1st posterior sacral foramen.",
  "locReview": "source_checked",
  "pos": [
   -0.12,
   0.276,
   -0.518
  ]
 },
 {
  "code": "BL32",
  "zh": "次髎",
  "en": "Second Bone-Hole",
  "pinyin": "ci liao",
  "region": "sacral",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在骶部，髂後上棘內下方，適對第 2 骶後孔處。",
  "locEn": "On the sacrum, inferomedial to the posterior superior iliac spine, over the 2nd posterior sacral foramen.",
  "locReview": "source_checked",
  "pos": [
   -0.12,
   0.157,
   -0.51
  ]
 },
 {
  "code": "BL33",
  "zh": "中髎",
  "en": "Middle Bone-Hole",
  "pinyin": "zhong liao",
  "region": "sacral",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在骶部，次髎下內方，適對第 3 骶後孔處。",
  "locEn": "On the sacrum, inferomedial to BL32, over the 3rd posterior sacral foramen.",
  "locReview": "source_checked",
  "pos": [
   -0.12,
   0.037,
   -0.474
  ]
 },
 {
  "code": "BL34",
  "zh": "下髎",
  "en": "Lower Bone-Hole",
  "pinyin": "xia liao",
  "region": "sacral",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在骶部，中髎下內方，適對第 4 骶後孔處。",
  "locEn": "On the sacrum, inferomedial to BL33, over the 4th posterior sacral foramen.",
  "locReview": "source_checked",
  "pos": [
   -0.12,
   -0.082,
   -0.317
  ]
 },
 {
  "code": "BL35",
  "zh": "會陽",
  "en": "Meeting Yang",
  "pinyin": "hui yang",
  "region": "sacral",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在骶部，尾骨端旁開 0.5 寸。",
  "locEn": "On the sacrum, 0.5 cun lateral to the tip of the coccyx.",
  "locReview": "source_checked",
  "pos": [
   -0.08,
   -0.242,
   -0.146
  ]
 },
 {
  "code": "BL36",
  "zh": "承扶",
  "en": "Supporting the Hip",
  "pinyin": "cheng fu",
  "region": "thigh",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在大腿後面，臀下橫紋的中點。",
  "locEn": "On the back of the thigh, at the midpoint of the gluteal fold.",
  "locReview": "source_checked",
  "pos": [
   -0.44,
   -0.299,
   -0.346
  ]
 },
 {
  "code": "BL37",
  "zh": "殷門",
  "en": "Abundant Gate",
  "pinyin": "yin men",
  "region": "thigh",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在大腿後面，承扶與委中的連線上，承扶下 6 寸。",
  "locEn": "On the back of the thigh, on the BL36–BL40 line, 6 cun below BL36.",
  "locReview": "source_checked",
  "pos": [
   -0.48,
   -0.841,
   -0.274
  ]
 },
 {
  "code": "BL38",
  "zh": "浮郄",
  "en": "Floating Crevice",
  "pinyin": "fu xi",
  "region": "knee",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在腘橫紋外側端，委陽上 1 寸，股二頭肌腱內側。",
  "locEn": "At the lateral end of the popliteal crease, 1 cun above BL39, medial to the biceps femoris tendon.",
  "locReview": "source_checked",
  "pos": [
   -0.56,
   -1.462,
   -0.372
  ]
 },
 {
  "code": "BL39",
  "zh": "委陽",
  "en": "Bend Yang",
  "pinyin": "wei yang",
  "region": "knee",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在腘橫紋外側端，股二頭肌腱的內側。",
  "locEn": "At the lateral end of the popliteal crease, medial to the biceps femoris tendon.",
  "locReview": "source_checked",
  "pos": [
   -0.56,
   -1.542,
   -0.418
  ]
 },
 {
  "code": "BL40",
  "zh": "委中",
  "en": "Bend Center",
  "pinyin": "wei zhong",
  "region": "knee",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在腘橫紋中點，股二頭肌腱與半腱肌肌腱的中間。",
  "locEn": "At the midpoint of the popliteal crease, between the tendons of biceps femoris and semitendinosus.",
  "locReview": "source_checked",
  "pos": [
   -0.56,
   -1.543,
   -0.418
  ]
 },
 {
  "code": "BL41",
  "zh": "附分",
  "en": "Attached Branch",
  "pinyin": "fu fen",
  "region": "upper back",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在背部，第 2 胸椎棘突下，後正中線旁開 3 寸（第二側線）。",
  "locEn": "Below the spinous process of T2, 3 cun lateral to the posterior midline (second line).",
  "locReview": "source_checked",
  "pos": [
   -0.4,
   2.272,
   -0.448
  ]
 },
 {
  "code": "BL42",
  "zh": "魄戶",
  "en": "Po Door",
  "pinyin": "po hu",
  "region": "upper back",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在背部，第 3 胸椎棘突下，後正中線旁開 3 寸。",
  "locEn": "Below the spinous process of T3, 3 cun lateral to the posterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.4,
   2.157,
   -0.495
  ]
 },
 {
  "code": "BL43",
  "zh": "膏肓",
  "en": "Vital Region",
  "pinyin": "gao huang",
  "region": "upper back",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在背部，第 4 胸椎棘突下，後正中線旁開 3 寸。",
  "locEn": "Below the spinous process of T4, 3 cun lateral to the posterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.4,
   2.043,
   -0.519
  ]
 },
 {
  "code": "BL44",
  "zh": "神堂",
  "en": "Spirit Hall",
  "pinyin": "shen tang",
  "region": "upper back",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在背部，第 5 胸椎棘突下，後正中線旁開 3 寸。",
  "locEn": "Below the spinous process of T5, 3 cun lateral to the posterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.4,
   1.928,
   -0.523
  ]
 },
 {
  "code": "BL45",
  "zh": "譩譆",
  "en": "Yixi",
  "pinyin": "yi xi",
  "region": "upper back",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在背部，第 6 胸椎棘突下，後正中線旁開 3 寸。",
  "locEn": "Below the spinous process of T6, 3 cun lateral to the posterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.4,
   1.813,
   -0.514
  ]
 },
 {
  "code": "BL46",
  "zh": "膈關",
  "en": "Diaphragm Gate",
  "pinyin": "ge guan",
  "region": "mid back",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在背部，第 7 胸椎棘突下，後正中線旁開 3 寸。",
  "locEn": "Below the spinous process of T7, 3 cun lateral to the posterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.4,
   1.698,
   -0.489
  ]
 },
 {
  "code": "BL47",
  "zh": "魂門",
  "en": "Hun Gate",
  "pinyin": "hun men",
  "region": "mid back",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在背部，第 9 胸椎棘突下，後正中線旁開 3 寸。",
  "locEn": "Below the spinous process of T9, 3 cun lateral to the posterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.4,
   1.467,
   -0.437
  ]
 },
 {
  "code": "BL48",
  "zh": "陽綱",
  "en": "Yang Net",
  "pinyin": "yang gang",
  "region": "mid back",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在背部，第 10 胸椎棘突下，後正中線旁開 3 寸。",
  "locEn": "Below the spinous process of T10, 3 cun lateral to the posterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.4,
   1.352,
   -0.416
  ]
 },
 {
  "code": "BL49",
  "zh": "意舍",
  "en": "Idea Abode",
  "pinyin": "yi she",
  "region": "mid back",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在背部，第 11 胸椎棘突下，後正中線旁開 3 寸。",
  "locEn": "Below the spinous process of T11, 3 cun lateral to the posterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.4,
   1.236,
   -0.375
  ]
 },
 {
  "code": "BL50",
  "zh": "胃倉",
  "en": "Stomach Granary",
  "pinyin": "wei cang",
  "region": "mid back",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在背部，第 12 胸椎棘突下，後正中線旁開 3 寸。",
  "locEn": "Below the spinous process of T12, 3 cun lateral to the posterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.4,
   1.121,
   -0.318
  ]
 },
 {
  "code": "BL51",
  "zh": "肓門",
  "en": "Huang Gate",
  "pinyin": "huang men",
  "region": "lower back",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在腰部，第 1 腰椎棘突下，後正中線旁開 3 寸。",
  "locEn": "Below the spinous process of L1, 3 cun lateral to the posterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.4,
   0.98,
   -0.296
  ]
 },
 {
  "code": "BL52",
  "zh": "志室",
  "en": "Will Chamber",
  "pinyin": "zhi shi",
  "region": "lower back",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在腰部，第 2 腰椎棘突下，後正中線旁開 3 寸。",
  "locEn": "Below the spinous process of L2, 3 cun lateral to the posterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.4,
   0.838,
   -0.278
  ]
 },
 {
  "code": "BL53",
  "zh": "胞肓",
  "en": "Uterus Huang",
  "pinyin": "bao huang",
  "region": "buttock",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在臀部，平第 2 骶後孔，骶正中嵴旁開 3 寸。",
  "locEn": "On the buttock, level with the 2nd posterior sacral foramen, 3 cun lateral to the median sacral crest.",
  "locReview": "source_checked",
  "pos": [
   -0.4,
   0.157,
   -0.507
  ]
 },
 {
  "code": "BL54",
  "zh": "秩邊",
  "en": "Orderly Border",
  "pinyin": "zhi bian",
  "region": "buttock",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在臀部，平第 4 骶後孔，骶正中嵴旁開 3 寸。",
  "locEn": "On the buttock, level with the 4th posterior sacral foramen, 3 cun lateral to the median sacral crest.",
  "locReview": "source_checked",
  "pos": [
   -0.4,
   -0.082,
   -0.406
  ]
 },
 {
  "code": "BL55",
  "zh": "合陽",
  "en": "Meeting Yang (leg)",
  "pinyin": "he yang",
  "region": "calf",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在小腿後面，委中與承山的連線上，委中直下 2 寸。",
  "locEn": "On the back of the lower leg, 2 cun below BL40 on the BL40–BL57 line, between the heads of gastrocnemius.",
  "locReview": "source_checked",
  "pos": [
   -0.6,
   -1.702,
   -0.472
  ]
 },
 {
  "code": "BL56",
  "zh": "承筋",
  "en": "Sustaining the Sinews",
  "pinyin": "cheng jin",
  "region": "calf",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在小腿後面，委中與承山的連線上，腓腸肌肌腹中央，委中下 5 寸。",
  "locEn": "On the back of the lower leg, 5 cun below BL40, in the belly of gastrocnemius.",
  "locReview": "source_checked",
  "pos": [
   -0.64,
   -1.939,
   -0.506
  ]
 },
 {
  "code": "BL57",
  "zh": "承山",
  "en": "Supporting Mountain",
  "pinyin": "cheng shan",
  "region": "calf",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在小腿後面正中，委中與崑崙之間，伸直小腿或足跟上提時腓腸肌兩肌腹下端人字尖角凹陷處。",
  "locEn": "On the midline at the back of the lower leg, between BL40 and BL60, in the pointed hollow formed below the two bellies of gastrocnemius when the heel is raised.",
  "locReview": "source_checked",
  "pos": [
   -0.64,
   -2.176,
   -0.489
  ]
 },
 {
  "code": "BL58",
  "zh": "飛揚",
  "en": "Soaring",
  "pinyin": "fei yang",
  "region": "calf",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在小腿後面，外踝後，崑崙直上 7 寸，承山外下方 1 寸處。",
  "locEn": "On the back of the lower leg, 7 cun directly above BL60, 1 cun infero-lateral to BL57.",
  "locReview": "source_checked",
  "pos": [
   -0.68,
   -2.255,
   -0.48
  ]
 },
 {
  "code": "BL59",
  "zh": "跗陽",
  "en": "Instep Yang",
  "pinyin": "fu yang",
  "region": "lower leg",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在小腿後面，外踝後，崑崙直上 3 寸。",
  "locEn": "On the back of the lower leg, 3 cun directly above BL60.",
  "locReview": "source_checked",
  "pos": [
   -0.72,
   -2.571,
   -0.471
  ]
 },
 {
  "code": "BL60",
  "zh": "崑崙",
  "en": "Kunlun Mountains",
  "pinyin": "kun lun",
  "region": "ankle",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在踝區，外踝尖與跟腱之間的凹陷中。",
  "locEn": "At the ankle, in the depression between the tip of the lateral malleolus and the Achilles tendon.",
  "locReview": "source_checked",
  "pos": [
   -0.72,
   -2.822,
   -0.516
  ]
 },
 {
  "code": "BL61",
  "zh": "僕參",
  "en": "Servant Attendant",
  "pinyin": "pu can",
  "region": "heel",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在足外側部，外踝後下方，崑崙直下，跟骨外側赤白肉際處。",
  "locEn": "On the lateral foot, directly below BL60, on the lateral calcaneus at the red-and-white skin border.",
  "locReview": "source_checked",
  "pos": [
   -0.76,
   -2.852,
   -0.517
  ]
 },
 {
  "code": "BL62",
  "zh": "申脈",
  "en": "Extending Vessel",
  "pinyin": "shen mai",
  "region": "ankle",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在足外側部，外踝尖直下方凹陷中。",
  "locEn": "On the lateral foot, in the depression directly below the tip of the lateral malleolus.",
  "locReview": "source_checked",
  "pos": [
   -0.76,
   -2.885,
   -0.533
  ]
 },
 {
  "code": "BL63",
  "zh": "金門",
  "en": "Golden Gate",
  "pinyin": "jin men",
  "region": "foot",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在足外側部，外踝前緣直下，骰骨下緣凹陷處。",
  "locEn": "On the lateral foot, below the anterior border of the lateral malleolus, in the depression at the lower border of the cuboid.",
  "locReview": "source_checked",
  "pos": [
   -0.76,
   -2.931,
   -0.551
  ]
 },
 {
  "code": "BL64",
  "zh": "京骨",
  "en": "Capital Bone",
  "pinyin": "jing gu",
  "region": "foot",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在足外側部，第 5 蹠骨粗隆下方，赤白肉際處。",
  "locEn": "On the lateral foot, below the tuberosity of the 5th metatarsal, at the red-and-white skin border.",
  "locReview": "source_checked",
  "pos": [
   -0.76,
   -2.97,
   -0.551
  ]
 },
 {
  "code": "BL65",
  "zh": "束骨",
  "en": "Bound Bone",
  "pinyin": "shu gu",
  "region": "foot",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在足外側部，第 5 蹠趾關節後方，赤白肉際處。",
  "locEn": "On the lateral foot, proximal to the 5th metatarsophalangeal joint, at the red-and-white skin border.",
  "locReview": "source_checked",
  "pos": [
   -0.76,
   -3.018,
   -0.554
  ]
 },
 {
  "code": "BL66",
  "zh": "足通谷",
  "en": "Foot Valley Passage",
  "pinyin": "zu tong gu",
  "region": "foot",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在足外側部，第 5 蹠趾關節前方，赤白肉際處。",
  "locEn": "On the lateral foot, distal to the 5th metatarsophalangeal joint, at the red-and-white skin border.",
  "locReview": "source_checked",
  "pos": [
   -0.76,
   -3.05,
   -0.55
  ]
 },
 {
  "code": "BL67",
  "zh": "至陰",
  "en": "Reaching Yin",
  "pinyin": "zhi yin",
  "region": "little toe",
  "view": "back",
  "side": "left",
  "meridian": "BL",
  "loc": "在足趾，小趾末節外側，趾甲根角側後方 0.1 寸（指寸）。",
  "locEn": "On the little toe, lateral side of the distal segment, 0.1 finger-cun from the corner of the nail.",
  "locReview": "source_checked",
  "pos": [
   -0.76,
   -3.05,
   -0.55
  ]
 },
 {
  "code": "KI1",
  "zh": "湧泉",
  "en": "Gushing Spring",
  "pinyin": "yong quan",
  "region": "sole",
  "view": "front",
  "side": "left",
  "meridian": "KI",
  "loc": "足底第 2、3 趾蹼緣與足跟連線的前 1/3 與後 2/3 交點處，屈足卷趾時中央凹陷中。",
  "locEn": "On the sole, at the junction of the anterior third and posterior two-thirds of the line from the web between the 2nd and 3rd toes to the heel; in the depression that forms when the foot is flexed and the toes curled.",
  "locReview": "source_checked",
  "pos": [
   -0.76,
   -3.029,
   0.193
  ]
 },
 {
  "code": "KI2",
  "zh": "然谷",
  "en": "Blazing Valley",
  "pinyin": "ran gu",
  "region": "foot",
  "view": "front",
  "side": "left",
  "meridian": "KI",
  "loc": "足內側，舟骨粗隆（然骨）下方凹陷處，赤白肉際。",
  "locEn": "On the medial side of the foot, in the depression below the tuberosity of the navicular bone, at the border between the red and white flesh.",
  "locReview": "source_checked",
  "pos": [
   -0.76,
   -2.978,
   0.073
  ]
 },
 {
  "code": "KI3",
  "zh": "太溪",
  "en": "Great Stream",
  "pinyin": "tai xi",
  "region": "ankle",
  "view": "front",
  "side": "left",
  "meridian": "KI",
  "loc": "內踝尖與跟腱之間的凹陷中，平內踝尖高度。",
  "locEn": "In the depression between the tip of the medial malleolus and the Achilles tendon, level with the malleolus tip.",
  "locReview": "source_checked",
  "pos": [
   -0.72,
   -2.812,
   -0.135
  ]
 },
 {
  "code": "KI4",
  "zh": "大鐘",
  "en": "Big Bell",
  "pinyin": "da zhong",
  "region": "ankle",
  "view": "front",
  "side": "left",
  "meridian": "KI",
  "loc": "內踝後下方，跟腱附着部內側前方凹陷處；約 KI3 下 0.5 寸稍後。",
  "locEn": "Postero-inferior to the medial malleolus, in the depression anterior to the medial side of the Achilles tendon attachment; roughly 0.5 cun below and slightly behind 太溪 KI3.",
  "locReview": "source_checked",
  "pos": [
   -0.76,
   -2.862,
   -0.105
  ]
 },
 {
  "code": "KI5",
  "zh": "水泉",
  "en": "Water Spring",
  "pinyin": "shui quan",
  "region": "ankle",
  "view": "front",
  "side": "left",
  "meridian": "KI",
  "loc": "太溪直下 1 寸，跟骨結節內側前凹陷處。",
  "locEn": "1 cun directly below 太溪 KI3, in the depression anterior to the medial side of the calcaneal tuberosity.",
  "locReview": "source_checked",
  "pos": [
   -0.76,
   -2.891,
   -0.058
  ]
 },
 {
  "code": "KI6",
  "zh": "照海",
  "en": "Shining Sea",
  "pinyin": "zhao hai",
  "region": "ankle",
  "view": "front",
  "side": "left",
  "meridian": "KI",
  "loc": "內踝尖下方凹陷處（非後方，是下緣）。",
  "locEn": "In the depression below the tip of the medial malleolus — its lower border, not behind it.",
  "locReview": "source_checked",
  "pos": [
   -0.76,
   -2.855,
   -0.105
  ]
 },
 {
  "code": "KI7",
  "zh": "復溜",
  "en": "Returning Flow",
  "pinyin": "fu liu",
  "region": "lower leg",
  "view": "front",
  "side": "left",
  "meridian": "KI",
  "loc": "太溪上 2 寸，跟腱前緣；內踝尖上 2 寸。",
  "locEn": "2 cun above 太溪 KI3, at the anterior border of the Achilles tendon; 2 cun above the tip of the medial malleolus.",
  "locReview": "source_checked",
  "pos": [
   -0.72,
   -2.616,
   -0.165
  ]
 },
 {
  "code": "KI8",
  "zh": "交信",
  "en": "Intersecting Trust",
  "pinyin": "jiao xin",
  "region": "lower leg",
  "view": "front",
  "side": "left",
  "meridian": "KI",
  "loc": "太溪上 2 寸，復溜前約 0.5 寸，脛骨內側緣後方。",
  "locEn": "2 cun above 太溪 KI3 and about 0.5 cun anterior to 復溜 KI7, behind the medial border of the tibia.",
  "locReview": "source_checked",
  "pos": [
   -0.72,
   -2.616,
   -0.165
  ]
 },
 {
  "code": "KI9",
  "zh": "築賓",
  "en": "Building Guest",
  "pinyin": "zhu bin",
  "region": "lower leg",
  "view": "front",
  "side": "left",
  "meridian": "KI",
  "loc": "太溪上 5 寸，腓腸肌肌腹內側頭的內側緣；約陰谷下 2 寸。",
  "locEn": "5 cun above 太溪 KI3, at the medial border of the medial head of the gastrocnemius; about 2 cun below 陰谷 KI10.",
  "locReview": "source_checked",
  "pos": [
   -0.68,
   -2.323,
   -0.121
  ]
 },
 {
  "code": "KI10",
  "zh": "陰谷",
  "en": "Yin Valley",
  "pinyin": "yin gu",
  "region": "knee",
  "view": "front",
  "side": "left",
  "meridian": "KI",
  "loc": "膝後橫紋內側端，半腱肌肌腱與半膜肌肌腱之間的凹陷處；屈膝取之。",
  "locEn": "At the medial end of the popliteal crease, in the depression between the semitendinosus and semimembranosus tendons; located with the knee flexed.",
  "locReview": "source_checked",
  "pos": [
   -0.56,
   -1.546,
   0.1
  ]
 },
 {
  "code": "KI11",
  "zh": "橫骨",
  "en": "Cross Bone",
  "pinyin": "heng gu",
  "region": "lower abdomen",
  "view": "front",
  "side": "left",
  "meridian": "KI",
  "loc": "臍中下 5 寸，恥骨聯合上緣，前正中線旁開 0.5 寸。",
  "locEn": "5 cun below the umbilicus at the upper border of the pubic symphysis, 0.5 cun lateral to the anterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.08,
   -0.12,
   0.383
  ]
 },
 {
  "code": "KI12",
  "zh": "大赫",
  "en": "Great Splendour",
  "pinyin": "da he",
  "region": "lower abdomen",
  "view": "front",
  "side": "left",
  "meridian": "KI",
  "loc": "臍中下 4 寸，前正中線旁開 0.5 寸。",
  "locEn": "4 cun below the umbilicus, 0.5 cun lateral to the anterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.08,
   0.058,
   0.391
  ]
 },
 {
  "code": "KI13",
  "zh": "氣穴",
  "en": "Qi Cave",
  "pinyin": "qi xue",
  "region": "lower abdomen",
  "view": "front",
  "side": "left",
  "meridian": "KI",
  "loc": "臍中下 3 寸，前正中線旁開 0.5 寸。",
  "locEn": "3 cun below the umbilicus, 0.5 cun lateral to the anterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.08,
   0.236,
   0.46
  ]
 },
 {
  "code": "KI14",
  "zh": "四滿",
  "en": "Four Fullnesses",
  "pinyin": "si man",
  "region": "lower abdomen",
  "view": "front",
  "side": "left",
  "meridian": "KI",
  "loc": "臍中下 2 寸，前正中線旁開 0.5 寸。",
  "locEn": "2 cun below the umbilicus, 0.5 cun lateral to the anterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.08,
   0.414,
   0.504
  ]
 },
 {
  "code": "KI15",
  "zh": "中注",
  "en": "Central Pouring",
  "pinyin": "zhong zhu",
  "region": "lower abdomen",
  "view": "front",
  "side": "left",
  "meridian": "KI",
  "loc": "臍中下 1 寸，前正中線旁開 0.5 寸。",
  "locEn": "1 cun below the umbilicus, 0.5 cun lateral to the anterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.08,
   0.592,
   0.536
  ]
 },
 {
  "code": "KI16",
  "zh": "肓俞",
  "en": "Huang's Transport",
  "pinyin": "huang shu",
  "region": "abdomen",
  "view": "front",
  "side": "left",
  "meridian": "KI",
  "loc": "臍中旁開 0.5 寸，平臍。",
  "locEn": "Level with the umbilicus, 0.5 cun lateral to it.",
  "locReview": "source_checked",
  "pos": [
   -0.08,
   0.77,
   0.555
  ]
 },
 {
  "code": "KI17",
  "zh": "商曲",
  "en": "Shang Curve",
  "pinyin": "shang qu",
  "region": "upper abdomen",
  "view": "front",
  "side": "left",
  "meridian": "KI",
  "loc": "臍中上 1 寸，前正中線旁開 0.5 寸。",
  "locEn": "1 cun above the umbilicus, 0.5 cun lateral to the anterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.08,
   0.86,
   0.559
  ]
 },
 {
  "code": "KI18",
  "zh": "石關",
  "en": "Stone Pass",
  "pinyin": "shi guan",
  "region": "upper abdomen",
  "view": "front",
  "side": "left",
  "meridian": "KI",
  "loc": "臍中上 2 寸，前正中線旁開 0.5 寸。",
  "locEn": "2 cun above the umbilicus, 0.5 cun lateral to the anterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.08,
   0.951,
   0.553
  ]
 },
 {
  "code": "KI19",
  "zh": "陰都",
  "en": "Yin Metropolis",
  "pinyin": "yin du",
  "region": "upper abdomen",
  "view": "front",
  "side": "left",
  "meridian": "KI",
  "loc": "臍中上 3 寸，前正中線旁開 0.5 寸。",
  "locEn": "3 cun above the umbilicus, 0.5 cun lateral to the anterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.08,
   1.041,
   0.546
  ]
 },
 {
  "code": "KI20",
  "zh": "腹通谷",
  "en": "Abdominal Passage Valley",
  "pinyin": "fu tong gu",
  "region": "upper abdomen",
  "view": "front",
  "side": "left",
  "meridian": "KI",
  "loc": "臍中上 4 寸，前正中線旁開 0.5 寸。",
  "locEn": "4 cun above the umbilicus, 0.5 cun lateral to the anterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.08,
   1.131,
   0.538
  ]
 },
 {
  "code": "KI21",
  "zh": "幽門",
  "en": "Hidden Gate",
  "pinyin": "you men",
  "region": "upper abdomen",
  "view": "front",
  "side": "left",
  "meridian": "KI",
  "loc": "臍中上 5 寸（巨闕下 1 寸），前正中線旁開 0.5 寸。",
  "locEn": "5 cun above the umbilicus (1 cun below 巨闕 CV14), 0.5 cun lateral to the anterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.08,
   1.222,
   0.535
  ]
 },
 {
  "code": "KI22",
  "zh": "步廊",
  "en": "Walking Corridor",
  "pinyin": "bu lang",
  "region": "chest",
  "view": "front",
  "side": "left",
  "meridian": "KI",
  "loc": "第 5 肋間隙，前正中線旁開 2 寸（任脈中庭水平旁）。",
  "locEn": "In the 5th intercostal space, 2 cun lateral to the anterior midline (level with 中庭 CV16).",
  "locReview": "source_checked",
  "pos": [
   -0.28,
   1.618,
   0.512
  ]
 },
 {
  "code": "KI23",
  "zh": "神封",
  "en": "Spirit Seal",
  "pinyin": "shen feng",
  "region": "chest",
  "view": "front",
  "side": "left",
  "meridian": "KI",
  "loc": "第 4 肋間隙，前正中線旁開 2 寸（任脈膻中水平旁）。",
  "locEn": "In the 4th intercostal space, 2 cun lateral to the anterior midline (level with 膻中 CV17).",
  "locReview": "source_checked",
  "pos": [
   -0.28,
   1.76,
   0.509
  ]
 },
 {
  "code": "KI24",
  "zh": "靈墟",
  "en": "Spirit Mound",
  "pinyin": "ling xu",
  "region": "chest",
  "view": "front",
  "side": "left",
  "meridian": "KI",
  "loc": "第 3 肋間隙，前正中線旁開 2 寸（任脈玉堂水平旁）。",
  "locEn": "In the 3rd intercostal space, 2 cun lateral to the anterior midline (level with 玉堂 CV18).",
  "locReview": "source_checked",
  "pos": [
   -0.28,
   1.901,
   0.457
  ]
 },
 {
  "code": "KI25",
  "zh": "神藏",
  "en": "Spirit Storehouse",
  "pinyin": "shen cang",
  "region": "chest",
  "view": "front",
  "side": "left",
  "meridian": "KI",
  "loc": "第 2 肋間隙，前正中線旁開 2 寸（任脈紫宮水平旁）。",
  "locEn": "In the 2nd intercostal space, 2 cun lateral to the anterior midline (level with 紫宮 CV19).",
  "locReview": "source_checked",
  "pos": [
   -0.28,
   2.043,
   0.374
  ]
 },
 {
  "code": "KI26",
  "zh": "彧中",
  "en": "Flourishing Middle",
  "pinyin": "yu zhong",
  "region": "chest",
  "view": "front",
  "side": "left",
  "meridian": "KI",
  "loc": "第 1 肋間隙，前正中線旁開 2 寸（任脈華蓋水平旁）。",
  "locEn": "In the 1st intercostal space, 2 cun lateral to the anterior midline (level with 華蓋 CV20).",
  "locReview": "source_checked",
  "pos": [
   -0.28,
   2.184,
   0.285
  ]
 },
 {
  "code": "KI27",
  "zh": "俞府",
  "en": "Transport House",
  "pinyin": "shu fu",
  "region": "chest",
  "view": "front",
  "side": "left",
  "meridian": "KI",
  "loc": "鎖骨下緣，前正中線旁開 2 寸（任脈璇璣水平旁，鎖骨下窩內）。",
  "locEn": "At the lower border of the clavicle, 2 cun lateral to the anterior midline, in the infraclavicular fossa (level with 璇璣 CV21).",
  "locReview": "source_checked",
  "pos": [
   -0.28,
   2.328,
   0.203
  ]
 },
 {
  "code": "PC1",
  "zh": "天池",
  "en": "Heavenly Pool",
  "pinyin": "tian chi",
  "region": "chest",
  "view": "front",
  "side": "left",
  "meridian": "PC",
  "loc": "胸部，第 4 肋間隙，前正中線旁開 5 寸（乳頭外側 1 寸）；仰臥取穴。",
  "locEn": "On the chest, in the 4th intercostal space, 5 cun lateral to the anterior midline (1 cun lateral to the nipple); located lying supine.",
  "locReview": "source_checked",
  "pos": [
   -0.68,
   1.76,
   0.051
  ]
 },
 {
  "code": "PC2",
  "zh": "天泉",
  "en": "Heavenly Spring",
  "pinyin": "tian quan",
  "region": "upper arm",
  "view": "front",
  "side": "left",
  "meridian": "PC",
  "loc": "臂前區，腋前紋頭下 2 寸，肱二頭肌長短頭之間的溝中。",
  "locEn": "On the anterior arm, 2 cun below the anterior axillary fold, in the groove between the long and short heads of the biceps.",
  "locReview": "source_checked",
  "pos": [
   -1.0,
   1.76,
   0.042
  ]
 },
 {
  "code": "PC3",
  "zh": "曲澤",
  "en": "Crooked Marsh",
  "pinyin": "qu ze",
  "region": "elbow",
  "view": "front",
  "side": "left",
  "meridian": "PC",
  "loc": "肘前區，肘橫紋中點，肱二頭肌腱的尺側緣凹陷處；微屈肘取穴。",
  "locEn": "At the elbow, at the midpoint of the cubital crease, in the depression on the ulnar border of the biceps tendon; located with the elbow slightly flexed.",
  "locReview": "source_checked",
  "pos": [
   -1.16,
   1.073,
   0.07
  ]
 },
 {
  "code": "PC4",
  "zh": "郄門",
  "en": "Cleft Gate",
  "pinyin": "xi men",
  "region": "forearm",
  "view": "front",
  "side": "left",
  "meridian": "PC",
  "loc": "前臂前區，腕掌側遠端橫紋上 5 寸，掌長肌腱與橈側腕屈肌腱之間。",
  "locEn": "On the anterior forearm, 5 cun above the palmar wrist crease, between the tendons of palmaris longus and flexor carpi radialis.",
  "locReview": "source_checked",
  "pos": [
   -1.4,
   0.594,
   0.057
  ]
 },
 {
  "code": "PC5",
  "zh": "間使",
  "en": "Intermediary Messenger",
  "pinyin": "jian shi",
  "region": "forearm",
  "view": "front",
  "side": "left",
  "meridian": "PC",
  "loc": "前臂前區，腕掌側遠端橫紋上 3 寸，掌長肌腱與橈側腕屈肌腱之間。",
  "locEn": "On the anterior forearm, 3 cun above the palmar wrist crease, between the same two tendons.",
  "locReview": "source_checked",
  "pos": [
   -1.48,
   0.47,
   0.071
  ]
 },
 {
  "code": "PC6",
  "zh": "內關",
  "en": "Inner Gate",
  "pinyin": "nei guan",
  "region": "forearm",
  "view": "front",
  "side": "left",
  "meridian": "PC",
  "loc": "前臂前區，腕掌側遠端橫紋上 2 寸，掌長肌腱與橈側腕屈肌腱之間。",
  "locEn": "On the anterior forearm, 2 cun above the palmar wrist crease, between the same two tendons.",
  "locReview": "source_checked",
  "pos": [
   -1.52,
   0.408,
   0.065
  ]
 },
 {
  "code": "PC7",
  "zh": "大陵",
  "en": "Great Mound",
  "pinyin": "da ling",
  "region": "wrist",
  "view": "front",
  "side": "left",
  "meridian": "PC",
  "loc": "前臂前區，腕掌側遠端橫紋中點，掌長肌腱與橈側腕屈肌腱之間。",
  "locEn": "At the midpoint of the palmar wrist crease, between the tendons of palmaris longus and flexor carpi radialis.",
  "locReview": "source_checked",
  "pos": [
   -1.64,
   0.284,
   0.069
  ]
 },
 {
  "code": "PC8",
  "zh": "勞宮",
  "en": "Palace of Toil",
  "pinyin": "lao gong",
  "region": "palm",
  "view": "front",
  "side": "left",
  "meridian": "PC",
  "loc": "手掌區，第 2、3 掌骨之間，握拳時中指尖所點處；約當第 3 掌骨橈側。",
  "locEn": "On the palm, between the 2nd and 3rd metacarpals, where the tip of the middle finger rests when a fist is made; near the radial side of the 3rd metacarpal.",
  "locReview": "source_checked",
  "pos": [
   -1.68,
   0.181,
   0.08
  ]
 },
 {
  "code": "PC9",
  "zh": "中衝",
  "en": "Central Hub",
  "pinyin": "zhong chong",
  "region": "middle finger",
  "view": "front",
  "side": "left",
  "meridian": "PC",
  "loc": "手指，中指尖端中央，距指甲游離緣約 0.1 寸；或指甲橈側角。",
  "locEn": "At the centre of the tip of the middle finger, about 0.1 cun from the free edge of the nail, or at the radial corner of the nail.",
  "locReview": "source_checked",
  "pos": [
   -1.76,
   0.05,
   0.158
  ]
 },
 {
  "code": "TE1",
  "zh": "關衝",
  "en": "Gate Hub",
  "pinyin": "guan chong",
  "region": "ring finger",
  "view": "front",
  "side": "right",
  "meridian": "TE",
  "loc": "手指，無名指尺側端，距指甲游離緣角約 0.1 寸。",
  "locEn": "On the ring finger, at its ulnar end, about 0.1 cun from the corner of the nail.",
  "locReview": "source_checked",
  "pos": [
   1.76,
   0.05,
   0.158
  ]
 },
 {
  "code": "TE2",
  "zh": "液門",
  "en": "Fluid Gate",
  "pinyin": "ye men",
  "region": "hand",
  "view": "front",
  "side": "right",
  "meridian": "TE",
  "loc": "手指，第 4、5 指之間，指蹼緣後方赤白肉際凹陷處；握拳取穴。",
  "locEn": "Between the 4th and 5th fingers, in the depression proximal to the web margin at the border between red and white flesh; located with a loose fist.",
  "locReview": "source_checked",
  "pos": [
   1.72,
   0.133,
   0.106
  ]
 },
 {
  "code": "TE3",
  "zh": "中渚",
  "en": "Central Islet",
  "pinyin": "zhong zhu",
  "region": "dorsal hand",
  "view": "front",
  "side": "right",
  "meridian": "TE",
  "loc": "手背，第 4、5 掌骨間，腕背橫紋上約 1 寸（或第 4 掌骨小頭後方）凹陷處；握拳取穴。",
  "locEn": "On the back of the hand, between the 4th and 5th metacarpals, in the depression about 1 cun above the dorsal wrist crease (behind the head of the 4th metacarpal); located with a loose fist.",
  "locReview": "source_checked",
  "pos": [
   1.68,
   0.198,
   0.08
  ]
 },
 {
  "code": "TE4",
  "zh": "陽池",
  "en": "Yang Pool",
  "pinyin": "yang chi",
  "region": "wrist",
  "view": "front",
  "side": "right",
  "meridian": "TE",
  "loc": "腕後區，腕背橫紋中點，尺骨與橈骨之間的凹陷處；指伸肌腱橈側。",
  "locEn": "At the midpoint of the dorsal wrist crease, in the depression between the ulna and radius, on the radial side of the extensor digitorum tendon.",
  "locReview": "source_checked",
  "pos": [
   1.64,
   0.284,
   0.069
  ]
 },
 {
  "code": "TE5",
  "zh": "外關",
  "en": "Outer Gate",
  "pinyin": "wai guan",
  "region": "forearm",
  "view": "front",
  "side": "right",
  "meridian": "TE",
  "loc": "前臂後區，腕背橫紋上 2 寸，尺骨與橈骨之間（尺橈骨間隙）。",
  "locEn": "On the posterior forearm, 2 cun above the dorsal wrist crease, between the ulna and radius.",
  "locReview": "source_checked",
  "pos": [
   1.52,
   0.408,
   0.065
  ]
 },
 {
  "code": "TE6",
  "zh": "支溝",
  "en": "Branch Ditch",
  "pinyin": "zhi gou",
  "region": "forearm",
  "view": "front",
  "side": "right",
  "meridian": "TE",
  "loc": "前臂後區，腕背橫紋上 3 寸，尺骨與橈骨之間（尺橈骨間隙）。",
  "locEn": "On the posterior forearm, 3 cun above the dorsal wrist crease, between the ulna and radius.",
  "locReview": "source_checked",
  "pos": [
   1.48,
   0.47,
   0.071
  ]
 },
 {
  "code": "TE7",
  "zh": "會宗",
  "en": "Convergence and Gathering",
  "pinyin": "hui zong",
  "region": "forearm",
  "view": "front",
  "side": "right",
  "meridian": "TE",
  "loc": "前臂後區，腕背橫紋上 3 寸，支溝尺側（尺骨橈側緣）。",
  "locEn": "On the posterior forearm, 3 cun above the dorsal wrist crease, on the ulnar side of 支溝 TE6 at the radial border of the ulna.",
  "locReview": "source_checked",
  "pos": [
   1.48,
   0.47,
   0.071
  ]
 },
 {
  "code": "TE8",
  "zh": "三陽絡",
  "en": "Three Yang Collateral",
  "pinyin": "san yang luo",
  "region": "forearm",
  "view": "front",
  "side": "right",
  "meridian": "TE",
  "loc": "前臂後區，腕背橫紋上 4 寸，尺骨與橈骨之間（尺橈骨間隙）。",
  "locEn": "On the posterior forearm, 4 cun above the dorsal wrist crease, between the ulna and radius.",
  "locReview": "source_checked",
  "pos": [
   1.44,
   0.532,
   0.064
  ]
 },
 {
  "code": "TE9",
  "zh": "四瀆",
  "en": "Four Rivers",
  "pinyin": "si du",
  "region": "forearm",
  "view": "front",
  "side": "right",
  "meridian": "TE",
  "loc": "前臂後區，腕背橫紋上 7 寸（肘尖下 5 寸），尺骨與橈骨之間。",
  "locEn": "On the posterior forearm, 7 cun above the dorsal wrist crease (5 cun below the tip of the elbow), between the ulna and radius.",
  "locReview": "source_checked",
  "pos": [
   1.32,
   0.718,
   0.054
  ]
 },
 {
  "code": "TE10",
  "zh": "天井",
  "en": "Heavenly Well",
  "pinyin": "tian jing",
  "region": "elbow",
  "view": "front",
  "side": "right",
  "meridian": "TE",
  "loc": "肘後區，肘尖（尺骨鷹嘴）上方凹陷處；屈肘取穴，約當肘尖上 1 寸。",
  "locEn": "Behind the elbow, in the depression above the olecranon, about 1 cun above the elbow tip; located with the elbow flexed.",
  "locReview": "source_checked",
  "pos": [
   1.16,
   1.171,
   0.075
  ]
 },
 {
  "code": "TE11",
  "zh": "清冷淵",
  "en": "Clear Cold Abyss",
  "pinyin": "qing leng yuan",
  "region": "upper arm",
  "view": "front",
  "side": "right",
  "meridian": "TE",
  "loc": "臂後區，肘尖上 2 寸，肱三頭肌外側頭與內側頭之間的溝中。",
  "locEn": "On the posterior arm, 2 cun above the tip of the elbow, in the groove between the lateral and medial heads of triceps.",
  "locReview": "source_checked",
  "pos": [
   1.12,
   1.269,
   0.069
  ]
 },
 {
  "code": "TE12",
  "zh": "消濼",
  "en": "Dispersing Turbidity",
  "pinyin": "xiao luo",
  "region": "upper arm",
  "view": "front",
  "side": "right",
  "meridian": "TE",
  "loc": "臂後區，肘尖上 5 寸（清冷淵上 3 寸），肱三頭肌外側頭與內側頭之間的溝中。",
  "locEn": "On the posterior arm, 5 cun above the tip of the elbow (3 cun above 清冷淵 TE11), in the same triceps groove.",
  "locReview": "source_checked",
  "pos": [
   1.04,
   1.563,
   0.104
  ]
 },
 {
  "code": "TE13",
  "zh": "臑會",
  "en": "Upper Arm Convergence",
  "pinyin": "nao hui",
  "region": "upper arm",
  "view": "front",
  "side": "right",
  "meridian": "TE",
  "loc": "臂後區，肩髎下 3 寸，三角肌後緣與肱三頭肌外側頭之間的凹陷處。",
  "locEn": "On the posterior arm, 3 cun below 肩髎 TE14, in the depression between the posterior border of deltoid and the lateral head of triceps.",
  "locReview": "source_checked",
  "pos": [
   0.96,
   1.907,
   0.014
  ]
 },
 {
  "code": "TE14",
  "zh": "肩髎",
  "en": "Shoulder Crevice",
  "pinyin": "jian liao",
  "region": "shoulder",
  "view": "front",
  "side": "right",
  "meridian": "TE",
  "loc": "肩關節後下方，肩髃（LI15）後方約 1 寸，肩峰角與肱骨大結節之間的凹陷處；外展上臂時凹陷更明顯。",
  "locEn": "Postero-inferior to the shoulder joint, about 1 cun behind 肩髃 LI15, in the depression between the acromial angle and the greater tubercle of the humerus; clearer with the arm abducted.",
  "locReview": "source_checked",
  "pos": [
   0.64,
   2.225,
   0.182
  ]
 },
 {
  "code": "TE15",
  "zh": "天髎",
  "en": "Heavenly Crevice",
  "pinyin": "tian liao",
  "region": "scapula",
  "view": "back",
  "side": "right",
  "meridian": "TE",
  "loc": "肩胛區，肩胛骨上角上方的凹陷處，肩井（GB21）後方約 1 寸，曲垣（SI13）上方。",
  "locEn": "In the scapular region, in the depression above the superior angle of the scapula, about 1 cun behind 肩井 GB21 and above 曲垣 SI13.",
  "locReview": "source_checked",
  "pos": [
   0.48,
   2.159,
   -0.484
  ]
 },
 {
  "code": "TE16",
  "zh": "天牖",
  "en": "Heavenly Window",
  "pinyin": "tian you",
  "region": "neck",
  "view": "front",
  "side": "right",
  "meridian": "TE",
  "loc": "頸側區，乳突後下方，胸鎖乳突肌後緣，約當扶突（LI18）與翳風（TE17）之間。",
  "locEn": "On the lateral neck, postero-inferior to the mastoid process at the posterior border of sternocleidomastoid, between 扶突 LI18 and 翳風 TE17.",
  "locReview": "source_checked",
  "pos": [
   0.16,
   2.828,
   0.344
  ]
 },
 {
  "code": "TE17",
  "zh": "翳風",
  "en": "Screened Wind",
  "pinyin": "yi feng",
  "region": "behind the ear",
  "view": "front",
  "side": "right",
  "meridian": "TE",
  "loc": "耳後區，耳垂後方，乳突前下方凹陷處，約當耳垂與乳突之間；張口凹陷更明顯。",
  "locEn": "Behind the ear, in the depression behind the earlobe and antero-inferior to the mastoid process; clearer with the mouth open.",
  "locReview": "source_checked",
  "pos": [
   0.32,
   2.926,
   0.03
  ]
 },
 {
  "code": "TE18",
  "zh": "瘈脈",
  "en": "Convulsion Vessel",
  "pinyin": "chi mai",
  "region": "behind the ear",
  "view": "front",
  "side": "right",
  "meridian": "TE",
  "loc": "耳後區，乳突中央，翳風與角孫沿耳輪連線的中下 1/3 交點處。",
  "locEn": "Behind the ear, at the centre of the mastoid, at the junction of the lower and middle thirds of the curve from 翳風 TE17 to 角孫 TE20 along the helix.",
  "locReview": "source_checked",
  "pos": [
   0.32,
   3.012,
   0.021
  ]
 },
 {
  "code": "TE19",
  "zh": "顱息",
  "en": "Skull Rest",
  "pinyin": "lu xi",
  "region": "behind the ear",
  "view": "front",
  "side": "right",
  "meridian": "TE",
  "loc": "耳後區，角孫與翳風沿耳輪連線的中上 1/3 交點處，約當乳突上緣。",
  "locEn": "Behind the ear, at the junction of the upper and middle thirds of that same curve, about level with the upper border of the mastoid.",
  "locReview": "source_checked",
  "pos": [
   0.32,
   3.097,
   0.05
  ]
 },
 {
  "code": "TE20",
  "zh": "角孫",
  "en": "Angle Grandson",
  "pinyin": "jiao sun",
  "region": "temple",
  "view": "front",
  "side": "right",
  "meridian": "TE",
  "loc": "頭側部，耳尖上方髮際處，當耳尖直上入髮際處；折耳廓向前時耳尖所對之處。",
  "locEn": "On the side of the head, at the hairline directly above the ear apex; where the ear apex touches when the auricle is folded forward.",
  "locReview": "source_checked",
  "pos": [
   0.28,
   3.183,
   0.202
  ]
 },
 {
  "code": "TE21",
  "zh": "耳門",
  "en": "Ear Gate",
  "pinyin": "er men",
  "region": "in front of the ear",
  "view": "front",
  "side": "right",
  "meridian": "TE",
  "loc": "耳前區，耳屏上切跡前方凹陷處，張口時凹陷更明顯；約當聽宮（SI19）上方。",
  "locEn": "In front of the ear, in the depression anterior to the supratragic notch, clearer with the mouth open; just above 聽宮 SI19.",
  "locReview": "source_checked",
  "pos": [
   0.32,
   3.114,
   0.05
  ]
 },
 {
  "code": "TE22",
  "zh": "耳和髎",
  "en": "Ear Harmonising Crevice",
  "pinyin": "er he liao",
  "region": "in front of the ear",
  "view": "front",
  "side": "right",
  "meridian": "TE",
  "loc": "耳前區，耳屏前上方，鬢髮後緣，耳門上方約 0.5 寸，顴弓後端上方的凹陷處。",
  "locEn": "In front of and above the tragus, at the posterior border of the temple hair, about 0.5 cun above 耳門 TE21, in the depression above the posterior end of the zygomatic arch.",
  "locReview": "source_checked",
  "pos": [
   0.32,
   3.17,
   0.046
  ]
 },
 {
  "code": "TE23",
  "zh": "絲竹空",
  "en": "Silk Bamboo Hollow",
  "pinyin": "si zhu kong",
  "region": "face",
  "view": "front",
  "side": "right",
  "meridian": "TE",
  "loc": "面部，眉梢外側凹陷處，絲竹（眉毛）盡頭的凹窩中。",
  "locEn": "On the face, in the depression at the lateral end of the eyebrow.",
  "locReview": "source_checked",
  "pos": [
   0.28,
   3.226,
   0.17
  ]
 },
 {
  "code": "GB1",
  "zh": "瞳子髎",
  "en": "Pupil Crevice",
  "pinyin": "tong zi liao",
  "region": "face",
  "view": "front",
  "side": "left",
  "meridian": "GB",
  "loc": "在面部，目外眥旁，當眶外側緣處。",
  "locEn": "On the face, beside the outer canthus, at the lateral border of the orbit.",
  "locReview": "source_checked",
  "pos": [
   -0.28,
   3.147,
   0.254
  ]
 },
 {
  "code": "GB2",
  "zh": "聽會",
  "en": "Auditory Convergence",
  "pinyin": "ting hui",
  "region": "face",
  "view": "front",
  "side": "left",
  "meridian": "GB",
  "loc": "在面部，當耳屏間切跡的前方，下頜骨髁突的後緣，張口有凹陷處。",
  "locEn": "On the face, in front of the intertragic notch and behind the condylar process of the mandible, in the depression that appears when the mouth is open.",
  "locReview": "source_checked",
  "pos": [
   -0.32,
   3.035,
   0.013
  ]
 },
 {
  "code": "GB3",
  "zh": "上關",
  "en": "Upper Pass",
  "pinyin": "shang guan",
  "region": "face",
  "view": "front",
  "side": "left",
  "meridian": "GB",
  "loc": "在耳前，下關直上，當顴弓的上緣凹陷處。",
  "locEn": "In front of the ear, directly above 下關 ST7, in the depression at the upper border of the zygomatic arch.",
  "locReview": "source_checked",
  "pos": [
   -0.16,
   3.011,
   0.355
  ]
 },
 {
  "code": "GB4",
  "zh": "頷厭",
  "en": "Jaw Satisfaction",
  "pinyin": "han yan",
  "region": "temple",
  "view": "front",
  "side": "left",
  "meridian": "GB",
  "loc": "在頭部鬢髮上，當頭維與曲鬢弧形連線的上四分之一與下四分之三交點處。",
  "locEn": "On the temple hairline, at the junction of the upper quarter and lower three-quarters of the curve from 頭維 ST8 to 曲鬢 GB7.",
  "locReview": "source_checked",
  "pos": [
   -0.28,
   3.283,
   0.124
  ]
 },
 {
  "code": "GB5",
  "zh": "懸顱",
  "en": "Suspended Skull",
  "pinyin": "xuan lu",
  "region": "temple",
  "view": "front",
  "side": "left",
  "meridian": "GB",
  "loc": "在頭部鬢髮上，當頭維與曲鬢弧形連線的中點處。",
  "locEn": "On the temple hairline, at the midpoint of that same curve.",
  "locReview": "source_checked",
  "pos": [
   -0.28,
   3.229,
   0.17
  ]
 },
 {
  "code": "GB6",
  "zh": "懸釐",
  "en": "Suspended Separation",
  "pinyin": "xuan li",
  "region": "temple",
  "view": "front",
  "side": "left",
  "meridian": "GB",
  "loc": "在頭部鬢髮上，當頭維與曲鬢弧形連線的上四分之三與下四分之一交點處。",
  "locEn": "On the temple hairline, at the junction of the upper three-quarters and lower quarter of that curve.",
  "locReview": "source_checked",
  "pos": [
   -0.28,
   3.176,
   0.202
  ]
 },
 {
  "code": "GB7",
  "zh": "曲鬢",
  "en": "Crooked Temple Hair",
  "pinyin": "qu bin",
  "region": "temple",
  "view": "front",
  "side": "left",
  "meridian": "GB",
  "loc": "在頭部，當耳前鬢角髮際後緣的垂線與耳尖水平線交點處。",
  "locEn": "On the head, where the vertical line at the posterior border of the temple hairline meets the horizontal line through the ear apex.",
  "locReview": "source_checked",
  "pos": [
   -0.32,
   3.122,
   0.05
  ]
 },
 {
  "code": "GB8",
  "zh": "率谷",
  "en": "Leading Valley",
  "pinyin": "shuai gu",
  "region": "head",
  "view": "front",
  "side": "left",
  "meridian": "GB",
  "loc": "在頭部，當耳尖直上入髮際 1.5 寸，角孫直上方。",
  "locEn": "On the head, 1.5 cun directly above the ear apex inside the hairline, directly above 角孫 TE20.",
  "locReview": "source_checked",
  "pos": [
   -0.28,
   3.202,
   0.202
  ]
 },
 {
  "code": "GB9",
  "zh": "天衝",
  "en": "Heavenly Surge",
  "pinyin": "tian chong",
  "region": "head",
  "view": "back",
  "side": "left",
  "meridian": "GB",
  "loc": "在頭部，當耳根後緣直上入髮際 2 寸，率谷後 0.5 寸處。",
  "locEn": "On the head, 2 cun inside the hairline directly above the posterior border of the ear root, 0.5 cun behind 率谷 GB8.",
  "locReview": "source_checked",
  "pos": [
   -0.28,
   3.22,
   -0.118
  ]
 },
 {
  "code": "GB10",
  "zh": "浮白",
  "en": "Floating White",
  "pinyin": "fu bai",
  "region": "behind the ear",
  "view": "back",
  "side": "left",
  "meridian": "GB",
  "loc": "在頭部，當耳後乳突的後上方，天衝與完骨的弧形連線的中三分之一與上三分之一交點处。",
  "locEn": "On the head, postero-superior to the mastoid, at the junction of the upper and middle thirds of the curve from 天衝 GB9 to 完骨 GB12.",
  "locReview": "source_checked",
  "pos": [
   -0.32,
   3.108,
   -0.019
  ]
 },
 {
  "code": "GB11",
  "zh": "頭竅陰",
  "en": "Head Orifice Yin",
  "pinyin": "tou qiao yin",
  "region": "behind the ear",
  "view": "back",
  "side": "left",
  "meridian": "GB",
  "loc": "在頭部，當耳後乳突的後上方，天衝與完骨的中三分之一與下三分之一交點處。",
  "locEn": "On the head, postero-superior to the mastoid, at the junction of the middle and lower thirds of that same curve.",
  "locReview": "source_checked",
  "pos": [
   -0.32,
   2.996,
   -0.012
  ]
 },
 {
  "code": "GB12",
  "zh": "完骨",
  "en": "Completed Bone",
  "pinyin": "wan gu",
  "region": "behind the ear",
  "view": "back",
  "side": "left",
  "meridian": "GB",
  "loc": "在頭部，當耳後乳突的後下方凹陷處。",
  "locEn": "On the head, in the depression postero-inferior to the mastoid process.",
  "locReview": "source_checked",
  "pos": [
   -0.28,
   2.883,
   0.053
  ]
 },
 {
  "code": "GB13",
  "zh": "本神",
  "en": "Root of Spirit",
  "pinyin": "ben shen",
  "region": "head",
  "view": "front",
  "side": "left",
  "meridian": "GB",
  "loc": "在頭部，當前髮際上 0.5 寸，神庭旁開 3 寸，神庭與頭維連線的內三分之二與外三分之一的交點處。",
  "locEn": "On the head, 0.5 cun inside the front hairline and 3 cun lateral to 神庭 GV24, at the junction of the inner two-thirds and outer third of the line from 神庭 to 頭維 ST8.",
  "locReview": "source_checked",
  "pos": [
   -0.16,
   3.35,
   0.293
  ]
 },
 {
  "code": "GB14",
  "zh": "陽白",
  "en": "Yang White",
  "pinyin": "yang bai",
  "region": "face",
  "view": "front",
  "side": "left",
  "meridian": "GB",
  "loc": "在前額部，當瞳孔直上，眉上 1 寸。",
  "locEn": "On the forehead, directly above the pupil, 1 cun above the eyebrow.",
  "locReview": "source_checked",
  "pos": [
   -0.16,
   3.269,
   0.36
  ]
 },
 {
  "code": "GB15",
  "zh": "頭臨泣",
  "en": "Head Governor of Tears",
  "pinyin": "tou lin qi",
  "region": "head",
  "view": "front",
  "side": "left",
  "meridian": "GB",
  "loc": "在頭部，當瞳孔直上入前髮際 0.5 寸，神庭與頭維連線的中點處。",
  "locEn": "On the head, 0.5 cun inside the front hairline directly above the pupil, at the midpoint of the line from 神庭 GV24 to 頭維 ST8.",
  "locReview": "source_checked",
  "pos": [
   -0.16,
   3.35,
   0.293
  ]
 },
 {
  "code": "GB16",
  "zh": "目窗",
  "en": "Window of the Eye",
  "pinyin": "mu chuang",
  "region": "head",
  "view": "front",
  "side": "left",
  "meridian": "GB",
  "loc": "在頭部，當前髮際上 1.5 寸，頭正中線旁開 2.25 寸。",
  "locEn": "On the head, 1.5 cun above the front hairline and 2.25 cun lateral to the midline.",
  "locReview": "source_checked",
  "pos": [
   -0.12,
   3.378,
   0.282
  ]
 },
 {
  "code": "GB17",
  "zh": "正營",
  "en": "Upright Nutrition",
  "pinyin": "zheng ying",
  "region": "head",
  "view": "front",
  "side": "left",
  "meridian": "GB",
  "loc": "在頭部，當前髮際上 2.5 寸，頭正中線旁開 2.25 寸。",
  "locEn": "On the head, 2.5 cun above the front hairline and 2.25 cun lateral to the midline.",
  "locReview": "source_checked",
  "pos": [
   -0.12,
   3.405,
   0.282
  ]
 },
 {
  "code": "GB18",
  "zh": "承靈",
  "en": "Support Spirit",
  "pinyin": "cheng ling",
  "region": "head",
  "view": "front",
  "side": "left",
  "meridian": "GB",
  "loc": "在頭部，當前髮際上 4.0 寸，頭正中線旁開 2.25 寸。",
  "locEn": "On the head, 4 cun above the front hairline and 2.25 cun lateral to the midline.",
  "locReview": "source_checked",
  "pos": [
   -0.12,
   3.446,
   0.225
  ]
 },
 {
  "code": "GB19",
  "zh": "腦空",
  "en": "Brain Hollow",
  "pinyin": "nao kong",
  "region": "occiput",
  "view": "back",
  "side": "left",
  "meridian": "GB",
  "loc": "在頭部，當枕外隆凸的上緣外側，頭正中線旁開 2.25 寸，平腦戶。",
  "locEn": "On the head, lateral to the upper border of the external occipital protuberance, 2.25 cun lateral to the midline, level with 腦戶 GV17.",
  "locReview": "source_checked",
  "pos": [
   -0.12,
   2.907,
   -0.269
  ]
 },
 {
  "code": "GB20",
  "zh": "風池",
  "en": "Wind Pool",
  "pinyin": "feng chi",
  "region": "nape",
  "view": "back",
  "side": "left",
  "meridian": "GB",
  "loc": "在項部，當枕骨之下，與風府相平，胸鎖乳突肌與斜方肌上端之間的凹陷處。",
  "locEn": "On the nape, below the occipital bone and level with 風府 GV16, in the depression between the upper ends of sternocleidomastoid and trapezius.",
  "locReview": "source_checked",
  "pos": [
   -0.16,
   2.846,
   -0.241
  ]
 },
 {
  "code": "GB21",
  "zh": "肩井",
  "en": "Shoulder Well",
  "pinyin": "jian jing",
  "region": "shoulder",
  "view": "back",
  "side": "left",
  "meridian": "GB",
  "loc": "在肩上，前直乳中，當大椎與肩峰端連線的中點上。",
  "locEn": "On the shoulder, directly above the nipple, at the midpoint of the line from 大椎 GV14 to the acromion.",
  "locReview": "source_checked",
  "pos": [
   -0.48,
   2.421,
   -0.338
  ]
 },
 {
  "code": "GB22",
  "zh": "淵腋",
  "en": "Armpit Abyss",
  "pinyin": "yuan ye",
  "region": "lateral thorax",
  "view": "front",
  "side": "left",
  "meridian": "GB",
  "loc": "在側胸部，舉臂，當腋中線上，腋下 3 寸，第 4 肋間隙中。",
  "locEn": "On the lateral chest with the arm raised, on the mid-axillary line 3 cun below the axilla, in the 4th intercostal space.",
  "locReview": "source_checked",
  "pos": [
   -0.92,
   1.76,
   0.128
  ]
 },
 {
  "code": "GB23",
  "zh": "輒筋",
  "en": "Flank Sinews",
  "pinyin": "zhe jin",
  "region": "lateral thorax",
  "view": "front",
  "side": "left",
  "meridian": "GB",
  "loc": "在側胸部，淵腋前 1 寸，平乳頭，第 4 肋間隙中。",
  "locEn": "On the lateral chest, 1 cun in front of 淵腋 GB22, level with the nipple, in the 4th intercostal space.",
  "locReview": "source_checked",
  "pos": [
   -0.8,
   1.76,
   0.145
  ]
 },
 {
  "code": "GB24",
  "zh": "日月",
  "en": "Sun and Moon",
  "pinyin": "ri yue",
  "region": "upper abdomen",
  "view": "front",
  "side": "left",
  "meridian": "GB",
  "loc": "在上腹部，當乳頭直下，第七肋間隙，前正中線旁開 4 寸。",
  "locEn": "On the upper abdomen, directly below the nipple in the 7th intercostal space, 4 cun lateral to the anterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.52,
   1.334,
   0.34
  ]
 },
 {
  "code": "GB25",
  "zh": "京門",
  "en": "Capital Gate",
  "pinyin": "jing men",
  "region": "lateral waist",
  "view": "back",
  "side": "left",
  "meridian": "GB",
  "loc": "在側腰部，章門後 1.8 寸，當第十二肋骨游離端的下方。",
  "locEn": "On the lateral waist, 1.8 cun behind 章門 LR13, below the free end of the 12th rib.",
  "locReview": "source_checked",
  "pos": [
   -0.56,
   0.906,
   -0.13
  ]
 },
 {
  "code": "GB26",
  "zh": "帶脈",
  "en": "Girdle Vessel",
  "pinyin": "dai mai",
  "region": "lateral abdomen",
  "view": "front",
  "side": "left",
  "meridian": "GB",
  "loc": "在側腹部，章門下 1.8 寸，當第十一肋骨游離端下方垂線與臍水平線的交點上。",
  "locEn": "On the lateral abdomen, 1.8 cun below 章門 LR13, where the vertical line below the free end of the 11th rib meets the horizontal line through the umbilicus.",
  "locReview": "source_checked",
  "pos": [
   -0.52,
   0.77,
   0.326
  ]
 },
 {
  "code": "GB27",
  "zh": "五樞",
  "en": "Five Pivots",
  "pinyin": "wu shu",
  "region": "lateral abdomen",
  "view": "front",
  "side": "left",
  "meridian": "GB",
  "loc": "在側腹部，當髂前上棘的前方，橫平臍下 3 寸處。",
  "locEn": "On the lateral abdomen, in front of the anterior superior iliac spine, level with a point 3 cun below the umbilicus.",
  "locReview": "source_checked",
  "pos": [
   -0.6,
   0.236,
   0.323
  ]
 },
 {
  "code": "GB28",
  "zh": "維道",
  "en": "Maintaining Way",
  "pinyin": "wei dao",
  "region": "lateral abdomen",
  "view": "front",
  "side": "left",
  "meridian": "GB",
  "loc": "在側腹部，當髂前上棘的前下方，五樞前下 0.5 寸。",
  "locEn": "On the lateral abdomen, antero-inferior to the anterior superior iliac spine, 0.5 cun antero-inferior to 五樞 GB27.",
  "locReview": "source_checked",
  "pos": [
   -0.64,
   0.147,
   0.298
  ]
 },
 {
  "code": "GB29",
  "zh": "居髎",
  "en": "Dwelling Bone",
  "pinyin": "ju liao",
  "region": "hip",
  "view": "back",
  "side": "left",
  "meridian": "GB",
  "loc": "在髖部，當髂前上棘與股骨大轉子最凸點連線的中點處。",
  "locEn": "At the hip, at the midpoint of the line from the anterior superior iliac spine to the most prominent point of the greater trochanter.",
  "locReview": "source_checked",
  "pos": [
   -0.52,
   -0.157,
   -0.369
  ]
 },
 {
  "code": "GB30",
  "zh": "環跳",
  "en": "Jumping Circle",
  "pinyin": "huan tiao",
  "region": "hip",
  "view": "back",
  "side": "left",
  "meridian": "GB",
  "loc": "在股外側部，側臥屈股，當股骨大轉子最凸點與骶管裂孔連線的外三分之一與中三分之一交點處。",
  "locEn": "On the lateral thigh, lying on the side with the hip flexed, at the junction of the outer third and middle third of the line from the most prominent point of the greater trochanter to the sacral hiatus.",
  "locReview": "source_checked",
  "pos": [
   -0.6,
   -0.064,
   -0.337
  ]
 },
 {
  "code": "GB31",
  "zh": "風市",
  "en": "Wind Market",
  "pinyin": "feng shi",
  "region": "lateral thigh",
  "view": "back",
  "side": "left",
  "meridian": "GB",
  "loc": "在大腿外側部的中線上，當膕橫紋上 7 寸。或直立垂手時，中指尖處。",
  "locEn": "On the midline of the lateral thigh, 7 cun above the popliteal crease; or where the middle fingertip rests when standing with the arms hanging.",
  "locReview": "source_checked",
  "pos": [
   -0.48,
   -0.985,
   -0.249
  ]
 },
 {
  "code": "GB32",
  "zh": "中瀆",
  "en": "Middle Ditch",
  "pinyin": "zhong du",
  "region": "lateral thigh",
  "view": "back",
  "side": "left",
  "meridian": "GB",
  "loc": "在大腿外側，當風市下 2 寸，或膕橫紋上 5 寸，股外側肌與股二頭肌之間。",
  "locEn": "On the lateral thigh, 2 cun below 風市 GB31 (5 cun above the popliteal crease), between vastus lateralis and biceps femoris.",
  "locReview": "source_checked",
  "pos": [
   -0.52,
   -1.144,
   -0.243
  ]
 },
 {
  "code": "GB33",
  "zh": "膝陽關",
  "en": "Knee Yang Gate",
  "pinyin": "xi yang guan",
  "region": "knee",
  "view": "back",
  "side": "left",
  "meridian": "GB",
  "loc": "在膝外側，當陽陵泉上 3 寸，股骨外上髁上方的凹陷處。",
  "locEn": "On the lateral knee, 3 cun above 陽陵泉 GB34, in the depression above the lateral epicondyle of the femur.",
  "locReview": "source_checked",
  "pos": [
   -0.56,
   -1.462,
   -0.372
  ]
 },
 {
  "code": "GB34",
  "zh": "陽陵泉",
  "en": "Yang Mound Spring",
  "pinyin": "yang ling quan",
  "region": "lower leg",
  "view": "back",
  "side": "left",
  "meridian": "GB",
  "loc": "在小腿外側，當腓骨頭前下方凹陷處。",
  "locEn": "On the lateral lower leg, in the depression antero-inferior to the head of the fibula.",
  "locReview": "source_checked",
  "pos": [
   -0.6,
   -1.7,
   -0.472
  ]
 },
 {
  "code": "GB35",
  "zh": "陽交",
  "en": "Yang Intersection",
  "pinyin": "yang jiao",
  "region": "lower leg",
  "view": "back",
  "side": "left",
  "meridian": "GB",
  "loc": "在小腿外側，當外踝尖上 7 寸，腓骨後緣。",
  "locEn": "On the lateral lower leg, 7 cun above the tip of the lateral malleolus, at the posterior border of the fibula.",
  "locReview": "source_checked",
  "pos": [
   -0.68,
   -2.254,
   -0.48
  ]
 },
 {
  "code": "GB36",
  "zh": "外丘",
  "en": "Outer Mound",
  "pinyin": "wai qiu",
  "region": "lower leg",
  "view": "back",
  "side": "left",
  "meridian": "GB",
  "loc": "在小腿外側，當外踝尖上 7 寸，腓骨前緣，平陽交。",
  "locEn": "On the lateral lower leg, 7 cun above the tip of the lateral malleolus, at the anterior border of the fibula, level with 陽交 GB35.",
  "locReview": "source_checked",
  "pos": [
   -0.68,
   -2.254,
   -0.48
  ]
 },
 {
  "code": "GB37",
  "zh": "光明",
  "en": "Bright Light",
  "pinyin": "guang ming",
  "region": "lower leg",
  "view": "back",
  "side": "left",
  "meridian": "GB",
  "loc": "在小腿外側，當外踝尖上 5 寸，腓骨前緣。",
  "locEn": "On the lateral lower leg, 5 cun above the tip of the lateral malleolus, at the anterior border of the fibula.",
  "locReview": "source_checked",
  "pos": [
   -0.68,
   -2.413,
   -0.471
  ]
 },
 {
  "code": "GB38",
  "zh": "陽輔",
  "en": "Yang Assistance",
  "pinyin": "yang fu",
  "region": "lower leg",
  "view": "back",
  "side": "left",
  "meridian": "GB",
  "loc": "在小腿外側，當外踝尖上 4 寸，腓骨前緣稍前方。",
  "locEn": "On the lateral lower leg, 4 cun above the tip of the lateral malleolus, slightly anterior to the anterior border of the fibula.",
  "locReview": "source_checked",
  "pos": [
   -0.72,
   -2.492,
   -0.467
  ]
 },
 {
  "code": "GB39",
  "zh": "懸鐘",
  "en": "Suspended Bell",
  "pinyin": "xuan zhong",
  "region": "lower leg",
  "view": "back",
  "side": "left",
  "meridian": "GB",
  "loc": "在小腿外側，當外踝尖上 3 寸，腓骨前緣。",
  "locEn": "On the lateral lower leg, 3 cun above the tip of the lateral malleolus, at the anterior border of the fibula.",
  "locReview": "source_checked",
  "pos": [
   -0.72,
   -2.571,
   -0.471
  ]
 },
 {
  "code": "GB40",
  "zh": "丘墟",
  "en": "Mound Ruins",
  "pinyin": "qiu xu",
  "region": "ankle",
  "view": "back",
  "side": "left",
  "meridian": "GB",
  "loc": "在踝區，外踝的前下方，當趾長伸肌腱的外側凹陷處。",
  "locEn": "At the ankle, antero-inferior to the lateral malleolus, in the depression lateral to the tendon of extensor digitorum longus.",
  "locReview": "source_checked",
  "pos": [
   -0.76,
   -2.841,
   -0.517
  ]
 },
 {
  "code": "GB41",
  "zh": "足臨泣",
  "en": "Foot Governor of Tears",
  "pinyin": "zu lin qi",
  "region": "foot",
  "view": "front",
  "side": "left",
  "meridian": "GB",
  "loc": "在足背外側，當足 4 趾本節（第 4 蹠趾關節）的後方，第 5 趾長伸肌腱外側凹陷處。",
  "locEn": "On the dorsum of the foot, proximal to the 4th metatarsophalangeal joint, in the depression lateral to the tendon of extensor digiti minimi.",
  "locReview": "source_checked",
  "pos": [
   -0.76,
   -3.011,
   0.073
  ]
 },
 {
  "code": "GB42",
  "zh": "地五會",
  "en": "Earth Five Meetings",
  "pinyin": "di wu hui",
  "region": "foot",
  "view": "front",
  "side": "left",
  "meridian": "GB",
  "loc": "在足背外側，當足 4 趾本節（第 4 蹠趾關節）的後方，第 4、5 蹠骨之間，小趾伸肌腱的內側緣。",
  "locEn": "On the dorsum of the foot, proximal to the 4th metatarsophalangeal joint, between the 4th and 5th metatarsals, at the medial border of the extensor digiti minimi tendon.",
  "locReview": "source_checked",
  "pos": [
   -0.76,
   -3.027,
   0.193
  ]
 },
 {
  "code": "GB43",
  "zh": "俠溪",
  "en": "Pinched Stream",
  "pinyin": "xia xi",
  "region": "foot",
  "view": "front",
  "side": "left",
  "meridian": "GB",
  "loc": "在足背外側，當第 4、5 趾間，趾蹼緣後方赤白肉際處。",
  "locEn": "On the dorsum of the foot, between the 4th and 5th toes, proximal to the web margin at the border between red and white flesh.",
  "locReview": "source_checked",
  "pos": [
   -0.76,
   -3.05,
   0.193
  ]
 },
 {
  "code": "GB44",
  "zh": "足竅陰",
  "en": "Foot Orifice Yin",
  "pinyin": "zu qiao yin",
  "region": "little toe",
  "view": "front",
  "side": "left",
  "meridian": "GB",
  "loc": "在足第 4 趾末節外側，距趾甲角 0.1 寸（指寸）。",
  "locEn": "On the lateral side of the tip of the 4th toe, 0.1 cun from the corner of the nail.",
  "locReview": "source_checked",
  "pos": [
   -0.76,
   -3.05,
   0.193
  ]
 },
 {
  "code": "LR1",
  "zh": "大敦",
  "en": "Big Mound",
  "pinyin": "da dun",
  "region": "great toe",
  "view": "front",
  "side": "right",
  "meridian": "LR",
  "loc": "足大趾外側，趾甲根角旁 0.1 寸（約 0.2 cm），赤白肉際處。",
  "locEn": "On the lateral side of the great toe, 0.1 cun from the corner of the nail, at the border between red and white flesh.",
  "locReview": "source_checked",
  "pos": [
   0.76,
   -3.05,
   0.193
  ]
 },
 {
  "code": "LR2",
  "zh": "行間",
  "en": "Moving Between",
  "pinyin": "xing jian",
  "region": "foot",
  "view": "front",
  "side": "right",
  "meridian": "LR",
  "loc": "足背第 1、2 趾之間，趾蹼緣後方赤白肉際處。",
  "locEn": "On the dorsum of the foot between the 1st and 2nd toes, proximal to the web margin at the border between red and white flesh.",
  "locReview": "source_checked",
  "pos": [
   0.76,
   -3.05,
   0.193
  ]
 },
 {
  "code": "LR3",
  "zh": "太衝",
  "en": "Supreme Surge",
  "pinyin": "tai chong",
  "region": "foot",
  "view": "front",
  "side": "right",
  "meridian": "LR",
  "loc": "足背第 1、2 蹠骨間，第 1 蹠骨間隙後方凹陷處（約足背高點）。",
  "locEn": "On the dorsum of the foot between the 1st and 2nd metatarsals, in the depression proximal to their junction — about the highest point of the instep.",
  "locReview": "source_checked",
  "pos": [
   0.76,
   -3.01,
   0.073
  ]
 },
 {
  "code": "LR4",
  "zh": "中封",
  "en": "Mound Center",
  "pinyin": "zhong feng",
  "region": "ankle",
  "view": "front",
  "side": "right",
  "meridian": "LR",
  "loc": "內踝前 1 寸，脛骨前肌腱內側凹陷處（踝前橫紋內端）。",
  "locEn": "1 cun in front of the medial malleolus, in the depression medial to the tibialis anterior tendon, at the medial end of the anterior ankle crease.",
  "locReview": "source_checked",
  "pos": [
   0.76,
   -2.858,
   -0.105
  ]
 },
 {
  "code": "LR5",
  "zh": "蠡溝",
  "en": "Spider's Web Ditch",
  "pinyin": "li gou",
  "region": "lower leg",
  "view": "front",
  "side": "right",
  "meridian": "LR",
  "loc": "內踝尖上 5 寸，脛骨內側面的中央（沿脛骨內側緣向上取）。",
  "locEn": "5 cun above the tip of the medial malleolus, on the centre of the medial surface of the tibia.",
  "locReview": "source_checked",
  "pos": [
   0.68,
   -2.323,
   -0.121
  ]
 },
 {
  "code": "LR6",
  "zh": "中都",
  "en": "Central Capital",
  "pinyin": "zhong du",
  "region": "lower leg",
  "view": "front",
  "side": "right",
  "meridian": "LR",
  "loc": "內踝尖上 7 寸，脛骨內側面的中央（蠡溝上 2 寸）。",
  "locEn": "7 cun above the tip of the medial malleolus (2 cun above 蠡溝 LR5), on the centre of the medial surface of the tibia.",
  "locReview": "source_checked",
  "pos": [
   0.64,
   -2.128,
   -0.082
  ]
 },
 {
  "code": "LR7",
  "zh": "膝關",
  "en": "Knee Gate",
  "pinyin": "xi guan",
  "region": "knee",
  "view": "front",
  "side": "right",
  "meridian": "LR",
  "loc": "脛骨內側髁後下方凹陷處，陰陵泉（SP9）後 1 寸，屈膝取之。",
  "locEn": "In the depression postero-inferior to the medial condyle of the tibia, 1 cun behind 陰陵泉 SP9; located with the knee flexed.",
  "locReview": "source_checked",
  "pos": [
   0.56,
   -1.661,
   0.059
  ]
 },
 {
  "code": "LR8",
  "zh": "曲泉",
  "en": "Crooked Spring",
  "pinyin": "qu quan",
  "region": "knee",
  "view": "front",
  "side": "right",
  "meridian": "LR",
  "loc": "膝內側，膕橫紋內側端，半腱肌肌腱與半膜肌肌腱之間的凹陷處；屈膝取之。",
  "locEn": "On the medial knee, at the medial end of the popliteal crease, in the depression between the semitendinosus and semimembranosus tendons; located with the knee flexed.",
  "locReview": "source_checked",
  "pos": [
   0.56,
   -1.546,
   0.1
  ]
 },
 {
  "code": "LR9",
  "zh": "陰包",
  "en": "Yin Wrap",
  "pinyin": "yin bao",
  "region": "thigh",
  "view": "front",
  "side": "right",
  "meridian": "LR",
  "loc": "股骨內上髁上方 4 寸，股內側肌與縫匠肌之間的凹陷處。",
  "locEn": "4 cun above the medial epicondyle of the femur, in the groove between vastus medialis and sartorius.",
  "locReview": "source_checked",
  "pos": [
   0.52,
   -1.201,
   0.258
  ]
 },
 {
  "code": "LR10",
  "zh": "足五里",
  "en": "Leg Five Miles",
  "pinyin": "zu wu li",
  "region": "thigh",
  "view": "front",
  "side": "right",
  "meridian": "LR",
  "loc": "氣衝（ST30）下 3 寸，恥骨聯合上緣旁開 2 寸，股動脈搏動處的外側（髂腹股溝神經分布區）。",
  "locEn": "3 cun below 氣衝 ST30, 2 cun lateral to the upper border of the pubic symphysis, lateral to the femoral pulse.",
  "locReview": "source_checked",
  "pos": [
   0.44,
   -0.4,
   0.378
  ]
 },
 {
  "code": "LR11",
  "zh": "陰廉",
  "en": "Yin Corner",
  "pinyin": "yin lian",
  "region": "thigh",
  "view": "front",
  "side": "right",
  "meridian": "LR",
  "loc": "氣衝（ST30）下 2 寸，恥骨聯合上緣旁開 2 寸，足五里上 1 寸處。",
  "locEn": "2 cun below 氣衝 ST30 and 1 cun above 足五里 LR10, 2 cun lateral to the upper border of the pubic symphysis.",
  "locReview": "source_checked",
  "pos": [
   0.44,
   -0.319,
   0.381
  ]
 },
 {
  "code": "LR12",
  "zh": "急脈",
  "en": "Ji Mai",
  "pinyin": "ji mai",
  "region": "groin",
  "view": "front",
  "side": "right",
  "meridian": "LR",
  "loc": "恥骨聯合下緣旁開 2.5 寸，腹股溝動脈搏動處（股動脈經過處），前正線外側。",
  "locEn": "2.5 cun lateral to the lower border of the pubic symphysis, at the inguinal pulse where the femoral artery passes, lateral to the anterior midline.",
  "locReview": "source_checked",
  "pos": [
   0.32,
   -0.195,
   0.36
  ]
 },
 {
  "code": "LR13",
  "zh": "章門",
  "en": "Chapter Gate",
  "pinyin": "zhang men",
  "region": "lateral abdomen",
  "view": "front",
  "side": "right",
  "meridian": "LR",
  "loc": "第 11 肋遊離端下方（肋弓下緣），前正中線旁開 4 寸；約腋中線與肋弓交點處。",
  "locEn": "Below the free end of the 11th rib at the lower border of the costal arch, 4 cun lateral to the anterior midline — about where the mid-axillary line meets the costal arch.",
  "locReview": "source_checked",
  "pos": [
   0.52,
   1.192,
   0.31
  ]
 },
 {
  "code": "LR14",
  "zh": "期門",
  "en": "Cycle Gate",
  "pinyin": "qi men",
  "region": "chest",
  "view": "front",
  "side": "right",
  "meridian": "LR",
  "loc": "乳頭直下第 6 肋間隙，前正中線旁開 4 寸；約與巨闕（CV14）同一水平。",
  "locEn": "Directly below the nipple in the 6th intercostal space, 4 cun lateral to the anterior midline; roughly level with 巨闕 CV14.",
  "locReview": "source_checked",
  "pos": [
   0.52,
   1.476,
   0.352
  ]
 },
 {
  "code": "CV1",
  "zh": "會陰",
  "en": "Yin Meeting",
  "pinyin": "hui yin",
  "region": "perineum",
  "view": "front",
  "side": "midline",
  "meridian": "CV",
  "loc": "在會陰區，男性在陰囊根部與肛門連線的中點，女性在大陰唇後聯合與肛門連線的中點。",
  "locEn": "In the perineum: in men at the midpoint between the root of the scrotum and the anus; in women at the midpoint between the posterior commissure of the labia majora and the anus.",
  "locReview": "source_checked",
  "pos": [
   -0.0,
   -0.283,
   0.122
  ]
 },
 {
  "code": "CV2",
  "zh": "曲骨",
  "en": "Crooked Bone",
  "pinyin": "qu gu",
  "region": "lower abdomen",
  "view": "front",
  "side": "midline",
  "meridian": "CV",
  "loc": "在下腹部，恥骨聯合上緣，前正中線上。",
  "locEn": "On the lower abdomen, on the anterior midline at the upper border of the pubic symphysis.",
  "locReview": "source_checked",
  "pos": [
   -0.0,
   -0.12,
   0.405
  ]
 },
 {
  "code": "CV3",
  "zh": "中極",
  "en": "Middle Extremity",
  "pinyin": "zhong ji",
  "region": "lower abdomen",
  "view": "front",
  "side": "midline",
  "meridian": "CV",
  "loc": "在下腹部，臍中下 4 寸，前正中線上。",
  "locEn": "On the lower abdomen, 4 cun below the umbilicus on the anterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.0,
   0.058,
   0.399
  ]
 },
 {
  "code": "CV4",
  "zh": "關元",
  "en": "Origin Pass",
  "pinyin": "guan yuan",
  "region": "lower abdomen",
  "view": "front",
  "side": "midline",
  "meridian": "CV",
  "loc": "在下腹部，臍中下 3 寸，前正中線上。",
  "locEn": "On the lower abdomen, 3 cun below the umbilicus on the anterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.0,
   0.236,
   0.462
  ]
 },
 {
  "code": "CV5",
  "zh": "石門",
  "en": "Stone Gate",
  "pinyin": "shi men",
  "region": "lower abdomen",
  "view": "front",
  "side": "midline",
  "meridian": "CV",
  "loc": "在下腹部，臍中下 2 寸，前正中線上。",
  "locEn": "On the lower abdomen, 2 cun below the umbilicus on the anterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.0,
   0.414,
   0.506
  ]
 },
 {
  "code": "CV6",
  "zh": "氣海",
  "en": "Sea of Qi",
  "pinyin": "qi hai",
  "region": "lower abdomen",
  "view": "front",
  "side": "midline",
  "meridian": "CV",
  "loc": "在下腹部，臍中下 1.5 寸，前正中線上。",
  "locEn": "On the lower abdomen, 1.5 cun below the umbilicus on the anterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.0,
   0.503,
   0.524
  ]
 },
 {
  "code": "CV7",
  "zh": "陰交",
  "en": "Yin Intersection",
  "pinyin": "yin jiao",
  "region": "lower abdomen",
  "view": "front",
  "side": "midline",
  "meridian": "CV",
  "loc": "在下腹部，臍中下 1 寸，前正中線上。",
  "locEn": "On the lower abdomen, 1 cun below the umbilicus on the anterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.0,
   0.592,
   0.535
  ]
 },
 {
  "code": "CV8",
  "zh": "神闕",
  "en": "Spirit Palace",
  "pinyin": "shen que",
  "region": "abdomen",
  "view": "front",
  "side": "midline",
  "meridian": "CV",
  "loc": "在臍區，臍中央。",
  "locEn": "At the centre of the umbilicus.",
  "locReview": "source_checked",
  "pos": [
   -0.0,
   0.77,
   0.55
  ]
 },
 {
  "code": "CV9",
  "zh": "水分",
  "en": "Water Division",
  "pinyin": "shui fen",
  "region": "upper abdomen",
  "view": "front",
  "side": "midline",
  "meridian": "CV",
  "loc": "在上腹部，臍中上 1 寸，前正中線上。",
  "locEn": "On the upper abdomen, 1 cun above the umbilicus on the anterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.0,
   0.86,
   0.557
  ]
 },
 {
  "code": "CV10",
  "zh": "下脘",
  "en": "Lower Epigastrium",
  "pinyin": "xia wan",
  "region": "upper abdomen",
  "view": "front",
  "side": "midline",
  "meridian": "CV",
  "loc": "在上腹部，臍中上 2 寸，前正中線上。",
  "locEn": "On the upper abdomen, 2 cun above the umbilicus on the anterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.0,
   0.951,
   0.554
  ]
 },
 {
  "code": "CV11",
  "zh": "建里",
  "en": "Internal Foundation",
  "pinyin": "jian li",
  "region": "upper abdomen",
  "view": "front",
  "side": "midline",
  "meridian": "CV",
  "loc": "在上腹部，臍中上 3 寸，前正中線上。",
  "locEn": "On the upper abdomen, 3 cun above the umbilicus on the anterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.0,
   1.041,
   0.546
  ]
 },
 {
  "code": "CV12",
  "zh": "中脘",
  "en": "Middle Epigastrium",
  "pinyin": "zhong wan",
  "region": "upper abdomen",
  "view": "front",
  "side": "midline",
  "meridian": "CV",
  "loc": "在上腹部，臍中上 4 寸，前正中線上（胸劍聯合與臍中連線的中點處）。",
  "locEn": "On the upper abdomen, 4 cun above the umbilicus on the anterior midline — the midpoint between the xiphisternal junction and the umbilicus.",
  "locReview": "source_checked",
  "pos": [
   -0.0,
   1.131,
   0.538
  ]
 },
 {
  "code": "CV13",
  "zh": "上脘",
  "en": "Upper Epigastrium",
  "pinyin": "shang wan",
  "region": "upper abdomen",
  "view": "front",
  "side": "midline",
  "meridian": "CV",
  "loc": "在上腹部，臍中上 5 寸，前正中線上。",
  "locEn": "On the upper abdomen, 5 cun above the umbilicus on the anterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.0,
   1.222,
   0.534
  ]
 },
 {
  "code": "CV14",
  "zh": "巨闕",
  "en": "Great Palace",
  "pinyin": "ju que",
  "region": "epigastrium",
  "view": "front",
  "side": "midline",
  "meridian": "CV",
  "loc": "在上腹部，臍中上 6 寸，前正中線上。",
  "locEn": "On the upper abdomen, 6 cun above the umbilicus on the anterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.0,
   1.312,
   0.53
  ]
 },
 {
  "code": "CV15",
  "zh": "鳩尾",
  "en": "Bird Tail",
  "pinyin": "jiu wei",
  "region": "epigastrium",
  "view": "front",
  "side": "midline",
  "meridian": "CV",
  "loc": "在上腹部，胸劍結合部下 1 寸，前正中線上。",
  "locEn": "On the upper abdomen, 1 cun below the xiphisternal junction, on the anterior midline.",
  "locReview": "source_checked",
  "pos": [
   -0.0,
   1.402,
   0.524
  ]
 },
 {
  "code": "CV16",
  "zh": "中庭",
  "en": "Central Courtyard",
  "pinyin": "zhong ting",
  "region": "chest",
  "view": "front",
  "side": "midline",
  "meridian": "CV",
  "loc": "在胸部，前正中線上，平第 5 肋間隙，即胸劍結合部。",
  "locEn": "On the chest, on the anterior midline level with the 5th intercostal space — the xiphisternal junction.",
  "locReview": "source_checked",
  "pos": [
   -0.0,
   1.493,
   0.518
  ]
 },
 {
  "code": "CV17",
  "zh": "膻中",
  "en": "Middle of the Chest",
  "pinyin": "dan zhong",
  "region": "chest",
  "view": "front",
  "side": "midline",
  "meridian": "CV",
  "loc": "在胸部，前正中線上，平第 4 肋間隙，兩乳頭連線的中點處。",
  "locEn": "On the chest, on the anterior midline level with the 4th intercostal space, at the midpoint of the line between the nipples.",
  "locReview": "source_checked",
  "pos": [
   -0.0,
   1.76,
   0.467
  ]
 },
 {
  "code": "CV18",
  "zh": "玉堂",
  "en": "Jade Hall",
  "pinyin": "yu tang",
  "region": "chest",
  "view": "front",
  "side": "midline",
  "meridian": "CV",
  "loc": "在胸部，前正中線上，平第 3 肋間隙。",
  "locEn": "On the chest, on the anterior midline level with the 3rd intercostal space.",
  "locReview": "source_checked",
  "pos": [
   -0.0,
   1.901,
   0.425
  ]
 },
 {
  "code": "CV19",
  "zh": "紫宮",
  "en": "Violet Palace",
  "pinyin": "zi gong",
  "region": "chest",
  "view": "front",
  "side": "midline",
  "meridian": "CV",
  "loc": "在胸部，前正中線上，平第 2 肋間隙。",
  "locEn": "On the chest, on the anterior midline level with the 2nd intercostal space.",
  "locReview": "source_checked",
  "pos": [
   -0.0,
   2.043,
   0.38
  ]
 },
 {
  "code": "CV20",
  "zh": "華蓋",
  "en": "Splendid Canopy",
  "pinyin": "hua gai",
  "region": "chest",
  "view": "front",
  "side": "midline",
  "meridian": "CV",
  "loc": "在胸部，前正中線上，平第 1 肋間隙。",
  "locEn": "On the chest, on the anterior midline level with the 1st intercostal space.",
  "locReview": "source_checked",
  "pos": [
   -0.0,
   2.184,
   0.303
  ]
 },
 {
  "code": "CV21",
  "zh": "璇璣",
  "en": "Jade Rotator",
  "pinyin": "xuan ji",
  "region": "chest",
  "view": "front",
  "side": "midline",
  "meridian": "CV",
  "loc": "在胸部，前正中線上，天突下 1 寸（胸骨上窩中央下 1 寸）。",
  "locEn": "On the chest, on the anterior midline 1 cun below 天突 CV22 — 1 cun below the centre of the suprasternal fossa.",
  "locReview": "source_checked",
  "pos": [
   -0.0,
   2.2,
   0.303
  ]
 },
 {
  "code": "CV22",
  "zh": "天突",
  "en": "Heaven Projection",
  "pinyin": "tian tu",
  "region": "neck",
  "view": "front",
  "side": "midline",
  "meridian": "CV",
  "loc": "在頸部，前正中線上，胸骨上窩中央。",
  "locEn": "On the neck, on the anterior midline at the centre of the suprasternal fossa.",
  "locReview": "source_checked",
  "pos": [
   -0.0,
   2.289,
   0.252
  ]
 },
 {
  "code": "CV23",
  "zh": "廉泉",
  "en": "Lateral Spring",
  "pinyin": "lian quan",
  "region": "neck",
  "view": "front",
  "side": "midline",
  "meridian": "CV",
  "loc": "在頸部，前正中線上，結喉上方，舌骨上緣凹陷處。",
  "locEn": "On the neck, on the anterior midline above the laryngeal prominence, in the depression at the upper border of the hyoid bone.",
  "locReview": "source_checked",
  "pos": [
   -0.0,
   2.743,
   0.391
  ]
 },
 {
  "code": "CV24",
  "zh": "承漿",
  "en": "Saliva Container",
  "pinyin": "cheng jiang",
  "region": "face",
  "view": "front",
  "side": "midline",
  "meridian": "CV",
  "loc": "在面部，當頦唇溝的正中凹陷處。",
  "locEn": "On the face, in the depression at the centre of the mentolabial groove.",
  "locReview": "source_checked",
  "pos": [
   -0.0,
   2.855,
   0.437
  ]
 },
 {
  "code": "GV1",
  "zh": "長強",
  "en": "Long Strength",
  "pinyin": "chang qiang",
  "region": "sacrum",
  "view": "back",
  "side": "midline",
  "meridian": "GV",
  "loc": "在會陰區，尾骨下方，尾骨端與肛門連線的中點處。",
  "locEn": "In the perineal region below the coccyx, at the midpoint between the tip of the coccyx and the anus.",
  "locReview": "source_checked",
  "pos": [
   -0.0,
   -0.302,
   -0.128
  ]
 },
 {
  "code": "GV2",
  "zh": "腰俞",
  "en": "Lumbar Shu",
  "pinyin": "yao shu",
  "region": "sacrum",
  "view": "back",
  "side": "midline",
  "meridian": "GV",
  "loc": "在骶部，後正中線上，適對骶管裂孔（臀裂正上方凹陷處）。",
  "locEn": "On the sacrum, on the posterior midline at the sacral hiatus — the depression directly above the gluteal cleft.",
  "locReview": "source_checked",
  "pos": [
   -0.0,
   -0.167,
   0.184
  ]
 },
 {
  "code": "GV3",
  "zh": "腰陽關",
  "en": "Lumbar Yang Gate",
  "pinyin": "yao yang guan",
  "region": "lower back",
  "view": "back",
  "side": "midline",
  "meridian": "GV",
  "loc": "在腰部，後正中線上，第 4 腰椎棘突下凹陷中（約與兩髂嵴最高點連線平齊）。",
  "locEn": "On the lower back, on the posterior midline in the depression below the spinous process of L4, roughly level with the highest points of the iliac crests.",
  "locReview": "source_checked",
  "pos": [
   -0.0,
   0.557,
   -0.409
  ]
 },
 {
  "code": "GV4",
  "zh": "命門",
  "en": "Life Gate",
  "pinyin": "ming men",
  "region": "lower back",
  "view": "back",
  "side": "midline",
  "meridian": "GV",
  "loc": "在腰部，後正中線上，第 2 腰椎棘突下凹陷中（約與肚臍正對後背）。",
  "locEn": "On the lower back, on the posterior midline in the depression below the spinous process of L2, roughly opposite the umbilicus.",
  "locReview": "source_checked",
  "pos": [
   -0.0,
   0.838,
   -0.326
  ]
 },
 {
  "code": "GV5",
  "zh": "懸樞",
  "en": "Suspended Pivot",
  "pinyin": "xuan shu",
  "region": "lower back",
  "view": "back",
  "side": "midline",
  "meridian": "GV",
  "loc": "在腰部，後正中線上，第 1 腰椎棘突下凹陷中。",
  "locEn": "On the lower back, on the posterior midline in the depression below the spinous process of L1.",
  "locReview": "source_checked",
  "pos": [
   -0.0,
   0.98,
   -0.356
  ]
 },
 {
  "code": "GV6",
  "zh": "脊中",
  "en": "Middle of the Spine",
  "pinyin": "ji zhong",
  "region": "mid back",
  "view": "back",
  "side": "midline",
  "meridian": "GV",
  "loc": "在背部，後正中線上，第 11 胸椎棘突下凹陷中。",
  "locEn": "On the back, on the posterior midline in the depression below the spinous process of T11.",
  "locReview": "source_checked",
  "pos": [
   -0.0,
   1.236,
   -0.412
  ]
 },
 {
  "code": "GV7",
  "zh": "中樞",
  "en": "Central Pivot",
  "pinyin": "zhong shu",
  "region": "mid back",
  "view": "back",
  "side": "midline",
  "meridian": "GV",
  "loc": "在背部，後正中線上，第 10 胸椎棘突下凹陷中。",
  "locEn": "On the back, on the posterior midline in the depression below the spinous process of T10.",
  "locReview": "source_checked",
  "pos": [
   -0.0,
   1.352,
   -0.423
  ]
 },
 {
  "code": "GV8",
  "zh": "筋縮",
  "en": "Tendon Contraction",
  "pinyin": "jin suo",
  "region": "mid back",
  "view": "back",
  "side": "midline",
  "meridian": "GV",
  "loc": "在背部，後正中線上，第 9 胸椎棘突下凹陷中。",
  "locEn": "On the back, on the posterior midline in the depression below the spinous process of T9.",
  "locReview": "source_checked",
  "pos": [
   -0.0,
   1.467,
   -0.436
  ]
 },
 {
  "code": "GV9",
  "zh": "至陽",
  "en": "Ultimate Yang",
  "pinyin": "zhi yang",
  "region": "mid back",
  "view": "back",
  "side": "midline",
  "meridian": "GV",
  "loc": "在背部，後正中線上，第 7 胸椎棘突下凹陷中（約與兩肩胛骨下角連線中點平齊）。",
  "locEn": "On the back, on the posterior midline in the depression below the spinous process of T7, roughly level with the midpoint of the line joining the inferior angles of the scapulae.",
  "locReview": "source_checked",
  "pos": [
   -0.0,
   1.698,
   -0.468
  ]
 },
 {
  "code": "GV10",
  "zh": "靈台",
  "en": "Spirit Platform",
  "pinyin": "ling tai",
  "region": "mid back",
  "view": "back",
  "side": "midline",
  "meridian": "GV",
  "loc": "在背部，後正中線上，第 6 胸椎棘突下凹陷中。",
  "locEn": "On the back, on the posterior midline in the depression below the spinous process of T6.",
  "locReview": "source_checked",
  "pos": [
   -0.0,
   1.813,
   -0.471
  ]
 },
 {
  "code": "GV11",
  "zh": "神道",
  "en": "Spirit Path",
  "pinyin": "shen dao",
  "region": "mid back",
  "view": "back",
  "side": "midline",
  "meridian": "GV",
  "loc": "在背部，後正中線上，第 5 胸椎棘突下凹陷中。",
  "locEn": "On the back, on the posterior midline in the depression below the spinous process of T5.",
  "locReview": "source_checked",
  "pos": [
   -0.0,
   1.928,
   -0.459
  ]
 },
 {
  "code": "GV12",
  "zh": "身柱",
  "en": "Body Pillar",
  "pinyin": "shen zhu",
  "region": "upper back",
  "view": "back",
  "side": "midline",
  "meridian": "GV",
  "loc": "在背部，後正中線上，第 3 胸椎棘突下凹陷中（約與兩肩胛岡最高點連線交點）。",
  "locEn": "On the back, on the posterior midline in the depression below the spinous process of T3, roughly where the line joining the highest points of the scapular spines crosses the midline.",
  "locReview": "source_checked",
  "pos": [
   -0.0,
   2.157,
   -0.426
  ]
 },
 {
  "code": "GV13",
  "zh": "陶道",
  "en": "Vessel Path",
  "pinyin": "tao dao",
  "region": "upper back",
  "view": "back",
  "side": "midline",
  "meridian": "GV",
  "loc": "在背部，後正中線上，第 1 胸椎棘突下凹陷中。",
  "locEn": "On the back, on the posterior midline in the depression below the spinous process of T1.",
  "locReview": "source_checked",
  "pos": [
   -0.0,
   2.394,
   -0.36
  ]
 },
 {
  "code": "GV14",
  "zh": "大椎",
  "en": "Great Vertebra",
  "pinyin": "da zhui",
  "region": "nape",
  "view": "back",
  "side": "midline",
  "meridian": "GV",
  "loc": "在頸背部，後正中線上，第 7 頸椎棘突下凹陷中（低頭時頸後最高骨節下方）。",
  "locEn": "On the nape, on the posterior midline in the depression below the spinous process of C7 — the most prominent vertebra when the head is bowed.",
  "locReview": "source_checked",
  "pos": [
   -0.0,
   2.489,
   -0.337
  ]
 },
 {
  "code": "GV15",
  "zh": "啞門",
  "en": "Mute Gate",
  "pinyin": "ya men",
  "region": "nape",
  "view": "back",
  "side": "midline",
  "meridian": "GV",
  "loc": "在項部，後正中線上，後髮際正中直上 0.5 寸，第 1 頸椎（C1）下緣凹陷中。",
  "locEn": "On the nape, on the posterior midline 0.5 cun above the back hairline, in the depression below the first cervical vertebra.",
  "locReview": "source_checked",
  "pos": [
   -0.0,
   2.85,
   -0.28
  ]
 },
 {
  "code": "GV16",
  "zh": "風府",
  "en": "Wind Palace",
  "pinyin": "feng fu",
  "region": "nape",
  "view": "back",
  "side": "midline",
  "meridian": "GV",
  "loc": "在頸部，後正中線上，後髮際正中直上 1 寸，枕外隆凸直下，兩側斜方肌之間凹陷中。",
  "locEn": "On the nape, on the posterior midline 1 cun above the back hairline, directly below the external occipital protuberance, in the depression between the trapezius muscles.",
  "locReview": "source_checked",
  "pos": [
   -0.0,
   2.866,
   -0.28
  ]
 },
 {
  "code": "GV17",
  "zh": "腦戶",
  "en": "Brain Door",
  "pinyin": "nao hu",
  "region": "occiput",
  "view": "back",
  "side": "midline",
  "meridian": "GV",
  "loc": "在頭部，後髮際正中直上 2.5 寸，風府上 1.5 寸，枕外隆凸的上緣凹陷處。",
  "locEn": "On the head, 2.5 cun above the back hairline and 1.5 cun above 風府 GV16, in the depression at the upper border of the external occipital protuberance.",
  "locReview": "source_checked",
  "pos": [
   -0.0,
   2.916,
   -0.271
  ]
 },
 {
  "code": "GV18",
  "zh": "強間",
  "en": "Strong Room",
  "pinyin": "qiang jian",
  "region": "head",
  "view": "back",
  "side": "midline",
  "meridian": "GV",
  "loc": "在頭部，後髮際正中直上 4 寸（腦戶上 1.5 寸）。",
  "locEn": "On the head, 4 cun above the back hairline (1.5 cun above 腦戶 GV17).",
  "locReview": "source_checked",
  "pos": [
   -0.0,
   2.965,
   -0.283
  ]
 },
 {
  "code": "GV19",
  "zh": "後頂",
  "en": "Back Vertex",
  "pinyin": "hou ding",
  "region": "head",
  "view": "back",
  "side": "midline",
  "meridian": "GV",
  "loc": "在頭部，後髮際正中直上 5.5 寸（腦戶上 3 寸，強間上 1.5 寸）。",
  "locEn": "On the head, 5.5 cun above the back hairline (3 cun above 腦戶 GV17).",
  "locReview": "source_checked",
  "pos": [
   -0.0,
   3.014,
   -0.293
  ]
 },
 {
  "code": "GV20",
  "zh": "百會",
  "en": "Hundred Meetings",
  "pinyin": "bai hui",
  "region": "vertex",
  "view": "front",
  "side": "midline",
  "meridian": "GV",
  "loc": "在頭部，前髮際正中直上 5 寸；或兩耳尖連線的中點處。",
  "locEn": "On the head, 5 cun above the front hairline on the midline — or at the midpoint of the line joining the two ear apices.",
  "locReview": "source_checked",
  "pos": [
   -0.0,
   3.473,
   0.256
  ]
 },
 {
  "code": "GV21",
  "zh": "前頂",
  "en": "Front Vertex",
  "pinyin": "qian ding",
  "region": "head",
  "view": "front",
  "side": "midline",
  "meridian": "GV",
  "loc": "在頭部，前髮際正中直上 3.5 寸（百會前 1.5 寸）。",
  "locEn": "On the head, 3.5 cun above the front hairline (1.5 cun in front of 百會 GV20).",
  "locReview": "source_checked",
  "pos": [
   -0.0,
   3.432,
   0.256
  ]
 },
 {
  "code": "GV22",
  "zh": "顖會",
  "en": "Fontanel Meeting",
  "pinyin": "xin hui",
  "region": "head",
  "view": "front",
  "side": "midline",
  "meridian": "GV",
  "loc": "在頭部，前髮際正中直上 2 寸（百會前 3 寸，前頂前 1.5 寸）。",
  "locEn": "On the head, 2 cun above the front hairline (3 cun in front of 百會 GV20).",
  "locReview": "source_checked",
  "pos": [
   -0.0,
   3.391,
   0.308
  ]
 },
 {
  "code": "GV23",
  "zh": "上星",
  "en": "Upper Star",
  "pinyin": "shang xing",
  "region": "head",
  "view": "front",
  "side": "midline",
  "meridian": "GV",
  "loc": "在頭部，前髮際正中直上 1 寸。",
  "locEn": "On the head, 1 cun above the front hairline on the midline.",
  "locReview": "source_checked",
  "pos": [
   -0.0,
   3.364,
   0.343
  ]
 },
 {
  "code": "GV24",
  "zh": "神庭",
  "en": "Spirit Courtyard",
  "pinyin": "shen ting",
  "region": "head",
  "view": "front",
  "side": "midline",
  "meridian": "GV",
  "loc": "在頭部，前髮際正中直上 0.5 寸。",
  "locEn": "On the head, 0.5 cun above the front hairline on the midline.",
  "locReview": "source_checked",
  "pos": [
   -0.0,
   3.35,
   0.343
  ]
 },
 {
  "code": "GV25",
  "zh": "素髎",
  "en": "White Tip",
  "pinyin": "su liao",
  "region": "nose",
  "view": "front",
  "side": "midline",
  "meridian": "GV",
  "loc": "在面部，鼻尖的正中央。",
  "locEn": "On the face, at the centre of the tip of the nose.",
  "locReview": "source_checked",
  "pos": [
   -0.0,
   3.01,
   0.489
  ]
 },
 {
  "code": "GV26",
  "zh": "水溝",
  "en": "Water Ditch",
  "pinyin": "shui gou",
  "region": "philtrum",
  "view": "front",
  "side": "midline",
  "meridian": "GV",
  "loc": "在面部，當人中溝的上 1/3 與中 1/3 交點處。",
  "locEn": "On the face, at the junction of the upper third and middle third of the philtrum.",
  "locReview": "source_checked",
  "pos": [
   -0.0,
   2.98,
   0.489
  ]
 },
 {
  "code": "GV27",
  "zh": "兌端",
  "en": "Terminal Extremity",
  "pinyin": "dui duan",
  "region": "lip",
  "view": "front",
  "side": "midline",
  "meridian": "GV",
  "loc": "在面部，上唇的尖端，人中溝下端的皮膚與唇的移行部（上唇結節中點）。",
  "locEn": "On the face, at the tip of the upper lip, where the skin meets the vermilion at the lower end of the philtrum.",
  "locReview": "source_checked",
  "pos": [
   -0.0,
   2.941,
   0.491
  ]
 },
 {
  "code": "GV28",
  "zh": "齦交",
  "en": "Gum Intersection",
  "pinyin": "yin jiao",
  "region": "mouth",
  "view": "front",
  "side": "midline",
  "meridian": "GV",
  "loc": "在上唇內，上唇繫帶與上齒齦的相接處（口腔內）。",
  "locEn": "Inside the upper lip, where the labial frenulum meets the upper gum.",
  "locReview": "source_checked",
  "pos": [
   -0.0,
   2.916,
   0.439
  ]
 },
 {
  "code": "GV29",
  "zh": "印堂",
  "en": "Hall of Impression",
  "pinyin": "yin tang",
  "region": "glabella",
  "view": "front",
  "side": "midline",
  "meridian": "GV",
  "loc": "在頭部，兩眉毛內側端中間的凹陷中（鼻根上方、前額中央）。",
  "locEn": "On the head, in the depression between the medial ends of the two eyebrows, above the root of the nose.",
  "locReview": "source_checked",
  "pos": [
   -0.0,
   3.238,
   0.387
  ]
 }
];
