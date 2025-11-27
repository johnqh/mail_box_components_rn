import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface SystemStatusIndicatorProps extends ViewProps {
  status: 'operational' | 'degraded' | 'partial' | 'major' | 'maintenance';
  label?: string;
  showPulse?: boolean;
}

const statusConfig = {
  operational: {
    color: 'bg-green-500',
    textColor: 'text-green-700 dark:text-green-400',
    label: 'Operational',
  },
  degraded: {
    color: 'bg-yellow-500',
    textColor: 'text-yellow-700 dark:text-yellow-400',
    label: 'Degraded Performance',
  },
  partial: {
    color: 'bg-orange-500',
    textColor: 'text-orange-700 dark:text-orange-400',
    label: 'Partial Outage',
  },
  major: {
    color: 'bg-red-500',
    textColor: 'text-red-700 dark:text-red-400',
    label: 'Major Outage',
  },
  maintenance: {
    color: 'bg-blue-500',
    textColor: 'text-blue-700 dark:text-blue-400',
    label: 'Under Maintenance',
  },
};

/**
 * System status indicator component for displaying service health
 */
export const SystemStatusIndicator: React.FC<SystemStatusIndicatorProps> = ({
  status,
  label,
  showPulse = true,
  className,
  ...props
}) => {
  const config = statusConfig[status];

  return (
    <View
      className={cn('flex-row items-center gap-2', className)}
      accessibilityRole="text"
      accessibilityLabel={`System status: ${label || config.label}`}
      {...props}
    >
      <View className="relative">
        <View className={cn('w-3 h-3 rounded-full', config.color)} />
        {showPulse && status === 'operational' && (
          <View
            className={cn(
              'absolute inset-0 rounded-full opacity-75',
              config.color
            )}
          />
        )}
      </View>
      <Text className={cn('text-sm font-medium', config.textColor)}>
        {label || config.label}
      </Text>
    </View>
  );
};
