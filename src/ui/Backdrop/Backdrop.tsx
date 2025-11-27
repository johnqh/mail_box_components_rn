import * as React from 'react';
import { Pressable, View } from 'react-native';
import { cn } from '../../lib/utils';

export interface BackdropProps {
  /** Whether the backdrop is visible */
  isOpen: boolean;
  /** Press handler for backdrop */
  onPress?: () => void;
  /** Backdrop opacity variant */
  opacity?: 'light' | 'medium' | 'dark';
  /** Children to render on top of backdrop */
  children?: React.ReactNode;
  /** Additional className */
  className?: string;
}

/**
 * Backdrop Component
 *
 * Reusable backdrop/overlay for modals, drawers, and dialogs.
 * Provides consistent darkening effect.
 *
 * @example
 * ```tsx
 * <Backdrop isOpen={isModalOpen} onPress={closeModal}>
 *   <View onStartShouldSetResponder={() => true}>
 *     <ModalContent />
 *   </View>
 * </Backdrop>
 * ```
 *
 * @example
 * ```tsx
 * <Backdrop
 *   isOpen={isDrawerOpen}
 *   onPress={closeDrawer}
 *   opacity="medium"
 * >
 *   <Drawer />
 * </Backdrop>
 * ```
 */
export const Backdrop: React.FC<BackdropProps> = ({
  isOpen,
  onPress,
  opacity = 'medium',
  children,
  className,
}) => {
  if (!isOpen) return null;

  // Opacity configurations
  const opacityClasses = {
    light: 'bg-black/20',
    medium: 'bg-black/50',
    dark: 'bg-black/75',
  };

  if (children) {
    return (
      <Pressable
        onPress={onPress}
        className={cn('absolute inset-0', opacityClasses[opacity], className)}
        accessibilityRole='none'
      >
        <View
          className='flex-1'
          onStartShouldSetResponder={() => true}
          onResponderRelease={e => e.stopPropagation()}
        >
          {children}
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      className={cn('absolute inset-0', opacityClasses[opacity], className)}
      accessibilityRole='none'
    />
  );
};
