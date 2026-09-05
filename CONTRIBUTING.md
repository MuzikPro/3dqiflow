# Contributing to 3DQiFlow

Thanks for your interest! 3DQiFlow welcomes contributions to the 3D engine, translations, and documentation.

## Ground rules

1. **Academic red lines are non-negotiable.** Read [docs/ACADEMIC_REDLINES.md](docs/ACADEMIC_REDLINES.md) before touching any TCM content. PRs that violate them (e.g. wrong 升降 directions, invented formula names, 中气 ≠ 脾胃之气) will be rejected regardless of code quality.
2. **No medical advice.** All content must stay educational. Never add diagnostic or treatment recommendations.
3. **No hardcoded colors.** Import from `src/styles/theme.ts`.
4. **TypeScript strict.** No `any` without a justifying comment.
5. **Components stay small** (< 150 lines) and composable. Code identifiers in English; Chinese only in content/data strings.

## Safety red lines (PR acceptance criteria)

These are hard rejection criteria, independent of code quality. They exist so
the app can never drift from a study tool into a treatment recommender.

1. **No treatment recommendation, ever.** No feature that maps a user's
   symptom, complaint, or condition to a point, formula, or action — however
   the entries are worded. This includes making symptoms or indications
   **searchable**: search stays on names (穴位/经络/脉/方名/条文), never on
   what they "treat".
2. **No needling or intervention instructions.** Needle depth, angle,
   technique, self-needling, bloodletting, moxibustion parameters, electrical
   stimulation, emergency treatment, and pregnancy treatment content are
   excluded — even when a classical source puts them in the same sentence as
   content we do carry.
3. **Source traceability.** Every content string must be traceable to a named
   source, verbatim or as a documented cut. Where a source is silent, the entry
   says so. Content written from an AI model's general knowledge must never be
   presented as sourced, reviewed, or standard — and never silently becomes
   the basis of another field.
4. **No invented anatomy or citations.** Never invent a location, coordinate,
   translation, citation, review result, or license. AI-generated images and
   random web illustrations are never anatomical authority. Coordinates in
   this repo are schematic (`schematic_unvalidated`) and PRs must not upgrade
   their claimed status without real review evidence.
5. **Licensing of contributed material.** Publicly viewable ≠ redistributable.
   Do not contribute text, illustrations, meshes, or datasets copied from
   modern copyrighted sources (standards documents, textbooks, commercial
   atlases) without license terms compatible with this repo — and say in the
   PR where every asset came from. See [NOTICE.md](NOTICE.md) for the
   licensing map.

## Developer Certificate of Origin

Contributions are accepted under the license of what they touch (code: MIT;
sample data: CC BY-NC 4.0) — inbound = outbound. Sign off each commit
(`git commit -s`, adding a `Signed-off-by:` line) to certify the
[Developer Certificate of Origin](https://developercertificate.org/): that you
wrote the contribution or otherwise have the right to submit it under those
licenses.

## What we'd love help with

- **English/Japanese translation** of round-motion terminology (flag uncertain renderings — we don't ship invented translations)
- Scene performance (draw calls, instancing, mobile GPU)
- Accessibility of 2D overlay panels
- Tests (Vitest + React Testing Library)
- New visualization ideas that help users *see the circle*

## Content contributions

The full annotated datasets (96 articles, 39 formulas, etc.) are maintained separately as a commercial content pack. This repo carries samples in `src/data/`. If you want to contribute annotations, open an issue first to discuss scope and licensing (sample data is CC BY-NC 4.0).

## Workflow

Run `npm run check:i18n` after changing UI strings. It reports literal `tr()`
calls missing from the English dictionary with their file and line number;
dynamic calls are skipped. Run the checker's tests with
`node --test scripts/check-i18n.test.mjs`.

1. Fork, branch from `main`
2. `npm install && npm run dev`
3. Before pushing: `npm run typecheck && npm run build`
4. Open a PR describing: what the user will *see* change, which `src/data/` files are touched, and confirmation that the academic self-check passed

## Disclaimer

本项目仅供学习，非医疗建议。Educational use only — not medical advice.
