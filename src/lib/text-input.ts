/**
 * What every text field in this package starts from.
 *
 * **Android's fullscreen extract mode is off.** When a phone is short of
 * vertical room — which in practice means *landscape*, on every phone — Android
 * may decide to stop editing the field in place and replace the entire app with
 * a full-screen text editor and a DONE button. It is the platform's answer to a
 * field that would otherwise be hidden behind the IME, and for a login form it
 * is defensible. For anything whose design is that you watch something while
 * you type it, it is fatal: the lyric-entry bar exists to keep the note you are
 * writing a syllable onto visible, and extract mode covers the score with a
 * text box.
 *
 * `disableFullscreenUI` is React Native's name for Android's
 * `flagNoExtractUi`, and it is **Android-only in the runtime but not in the
 * type** — declared on the shared `TextInputProps` (marked `@platform android`)
 * and forwarded to the native view only from `TextInput`'s Android branch. So
 * it needs no `Platform.OS` test in either the code or the types: on iOS,
 * macOS and Windows it is a prop nothing reads. Verified against
 * `react-native/Libraries/Components/TextInput/TextInput.js`, where the single
 * forward sits inside `<AndroidTextInput>`, and against `TextInput.d.ts`, where
 * it is an ordinary optional field of the shared props.
 *
 * **Spread this _before_ a caller's props, never after.** It is a default, and
 * a component that takes `TextInputProps` must let a caller who genuinely wants
 * the platform's full-screen editor say so.
 */
import type { TextInputProps } from 'react-native';

export const textInputDefaults: Pick<TextInputProps, 'disableFullscreenUI'> = {
  disableFullscreenUI: true,
};
