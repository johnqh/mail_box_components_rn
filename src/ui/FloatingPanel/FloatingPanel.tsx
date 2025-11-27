import * as React from 'react';
import { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { cn } from '../../lib/utils';

export interface FloatingPanelProps {
  /** Panel content */
  children: React.ReactNode;
  /** Panel title */
  title?: string;
  /** Initial position */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  /** Collapsible */
  collapsible?: boolean;
  /** Initially collapsed */
  defaultCollapsed?: boolean;
  /** Close button */
  closeable?: boolean;
  /** Close handler */
  onClose?: () => void;
  /** Additional className */
  className?: string;
}

/**
 * FloatingPanel Component
 *
 * Floating panel positioned at screen corners.
 * Useful for chat widgets, help panels, or notifications.
 *
 * @example
 * ```tsx
 * <FloatingPanel
 *   title="Help & Support"
 *   position="bottom-right"
 *   collapsible
 * >
 *   <ChatWidget />
 * </FloatingPanel>
 * ```
 */
export const FloatingPanel: React.FC<FloatingPanelProps> = ({
  children,
  title,
  position = 'bottom-right',
  collapsible = true,
  defaultCollapsed = false,
  closeable = false,
  onClose,
  className,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const positionStyles = {
    'bottom-right': { bottom: 16, right: 16 },
    'bottom-left': { bottom: 16, left: 16 },
    'top-right': { top: 16, right: 16 },
    'top-left': { top: 16, left: 16 },
  };

  return (
    <View
      style={[styles.container, positionStyles[position]]}
      className={cn(
        'w-80 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-2xl',
        className
      )}
    >
      {/* Header */}
      {(title || collapsible || closeable) && (
        <View className='flex-row items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700'>
          {title && (
            <Text className='font-semibold text-gray-900 dark:text-white'>
              {title}
            </Text>
          )}

          <View className='flex-row items-center gap-2'>
            {collapsible && (
              <Pressable
                onPress={() => setIsCollapsed(!isCollapsed)}
                className='p-1 active:bg-gray-100 dark:active:bg-gray-800 rounded'
                accessibilityRole='button'
                accessibilityLabel={isCollapsed ? 'Expand' : 'Collapse'}
              >
                <Text
                  className={cn(
                    'text-gray-600 dark:text-gray-400',
                    isCollapsed && 'rotate-180'
                  )}
                >
                  ▼
                </Text>
              </Pressable>
            )}

            {closeable && (
              <Pressable
                onPress={onClose}
                className='p-1 active:bg-gray-100 dark:active:bg-gray-800 rounded'
                accessibilityRole='button'
                accessibilityLabel='Close'
              >
                <Text className='text-gray-600 dark:text-gray-400'>✕</Text>
              </Pressable>
            )}
          </View>
        </View>
      )}

      {/* Content */}
      {!isCollapsed && <View className='p-4'>{children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 50,
  },
});
