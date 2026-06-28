import * as React from 'react';
import { View, Text } from 'react-native';
import { cn } from '../../lib/utils';
import { colors, designTokens } from '@sudobility/design';

export interface StatDisplayProps {
  /** The main value/number to display */
  value: string | number;
  /** Label/description for the stat */
  label: string;
  /** Color variant */
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'neutral' | 'white';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Text alignment */
  align?: 'left' | 'center' | 'right';
  /** Icon element */
  icon?: React.ReactNode;
  /** Icon position */
  iconPosition?: 'top' | 'left';
  /** Additional className */
  className?: string;
}

/**
 * StatDisplay Component
 *
 * Displays a statistic or metric with a value and label.
 * Commonly used in dashboards, hero sections, and analytics.
 *
 * @example
 * ```tsx
 * <StatDisplay value="5K" label="Gas Overhead" variant="primary" />
 * <StatDisplay value="42" label="Active Users" variant="success" size="lg" />
 * ```
 */

// Lazily derive stat display colors from DS to avoid ESM issues in tests.
let _statColors: ReturnType<typeof buildStatColors> | null = null;
function getStatColors() {
  if (!_statColors) _statColors = buildStatColors();
  return _statColors;
}
function buildStatColors() {
  const alert = colors.component.alert;
  // Extract text-* classes from DS alert icon strings
  return {
    primary: {
      value: `${alert.info.icon}`,
      label: 'text-primary/70 dark:text-primary/70',
    },
    success: {
      value: `${alert.success.icon}`,
      label: 'text-success/70 /70',
    },
    warning: {
      value: `${alert.warning.icon}`,
      label: 'text-warning/70 /70',
    },
    danger: {
      value: `${alert.error.icon}`,
      label: 'text-destructive/70 ',
    },
    neutral: {
      value: 'text-foreground',
      label: 'text-muted-foreground',
    },
    white: {
      value: 'text-white',
      label: 'text-white/70',
    },
  } as Record<string, { value: string; label: string }>;
}

export const StatDisplay: React.FC<StatDisplayProps> = ({
  value,
  label,
  variant = 'neutral',
  size = 'md',
  align = 'center',
  icon,
  iconPosition = 'top',
  className,
}) => {
  const variantClasses = getStatColors();

  const sizeClasses = {
    sm: {
      value: designTokens.typography.size.xl,
      label: designTokens.typography.size.xs,
    },
    md: {
      value: designTokens.typography.size['2xl'],
      label: designTokens.typography.size.sm,
    },
    lg: {
      value: designTokens.typography.size['3xl'],
      label: designTokens.typography.size.base,
    },
    xl: {
      value: designTokens.typography.size['4xl'],
      label: designTokens.typography.size.lg,
    },
  };

  const alignClasses = {
    left: 'items-start',
    center: 'items-center',
    right: 'items-end',
  };

  const variantConfig = variantClasses[variant];
  const sizeConfig = sizeClasses[size];

  if (iconPosition === 'left' && icon) {
    return (
      <View
        className={cn(
          'flex-row items-center gap-3',
          align === 'center' && 'justify-center',
          className
        )}
      >
        <View className={variantConfig.value}>{icon}</View>
        <View>
          <Text
            className={cn(
              designTokens.typography.weight.bold,
              sizeConfig.value,
              variantConfig.value
            )}
          >
            {value}
          </Text>
          <Text className={cn(sizeConfig.label, variantConfig.label)}>
            {label}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className={cn(alignClasses[align], className)}>
      {icon && iconPosition === 'top' && (
        <View className={cn('mb-2', variantConfig.value)}>{icon}</View>
      )}
      <Text
        className={cn(
          designTokens.typography.weight.bold,
          sizeConfig.value,
          variantConfig.value
        )}
      >
        {value}
      </Text>
      <Text className={cn(sizeConfig.label, variantConfig.label)}>{label}</Text>
    </View>
  );
};
