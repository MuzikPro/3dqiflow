# 3DQiFlow

**A 3D interactive engine for the "Round Motion" (圓運動) model of classical Chinese medicine** · 圓運動古中醫學 3D 學習引擎

🌐 **Live demo: [3dqiflow.com](https://3dqiflow.com)** · mirror: [3dqiflow.vercel.app](https://3dqiflow.vercel.app) — the interface is in English by default; a 中文 toggle sits in the top-right.

![3DQiFlow demo — axis-wheel model, 12-meridian flow, formula explorer](docs/demo.gif)

3DQiFlow lets you **see** the qi-circulation model described in Peng Ziyi's *The Round-Motion TCM* (圆运动的古中医学, 1920s) and Zhang Zhongjing's *Shanghan Lun* (伤寒论) — instead of only reading about it. Rotate the axis-wheel model, watch the 12 meridians flow simultaneously as paired ascending/descending circles over an anatomical body, decompose classical formulas into 3D herb spheres, and walk the 24 solar terms around a seasonal ring.

> 中气如轴，四维如轮；轴运轮行，轮运轴灵。
> *The center qi is the axle, the four aspects the wheel.* — Peng Ziyi

## What this is — and what it deliberately is not

It is a **study tool for a textual and conceptual tradition**: the thing being visualized is what the classical sources *claim*, laid out so it can be understood and memorized.

It is **not** a clinical tool, and that is enforced in the architecture rather than in a disclaimer:

- **No symptom → point or symptom → formula lookup.** Traditional indications are not in the search index at all; search matches names only (points, meridians, vessels, formulas, passages). A searchable symptom is a recommender however it is worded, and that line is not crossed.
- **No procedural content.** Needling depth, angle, technique, bloodletting, moxibustion parameters and emergency/pregnancy treatment are excluded — even where a source puts them in the same sentence as content that is included.
- **Provenance is a data field, not a footnote.** Every content string is traceable to a named source; where a source is silent, the UI says so instead of filling the gap. Nothing is presented as reviewed or standard when it is not.
- **Coordinates are honest about their status.** Acupoint positions are labeled `schematic_unvalidated` in the data *and* on screen: they are derived from textual location rules, not from cadaver measurement, and must not be used to locate points on a real person.

Contributions are held to the same lines — see [CONTRIBUTING.md](CONTRIBUTING.md).

## Features (open-source engine)

- **Acupoint Atlas 经穴图** — 362 points across the 14 meridians plus the eight extraordinary vessels, on male and female bodies, with name-only search, qi-flow animation, and a display-only 子午流注 (midnight-noon) meridian clock
- **Meridian Theater 十二经运行** — 12 meridians as 6 paired 升降 circles (yin ascending / yang descending) flowing at once over a 3D body in canonical order (如环无端), plus a route-mnemonic teaching diagram
- **Formula 3D 方剂详解** — 君臣佐使 (sovereign/minister/assistant/envoy) decomposition with derivation trees between related formulas
- **Article Reader 条文阅读** — dual-pane Shanghan Lun reader: original text and pinyin on the left, a round-motion reading driving a live 3D pathomechanism scene on the right
- **Axle & Wheel 轴轮模型** — central qi (spleen/stomach) as the axle, liver/heart/lung/kidney as the four wheels, with the ministerial-fire (相火) path, and a 24-solar-term seasonal skin
- **Hetu & Luoshu 河图洛书** — interactive 3D disks of the model's cosmological source
- **Pulse & Tongue 脉舌3D** — 3D pulse waveforms and a sculpted tongue with coating zones
- **Bilingual UI** — full English / 中文 interface (Japanese partial). Classical content stays in the original Chinese: it is never machine-translated, because inventing an authoritative-looking rendering of a classical medical text is its own kind of fabrication.

## How the acupoints are placed

Every point is derived, never eyeballed onto the mesh. The generator measures bony landmarks directly off the body mesh (axilla, elbow, wrist, hip, knee, ankle), walks the limb centerlines, applies the bone-proportional (骨度分寸) distance taken from that point's own location text, and projects the result along the surface normal, with an audit pass whose acceptance bar is zero drift — that audit is how a bug where two heel points landed at the toes got caught. The female body is not the male coordinates rescaled: her points are re-derived from her own landmarks.

The **output** of that pipeline ships here — `src/data/acupointsDerived.ts` and its female counterpart carry the per-point derivation rule alongside each coordinate, so you can read why any point sits where it does. The generator scripts themselves are part of the content tooling and are not in this repo.

## Open core: what's in this repo vs. not

This repository contains the **full 3D engine and structural theory data** (organs, meridian pairs and routes, solar terms, Hetu/Luoshu, acupoint atlas) plus **sample content** so everything runs out of the box.

The complete annotated content set — 96 Shanghan Lun articles with round-motion interpretations, 39 formulas with full animation scripts and derivation trees, complete pulse/tongue atlas, and the 7-stage guided curriculum — is part of the commercial content pack at [3dqiflow.com](https://3dqiflow.com). The engine is designed so content packs drop into `src/data/` without code changes: the deployed demo overlays the full article/formula datasets at build time via `scripts/fetch-content-pack.mjs` (a credentialed prebuild step that is a no-op for contributors — without credentials the app builds with the sample data in this repo).

## Quick start

```bash
npm install
npm run dev        # http://localhost:5174
npm run build      # typecheck + production build
```

Requires Node 18+ and a WebGL2-capable browser.

## Tech stack

React 18 + TypeScript (strict) · Three.js + React Three Fiber + Drei · Vite · CSS-in-TS theme system (`src/styles/theme.ts` — never hardcode colors)

## Architecture

```
src/
├── styles/theme.ts        # Five-element color system (fire/wood/earth/metal/water/phase-fire)
├── data/                  # Theory data (open) + sample content (trimmed)
├── utils/academicCheck.ts # Academic red-line enforcement
├── components/            # One folder per 3D scene + shared UI
├── i18n.ts                # Language store + tr() lookup
└── i18nDict.ts            # zh → en UI dictionary (falls back to Chinese, never invents)
```

## Academic integrity

TCM content follows strict academic red lines (see [docs/ACADEMIC_REDLINES.md](docs/ACADEMIC_REDLINES.md)): 中气 always means spleen/stomach qi, only classical formula names are used, meridians are modeled as 6 paired 升降 circles nested in one grand circle, and teaching mnemonics are always distinguished from canonical text. Contributions must pass the same checks.

The original texts of 《圆运动的古中医学》 (Peng Ziyi, d. 1949) and 《伤寒论》 are in the public domain. The 3D body models in `public/models/` are CC BY 4.0 — see [NOTICE.md](NOTICE.md) for the full attribution map.

## Contributing

PRs welcome — especially translations (an English rendering of round-motion terminology is an open problem), scene performance, and accessibility. Start with the [good first issues](https://github.com/MuzikPro/3dqiflow/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22), and read [CONTRIBUTING.md](CONTRIBUTING.md) first — the safety red lines there are PR acceptance criteria.

## Disclaimer 免责声明

**This is an educational tool only. It does not provide medical advice, diagnosis, or treatment. Consult a licensed practitioner for any health concern. 本项目仅供学习交流，不构成任何医疗建议、诊断或治疗方案。**

## License

Code: [MIT](LICENSE). Body meshes in `public/models/`: CC BY 4.0 (attribution required — see [NOTICE.md](NOTICE.md)). Sample content data in `src/data/`: CC BY-NC 4.0 (attribution, non-commercial). The commercial content pack is not covered by any of these. Full licensing map: [NOTICE.md](NOTICE.md).
