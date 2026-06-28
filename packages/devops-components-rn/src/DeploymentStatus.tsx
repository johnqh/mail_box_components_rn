import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { cn, Card } from '@sudobility/components-rn';
import { colors, textVariants } from '@sudobility/design';

export type DeploymentState =
  | 'pending'
  | 'building'
  | 'deploying'
  | 'success'
  | 'failed'
  | 'cancelled';

export interface DeploymentStatusProps {
  state: DeploymentState;
  environment: string;
  version: string;
  timestamp: Date;
  commitHash?: string;
  commitMessage?: string;
  duration?: number;
  onPress?: () => void;
  className?: string;
}

const stateConfig: Record<
  DeploymentState,
  {
    color: string;
    badge: string;
    label: string;
    icon: string;
  }
> = {
  pending: {
    color: 'text-muted-foreground',
    badge: `${colors.component.badge.default.base} ${colors.component.badge.default.dark}`,
    label: 'Pending',
    icon: '⏳',
  },
  building: {
    color: `${colors.component.alert.info.icon}`,
    badge: `${colors.component.badge.primary.base} ${colors.component.badge.primary.dark}`,
    label: 'Building',
    icon: '🔨',
  },
  deploying: {
    color: 'text-accent-foreground',
    badge: 'bg-accent text-accent-foreground  ',
    label: 'Deploying',
    icon: '🚀',
  },
  success: {
    color: `${colors.component.alert.success.icon}`,
    badge: `${colors.component.badge.success.base} ${colors.component.badge.success.dark}`,
    label: 'Success',
    icon: '✓',
  },
  failed: {
    color: `${colors.component.alert.error.icon}`,
    badge: `${colors.component.badge.error.base} ${colors.component.badge.error.dark}`,
    label: 'Failed',
    icon: '✗',
  },
  cancelled: {
    color: `${colors.component.alert.warning.icon}`,
    badge: `${colors.component.badge.warning.base} ${colors.component.badge.warning.dark}`,
    label: 'Cancelled',
    icon: '⊘',
  },
};

const formatDuration = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  if (minutes < 60) return `${minutes}m ${remainingSeconds}s`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}m`;
};

export const DeploymentStatus: React.FC<DeploymentStatusProps> = ({
  state,
  environment,
  version,
  timestamp,
  commitHash,
  commitMessage,
  duration,
  onPress,
  className,
}) => {
  const config = stateConfig[state];

  const content = (
    <Card className={cn('p-4', className)}>
      <View className='flex-row items-start justify-between'>
        <View className='flex-1'>
          <View className='flex-row items-center'>
            <View className={cn('px-2 py-1 rounded-md mr-2', config.badge)}>
              <Text className={cn('text-xs font-medium', config.color)}>
                {config.icon} {config.label}
              </Text>
            </View>
            <View className='bg-muted px-2 py-1 rounded-md'>
              <Text className='text-xs font-medium text-muted-foreground'>
                {environment}
              </Text>
            </View>
          </View>
          <Text className={cn(textVariants.body.strong.md(), 'mt-2')}>
            {version}
          </Text>
          {commitHash && (
            <Text className='mt-1 text-sm font-mono text-muted-foreground'>
              {commitHash.substring(0, 7)}
            </Text>
          )}
          {commitMessage && (
            <Text
              className='mt-1 text-sm text-muted-foreground'
              numberOfLines={2}
            >
              {commitMessage}
            </Text>
          )}
        </View>
      </View>
      <View className='flex-row items-center justify-between mt-3 pt-3 border-t border-border'>
        <Text className={textVariants.caption.default()}>
          {timestamp.toLocaleString()}
        </Text>
        {duration !== undefined && (
          <Text className={textVariants.caption.default()}>
            Duration: {formatDuration(duration)}
          </Text>
        )}
      </View>
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

export default DeploymentStatus;
