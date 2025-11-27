import * as React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { cn } from '../../lib/utils';

export interface PageSectionHeaderProps {
  /** Section title */
  title: string;
  /** Optional subtitle/description */
  description?: string;
  /** Item count to display */
  count?: number;
  /** Count label (e.g., "items", "templates") */
  countLabel?: string;
  /** Action button(s) */
  action?: React.ReactNode;
  /** Show loading indicator */
  loading?: boolean;
  /** Loading text */
  loadingText?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional className */
  className?: string;
}

/**
 * PageSectionHeader Component
 *
 * A flexible header for page sections with title, description, count, and actions.
 * Commonly used at the top of content sections to provide context and actions.
 *
 * @example
 * ```tsx
 * <PageSectionHeader
 *   title="Templates"
 *   count={templates.length}
 *   action={<Button onPress={handleAdd}>Add Template</Button>}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <PageSectionHeader
 *   title="Email Filters"
 *   description="Manage your email filtering rules"
 *   count={12}
 *   countLabel="filters"
 *   loading={isRefreshing}
 * />
 * ```
 */
export const PageSectionHeader: React.FC<PageSectionHeaderProps> = ({
  title,
  description,
  count,
  countLabel,
  action,
  loading = false,
  loadingText = 'Loading...',
  size = 'md',
  className,
}) => {
  // Size configurations
  const sizeClasses = {
    sm: {
      title: 'text-lg font-semibold',
      description: 'text-sm',
      count: 'text-xs',
    },
    md: {
      title: 'text-xl font-semibold',
      description: 'text-base',
      count: 'text-sm',
    },
    lg: {
      title: 'text-2xl font-bold',
      description: 'text-lg',
      count: 'text-base',
    },
  };

  const sizeConfig = sizeClasses[size];

  return (
    <View
      className={cn('flex-row items-start justify-between gap-4', className)}
    >
      <View className='flex-1'>
        <View className='flex-row items-center gap-3 flex-wrap'>
          <Text
            className={cn(sizeConfig.title, 'text-gray-900 dark:text-gray-100')}
          >
            {title}
          </Text>

          {count !== undefined && (
            <Text
              className={cn(
                sizeConfig.count,
                'text-gray-500 dark:text-gray-400'
              )}
            >
              ({count}
              {countLabel && ` ${countLabel}`})
            </Text>
          )}

          {loading && (
            <View className='flex-row items-center gap-2'>
              <ActivityIndicator size='small' color='#3b82f6' />
              <Text
                className={cn(
                  sizeConfig.count,
                  'text-gray-500 dark:text-gray-400'
                )}
              >
                {loadingText}
              </Text>
            </View>
          )}
        </View>

        {description && (
          <Text
            className={cn(
              sizeConfig.description,
              'mt-1 text-gray-600 dark:text-gray-400'
            )}
          >
            {description}
          </Text>
        )}
      </View>

      {action && <View>{action}</View>}
    </View>
  );
};
