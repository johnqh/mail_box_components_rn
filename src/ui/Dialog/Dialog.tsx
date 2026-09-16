import * as React from 'react';
import { useRef, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ModalHost } from '../ModalHost';
import { cn } from '../../lib/utils';
import { safeAreaPadding } from '../../lib/safe-area';
import { pressProps } from '../../lib/a11y';

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
  const insets = useSafeAreaInsets();

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
    <ModalHost visible={isOpen} animationType='none' onRequestClose={onClose}>
      {/* Backdrop */}
      <Pressable
        {...pressProps(handleOverlayPress)}
        className='flex-1 justify-center items-center bg-black/60'
        /*
          Centred in the safe area, not in the screen. The scrim is this view's
          own background and still covers the whole window; only the panel moves
          in, so a wide dialog on a landscape phone can no longer run under a
          display cutout.
        */
        style={safeAreaPadding(insets)}
      >
        {/* Dialog Container */}
        <Animated.View
          style={{
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }],
            /*
              A cutout column is width the dialog cannot use, so the size
              fractions are capped by what is left — an `xl` at 95% of the
              screen would otherwise overflow the padded container rather than
              fit inside it.
            */
            width: Math.min(
              sizeWidths[size],
              SCREEN_WIDTH - insets.left - insets.right
            ),
            maxHeight: '80%',
          }}
        >
          <Pressable /* no-a11y-tap: swallows a press on the panel so it does not reach the scrim behind it. Not a control, and there is no gesture behind an assistive activation to stop. */
            onPress={e => e.stopPropagation()}
          >
            <View
              className={cn(
                'bg-background rounded-xl shadow-xl overflow-hidden',
                className
              )}
            >
              {/* Close button */}
              {showCloseButton && onClose && (
                <Pressable
                  {...pressProps(onClose)}
                  className='absolute top-4 right-4 z-10 p-1'
                  accessibilityRole='button'
                  accessibilityLabel='Close dialog'
                >
                  <Text className='text-xl text-muted-foreground'>✕</Text>
                </Pressable>
              )}

              {/* Content */}
              <ScrollView bounces={false}>{children}</ScrollView>
            </View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </ModalHost>
  );
};
