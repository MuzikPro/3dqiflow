# Contributing to 3DQiFlow

Thanks for your interest! 3DQiFlow welcomes contributions to the 3D engine, translations, and documentation.

## Ground rules

1. **Academic red lines are non-negotiable.** Read [docs/ACADEMIC_REDLINES.md](docs/ACADEMIC_REDLINES.md) before touching any TCM content. PRs that violate them (e.g. wrong 升降 directions, invented formula names, 中气 ≠ 脾胃之气) will be rejected regardless of code quality.
2. **No medical advice.** All content must stay educational. Never add diagnostic or treatment recommendations.
3. **No hardcoded colors.** Import from `src/styles/theme.ts`.
4. **TypeScript strict.** No `any` without a justifying comment.
5. **Components stay small** (< 150 lines) and composable. Code identifiers in English; Chinese only in content/data strings.

## What we'd love help with

- **English/Japanese translation** of round-motion terminology (flag uncertain renderings — we don't ship invented translations)
- Scene performance (draw calls, instancing, mobile GPU)
- Accessibility of 2D overlay panels
- Tests (Vitest + React Testing Library)
- New visualization ideas that help users *see the circle*

## Content contributions

The full annotated datasets (96 articles, 39 formulas, etc.) are maintained separately as a commercial content pack. This repo carries samples in `src/data/`. If you want to contribute annotations, open an issue first to discuss scope and licensing (sample data is CC BY-NC 4.0).

## Workflow

1. Fork, branch from `main`
2. `npm install && npm run dev`
3. Before pushing: `npm run typecheck && npm run build`
4. Open a PR describing: what the user will *see* change, which `src/data/` files are touched, and confirmation that the academic self-check passed

## Disclaimer

本项目仅供学习，非医疗建议。Educational use only — not medical advice.
