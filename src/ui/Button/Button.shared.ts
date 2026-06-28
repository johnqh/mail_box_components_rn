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
 * Get button variant class string from the design system.
 *
 * Handles gradient variants, web3 variants (wallet/connect/disconnect),
 * and standard variants with size modifiers. Web-only classes are stripped so
 * the result renders cleanly on React Native.
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
  let raw: string;
  if (variantName.startsWith('gradient')) {
    const gradientType = variantName
      .replace('gradient-', '')
      .replace('gradient', 'primary');
    raw = v.button.gradient[gradientType]?.() || v.button.primary.default();
  } else if (['wallet', 'connect', 'disconnect'].includes(variantName)) {
    raw = v.button.web3[variantName]?.() || v.button.primary.default();
  } else {
    const sizeType = mapSizeToVariantKey(sizeName);
    raw = v.button[variantName]?.[sizeType]?.() || v.button.primary.default();
  }
  return stripWebOnlyClasses(raw);
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
