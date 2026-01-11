import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { cn, Card } from '@sudobility/components-rn';

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
  { color: string; bgColor: string; darkBgColor: string; label: string; icon: string }
> = {
  pending: {
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-100',
    darkBgColor: 'dark:bg-gray-800',
    label: 'Pending',
    icon: '⏳',
  },
  building: {
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100',
    darkBgColor: 'dark:bg-blue-900',
    label: 'Building',
    icon: '🔨',
  },
  deploying: {
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100',
    darkBgColor: 'dark:bg-purple-900',
    label: 'Deploying',
    icon: '🚀',
  },
  success: {
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100',
    darkBgColor: 'dark:bg-green-900',
    label: 'Success',
    icon: '✓',
  },
  failed: {
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100',
    darkBgColor: 'dark:bg-red-900',
    label: 'Failed',
    icon: '✗',
  },
  cancelled: {
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-100',
    darkBgColor: 'dark:bg-orange-900',
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
      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <View className="flex-row items-center">
            <View
              className={cn(
                'px-2 py-1 rounded-md mr-2',
                config.bgColor,
                config.darkBgColor
              )}
            >
              <Text className={cn('text-xs font-medium', config.color)}>
                {config.icon} {config.label}
              </Text>
            </View>
            <View className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md">
              <Text className="text-xs font-medium text-gray-700 dark:text-gray-300">
                {environment}
              </Text>
            </View>
          </View>
          <Text className="mt-2 text-base font-semibold text-gray-900 dark:text-gray-100">
            {version}
          </Text>
          {commitHash && (
            <Text className="mt-1 text-sm font-mono text-gray-600 dark:text-gray-400">
              {commitHash.substring(0, 7)}
            </Text>
          )}
          {commitMessage && (
            <Text
              className="mt-1 text-sm text-gray-600 dark:text-gray-400"
              numberOfLines={2}
            >
              {commitMessage}
            </Text>
          )}
        </View>
      </View>
      <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        <Text className="text-xs text-gray-500 dark:text-gray-500">
          {timestamp.toLocaleString()}
        </Text>
        {duration !== undefined && (
          <Text className="text-xs text-gray-500 dark:text-gray-500">
            Duration: {formatDuration(duration)}
          </Text>
        )}
      </View>
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

export default DeploymentStatus;
