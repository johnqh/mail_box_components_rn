import * as React from 'react';
import { View, TextInput, Text, TextInputProps } from 'react-native';
import { cn } from '../../lib/utils';

export interface TextAreaProps extends Omit<TextInputProps, 'onChange'> {
  /** Current value */
  value: string;
  /** Callback when value changes */
  onChangeText: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Number of visible lines (used to calculate height) */
  numberOfLines?: number;
  /** Disabled state */
  disabled?: boolean;
  /** Read-only state */
  readOnly?: boolean;
  /** Show character count */
  showCount?: boolean;
  /** Maximum character count */
  maxLength?: number;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional className for container */
  className?: string;
  /** Additional className for the input */
  inputClassName?: string;
}

/**
 * TextArea Component
 *
 * Multi-line text input with character counting and consistent styling.
 *
 * @example
 * ```tsx
 * <TextArea
 *   value={message}
 *   onChangeText={setMessage}
 *   placeholder="Write your message..."
 *   numberOfLines={5}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <TextArea
 *   value={bio}
 *   onChangeText={setBio}
 *   showCount
 *   maxLength={500}
 *   placeholder="Tell us about yourself..."
 * />
 * ```
 */
export const TextArea: React.FC<TextAreaProps> = ({
  value,
  onChangeText,
  placeholder,
  numberOfLines = 4,
  disabled = false,
  readOnly = false,
  showCount = false,
  maxLength,
  size = 'md',
  className,
  inputClassName,
  ...textInputProps
}) => {
  // Size configurations
  const sizeClasses = {
    sm: 'p-2 text-sm',
    md: 'p-3 text-base',
    lg: 'p-4 text-lg',
  };

  const handleChangeText = (newValue: string) => {
    // Enforce maxLength if provided
    if (maxLength && newValue.length > maxLength) {
      return;
    }

    onChangeText(newValue);
  };

  const characterCount = value.length;
  const showCountInfo = showCount || maxLength !== undefined;

  return (
    <View className={cn('w-full', className)}>
      <TextInput
        value={value}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        numberOfLines={numberOfLines}
        editable={!disabled && !readOnly}
        maxLength={maxLength}
        multiline
        textAlignVertical='top'
        className={cn(
          'w-full rounded-lg border',
          'bg-white dark:bg-gray-800',
          'text-gray-900 dark:text-gray-100',
          'placeholder:text-gray-400 dark:placeholder:text-gray-500',
          'border-gray-300 dark:border-gray-600',
          sizeClasses[size],
          disabled && 'opacity-50',
          readOnly && 'bg-gray-50 dark:bg-gray-900',
          inputClassName
        )}
        placeholderTextColor='#9CA3AF'
        accessibilityRole='text'
        accessibilityState={{ disabled }}
        {...textInputProps}
      />

      {/* Character count */}
      {showCountInfo && (
        <View className='flex flex-row justify-end mt-1'>
          <Text
            className={cn(
              'text-xs',
              maxLength && characterCount > maxLength * 0.9
                ? 'text-yellow-600 dark:text-yellow-400'
                : 'text-gray-500 dark:text-gray-400',
              maxLength &&
                characterCount >= maxLength &&
                'text-red-600 dark:text-red-400'
            )}
          >
            {characterCount}
            {maxLength && ` / ${maxLength}`}
          </Text>
        </View>
      )}
    </View>
  );
};
