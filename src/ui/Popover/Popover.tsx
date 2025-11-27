import * as React from 'react';
import { useState, useRef, useEffect, useCallback } from 'react';
import { View, Modal, Pressable, Animated } from 'react-native';
import { cn } from '../../lib/utils';

export interface PopoverProps {
  /** Trigger element */
  trigger: React.ReactNode;
  /** Popover content */
  children: React.ReactNode;
  /** Placement relative to trigger */
  placement?: 'top' | 'bottom' | 'left' | 'right';
  /** Open state (controlled) */
  isOpen?: boolean;
  /** Open state change handler (controlled) */
  onOpenChange?: (open: boolean) => void;
  /** Additional className */
  className?: string;
}

/**
 * Popover Component
 *
 * Floating content container anchored to a trigger element.
 * Useful for contextual information, menus, and form helpers.
 *
 * @example
 * ```tsx
 * <Popover trigger={<Button>Open</Button>}>
 *   <View className="p-4">
 *     <Text>Popover content</Text>
 *   </View>
 * </Popover>
 * ```
 */
export const Popover: React.FC<PopoverProps> = ({
  trigger,
  children,
  placement = 'bottom',
  isOpen: controlledIsOpen,
  onOpenChange,
  className,
}) => {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const triggerRef = useRef<View>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const isOpen =
    controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;

  const setIsOpen = useCallback(
    (open: boolean) => {
      if (controlledIsOpen === undefined) {
        setInternalIsOpen(open);
      }
      onOpenChange?.(open);
    },
    [controlledIsOpen, onOpenChange]
  );

  useEffect(() => {
    if (isOpen) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    } else {
      fadeAnim.setValue(0);
    }
  }, [isOpen, fadeAnim]);

  const handleTriggerPress = () => {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setPosition({ x, y, width, height });
      setIsOpen(!isOpen);
    });
  };

  // Calculate popover position
  const getPopoverPosition = () => {
    const OFFSET = 8;

    switch (placement) {
      case 'top':
        return {
          bottom: position.y > 0 ? undefined : 0,
          top: position.y - OFFSET,
          left: position.x,
          width: position.width,
          transform: [{ translateY: -100 }] as const,
        };
      case 'bottom':
        return {
          top: position.y + position.height + OFFSET,
          left: position.x,
          width: position.width,
        };
      case 'left':
        return {
          top: position.y,
          right: position.x > 0 ? undefined : 0,
          transform: [{ translateX: -8 }] as const,
        };
      case 'right':
        return {
          top: position.y,
          left: position.x + position.width + OFFSET,
        };
      default:
        return {};
    }
  };

  return (
    <>
      <Pressable ref={triggerRef} onPress={handleTriggerPress}>
        {trigger}
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType='none'
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable className='flex-1' onPress={() => setIsOpen(false)}>
          <Animated.View
            style={[
              {
                position: 'absolute',
                ...getPopoverPosition(),
                opacity: fadeAnim,
              },
            ]}
          >
            <Pressable onPress={e => e.stopPropagation()}>
              <View
                className={cn(
                  'bg-white dark:bg-gray-800',
                  'border border-gray-200 dark:border-gray-700',
                  'rounded-lg shadow-lg',
                  className
                )}
              >
                {children}
              </View>
            </Pressable>
          </Animated.View>
        </Pressable>
      </Modal>
    </>
  );
};
