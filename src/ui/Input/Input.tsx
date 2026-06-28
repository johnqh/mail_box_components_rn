import * as React from 'react';
import {
  TextInput,
  type TextInputProps,
  type NativeSyntheticEvent,
  type TextInputFocusEventData,
} from 'react-native';
import { cn } from '../../lib/utils';
import { variants as v } from '@sudobility/design';
import { stripWebOnlyClasses } from '../Button/Button.shared';

// CSS pseudo-class selectors (focus:, disabled:) and focus rings don't work in
// RN, so we apply state classes via component state using the design system's
// semantic tokens (blue ring color, destructive border, muted disabled bg).
const inputFocusClass = 'border-ring';
const inputErrorClass = 'border-destructive';
const inputDisabledClass = 'opacity-50 bg-muted';

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
          // `border` ensures the border width is set (the variant only sets the
          // color); stripWebOnlyClasses removes focus rings that render as a
          // black halo on native.
          'border',
          stripWebOnlyClasses(v.input.default()),
          isFocused && inputFocusClass,
          error && inputErrorClass,
          disabled && inputDisabledClass,
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
