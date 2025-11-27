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
  trackColor = '#e5e7eb',
  className,
}) => {
  // Clamp value between 0 and 100
  const progress = Math.min(100, Math.max(0, value));

  // Color variants
  const variantColors = {
    primary: '#2563eb',
    success: '#16a34a',
    warning: '#ca8a04',
    danger: '#dc2626',
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
                className='font-bold text-gray-900 dark:text-white'
                style={{ fontSize: size * 0.2 }}
              >
                {Math.round(progress)}%
              </Text>
            )}
            {label && (
              <Text
                className='font-medium text-gray-900 dark:text-white text-center px-2'
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
