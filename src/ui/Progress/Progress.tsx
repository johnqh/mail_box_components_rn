import * as React from 'react';
import { View, Text, Animated } from 'react-native';
import { cn } from '../../lib/utils';
import { colors, designTokens } from '@sudobility/design';

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

// Lazily derive progress colors from DS to avoid ESM issues in tests.
let _progressColors: ReturnType<typeof buildProgressColors> | null = null;
function getProgressColors() {
  if (!_progressColors) _progressColors = buildProgressColors();
  return _progressColors;
}
function buildProgressColors() {
  // Extract the leading bg-* class from DS button base strings
  function extractBg(base: string, darkStr: string) {
    const bg =
      base
        .split(' ')
        .find(
          c =>
            c.startsWith('bg-') &&
            !c.includes('hover:') &&
            !c.includes('active:')
        ) || '';
    const darkBg =
      darkStr
        .split(' ')
        .find(
          c =>
            c.startsWith('dark:bg-') &&
            !c.includes('hover:') &&
            !c.includes('active:')
        ) || '';
    return `${bg} ${darkBg}`;
  }
  const btn = colors.component.button;
  return {
    default: extractBg(btn.primary.base, btn.primary.dark),
    primary: extractBg(btn.primary.base, btn.primary.dark),
    success: extractBg(btn.success.base, btn.success.dark),
    warning: 'bg-warning dark:bg-warning', // DS has no yellow button; local fallback
    danger: extractBg(btn.destructive.base, btn.destructive.dark),
    purple: 'bg-accent dark:bg-accent', // DS has no purple button; local fallback
    gray: 'bg-muted ', // local fallback
  } as Record<string, string>;
}

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

  // Color configurations from DS
  const allColors = getProgressColors();
  const colorClasses = {
    default: allColors.default,
    success: allColors.success,
    warning: allColors.warning,
    danger: allColors.danger,
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
          'w-full bg-muted rounded-full overflow-hidden',
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
          <Text
            className={`${designTokens.typography.size.xs} text-muted-foreground text-right`}
          >
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

  // Color variant configurations from DS
  const progressColors = getProgressColors();
  const variantClasses = {
    primary: progressColors.primary,
    success: progressColors.success,
    warning: progressColors.warning,
    danger: progressColors.danger,
    purple: progressColors.purple,
    gray: progressColors.gray,
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
            'flex-1 bg-muted dark:bg-muted rounded-full overflow-hidden',
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
          <Text
            className={`${designTokens.typography.size.sm} ${designTokens.typography.weight.medium} text-muted-foreground`}
          >
            {displayLabel}
          </Text>
        )}
      </View>
    </View>
  );
};
