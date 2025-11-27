import * as React from 'react';
import { useState, useRef, useCallback } from 'react';
import {
  View,
  Pressable,
  Text,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { cn } from '../../lib/utils';

export interface DropdownItem {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Icon component */
  icon?: React.ReactNode;
  /** Press handler */
  onPress: () => void;
  /** Whether item is disabled */
  disabled?: boolean;
  /** Whether to render as separator */
  separator?: boolean;
}

export interface DropdownProps {
  /** Trigger element */
  trigger: React.ReactNode;
  /** Menu items */
  items: DropdownItem[];
  /** Alignment relative to trigger */
  align?: 'left' | 'right';
  /** Additional className for container */
  className?: string;
  /** Variant style */
  variant?: 'default' | 'bordered';
}

/**
 * Dropdown Component
 *
 * A dropdown menu that displays a list of actions when triggered.
 * Uses Modal for overlay behavior on React Native.
 *
 * @example
 * ```tsx
 * <Dropdown
 *   trigger={<Button>Menu</Button>}
 *   items={[
 *     { id: '1', label: 'Edit', onPress: handleEdit },
 *     { id: '2', label: 'Delete', onPress: handleDelete, variant: 'danger' },
 *   ]}
 * />
 * ```
 */
export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  align = 'right',
  className,
  variant = 'default',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [triggerLayout, setTriggerLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const triggerRef = useRef<View>(null);

  const handleOpen = useCallback(() => {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setTriggerLayout({ x, y, width, height });
      setIsOpen(true);
    });
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleItemPress = useCallback((item: DropdownItem) => {
    if (!item.disabled) {
      item.onPress();
      setIsOpen(false);
    }
  }, []);

  // Calculate menu position
  const menuStyle = {
    position: 'absolute' as const,
    top: triggerLayout.y + triggerLayout.height + 4,
    ...(align === 'left'
      ? { left: triggerLayout.x }
      : {
          right: triggerLayout.x > 0 ? undefined : 16,
          left:
            align === 'right'
              ? triggerLayout.x + triggerLayout.width - 200
              : triggerLayout.x,
        }),
    minWidth: 160,
    maxWidth: 280,
  };

  return (
    <View className={cn('relative', className)} ref={triggerRef}>
      <Pressable
        onPress={handleOpen}
        className={cn(
          variant === 'bordered' &&
            'border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2'
        )}
        accessibilityRole='button'
        accessibilityLabel='Open menu'
        accessibilityState={{ expanded: isOpen }}
      >
        {trigger}
      </Pressable>

      <Modal
        visible={isOpen}
        transparent
        animationType='fade'
        onRequestClose={handleClose}
      >
        <TouchableWithoutFeedback onPress={handleClose}>
          <View className='flex-1'>
            <View
              style={menuStyle}
              className='bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 overflow-hidden'
            >
              {items.map(item =>
                item.separator ? (
                  <View
                    key={item.id}
                    className='my-1 h-px bg-gray-200 dark:bg-gray-700'
                    accessibilityRole='none'
                  />
                ) : (
                  <Pressable
                    key={item.id}
                    onPress={() => handleItemPress(item)}
                    disabled={item.disabled}
                    className={cn(
                      'flex-row items-center gap-2 px-4 py-2.5',
                      item.disabled
                        ? 'opacity-50'
                        : 'active:bg-gray-100 dark:active:bg-gray-700'
                    )}
                    accessibilityRole='menuitem'
                    accessibilityState={{ disabled: item.disabled }}
                  >
                    {item.icon && <View className='w-5 h-5'>{item.icon}</View>}
                    <Text
                      className={cn(
                        'text-sm',
                        item.disabled
                          ? 'text-gray-400 dark:text-gray-500'
                          : 'text-gray-700 dark:text-gray-200'
                      )}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                )
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};
