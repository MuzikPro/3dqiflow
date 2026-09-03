# 3DQiFlow

**圓運動古中醫學 3D 學習引擎 · A 3D interactive engine for visualizing the "Round Motion" (圓運動) theory of classical Chinese medicine**

🌐 [3dqiflow.com](https://3dqiflow.com) · Live demo coming soon

> 中气如轴，四维如轮；轴运轮行，轮运轴灵。 — 彭子益《圆运动的古中医学》

3DQiFlow lets you **see** the qi circulation model described in Peng Ziyi's *The Round-Motion TCM* (圆运动的古中医学) and Zhang Zhongjing's *Shanghan Lun* (伤寒论) — instead of just reading about it. Rotate the axis-wheel model, watch the 12 meridians flow as paired ascending/descending circles, decompose classical formulas into animated 3D herb spheres, and walk the 24 solar terms around a seasonal ring.

## Features (open-source engine)

- **轴轮模型 Axis-Wheel Model** — Central Qi (Spleen/Stomach) as the axis, Liver/Heart/Lung/Kidney as four wheels, with animated qi loops and the phase-fire (相火) path
- **十二经运行 Meridian Theater** — 12 meridians rendered as 6 paired 升降 circles (yin ascend / yang descend) on a 3D body, in canonical flow order (如环无端)
- **方剂详解 Formula 3D** — 君臣佐使 herb-sphere decomposition with timeline animation of qi-mechanism restoration (sample: 桂枝汤 / 理中丸 / 小建中汤 / 乌梅丸 — the three treatment archetypes 运轴/运轮/轴轮并运)
- **节气剧场 Solar Terms** — 24 solar terms + 12 消息卦 as a 3D seasonal ring
- **河图洛书 Hetu & Luoshu** — interactive 3D disks of the theory's cosmological source
- **脉舌 3D Pulse & Tongue** — 3D pulse-wave and tongue-coating visualizations (sample data)
- **条文阅读 Article Reader** — dual-pane Shanghan Lun reader: original text + pinyin on the left, round-motion interpretation driving the 3D scene on the right (sample: first 8 articles)
- **i18n** — 中文 / English / 日本語 UI

## Open core: what's in this repo vs. not

This repository contains the **full 3D engine and structural theory data** (organs, meridian pairs and routes, solar terms, Hetu/Luoshu, acupoint atlas) plus **sample content** so everything runs out of the box.

The complete annotated content set — 96 Shanghan Lun articles with round-motion interpretations, 39 formulas with full animation scripts and derivation trees, complete pulse/tongue atlas, and the 7-stage guided curriculum — is part of the commercial content pack at [3dqiflow.com](https://3dqiflow.com). The engine is designed so content packs drop into `src/data/` without code changes.

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
└── i18n.ts                # zh / en / ja UI strings
```

## Academic integrity

TCM content in this project follows strict academic red lines (see [docs/ACADEMIC_REDLINES.md](docs/ACADEMIC_REDLINES.md)): 中气 always means Spleen/Stomach qi, only classical formula names are used, meridians are modeled as 6 paired 升降 circles nested in one grand circle, and teaching mnemonics are always distinguished from canonical text. Contributions must pass the same checks.

The original text of 《圆运动的古中医学》 (Peng Ziyi, d. 1949) and 《伤寒论》 are in the public domain. The 3D body models in `public/models/` are CC BY 4.0 (see `public/models/README.md`).

## Contributing

PRs welcome — especially translations (an English rendering of round-motion terminology is an open problem), scene performance, and accessibility. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Disclaimer 免责声明

**本项目仅供学习交流，不构成任何医疗建议、诊断或治疗方案。This is an educational tool only. It does not provide medical advice, diagnosis, or treatment. Consult a licensed practitioner for any health concern.**

## License

Code: [MIT](LICENSE). Sample content data in `src/data/`: CC BY-NC 4.0 (attribution, non-commercial). The commercial content pack is not covered by either license.
