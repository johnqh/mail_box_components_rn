import * as React from 'react';
import { View } from 'react-native';
import { cn } from '../../lib/utils';

export interface SeparatorProps {
  /** Separator orientation */
  orientation?: 'horizontal' | 'vertical';
  /** Spacing around separator */
  spacing?: 'none' | 'sm' | 'md' | 'lg';
  /** Line thickness */
  thickness?: 'thin' | 'medium' | 'thick';
  /** Additional className */
  className?: string;
}

/**
 * Separator Component
 *
 * Simple horizontal or vertical line separator.
 * Use for visual separation in menus, lists, and layouts.
 *
 * @example
 * ```tsx
 * <View>
 *   <MenuItem>Option 1</MenuItem>
 *   <Separator />
 *   <MenuItem>Option 2</MenuItem>
 * </View>
 * ```
 *
 * @example
 * ```tsx
 * <View className="flex flex-row items-center gap-4">
 *   <Button>Action 1</Button>
 *   <Separator orientation="vertical" spacing="md" />
 *   <Button>Action 2</Button>
 * </View>
 * ```
 */
export const Separator: React.FC<SeparatorProps> = ({
  orientation = 'horizontal',
  spacing = 'md',
  thickness = 'thin',
  className,
}) => {
  // Spacing configurations
  const spacingClasses = {
    horizontal: {
      none: '',
      sm: 'my-1',
      md: 'my-2',
      lg: 'my-4',
    },
    vertical: {
      none: '',
      sm: 'mx-1',
      md: 'mx-2',
      lg: 'mx-4',
    },
  };

  // Thickness configurations
  const thicknessClasses = {
    horizontal: {
      thin: 'h-px',
      medium: 'h-0.5',
      thick: 'h-1',
    },
    vertical: {
      thin: 'w-px',
      medium: 'w-0.5',
      thick: 'w-1',
    },
  };

  const isHorizontal = orientation === 'horizontal';

  return (
    <View
      accessibilityRole='none'
      className={cn(
        'bg-gray-200 dark:bg-gray-700',
        isHorizontal ? 'w-full' : 'h-full',
        thicknessClasses[orientation][thickness],
        spacingClasses[orientation][spacing],
        className
      )}
    />
  );
};
