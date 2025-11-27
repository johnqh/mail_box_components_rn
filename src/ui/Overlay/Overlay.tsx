import * as React from 'react';
import { View, Pressable, Modal, StyleSheet } from 'react-native';
import { cn } from '../../lib/utils';

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
 *   <Modal>Content</Modal>
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
  if (!isOpen) return null;

  // Opacity configurations
  const opacityClasses = {
    light: 'bg-black/20',
    medium: 'bg-black/50',
    dark: 'bg-black/75',
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType='fade'
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <Pressable
          style={StyleSheet.absoluteFill}
          className={cn(opacityClasses[opacity], className)}
          onPress={onClose}
          accessibilityRole='button'
          accessibilityLabel='Close overlay'
        />
        {children && (
          <View style={styles.content} pointerEvents='box-none'>
            {children}
          </View>
        )}
      </View>
    </Modal>
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
