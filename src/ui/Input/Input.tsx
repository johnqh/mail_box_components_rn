import * as React from 'react';
import {
  TextInput,
  type TextInputProps,
  type NativeSyntheticEvent,
  type TextInputFocusEventData,
} from 'react-native';
import { cn } from '../../lib/utils';
import { variants as v } from '@sudobility/design';

export interface InputProps extends Omit<TextInputProps, 'style'> {
  /** Additional class names for styling */
  className?: string;
  /** Error state */
  error?: boolean;
  /** Disabled state */
  disabled?: boolean;
}

/**
 * Input component for React Native
 *
 * @example
 * ```tsx
 * <Input
 *   placeholder="Enter your email"
 *   value={email}
 *   onChangeText={setEmail}
 *   keyboardType="email-address"
 * />
 * ```
 */
export const Input = React.forwardRef<TextInput, InputProps>(
  (
    { className, error, disabled, editable, onFocus, onBlur, ...props },
    ref
  ) => {
    const [isFocused, setIsFocused] = React.useState(false);

    const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(true);
      onFocus?.(e);
    };

    const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setIsFocused(false);
      onBlur?.(e);
    };

    const isEditable = editable !== false && !disabled;

    return (
      <TextInput
        ref={ref}
        className={cn(
          v.input.default(),
          isFocused && 'border-blue-500 dark:border-blue-400',
          error && 'border-red-500 dark:border-red-400',
          disabled && 'opacity-50 bg-gray-100 dark:bg-gray-800',
          className
        )}
        editable={isEditable}
        onFocus={handleFocus}
        onBlur={handleBlur}
        accessibilityState={{
          disabled: !isEditable,
        }}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
