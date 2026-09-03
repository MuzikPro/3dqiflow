/**
 * Content-pack overlay (deploy-time only).
 *
 * The open-source repo ships SAMPLE data for 条文阅读 / 方剂详解.
 * The full annotated datasets (96 articles, 39+ formulas) are the 3DQiFlow
 * commercial content pack and are NOT distributed in this repository.
 *
 * At deploy time (Vercel), this prebuild script fetches the full data files
 * from a private repository and overlays them into src/data/ before `vite build`.
 * Without credentials the script is a no-op and the app builds with samples —
 * contributors need nothing.
 *
 * Env:
 *   CONTENT_PACK_TOKEN  GitHub token with read-only Contents access to the
 *                       private repo (required to overlay; absent = skip)
 *   CONTENT_PACK_REPO   owner/repo of the private source (default MuzikPro/Circle)
 *   CONTENT_PACK_REF    git ref to fetch (default main)
 *   CONTENT_PACK_FORCE  set to 1 to run outside Vercel (local testing);
 *                       never commit the overlaid files
 */
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const token = process.env.CONTENT_PACK_TOKEN;
const onVercel = process.env.VERCEL === '1';
const force = process.env.CONTENT_PACK_FORCE === '1';

if (!token) {
  console.log('[content-pack] no CONTENT_PACK_TOKEN — building with open-source sample data.');
  process.exit(0);
}
if (!onVercel && !force) {
  console.log('[content-pack] not a Vercel build (set CONTENT_PACK_FORCE=1 to override) — skipping overlay.');
  process.exit(0);
}

const repo = process.env.CONTENT_PACK_REPO ?? 'MuzikPro/Circle';
const ref = process.env.CONTENT_PACK_REF ?? 'main';
const dataDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'data');

const HEADER_NOTE = `/**
 * ⚠️ FULL CONTENT PACK — injected at deploy time by scripts/fetch-content-pack.mjs.
 * This file's full dataset is the 3DQiFlow commercial content pack and is NOT
 * part of the open-source repository. Do not commit this overlaid version.
 */
`;

async function fetchRaw(path) {
  const res = await fetch(`https://api.github.com/repos/${repo}/contents/${path}?ref=${ref}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.raw+json',
      'X-GitHub-Api-Version': '2022-11-28'
    }
  });
  if (!res.ok) throw new Error(`fetch ${path}: ${res.status} ${res.statusText}`);
  return res.text();
}

/** 公开站不发布胡希恕注（版权未清）：整行剔除 huXishuComment 数据项 */
function stripHuComments(src) {
  const lines = src.split('\n');
  const kept = lines.filter(
    (l) => !(/^\s*huXishuComment:\s*'/.test(l) && /',\s*$/.test(l))
  );
  const removed = lines.length - kept.length;
  console.log(`[content-pack] stripped ${removed} huXishuComment entr${removed === 1 ? 'y' : 'ies'}.`);
  return kept.join('\n');
}

try {
  const [articles, formulas] = await Promise.all([
    fetchRaw('src/data/articles.ts'),
    fetchRaw('src/data/formulas.ts')
  ]);
  await writeFile(join(dataDir, 'articles.ts'), HEADER_NOTE + stripHuComments(articles));
  await writeFile(join(dataDir, 'formulas.ts'), HEADER_NOTE + formulas);
  console.log(`[content-pack] overlaid full articles + formulas from ${repo}@${ref}.`);
} catch (err) {
  // 拉取失败时明确失败而不是悄悄用样本上线——避免正式站内容无声回退
  console.error('[content-pack] overlay failed:', err.message);
  process.exit(1);
}
