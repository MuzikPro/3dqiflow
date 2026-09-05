import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = fileURLToPath(new URL('../', import.meta.url));

function parse(file, source) {
  return ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true);
}

export function dictionaryKeys(source) {
  const keys = new Set();
  const visit = node => {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name)
      && node.name.text === 'EN' && node.initializer
      && ts.isObjectLiteralExpression(node.initializer)) {
      for (const property of node.initializer.properties) {
        if (ts.isPropertyAssignment(property)
          && (ts.isStringLiteral(property.name) || ts.isIdentifier(property.name))) {
          keys.add(property.name.text);
        }
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(parse('i18nDict.ts', source));
  if (keys.size === 0) throw new Error('No EN dictionary keys found');
  return keys;
}

export function missingKeys(file, source, keys) {
  const ast = parse(file, source);
  const missing = [];
  const visit = node => {
    if (ts.isCallExpression(node) && ts.isIdentifier(node.expression)
      && node.expression.text === 'tr' && node.arguments.length > 0) {
      const argument = node.arguments[0];
      if ((ts.isStringLiteral(argument) || ts.isNoSubstitutionTemplateLiteral(argument))
        && !keys.has(argument.text)) {
        const { line } = ast.getLineAndCharacterOfPosition(argument.getStart(ast));
        missing.push({ key: argument.text, line: line + 1 });
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(ast);
  return missing;
}

async function* sourceFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) yield* sourceFiles(file);
    else if (entry.isFile() && /\.tsx?$/.test(entry.name)) yield file;
  }
}

async function main() {
  const keys = dictionaryKeys(await readFile(path.join(root, 'src/i18nDict.ts'), 'utf8'));
  let count = 0;
  for await (const file of sourceFiles(path.join(root, 'src'))) {
    const missing = missingKeys(file, await readFile(file, 'utf8'), keys);
    if (missing.length === 0) continue;
    console.error(path.relative(root, file));
    for (const { key, line } of missing) console.error(`  ${line}: ${JSON.stringify(key)}`);
    count += missing.length;
  }
  if (count > 0) {
    console.error(`${count} missing translation key occurrence(s)`);
    process.exitCode = 1;
  } else {
    console.log('All literal tr() keys have English dictionary entries.');
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
