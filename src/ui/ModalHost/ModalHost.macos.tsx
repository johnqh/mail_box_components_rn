/**
 * The overlay host on macOS, where `<Modal>` is not an option.
 *
 * React Native macOS's Fabric renderer has no `RCTModalHostView`: mounting one
 * throws, and it throws even when `visible` is false, because the component is
 * created before it is asked whether to show anything. So a dialog cannot be a
 * native window here — it is drawn in the app's own view tree instead, above
 * everything else, through the `Portal` the app mounts once at its root.
 *
 * What that costs is honest to state: there is no separate window, so a dialog
 * cannot escape the app's bounds, and `onRequestClose` has no Escape key wired
 * to it — the backdrop press each caller already draws is what dismisses it.
 * What it buys is that every dialog in this library works on macOS unchanged.
 */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Portal } from '../Portal';

export interface ModalHostProps {
  visible: boolean;
  animationType?: 'none' | 'slide' | 'fade';
  onRequestClose?: () => void;
  children: React.ReactNode;
}

export const ModalHost: React.FC<ModalHostProps> = ({ visible, children }) => {
  if (!visible) return null;
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
