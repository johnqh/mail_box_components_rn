import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { cn, Card } from '@sudobility/components-rn';
import { colors, textVariants } from '@sudobility/design';

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
      {metrics.map(metric => {
        const content = (
          <Card className='p-4 m-1 flex-1'>
            <View className='flex-row items-start justify-between'>
              <View className='flex-1'>
                <Text className={cn(textVariants.body.sm(), 'mb-1')}>
                  {metric.label}
                </Text>
                <View className='flex-row items-baseline'>
                  <Text className={textVariants.heading.h3()}>
                    {metric.value}
                  </Text>
                  {metric.unit && (
                    <Text className={cn(textVariants.caption.default(), 'ml-1')}>
                      {metric.unit}
                    </Text>
                  )}
                </View>
                {metric.change !== undefined && (
                  <View className='flex-row items-center mt-2'>
                    <View
                      className={cn(
                        'px-1.5 py-0.5 rounded',
                        metric.change >= 0
                          ? `${colors.component.badge.success.base} ${colors.component.badge.success.dark}`
                          : `${colors.component.badge.error.base} ${colors.component.badge.error.dark}`
                      )}
                    >
                      <Text className='text-xs font-medium'>
                        {formatChange(metric.change)}
                      </Text>
                    </View>
                    {metric.changeLabel && (
                      <Text className='text-xs text-muted-foreground ml-2'>
                        {metric.changeLabel}
                      </Text>
                    )}
                  </View>
                )}
              </View>
              {metric.icon && <View className='ml-2'>{metric.icon}</View>}
            </View>
          </Card>
        );

        if (onMetricPress) {
          return (
            <View key={metric.id} className={columnWidthClass}>
              <Pressable
                onPress={() => onMetricPress(metric)}
                accessibilityRole='button'
                accessibilityLabel={
                  metric.label + ': ' + metric.value + (metric.unit || '')
                }
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
