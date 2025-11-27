import * as React from 'react';
import { View, Text } from 'react-native';
import { cn } from '../../lib/utils';

export interface CalloutBoxProps {
  /** Callout title */
  title?: string;
  /** Icon element */
  icon?: React.ReactNode;
  /** Callout content */
  children: React.ReactNode;
  /** Color variant */
  variant?: 'gradient' | 'info' | 'success' | 'warning' | 'error' | 'neutral';
  /** Size variant */
  size?: 'sm' | 'default' | 'lg';
  /** Center content */
  centered?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * CalloutBox Component
 *
 * Highlighted box for important information, tips, or warnings.
 *
 * @example
 * ```tsx
 * <CalloutBox
 *   title="Pro Tip"
 *   icon={<LightbulbIcon />}
 *   variant="info"
 * >
 *   This is a helpful tip for users.
 * </CalloutBox>
 * ```
 */
export const CalloutBox: React.FC<CalloutBoxProps> = ({
  title,
  icon,
  children,
  variant = 'gradient',
  size = 'default',
  centered = false,
  className,
}) => {
  const variantClasses = {
    gradient:
      'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800',
    info: 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800',
    success:
      'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800',
    warning:
      'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800',
    error:
      'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800',
    neutral:
      'bg-gray-50 dark:bg-gray-900/20 border border-gray-200 dark:border-gray-800',
  };

  const sizeClasses = {
    sm: 'p-4 rounded-lg',
    default: 'p-6 rounded-xl',
    lg: 'p-8 rounded-2xl',
  };

  const titleColorClasses = {
    gradient: 'text-green-600 dark:text-green-400',
    info: 'text-blue-600 dark:text-blue-400',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    error: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-900 dark:text-white',
  };

  const titleSizeClasses = {
    sm: 'text-lg',
    default: 'text-xl',
    lg: 'text-2xl',
  };

  const contentSizeClasses = {
    sm: 'text-sm',
    default: 'text-base',
    lg: 'text-lg',
  };

  return (
    <View className={cn(variantClasses[variant], sizeClasses[size], className)}>
      <View className={cn('gap-4', centered && 'items-center')}>
        {/* Icon */}
        {icon && (
          <View className={centered ? 'items-center' : 'items-start'}>
            {icon}
          </View>
        )}

        {/* Title */}
        {title && (
          <Text
            className={cn(
              'font-bold mb-2',
              titleSizeClasses[size],
              titleColorClasses[variant],
              centered && 'text-center'
            )}
          >
            {title}
          </Text>
        )}

        {/* Content */}
        <View>
          {typeof children === 'string' ? (
            <Text
              className={cn(
                'text-gray-600 dark:text-gray-400',
                contentSizeClasses[size],
                centered && 'text-center'
              )}
            >
              {children}
            </Text>
          ) : (
            children
          )}
        </View>
      </View>
    </View>
  );
};
