import * as React from 'react';
import { View, Text, TextProps } from 'react-native';
import { cn } from '../../lib/utils';
import { colors, designTokens } from '@sudobility/design';

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
  // Size configurations using design tokens
  const sizeClasses = {
    sm: designTokens.typography.size.sm,
    base: designTokens.typography.size.base,
  };

  const iconSize = {
    sm: 'w-4 h-4',
    base: 'w-5 h-5',
  };

  // Variant configurations using DS alert icon colors and semantic text
  const variantConfig = {
    default: {
      text: colors.component.alert.info.icon,
      icon: 'ℹ',
    },
    error: {
      text: colors.component.alert.error.icon,
      icon: '⚠',
    },
    success: {
      text: colors.component.alert.success.icon,
      icon: '✓',
    },
    warning: {
      text: colors.component.alert.warning.icon,
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
