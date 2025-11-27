import React from 'react';
import { View, ActivityIndicator, Text, type ViewProps } from 'react-native';
import { cn } from '../../lib/utils';

export interface SpinnerProps extends ViewProps {
  size?: 'small' | 'default' | 'large' | 'extraLarge';
  variant?: 'default' | 'white' | 'success' | 'warning' | 'error';
  accessibilityLabel?: string;
  loadingText?: string;
  showText?: boolean;
}

const sizeMap = {
  small: 'small' as const,
  default: 'small' as const,
  large: 'large' as const,
  extraLarge: 'large' as const,
};

const colorMap = {
  default: '#2563eb', // blue-600
  white: '#ffffff',
  success: '#16a34a', // green-600
  warning: '#ea580c', // orange-600
  error: '#dc2626', // red-600
};

/**
 * Spinner component for React Native
 *
 * @example
 * ```tsx
 * <Spinner size="large" variant="default" />
 * ```
 */
export const Spinner: React.FC<SpinnerProps> = ({
  size = 'default',
  variant = 'default',
  className,
  accessibilityLabel = 'Loading',
  loadingText = 'Loading...',
  showText = false,
  ...props
}) => {
  const activitySize = sizeMap[size];
  const color = colorMap[variant];

  return (
    <View
      className={cn('items-center justify-center', className)}
      accessibilityRole='progressbar'
      accessibilityLabel={accessibilityLabel}
      {...props}
    >
      <ActivityIndicator size={activitySize} color={color} />
      {showText && (
        <Text className='mt-2 text-gray-600 dark:text-gray-400 text-sm'>
          {loadingText}
        </Text>
      )}
    </View>
  );
};
