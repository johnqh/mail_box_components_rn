/**
 * The overlay every dialog in this library is mounted through.
 *
 * React Native's `<Modal>` is a *native* window on the platforms that have one,
 * which is what makes a dialog sit above the app rather than inside its view
 * tree. Not every platform has one — see `ModalHost.macos.tsx`, which draws the
 * same overlay in-tree — so nothing here imports `Modal` directly. One host
 * with a platform variant is why a dialog written once works on all of them.
 *
 * The prop surface is deliberately the subset every caller in this library
 * actually used: visible, an animation, a close request, and how it should be
 * presented. Anything narrower than `Modal`'s full API is a prop a platform
 * variant would have to fake.
 */
import React from 'react';
import { Modal, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

/**
 * How the dialog should sit on screen.
 *
 * `sheet` asks the platform for its own dialog where it has one — on iPadOS a
 * UIKit form sheet, with the system's own corners, shadow, dimming and
 * drag-to-dismiss. `fullScreen` fills the screen, which is what a phone wants.
 *
 * The distinction is about *presentation*, not size: a caller says which shape
 * the dialog is, and each platform gives the closest thing it actually has.
 */
export type ModalPresentation = 'sheet' | 'fullScreen';

/**
 * Whether this platform draws the dialog's frame itself.
 *
 * `true` means the content should simply fill what it is given — UIKit has
 * already drawn the sheet, its corners and the dimmed background behind it, and
 * a second backdrop painted underneath would show through as a grey border.
 * `false` means the caller draws its own frame, which is what Android and
 * macOS need. Exported so `FormModal` can ask rather than re-derive it.
 */
export const HAS_NATIVE_PRESENTATION = Platform.OS === 'ios';

/**
 * Every orientation, so the modal never contradicts the app.
 *
 * React Native defaults `supportedOrientations` to `['portrait']`, which is a
 * claim the *modal* makes about the whole app. In a landscape-only app that
 * reads as "Modal was presented with 0x2 orientations mask but the application
 * only supports 0x18" — a warning in dev and **a crash in release**. Listing
 * all four hands the decision back to the host's Info.plist, which is the only
 * place that should be making it: a dialog has no business narrowing the
 * orientations its app supports.
 */
const ALL_ORIENTATIONS = [
  'portrait',
  'portrait-upside-down',
  'landscape',
] as const;

export interface ModalHostProps {
  visible: boolean;
  /** `slide` for a sheet that comes up, `fade` for a centred dialog. */
  animationType?: 'none' | 'slide' | 'fade';
  /** Back button on Android, Escape where there is one. */
  onRequestClose?: () => void;
  /** Defaults to `fullScreen`, which is what every caller wanted before this. */
  presentation?: ModalPresentation;
  children: React.ReactNode;
}

export const ModalHost: React.FC<ModalHostProps> = ({
  visible,
  animationType = 'fade',
  onRequestClose,
  presentation = 'fullScreen',
  children,
}) => (
  <Modal
    visible={visible}
    animationType={animationType}
    onRequestClose={onRequestClose}
    supportedOrientations={[...ALL_ORIENTATIONS]}
    /*
      `presentationStyle` is iOS-only and is ignored unless the modal is
      opaque — a transparent modal has no view controller frame to style. So
      iOS gets the real presentation and everything else keeps the transparent
      window it has always had, with the caller painting its own backdrop.
    */
    {...(HAS_NATIVE_PRESENTATION
      ? {
          transparent: false,
          presentationStyle:
            presentation === 'sheet'
              ? ('formSheet' as const)
              : ('fullScreen' as const),
        }
      : { transparent: true, statusBarTranslucent: true })}
  >
    {/*
      A native modal renders in a detached view tree that the app's
      SafeAreaProvider does not reach; re-provide it so insets resolve.
    */}
    <SafeAreaProvider>{children}</SafeAreaProvider>
  </Modal>
);
