import * as React from 'react';
import { View, Text } from 'react-native';
import { cn } from '../../lib/utils';

export interface PageHeaderProps {
  /** Page title */
  title?: string;
  /** Page description */
  description?: string;
  /** Additional className */
  className?: string;
}

/**
 * PageHeader Component
 *
 * Simple page header with title and description.
 *
 * @example
 * ```tsx
 * <PageHeader
 *   title="Dashboard"
 *   description="Welcome back! Here's your overview."
 * />
 * ```
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  className,
}) => {
  return (
    <View className={cn('mb-8', className)}>
      {title && (
        <Text className='text-3xl font-bold text-gray-900 dark:text-white'>
          {title}
        </Text>
      )}
      {description && (
        <Text className='mt-2 text-gray-600 dark:text-gray-400'>
          {description}
        </Text>
      )}
    </View>
  );
};
