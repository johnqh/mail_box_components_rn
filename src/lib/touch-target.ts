/**
 * The smallest a thing you can tap is allowed to be.
 *
 * Both platforms publish a figure and they are not the same one: Apple's Human
 * Interface Guidelines ask for **44×44pt**, Material's accessibility guidance
 * for **48×48dp**. Hard-coding either everywhere gets one platform wrong, and
 * hard-coding a number below both — 42, say — gets both wrong while looking
 * deliberate.
 *
 * **Extend the touch area, do not grow the control.** A toolbar 44pt tall
 * cannot hold a 44pt button with any padding at all, and a switch whose track
 * is 24pt tall is 24pt tall on purpose — that is what a switch looks like. Both
 * platforms are explicit that the *hit region* is what must meet the figure,
 * not the drawn control, which is what `hitSlop` is for. Growing controls to
 * meet the number instead would relayout every screen in every app that uses
 * this library.
 */
import { Platform } from 'react-native';

/** 44pt on iOS and macOS, 48dp on Android. */
export const MIN_TOUCH_TARGET = Platform.OS === 'android' ? 48 : 44;

export type HitSlop = {
  top: number;
  bottom: number;
  left: number;
  right: number;
};

/**
 * The `hitSlop` that brings a control of `width`×`height` up to the minimum.
 *
 * Symmetric, and never negative: a control already at or above the figure gets
 * nothing added, so passing this to something large is harmless and callers do
 * not have to check first.
 */
export function touchSlop(width: number, height: number): HitSlop {
  const x = Math.max(0, (MIN_TOUCH_TARGET - width) / 2);
  const y = Math.max(0, (MIN_TOUCH_TARGET - height) / 2);
  return { top: y, bottom: y, left: x, right: x };
}
