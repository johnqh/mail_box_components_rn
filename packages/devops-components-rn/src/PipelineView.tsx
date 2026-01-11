import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { cn, Card } from '@sudobility/components-rn';

export type PipelineStageStatus =
  | 'pending'
  | 'running'
  | 'success'
  | 'failed'
  | 'skipped'
  | 'cancelled';

export interface PipelineStage {
  id: string;
  name: string;
  status: PipelineStageStatus;
  duration?: number;
  startedAt?: Date;
  finishedAt?: Date;
  jobs?: {
    id: string;
    name: string;
    status: PipelineStageStatus;
  }[];
}

export interface PipelineViewProps {
  stages: PipelineStage[];
  pipelineName?: string;
  pipelineId?: string;
  onStagePress?: (stage: PipelineStage) => void;
  className?: string;
}

const statusConfig: Record<
  PipelineStageStatus,
  { color: string; bgColor: string; darkBgColor: string; borderColor: string; icon: string }
> = {
  pending: {
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-100',
    darkBgColor: 'dark:bg-gray-800',
    borderColor: 'border-gray-300 dark:border-gray-600',
    icon: '○',
  },
  running: {
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100',
    darkBgColor: 'dark:bg-blue-900',
    borderColor: 'border-blue-400 dark:border-blue-500',
    icon: '◐',
  },
  success: {
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100',
    darkBgColor: 'dark:bg-green-900',
    borderColor: 'border-green-400 dark:border-green-500',
    icon: '●',
  },
  failed: {
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-100',
    darkBgColor: 'dark:bg-red-900',
    borderColor: 'border-red-400 dark:border-red-500',
    icon: '✗',
  },
  skipped: {
    color: 'text-gray-400 dark:text-gray-600',
    bgColor: 'bg-gray-50',
    darkBgColor: 'dark:bg-gray-900',
    borderColor: 'border-gray-200 dark:border-gray-700',
    icon: '◌',
  },
  cancelled: {
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-100',
    darkBgColor: 'dark:bg-orange-900',
    borderColor: 'border-orange-400 dark:border-orange-500',
    icon: '⊘',
  },
};

const formatDuration = (seconds: number): string => {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};

export const PipelineView: React.FC<PipelineViewProps> = ({
  stages,
  pipelineName,
  pipelineId,
  onStagePress,
  className,
}) => {
  const overallStatus = stages.some((s) => s.status === 'failed')
    ? 'failed'
    : stages.some((s) => s.status === 'running')
    ? 'running'
    : stages.every((s) => s.status === 'success')
    ? 'success'
    : stages.every((s) => s.status === 'pending')
    ? 'pending'
    : 'running';

  const overallConfig = statusConfig[overallStatus];

  return (
    <Card className={cn('overflow-hidden', className)}>
      {(pipelineName || pipelineId) && (
        <View className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <View className="flex-row items-center justify-between">
            <View>
              {pipelineName && (
                <Text className="text-base font-semibold text-gray-900 dark:text-gray-100">
                  {pipelineName}
                </Text>
              )}
              {pipelineId && (
                <Text className="text-xs font-mono text-gray-500 dark:text-gray-500">
                  #{pipelineId}
                </Text>
              )}
            </View>
            <View
              className={cn(
                'px-2 py-1 rounded-full',
                overallConfig.bgColor,
                overallConfig.darkBgColor
              )}
            >
              <Text className={cn('text-xs font-medium', overallConfig.color)}>
                {overallConfig.icon} {overallStatus.charAt(0).toUpperCase() + overallStatus.slice(1)}
              </Text>
            </View>
          </View>
        </View>
      )}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={{ padding: 16 }}
      >
        <View className="flex-row items-center">
          {stages.map((stage, index) => {
            const config = statusConfig[stage.status];
            const isLast = index === stages.length - 1;

            const stageContent = (
              <View className="items-center">
                <View
                  className={cn(
                    'w-24 p-3 rounded-lg border-2',
                    config.bgColor,
                    config.darkBgColor,
                    config.borderColor
                  )}
                >
                  <View className="items-center">
                    <Text className={cn('text-lg', config.color)}>
                      {config.icon}
                    </Text>
                    <Text
                      className="text-xs font-medium text-gray-900 dark:text-gray-100 mt-1 text-center"
                      numberOfLines={2}
                    >
                      {stage.name}
                    </Text>
                    {stage.duration !== undefined && (
                      <Text className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {formatDuration(stage.duration)}
                      </Text>
                    )}
                  </View>
                </View>
                {stage.jobs && stage.jobs.length > 0 && (
                  <View className="mt-2">
                    <Text className="text-xs text-gray-500 dark:text-gray-500">
                      {stage.jobs.filter((j) => j.status === 'success').length}/{stage.jobs.length} jobs
                    </Text>
                  </View>
                )}
              </View>
            );

            return (
              <View key={stage.id} className="flex-row items-center">
                {onStagePress ? (
                  <Pressable
                    onPress={() => onStagePress(stage)}
                    accessibilityRole="button"
                    accessibilityLabel={`${stage.name} - ${stage.status}`}
                  >
                    {stageContent}
                  </Pressable>
                ) : (
                  stageContent
                )}
                {!isLast && (
                  <View className="mx-2">
                    <View className="w-8 h-0.5 bg-gray-300 dark:bg-gray-600" />
                    <Text className="absolute -top-2 left-2 text-gray-400 dark:text-gray-600">
                      →
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
      <View className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <Text className="text-xs text-gray-500 dark:text-gray-500">
          {stages.length} stages | {stages.filter((s) => s.status === 'success').length} completed
        </Text>
      </View>
    </Card>
  );
};

export default PipelineView;
