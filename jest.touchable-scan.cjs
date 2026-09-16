/**
 * Finds every touchable in a source tree, for the accessibility-tap guards.
 *
 * At the repo root, beside the other `jest.*.cjs` infrastructure, because all
 * eleven packages' guards use it and every package's jest config already
 * resolves setup files from here. It is outside every `tsconfig`, so it is
 * never built or published.
 *
 * **It parses rather than pattern-matches, and that is not fussiness.** The
 * first version blanked comments and string literals with a hand-written
 * scanner so a `<Pressable onPress>` inside a JSDoc `@example` would not be
 * read as a real one — and then took the apostrophe in JSX text ("we'll send
 * you a link") for the start of a string literal and blanked the **rest of the
 * file**, hiding two genuinely broken touchables in
 * `auth-components-rn/ForgotPasswordForm.tsx`. A guard that silently stops
 * looking is worse than no guard, so this reads Babel's own AST: JSX text,
 * comments and strings are then different node types rather than a quoting
 * problem to be guessed at.
 */
const { readFileSync, readdirSync, statSync } = require('fs');
const { join, relative } = require('path');
const { parse } = require('@babel/parser');

/** Everything in React Native that turns a press into a callback. */
const TOUCHABLE_NAMES = [
  'Pressable',
  'TouchableOpacity',
  'TouchableHighlight',
  'TouchableWithoutFeedback',
];

/**
 * The one opt-out, and it has to say why.
 *
 * Written inside the tag it excuses, so it cannot drift the way a list of file
 * names and line numbers would.
 */
const EXEMPTION = /no-a11y-tap:\s*\S+/;

function tsxFilesIn(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === 'dist') continue;
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...tsxFilesIn(full));
    else if (entry.endsWith('.tsx') && !entry.includes('.test.')) out.push(full);
  }
  return out;
}

function attributeNames(opening) {
  const names = [];
  for (const attr of opening.attributes) {
    if (attr.type === 'JSXAttribute' && attr.name.type === 'JSXIdentifier') {
      names.push(attr.name.name);
    }
  }
  return names;
}

function elementName(opening) {
  return opening.name.type === 'JSXIdentifier' ? opening.name.name : null;
}

/** Walk every node, since we only need JSXOpeningElement and have no visitor. */
function eachNode(node, visit) {
  if (!node || typeof node.type !== 'string') return;
  visit(node);
  for (const key of Object.keys(node)) {
    if (key === 'loc' || key === 'leadingComments' || key === 'trailingComments')
      continue;
    const value = node[key];
    if (Array.isArray(value)) {
      for (const child of value) {
        if (child && typeof child.type === 'string') eachNode(child, visit);
      }
    } else if (value && typeof value.type === 'string') {
      eachNode(value, visit);
    }
  }
}

/**
 * Every touchable under `srcRoot`, with what each one was wired with.
 *
 * Paths are reported relative to `reportRoot` (defaulting to `srcRoot`) so a
 * failure names something a reader can open.
 */
function scanTouchables(srcRoot, reportRoot = srcRoot) {
  const sites = [];
  for (const file of tsxFilesIn(srcRoot)) {
    const source = readFileSync(file, 'utf8');
    const ast = parse(source, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript'],
      errorRecovery: true,
    });
    eachNode(ast.program, node => {
      if (node.type !== 'JSXOpeningElement') return;
      const name = elementName(node);
      if (!TOUCHABLE_NAMES.includes(name)) return;
      const attrs = attributeNames(node);
      sites.push({
        file: relative(reportRoot, file),
        line: node.loc.start.line,
        tag: name,
        hasOnPress: attrs.includes('onPress'),
        hasTap: attrs.includes('onAccessibilityTap'),
        // A comment inside the opening tag falls within the node's own range.
        excused: EXEMPTION.test(source.slice(node.start, node.end)),
        mentionsMarker: /no-a11y-tap/.test(source.slice(node.start, node.end)),
      });
    });
  }
  return sites;
}

/** The touchables that are wired for a pointer and nothing else. */
function offenders(sites) {
  return sites
    .filter(site => site.hasOnPress && !site.hasTap && !site.excused)
    .map(site => `${site.file}:${site.line} <${site.tag}>`);
}

module.exports = { EXEMPTION, TOUCHABLE_NAMES, offenders, scanTouchables };
