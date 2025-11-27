import * as React from 'react';
import { View, Text } from 'react-native';
import { cn } from '../../lib/utils';

export interface DashboardStatCardProps {
  /** Stat title */
  title: string;
  /** Stat value */
  value: string | number;
  /** Change percentage */
  change?: number;
  /** Change period description */
  changePeriod?: string;
  /** Icon element */
  icon?: React.ReactNode;
  /** Color variant */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  /** Additional className */
  className?: string;
}

/**
 * DashboardStatCard Component
 *
 * Statistics display card for dashboards.
 * Shows value, change indicator, and optional icon.
 *
 * @example
 * ```tsx
 * <DashboardStatCard
 *   title="Total Revenue"
 *   value="$45,231"
 *   change={12.5}
 *   changePeriod="vs last month"
 *   variant="success"
 * />
 * ```
 */
export const DashboardStatCard: React.FC<DashboardStatCardProps> = ({
  title,
  value,
  change,
  changePeriod = 'vs last period',
  icon,
  variant = 'default',
  className,
}) => {
  const variantClasses = {
    default: 'bg-white dark:bg-gray-900',
    primary: 'bg-blue-50 dark:bg-blue-900/20',
    success: 'bg-green-50 dark:bg-green-900/20',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20',
    danger: 'bg-red-50 dark:bg-red-900/20',
  };

  const isPositive = change !== undefined && change >= 0;

  return (
    <View
      className={cn(
        'rounded-lg border border-gray-200 dark:border-gray-700 p-6',
        variantClasses[variant],
        className
      )}
    >
      {/* Header */}
      <View className='flex-row items-start justify-between mb-2'>
        <Text className='text-sm font-medium text-gray-600 dark:text-gray-400'>
          {title}
        </Text>
        {icon && (
          <View className='text-gray-400 dark:text-gray-600'>{icon}</View>
        )}
      </View>

      {/* Value */}
      <Text className='text-3xl font-bold text-gray-900 dark:text-white'>
        {value}
      </Text>

      {/* Change indicator */}
      {change !== undefined && (
        <View className='flex-row items-center gap-1 mt-2'>
          <Text
            className={cn(
              'text-sm font-medium',
              isPositive
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            )}
          >
            {isPositive ? '↑' : '↓'} {Math.abs(change)}%
          </Text>
          <Text className='text-xs text-gray-500 dark:text-gray-400'>
            {changePeriod}
          </Text>
        </View>
      )}
    </View>
  );
};
