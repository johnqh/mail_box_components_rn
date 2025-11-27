import * as React from 'react';
import { View, Text } from 'react-native';
import { cn } from '../../lib/utils';

export interface EmptyStateProps {
  /** Icon or illustration to display */
  icon?: React.ReactNode;
  /** Main title */
  title: string;
  /** Description text */
  description?: string;
  /** Action button(s) */
  action?: React.ReactNode;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional className */
  className?: string;
}

/**
 * EmptyState Component
 *
 * Displays a placeholder for empty lists, search results, or content areas.
 * Includes icon, title, description, and optional action button.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon={<InboxIcon className="w-12 h-12" />}
 *   title="No messages"
 *   description="You don't have any messages yet."
 *   action={<Button onPress={handleCompose}>Compose</Button>}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon={<SearchIcon />}
 *   title="No results found"
 *   description="Try adjusting your search or filter to find what you're looking for."
 *   size="sm"
 * />
 * ```
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  size = 'md',
  className,
}) => {
  // Size configurations
  const sizeConfig = {
    sm: {
      container: 'py-6 px-4',
      iconContainer: 'w-10 h-10 mb-3',
      title: 'text-base',
      description: 'text-sm',
    },
    md: {
      container: 'py-10 px-6',
      iconContainer: 'w-14 h-14 mb-4',
      title: 'text-lg',
      description: 'text-base',
    },
    lg: {
      container: 'py-16 px-8',
      iconContainer: 'w-20 h-20 mb-6',
      title: 'text-xl',
      description: 'text-base',
    },
  };

  const config = sizeConfig[size];

  return (
    <View
      className={cn('items-center justify-center', config.container, className)}
      accessibilityRole='none'
    >
      {icon && (
        <View
          className={cn(
            'items-center justify-center',
            config.iconContainer,
            'text-gray-400 dark:text-gray-500'
          )}
        >
          {icon}
        </View>
      )}

      <Text
        className={cn(
          'font-semibold text-gray-900 dark:text-white text-center',
          config.title
        )}
      >
        {title}
      </Text>

      {description && (
        <Text
          className={cn(
            'text-gray-500 dark:text-gray-400 text-center mt-2 max-w-xs',
            config.description
          )}
        >
          {description}
        </Text>
      )}

      {action && <View className='mt-6'>{action}</View>}
    </View>
  );
};
