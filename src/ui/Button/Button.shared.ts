import { type ReactNode } from 'react';

/**
 * Base button props shared between web and React Native
 */
export interface ButtonBaseProps {
  variant?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'ghost'
    | 'destructive'
    | 'destructive-outline'
    | 'success'
    | 'link'
    | 'gradient'
    | 'gradient-secondary'
    | 'gradient-success'
    | 'wallet'
    | 'connect'
    | 'disconnect';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  animation?:
    | 'none'
    | 'hover'
    | 'lift'
    | 'scale'
    | 'glow'
    | 'shimmer'
    | 'tap'
    | 'connect'
    | 'transaction'
    | 'disconnect';
  disabled?: boolean;
  loading?: boolean;
  children: ReactNode;
}

/**
 * Map size abbreviations to design system variant keys.
 *
 * @param size - The abbreviated size key ('sm', 'lg', or 'default')
 * @returns The full design system variant key ('small', 'large', or 'default')
 */
export const mapSizeToVariantKey = (size: string | undefined): string => {
  if (!size) return 'default';
  const sizeMap: Record<string, string> = {
    sm: 'small',
    lg: 'large',
    default: 'default',
  };
  return sizeMap[size] || size;
};

/**
 * Strip web-only Tailwind classes that NativeWind cannot render meaningfully on
 * React Native — and that produce visual artifacts when it tries.
 *
 * The design system's variant strings are shared with the web and include hover
 * states, focus rings, and CSS transitions. On native, `ring-*`/`ring-offset-*`
 * compile to a `box-shadow` with no color (→ a black halo around rounded
 * corners), and `hover:`/`focus:`/`transition` are no-ops. `active:` is kept
 * because Pressable supports it.
 *
 * @param className - A Tailwind class string from the design system
 * @returns The class string with web-only tokens removed
 */
export const stripWebOnlyClasses = (className: string): string =>
  className
    .split(/\s+/)
    .filter(Boolean)
    .filter(token => {
      if (
        /^(hover|focus|focus-visible|focus-within|group-hover|group-focus):/.test(
          token
        )
      )
        return false;
      const base = token.includes(':')
        ? token.slice(token.lastIndexOf(':') + 1)
        : token;
      return !(
        base.startsWith('ring') ||
        base.startsWith('transition') ||
        base.startsWith('duration') ||
        base.startsWith('ease') ||
        base.startsWith('cursor') ||
        base === 'inline-flex' ||
        base === 'inline-block' ||
        base === 'inline'
      );
    })
    .join(' ');

/**
 * Where each `variant` lives in the design system's `variants.button`.
 *
 * Most names are a key of their own (`secondary` → `button.secondary`), but
 * the hyphenated ones are a key *inside* another: `destructive-outline` is
 * `button.destructive.outline`. Looking `button['destructive-outline']` up
 * found nothing and quietly drew the primary button instead, so every variant
 * is listed here and a test holds each one to its own classes.
 *
 * `sized` variants take the size key (`small`/`large`) under their group and
 * fall back to the group's `default` when the group has no such size.
 * `success` has no solid button in the design system; it is the primary
 * button with its colours swapped for the success tokens.
 */
type ButtonVariantRoute =
  | { kind: 'sized'; group: string }
  | { kind: 'fixed'; group: string; key: string }
  | { kind: 'success' };

export const BUTTON_VARIANT_ROUTES: Record<
  NonNullable<ButtonBaseProps['variant']>,
  ButtonVariantRoute
> = {
  default: { kind: 'sized', group: 'primary' },
  primary: { kind: 'sized', group: 'primary' },
  secondary: { kind: 'sized', group: 'secondary' },
  outline: { kind: 'sized', group: 'outline' },
  ghost: { kind: 'sized', group: 'ghost' },
  destructive: { kind: 'sized', group: 'destructive' },
  'destructive-outline': {
    kind: 'fixed',
    group: 'destructive',
    key: 'outline',
  },
  success: { kind: 'success' },
  link: { kind: 'sized', group: 'link' },
  gradient: { kind: 'fixed', group: 'gradient', key: 'primary' },
  'gradient-secondary': { kind: 'fixed', group: 'gradient', key: 'secondary' },
  'gradient-success': { kind: 'fixed', group: 'gradient', key: 'success' },
  wallet: { kind: 'fixed', group: 'web3', key: 'wallet' },
  connect: { kind: 'fixed', group: 'web3', key: 'connect' },
  disconnect: { kind: 'fixed', group: 'web3', key: 'disconnect' },
};

/** The primary button's colour classes, re-pointed at the success tokens. */
const toSuccessColors = (className: string): string =>
  className.replace(
    /(^|[\s:])(bg|text|border)-primary(?=-foreground|\/|\s|$)/g,
    '$1$2-success'
  );

/**
 * Get button variant class string from the design system.
 *
 * Resolves the variant through {@link BUTTON_VARIANT_ROUTES}, with size
 * modifiers for the sized groups. Web-only classes are stripped so the result
 * renders cleanly on React Native. An unknown variant draws the primary
 * button.
 *
 * @param variantName - The button variant name (e.g., 'primary', 'gradient', 'wallet')
 * @param sizeName - Optional size abbreviation ('sm' or 'lg')
 * @param v - The design system variants object
 * @returns A Tailwind class string from the design system
 */
export const getButtonVariantClass = (
  variantName: string,
  sizeName: string | undefined,
  v: any
): string => {
  const sizeType = mapSizeToVariantKey(sizeName);
  const sized = (group: string): string | undefined =>
    v.button[group]?.[sizeType]?.() || v.button[group]?.default?.();
  const primary = (): string => sized('primary') || v.button.primary.default();

  const route =
    BUTTON_VARIANT_ROUTES[variantName as keyof typeof BUTTON_VARIANT_ROUTES];
  let raw: string | undefined;
  if (!route) raw = undefined;
  else if (route.kind === 'sized') raw = sized(route.group);
  else if (route.kind === 'fixed') raw = v.button[route.group]?.[route.key]?.();
  else raw = toSuccessColors(primary());

  return stripWebOnlyClasses(raw || primary());
};

/**
 * Extract the text-affecting classes (color, size, weight) from a button's
 * variant class string.
 *
 * On the web, a button's `text-*` color class cascades to its child text via CSS
 * color inheritance. React Native has NO such inheritance — `Text` color must be
 * set on the `Text` element itself. So we pull the `text-*`/`font-*` tokens off
 * the container variant class and re-apply them to the inner `Text`, matching the
 * web rendering. Modifier-prefixed tokens (e.g. `dark:text-white`) are kept.
 *
 * @param className - The full variant class string from the design system
 * @returns A space-separated string of only the text/font classes
 */
export const extractTextClasses = (className: string): string =>
  className
    .split(/\s+/)
    .filter(Boolean)
    .filter(token => {
      // Strip state/breakpoint modifiers (dark:, active:, hover:, etc.)
      const base = token.includes(':')
        ? token.slice(token.lastIndexOf(':') + 1)
        : token;
      return base.startsWith('text-') || base.startsWith('font-');
    })
    .join(' ');

/**
 * Shared button state logic for determining disabled and spinner visibility.
 *
 * @param loading - Whether the button is in a loading state
 * @param disabled - Whether the button is explicitly disabled
 * @returns An object with `isDisabled` and `showSpinner` booleans
 */
export const useButtonState = (
  loading: boolean | undefined,
  disabled: boolean | undefined
) => ({
  isDisabled: loading || disabled || false,
  showSpinner: loading || false,
});
