import * as React from 'react';
import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { cn } from '../../lib/utils';
import { colors } from '@sudobility/design';

export interface TextInputModalProps {
  /** Modal visibility */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
  /** Submit handler */
  onSubmit: (value: string) => void | Promise<void>;
  /** Modal title */
  title: string;
  /** Modal description */
  description: string;
  /** Input placeholder */
  placeholder?: string;
  /** Initial input value */
  initialValue?: string;
  /** Cancel button text */
  cancelText?: string;
  /** Confirm button text */
  confirmText?: string;
  /** Loading state */
  isLoading?: boolean;
  /** Loading button text */
  loadingText?: string;
  /** Max input length */
  maxLength?: number;
  /** Required validation */
  required?: boolean;
  /** Custom validation function */
  validate?: (value: string) => string | null;
}

/**
 * TextInputModal Component
 *
 * Modal dialog with text input for collecting user input.
 * Supports validation, loading states, and customization.
 *
 * @example
 * ```tsx
 * <TextInputModal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   onSubmit={handleSubmit}
 *   title="Rename Item"
 *   description="Enter a new name for this item"
 *   placeholder="New name..."
 *   initialValue={currentName}
 * />
 * ```
 */
export const TextInputModal: React.FC<TextInputModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  description,
  placeholder = '',
  initialValue = '',
  cancelText = 'Cancel',
  confirmText = 'Confirm',
  isLoading = false,
  loadingText = 'Processing...',
  maxLength,
  required = true,
  validate,
}) => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  // Reset value when modal opens
  useEffect(() => {
    if (isOpen) {
      setValue(initialValue);
      setError(null);
    }
  }, [isOpen, initialValue]);

  const handleSubmit = useCallback(async () => {
    // Clear previous errors
    setError(null);

    // Validate required
    if (required && !value.trim()) {
      setError('This field is required');
      return;
    }

    // Custom validation
    if (validate) {
      const validationError = validate(value);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    // Submit
    try {
      await onSubmit(value.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  }, [value, required, validate, onSubmit]);

  const handleCancel = useCallback(() => {
    setValue(initialValue);
    setError(null);
    onClose();
  }, [initialValue, onClose]);

  const canSubmit = required ? value.trim().length > 0 : true;

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType='fade'
      onRequestClose={isLoading ? undefined : handleCancel}
    >
      <TouchableWithoutFeedback onPress={isLoading ? undefined : handleCancel}>
        <View className='flex-1 justify-center px-4 bg-black/50'>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <TouchableWithoutFeedback>
              <View className='bg-background rounded-lg shadow-xl'>
                {/* Content */}
                <View className='p-4'>
                  <Text className='text-lg font-semibold text-foreground'>
                    {title}
                  </Text>
                  <Text className='text-sm text-muted-foreground mt-2 mb-4'>
                    {description}
                  </Text>

                  <TextInput
                    value={value}
                    onChangeText={setValue}
                    placeholder={placeholder}
                    placeholderTextColor={colors.raw.neutral[400]}
                    maxLength={maxLength}
                    editable={!isLoading}
                    autoFocus
                    className={cn(
                      'px-3 py-2 text-sm',
                      'bg-card',
                      'text-foreground',
                      'border rounded-md',
                      error ? 'border-destructive ' : 'border-border'
                    )}
                    accessibilityLabel={placeholder || title}
                  />

                  {error && (
                    <Text
                      className='text-xs text-destructive mt-2'
                      accessibilityRole='alert'
                    >
                      {error}
                    </Text>
                  )}
                </View>

                {/* Footer */}
                <View className='flex-row gap-2 p-4 border-t border-border'>
                  <Pressable
                    onPress={handleCancel}
                    disabled={isLoading}
                    className={cn(
                      'flex-1 items-center py-2',
                      'bg-muted',
                      'rounded-md',
                      'active:bg-muted',
                      isLoading && 'opacity-50'
                    )}
                    accessibilityRole='button'
                    accessibilityLabel={cancelText}
                  >
                    <Text className='text-sm text-muted-foreground'>
                      {cancelText}
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={handleSubmit}
                    disabled={!canSubmit || isLoading}
                    className={cn(
                      'flex-1 items-center py-2',
                      'bg-primary dark:bg-primary',
                      'rounded-md',
                      'active:bg-primary/90',
                      (!canSubmit || isLoading) && 'opacity-50'
                    )}
                    accessibilityRole='button'
                    accessibilityLabel={confirmText}
                  >
                    <Text className='text-sm text-white font-medium'>
                      {isLoading ? loadingText : confirmText}
                    </Text>
                  </Pressable>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
