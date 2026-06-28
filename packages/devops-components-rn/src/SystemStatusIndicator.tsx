import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { cn, Card } from '@sudobility/components-rn';
import { getStatusIndicatorColor, textVariants } from '@sudobility/design';

export type SystemStatus = 'operational' | 'degraded' | 'major-outage';

export interface SystemStatusIndicatorProps {
  status: SystemStatus;
  systemName: string;
  description?: string;
  lastChecked?: Date;
  onPress?: () => void;
  className?: string;
}

const statusConfig: Record<SystemStatus, { dotColor: string; label: string }> =
  {
    operational: {
      dotColor: getStatusIndicatorColor('success'),
      label: 'Operational',
    },
    degraded: {
      dotColor: getStatusIndicatorColor('warning'),
      label: 'Degraded',
    },
    'major-outage': {
      dotColor: getStatusIndicatorColor('error'),
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
      <View className='flex-row items-center'>
        <View className={cn('w-3 h-3 rounded-full mr-3', config.dotColor)} />
        <View className='flex-1'>
          <Text className={textVariants.body.strong.md()}>{systemName}</Text>
          <Text
            className={cn(
              'text-sm',
              status === 'operational' && 'text-success',
              status === 'degraded' && 'text-warning',
              status === 'major-outage' && 'text-destructive'
            )}
          >
            {config.label}
          </Text>
        </View>
      </View>
      {description && (
        <Text className={cn(textVariants.body.sm(), 'mt-2')}>
          {description}
        </Text>
      )}
      {lastChecked && (
        <Text className={cn(textVariants.caption.default(), 'mt-2')}>
          Last checked: {lastChecked.toLocaleString()}
        </Text>
      )}
    </Card>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} accessibilityRole='button'>
        {content}
      </Pressable>
    );
  }

  return content;
};

export default SystemStatusIndicator;
