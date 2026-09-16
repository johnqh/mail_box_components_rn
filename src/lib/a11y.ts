/**
 * Activation, for a pointer and for assistive technology.
 *
 * A `Pressable`/`Touchable*` wired with `onPress` alone is operable by a
 * finger and by a mouse, and **not** by an accessibility client. On
 * react-native-macos an assistive activation — VoiceOver's Control-Option-Space,
 * Switch Control, Voice Control's "click Save" — arrives as
 * **`onAccessibilityTap`**, not as `onPress`: there is no synthesized touch
 * behind it. iOS VoiceOver happens to fall back to a synthesized press when the
 * prop is absent, which is why the gap is invisible until somebody runs the app
 * on a Mac; there the control announces itself, takes focus, and then does
 * nothing at all when activated.
 *
 * `Button` carried the fix inline first. It lives here now because the rule is
 * the package's rather than that one component's, and because a rule restated
 * at 130 call sites is a rule 130 places can quietly get wrong.
 */
import type { GestureResponderEvent } from 'react-native';

/**
 * A press handler as the touchables declare it.
 *
 * The return type is `unknown` rather than `void` so an `async` handler — which
 * several components have — is accepted without a cast.
 */
export type PressHandler = (event: GestureResponderEvent) => unknown;

/**
 * The `onAccessibilityTap` that goes with `onPress`.
 *
 * `undefined` when there is nothing to call or the control is disabled, so a
 * disabled control stays inert to assistive technology exactly as it is to a
 * finger — `disabled` on the touchable suppresses `onPress`, and nothing
 * suppresses `onAccessibilityTap` for you.
 *
 * There is no gesture behind an assistive activation, hence no event to pass
 * on; handlers that need one (a scrim's `e.stopPropagation()`, say) are not
 * activatable in the first place and are left alone.
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
 * the mouse. Spread early, before any `{...props}` a caller supplies, so a
 * caller's own handlers still win.
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
