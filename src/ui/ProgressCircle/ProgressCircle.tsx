import * as React from 'react';
import { View, Text } from 'react-native';
import { cn } from '../../lib/utils';

export interface ProgressCircleProps {
  /** Progress value (0-100) */
  value: number;
  /** Circle size in pixels */
  size?: number;
  /** Stroke width */
  strokeWidth?: number;
  /** Show percentage text */
  showValue?: boolean;
  /** Custom label */
  label?: string;
  /** Color variant */
  variant?: 'primary' | 'success' | 'warning' | 'danger';
  /** Custom color. Overrides the variant's theme colour. */
  color?: string;
  /** Background track color. Defaults to the theme's `muted`. */
  trackColor?: string;
  /** Additional className */
  className?: string;
}

/** Top, right, bottom and left arc classes for each variant. */
const ARC_CLASSES: Record<
  NonNullable<ProgressCircleProps['variant']>,
  [string, string, string, string]
> = {
  primary: [
    'border-t-primary',
    'border-r-primary',
    'border-b-primary',
    'border-l-primary',
  ],
  success: [
    'border-t-success',
    'border-r-success',
    'border-b-success',
    'border-l-success',
  ],
  warning: [
    'border-t-warning',
    'border-r-warning',
    'border-b-warning',
    'border-l-warning',
  ],
  danger: [
    'border-t-destructive',
    'border-r-destructive',
    'border-b-destructive',
    'border-l-destructive',
  ],
};

/**
 * ProgressCircle Component
 *
 * Circular progress indicator with customizable size and colors.
 * Displays percentage or custom label in the center.
 * Uses View-based approach for React Native compatibility.
 *
 * @example
 * ```tsx
 * <ProgressCircle
 *   value={75}
 *   size={120}
 *   showValue
 *   variant="success"
 * />
 * ```
 */
export const ProgressCircle: React.FC<ProgressCircleProps> = ({
  value,
  size = 100,
  strokeWidth = 8,
  showValue = true,
  label,
  variant = 'primary',
  color,
  trackColor,
  className,
}) => {
  // Clamp value between 0 and 100
  const progress = Math.min(100, Math.max(0, value));

  /*
    The arc and track are drawn as classes, so they follow the palette the host
    applied (including one set at run time with `vars()`). A side colour beats
    the view's `borderColor` in React Native, so an unfilled side is simply
    one with no side class. Every class is written out whole for NativeWind.
    `color` and `trackColor`, when passed, are drawn as given.
  */
  const arcSides = ARC_CLASSES[variant];
  const filled = [true, progress > 25, progress > 50, progress > 75];
  const arcClass = color
    ? undefined
    : cn(
        filled[0] && arcSides[0],
        filled[1] && arcSides[1],
        filled[2] && arcSides[2],
        filled[3] && arcSides[3]
      );
  const arcStyle = color
    ? {
        borderTopColor: color,
        borderRightColor: filled[1] ? color : 'transparent',
        borderBottomColor: filled[2] ? color : 'transparent',
        borderLeftColor: filled[3] ? color : 'transparent',
      }
    : undefined;
  const innerSize = size - strokeWidth * 2;

  return (
    <View
      className={cn('items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      {/* Background circle */}
      <View
        className={trackColor ? undefined : 'border-muted'}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          ...(trackColor ? { borderColor: trackColor } : null),
          position: 'absolute',
        }}
      />

      {/* Progress indicator - simplified arc */}
      <View
        className={arcClass}
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: 'transparent',
          ...arcStyle,
          position: 'absolute',
          transform: [{ rotate: '-90deg' }],
        }}
      />

      {/* Center content */}
      <View
        style={{
          width: innerSize,
          height: innerSize,
          borderRadius: innerSize / 2,
          backgroundColor: 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {(showValue || label) && (
          <View className='items-center justify-center'>
            {showValue && !label && (
              <Text
                className='font-bold text-foreground'
                style={{ fontSize: size * 0.2 }}
              >
                {Math.round(progress)}%
              </Text>
            )}
            {label && (
              <Text
                className='font-medium text-foreground text-center px-2'
                style={{ fontSize: size * 0.15 }}
              >
                {label}
              </Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
};
