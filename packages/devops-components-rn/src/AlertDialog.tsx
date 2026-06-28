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
import { colors, textVariants } from '@sudobility/design';

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

const variantClasses: Record<
  AlertVariant,
  { iconBg: string; icon: string; button: string }
> = {
  default: {
    iconBg: `${colors.component.badge.primary.base} ${colors.component.badge.primary.dark}`,
    icon: `${colors.component.alert.info.icon}`,
    button: 'bg-primary active:bg-primary/90',
  },
  danger: {
    iconBg: `${colors.component.badge.error.base} ${colors.component.badge.error.dark}`,
    icon: `${colors.component.alert.error.icon}`,
    button: 'bg-destructive active:bg-destructive',
  },
  warning: {
    iconBg: `${colors.component.badge.attention.base} ${colors.component.badge.attention.dark}`,
    icon: `${colors.component.alert.attention.icon}`,
    button: 'bg-warning active:bg-warning',
  },
  success: {
    iconBg: `${colors.component.badge.success.base} ${colors.component.badge.success.dark}`,
    icon: `${colors.component.alert.success.icon}`,
    button: 'bg-success active:bg-success',
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
      animationType='fade'
      onRequestClose={onClose}
    >
      <View className='flex-1 justify-center items-center bg-black/50 p-4'>
        <View
          className={cn(
            'w-full max-w-md bg-background rounded-lg shadow-xl',
            className
          )}
          {...props}
        >
          {/* Content */}
          <View className='p-6'>
            <View className='flex-row items-start gap-4'>
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

              <View className='flex-1'>
                <Text className={cn(textVariants.heading.h5(), 'mb-2')}>
                  {typeof title === 'string' ? title : null}
                </Text>
                {typeof title !== 'string' && title}

                {description && (
                  <Text className={textVariants.body.sm()}>
                    {typeof description === 'string' ? description : null}
                  </Text>
                )}
                {typeof description !== 'string' && description}
              </View>
            </View>
          </View>

          {/* Actions */}
          <View className='flex-row gap-3 px-6 py-4 bg-card/50 rounded-b-lg'>
            {showCancel && (
              <Pressable
                onPress={onClose}
                disabled={loading}
                accessibilityRole='button'
                className={cn(
                  'flex-1 px-4 py-2 rounded-md border',
                  'bg-card',
                  'border-border',
                  loading && 'opacity-50'
                )}
              >
                <Text className='text-sm font-medium text-center text-muted-foreground'>
                  {cancelLabel}
                </Text>
              </Pressable>
            )}

            <Pressable
              onPress={handleConfirm}
              disabled={confirmDisabled || loading}
              accessibilityRole='button'
              className={cn(
                'flex-1 px-4 py-2 rounded-md',
                styles.button,
                (confirmDisabled || loading) && 'opacity-50'
              )}
            >
              {loading ? (
                <View className='flex-row items-center justify-center gap-2'>
                  <ActivityIndicator size='small' color='white' />
                  <Text className='text-sm font-medium text-white'>
                    Loading...
                  </Text>
                </View>
              ) : (
                <Text className='text-sm font-medium text-center text-white'>
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
