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

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

export interface DrawerProps {
  /** Whether drawer is open */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
  /** Drawer content */
  children: React.ReactNode;
  /** Side to slide from */
  side?: 'left' | 'right' | 'top' | 'bottom';
  /** Drawer size */
  size?: 'sm' | 'md' | 'lg' | 'full';
  /** Show close button */
  showCloseButton?: boolean;
  /** Drawer title */
  title?: string;
  /** Drawer footer */
  footer?: React.ReactNode;
  /** Additional className */
  className?: string;
}

/**
 * Drawer Component
 *
 * Side panel that slides in from screen edges.
 * Useful for navigation menus, filters, settings panels.
 *
 * @example
 * ```tsx
 * <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} side="left">
 *   <View>Menu items</View>
 * </Drawer>
 * ```
 */
export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  children,
  side = 'right',
  size = 'md',
  showCloseButton = true,
  title,
  footer,
  className,
}) => {
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Size configurations
  const sizeValues = {
    left: {
      sm: SCREEN_WIDTH * 0.6,
      md: SCREEN_WIDTH * 0.75,
      lg: SCREEN_WIDTH * 0.85,
      full: SCREEN_WIDTH,
    },
    right: {
      sm: SCREEN_WIDTH * 0.6,
      md: SCREEN_WIDTH * 0.75,
      lg: SCREEN_WIDTH * 0.85,
      full: SCREEN_WIDTH,
    },
    top: {
      sm: SCREEN_HEIGHT * 0.33,
      md: SCREEN_HEIGHT * 0.5,
      lg: SCREEN_HEIGHT * 0.66,
      full: SCREEN_HEIGHT,
    },
    bottom: {
      sm: SCREEN_HEIGHT * 0.33,
      md: SCREEN_HEIGHT * 0.5,
      lg: SCREEN_HEIGHT * 0.66,
      full: SCREEN_HEIGHT,
    },
  };

  const drawerSize = sizeValues[side][size];
  const isVertical = side === 'top' || side === 'bottom';

  useEffect(() => {
    if (isOpen) {
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 8,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isOpen, slideAnim]);

  // Calculate transform based on side
  const getTransform = () => {
    switch (side) {
      case 'left':
        return {
          transform: [
            {
              translateX: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-drawerSize, 0],
              }),
            },
          ],
        };
      case 'right':
        return {
          transform: [
            {
              translateX: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [drawerSize, 0],
              }),
            },
          ],
        };
      case 'top':
        return {
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-drawerSize, 0],
              }),
            },
          ],
        };
      case 'bottom':
        return {
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [drawerSize, 0],
              }),
            },
          ],
        };
      default:
        return {};
    }
  };

  // Position styles
  const positionStyles = {
    left: { left: 0, top: 0, bottom: 0 },
    right: { right: 0, top: 0, bottom: 0 },
    top: { top: 0, left: 0, right: 0 },
    bottom: { bottom: 0, left: 0, right: 0 },
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
      <Pressable onPress={onClose} className='absolute inset-0 bg-black/50' />

      {/* Drawer */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            ...positionStyles[side],
            ...(isVertical ? { height: drawerSize } : { width: drawerSize }),
          },
          getTransform(),
        ]}
      >
        <View
          className={cn(
            'flex-1 bg-white dark:bg-gray-900 shadow-xl',
            className
          )}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <View className='flex flex-row items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700'>
              {title && (
                <Text className='text-lg font-semibold text-gray-900 dark:text-white'>
                  {title}
                </Text>
              )}
              {showCloseButton && (
                <Pressable
                  onPress={onClose}
                  className='p-1'
                  accessibilityRole='button'
                  accessibilityLabel='Close drawer'
                >
                  <Text className='text-xl text-gray-500 dark:text-gray-400'>
                    ✕
                  </Text>
                </Pressable>
              )}
            </View>
          )}

          {/* Content */}
          <ScrollView className='flex-1 p-4' bounces={false}>
            {children}
          </ScrollView>

          {/* Footer */}
          {footer && (
            <View className='px-4 py-4 border-t border-gray-200 dark:border-gray-700'>
              {footer}
            </View>
          )}
        </View>
      </Animated.View>
    </Modal>
  );
};
