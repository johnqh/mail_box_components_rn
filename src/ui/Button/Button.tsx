import * as React from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  Text,
  type GestureResponderEvent,
  type PressableProps,
} from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { touchSlop, type HitSlop } from '../../lib/touch-target';

/**
 * What each size needs added to reach the minimum touch target.
 *
 * Keyed by the size variant so the numbers sit beside the heights they answer
 * for — `sm` is `h-8`, `icon` is `h-10 w-10`, and the rest are already tall
 * enough that `touchSlop` returns zeros.
 */
/** See the `android_ripple` note on the `Pressable` below. */
const RIPPLE = { borderless: false } as const;
const PRESSED_STYLE = Platform.OS === 'ios' ? { opacity: 0.6 } : undefined;

const SIZE_SLOP: Record<string, HitSlop> = {
  default: touchSlop(999, 40),
  sm: touchSlop(999, 32),
  lg: touchSlop(999, 48),
  icon: touchSlop(40, 40),
};
import { variants as v } from '@sudobility/design';
import {
  ButtonBaseProps,
  extractTextClasses,
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
  extends
    ButtonBaseProps,
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
    // RN doesn't inherit text color from the container; apply the variant's
    // text/font classes directly to the inner Text so it matches the web.
    const variantTextClass = extractTextClasses(designSystemClass);

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
        /*
          `sm` is 32pt tall and `icon` is 40 — both under the 44/48 both
          platforms ask for. The hit region is extended rather than the button,
          because growing them would relayout every screen in every app that
          uses this library, and both platforms are explicit that it is the
          *touch area* the figure applies to. A caller passing its own hitSlop
          still wins: `props` is spread after this.
        */
        hitSlop={SIZE_SLOP[size ?? 'default']}
        /*
          What the button does while the finger is still down.

          It used to do nothing: the fill only changed once the touch *ended*,
          which reads as a control that did not notice the press — and on a
          slow frame as one that ignored it. Every native button on both
          platforms answers on touch-**down**, each in its own way, so this is
          two answers rather than one drawn compromise.

          Android gets the platform's own `RippleDrawable`, drawn by the OS
          from the touch point outwards on the UI thread — so it appears even
          while JavaScript is busy. iOS has no ripple; a `UIButton` dims the
          instant it is touched and restores on release, which is the pressed
          opacity. Deliberately not `TouchableOpacity`, whose 150ms fade is its
          own invention rather than UIKit's.

          A caller that wants neither passes its own: `props` spreads after.
        */
        android_ripple={RIPPLE}
        style={({ pressed }) =>
          pressed && !isDisabled ? PRESSED_STYLE : undefined
        }
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
          <Text
            className={cn(
              'text-center font-medium',
              variantTextClass,
              textClassName
            )}
          >
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
