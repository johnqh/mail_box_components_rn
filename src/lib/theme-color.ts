/**
 * The host's theme colours as values React Native can take.
 *
 * **Prefer a class.** Most of this package colours itself with NativeWind's
 * semantic classes (`bg-primary`, `text-muted-foreground`), and NativeWind
 * resolves those against whatever the host applied — including CSS variables
 * a host sets at run time with `vars()`, which is how a host lets its reader
 * choose light or dark independently of the OS. Several props that look as if
 * they need a string take a class after all:
 *
 * - `ActivityIndicator`: `className='text-primary'` becomes its `color`.
 * - `TextInput`: `placeholder:text-muted-foreground` becomes
 *   `placeholderTextColor`.
 * - `Svg` (registered in `./svg-interop`): `className='text-primary'` becomes
 *   its `color`, which `fill='currentColor'` paths then use.
 *
 * This module is for what is left: a `Switch`'s `trackColor`, a colour in a
 * style object, an icon's `color` prop. {@link useThemeColor} answers, in
 * order:
 *
 * 1. the host's runtime CSS variable for the token (`--primary`,
 *    `--muted-foreground`, …), read through NativeWind — so it follows exactly
 *    the palette the host applied, whatever the OS appearance says;
 * 2. otherwise the active `@sudobility/design` theme (`configureTheme`), in the
 *    light or dark palette as the OS appearance is;
 * 3. otherwise the caller's `fallback` — the colour the component drew before
 *    it was themed — or `undefined`, which leaves the platform's own colour.
 */
import { Platform, useColorScheme } from 'react-native';
import { useUnstableNativeVariable } from 'nativewind';
import { getActiveTheme } from '@sudobility/design';
import type { ThemeTokens } from '@sudobility/design';

/** The theme tokens that are colours (radius, shadows and fonts are not). */
export type ThemeColorToken = Exclude<
  keyof ThemeTokens,
  | 'radius'
  | 'borderWidth'
  | 'shadowSm'
  | 'shadowMd'
  | 'shadowLg'
  | 'fontSans'
  | 'fontMono'
>;

export type ColorSchemeName = 'light' | 'dark';

export interface ThemeColorOptions {
  /** 0–1. Draws the token translucent, like a class's `/10`. */
  alpha?: number;
}

/**
 * `"0 84% 43.3%"` — the shape every `@sudobility/design` colour token has — as
 * `hsl(0, 84%, 43.3%)`, or `hsla(…)` with an alpha.
 */
export function hslTokenToCss(triple: string, alpha?: number): string {
  const parts = triple.trim().split(/\s+/).join(', ');
  return alpha === undefined ? `hsl(${parts})` : `hsla(${parts}, ${alpha})`;
}

/** `mutedForeground` → `--muted-foreground`, the name a host's `vars()` uses. */
export function themeVariableName(token: ThemeColorToken): string {
  return '--' + token.replace(/[A-Z]/g, m => '-' + m.toLowerCase());
}

const HSL_TRIPLE = /^-?[\d.]+(deg)?\s+[\d.]+%\s+[\d.]+%$/;
const COLOR_STRING = /^(#[0-9a-f]{3,8}|(rgb|hsl)a?\(.*\)|[a-z]+)$/i;

/**
 * A CSS variable's value as a colour React Native can draw, or `undefined`
 * when there is none. A design-token triple (`0 84% 43%`) becomes `hsl()`;
 * a string that is already a colour (`#…`, `rgb()`, `hsl()`, a name) is
 * passed through, with no alpha applied since its format is unknown; anything
 * else answers `undefined`, so the caller falls back rather than drawing it.
 */
export function themeVariableToCss(
  value: unknown,
  alpha?: number
): string | undefined {
  // A variable compiled from CSS can arrive as its tokens; one set by
  // `vars()` arrives as the string it was given.
  const fromTokens = Array.isArray(value);
  const text = fromTokens
    ? (value as unknown[]).map(String).join(' ').trim()
    : typeof value === 'string'
      ? value.trim()
      : '';
  if (!text) return undefined;
  if (HSL_TRIPLE.test(text)) return hslTokenToCss(text, alpha);
  return !fromTokens && COLOR_STRING.test(text) ? text : undefined;
}

/**
 * The active `@sudobility/design` theme, or null — also where the design
 * system is a partial stub (a consumer's test mock) without `getActiveTheme`.
 */
export function activeTheme(): ReturnType<typeof getActiveTheme> | null {
  return typeof getActiveTheme === 'function' ? getActiveTheme() : null;
}

/**
 * The colour of `token` in the active `@sudobility/design` theme for
 * `scheme`, or `fallback` when no theme is active or the theme leaves the
 * token out. This ignores the variables a host applies at run time — inside a
 * component, use {@link useThemeColor}.
 */
export function resolveThemeColor<F extends string | undefined>(
  token: ThemeColorToken,
  scheme: ColorSchemeName,
  fallback: F,
  alpha?: number
): string | F {
  const value = activeTheme()?.[scheme]?.[token];
  return value ? hslTokenToCss(value, alpha) : fallback;
}

/*
  NativeWind's variable reader is native-only (on web it logs and answers
  nothing) and absent where nativewind is stubbed out. Which of the two this
  is never changes while the app runs, so the hook below calls the same hooks
  on every render.
*/
const readNativeVariable: (name: string) => unknown =
  Platform.OS !== 'web' && typeof useUnstableNativeVariable === 'function'
    ? useUnstableNativeVariable
    : () => undefined;

/**
 * One theme colour, as the host applied it. See the module comment for the
 * order it is looked up in. One hook per colour: call it once for each token
 * a component needs.
 *
 * @example
 * ```tsx
 * const on = useThemeColor('primary');
 * <NativeSwitch trackColor={{ true: on }} />
 * ```
 */
export function useThemeColor<F extends string | undefined = undefined>(
  token: ThemeColorToken,
  fallback?: F,
  options?: ThemeColorOptions
): string | F {
  const variable = readNativeVariable(themeVariableName(token));
  const scheme: ColorSchemeName =
    useColorScheme() === 'dark' ? 'dark' : 'light';
  return (
    themeVariableToCss(variable, options?.alpha) ??
    resolveThemeColor(token, scheme, fallback as F, options?.alpha)
  );
}
