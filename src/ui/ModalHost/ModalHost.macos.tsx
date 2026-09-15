/**
 * The modal host on macOS.
 *
 * React Native macOS ships no modal host view: mounting `<Modal>` throws there,
 * even while hidden. So by default a dialog is drawn inside the app's own
 * window, above everything else, through the `Portal` the app mounts at its
 * root — a card over a dimmed backdrop, the same frame an Android tablet gets.
 *
 * **An app that patches a modal host in** (music_app_rn does, presenting each
 * `<Modal>` as a sheet on its window) calls `setNativeDialogsSupported(true)`
 * at start-up, and dialogs become real sheets: the system dims the window and
 * draws the frame, and the card is sized to its content up to what the window
 * allows — the native side sizes the sheet from what the card drew. Portals
 * written inside such a sheet render inside it, through a scoped `PortalHost`:
 * the sheet blocks the window behind it, so a Select opened in a dialog must
 * draw its list in the dialog.
 *
 * Menus, popovers and pickers are not dialogs, and stay in-tree either way.
 */
import React from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import { Portal, PortalHost } from '../Portal';
import { nativeDialogsSupported } from './native-dialogs';

export type ModalPresentation = 'fullScreen' | 'dialog' | 'sheet';

/** No UIKit presentation on macOS: the frame is ours, or the sheet's. */
export const HAS_NATIVE_PRESENTATION = false;

export type ModalFrame = { layout: 'fill' | 'card'; backdrop: boolean };

export function modalFrameFor(presentation: ModalPresentation): ModalFrame {
  if (presentation === 'fullScreen') return { layout: 'fill', backdrop: false };
  // A native sheet is dimmed and framed by the system; a drawn one is not.
  return { layout: 'card', backdrop: !nativeDialogsSupported() };
}

export interface ModalHostProps {
  visible: boolean;
  animationType?: 'none' | 'slide' | 'fade';
  /** Escape in a native sheet. A drawn dialog dismisses from its backdrop. */
  onRequestClose?: () => void;
  presentation?: ModalPresentation;
  children: React.ReactNode;
}

export const ModalHost: React.FC<ModalHostProps> = ({
  visible,
  onRequestClose,
  presentation = 'fullScreen',
  children,
}) => {
  if (!visible) return null;
  if (presentation !== 'fullScreen' && nativeDialogsSupported()) {
    return (
      <Modal
        visible
        transparent
        animationType='none'
        onRequestClose={onRequestClose}
      >
        {/* Hugs the card, up to the sheet's largest size. */}
        <PortalHost scoped style={styles.sheetContent}>
          {children}
        </PortalHost>
      </Modal>
    );
  }
  return (
    <Portal>
      {/*
        `absoluteFill` rather than a layout box: the portal's host is an
        ordinary child of the app root, and a dialog has to cover the app
        rather than take a row in it.
      */}
      <View style={StyleSheet.absoluteFill} pointerEvents='box-none'>
        {children}
      </View>
    </Portal>
  );
};

const styles = StyleSheet.create({
  sheetContent: { alignSelf: 'flex-start', maxHeight: '100%' },
});
