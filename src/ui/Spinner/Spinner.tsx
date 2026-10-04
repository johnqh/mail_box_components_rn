import React from 'react';
import { View, ActivityIndicator, Text, type ViewProps } from 'react-native';
import { cn } from '../../lib/utils';
import { textVariants } from '@sudobility/design';

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

/**
 * Each variant's colour, as a class. NativeWind maps a class's text colour
 * onto `ActivityIndicator`'s `color`, so the spinner follows whatever palette
 * the host applied — including one it sets at run time — with no hook.
 * `white` is for a spinner on a primary surface, so it is that surface's
 * foreground.
 */
const colorClassMap: Record<NonNullable<SpinnerProps['variant']>, string> = {
  default: 'text-primary',
  white: 'text-primary-foreground',
  success: 'text-success',
  warning: 'text-warning',
  error: 'text-destructive',
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

  return (
    <View
      className={cn('items-center justify-center', className)}
      accessibilityRole='progressbar'
      accessibilityLabel={accessibilityLabel}
      {...props}
    >
      <ActivityIndicator
        size={activitySize}
        className={colorClassMap[variant]}
      />
      {showText && (
        <Text className={cn(textVariants.body.sm(), 'mt-2')}>
          {loadingText}
        </Text>
      )}
    </View>
  );
};
