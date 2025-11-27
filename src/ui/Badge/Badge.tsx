import * as React from 'react';
import { View, Text, Pressable } from 'react-native';
import { cn } from '../../lib/utils';

export interface BadgeProps {
  /** Badge content */
  children?: React.ReactNode;
  /** Color variant */
  variant?:
    | 'default'
    | 'primary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'purple';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Icon to display */
  icon?: React.ReactNode;
  /** Show dot indicator */
  dot?: boolean;
  /** Render as pill (rounded-full) */
  pill?: boolean;
  /** Render as outline style */
  outline?: boolean;
  /** Press handler */
  onPress?: () => void;
  /** Dismissible badge with close button */
  dismissible?: boolean;
  /** Dismiss handler */
  onDismiss?: () => void;
  /** Count to display */
  count?: number;
  /** Max count before showing "+" */
  maxCount?: number;
  /** Additional className */
  className?: string;
}

/**
 * Badge Component
 *
 * Small status or label component for displaying metadata, status, or categories.
 * Commonly used for tags, statuses, counts, and labels.
 *
 * @example
 * ```tsx
 * <Badge variant="success">Active</Badge>
 * <Badge variant="primary" size="sm">New</Badge>
 * <Badge variant="warning" dot>Pending</Badge>
 * ```
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  icon,
  dot = false,
  pill = false,
  outline = false,
  onPress,
  dismissible = false,
  onDismiss,
  count,
  maxCount,
  className,
}) => {
  // Color variant configurations for filled style
  const variantClasses = {
    default: 'bg-gray-100 dark:bg-gray-700',
    primary: 'bg-blue-100 dark:bg-blue-900/30',
    success: 'bg-green-100 dark:bg-green-900/30',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30',
    danger: 'bg-red-100 dark:bg-red-900/30',
    info: 'bg-blue-100 dark:bg-blue-900/30',
    purple: 'bg-purple-100 dark:bg-purple-900/30',
  };

  const variantTextClasses = {
    default: 'text-gray-800 dark:text-gray-300',
    primary: 'text-blue-800 dark:text-blue-400',
    success: 'text-green-800 dark:text-green-400',
    warning: 'text-yellow-800 dark:text-yellow-400',
    danger: 'text-red-800 dark:text-red-400',
    info: 'text-blue-800 dark:text-blue-400',
    purple: 'text-purple-800 dark:text-purple-400',
  };

  // Color variant configurations for outline style
  const outlineClasses = {
    default: 'border border-gray-300 dark:border-gray-600',
    primary: 'border border-blue-600 dark:border-blue-400',
    success: 'border border-green-600 dark:border-green-400',
    warning: 'border border-yellow-600 dark:border-yellow-400',
    danger: 'border border-red-600 dark:border-red-400',
    info: 'border border-blue-600 dark:border-blue-400',
    purple: 'border border-purple-600 dark:border-purple-400',
  };

  const outlineTextClasses = {
    default: 'text-gray-700 dark:text-gray-300',
    primary: 'text-blue-600 dark:text-blue-400',
    success: 'text-green-600 dark:text-green-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    danger: 'text-red-600 dark:text-red-400',
    info: 'text-blue-600 dark:text-blue-400',
    purple: 'text-purple-600 dark:text-purple-400',
  };

  // Size configurations
  const sizeClasses = {
    sm: 'px-2 py-0.5',
    md: 'px-2.5 py-1',
    lg: 'px-3 py-1.5',
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  // Dot color configurations
  const dotColorClasses = {
    default: 'bg-gray-600 dark:bg-gray-400',
    primary: 'bg-blue-600 dark:bg-blue-400',
    success: 'bg-green-600 dark:bg-green-400',
    warning: 'bg-yellow-600 dark:bg-yellow-400',
    danger: 'bg-red-600 dark:bg-red-400',
    info: 'bg-blue-600 dark:bg-blue-400',
    purple: 'bg-purple-600 dark:bg-purple-400',
  };

  // Format count display
  const displayCount =
    count !== undefined
      ? maxCount !== undefined && count > maxCount
        ? `${maxCount}+`
        : count.toString()
      : null;

  const containerClasses = cn(
    'flex flex-row items-center',
    outline ? outlineClasses[variant] : variantClasses[variant],
    sizeClasses[size],
    pill ? 'rounded-full' : 'rounded',
    className
  );

  const textClasses = cn(
    textSizeClasses[size],
    'font-medium',
    outline ? outlineTextClasses[variant] : variantTextClasses[variant]
  );

  const content = (
    <>
      {dot && (
        <View
          className={cn(
            'w-2 h-2 rounded-full mr-1.5',
            dotColorClasses[variant]
          )}
        />
      )}
      {icon && <View className='mr-1'>{icon}</View>}
      {children && <Text className={textClasses}>{children}</Text>}
      {displayCount && (
        <Text className={cn(textClasses, 'ml-1')}>{displayCount}</Text>
      )}
      {dismissible && onDismiss && (
        <Pressable
          onPress={onDismiss}
          className='ml-1 p-0.5'
          accessibilityRole='button'
          accessibilityLabel='Dismiss'
        >
          <Text className={textClasses}>×</Text>
        </Pressable>
      )}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className={containerClasses}
        accessibilityRole='button'
      >
        {content}
      </Pressable>
    );
  }

  return <View className={containerClasses}>{content}</View>;
};
