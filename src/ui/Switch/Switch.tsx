/**
 * The platform's own switch.
 *
 * This used to be a `Pressable` with an `Animated.View` thumb sliding inside a
 * rounded track — a drawing of a switch, and it read as one: the wrong size,
 * the wrong thumb shadow, the wrong spring, and none of the platform's own
 * behaviours. React Native ships the real control, so this now renders
 * `UISwitch` on iOS and iPadOS, a Material switch on Android, and `NSSwitch` on
 * macOS, and gets each platform's animation, haptics and accessibility for
 * free rather than approximating them.
 *
 * **The API is unchanged** — `checked` / `onCheckedChange`, controlled or
 * uncontrolled — because callers should not have to care that the inside is
 * now native.
 */
import * as React from 'react';
import { Switch as NativeSwitch, Platform } from 'react-native';
import type { SwitchProps as NativeSwitchProps } from 'react-native';
import { useThemeColor } from '../../lib/theme-color';

export interface SwitchProps extends Omit<
  NativeSwitchProps,
  'value' | 'onValueChange' | 'trackColor' | 'thumbColor'
> {
  /** Whether the switch is on (controlled mode) */
  checked?: boolean;
  /** Default checked state (uncontrolled mode) */
  defaultChecked?: boolean;
  /** Change handler */
  onCheckedChange?: (checked: boolean) => void;
  /** Whether the switch is disabled */
  disabled?: boolean;
  /**
   * Accepted and ignored.
   *
   * A native switch is the size the platform draws it — `UISwitch` is 51×31pt
   * and not resizable — so a size here would be a promise this cannot keep.
   * Kept in the signature so existing callers still compile; scaling the
   * control with a transform was the alternative and produces a blurry switch
   * that no longer matches anything else on the screen.
   */
  size?: 'sm' | 'md' | 'lg';
  /** Additional className. Applied to the native control. */
  className?: string;
}

export const Switch = React.forwardRef<
  React.ComponentRef<typeof NativeSwitch>,
  SwitchProps
>(
  (
    {
      checked,
      defaultChecked = false,
      onCheckedChange,
      disabled = false,
      // Destructured only so it is not forwarded to the native control, which
      // would warn about an unknown prop.
      size: _size,
      ...props
    },
    ref
  ) => {
    const [internal, setInternal] = React.useState(defaultChecked);
    const isControlled = checked !== undefined;
    const value = isControlled ? checked : internal;

    const handleChange = React.useCallback(
      (next: boolean) => {
        if (!isControlled) setInternal(next);
        onCheckedChange?.(next);
      },
      [isControlled, onCheckedChange]
    );

    /*
      The track takes the theme as the host applied it: its runtime
      `--primary` / `--input` variables when it sets them with `vars()`
      (so a reader who chose Dark on a light-OS device gets the dark palette),
      else the configured theme in the OS's scheme. With neither, both are
      undefined rather than a guessed colour: an unthemed host gets the
      platform's own green/blue switch, which is a better answer than a red one
      this library invented.
    */
    const on = useThemeColor('primary');
    const off = useThemeColor('input');

    return (
      <NativeSwitch
        ref={ref}
        value={value}
        onValueChange={handleChange}
        disabled={disabled}
        /*
          The tracks are themed — the off one too, because the platform's
          follows the OS appearance, not the palette the host chose, and drew a
          light-mode track on a dark screen. The thumb and the shadow stay the
          platform's, which is the point of using the platform's switch —
          overriding them is how a native control starts looking drawn again.
        */
        trackColor={{ false: off, true: on }}
        // iOS draws the off state's fill from this, not from `trackColor`.
        ios_backgroundColor={off}
        {...(Platform.OS === 'ios' ? {} : { thumbColor: undefined })}
        {...props}
      />
    );
  }
);

Switch.displayName = 'Switch';
