import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { cn, Card } from '@sudobility/components-rn';

export interface Metric {
  id: string;
  label: string;
  value: number | string;
  unit?: string;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
}

export interface MetricsGridProps {
  metrics: Metric[];
  columns?: 1 | 2 | 3 | 4;
  onMetricPress?: (metric: Metric) => void;
  className?: string;
}

const formatChange = (change: number): string => {
  const sign = change >= 0 ? '+' : '';
  return sign + change.toFixed(1) + '%';
};

export const MetricsGrid: React.FC<MetricsGridProps> = ({
  metrics,
  columns = 2,
  onMetricPress,
  className,
}) => {
  const columnWidthClass = {
    1: 'w-full',
    2: 'w-1/2',
    3: 'w-1/3',
    4: 'w-1/4',
  }[columns];

  return (
    <View className={cn('flex-row flex-wrap -m-1', className)}>
      {metrics.map((metric) => {
        const content = (
          <Card className="p-4 m-1 flex-1">
            <View className="flex-row items-start justify-between">
              <View className="flex-1">
                <Text className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {metric.label}
                </Text>
                <View className="flex-row items-baseline">
                  <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {metric.value}
                  </Text>
                  {metric.unit && (
                    <Text className="text-sm text-gray-500 dark:text-gray-500 ml-1">
                      {metric.unit}
                    </Text>
                  )}
                </View>
                {metric.change !== undefined && (
                  <View className="flex-row items-center mt-2">
                    <View
                      className={cn(
                        'px-1.5 py-0.5 rounded',
                        metric.change >= 0
                          ? 'bg-green-100 dark:bg-green-900'
                          : 'bg-red-100 dark:bg-red-900'
                      )}
                    >
                      <Text
                        className={cn(
                          'text-xs font-medium',
                          metric.change >= 0
                            ? 'text-green-700 dark:text-green-300'
                            : 'text-red-700 dark:text-red-300'
                        )}
                      >
                        {formatChange(metric.change)}
                      </Text>
                    </View>
                    {metric.changeLabel && (
                      <Text className="text-xs text-gray-500 dark:text-gray-500 ml-2">
                        {metric.changeLabel}
                      </Text>
                    )}
                  </View>
                )}
              </View>
              {metric.icon && (
                <View className="ml-2">{metric.icon}</View>
              )}
            </View>
          </Card>
        );

        if (onMetricPress) {
          return (
            <View key={metric.id} className={columnWidthClass}>
              <Pressable
                onPress={() => onMetricPress(metric)}
                accessibilityRole="button"
                accessibilityLabel={metric.label + ': ' + metric.value + (metric.unit || '')}
              >
                {content}
              </Pressable>
            </View>
          );
        }

        return (
          <View key={metric.id} className={columnWidthClass}>
            {content}
          </View>
        );
      })}
    </View>
  );
};

export default MetricsGrid;
