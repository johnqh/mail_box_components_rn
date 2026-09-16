import * as React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ModalHost } from '../ModalHost';
import { cn } from '../../lib/utils';
import { safeAreaPadding } from '../../lib/safe-area';
import { pressProps } from '../../lib/a11y';

export interface OverlayProps {
  /** Whether overlay is visible */
  isOpen: boolean;
  /** Click handler for overlay backdrop */
  onClose?: () => void;
  /** Overlay content */
  children?: React.ReactNode;
  /** Opacity level */
  opacity?: 'light' | 'medium' | 'dark';
  /** Additional className */
  className?: string;
}

/**
 * Overlay Component
 *
 * Full-screen backdrop overlay with optional content.
 * Typically used with modals, drawers, and popups.
 *
 * @example
 * ```tsx
 * <Overlay isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
 *   <ModalHost>Content</ModalHost>
 * </Overlay>
 * ```
 *
 * @example
 * ```tsx
 * <Overlay isOpen={true} opacity="dark" />
 * ```
 */
export const Overlay: React.FC<OverlayProps> = ({
  isOpen,
  onClose,
  children,
  opacity = 'medium',
  className,
}) => {
  // Before the early return: a hook cannot sit behind a condition.
  const insets = useSafeAreaInsets();

  if (!isOpen) return null;

  // Opacity configurations
  const opacityClasses = {
    light: 'bg-black/20',
    medium: 'bg-black/50',
    dark: 'bg-black/75',
  };

  return (
    <ModalHost visible={isOpen} animationType='fade' onRequestClose={onClose}>
      <View style={styles.container}>
        <Pressable
          style={StyleSheet.absoluteFill}
          className={cn(opacityClasses[opacity], className)}
          {...pressProps(onClose)}
          accessibilityRole='button'
          accessibilityLabel='Close overlay'
        />
        {children && (
          /*
            The content is centred in the safe area, not in the screen. The
            scrim is the sibling `absoluteFill` above and still covers the whole
            window, so only what the caller put inside moves clear of a
            landscape phone's display cutout and of the home indicator.
          */
          <View
            style={[styles.content, safeAreaPadding(insets)]}
            pointerEvents='box-none'
          >
            {children}
          </View>
        )}
      </View>
    </ModalHost>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
