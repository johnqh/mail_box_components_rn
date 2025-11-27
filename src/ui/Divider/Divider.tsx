import * as React from 'react';
import { View, Text, ViewProps } from 'react-native';
import { cn } from '../../lib/utils';
import { textVariants } from '@sudobility/design';

export interface DividerProps extends ViewProps {
  /** Optional text label */
  label?: string;
  /** Label position */
  labelPosition?: 'left' | 'center' | 'right';
  /** Orientation */
  orientation?: 'horizontal' | 'vertical';
  /** Spacing around the divider */
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** Line thickness */
  thickness?: 'thin' | 'medium' | 'thick';
  /** Color variant */
  variant?: 'light' | 'medium' | 'dark';
  /** Additional className for the container */
  className?: string;
  /** Additional className for the line */
  lineClassName?: string;
}

/**
 * Divider Component
 *
 * A visual separator for content sections with optional label support.
 * Can be used horizontally or vertically to divide content areas.
 *
 * @example
 * ```tsx
 * <Divider />
 * <Divider label="OR" labelPosition="center" />
 * <Divider spacing="lg" variant="medium" />
 * ```
 *
 * @example
 * ```tsx
 * // Vertical divider
 * <View className="flex flex-row gap-4">
 *   <View><Text>Content 1</Text></View>
 *   <Divider orientation="vertical" />
 *   <View><Text>Content 2</Text></View>
 * </View>
 * ```
 */
export const Divider: React.FC<DividerProps> = ({
  label,
  labelPosition = 'center',
  orientation = 'horizontal',
  spacing = 'md',
  thickness = 'thin',
  variant = 'light',
  className,
  lineClassName,
  ...viewProps
}) => {
  // Spacing configurations
  const spacingClasses = {
    horizontal: {
      none: 'my-0',
      sm: 'my-2',
      md: 'my-4',
      lg: 'my-6',
      xl: 'my-8',
    },
    vertical: {
      none: 'mx-0',
      sm: 'mx-2',
      md: 'mx-4',
      lg: 'mx-6',
      xl: 'mx-8',
    },
  };

  // Thickness configurations (using border for horizontal, width for vertical)
  const thicknessValues = {
    thin: 1,
    medium: 2,
    thick: 4,
  };

  // Color variant configurations
  const variantClasses = {
    light: 'bg-gray-200 dark:bg-gray-700',
    medium: 'bg-gray-300 dark:bg-gray-600',
    dark: 'bg-gray-400 dark:bg-gray-500',
  };

  // Vertical divider
  if (orientation === 'vertical') {
    return (
      <View
        className={cn(
          'self-stretch',
          variantClasses[variant],
          spacingClasses.vertical[spacing],
          className
        )}
        style={{ width: thicknessValues[thickness] }}
        accessibilityRole='none'
        {...viewProps}
      />
    );
  }

  // Horizontal divider without label
  if (!label) {
    return (
      <View
        className={cn(
          'w-full',
          variantClasses[variant],
          spacingClasses.horizontal[spacing],
          lineClassName,
          className
        )}
        style={{ height: thicknessValues[thickness] }}
        accessibilityRole='none'
        {...viewProps}
      />
    );
  }

  // Horizontal divider with label
  const labelPositionClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  };

  return (
    <View
      className={cn(
        'flex flex-row items-center',
        spacingClasses.horizontal[spacing],
        labelPositionClasses[labelPosition],
        className
      )}
      accessibilityRole='none'
      {...viewProps}
    >
      {labelPosition !== 'left' && (
        <View
          className={cn('flex-1', variantClasses[variant], lineClassName)}
          style={{ height: thicknessValues[thickness] }}
        />
      )}
      <Text
        className={cn(
          textVariants.body.sm(),
          'px-3 text-gray-500 dark:text-gray-400'
        )}
      >
        {label}
      </Text>
      {labelPosition !== 'right' && (
        <View
          className={cn('flex-1', variantClasses[variant], lineClassName)}
          style={{ height: thicknessValues[thickness] }}
        />
      )}
    </View>
  );
};
