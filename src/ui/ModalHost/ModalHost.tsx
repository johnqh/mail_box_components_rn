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
 * actually used: visible, an animation, a close request. Anything narrower than
 * `Modal`'s full API is a prop a platform variant would have to fake.
 */
import React from 'react';
import { Modal } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export interface ModalHostProps {
  visible: boolean;
  /** `slide` for a sheet that comes up, `fade` for a centred dialog. */
  animationType?: 'none' | 'slide' | 'fade';
  /** Back button on Android, Escape where there is one. */
  onRequestClose?: () => void;
  children: React.ReactNode;
}

export const ModalHost: React.FC<ModalHostProps> = ({
  visible,
  animationType = 'fade',
  onRequestClose,
  children,
}) => (
  <Modal
    visible={visible}
    animationType={animationType}
    transparent
    onRequestClose={onRequestClose}
    statusBarTranslucent
  >
    {/*
      A native modal renders in a detached view tree that the app's
      SafeAreaProvider does not reach; re-provide it so insets resolve.
    */}
    <SafeAreaProvider>{children}</SafeAreaProvider>
  </Modal>
);
