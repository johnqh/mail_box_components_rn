import React from 'react';
import { View, ActivityIndicator, Text, type ViewProps } from 'react-native';
import { cn } from '../../lib/utils';
import { colors, textVariants } from '@sudobility/design';

/**
 * Props for the Spinner loading indicator component.
 */
export interface SpinnerProps extends ViewProps {
  /** Size of the activity indicator. */
  size?: 'small' | 'default' | 'large' | 'extraLarge';
  /** Color variant for the spinner. */
  variant?: 'default' | 'white' | 'success' | 'warning' | 'error';
  /** Accessibility label for screen readers. */
  accessibilityLabel?: string;
  /** Text shown below the spinner when showText is true. */
  loadingText?: string;
  /** Whether to display loading text below the spinner. */
  showText?: boolean;
}

const sizeMap = {
  small: 'small' as const,
  default: 'small' as const,
  large: 'large' as const,
  extraLarge: 'large' as const,
};

// Spinner colors from design system raw palette
const colorMap = {
  default: colors.raw.blue[600],
  white: '#ffffff',
  success: colors.raw.green[600],
  warning: colors.raw.orange[600],
  error: colors.raw.red[600],
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
        <Text className={cn(textVariants.body.sm(), 'mt-2')}>
          {loadingText}
        </Text>
      )}
    </View>
  );
};
