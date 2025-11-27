import * as React from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { cn } from '../../lib/utils';

export interface ListItemWithActionProps {
  /** Main content/text to display */
  children: React.ReactNode;
  /** Action to perform */
  onAction: () => void;
  /** Action button text */
  actionText?: string;
  /** Action button icon */
  actionIcon?: React.ReactNode;
  /** Whether the action is destructive */
  destructive?: boolean;
  /** Whether the action is in progress */
  isProcessing?: boolean;
  /** Variant of the list item */
  variant?: 'default' | 'compact' | 'elevated';
  /** Additional className */
  className?: string;
}

/**
 * ListItemWithAction Component
 *
 * Displays a list item with an action button (typically remove/delete).
 * Commonly used for managing lists of items with actions.
 *
 * @example
 * ```tsx
 * <ListItemWithAction
 *   onAction={() => handleRemove(item.id)}
 *   actionText="Remove"
 *   destructive
 *   isProcessing={isDeleting}
 * >
 *   user@example.com
 * </ListItemWithAction>
 * ```
 */
export const ListItemWithAction: React.FC<ListItemWithActionProps> = ({
  children,
  onAction,
  actionText = 'Remove',
  actionIcon,
  destructive = true,
  isProcessing = false,
  variant = 'default',
  className,
}) => {
  const variantClasses = {
    default: 'bg-gray-50 dark:bg-gray-700',
    compact: 'bg-gray-50 dark:bg-gray-700 py-2 px-3',
    elevated:
      'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm',
  };

  return (
    <View
      className={cn(
        'flex-row items-center justify-between p-4 rounded-lg',
        variantClasses[variant],
        className
      )}
    >
      <View className='flex-1 mr-4'>
        {typeof children === 'string' ? (
          <Text className='text-sm text-gray-900 dark:text-white'>
            {children}
          </Text>
        ) : (
          children
        )}
      </View>

      <Pressable
        onPress={onAction}
        disabled={isProcessing}
        className={cn(
          'flex-row items-center px-3 py-1.5 rounded-md',
          destructive
            ? 'active:bg-red-50 dark:active:bg-red-900/20'
            : 'bg-gray-100 dark:bg-gray-600 active:bg-gray-200 dark:active:bg-gray-500',
          isProcessing && 'opacity-50'
        )}
        accessibilityRole='button'
        accessibilityLabel={actionText}
        accessibilityState={{ disabled: isProcessing }}
      >
        {isProcessing ? (
          <ActivityIndicator
            size='small'
            color={destructive ? '#dc2626' : '#6b7280'}
          />
        ) : (
          <>
            {actionIcon && <View className='mr-1'>{actionIcon}</View>}
            <Text
              className={cn(
                'text-sm font-medium',
                destructive
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-gray-700 dark:text-gray-300'
              )}
            >
              {actionText}
            </Text>
          </>
        )}
      </Pressable>
    </View>
  );
};
