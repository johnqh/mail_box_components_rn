import * as React from 'react';
import { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { cn } from '../../lib/utils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface DialogProps {
  /** Whether dialog is open */
  isOpen: boolean;
  /** Close handler */
  onClose?: () => void;
  /** Dialog content */
  children: React.ReactNode;
  /** Dialog size */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Show close button */
  showCloseButton?: boolean;
  /** Close on outside click */
  closeOnOutsideClick?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * Dialog Component
 *
 * Simple, flexible dialog/modal container for React Native.
 * More flexible than AlertDialog, suitable for any content.
 *
 * @example
 * ```tsx
 * <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
 *   <View className="p-6">
 *     <Text>Dialog Title</Text>
 *     <Text>Dialog content...</Text>
 *   </View>
 * </Dialog>
 * ```
 */
export const Dialog: React.FC<DialogProps> = ({
  isOpen,
  onClose,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOutsideClick = true,
  className,
}) => {
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0.9);
      opacityAnim.setValue(0);
    }
  }, [isOpen, scaleAnim, opacityAnim]);

  // Size configurations (percentage of screen width)
  const sizeWidths = {
    sm: SCREEN_WIDTH * 0.7,
    md: SCREEN_WIDTH * 0.8,
    lg: SCREEN_WIDTH * 0.9,
    xl: SCREEN_WIDTH * 0.95,
    full: SCREEN_WIDTH - 32,
  };

  const handleOverlayPress = () => {
    if (closeOnOutsideClick && onClose) {
      onClose();
    }
  };

  return (
    <Modal
      visible={isOpen}
      animationType='none'
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
    >
      {/* Backdrop */}
      <Pressable
        onPress={handleOverlayPress}
        className='flex-1 justify-center items-center bg-black/60'
      >
        {/* Dialog Container */}
        <Animated.View
          style={{
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }],
            width: sizeWidths[size],
            maxHeight: '80%',
          }}
        >
          <Pressable onPress={e => e.stopPropagation()}>
            <View
              className={cn(
                'bg-white dark:bg-gray-900 rounded-xl shadow-xl overflow-hidden',
                className
              )}
            >
              {/* Close button */}
              {showCloseButton && onClose && (
                <Pressable
                  onPress={onClose}
                  className='absolute top-4 right-4 z-10 p-1'
                  accessibilityRole='button'
                  accessibilityLabel='Close dialog'
                >
                  <Text className='text-xl text-gray-400'>✕</Text>
                </Pressable>
              )}

              {/* Content */}
              <ScrollView bounces={false}>{children}</ScrollView>
            </View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
};
