/**
 * Activation, for a pointer and for assistive technology.
 *
 * **A copy of `src/lib/a11y.ts` in `@sudobility/components-rn`, which is the
 * original.** Every sibling package that already depends on components-rn
 * imports it from there instead; this package deliberately depends on nothing
 * but React Native and `clsx`, and adding a whole component library as a
 * dependency to reach four lines would be the worse trade. If the rule ever
 * changes, it changes in both places — the tests in `__tests__` pin the
 * behaviour on this side.
 *
 * The rule: a `Pressable`/`Touchable*` wired with `onPress` alone is operable
 * by a finger and by a mouse, and **not** by an accessibility client. On
 * react-native-macos an assistive activation — VoiceOver's
 * Control-Option-Space, Switch Control, Voice Control's "click Save" — arrives
 * as **`onAccessibilityTap`**, not as `onPress`: there is no synthesized touch
 * behind it. iOS VoiceOver happens to fall back to a synthesized press when the
 * prop is absent, which is why the gap is invisible until somebody runs the app
 * on a Mac; there the control announces itself, takes focus, and then does
 * nothing at all when activated.
 */
import type { GestureResponderEvent } from 'react-native';

/**
 * A press handler as the touchables declare it.
 *
 * The return type is `unknown` rather than `void` so an `async` handler is
 * accepted without a cast.
 */
export type PressHandler = (event: GestureResponderEvent) => unknown;

/**
 * The `onAccessibilityTap` that goes with `onPress`.
 *
 * `undefined` when there is nothing to call or the control is disabled, so a
 * disabled control stays inert to assistive technology exactly as it is to a
 * finger — `disabled` on the touchable suppresses `onPress`, and nothing
 * suppresses `onAccessibilityTap` for you.
 */
export function accessibilityTap(
  onPress: PressHandler | undefined | null,
  disabled?: boolean | null
): (() => void) | undefined {
  if (!onPress || disabled) return undefined;
  return () => {
    onPress(undefined as unknown as GestureResponderEvent);
  };
}

/** What {@link pressProps} hands a touchable. */
export interface PressProps {
  onPress: PressHandler | undefined;
  onAccessibilityTap: (() => void) | undefined;
}

/**
 * Both activation routes for one handler.
 *
 * Spread into a touchable in place of `onPress`, so the handler is written
 * once:
 *
 * ```tsx
 * <Pressable {...pressProps(handleSelect, disabled)} disabled={disabled} />
 * ```
 *
 * Written once is the point: the two props otherwise hold two copies of the
 * same expression, and the day one is edited is the day macOS stops matching
 * the mouse.
 */
export function pressProps(
  onPress: PressHandler | undefined | null,
  disabled?: boolean | null
): PressProps {
  return {
    onPress: onPress ?? undefined,
    onAccessibilityTap: accessibilityTap(onPress, disabled),
  };
}
