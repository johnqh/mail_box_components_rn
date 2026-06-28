import * as React from 'react';
import { View } from 'react-native';
import { cn } from '../../lib/utils';
import { colors } from '@sudobility/design';

export interface IconContainerProps {
  /** Icon element */
  children: React.ReactNode;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Color variant */
  variant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'error'
    | 'neutral';
  /** Shape variant */
  shape?: 'square' | 'rounded' | 'circle';
  /** Additional className */
  className?: string;
}

/**
 * IconContainer Component
 *
 * Styled container for displaying icons with consistent sizing and colors.
 * Commonly used in feature lists, settings, and navigation.
 *
 * @example
 * ```tsx
 * <IconContainer size="lg" variant="primary" shape="rounded">
 *   <SettingsIcon />
 * </IconContainer>
 * ```
 */

// Lazily derive icon container colors from DS to avoid ESM issues in tests.
let _iconContainerColors: Record<string, string> | null = null;
function getIconContainerColors() {
  if (!_iconContainerColors) {
    const badge = colors.component.badge;
    // DS badge classes include text-*, but IconContainer only needs bg-*
    function extractBg(base: string, dark: string) {
      const all = `${base} ${dark}`.split(' ');
      return all.filter(c => c.includes('bg-')).join(' ');
    }
    _iconContainerColors = {
      primary: extractBg(badge.primary.base, badge.primary.dark),
      secondary: 'bg-accent', // DS has no purple badge variant; local fallback
      success: extractBg(badge.success.base, badge.success.dark),
      warning: extractBg(badge.warning.base, badge.warning.dark),
      error: extractBg(badge.error.base, badge.error.dark),
      neutral: extractBg(badge.default.base, badge.default.dark),
    };
  }
  return _iconContainerColors;
}

export const IconContainer: React.FC<IconContainerProps> = ({
  children,
  size = 'md',
  variant = 'primary',
  shape = 'rounded',
  className,
}) => {
  // Size configurations
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  };

  // Variant configurations from DS
  const variantClasses = getIconContainerColors();

  // Shape configurations
  const shapeClasses = {
    square: 'rounded-lg',
    rounded: 'rounded-2xl',
    circle: 'rounded-full',
  };

  return (
    <View
      className={cn(
        'items-center justify-center',
        sizeClasses[size],
        variantClasses[variant],
        shapeClasses[shape],
        className
      )}
    >
      {children}
    </View>
  );
};
