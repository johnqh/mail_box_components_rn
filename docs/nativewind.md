# NativeWind + Design-System Theming Guide

How to wire a React Native (Expo) app so that **all UI comes from off-the-shelf
`@sudobility/components-rn` components**, styled only by **variants**, that
automatically reflect the active **design-system theme** (default,
neo‑brutalism, …) and **light/dark** color scheme — matching the web apps.

This guide is the reference setup. It was first implemented in
`tapayoka_vendor_app_rn`; follow the same steps in other native apps.

---

## 1. The model

There are three libraries involved:

| Package | Role |
|---|---|
| `@sudobility/design` (repo: `design_system`) | Source of truth. Defines **variants** (`variants.button.primary…`) and **themes** (token values per design style, light+dark). Web + native share these. |
| `@sudobility/components-rn` (repo: `mail_box_components_rn`) | The RN component library (Button, Card, Text, Input, …). Each component asks the design system for its variant classes. |
| The app (e.g. `tapayoka_vendor_app_rn`) | Composes components and sets **variants only** — no `StyleSheet`, no inline colors. |

How a styled color reaches the screen:

```
configureTheme(theme,{native:true})         // 1. pick the design style
   → variants.button.primary() returns        //    semantic classes:
     "bg-primary text-primary-foreground …"    //    bg-primary, not bg-blue-600
   → tailwind preset maps  bg-primary → hsl(var(--primary))   // CSS variable
   → ThemeVarsProvider applies vars() with the theme's --primary, swapped by
     color scheme                              // runtime light/dark switch
```

The two switches:
- **Design style** is chosen at build time by `configureTheme` + the theme's variable values.
- **Light/dark** flips at runtime via `vars()` on a provider that swaps the
  variable values by color scheme.

> ⚠️ **Native does NOT switch CSS-variable *blocks*.** This is the single biggest
> gotcha. NativeWind/`react-native-css-interop` flips per-utility `dark:` variants
> on native, but it does **not** switch variables defined in a CSS `.dark {}`
> (or `@media (prefers-color-scheme: dark)`) block. So the shadcn-style web
> approach (`:root`/`.dark` in CSS) renders **light only**. Use the `vars()`
> runtime provider (§2.10) instead.

> ⚠️ **Tailwind v3, not v4.** NativeWind 4.x requires `tailwindcss@^3.4`.
> Tailwind v4 is a different pipeline and will break the build.

---

## 2. App setup (step by step)

### 2.1 Dependencies

```
nativewind@^4            tailwindcss@^3.4         (NOT v4)
react-native-reanimated  react-native-safe-area-context
babel-plugin-transform-inline-environment-variables   (env inlining, §2.9)
```
`react-native-css-interop` comes in transitively with nativewind.

**Also install `watchman`** (`brew install watchman`). Without it, Metro falls back
to its Node file crawler, which **crashes with `RangeError: Invalid string length`**
when `watchFolders` is large (see §2.3 — sibling-repo layouts hit this). watchman
crawls efficiently and avoids the error.

### 2.2 `babel.config.js`

Route the app's JSX through NativeWind's runtime so `className` becomes styles.
**Keep any existing preset options and plugins** — add to them, don't replace.

> ⚠️ **Gate NativeWind to the Metro caller — otherwise it breaks jest.** With
> `jsxImportSource: 'nativewind'`, JSX compiles to a `react-native-css-interop/
> jsx-runtime` import hoisted to module scope. Under **jest** (babel-jest), that
> trips `babel-plugin-jest-hoist`'s "no out-of-scope variables in `jest.mock()`"
> rule and **every test suite fails to transform**. Make `babel.config.js` a
> function and apply NativeWind only when Metro is the caller.

```js
module.exports = function (api) {
  // NativeWind JSX transform only for the Metro bundle, not babel-jest.
  const isMetro = api.caller(
    c => !!c && (c.name === 'metro' || c.bundler === 'metro')
  );
  api.cache.using(() => isMetro);

  return {
    presets: [
      // Keep existing options (e.g. unstable_transformImportMeta for import.meta).
      [
        'babel-preset-expo',
        { ...(isMetro ? { jsxImportSource: 'nativewind' } : {}) },
      ],
      ...(isMetro ? ['nativewind/babel'] : []),
    ],
    plugins: [
      /* module-resolver, … */
      // Env inlining — see §2.9. (Fine under both Metro and jest.)
      ['transform-inline-environment-variables', { include: [/* used keys */] }],
      // If using reanimated, its plugin MUST remain LAST. Name depends on the
      // version: 'react-native-reanimated/plugin' (v3) or
      // 'react-native-worklets/plugin' (v4+ / when worklets is split out).
      'react-native-reanimated/plugin',
    ],
  };
};
```

> Other gotchas: preserve existing `babel-preset-expo` options (dropping
> `unstable_transformImportMeta` breaks `import.meta` in shared code); and the
> reanimated plugin (`react-native-reanimated/plugin`, or
> `react-native-worklets/plugin` on v4+) must stay the **last** plugin.

### 2.3 `metro.config.js`

Wrap the **existing** config with `withNativeWind`. Real apps already have a
custom resolver (shims, `blockList`, `resolveRequest`, `extraNodeModules`,
`watchFolders`, an SVG `babelTransformerPath`, …) to resolve the `@sudobility`
packages — keep all of it; only add `withNativeWind` around `module.exports` and
the `.env.merged` loader below. (`withNativeWind` composes with a custom
`babelTransformerPath` like `react-native-svg-transformer`.)

```js
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');
const fs = require('fs');
const path = require('path');

// Load .env.merged into process.env at build time so the babel inline-env plugin
// (§2.9) can replace process.env.* with real values (RN runtime process.env is {}).
const envFile = process.env.ENVFILE || '.env.merged';
const envFilePath = path.resolve(__dirname, envFile);
if (fs.existsSync(envFilePath)) {
  for (const line of fs.readFileSync(envFilePath, 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#') || !t.includes('=')) continue;
    const i = t.indexOf('=');
    const key = t.slice(0, i).trim();
    let val = t.slice(i + 1).trim().replace(/^['"]|['"]$/g, '');
    if (!(key in process.env)) process.env[key] = val;
  }
}

const config = mergeConfig(getDefaultConfig(__dirname), {
  /* …keep the app's existing resolver/transformer/watchFolders… */
});

module.exports = withNativeWind(config, { input: './global.css' });
```

> ⚠️ **`watchFolders` and the sibling-repo gotcha.** `~/projects` is NOT a
> monorepo — it's many independent repos. If `watchFolders` points at the parent
> root (to reach sibling `@sudobility` packages), Metro's Node crawler tries to
> walk *everything* and **crashes with `RangeError: Invalid string length`**.
> Watch ONLY the specific sibling package dirs the app consumes — e.g.
> `watchFolders: [...Object.values(sudobilityPackages)]` — never the parent root.
> Also install **watchman** (§2.1), which sidesteps the Node crawler entirely.

> **Note — src vs dist.** Because `resolverMainFields`/`unstable_conditionNames`
> prefer the `react-native` condition, and `@sudobility/components-rn` exposes
> `"react-native": "./src/index.ts"`, **Metro bundles the library's TypeScript
> `src/`, transformed by the app's own babel** (so `className` works without the
> library being prebuilt for NativeWind). Consequence: rebuilding the library's
> `dist` has no effect on this app — edit `src`. Verify what's live by grepping
> the served bundle (`/index.bundle?platform=ios&dev=true`): a `lib/utils`
> import string ⇒ src is bundled.

### 2.4 `global.css` (generated)

`global.css` holds the Tailwind directives plus a **`:root` light fallback** of
the theme variables (the `.dark` block is dropped — it does nothing on native;
runtime dark switching is done by `vars()`, §2.10). Generate it from the theme:
`scripts/generate-theme-css.js`:

```js
const fs = require('fs');
const path = require('path');
const { generateThemeCSS } = require('@sudobility/design');
const { defaultTheme } = require('@sudobility/design/themes');

const activeTheme = defaultTheme; // ← switch design style here
// generateThemeCSS emits ":root {light} .dark {dark}"; keep only :root by slicing
// off everything from the ".dark" selector onward (robust to whitespace/format).
const full = generateThemeCSS(activeTheme);
const darkIdx = full.indexOf('.dark');
const lightRoot = (darkIdx >= 0 ? full.slice(0, darkIdx).trimEnd() : full.trimEnd()) + '\n';
const css = `@tailwind base;
@tailwind components;
@tailwind utilities;

${lightRoot}`;
fs.writeFileSync(path.join(__dirname, '..', 'global.css'), css);
```

Run it from `prestart`/`preios`/`preandroid`:

```json
"prestart": "node scripts/merge-env.js && node scripts/generate-theme-css.js && bun run clean:metro"
```

### 2.5 `tailwind.config.js`

Use `createTailwindPreset()` (maps tokens → `hsl(var(--…))`, the CSS-variable
form that supports light/dark). Scan the design + components-rn sources so their
variant classes get generated.

```js
const { createTailwindPreset } = require('@sudobility/design');
const { defaultTheme } = require('@sudobility/design/themes');

// The design preset maps rounded-md/sm to `calc(var(--radius) - Npx)`, which
// NativeWind cannot evaluate on native (corners render SQUARE). Compute concrete
// px from the active theme's radius — the same result the web gets from calc.
const radiusPx = parseFloat(defaultTheme.light.radius) * 16; // "0.5rem" -> 8

module.exports = {
  darkMode: 'class',
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/@sudobility/components-rn/{src,dist}/**/*.{js,jsx,ts,tsx}',
    './node_modules/@sudobility/design/dist/**/*.{js,jsx}',
  ],
  presets: [require('nativewind/preset'), createTailwindPreset()],
  theme: {
    extend: {
      // Override the calc()-based radii with concrete px (see radiusPx above).
      borderRadius: {
        sm: `${Math.max(radiusPx - 4, 0)}px`,
        md: `${Math.max(radiusPx - 2, 0)}px`,
        lg: `${radiusPx}px`,
        xl: `${radiusPx + 4}px`,
      },
    },
  },
  plugins: [],
};
```

> `createTailwindPreset()` (CSS variables) supports light **and** dark.
> `createNativeWindPreset(theme)` bakes in **light-only** concrete colors — use
> it only if you don't need dark mode.

> ⚠️ **Square corners on native.** The design preset expresses `rounded-sm/md`
> as `calc(var(--radius) - 2px)`. NativeWind's compiler does **not** evaluate
> `calc()` on native, so any `rounded-*` from a variant collapses to 0 (sharp
> corners). The `borderRadius` override above pre-computes concrete px from
> `defaultTheme.light.radius` — keep it whenever a theme uses a non-zero radius.

### 2.6 `nativewind-env.d.ts`

```ts
/// <reference types="nativewind/types" />
```

### 2.7 App entry

Import `global.css` and activate the theme **before any component renders**.

```ts
// App.tsx (top, after the localStorage polyfill)
import './global.css';
import '@/config/designTheme'; // side-effect: configureTheme(...)
```

```ts
// src/config/designTheme.ts
import { configureTheme } from '@sudobility/design';
import { defaultTheme } from '@sudobility/design/themes';
configureTheme(defaultTheme, { native: true }); // MUST match global.css + tailwind preset
```

`configureTheme` makes the design system return **semantic** classes
(`bg-primary`) instead of the legacy `bg-blue-600` fallback. `native: true`
selects each theme's `nativeClassOverrides` (RN-safe; e.g. drops `backdrop-blur`).

### 2.8 Switching design style

Change the theme in **all three** places together: `designTheme.ts`
(`configureTheme`), `generate-theme-css.js` (`activeTheme`), and re-run the
generator. The tailwind preset is variable-based so it needs no change.

### 2.9 Environment variables (`.env`)

React Native's **runtime `process.env` is `{}`** — env vars must be inlined at
build time. `babel-preset-expo` only handles `EXPO_PUBLIC_*` (it rewrites those to
`require("expo/virtual/env")`); any other prefix (e.g. `VITE_*`, shared with the
web apps) is left as `process.env.X` → `undefined` in Hermes. So a dedicated
inline step is required, or env access silently yields defaults. Three pieces:

1. **`scripts/merge-env.js`** merges `.env` (+ `.env.local`) → `.env.merged`. Run
   it in `pre{start,ios,android}` (alongside `generate-theme-css.js`, §2.4):
   ```json
   "prestart": "node scripts/merge-env.js && node scripts/generate-theme-css.js && bun run clean:metro"
   ```
2. **`metro.config.js`** loads `.env.merged` into `process.env` at build time
   (the loop in §2.3).
3. **`babel.config.js`** uses `transform-inline-environment-variables` with an
   **explicit `include` whitelist** of only the keys the app actually reads, so
   they're replaced with the loaded values:
   ```js
   ['transform-inline-environment-variables',
     { include: ['VITE_WALLETCONNECT_PROJECT_ID', 'VITE_EMAIL_DOMAIN', /* …used keys… */] }]
   ```

Guidance:
- **Whitelist the keys you use** — do NOT omit `include`. Omitting it inlines the
  *entire build-machine environment* (PATH, secrets) into the bundle and can break
  libraries that read `process.env`. (You can auto-derive the list from
  `.env.merged`'s keys if you prefer no manual list — still scoped to your `.env`.)
- Access vars with the **static** form `process.env.VITE_FOO` in one config module
  (e.g. `src/config/env.ts`). The plugin only matches static `process.env.*` — a
  dynamic `process.env['VITE_' + k]` will not be inlined.
- Symptom of a missing/broken setup: "Set X in .env" errors even though `.env` has
  it. A stale Metro bundle can mask this; `clean:metro` (in the pre-scripts) forces
  a rebuild that reflects the real inlining.

### 2.10 Light/dark via a `vars()` provider (the working native approach)

Because native won't switch CSS-variable blocks, apply the variables at runtime
with `vars()` and swap them by color scheme. This is what actually makes
`bg-background`/`text-foreground` flip.

```ts
// src/config/themeVars.ts
import { vars } from 'nativewind';
import { defaultTheme } from '@sudobility/design/themes';

const toVars = tokens => Object.fromEntries(
  Object.entries(tokens).map(([k, v]) =>
    ['--' + k.replace(/[A-Z]/g, m => '-' + m.toLowerCase()), String(v)])
);
export const lightThemeVars = vars(toVars(defaultTheme.light));
export const darkThemeVars = vars(toVars(defaultTheme.dark));
```

```tsx
// src/components/ThemeVarsProvider.tsx — wrap the whole app (high in App.tsx)
import { View, useColorScheme } from 'react-native';
import { useSettingsStore } from '@/stores';
import { lightThemeVars, darkThemeVars } from '@/config/themeVars';

export function ThemeVarsProvider({ children }) {
  const { theme } = useSettingsStore();          // 'system' | 'light' | 'dark'
  const system = useColorScheme();
  const isDark = theme === 'dark' || (theme === 'system' && system === 'dark');
  return <View style={[{ flex: 1 }, isDark ? darkThemeVars : lightThemeVars]}>{children}</View>;
}
```

Notes:
- Resolve the scheme from the **app's own** source (settings + RN
  `useColorScheme`), the same logic AppNavigator uses for the navigation theme,
  so the chrome and content agree. NativeWind's own `useColorScheme()` did **not**
  reliably reflect the resolved scheme in our setup — use RN's.
- `darkMode: 'class'` still matters for any leftover `dark:` variants; keep
  NativeWind's `colorScheme` in lockstep via AppNavigator
  (`colorScheme.set(isDark ? 'dark' : 'light')`).
- Prefer components + semantic classes over the app's `useAppColors`/`StyleSheet`
  colors (see §5). Where a concrete color string is genuinely unavoidable
  (React Navigation's `Theme`, native SDK styles), **derive it from the design
  tokens** rather than hardcoding — see §2.12.

### 2.11 SVG / icon colors

`react-native-svg` (and heroicons) need a one-time `cssInterop` so `className`
color utilities tint them (and flip light/dark):

```ts
import { cssInterop } from 'nativewind';
import Svg from 'react-native-svg';
cssInterop(Svg, { className: { target: 'style', nativeStyleToProp: { color: true } } });
```

Put this call in the `designTheme.ts` side-effect module (§2.7) so it runs once,
at startup, alongside `configureTheme` — before any icon renders.

### 2.12 Concrete colors outside `className` (React Navigation, native SDKs)

Some consumers can't take a `className` and need a **concrete color string**:
React Navigation's `Theme` (`NavigationContainer theme={…}`), the Stripe
`CardForm`/`CardField` `cardStyle`, chart libraries, `StatusBar`, etc. **Do not
hardcode a parallel palette** for these — derive the values from the **same
`defaultTheme` tokens** the rest of the app uses, so they track the active design
style and light/dark.

Design tokens are **HSL channel strings** (`"222.2 84% 4.9%"`, no `hsl(...)`
wrapper, space-separated). React Native's color parser accepts the **comma**
form `hsl(h, s%, l%)`, so convert:

```ts
// "222.2 84% 4.9%" -> "hsl(222.2, 84%, 4.9%)"  (React-Native-parseable)
const hsl = (channels: string): string => {
  const [h, s, l] = channels.trim().split(/\s+/);
  return `hsl(${h}, ${s}, ${l})`;
};
```

Build the consumer's color object from the scheme's tokens. React Navigation
theme (`src/config/theme.ts`), keyed off `defaultTheme.light` / `.dark`:

```ts
import type { Theme } from '@react-navigation/native';
import { defaultTheme } from '@sudobility/design/themes';
const l = defaultTheme.light;
export const lightTheme: Theme = {
  dark: false,
  fonts,
  colors: {
    primary: hsl(l.primary),
    background: hsl(l.background),
    card: hsl(l.card),
    text: hsl(l.foreground),
    border: hsl(l.border),
    notification: hsl(l.destructive),
  },
};
```

Same idea for a native SDK — derive from the active scheme's tokens at render:

```tsx
// Stripe CardForm — cardStyle wants concrete colors, so map tokens through hsl().
const scheme = useColorScheme();
const t = scheme === 'dark' ? defaultTheme.dark : defaultTheme.light;
const cardStyle = {
  backgroundColor: hsl(t.background),
  textColor: hsl(t.foreground),
  placeholderColor: hsl(t.mutedForeground),
  borderColor: hsl(t.input),
};
```

This replaces the old hand-written `config/theme.ts` palette (`primary: { 600:
'#2563eb' }`, gray ramps, …) and the `useAppColors` hardcoded values — they now
come from the design system. The only literal that legitimately stays is RN
`shadowColor: '#000000'`, a fixed-black primitive tinted by elevation/opacity
(not a themed surface). See §5 for the full list of allowed exceptions.

---

## 3. Building the component library for NativeWind

The app above consumes `src`, but for consumers that load **`dist`**, the
library must emit JSX through NativeWind's runtime. In
`mail_box_components_rn`:

- `tsconfig.json`: `"jsxImportSource": "nativewind"`.
- `vite.config.ts`: `esbuild: { jsx: 'automatic', jsxImportSource: 'nativewind' }`,
  and keep the jsx runtimes external:
  `/^react\/jsx-(dev-)?runtime$/`, `/^nativewind(\/.*)?$/`,
  `/^react-native-css-interop(\/.*)?$/`.

Verify: `dist/index.esm.js` should `import { jsx } from "nativewind/jsx-runtime"`
and contain **no** bundled `react-jsx-runtime`.

---

## 4. React-Native gotchas (when building components)

1. **Text color does not inherit.** On web, a button's `text-white` cascades to
   its child text; in RN it does not. A component must apply the variant's
   `text-*`/`font-*` classes to the inner `<Text>` itself. (See
   `Button.shared.ts#extractTextClasses`.)
2. **Strip web-only classes.** Design-system variant strings include
   `ring-*`, `hover:`, `focus-visible:`, `transition-*`, `duration-*`. On RN,
   `ring`/`ring-offset` compile to a colorless **black box-shadow** that shows as
   black halos on rounded corners; the rest are no-ops. Strip them; keep
   `active:`. (See `Button.shared.ts#stripWebOnlyClasses`.)
3. **`.native` not `.rn` for bundler-resolved platform splits.** Metro
   auto-resolves `.native.ts`/`.ios.ts`/`.android.ts`, **not** `.rn.ts`. A bare
   deep import like `./config/firebase-init` only picks the native variant if it
   is named `firebase-init.native.ts`.
4. **Modals drop safe-area context.** `useSafeAreaInsets()` returns 0 inside a
   RN `<Modal>` (and a tab navigator reports `bottom: 0`). Wrap modal content in
   its own `<SafeAreaProvider>`.
5. **`cn()` must use `tailwind-merge`, not just `clsx`.** A component composes a
   variant string with a caller's `className` (e.g. `cn(variant.input(), props.className)`).
   NativeWind does **not** resolve same-property conflicts, so a passed override
   loses to the variant: `w-20` is ignored under the variant's `w-full` (symptom:
   a field/label rendered at full width, pushed offscreen); likewise `bg-card`
   under `bg-white`. Define `cn` as `twMerge(clsx(inputs))` so the **last** class
   wins, matching the web build. Declare `tailwind-merge` (and `clsx`) in the
   library's `peerDependencies` (and `devDependencies` for local builds), like
   `clsx`/`class-variance-authority`; the **consuming app** lists it in its own
   `dependencies` so a single copy is installed.
   ```ts
   // src/lib/utils.ts
   import { type ClassValue, clsx } from 'clsx';
   import { twMerge } from 'tailwind-merge';
   export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));
   ```

---

## 5. Usage guideline (the app's job)

- **Compose library components; set variants. Do not style in code.** No
  `StyleSheet.create` for colors/typography, no inline `backgroundColor`, no
  `useAppColors`. Layout-only utility classes (`flex-row`, `gap-2`, `p-4`) are
  fine via `className`.
- Map by intent:

  | Need | Use | Example |
  |---|---|---|
  | Action | `Button` | `variant="primary" \| "secondary" \| "outline" \| "destructive"` |
  | Body / labels | `Text` | `size weight color` |
  | Section title | `Heading` | `level size` |
  | Container / row | `Card` | `variant="default" \| "bordered" \| "elevated"` |
  | Text field | `Input` | `label error` |
  | Status pill | `Badge` | `variant pill` |
  | Inline message | `Alert` | `variant` |
  | Empty list | `EmptyState` | `message` |
  | Loading | `Spinner` | `size` |
  | Sticky actions | `BottomActionBar` | — |

- A component must reflect the theme. If it hardcodes colors
  (`text-blue-600`, `colors.raw.*`, `text-gray-900 dark:…`), fix the **library**
  to use semantic tokens (`text-foreground`, `text-muted-foreground`, `bg-card`,
  `border-border`, `text-primary`) rather than working around it in the app.
- **No raw color literals anywhere** — not Tailwind palette classes
  (`bg-blue-600`, `text-gray-500`, `border-gray-200`), not hex/`rgb()`/`hsl()`
  literals, not `text-white`/`bg-black` on themed surfaces. Use semantic tokens.
  - **Gradients/colored banners**: `bg-primary` (or `from-primary …` semantic
    stops) with `text-primary-foreground` for the on-color text — **not**
    `from-blue-600 to-blue-800 text-white`. (`text-primary-foreground` is the
    near-white "text on primary" token and flips correctly per theme.) Avoid a
    light semantic stop like `to-accent` under white text — it kills contrast.
  - **Concrete colors** required by React Navigation / native SDKs: derive from
    tokens via §2.12, don't hardcode.

- **Legitimate fixed-color exceptions** (these intentionally must NOT theme-flip):
  | Case | Why it stays literal |
  |---|---|
  | Printable/saveable QR labels (`bg-white`, `text-black`, the print-HTML) | Must be black-on-white to remain scannable in any theme; a token would flip and vanish |
  | Over-camera scrims/overlays (`bg-black`, `text-white` on a live `CameraView`) | Fixed contrast over an arbitrary camera feed, not a themed surface |
  | RN `shadowColor: '#000000'` | A fixed-black primitive tinted by elevation/opacity |
  | Category/brand identity colors (e.g. per-equipment-type icon tints) | Distinct identity marks (chart-palette style) with no semantic-token equivalent; keep in a single `config/*Icons.ts` data map, not inline |

  Anything outside this list should be a semantic token. A grep gate for raw
  literals over `src` (Tailwind palette classes + `#rrggbb` + `rgb(`/`hsl(`) is a
  useful CI check; whitelist only the rows above.

---

## 6. Verify

1. `bunx tailwindcss -i ./global.css -o /tmp/out.css` then grep for `bg-primary`,
   `text-destructive` — they must be generated.
2. Build the bundle and confirm semantic colors resolve to the theme:
   `curl '…/index.bundle?platform=ios&dev=true' | grep 'var(--primary)'`.
3. On device: primary button = theme blue + white text, clean corners; toggle
   the system appearance and confirm colors flip.

---

## 7. Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Components render unstyled (className ignored) | Lib built without nativewind jsx-runtime AND app bundles its `dist` | Build lib with `jsxImportSource: nativewind`, or ensure app resolves `src` |
| Buttons black / black corners | `ring-*` web classes; or theme not configured | Strip web-only classes; call `configureTheme` |
| Button text black, not white/red | RN text-color non-inheritance | Apply variant text classes to inner `<Text>` |
| Colors don't change with light/dark | CSS `.dark`/`@media` blocks don't switch on native | Use the `vars()` ThemeVarsProvider (§2.10), resolving scheme from RN `useColorScheme` + settings |
| Icons render with wrong/no color | `react-native-svg` not interop'd | `cssInterop(Svg, …)` (§2.11) |
| Square/sharp corners on cards & buttons | `calc()` radii don't evaluate on native | Concrete-px `borderRadius` override in `tailwind.config.js` (§2.5) |
| A `className` override (e.g. `w-20`, `bg-card`) is ignored | `cn` uses only `clsx`; no conflict resolution | `cn = twMerge(clsx(inputs))` (§4) |
| Edits to the library don't show | App bundles `src`; you rebuilt `dist` | Edit `src`; restart Metro (clears cache) |
| Tailwind build errors | `tailwindcss@4` installed | Downgrade to `^3.4` |
| `"Set X in .env"` though it's set | env not inlined (no inline-env plugin / stale Metro bundle) | §2.9 + `clean:metro` |
| Metro crash `RangeError: Invalid string length` | `watchFolders` too broad (sibling-repo root) + no watchman | Narrow `watchFolders`; `brew install watchman` (§2.1, §2.3) |
| All jest suites fail to transform: "module factory of `jest.mock()` is not allowed to reference out-of-scope variables" | NativeWind's jsx-runtime import is hoisted; trips babel-plugin-jest-hoist | Gate NativeWind to the Metro caller in `babel.config.js` (§2.2) |

**App-native prerequisites (not NativeWind, but block the first iOS run):**

| Symptom | Cause | Fix |
|---|---|---|
| `xcodebuild` err 65: "Could not get GOOGLE_APP_ID" | `GoogleService-Info.plist` on disk but not in the Xcode target's Copy Bundle Resources | Add it to the target in Xcode (or via CocoaPods' bundled `xcodeproj`) |
| `xcodebuild` err 65: provisioning profile lacks Push Notifications / `aps-environment` | signing/capabilities not provisioned for the team | Use a provisioning profile with the Push Notifications capability |
