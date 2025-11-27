import * as React from 'react';
import { useState } from 'react';
import { View, Pressable, Animated, PressableProps } from 'react-native';
import { cn } from '../../lib/utils';

export interface SwitchProps extends Omit<PressableProps, 'onPress'> {
  /** Whether the switch is on (controlled mode) */
  checked?: boolean;
  /** Default checked state (uncontrolled mode) */
  defaultChecked?: boolean;
  /** Change handler */
  onCheckedChange?: (checked: boolean) => void;
  /** Whether the switch is disabled */
  disabled?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional className */
  className?: string;
}

/**
 * Switch Component
 *
 * Toggle switch for binary on/off states with smooth animation.
 * Supports both controlled and uncontrolled modes.
 *
 * @example
 * ```tsx
 * // Controlled
 * <Switch
 *   checked={isEnabled}
 *   onCheckedChange={setIsEnabled}
 * />
 *
 * // Uncontrolled
 * <Switch defaultChecked={true} />
 * ```
 */
export const Switch = React.forwardRef<View, SwitchProps>(
  (
    {
      checked: controlledChecked,
      defaultChecked = false,
      onCheckedChange,
      disabled = false,
      size = 'md',
      className,
      ...pressableProps
    },
    ref
  ) => {
    // Support both controlled and uncontrolled modes
    const [uncontrolledChecked, setUncontrolledChecked] =
      useState(defaultChecked);
    const isControlled = controlledChecked !== undefined;
    const checked = isControlled ? controlledChecked : uncontrolledChecked;

    // Animation value for thumb position
    const animatedValue = React.useRef(
      new Animated.Value(checked ? 1 : 0)
    ).current;

    React.useEffect(() => {
      Animated.timing(animatedValue, {
        toValue: checked ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }, [checked, animatedValue]);

    // Size configurations
    const sizeConfig = {
      sm: {
        track: 'w-8 h-4',
        thumb: 'w-3 h-3',
        translateX: 16,
      },
      md: {
        track: 'w-11 h-6',
        thumb: 'w-5 h-5',
        translateX: 20,
      },
      lg: {
        track: 'w-14 h-8',
        thumb: 'w-7 h-7',
        translateX: 24,
      },
    };

    const config = sizeConfig[size];

    const handlePress = () => {
      if (disabled) return;

      const newChecked = !checked;

      if (!isControlled) {
        setUncontrolledChecked(newChecked);
      }

      onCheckedChange?.(newChecked);
    };

    const thumbTranslateX = animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0, config.translateX],
    });

    return (
      <Pressable
        ref={ref}
        onPress={handlePress}
        disabled={disabled}
        className={cn(
          'rounded-full items-center justify-start flex-row',
          config.track,
          checked
            ? 'bg-blue-600 dark:bg-blue-500'
            : 'bg-gray-200 dark:bg-gray-700',
          disabled && 'opacity-50',
          className
        )}
        accessibilityRole='switch'
        accessibilityState={{ checked, disabled }}
        {...pressableProps}
      >
        <Animated.View
          className={cn('rounded-full bg-white shadow-lg', config.thumb)}
          style={{
            transform: [{ translateX: thumbTranslateX }],
            marginLeft: 2,
          }}
        />
      </Pressable>
    );
  }
);

Switch.displayName = 'Switch';
