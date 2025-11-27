import * as React from 'react';
import { View, Text, Modal } from 'react-native';
import { cn } from '../../lib/utils';
import { Spinner } from '../Spinner';

export interface LoadingOverlayProps {
  /** Whether the overlay is visible */
  isLoading: boolean;
  /** Loading message */
  message?: string;
  /** Overlay mode */
  mode?: 'fullscreen' | 'container';
  /** Spinner size */
  spinnerSize?: 'small' | 'default' | 'large' | 'extraLarge';
  /** Additional className */
  className?: string;
}

/**
 * LoadingOverlay Component
 *
 * Full-screen or container loading overlay with spinner and optional message.
 * Useful for async operations, page loads, and data fetching.
 *
 * @example
 * ```tsx
 * <LoadingOverlay
 *   isLoading={isSubmitting}
 *   message="Saving changes..."
 * />
 * ```
 *
 * @example
 * ```tsx
 * <View className="relative flex-1">
 *   <LoadingOverlay
 *     isLoading={isLoading}
 *     mode="container"
 *   />
 *   <YourContent />
 * </View>
 * ```
 */
export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  message,
  mode = 'fullscreen',
  spinnerSize = 'large',
  className,
}) => {
  if (!isLoading) return null;

  const content = (
    <View
      className={cn(
        mode === 'fullscreen' ? 'flex-1' : 'absolute inset-0',
        'items-center justify-center',
        'bg-white/80 dark:bg-gray-900/80',
        className
      )}
      accessibilityRole='alert'
      accessibilityLabel={message || 'Loading'}
    >
      <Spinner size={spinnerSize} />
      {message && (
        <Text className='text-base text-gray-700 dark:text-gray-300 mt-4'>
          {message}
        </Text>
      )}
    </View>
  );

  // Fullscreen mode uses Modal
  if (mode === 'fullscreen') {
    return (
      <Modal
        visible={isLoading}
        transparent
        animationType='fade'
        statusBarTranslucent
      >
        {content}
      </Modal>
    );
  }

  // Container mode renders inline
  return content;
};
