import * as React from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { cn } from '../../lib/utils';

export interface NumberInputProps {
  /** Current value */
  value: number;
  /** Callback when value changes */
  onChange: (value: number) => void;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step increment */
  step?: number;
  /** Disabled state */
  disabled?: boolean;
  /** Show stepper buttons */
  showSteppers?: boolean;
  /** Stepper button position */
  stepperPosition?: 'right' | 'sides';
  /** Placeholder text */
  placeholder?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional className */
  className?: string;
}

/**
 * NumberInput Component
 *
 * Number input field with optional stepper buttons for increment/decrement.
 * Supports min/max bounds, step values, and different layouts.
 *
 * @example
 * ```tsx
 * <NumberInput
 *   value={quantity}
 *   onChange={setQuantity}
 *   min={1}
 *   max={100}
 *   showSteppers
 * />
 * ```
 *
 * @example
 * ```tsx
 * <NumberInput
 *   value={price}
 *   onChange={setPrice}
 *   step={0.01}
 *   min={0}
 *   showSteppers
 *   stepperPosition="sides"
 * />
 * ```
 */
export const NumberInput: React.FC<NumberInputProps> = ({
  value,
  onChange,
  min,
  max,
  step = 1,
  disabled = false,
  showSteppers = false,
  stepperPosition = 'right',
  placeholder,
  size = 'md',
  className,
}) => {
  // Size configurations
  const sizeClasses = {
    sm: {
      input: 'py-1.5 px-3 text-sm',
      button: 'w-8 h-8',
      icon: 'text-sm',
    },
    md: {
      input: 'py-2 px-3 text-base',
      button: 'w-10 h-10',
      icon: 'text-base',
    },
    lg: {
      input: 'py-3 px-4 text-lg',
      button: 'w-12 h-12',
      icon: 'text-lg',
    },
  };

  const sizeConfig = sizeClasses[size];

  const clampValue = (val: number): number => {
    let clamped = val;
    if (min !== undefined && clamped < min) clamped = min;
    if (max !== undefined && clamped > max) clamped = max;
    return clamped;
  };

  const handleTextChange = (text: string) => {
    const newValue = parseFloat(text);
    if (!isNaN(newValue)) {
      const clampedValue = clampValue(newValue);
      onChange(clampedValue);
    } else if (text === '') {
      onChange(min ?? 0);
    }
  };

  const increment = () => {
    if (disabled) return;
    const newValue = clampValue(value + step);
    onChange(newValue);
  };

  const decrement = () => {
    if (disabled) return;
    const newValue = clampValue(value - step);
    onChange(newValue);
  };

  const canIncrement = max === undefined || value < max;
  const canDecrement = min === undefined || value > min;

  const StepperButton = ({
    onPress,
    icon,
    buttonDisabled,
    ariaLabel,
  }: {
    onPress: () => void;
    icon: string;
    buttonDisabled: boolean;
    ariaLabel: string;
  }) => (
    <Pressable
      onPress={onPress}
      disabled={disabled || buttonDisabled}
      accessibilityRole='button'
      accessibilityLabel={ariaLabel}
      className={cn(
        'items-center justify-center',
        'border border-gray-300 dark:border-gray-600',
        'bg-white dark:bg-gray-800',
        sizeConfig.button,
        (disabled || buttonDisabled) && 'opacity-50'
      )}
    >
      <Text className={cn('text-gray-700 dark:text-gray-300', sizeConfig.icon)}>
        {icon}
      </Text>
    </Pressable>
  );

  // Sides layout: - [input] +
  if (showSteppers && stepperPosition === 'sides') {
    return (
      <View className={cn('flex flex-row items-stretch', className)}>
        <StepperButton
          onPress={decrement}
          buttonDisabled={!canDecrement}
          icon='−'
          ariaLabel='Decrement'
        />
        <TextInput
          value={String(value)}
          onChangeText={handleTextChange}
          keyboardType='numeric'
          editable={!disabled}
          placeholder={placeholder}
          className={cn(
            'border-x-0 text-center flex-1',
            'border-y border-gray-300 dark:border-gray-600',
            'bg-white dark:bg-gray-800',
            'text-gray-900 dark:text-gray-100',
            sizeConfig.input,
            disabled && 'opacity-50'
          )}
          accessibilityLabel='Number input'
        />
        <StepperButton
          onPress={increment}
          buttonDisabled={!canIncrement}
          icon='+'
          ariaLabel='Increment'
        />
      </View>
    );
  }

  // Right layout: [input] [+/-]
  if (showSteppers && stepperPosition === 'right') {
    return (
      <View className={cn('flex flex-row items-stretch gap-2', className)}>
        <TextInput
          value={String(value)}
          onChangeText={handleTextChange}
          keyboardType='numeric'
          editable={!disabled}
          placeholder={placeholder}
          className={cn(
            'flex-1 rounded-lg border',
            'border-gray-300 dark:border-gray-600',
            'bg-white dark:bg-gray-800',
            'text-gray-900 dark:text-gray-100',
            sizeConfig.input,
            disabled && 'opacity-50'
          )}
          accessibilityLabel='Number input'
        />
        <View className='flex flex-col gap-0.5'>
          <Pressable
            onPress={increment}
            disabled={disabled || !canIncrement}
            accessibilityRole='button'
            accessibilityLabel='Increment'
            className={cn(
              'flex-1 items-center justify-center',
              'rounded border border-gray-300 dark:border-gray-600',
              'bg-white dark:bg-gray-800',
              'px-2',
              (disabled || !canIncrement) && 'opacity-50'
            )}
          >
            <Text className='text-gray-700 dark:text-gray-300 text-xs'>+</Text>
          </Pressable>
          <Pressable
            onPress={decrement}
            disabled={disabled || !canDecrement}
            accessibilityRole='button'
            accessibilityLabel='Decrement'
            className={cn(
              'flex-1 items-center justify-center',
              'rounded border border-gray-300 dark:border-gray-600',
              'bg-white dark:bg-gray-800',
              'px-2',
              (disabled || !canDecrement) && 'opacity-50'
            )}
          >
            <Text className='text-gray-700 dark:text-gray-300 text-xs'>−</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // No steppers: just the input
  return (
    <TextInput
      value={String(value)}
      onChangeText={handleTextChange}
      keyboardType='numeric'
      editable={!disabled}
      placeholder={placeholder}
      className={cn(
        'rounded-lg border',
        'border-gray-300 dark:border-gray-600',
        'bg-white dark:bg-gray-800',
        'text-gray-900 dark:text-gray-100',
        sizeConfig.input,
        disabled && 'opacity-50',
        className
      )}
      accessibilityLabel='Number input'
    />
  );
};
