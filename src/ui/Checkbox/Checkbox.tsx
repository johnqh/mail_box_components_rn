import * as React from 'react';
import { useState } from 'react';
import { View, Text, Pressable, PressableProps } from 'react-native';
import { cn } from '../../lib/utils';
import { themeCached } from '../../lib/theme-cache';
import { colors, designTokens } from '@sudobility/design';
import { pressProps } from '../../lib/a11y';

export interface CheckboxProps extends Omit<PressableProps, 'onPress'> {
  /** Whether the checkbox is checked (controlled mode) */
  checked?: boolean;
  /** Default checked state (uncontrolled mode) */
  defaultChecked?: boolean;
  /** Change handler */
  onChange?: (checked: boolean) => void;
  /** Label text */
  label?: string;
  /** Description text below label */
  description?: string;
  /** Whether the checkbox is disabled */
  disabled?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Color variant */
  variant?: 'primary' | 'success' | 'warning' | 'error';
  /** Additional className for the container */
  className?: string;
  /** Whether the checkbox is required */
  required?: boolean;
  /** Indeterminate state */
  indeterminate?: boolean;
  /** Error state */
  error?: boolean;
  /** Error message to display */
  errorMessage?: string;
}

/**
 * Checkbox Component
 *
 * Custom styled checkbox with proper accessibility and visual feedback.
 * Supports both controlled and uncontrolled modes.
 *
 * @example
 * ```tsx
 * // Controlled
 * <Checkbox
 *   checked={isEnabled}
 *   onChange={setIsEnabled}
 *   label="Enable notifications"
 * />
 *
 * // Uncontrolled
 * <Checkbox
 *   defaultChecked={true}
 *   label="Remember me"
 * />
 * ```
 */

// Lazily derive checkbox colors from DS to avoid ESM issues in tests.
// Rebuilt when the theme changes; see lib/theme-cache.
const getCheckboxColors = themeCached(buildCheckboxColors);
function buildCheckboxColors() {
  // Extract solid bg colors from DS button variants for checked states
  // DS button.primary.base contains "bg-primary ... text-white"
  // We only need the bg-* and border-* portions for checkbox checked state
  function extractCheckedColor(base: string) {
    const parts = base.split(' ');
    const bg =
      parts.find(
        c =>
          c.startsWith('bg-') && !c.includes('hover:') && !c.includes('active:')
      ) || '';
    // For checkbox, border matches bg color
    return `${bg} ${bg.replace('bg-', 'border-')}`;
  }
  const btn = colors.component.button;
  return {
    primary: extractCheckedColor(btn.primary.base),
    success: extractCheckedColor(btn.success.base),
    warning: 'bg-warning border-warning', // DS has no yellow button; local fallback
    error: extractCheckedColor(btn.destructive.base),
  } as Record<string, string>;
}

/** The checked mark's colour, as the foreground of each variant's fill. */
const MARK_CLASSES: Record<
  'primary' | 'success' | 'warning' | 'error',
  string
> = {
  primary: 'bg-primary-foreground',
  success: 'bg-success-foreground',
  warning: 'bg-warning-foreground',
  error: 'bg-destructive-foreground',
};

export const Checkbox: React.FC<CheckboxProps> = ({
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
  variant = 'primary',
  className,
  required = false,
  indeterminate = false,
  error = false,
  errorMessage,
  ...pressableProps
}) => {
  // Support both controlled and uncontrolled modes
  const [uncontrolledChecked, setUncontrolledChecked] =
    useState(defaultChecked);
  const isControlled = controlledChecked !== undefined;
  const checked = isControlled ? controlledChecked : uncontrolledChecked;

  const sizeClasses = {
    sm: {
      box: 'w-4 h-4',
      check: 'w-2 h-2',
      text: designTokens.typography.size.sm,
      desc: designTokens.typography.size.xs,
    },
    md: {
      box: 'w-5 h-5',
      check: 'w-3 h-3',
      text: designTokens.typography.size.base,
      desc: designTokens.typography.size.sm,
    },
    lg: {
      box: 'w-6 h-6',
      check: 'w-4 h-4',
      text: designTokens.typography.size.lg,
      desc: designTokens.typography.size.base,
    },
  };

  const getVariantClasses = () => {
    const checkedColors = getCheckboxColors();
    if (error) {
      return checked
        ? checkedColors.error
        : 'border-destructive dark:border-destructive';
    }

    const unchecked = 'border-border';
    const variantClasses = {
      primary: checked ? checkedColors.primary : unchecked,
      success: checked ? checkedColors.success : unchecked,
      warning: checked ? checkedColors.warning : unchecked,
      error: checked ? checkedColors.error : unchecked,
    };

    return variantClasses[variant];
  };

  const handlePress = () => {
    if (disabled) return;

    const newChecked = !checked;

    if (!isControlled) {
      setUncontrolledChecked(newChecked);
    }

    onChange?.(newChecked);
  };

  const config = sizeClasses[size];

  /*
    The mark is drawn in the fill's own foreground — a success box takes
    `success-foreground`, not the primary's — and the box is only
    `bg-background` while unchecked, so the fill never depends on which of two
    `bg-*` classes a merge keeps.
  */
  const markClass = error ? 'bg-destructive-foreground' : MARK_CLASSES[variant];
  // An indeterminate box that is not filled draws its dash on the background.

  return (
    <View className={cn('flex flex-col', className)}>
      <Pressable
        {...pressProps(handlePress, disabled)}
        disabled={disabled}
        className={cn(
          'flex flex-row items-start gap-2',
          disabled && 'opacity-50'
        )}
        accessibilityRole='checkbox'
        accessibilityState={{
          checked: indeterminate ? 'mixed' : checked,
          disabled,
        }}
        accessibilityLabel={label}
        {...pressableProps}
      >
        <View className='relative flex items-center justify-center'>
          <View
            className={cn(
              'rounded border-2 flex items-center justify-center',
              !checked && 'bg-background',
              config.box,
              getVariantClasses()
            )}
          >
            {indeterminate ? (
              <View
                className={cn(
                  checked ? markClass : 'bg-foreground',
                  'rounded-sm',
                  config.check,
                  'h-0.5'
                )}
              />
            ) : checked ? (
              <View className={cn(markClass, 'rounded-sm', config.check)} />
            ) : null}
          </View>
        </View>
        {(label || description) && (
          <View className='flex flex-col flex-1'>
            {label && (
              <Text className={cn('text-foreground', config.text)}>
                {label}
                {required && <Text className='text-destructive ml-1'>*</Text>}
              </Text>
            )}
            {description && (
              <Text className={cn('text-muted-foreground', config.desc)}>
                {description}
              </Text>
            )}
          </View>
        )}
      </Pressable>
      {errorMessage && (
        <Text
          className={`mt-1 ${designTokens.typography.size.sm} text-destructive`}
        >
          {errorMessage}
        </Text>
      )}
    </View>
  );
};
