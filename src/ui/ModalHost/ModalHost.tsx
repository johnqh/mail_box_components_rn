/**
 * The overlay every dialog in this library is mounted through.
 *
 * React Native's `<Modal>` is a *native* window on the platforms that have one,
 * which is what makes a dialog sit above the app rather than inside its view
 * tree. macOS has no modal host of its own — see `ModalHost.macos.tsx` — so
 * nothing else imports `Modal` directly. One host with a platform variant is
 * why a dialog written once works everywhere.
 *
 * **How a modal is presented is decided by its caller, from the form factor**
 * (`useFormFactor`): a phone gets `fullScreen`, a tablet or a desktop gets a
 * `dialog`. This host turns that into the platform's own presentation, and
 * {@link modalFrameFor} tells the caller how much of the frame the platform
 * already draws.
 */
import React from 'react';
import { Modal, Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

/**
 * How the modal sits on screen.
 *
 * `fullScreen` fills the screen, which is what a phone wants. `dialog` is a
 * panel over the app, which is what a tablet or a desktop wants — the platform's
 * own dialog where it has one (a UIKit form sheet on iPadOS, a sheet on macOS
 * where the app supports it) and a drawn one elsewhere. `sheet` is the older
 * name for `dialog`.
 */
export type ModalPresentation = 'fullScreen' | 'dialog' | 'sheet';

/** Whether this platform draws the modal's window itself (iOS). */
export const HAS_NATIVE_PRESENTATION = Platform.OS === 'ios';

/**
 * What the caller has to draw for a presentation.
 *
 * `fill` — the platform provides a window of a definite size (a full screen, a
 * UIKit form sheet), and the content fills it: bar at the top, body taking the
 * height between, actions against the bottom. `card` — the content is a card
 * sized to what it holds, up to what the window allows, with its body scrolling
 * past that; `backdrop` says whether the caller also dims what is behind it.
 */
export type ModalFrame = { layout: 'fill' | 'card'; backdrop: boolean };

export function modalFrameFor(presentation: ModalPresentation): ModalFrame {
  if (HAS_NATIVE_PRESENTATION || presentation === 'fullScreen') {
    return { layout: 'fill', backdrop: false };
  }
  return { layout: 'card', backdrop: true };
}

/**
 * Every orientation, so the modal never contradicts the app.
 *
 * React Native defaults `supportedOrientations` to `['portrait']`, which is a
 * claim the *modal* makes about the whole app. In a landscape-only app that
 * reads as "Modal was presented with 0x2 orientations mask but the application
 * only supports 0x18" — a warning in dev and **a crash in release**. Listing
 * all four hands the decision back to the host's Info.plist.
 */
const ALL_ORIENTATIONS = [
  'portrait',
  'portrait-upside-down',
  'landscape',
] as const;

export interface ModalHostProps {
  visible: boolean;
  /** `slide` for a full-screen panel that comes up, `fade` for a dialog. */
  animationType?: 'none' | 'slide' | 'fade';
  /** Back button on Android, Escape where there is one. */
  onRequestClose?: () => void;
  /** Defaults to `fullScreen`. */
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
      iOS gets the real presentation and everything else keeps a transparent
      window, with the caller painting its own backdrop and card.
    */
    {...(HAS_NATIVE_PRESENTATION
      ? {
          transparent: false,
          presentationStyle:
            presentation === 'fullScreen'
              ? ('fullScreen' as const)
              : ('formSheet' as const),
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
