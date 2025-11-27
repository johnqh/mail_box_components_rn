import * as React from 'react';
import { View, Text } from 'react-native';
import { cn } from '../../lib/utils';

export interface KbdProps {
  /** Keyboard key(s) to display */
  children: React.ReactNode;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional className */
  className?: string;
}

/**
 * Kbd Component
 *
 * Displays keyboard shortcuts with consistent styling.
 * Used to represent user input from keyboard.
 *
 * @example
 * ```tsx
 * <View className="flex-row items-center gap-1">
 *   <Kbd>Ctrl</Kbd>
 *   <Text>+</Text>
 *   <Kbd>C</Kbd>
 * </View>
 * ```
 *
 * @example
 * ```tsx
 * <Text>Press <Kbd size="sm">Enter</Kbd> to submit</Text>
 * ```
 */
export const Kbd: React.FC<KbdProps> = ({
  children,
  size = 'md',
  className,
}) => {
  // Size configurations
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-2.5 py-1.5',
  };

  return (
    <View
      className={cn(
        'items-center justify-center',
        'bg-gray-100 dark:bg-gray-800',
        'border border-gray-300 dark:border-gray-600',
        'rounded',
        sizeClasses[size],
        className
      )}
      accessibilityRole='text'
    >
      <Text
        className={cn(
          'font-mono font-semibold',
          'text-gray-900 dark:text-gray-100',
          size === 'sm' && 'text-xs',
          size === 'md' && 'text-sm',
          size === 'lg' && 'text-base'
        )}
      >
        {children}
      </Text>
    </View>
  );
};
