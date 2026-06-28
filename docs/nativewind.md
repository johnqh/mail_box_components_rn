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
```
`react-native-css-interop` comes in transitively with nativewind.

### 2.2 `babel.config.js`

Route the app's JSX through NativeWind's runtime so `className` becomes styles.
Keep any existing presets/plugins (module-resolver, etc.).

```js
module.exports = {
  presets: [
    ['babel-preset-expo', { jsxImportSource: 'nativewind' }],
    'nativewind/babel',
  ],
  plugins: [ /* module-resolver, … */ ],
};
```

### 2.3 `metro.config.js`

Wrap the config with `withNativeWind`, preserving the resolver settings used to
resolve the `@sudobility` packages.

```js
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');

const defaultConfig = getDefaultConfig(__dirname);
const config = mergeConfig(defaultConfig, {
  resolver: {
    sourceExts: [...defaultConfig.resolver.sourceExts, 'cjs'],
    resolverMainFields: ['react-native', 'browser', 'main'],
    unstable_conditionNames: ['react-native', 'require', 'import', 'default'],
  },
});

module.exports = withNativeWind(config, { input: './global.css' });
```

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
// generateThemeCSS emits ":root {light} .dark {dark}"; keep only :root.
const lightRoot = generateThemeCSS(activeTheme).replace(/\n\n\.dark\s*\{[\s\S]*?\n\}\n?$/, '\n');
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

module.exports = {
  darkMode: 'class',
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    './node_modules/@sudobility/components-rn/{src,dist}/**/*.{js,jsx,ts,tsx}',
    './node_modules/@sudobility/design/dist/**/*.{js,jsx}',
  ],
  presets: [require('nativewind/preset'), createTailwindPreset()],
  theme: { extend: {} },
  plugins: [],
};
```

> `createTailwindPreset()` (CSS variables) supports light **and** dark.
> `createNativeWindPreset(theme)` bakes in **light-only** concrete colors — use
> it only if you don't need dark mode.

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
- Retire the app's `useAppColors`/`StyleSheet` colors in favor of components +
  semantic classes (see §5).

### 2.11 SVG / icon colors

`react-native-svg` (and heroicons) need a one-time `cssInterop` so `className`
color utilities tint them (and flip light/dark):

```ts
import { cssInterop } from 'nativewind';
import Svg from 'react-native-svg';
cssInterop(Svg, { className: { target: 'style', nativeStyleToProp: { color: true } } });
```

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
| Edits to the library don't show | App bundles `src`; you rebuilt `dist` | Edit `src`; restart Metro (clears cache) |
| Tailwind build errors | `tailwindcss@4` installed | Downgrade to `^3.4` |
