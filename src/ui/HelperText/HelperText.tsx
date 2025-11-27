import * as React from 'react';
import { View, Text, TextProps } from 'react-native';
import { cn } from '../../lib/utils';

export interface HelperTextProps extends TextProps {
  /** Helper text content */
  children: React.ReactNode;
  /** Variant (affects color and icon) */
  variant?: 'default' | 'error' | 'success' | 'warning';
  /** Show icon indicator */
  showIcon?: boolean;
  /** Size */
  size?: 'sm' | 'base';
  /** Additional className */
  className?: string;
}

/**
 * HelperText Component
 *
 * Text component for form field descriptions, error messages, and hints.
 * Supports different variants with optional icon indicators.
 *
 * @example
 * ```tsx
 * <HelperText>
 *   Enter your email address
 * </HelperText>
 * ```
 *
 * @example
 * ```tsx
 * <HelperText variant="error" showIcon>
 *   This field is required
 * </HelperText>
 * ```
 */
export const HelperText: React.FC<HelperTextProps> = ({
  children,
  variant = 'default',
  showIcon = false,
  size = 'sm',
  className,
  ...textProps
}) => {
  // Size configurations
  const sizeClasses = {
    sm: 'text-sm',
    base: 'text-base',
  };

  const iconSize = {
    sm: 'w-4 h-4',
    base: 'w-5 h-5',
  };

  // Variant configurations
  const variantConfig = {
    default: {
      text: 'text-gray-600 dark:text-gray-400',
      icon: 'ℹ',
    },
    error: {
      text: 'text-red-600 dark:text-red-400',
      icon: '⚠',
    },
    success: {
      text: 'text-green-600 dark:text-green-400',
      icon: '✓',
    },
    warning: {
      text: 'text-yellow-600 dark:text-yellow-400',
      icon: '⚠',
    },
  };

  const config = variantConfig[variant];

  return (
    <View className={cn('flex flex-row items-start gap-1.5', className)}>
      {showIcon && (
        <Text className={cn(iconSize[size], config.text, 'mt-0.5')}>
          {config.icon}
        </Text>
      )}
      <Text className={cn(sizeClasses[size], config.text)} {...textProps}>
        {children}
      </Text>
    </View>
  );
};
