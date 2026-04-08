import * as React from 'react';
import { Text as RNText } from 'react-native';
import { cn } from '../../lib/utils';
import { designTokens } from '@sudobility/design';

const { typography } = designTokens;

// Semantic text colors aligned with the design system color architecture.
// The DS provides these as hex values via colors.semantic; here they are
// expressed as Tailwind classes for NativeWind consumption.
const colorClasses = {
  default: 'text-gray-900 dark:text-gray-100',
  muted: 'text-gray-600 dark:text-gray-400',
  primary: 'text-blue-600 dark:text-blue-400',
  success: 'text-green-600 dark:text-green-400',
  warning: 'text-yellow-600 dark:text-yellow-400',
  danger: 'text-red-600 dark:text-red-400',
} as const;

export interface TextProps {
  /** Text content */
  children: React.ReactNode;
  /** Size variant */
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  /** Weight variant */
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold';
  /** Color variant */
  color?: 'default' | 'muted' | 'primary' | 'success' | 'warning' | 'danger';
  /** Text alignment */
  align?: 'left' | 'center' | 'right';
  /** Text transform */
  transform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  /** Number of lines (for truncation) */
  numberOfLines?: number;
  /** Additional className */
  className?: string;
}

/**
 * Text Component
 *
 * Versatile text component with consistent styling.
 * Supports various sizes, weights, colors, and formatting options.
 *
 * @example
 * ```tsx
 * <Text size="lg" weight="semibold">
 *   Large semibold text
 * </Text>
 * ```
 *
 * @example
 * ```tsx
 * <Text color="muted" size="sm">
 *   Muted small text
 * </Text>
 * ```
 */
export const Text: React.FC<TextProps> = ({
  children,
  size = 'base',
  weight = 'normal',
  color = 'default',
  align,
  transform = 'none',
  numberOfLines,
  className,
}) => {
  return (
    <RNText
      className={cn(
        typography.size[size],
        typography.weight[weight],
        colorClasses[color],
        align ? typography.align[align] : '',
        transform !== 'none' ? typography.transform[transform] : '',
        className
      )}
      numberOfLines={numberOfLines}
    >
      {children}
    </RNText>
  );
};
