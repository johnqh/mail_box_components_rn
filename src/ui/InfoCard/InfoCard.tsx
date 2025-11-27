import * as React from 'react';
import { View, Text } from 'react-native';
import { cn } from '../../lib/utils';

export interface InfoCardProps {
  /** Card title */
  title?: string;
  /** Card content */
  children: React.ReactNode;
  /** Color variant */
  variant?: 'info' | 'success' | 'warning' | 'error' | 'neutral';
  /** Size variant */
  size?: 'sm' | 'default' | 'lg';
  /** Additional className */
  className?: string;
}

/**
 * InfoCard Component
 *
 * Simple informational card with color variants.
 *
 * @example
 * ```tsx
 * <InfoCard title="Note" variant="info">
 *   This is important information.
 * </InfoCard>
 * ```
 */
export const InfoCard: React.FC<InfoCardProps> = ({
  title,
  children,
  variant = 'info',
  size = 'default',
  className,
}) => {
  const variantClasses = {
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
    sm: 'p-4',
    default: 'p-6',
    lg: 'p-8',
  };

  const titleColorClasses = {
    info: 'text-blue-900 dark:text-blue-300',
    success: 'text-green-900 dark:text-green-300',
    warning: 'text-yellow-900 dark:text-yellow-300',
    error: 'text-red-900 dark:text-red-300',
    neutral: 'text-gray-900 dark:text-gray-300',
  };

  const contentColorClasses = {
    info: 'text-blue-800 dark:text-blue-400',
    success: 'text-green-800 dark:text-green-400',
    warning: 'text-yellow-800 dark:text-yellow-400',
    error: 'text-red-800 dark:text-red-400',
    neutral: 'text-gray-800 dark:text-gray-400',
  };

  const titleSizeClasses = {
    sm: 'text-base',
    default: 'text-lg',
    lg: 'text-xl',
  };

  const contentSizeClasses = {
    sm: 'text-sm',
    default: 'text-base',
    lg: 'text-lg',
  };

  return (
    <View
      className={cn(
        'rounded-lg',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {title && (
        <Text
          className={cn(
            'font-semibold mb-2',
            titleSizeClasses[size],
            titleColorClasses[variant]
          )}
        >
          {title}
        </Text>
      )}
      {typeof children === 'string' ? (
        <Text
          className={cn(contentSizeClasses[size], contentColorClasses[variant])}
        >
          {children}
        </Text>
      ) : (
        <View className={contentColorClasses[variant]}>{children}</View>
      )}
    </View>
  );
};
