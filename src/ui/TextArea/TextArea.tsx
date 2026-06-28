import * as React from 'react';
import { View, TextInput, Text, TextInputProps } from 'react-native';
import { cn } from '../../lib/utils';
import { colors } from '@sudobility/design';

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
          'bg-background',
          'text-foreground',
          'placeholder:text-muted-foreground',
          'border-input',
          sizeClasses[size],
          disabled && 'opacity-50',
          readOnly && 'bg-muted',
          inputClassName
        )}
        // TODO: theme-aware color — placeholderTextColor is a raw prop and
        // cannot be driven by a semantic className; this neutral works in
        // both light and dark but is not theme-flipping.
        placeholderTextColor={colors.raw.neutral[400]}
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
                ? 'text-warning'
                : 'text-muted-foreground',
              maxLength && characterCount >= maxLength && 'text-destructive'
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
