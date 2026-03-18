import { View, Text, Pressable } from 'react-native';

export interface SegmentedControlOption<T extends string = string> {
  /** Value for this option */
  value: T;
  /** Display label */
  label: string;
  /** Optional badge text (e.g., "Save 20%") */
  badge?: string;
  /** Whether this option is disabled */
  disabled?: boolean;
}

export interface SegmentedControlProps<T extends string = string> {
  /** Available options */
  options: SegmentedControlOption<T>[];
  /** Currently selected value */
  value: T;
  /** Selection change handler */
  onChange: (value: T) => void;
  /** Additional NativeWind classes for the container */
  className?: string;
  /** Whether the control is disabled */
  disabled?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Full width mode */
  fullWidth?: boolean;
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
    text: 'text-xs',
    badge: 'text-xs px-1.5 py-0.5',
  },
  md: {
    container: 'p-1 rounded-lg',
    segment: 'px-4 py-2 rounded-md',
    text: 'text-sm',
    badge: 'text-xs px-2 py-0.5',
  },
  lg: {
    container: 'p-1 rounded-lg',
    segment: 'px-6 py-3 rounded-lg',
    text: 'text-base',
    badge: 'text-sm px-2 py-1',
  },
};

/**
 * SegmentedControl - A toggle control for switching between options
 *
 * Commonly used for billing period selection (Monthly/Yearly).
 * All labels are passed by the consumer for full localization control.
 *
 * @example
 * ```tsx
 * <SegmentedControl
 *   options={[
 *     { value: 'monthly', label: 'Monthly' },
 *     { value: 'yearly', label: 'Yearly', badge: 'Save 20%' },
 *   ]}
 *   value={billingPeriod}
 *   onChange={setBillingPeriod}
 * />
 * ```
 */
export function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  className = '',
  disabled = false,
  size = 'md',
  fullWidth = true,
  accessibilityLabel,
}: SegmentedControlProps<T>) {
  const sizes = sizeClasses[size];

  const containerClasses = [
    'flex-row bg-gray-100 dark:bg-gray-800',
    sizes.container,
    fullWidth ? 'w-full' : '',
    disabled ? 'opacity-50' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <View
      className={containerClasses}
      accessibilityRole='tablist'
      accessibilityLabel={accessibilityLabel}
    >
      {options.map(option => {
        const isSelected = value === option.value;
        const isDisabled = disabled || option.disabled;

        const segmentClasses = [
          sizes.segment,
          'flex-1 items-center justify-center flex-row gap-2',
          isSelected ? 'bg-white dark:bg-gray-700 shadow-sm' : 'bg-transparent',
          isDisabled ? 'opacity-50' : '',
        ]
          .filter(Boolean)
          .join(' ');

        const textClasses = [
          sizes.text,
          'font-medium',
          isSelected
            ? 'text-gray-900 dark:text-white'
            : 'text-gray-600 dark:text-gray-400',
        ].join(' ');

        return (
          <Pressable
            key={option.value}
            onPress={() => !isDisabled && onChange(option.value)}
            disabled={isDisabled}
            accessibilityRole='tab'
            accessibilityState={{
              selected: isSelected,
              disabled: isDisabled,
            }}
            accessibilityLabel={
              option.label + (option.badge ? ', ' + option.badge : '')
            }
            className={segmentClasses}
          >
            <Text className={textClasses}>{option.label}</Text>

            {/* Badge */}
            {option.badge && (
              <View
                className={[
                  sizes.badge,
                  'rounded-full',
                  isSelected
                    ? 'bg-green-100 dark:bg-green-900'
                    : 'bg-gray-200 dark:bg-gray-700',
                ].join(' ')}
              >
                <Text
                  className={[
                    'text-xs font-semibold',
                    isSelected
                      ? 'text-green-700 dark:text-green-300'
                      : 'text-gray-600 dark:text-gray-400',
                  ].join(' ')}
                >
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
  const options: SegmentedControlOption<'monthly' | 'yearly'>[] = [
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
      accessibilityLabel='Billing period selector'
    />
  );
}

export default SegmentedControl;
