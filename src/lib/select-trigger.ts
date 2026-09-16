/**
 * The style a picker trigger's label takes.
 *
 * Every picker in this package draws the same trigger: a row holding the
 * current value and a chevron. The label used to carry `flex: 1`, which in
 * React Native is `flexGrow: 1, flexShrink: 1, flexBasis: 0` — and **a
 * flex-basis of zero is a claim that the text needs no width at all**. Inside a
 * parent that has a width that is harmless: the label grows into what is left
 * over. Inside a parent whose width comes from *its own content* — a toolbar
 * row, a settings row laid out beside a label, anything not stretched — there
 * is nothing left over, because the row asked its children how wide they were
 * and the label answered zero. The trigger then measures as its padding plus
 * the chevron and renders as a bare chevron with the value invisible.
 *
 * `flexBasis: 'auto'` is the fix and the whole of it: the label's intrinsic
 * width is its text again, so a content-sized row is as wide as the value it
 * shows. `flexGrow: 1` is kept so the trigger still fills a parent that *does*
 * give it a width — a picker in a form column stays full width — and
 * `flexShrink: 1` is kept so that when the parent is narrower than the text,
 * the label shrinks and its `numberOfLines={1}` truncates it with an ellipsis
 * rather than pushing the chevron off the end. All three matter; dropping
 * shrink is how "Follows the sy…" becomes a trigger three times too wide.
 *
 * This is what three hardcoded widths in a consumer app were working around.
 */
import type { TextStyle } from 'react-native';

export const selectTriggerLabelStyle: TextStyle = {
  flexGrow: 1,
  flexShrink: 1,
  flexBasis: 'auto',
};
