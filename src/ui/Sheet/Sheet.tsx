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
  PanResponder,
} from 'react-native';
import { cn } from '../../lib/utils';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

export interface SheetProps {
  /** Whether sheet is open */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
  /** Sheet content */
  children: React.ReactNode;
  /** Sheet title */
  title?: string;
  /** Sheet description */
  description?: string;
  /** Sheet footer */
  footer?: React.ReactNode;
  /** Sheet side */
  side?: 'bottom' | 'top' | 'left' | 'right';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'full';
  /** Show drag handle */
  showHandle?: boolean;
  /** Show close button */
  showCloseButton?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * Sheet Component
 *
 * Mobile-first bottom sheet that slides up from screen edge.
 * Also supports top, left, and right positions.
 * Includes gesture support for drag to dismiss (bottom sheets).
 *
 * @example
 * ```tsx
 * <Sheet
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Filter Options"
 *   showHandle
 * >
 *   <View>Filter content...</View>
 * </Sheet>
 * ```
 */
export const Sheet: React.FC<SheetProps> = ({
  isOpen,
  onClose,
  children,
  title,
  description,
  footer,
  side = 'bottom',
  size = 'md',
  showHandle = true,
  showCloseButton = true,
  className,
}) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const panY = useRef(new Animated.Value(0)).current;

  // Size configurations (percentage of screen)
  const sizeValues = {
    bottom: {
      sm: SCREEN_HEIGHT * 0.33,
      md: SCREEN_HEIGHT * 0.5,
      lg: SCREEN_HEIGHT * 0.66,
      full: SCREEN_HEIGHT,
    },
    top: {
      sm: SCREEN_HEIGHT * 0.33,
      md: SCREEN_HEIGHT * 0.5,
      lg: SCREEN_HEIGHT * 0.66,
      full: SCREEN_HEIGHT,
    },
    left: {
      sm: SCREEN_WIDTH * 0.6,
      md: SCREEN_WIDTH * 0.75,
      lg: SCREEN_WIDTH * 0.9,
      full: SCREEN_WIDTH,
    },
    right: {
      sm: SCREEN_WIDTH * 0.6,
      md: SCREEN_WIDTH * 0.75,
      lg: SCREEN_WIDTH * 0.9,
      full: SCREEN_WIDTH,
    },
  };

  const sheetSize = sizeValues[side][size];
  const isVertical = side === 'bottom' || side === 'top';

  useEffect(() => {
    if (isOpen) {
      panY.setValue(0);
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
  }, [isOpen, slideAnim, panY]);

  // Pan responder for drag-to-dismiss (bottom sheets)
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => side === 'bottom',
      onMoveShouldSetPanResponder: (_, gestureState) =>
        side === 'bottom' && gestureState.dy > 10,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          panY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100 || gestureState.vy > 0.5) {
          onClose();
        } else {
          Animated.spring(panY, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  // Calculate transform based on side
  const getTransform = () => {
    const baseTransform = slideAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [sheetSize, 0],
    });

    switch (side) {
      case 'bottom':
        return {
          transform: [
            {
              translateY: Animated.add(
                slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [sheetSize, 0],
                }),
                panY
              ),
            },
          ],
        };
      case 'top':
        return {
          transform: [
            {
              translateY: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-sheetSize, 0],
              }),
            },
          ],
        };
      case 'left':
        return {
          transform: [
            {
              translateX: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-sheetSize, 0],
              }),
            },
          ],
        };
      case 'right':
        return {
          transform: [
            {
              translateX: baseTransform,
            },
          ],
        };
      default:
        return {};
    }
  };

  // Position styles
  const positionStyles = {
    bottom: { bottom: 0, left: 0, right: 0 },
    top: { top: 0, left: 0, right: 0 },
    left: { left: 0, top: 0, bottom: 0 },
    right: { right: 0, top: 0, bottom: 0 },
  };

  // Border radius styles
  const radiusClasses = {
    bottom: 'rounded-t-2xl',
    top: 'rounded-b-2xl',
    left: 'rounded-r-2xl',
    right: 'rounded-l-2xl',
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

      {/* Sheet */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            ...positionStyles[side],
            ...(isVertical ? { height: sheetSize } : { width: sheetSize }),
          },
          getTransform(),
        ]}
        {...(side === 'bottom' ? panResponder.panHandlers : {})}
      >
        <View
          className={cn(
            'flex-1 bg-white dark:bg-gray-900 shadow-xl',
            radiusClasses[side],
            className
          )}
        >
          {/* Drag Handle */}
          {showHandle && (side === 'bottom' || side === 'top') && (
            <View
              className={cn(
                'items-center justify-center',
                side === 'bottom' ? 'pt-3 pb-2' : 'pb-3 pt-2'
              )}
            >
              <View className='w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full' />
            </View>
          )}

          {/* Header */}
          {(title || description || showCloseButton) && (
            <View className='px-4 py-4 border-b border-gray-200 dark:border-gray-700'>
              <View className='flex flex-row items-start justify-between'>
                <View className='flex-1'>
                  {title && (
                    <Text className='text-lg font-semibold text-gray-900 dark:text-white'>
                      {title}
                    </Text>
                  )}
                  {description && (
                    <Text className='mt-1 text-sm text-gray-600 dark:text-gray-400'>
                      {description}
                    </Text>
                  )}
                </View>
                {showCloseButton && (
                  <Pressable
                    onPress={onClose}
                    className='ml-4 p-1'
                    accessibilityRole='button'
                    accessibilityLabel='Close sheet'
                  >
                    <Text className='text-xl text-gray-400'>✕</Text>
                  </Pressable>
                )}
              </View>
            </View>
          )}

          {/* Content */}
          <ScrollView className='flex-1 px-4 py-4' bounces={false}>
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
