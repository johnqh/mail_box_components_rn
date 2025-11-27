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
 * Map size abbreviations to design system variant keys
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
 * Get button variant class from design system
 */
export const getButtonVariantClass = (
  variantName: string,
  sizeName: string | undefined,
  v: any
): string => {
  if (variantName.startsWith('gradient')) {
    const gradientType = variantName
      .replace('gradient-', '')
      .replace('gradient', 'primary');
    return v.button.gradient[gradientType]?.() || v.button.primary.default();
  } else if (['wallet', 'connect', 'disconnect'].includes(variantName)) {
    return v.button.web3[variantName]?.() || v.button.primary.default();
  } else {
    const sizeType = mapSizeToVariantKey(sizeName);
    return v.button[variantName]?.[sizeType]?.() || v.button.primary.default();
  }
};

/**
 * Shared button state logic
 */
export const useButtonState = (
  loading: boolean | undefined,
  disabled: boolean | undefined
) => ({
  isDisabled: loading || disabled || false,
  showSpinner: loading || false,
});
