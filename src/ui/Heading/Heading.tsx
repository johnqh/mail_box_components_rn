import * as React from 'react';
import { Text } from 'react-native';
import { cn } from '../../lib/utils';

export interface HeadingProps {
  /** Heading content */
  children: React.ReactNode;
  /** Heading level (for semantic/accessibility purposes) */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Size (independent of level for visual flexibility) */
  size?: '4xl' | '3xl' | '2xl' | 'xl' | 'lg' | 'base';
  /** Weight variant */
  weight?: 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
  /** Color variant */
  color?: 'default' | 'muted' | 'primary';
  /** Text alignment */
  align?: 'left' | 'center' | 'right';
  /** Additional className */
  className?: string;
}

/**
 * Heading Component
 *
 * Semantic heading component with flexible sizing and styling.
 * Level is used for accessibility, size controls visual appearance.
 *
 * @example
 * ```tsx
 * <Heading level={1} size="4xl">
 *   Page Title
 * </Heading>
 * ```
 *
 * @example
 * ```tsx
 * <Heading level={2} size="xl" color="primary">
 *   Section Title
 * </Heading>
 * ```
 */
export const Heading: React.FC<HeadingProps> = ({
  children,
  level = 2,
  size,
  weight = 'bold',
  color = 'default',
  align,
  className,
}) => {
  // Default sizes based on level if not explicitly provided
  const defaultSizes = {
    1: '4xl',
    2: '3xl',
    3: '2xl',
    4: 'xl',
    5: 'lg',
    6: 'base',
  } as const;

  const actualSize = size || defaultSizes[level];

  // Size configurations
  const sizeClasses = {
    '4xl': 'text-4xl',
    '3xl': 'text-3xl',
    '2xl': 'text-2xl',
    xl: 'text-xl',
    lg: 'text-lg',
    base: 'text-base',
  };

  // Weight configurations
  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold',
    extrabold: 'font-extrabold',
  };

  // Color configurations
  const colorClasses = {
    default: 'text-gray-900 dark:text-gray-100',
    muted: 'text-gray-700 dark:text-gray-300',
    primary: 'text-blue-600 dark:text-blue-400',
  };

  // Alignment configurations
  const alignClasses = align
    ? {
        left: 'text-left',
        center: 'text-center',
        right: 'text-right',
      }[align]
    : '';

  return (
    <Text
      className={cn(
        sizeClasses[actualSize],
        weightClasses[weight],
        colorClasses[color],
        alignClasses,
        className
      )}
      accessibilityRole='header'
    >
      {children}
    </Text>
  );
};
