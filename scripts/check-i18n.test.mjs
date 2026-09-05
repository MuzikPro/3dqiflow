import assert from 'node:assert/strict';
import { test } from 'node:test';
import { dictionaryKeys, missingKeys } from './check-i18n.mjs';

test('parses escaped dictionary keys without counting translation values', () => {
  const keys = dictionaryKeys(`export const EN = { 'it\\'s': 'translation', plain: 'value' };`);
  assert.deepEqual([...keys], ["it's", 'plain']);
});

test('reports literal missing keys with line numbers in TSX', () => {
  const source = "const view = <div>{tr('known')}{tr(\"missing\")}</div>;\ntr(`another`);";
  assert.deepEqual(missingKeys('view.tsx', source, new Set(['known'])), [
    { key: 'missing', line: 1 }, { key: 'another', line: 2 }
  ]);
});

test('skips dynamic calls, comments, member calls, and interpolated templates', () => {
  const source = '// tr("comment")\ntr(label); tr(item.name); obj.tr("other"); tr(`hello ${name}`);';
  assert.deepEqual(missingKeys('view.ts', source, new Set()), []);
});

test('matches escaped calls to their decoded keys', () => {
  assert.deepEqual(missingKeys('view.ts', "tr('it\\'s');", new Set(["it's"])), []);
});

test('fails clearly when the dictionary format is not recognized', () => {
  assert.throws(() => dictionaryKeys('export const OTHER = {};'), /No EN dictionary keys/);
});
