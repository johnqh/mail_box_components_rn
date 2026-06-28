import * as React from 'react';
import { View, Text } from 'react-native';
import { cn } from '../../lib/utils';
import { colors } from '@sudobility/design';

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
  /** Custom color (hex) */
  color?: string;
  /** Background track color (hex) */
  trackColor?: string;
  /** Additional className */
  className?: string;
}

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
  trackColor = colors.raw.neutral[200],
  className,
}) => {
  // Clamp value between 0 and 100
  const progress = Math.min(100, Math.max(0, value));

  // TODO: theme-aware color — these arc/track colors feed RN border style
  // props (not className), so they cannot use semantic tokens. The raw palette
  // values below do not flip with light/dark theme.
  const variantColors = {
    primary: colors.raw.blue[600],
    success: colors.raw.green[600],
    warning: colors.raw.amber[600],
    danger: colors.raw.red[600],
  };

  const progressColor = color || variantColors[variant];
  const innerSize = size - strokeWidth * 2;

  return (
    <View
      className={cn('items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      {/* Background circle */}
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: trackColor,
          position: 'absolute',
        }}
      />

      {/* Progress indicator - simplified arc */}
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: 'transparent',
          borderTopColor: progressColor,
          borderRightColor: progress > 25 ? progressColor : 'transparent',
          borderBottomColor: progress > 50 ? progressColor : 'transparent',
          borderLeftColor: progress > 75 ? progressColor : 'transparent',
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
