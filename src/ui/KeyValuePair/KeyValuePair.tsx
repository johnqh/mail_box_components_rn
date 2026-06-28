import * as React from 'react';
import { View, Text } from 'react-native';
import { cn } from '../../lib/utils';
import { designTokens } from '@sudobility/design';

const { typography } = designTokens;

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
    sm: { label: typography.size.sm, value: typography.size.sm, gap: 'gap-1' },
    md: {
      label: typography.size.base,
      value: typography.size.base,
      gap: 'gap-2',
    },
    lg: { label: typography.size.lg, value: typography.size.lg, gap: 'gap-3' },
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
    default: 'text-muted-foreground',
    muted: 'text-muted-foreground',
    strong: `text-foreground ${typography.weight.semibold}`,
  };

  const valueVariantClasses = {
    default: 'text-foreground',
    muted: 'text-muted-foreground',
    strong: `text-foreground ${typography.weight.semibold}`,
    primary: 'text-primary',
  };

  const sizeConfig = sizeClasses[size];

  return (
    <View
      className={cn(
        orientation === 'horizontal' ? 'flex-row items-center' : 'flex-col',
        orientation === 'horizontal' && alignClasses[align],
        sizeConfig.gap,
        separator && 'pb-3 mb-3 border-b border-border',
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
