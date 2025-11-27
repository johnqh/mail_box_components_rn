import * as React from 'react';
import {
  Pressable,
  Text,
  ActivityIndicator,
  type PressableProps,
  type GestureResponderEvent,
} from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { variants as v } from '@sudobility/design';
import {
  ButtonBaseProps,
  getButtonVariantClass,
  useButtonState,
} from './Button.shared';

const buttonVariants = cva(
  'min-h-[44px] items-center justify-center flex-row',
  {
    variants: {
      variant: {
        default: '',
        primary: '',
        secondary: '',
        outline: '',
        ghost: '',
        destructive: '',
        'destructive-outline': '',
        success: '',
        link: '',
        gradient: '',
        'gradient-secondary': '',
        'gradient-success': '',
        wallet: '',
        connect: '',
        disconnect: '',
      },
      size: {
        default: '',
        sm: 'h-8 px-3',
        lg: 'h-12 px-6',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends ButtonBaseProps,
    Omit<PressableProps, 'children' | 'disabled'>,
    Omit<VariantProps<typeof buttonVariants>, 'variant' | 'size'> {
  /** Callback when button is pressed */
  onPress?: (event: GestureResponderEvent) => void;
  /** Accessibility label for screen readers */
  accessibilityLabel?: string;
  /** Additional text styles for the button text */
  textClassName?: string;
}

/**
 * Button component for React Native
 *
 * @example
 * ```tsx
 * <Button variant="primary" onPress={() => console.log('pressed')}>
 *   Press me
 * </Button>
 * ```
 */
export const Button = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  ButtonProps
>(
  (
    {
      className,
      textClassName,
      variant = 'default',
      size = 'default',
      disabled,
      loading,
      onPress,
      accessibilityLabel,
      children,
      ...props
    },
    ref
  ) => {
    const { isDisabled, showSpinner } = useButtonState(loading, disabled);

    const variantName = variant || 'default';
    const sizeName =
      size && size !== 'default' && size !== 'icon' ? size : undefined;

    const designSystemClass = getButtonVariantClass(variantName, sizeName, v);

    return (
      <Pressable
        ref={ref}
        className={cn(
          buttonVariants({ variant, size }),
          designSystemClass,
          isDisabled && 'opacity-50',
          className
        )}
        disabled={isDisabled}
        onPress={onPress}
        accessibilityRole='button'
        accessibilityLabel={accessibilityLabel}
        accessibilityState={{ disabled: isDisabled }}
        {...props}
      >
        {showSpinner && (
          <ActivityIndicator
            size='small'
            color='currentColor'
            className='mr-2'
          />
        )}
        {typeof children === 'string' ? (
          <Text className={cn('text-center font-medium', textClassName)}>
            {children}
          </Text>
        ) : (
          children
        )}
      </Pressable>
    );
  }
);

Button.displayName = 'Button';

export { buttonVariants };
