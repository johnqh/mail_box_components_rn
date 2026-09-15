/**
 * Whether this app presents dialogs as native macOS sheets.
 *
 * React Native macOS ships no modal host: mounting `<Modal>` there throws, even
 * while hidden. An app that patches one in (music_app_rn does) turns this on at
 * start-up and gets real sheets; every other macOS app keeps the dialog drawn
 * inside its own window, which needs nothing native. Off by default for exactly
 * that reason — a library cannot know which apps carry the patch.
 */
let nativeDialogs = false;

export function setNativeDialogsSupported(supported: boolean): void {
  nativeDialogs = supported;
}

export function nativeDialogsSupported(): boolean {
  return nativeDialogs;
}
