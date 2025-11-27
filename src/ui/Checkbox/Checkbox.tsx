import * as React from 'react';
import { useState } from 'react';
import { View, Text, Pressable, PressableProps } from 'react-native';
import { cn } from '../../lib/utils';

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
      text: 'text-sm',
      desc: 'text-xs',
    },
    md: {
      box: 'w-5 h-5',
      check: 'w-3 h-3',
      text: 'text-base',
      desc: 'text-sm',
    },
    lg: {
      box: 'w-6 h-6',
      check: 'w-4 h-4',
      text: 'text-lg',
      desc: 'text-base',
    },
  };

  const getVariantClasses = () => {
    if (error) {
      return checked
        ? 'bg-red-600 border-red-600'
        : 'border-red-600 dark:border-red-500';
    }

    const variantClasses = {
      primary: checked
        ? 'bg-blue-600 border-blue-600'
        : 'border-gray-300 dark:border-gray-600',
      success: checked
        ? 'bg-green-600 border-green-600'
        : 'border-gray-300 dark:border-gray-600',
      warning: checked
        ? 'bg-yellow-600 border-yellow-600'
        : 'border-gray-300 dark:border-gray-600',
      error: checked
        ? 'bg-red-600 border-red-600'
        : 'border-gray-300 dark:border-gray-600',
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

  return (
    <View className={cn('flex flex-col', className)}>
      <Pressable
        onPress={handlePress}
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
              'rounded border-2 flex items-center justify-center bg-white dark:bg-gray-900',
              config.box,
              getVariantClasses()
            )}
          >
            {indeterminate ? (
              <View
                className={cn('bg-white rounded-sm', config.check, 'h-0.5')}
              />
            ) : checked ? (
              <View className={cn('bg-white rounded-sm', config.check)} />
            ) : null}
          </View>
        </View>
        {(label || description) && (
          <View className='flex flex-col flex-1'>
            {label && (
              <Text
                className={cn('text-gray-900 dark:text-white', config.text)}
              >
                {label}
                {required && <Text className='text-red-500 ml-1'>*</Text>}
              </Text>
            )}
            {description && (
              <Text
                className={cn('text-gray-600 dark:text-gray-400', config.desc)}
              >
                {description}
              </Text>
            )}
          </View>
        )}
      </Pressable>
      {errorMessage && (
        <Text className='mt-1 text-sm text-red-600 dark:text-red-400'>
          {errorMessage}
        </Text>
      )}
    </View>
  );
};
