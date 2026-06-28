import * as React from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { cn } from '../../lib/utils';
import { colors } from '@sudobility/design';

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
    default: 'bg-muted dark:bg-muted',
    compact: 'bg-muted dark:bg-muted py-2 px-3',
    elevated: 'bg-card border border-border shadow-sm',
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
          <Text className='text-sm text-foreground'>{children}</Text>
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
            ? 'active:bg-destructive/10 '
            : 'bg-muted dark:bg-muted active:bg-muted dark:active:bg-muted0',
          isProcessing && 'opacity-50'
        )}
        accessibilityRole='button'
        accessibilityLabel={actionText}
        accessibilityState={{ disabled: isProcessing }}
      >
        {isProcessing ? (
          <ActivityIndicator
            size='small'
            color={destructive ? colors.raw.red[600] : colors.raw.neutral[500]}
          />
        ) : (
          <>
            {actionIcon && <View className='mr-1'>{actionIcon}</View>}
            <Text
              className={cn(
                'text-sm font-medium',
                destructive ? 'text-destructive' : 'text-muted-foreground'
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
