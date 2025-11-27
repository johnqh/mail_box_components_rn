import React from 'react';
import { View, Text, FlatList, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

type MetricColor = 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'gray';

export interface MetricItem {
  value: string | number;
  label: string;
  color?: MetricColor;
  icon?: React.ReactNode;
  trend?: {
    direction: 'up' | 'down';
    value: string;
  };
}

export interface MetricsGridProps extends ViewProps {
  title?: string;
  description?: string;
  metrics: MetricItem[];
  columns?: 2 | 3 | 4;
}

const colorClasses: Record<MetricColor, string> = {
  blue: 'text-blue-600 dark:text-blue-400',
  green: 'text-green-600 dark:text-green-400',
  purple: 'text-purple-600 dark:text-purple-400',
  orange: 'text-orange-600 dark:text-orange-400',
  pink: 'text-pink-600 dark:text-pink-400',
  gray: 'text-gray-600 dark:text-gray-400',
};

interface MetricCardProps {
  metric: MetricItem;
}

const MetricCard: React.FC<MetricCardProps> = ({ metric }) => {
  const colorClass = metric.color ? colorClasses[metric.color] : colorClasses.blue;

  return (
    <View className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 items-center mb-4 mx-2">
      {metric.icon && (
        <View className={cn('mb-4', colorClass)}>{metric.icon}</View>
      )}

      <View className="gap-2 items-center">
        <Text className={cn('text-3xl font-bold', colorClass)}>
          {metric.value}
        </Text>

        <Text className="text-gray-600 dark:text-gray-400 font-medium">
          {metric.label}
        </Text>

        {metric.trend && (
          <Text
            className={cn(
              'text-sm font-semibold',
              metric.trend.direction === 'up'
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            )}
          >
            {metric.trend.direction === 'up' ? '↑' : '↓'} {metric.trend.value}
          </Text>
        )}
      </View>
    </View>
  );
};

/**
 * MetricsGrid component for React Native
 * Grid display of metric cards
 */
export const MetricsGrid: React.FC<MetricsGridProps> = ({
  title,
  description,
  metrics,
  columns = 2,
  className,
  ...props
}) => {
  return (
    <View className={cn('py-8 px-4', className)} {...props}>
      {(title || description) && (
        <View className="items-center mb-8">
          {title && (
            <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
              {title}
            </Text>
          )}
          {description && (
            <Text className="text-lg text-gray-600 dark:text-gray-300 text-center max-w-lg">
              {description}
            </Text>
          )}
        </View>
      )}

      <FlatList
        data={metrics}
        keyExtractor={(_, index) => index.toString()}
        numColumns={columns > 2 ? 2 : columns}
        renderItem={({ item }) => (
          <View className="flex-1">
            <MetricCard metric={item} />
          </View>
        )}
        scrollEnabled={false}
      />
    </View>
  );
};
