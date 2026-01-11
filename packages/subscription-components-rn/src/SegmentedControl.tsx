import React from 'react';
import { View, Text, Pressable } from 'react-native';

/**
 * Segment option configuration
 */
export interface SegmentOption<T extends string = string> {
  /** Unique value for this segment */
  value: T;
  /** Display label */
  label: string;
  /** Optional badge text (e.g., "Save 20%") */
  badge?: string;
  /** Whether this option is disabled */
  disabled?: boolean;
}

/**
 * Props for SegmentedControl component
 */
export interface SegmentedControlProps<T extends string = string> {
  /** Available segment options */
  options: SegmentOption<T>[];
  /** Currently selected value */
  value: T;
  /** Called when selection changes */
  onChange: (value: T) => void;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Full width mode */
  fullWidth?: boolean;
  /** Custom container class */
  className?: string;
  /** Disabled state for entire control */
  disabled?: boolean;
  /** Accessibility label */
  accessibilityLabel?: string;
}

/**
 * Size class mapping
 */
const sizeClasses = {
  sm: {
    container: 'p-1 rounded-lg',
    segment: 'px-3 py-1.5 rounded-md',
    text: 'text-sm',
    badge: 'text-xs px-1.5 py-0.5',
  },
  md: {
    container: 'p-1.5 rounded-xl',
    segment: 'px-4 py-2 rounded-lg',
    text: 'text-base',
    badge: 'text-xs px-2 py-0.5',
  },
  lg: {
    container: 'p-2 rounded-2xl',
    segment: 'px-6 py-3 rounded-xl',
    text: 'text-lg',
    badge: 'text-sm px-2 py-1',
  },
};

/**
 * Segmented control for period selection (Monthly/Yearly toggle)
 * Provides accessible toggle between subscription periods
 */
export function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  size = 'md',
  fullWidth = true,
  className = '',
  disabled = false,
  accessibilityLabel = 'Subscription period selector',
}: SegmentedControlProps<T>) {
  const sizes = sizeClasses[size];

  const containerClasses = [
    'flex-row bg-neutral-100 dark:bg-neutral-800',
    sizes.container,
    fullWidth ? 'w-full' : '',
    disabled ? 'opacity-50' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <View
      className={containerClasses}
      accessibilityRole="tablist"
      accessibilityLabel={accessibilityLabel}
    >
      {options.map((option) => {
        const isSelected = value === option.value;
        const isDisabled = disabled || option.disabled;

        const segmentClasses = [
          sizes.segment,
          'flex-1 items-center justify-center flex-row gap-2',
          isSelected
            ? 'bg-white dark:bg-neutral-700 shadow-sm'
            : 'bg-transparent',
          isDisabled ? 'opacity-50' : '',
        ].filter(Boolean).join(' ');

        const textClasses = [
          sizes.text,
          'font-semibold',
          isSelected
            ? 'text-neutral-900 dark:text-neutral-100'
            : 'text-neutral-500 dark:text-neutral-400',
        ].join(' ');

        return (
          <Pressable
            key={option.value}
            onPress={() => !isDisabled && onChange(option.value)}
            disabled={isDisabled}
            accessibilityRole="tab"
            accessibilityState={{ selected: isSelected, disabled: isDisabled }}
            accessibilityLabel={option.label + (option.badge ? ', ' + option.badge : '')}
            className={segmentClasses}
          >
            <Text className={textClasses}>
              {option.label}
            </Text>

            {/* Badge */}
            {option.badge && (
              <View className={[
                sizes.badge,
                'rounded-full',
                isSelected
                  ? 'bg-green-100 dark:bg-green-900'
                  : 'bg-neutral-200 dark:bg-neutral-700',
              ].join(' ')}>
                <Text className={[
                  'font-semibold',
                  isSelected
                    ? 'text-green-700 dark:text-green-300'
                    : 'text-neutral-600 dark:text-neutral-400',
                  size === 'sm' ? 'text-xs' : 'text-xs',
                ].join(' ')}>
                  {option.badge}
                </Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

/**
 * Pre-configured period selector for Monthly/Yearly toggle
 */
export interface PeriodSelectorProps {
  /** Current period */
  period: 'monthly' | 'yearly';
  /** Called when period changes */
  onPeriodChange: (period: 'monthly' | 'yearly') => void;
  /** Monthly label */
  monthlyLabel?: string;
  /** Yearly label */
  yearlyLabel?: string;
  /** Yearly savings badge */
  yearlySavings?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Custom class */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
}

export function PeriodSelector({
  period,
  onPeriodChange,
  monthlyLabel = 'Monthly',
  yearlyLabel = 'Yearly',
  yearlySavings,
  size = 'md',
  className = '',
  disabled = false,
}: PeriodSelectorProps) {
  const options: SegmentOption<'monthly' | 'yearly'>[] = [
    { value: 'monthly', label: monthlyLabel },
    { value: 'yearly', label: yearlyLabel, badge: yearlySavings },
  ];

  return (
    <SegmentedControl
      options={options}
      value={period}
      onChange={onPeriodChange}
      size={size}
      className={className}
      disabled={disabled}
      accessibilityLabel="Billing period selector"
    />
  );
}

export default SegmentedControl;
