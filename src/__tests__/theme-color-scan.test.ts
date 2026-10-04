/**
 * No component colours itself outside the theme.
 *
 * Every colour in `src/ui` is meant to be a semantic token — a class such as
 * `bg-primary` or `text-muted-foreground`, or for the few props that take no
 * class, `useThemeColor` — so that it follows the palette the host applied,
 * light or dark, including one the host sets at run time. Each rule below is a
 * way that went wrong before:
 *
 * - `colors.raw.*` — the design system's fixed palette, light-only: a blue
 *   spinner on a red theme, a dark tick invisible on a dark popover.
 * - a hex literal — the same thing written out.
 * - a Tailwind palette class (`text-blue-600`, `bg-white`, `text-white`) —
 *   `text-white` on a `bg-primary` fill is unreadable wherever the primary is
 *   light; the fill's own `*-foreground` is what reads on it.
 * - `color=…` on an `ActivityIndicator` — `className='text-primary'` is
 *   mapped onto it by NativeWind; a string there is fixed, and
 *   `'currentColor'` is not a colour React Native can resolve at all.
 *
 * The allow list gives a reason per entry, and fails when an entry is no
 * longer needed, so it cannot quietly grow stale.
 */
import { readdirSync, readFileSync, statSync } from 'fs';
import { join, relative, resolve } from 'path';

const UI = resolve(__dirname, '..', 'ui');

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap(name => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.tsx?$/.test(name) ? [path] : [];
  });
}

/** The source with comments blanked, so prose about a colour is not one. */
function code(text: string): string {
  return text
    .replace(/\/\*[\s\S]*?\*\//g, m => m.replace(/[^\n]/g, ' '))
    .replace(/(^|[^:'"`])\/\/.*$/gm, '$1');
}

interface Rule {
  name: string;
  pattern: RegExp;
  /** A match the rule lets through everywhere, with the reason above it. */
  except?: RegExp;
}

const PALETTE =
  'slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose';

const RULES: Rule[] = [
  { name: 'colors.raw', pattern: /\bcolors\.raw\b/g },
  { name: 'hex literal', pattern: /['"`]#[0-9a-fA-F]{3,8}['"`]/g },
  {
    name: 'palette class',
    pattern: new RegExp(
      `(?<![\\w-])(?:[a-z-]+:)?(?:bg|text|border|ring|fill|stroke|from|to|via)-(?:(?:${PALETTE})-\\d{2,3}|white|black)(?:/\\d+)?(?![\\w-])`,
      'g'
    ),
    // See SCRIMS below.
    except: /^(?:[a-z-]+:)?bg-black\/\d+$/,
  },
  {
    name: 'ActivityIndicator color prop',
    pattern: /<ActivityIndicator\b[^>]*\bcolor=/g,
  },
];

/*
  SCRIMS: `bg-black/50` and its siblings are the dimming behind a modal, and
  there is no scrim token — a translucent black reads the same over either
  palette. The palette rule lets a translucent `bg-black` through for that
  reason only; an opaque `bg-black`, or `text-white/70`, is still refused.
*/

/** file (relative to src/ui) → rule name → why it is allowed. */
const ALLOWED: Record<string, Record<string, string>> = {
  'LoginView/BrandLogos.tsx': {
    'hex literal':
      "Google's and Apple's marks are trademarks drawn in their owners' colours.",
  },
  'Select/Select.tsx': {
    'hex literal':
      'shadowColor: a shadow is black in either palette and no token names one.',
  },
};

interface Finding {
  file: string;
  rule: string;
  line: number;
  match: string;
}

function findings(): Finding[] {
  const out: Finding[] = [];
  for (const path of sourceFiles(UI)) {
    const file = relative(UI, path);
    const text = code(readFileSync(path, 'utf8'));
    for (const rule of RULES) {
      for (const m of text.matchAll(rule.pattern)) {
        if (rule.except?.test(m[0])) continue;
        out.push({
          file,
          rule: rule.name,
          line: text.slice(0, m.index).split('\n').length,
          match: m[0].slice(0, 80),
        });
      }
    }
  }
  return out;
}

describe('src/ui colours itself from the theme', () => {
  const all = findings();

  it('scans the components at all', () => {
    expect(sourceFiles(UI).length).toBeGreaterThan(90);
  });

  it('has no colour outside the theme but the allowed ones', () => {
    const offenders = all.filter(f => !ALLOWED[f.file]?.[f.rule]);
    expect(offenders).toEqual([]);
  });

  it('has no allow-list entry that is no longer needed', () => {
    const stale = Object.entries(ALLOWED).flatMap(([file, rules]) =>
      Object.keys(rules)
        .filter(rule => !all.some(f => f.file === file && f.rule === rule))
        .map(rule => `${file}: ${rule}`)
    );
    expect(stale).toEqual([]);
  });

  it('catches what it is meant to catch', () => {
    const sample = code(
      [
        "<ActivityIndicator color='currentColor' />",
        "className='text-white bg-blue-500 dark:text-neutral-400'",
        'color: colors.raw.neutral[400]',
        "fill='#ffffff'",
        "className='bg-black/50 text-primary-foreground text-white/70'",
        '// text-white in a comment',
      ].join('\n')
    );
    const hits = RULES.flatMap(r =>
      [...sample.matchAll(r.pattern)]
        .map(m => m[0])
        .filter(h => !r.except?.test(h))
    );
    expect(hits).toEqual(
      expect.arrayContaining([
        'colors.raw',
        "'#ffffff'",
        'text-white',
        'bg-blue-500',
        'dark:text-neutral-400',
      ])
    );
    expect(hits.some(h => h.startsWith('<ActivityIndicator'))).toBe(true);
    expect(hits).toContain('text-white/70');
    expect(hits.some(h => h.startsWith('bg-black'))).toBe(false);
    expect(hits.filter(h => h === 'text-white')).toHaveLength(1);
  });
});
