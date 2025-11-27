import * as React from 'react';
import { View, Text, Animated } from 'react-native';
import { cn } from '../../lib/utils';

export interface ProgressProps {
  /** Progress value (0-100) */
  value?: number;
  /** Maximum value */
  max?: number;
  /** Color variant */
  variant?: 'default' | 'success' | 'warning' | 'danger';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Show label */
  showLabel?: boolean;
  /** Custom label */
  label?: string;
  /** Indeterminate state (loading) */
  indeterminate?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * Progress Component
 *
 * Linear progress indicator with support for determinate and indeterminate states.
 *
 * @example
 * ```tsx
 * <Progress value={75} showLabel />
 * ```
 *
 * @example
 * ```tsx
 * <Progress indeterminate />
 * ```
 */
export const Progress: React.FC<ProgressProps> = ({
  value = 0,
  max = 100,
  variant = 'default',
  size = 'md',
  showLabel = false,
  label,
  indeterminate = false,
  className,
}) => {
  // Animation for indeterminate state
  const animatedValue = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (indeterminate) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: false,
          }),
        ])
      ).start();
    }
  }, [indeterminate, animatedValue]);

  // Clamp value between 0 and 100
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  // Color configurations
  const colorClasses = {
    default: 'bg-blue-600 dark:bg-blue-500',
    success: 'bg-green-600 dark:bg-green-500',
    warning: 'bg-yellow-600 dark:bg-yellow-500',
    danger: 'bg-red-600 dark:bg-red-500',
  };

  // Size configurations
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-4',
  };

  const interpolatedWidth = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View className={cn('w-full', className)}>
      <View
        className={cn(
          'w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden',
          sizeClasses[size]
        )}
        accessibilityRole='progressbar'
        accessibilityValue={{
          now: indeterminate ? undefined : percentage,
          min: 0,
          max: 100,
        }}
      >
        {indeterminate ? (
          <Animated.View
            className={cn('h-full rounded-full', colorClasses[variant])}
            style={{ width: interpolatedWidth, opacity: 0.7 }}
          />
        ) : (
          <View
            className={cn('h-full rounded-full', colorClasses[variant])}
            style={{ width: `${percentage}%` }}
          />
        )}
      </View>
      {(showLabel || label) && (
        <View className='mt-1'>
          <Text className='text-xs text-gray-600 dark:text-gray-400 text-right'>
            {label || `${Math.round(percentage)}%`}
          </Text>
        </View>
      )}
    </View>
  );
};

export interface ProgressBarProps {
  /** Progress value (0-100) */
  value: number;
  /** Maximum value (default: 100) */
  max?: number;
  /** Color variant */
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'purple' | 'gray';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Show percentage label */
  showLabel?: boolean;
  /** Label position */
  labelPosition?: 'inside' | 'outside' | 'none';
  /** Custom label text */
  label?: string;
  /** Additional className */
  className?: string;
  /** Animated transition */
  animated?: boolean;
}

/**
 * ProgressBar Component
 *
 * A visual progress indicator showing completion percentage.
 *
 * @example
 * ```tsx
 * <ProgressBar value={65} variant="primary" showLabel />
 * ```
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  variant = 'primary',
  size = 'md',
  showLabel = false,
  labelPosition = 'outside',
  label,
  className,
  animated: _animated = true,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const displayLabel = label || `${Math.round(percentage)}%`;

  // Color variant configurations
  const variantClasses = {
    primary: 'bg-blue-600 dark:bg-blue-500',
    success: 'bg-green-600 dark:bg-green-500',
    warning: 'bg-yellow-600 dark:bg-yellow-500',
    danger: 'bg-red-600 dark:bg-red-500',
    purple: 'bg-purple-600 dark:bg-purple-500',
    gray: 'bg-gray-600 dark:bg-gray-500',
  };

  // Size configurations
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  return (
    <View className={cn('w-full', className)}>
      <View className='flex flex-row items-center gap-3'>
        <View
          className={cn(
            'flex-1 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden',
            sizeClasses[size]
          )}
        >
          <View
            className={cn(
              'rounded-full',
              sizeClasses[size],
              variantClasses[variant]
            )}
            style={{ width: `${percentage}%` }}
            accessibilityRole='progressbar'
            accessibilityValue={{ now: value, min: 0, max }}
          />
        </View>
        {showLabel && labelPosition === 'outside' && (
          <Text className='text-sm font-medium text-gray-600 dark:text-gray-400'>
            {displayLabel}
          </Text>
        )}
      </View>
    </View>
  );
};
