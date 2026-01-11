import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { cn, Card } from '@sudobility/components-rn';

export type SystemStatus = 'operational' | 'degraded' | 'major-outage';

export interface SystemStatusIndicatorProps {
  status: SystemStatus;
  systemName: string;
  description?: string;
  lastChecked?: Date;
  onPress?: () => void;
  className?: string;
}

const statusConfig: Record<SystemStatus, { color: string; darkColor: string; label: string }> = {
  operational: {
    color: 'bg-green-500',
    darkColor: 'dark:bg-green-400',
    label: 'Operational',
  },
  degraded: {
    color: 'bg-yellow-500',
    darkColor: 'dark:bg-yellow-400',
    label: 'Degraded',
  },
  'major-outage': {
    color: 'bg-red-500',
    darkColor: 'dark:bg-red-400',
    label: 'Major Outage',
  },
};

export const SystemStatusIndicator: React.FC<SystemStatusIndicatorProps> = ({
  status,
  systemName,
  description,
  lastChecked,
  onPress,
  className,
}) => {
  const config = statusConfig[status];

  const content = (
    <Card className={cn('p-4', className)}>
      <View className="flex-row items-center">
        <View
          className={cn(
            'w-3 h-3 rounded-full mr-3',
            config.color,
            config.darkColor
          )}
        />
        <View className="flex-1">
          <Text className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {systemName}
          </Text>
          <Text
            className={cn(
              'text-sm',
              status === 'operational' && 'text-green-600 dark:text-green-400',
              status === 'degraded' && 'text-yellow-600 dark:text-yellow-400',
              status === 'major-outage' && 'text-red-600 dark:text-red-400'
            )}
          >
            {config.label}
          </Text>
        </View>
      </View>
      {description && (
        <Text className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          {description}
        </Text>
      )}
      {lastChecked && (
        <Text className="mt-2 text-xs text-gray-500 dark:text-gray-500">
          Last checked: {lastChecked.toLocaleString()}
        </Text>
      )}
    </Card>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} accessibilityRole="button">
        {content}
      </Pressable>
    );
  }

  return content;
};

export default SystemStatusIndicator;
