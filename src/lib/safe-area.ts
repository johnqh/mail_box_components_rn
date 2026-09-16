/**
 * Safe-area padding for a surface that reaches a screen edge.
 *
 * **A full-screen or edge-anchored surface pads for every edge it touches, not
 * just the two vertical ones.** That "just the two" is the shape this bug
 * always takes, and it is invisible on the device most of the work is done on:
 * a portrait iPhone reports `left` and `right` as 0, so applying `top` and
 * `bottom` alone looks complete and tests clean. It is a landscape phone that
 * has horizontal insets — a display cutout puts the whole camera housing in a
 * column down one side, and on the Android phone this was measured on that
 * column is **159px wide**. `FormModal` shipped with exactly that omission and
 * put its Close button at `[12,167][156,311]`: entirely inside the cutout, with
 * no way to dismiss the dialog at all, while the body text started at x=45,
 * under the housing.
 *
 * So the rule for this package is all four edges, and the reason the helper
 * exists rather than four inline additions is that four inline additions are
 * how three of them come to be written and the fourth forgotten.
 *
 * `edges` is for a surface that genuinely only touches some: a bottom sheet
 * pads bottom/left/right, and padding its top would push its own header down
 * from the rounded corner it is drawn against.
 */
import type { ViewStyle } from 'react-native';
import type { EdgeInsets } from 'react-native-safe-area-context';

export type SafeAreaEdge = 'top' | 'right' | 'bottom' | 'left';

/** Every edge — the default, and what a full-screen surface wants. */
export const ALL_EDGES: readonly SafeAreaEdge[] = [
  'top',
  'right',
  'bottom',
  'left',
];

/**
 * The padding style that keeps content clear of the system's own furniture.
 *
 * Padding rather than margin on purpose: the surface's background still reaches
 * the physical edge — a modal that stopped short of the cutout column would
 * show the app behind it through the gap — and only the content moves in.
 *
 * `base` is added to each padded edge, for a surface that already wanted
 * padding of its own; an edge left out of `edges` gets neither the inset nor
 * the base, so a caller cannot accidentally pad an edge it does not touch.
 */
export function safeAreaPadding(
  insets: EdgeInsets,
  edges: readonly SafeAreaEdge[] = ALL_EDGES,
  base = 0
): ViewStyle {
  const style: ViewStyle = {};
  if (edges.includes('top')) style.paddingTop = insets.top + base;
  if (edges.includes('right')) style.paddingRight = insets.right + base;
  if (edges.includes('bottom')) style.paddingBottom = insets.bottom + base;
  if (edges.includes('left')) style.paddingLeft = insets.left + base;
  return style;
}
