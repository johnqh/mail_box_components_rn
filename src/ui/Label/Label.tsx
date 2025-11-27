import * as React from 'react';
import { Text, TextProps } from 'react-native';
import { cn } from '../../lib/utils';
import { textVariants } from '@sudobility/design';

export interface LabelProps extends TextProps {
  /** Label content */
  children: React.ReactNode;
  /** Whether the associated input is required */
  required?: boolean;
  /** Whether the label is disabled */
  disabled?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * Label Component
 *
 * Text label for form inputs with proper styling.
 *
 * @example
 * ```tsx
 * <Label>Email Address</Label>
 * <Input placeholder="Enter your email" />
 * ```
 *
 * @example
 * ```tsx
 * <Label required>Password</Label>
 * <Input secureTextEntry />
 * ```
 */
export const Label = React.forwardRef<Text, LabelProps>(
  ({ children, required, disabled, className, ...props }, ref) => {
    return (
      <Text
        ref={ref}
        className={cn(
          textVariants.label.default(),
          disabled && 'opacity-70',
          className
        )}
        accessibilityRole='text'
        {...props}
      >
        {children}
        {required && <Text className='text-red-500 ml-1'>*</Text>}
      </Text>
    );
  }
);

Label.displayName = 'Label';
