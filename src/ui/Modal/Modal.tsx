import * as React from 'react';
import {
  View,
  Text,
  Modal as RNModal,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { cn } from '../../lib/utils';

export interface ModalProps {
  /** Whether the modal is visible */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Modal title */
  title?: string;
  /** Size variant */
  size?: 'small' | 'medium' | 'large' | 'fullWidth';
  /** Show close button */
  showCloseButton?: boolean;
  /** Close when pressing backdrop */
  closeOnOverlayClick?: boolean;
  /** Modal content */
  children: React.ReactNode;
  /** Additional className for the content */
  className?: string;
}

/**
 * Modal Component
 *
 * Modal dialog for displaying content in an overlay.
 *
 * @example
 * ```tsx
 * <Modal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Confirm Action"
 * >
 *   <ModalContent>
 *     <Text>Are you sure you want to proceed?</Text>
 *   </ModalContent>
 *   <ModalFooter>
 *     <Button onPress={() => setIsOpen(false)}>Cancel</Button>
 *     <Button variant="primary" onPress={handleConfirm}>Confirm</Button>
 *   </ModalFooter>
 * </Modal>
 * ```
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  size = 'medium',
  showCloseButton = true,
  closeOnOverlayClick = true,
  children,
  className,
}) => {
  // Size configurations
  const sizeClasses = {
    small: 'w-72',
    medium: 'w-80',
    large: 'w-96',
    fullWidth: 'w-full mx-4',
  };

  const handleOverlayPress = () => {
    if (closeOnOverlayClick) {
      onClose();
    }
  };

  return (
    <RNModal
      visible={isOpen}
      animationType='fade'
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1'
      >
        <Pressable
          onPress={handleOverlayPress}
          className='flex-1 justify-center items-center bg-black/50'
        >
          <Pressable
            onPress={e => e.stopPropagation()}
            className={cn(
              'bg-white dark:bg-gray-800 rounded-xl shadow-xl max-h-[80%]',
              sizeClasses[size],
              className
            )}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <View className='flex flex-row items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700'>
                {title && (
                  <Text className='text-lg font-semibold text-gray-900 dark:text-white flex-1'>
                    {title}
                  </Text>
                )}
                {showCloseButton && (
                  <Pressable
                    onPress={onClose}
                    className='p-1 -mr-1 rounded-full'
                    accessibilityRole='button'
                    accessibilityLabel='Close modal'
                  >
                    <Text className='text-xl text-gray-500 dark:text-gray-400'>
                      ✕
                    </Text>
                  </Pressable>
                )}
              </View>
            )}

            {/* Content */}
            <ScrollView bounces={false}>{children}</ScrollView>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </RNModal>
  );
};

export interface ModalHeaderProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * ModalHeader - Header section of the modal
 */
export const ModalHeader: React.FC<ModalHeaderProps> = ({
  children,
  className,
}) => (
  <View
    className={cn(
      'px-4 py-3 border-b border-gray-200 dark:border-gray-700',
      className
    )}
  >
    {children}
  </View>
);

export interface ModalContentProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * ModalContent - Body section of the modal
 */
export const ModalContent: React.FC<ModalContentProps> = ({
  children,
  className,
}) => <View className={cn('px-4 py-4', className)}>{children}</View>;

export interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * ModalFooter - Footer section of the modal
 */
export const ModalFooter: React.FC<ModalFooterProps> = ({
  children,
  className,
}) => (
  <View
    className={cn(
      'flex flex-row items-center justify-end gap-2 px-4 py-3 border-t border-gray-200 dark:border-gray-700',
      className
    )}
  >
    {children}
  </View>
);
