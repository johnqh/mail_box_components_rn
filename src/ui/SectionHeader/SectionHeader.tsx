import * as React from 'react';
import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { cn } from '../../lib/utils';

export interface SectionHeaderProps {
  /** The header text/title */
  title: string;
  /** Optional callback for the "+" button */
  onAdd?: () => void;
  /** Optional tooltip/title for the add button */
  addButtonLabel?: string;
  /** Optional loading indicator */
  loading?: boolean;
  /** Right side actions/buttons */
  actions?: React.ReactNode;
  /** Additional className */
  className?: string;
}

/**
 * SectionHeader Component
 *
 * A reusable header component for sections with consistent styling.
 * Displays a title and an optional "+" action button.
 *
 * @example
 * ```tsx
 * <SectionHeader title="Emails" />
 * <SectionHeader
 *   title="Email Accounts"
 *   onAdd={handleAdd}
 *   addButtonLabel="Add account"
 * />
 * ```
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  onAdd,
  addButtonLabel = 'Add',
  loading,
  actions,
  className,
}) => {
  return (
    <View
      className={cn(
        'p-4 border-b border-gray-200 dark:border-gray-700',
        className
      )}
    >
      <View className='flex-row items-center justify-between'>
        <Text className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
          {title}
        </Text>
        <View className='flex-row items-center gap-2'>
          {loading && <ActivityIndicator size='small' color='#2563eb' />}
          {actions}
          {onAdd && (
            <Pressable
              onPress={onAdd}
              className='p-2 rounded active:bg-gray-200 dark:active:bg-gray-700'
              accessibilityRole='button'
              accessibilityLabel={addButtonLabel}
            >
              <Text className='text-xl text-gray-600 dark:text-gray-400'>
                +
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
};
