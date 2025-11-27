import * as React from 'react';
import { View, Text } from 'react-native';
import { Button, type ButtonProps } from '../Button';
import { Spinner } from '../Spinner';

export interface ActionButtonProps extends Omit<ButtonProps, 'children'> {
  /** Button text */
  children: React.ReactNode;
  /** Loading state */
  isLoading?: boolean;
  /** Text to show when loading (defaults to "Loading...") */
  loadingText?: string;
  /** Whether to show spinner icon when loading */
  showSpinner?: boolean;
}

/**
 * ActionButton Component
 *
 * Enhanced Button component with built-in loading state management.
 * Automatically shows loading text/spinner and disables interaction when loading.
 * Commonly used for form submissions, save actions, and async operations.
 *
 * @example
 * ```tsx
 * <ActionButton
 *   onPress={handleSave}
 *   isLoading={isSaving}
 *   loadingText="Saving..."
 *   variant="default"
 * >
 *   Save Changes
 * </ActionButton>
 * ```
 */
export const ActionButton: React.FC<ActionButtonProps> = ({
  children,
  isLoading = false,
  loadingText = 'Loading...',
  showSpinner = true,
  disabled,
  ...buttonProps
}) => {
  return (
    <Button {...buttonProps} disabled={disabled || isLoading}>
      {isLoading ? (
        <View className='flex flex-row items-center gap-2'>
          {showSpinner && <Spinner size='small' />}
          <Text className='text-inherit'>{loadingText}</Text>
        </View>
      ) : (
        children
      )}
    </Button>
  );
};
