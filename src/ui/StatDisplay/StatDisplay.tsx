import * as React from 'react';
import { View, Text } from 'react-native';
import { cn } from '../../lib/utils';

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
  const variantClasses = {
    primary: {
      value: 'text-blue-600 dark:text-blue-400',
      label: 'text-blue-600/70 dark:text-blue-400/70',
    },
    success: {
      value: 'text-green-600 dark:text-green-400',
      label: 'text-green-600/70 dark:text-green-400/70',
    },
    warning: {
      value: 'text-yellow-600 dark:text-yellow-400',
      label: 'text-yellow-600/70 dark:text-yellow-400/70',
    },
    danger: {
      value: 'text-red-600 dark:text-red-400',
      label: 'text-red-600/70 dark:text-red-400/70',
    },
    neutral: {
      value: 'text-gray-900 dark:text-gray-100',
      label: 'text-gray-600 dark:text-gray-400',
    },
    white: {
      value: 'text-white',
      label: 'text-white/70',
    },
  };

  const sizeClasses = {
    sm: { value: 'text-xl', label: 'text-xs' },
    md: { value: 'text-2xl', label: 'text-sm' },
    lg: { value: 'text-3xl', label: 'text-base' },
    xl: { value: 'text-4xl', label: 'text-lg' },
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
            className={cn('font-bold', sizeConfig.value, variantConfig.value)}
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
      <Text className={cn('font-bold', sizeConfig.value, variantConfig.value)}>
        {value}
      </Text>
      <Text className={cn(sizeConfig.label, variantConfig.label)}>{label}</Text>
    </View>
  );
};
