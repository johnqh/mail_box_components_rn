import * as React from 'react';
import { View, Text } from 'react-native';
import { cn } from '../../lib/utils';

export interface KeyValuePairProps {
  /** Label/key text */
  label: string;
  /** Value content */
  value: React.ReactNode;
  /** Layout orientation */
  orientation?: 'horizontal' | 'vertical';
  /** Alignment for horizontal layout */
  align?: 'start' | 'center' | 'between';
  /** Label width (for horizontal layout) */
  labelWidth?: 'auto' | 'sm' | 'md' | 'lg';
  /** Text size */
  size?: 'sm' | 'md' | 'lg';
  /** Show separator */
  separator?: boolean;
  /** Label color variant */
  labelVariant?: 'default' | 'muted' | 'strong';
  /** Value color variant */
  valueVariant?: 'default' | 'muted' | 'strong' | 'primary';
  /** Additional className */
  className?: string;
}

/**
 * KeyValuePair Component
 *
 * Displays a label-value pair with flexible layout options.
 * Commonly used in forms, details pages, and data displays.
 *
 * @example
 * ```tsx
 * <KeyValuePair label="Email" value="user@example.com" />
 * <KeyValuePair
 *   label="Status"
 *   value="Active"
 *   orientation="horizontal"
 *   align="between"
 * />
 * ```
 */
export const KeyValuePair: React.FC<KeyValuePairProps> = ({
  label,
  value,
  orientation = 'vertical',
  align = 'start',
  labelWidth = 'auto',
  size = 'md',
  separator = false,
  labelVariant = 'muted',
  valueVariant = 'default',
  className,
}) => {
  const sizeClasses = {
    sm: { label: 'text-sm', value: 'text-sm', gap: 'gap-1' },
    md: { label: 'text-base', value: 'text-base', gap: 'gap-2' },
    lg: { label: 'text-lg', value: 'text-lg', gap: 'gap-3' },
  };

  const labelWidthStyles = {
    auto: undefined,
    sm: 96,
    md: 128,
    lg: 160,
  };

  const alignClasses = {
    start: 'justify-start',
    center: 'justify-center',
    between: 'justify-between',
  };

  const labelVariantClasses = {
    default: 'text-gray-700 dark:text-gray-300',
    muted: 'text-gray-600 dark:text-gray-400',
    strong: 'text-gray-900 dark:text-gray-100 font-semibold',
  };

  const valueVariantClasses = {
    default: 'text-gray-900 dark:text-gray-100',
    muted: 'text-gray-600 dark:text-gray-400',
    strong: 'text-gray-900 dark:text-gray-100 font-semibold',
    primary: 'text-blue-600 dark:text-blue-400',
  };

  const sizeConfig = sizeClasses[size];

  return (
    <View
      className={cn(
        orientation === 'horizontal' ? 'flex-row items-center' : 'flex-col',
        orientation === 'horizontal' && alignClasses[align],
        sizeConfig.gap,
        separator && 'pb-3 mb-3 border-b border-gray-200 dark:border-gray-700',
        className
      )}
    >
      <Text
        className={cn(sizeConfig.label, labelVariantClasses[labelVariant])}
        style={
          orientation === 'horizontal' && labelWidth !== 'auto'
            ? { width: labelWidthStyles[labelWidth] }
            : undefined
        }
      >
        {label}
      </Text>
      {typeof value === 'string' || typeof value === 'number' ? (
        <Text
          className={cn(
            sizeConfig.value,
            valueVariantClasses[valueVariant],
            orientation === 'horizontal' && 'flex-1'
          )}
        >
          {value}
        </Text>
      ) : (
        <View className={cn(orientation === 'horizontal' && 'flex-1')}>
          {value}
        </View>
      )}
    </View>
  );
};
