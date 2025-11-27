import * as React from 'react';
import { View, Text } from 'react-native';
import { cn } from '../../lib/utils';

export interface IconTextProps {
  /** Icon element to display */
  icon: React.ReactNode;
  /** Text content */
  children: React.ReactNode;
  /** Icon position */
  iconPosition?: 'left' | 'right' | 'top';
  /** Gap between icon and text */
  gap?: 'xs' | 'sm' | 'md' | 'lg';
  /** Text alignment (for top icon position) */
  align?: 'left' | 'center' | 'right';
  /** Color variant */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'muted';
  /** Additional className for the container */
  className?: string;
  /** Additional className for the text */
  textClassName?: string;
}

/**
 * IconText Component
 *
 * Displays an icon alongside text content with flexible positioning and styling.
 * Commonly used for buttons, labels, list items, and feature highlights.
 *
 * @example
 * ```tsx
 * <IconText icon={<CheckIcon />}>
 *   Feature enabled
 * </IconText>
 * ```
 *
 * @example
 * ```tsx
 * <IconText
 *   icon={<StarIcon />}
 *   iconPosition="top"
 *   align="center"
 *   variant="primary"
 * >
 *   Premium Feature
 * </IconText>
 * ```
 */
export const IconText: React.FC<IconTextProps> = ({
  icon,
  children,
  iconPosition = 'left',
  gap = 'md',
  align = 'left',
  variant = 'default',
  className,
  textClassName,
}) => {
  // Gap configurations
  const gapClasses = {
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4',
  };

  // Alignment classes (for top icon position)
  const alignClasses = {
    left: 'items-start',
    center: 'items-center',
    right: 'items-end',
  };

  // Text alignment classes
  const textAlignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  // Color variant configurations
  const variantClasses = {
    default: 'text-gray-700 dark:text-gray-300',
    primary: 'text-blue-600 dark:text-blue-400',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    danger: 'text-red-600 dark:text-red-400',
    muted: 'text-gray-500 dark:text-gray-400',
  };

  // Layout based on icon position
  const layoutClasses = {
    left: 'flex-row items-center',
    right: 'flex-row-reverse items-center',
    top: 'flex-col',
  };

  return (
    <View
      className={cn(
        'flex',
        layoutClasses[iconPosition],
        gapClasses[gap],
        iconPosition === 'top' && alignClasses[align],
        className
      )}
    >
      {icon}
      <Text
        className={cn(
          variantClasses[variant],
          iconPosition === 'top' && textAlignClasses[align],
          textClassName
        )}
      >
        {children}
      </Text>
    </View>
  );
};
