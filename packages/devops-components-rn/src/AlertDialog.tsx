import React from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  ActivityIndicator,
  type ViewProps,
} from 'react-native';
import { cn } from '@sudobility/components-rn';

type AlertVariant = 'default' | 'danger' | 'warning' | 'success';

export interface AlertDialogProps extends ViewProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  variant?: AlertVariant;
  showCancel?: boolean;
  confirmDisabled?: boolean;
  loading?: boolean;
}

const variantClasses: Record<AlertVariant, { iconBg: string; icon: string; button: string }> = {
  default: {
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    icon: 'text-blue-600 dark:text-blue-400',
    button: 'bg-blue-600 active:bg-blue-700',
  },
  danger: {
    iconBg: 'bg-red-100 dark:bg-red-900/30',
    icon: 'text-red-600 dark:text-red-400',
    button: 'bg-red-600 active:bg-red-700',
  },
  warning: {
    iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
    icon: 'text-yellow-600 dark:text-yellow-400',
    button: 'bg-yellow-600 active:bg-yellow-700',
  },
  success: {
    iconBg: 'bg-green-100 dark:bg-green-900/30',
    icon: 'text-green-600 dark:text-green-400',
    button: 'bg-green-600 active:bg-green-700',
  },
};

const variantIcons: Record<AlertVariant, string> = {
  default: 'ℹ️',
  danger: '⚠️',
  warning: '⚠️',
  success: '✓',
};

/**
 * AlertDialog component for React Native
 * Modal dialog for confirmations and alerts
 */
export const AlertDialog: React.FC<AlertDialogProps> = ({
  isOpen,
  onClose,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  variant = 'default',
  showCancel = true,
  confirmDisabled = false,
  loading = false,
  className,
  ...props
}) => {
  const handleConfirm = () => {
    if (!confirmDisabled && !loading) {
      onConfirm();
    }
  };

  const styles = variantClasses[variant];

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50 p-4">
        <View
          className={cn(
            'w-full max-w-md bg-white dark:bg-gray-900 rounded-lg shadow-xl',
            className
          )}
          {...props}
        >
          {/* Content */}
          <View className="p-6">
            <View className="flex-row items-start gap-4">
              <View
                className={cn(
                  'w-12 h-12 rounded-full items-center justify-center',
                  styles.iconBg
                )}
              >
                <Text className={cn('text-xl', styles.icon)}>
                  {variantIcons[variant]}
                </Text>
              </View>

              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {typeof title === 'string' ? title : null}
                </Text>
                {typeof title !== 'string' && title}

                {description && (
                  <Text className="text-sm text-gray-600 dark:text-gray-400">
                    {typeof description === 'string' ? description : null}
                  </Text>
                )}
                {typeof description !== 'string' && description}
              </View>
            </View>
          </View>

          {/* Actions */}
          <View className="flex-row gap-3 px-6 py-4 bg-gray-50 dark:bg-gray-800/50 rounded-b-lg">
            {showCancel && (
              <Pressable
                onPress={onClose}
                disabled={loading}
                accessibilityRole="button"
                className={cn(
                  'flex-1 px-4 py-2 rounded-md border',
                  'bg-white dark:bg-gray-700',
                  'border-gray-300 dark:border-gray-600',
                  loading && 'opacity-50'
                )}
              >
                <Text className="text-sm font-medium text-center text-gray-700 dark:text-gray-300">
                  {cancelLabel}
                </Text>
              </Pressable>
            )}

            <Pressable
              onPress={handleConfirm}
              disabled={confirmDisabled || loading}
              accessibilityRole="button"
              className={cn(
                'flex-1 px-4 py-2 rounded-md',
                styles.button,
                (confirmDisabled || loading) && 'opacity-50'
              )}
            >
              {loading ? (
                <View className="flex-row items-center justify-center gap-2">
                  <ActivityIndicator size="small" color="white" />
                  <Text className="text-sm font-medium text-white">Loading...</Text>
                </View>
              ) : (
                <Text className="text-sm font-medium text-center text-white">
                  {confirmLabel}
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};
