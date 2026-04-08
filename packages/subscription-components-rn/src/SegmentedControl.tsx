import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors } from '@sudobility/design';

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
  void className;

  return (
    <View
      style={[
        styles.container,
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        size === 'sm' && styles.containerSm,
        size === 'md' && styles.containerMd,
        size === 'lg' && styles.containerLg,
      ]}
      accessibilityRole="tablist"
      accessibilityLabel={accessibilityLabel}
    >
      {options.map(option => {
        const isSelected = value === option.value;
        const isDisabled = disabled || option.disabled;

        return (
          <Pressable
            key={option.value}
            onPress={() => !isDisabled && onChange(option.value)}
            disabled={isDisabled}
            accessibilityRole="tab"
            accessibilityState={{
              selected: isSelected,
              disabled: isDisabled,
            }}
            accessibilityLabel={
              option.label + (option.badge ? ', ' + option.badge : '')
            }
            style={[
              styles.segment,
              size === 'sm' && styles.segmentSm,
              size === 'md' && styles.segmentMd,
              size === 'lg' && styles.segmentLg,
              isSelected && styles.segmentSelected,
              isDisabled && styles.disabled,
            ]}
          >
            <Text
              style={[
                styles.text,
                size === 'sm' && styles.textSm,
                size === 'md' && styles.textMd,
                size === 'lg' && styles.textLg,
                isSelected ? styles.textSelected : styles.textUnselected,
              ]}
            >
              {option.label}
            </Text>

            {/* Badge */}
            {option.badge && (
              <View
                style={[
                  styles.badge,
                  size === 'sm' && styles.badgeSm,
                  size === 'md' && styles.badgeMd,
                  size === 'lg' && styles.badgeLg,
                  isSelected ? styles.badgeSelected : styles.badgeUnselected,
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    isSelected
                      ? styles.badgeTextSelected
                      : styles.badgeTextUnselected,
                  ]}
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

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.raw.neutral[100],
    borderRadius: 8,
    padding: 4,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  containerSm: {
    borderRadius: 8,
  },
  containerMd: {
    borderRadius: 8,
  },
  containerLg: {
    borderRadius: 12,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  segmentSm: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 8,
  },
  segmentMd: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 8,
  },
  segmentLg: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 8,
  },
  segmentSelected: {
    backgroundColor: colors.raw.neutral[0],
  },
  text: {
    fontWeight: '500',
  },
  textSm: {
    fontSize: 12,
  },
  textMd: {
    fontSize: 14,
  },
  textLg: {
    fontSize: 16,
  },
  textSelected: {
    color: colors.raw.neutral[900],
  },
  textUnselected: {
    color: colors.raw.neutral[600],
  },
  badge: {
    borderRadius: 999,
  },
  badgeSm: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeMd: {
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeLg: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeSelected: {
    backgroundColor: colors.raw.green[100],
  },
  badgeUnselected: {
    backgroundColor: colors.raw.neutral[200],
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  badgeTextSelected: {
    color: colors.raw.green[700],
  },
  badgeTextUnselected: {
    color: colors.raw.neutral[600],
  },
});
