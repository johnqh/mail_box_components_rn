import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { cn, Card } from '@sudobility/components-rn';
import { colors, textVariants } from '@sudobility/design';

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
  {
    color: string;
    badge: string;
    borderColor: string;
    icon: string;
  }
> = {
  pending: {
    color: 'text-muted-foreground',
    badge: `${colors.component.badge.default.base} ${colors.component.badge.default.dark}`,
    borderColor: 'border-border',
    icon: '○',
  },
  running: {
    color: `${colors.component.alert.info.icon}`,
    badge: `${colors.component.badge.primary.base} ${colors.component.badge.primary.dark}`,
    borderColor: 'border-primary dark:border-primary',
    icon: '◐',
  },
  success: {
    color: `${colors.component.alert.success.icon}`,
    badge: `${colors.component.badge.success.base} ${colors.component.badge.success.dark}`,
    borderColor: 'border-success dark:border-success',
    icon: '●',
  },
  failed: {
    color: `${colors.component.alert.error.icon}`,
    badge: `${colors.component.badge.error.base} ${colors.component.badge.error.dark}`,
    borderColor: 'border-destructive dark:border-destructive',
    icon: '✗',
  },
  skipped: {
    color: 'text-muted-foreground',
    badge:
      'bg-muted text-muted-foreground dark:bg-popover dark:text-muted-foreground',
    borderColor: 'border-border',
    icon: '◌',
  },
  cancelled: {
    color: `${colors.component.alert.warning.icon}`,
    badge: `${colors.component.badge.warning.base} ${colors.component.badge.warning.dark}`,
    borderColor: 'border-warning ',
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
  const overallStatus = stages.some(s => s.status === 'failed')
    ? 'failed'
    : stages.some(s => s.status === 'running')
      ? 'running'
      : stages.every(s => s.status === 'success')
        ? 'success'
        : stages.every(s => s.status === 'pending')
          ? 'pending'
          : 'running';

  const overallConfig = statusConfig[overallStatus];

  return (
    <Card className={cn('overflow-hidden', className)}>
      {(pipelineName || pipelineId) && (
        <View className='px-4 py-3 border-b border-border'>
          <View className='flex-row items-center justify-between'>
            <View>
              {pipelineName && (
                <Text className={textVariants.label.default()}>
                  {pipelineName}
                </Text>
              )}
              {pipelineId && (
                <Text className='text-xs font-mono text-muted-foreground'>
                  #{pipelineId}
                </Text>
              )}
            </View>
            <View className={cn('px-2 py-1 rounded-full', overallConfig.badge)}>
              <Text className={cn('text-xs font-medium', overallConfig.color)}>
                {overallConfig.icon}{' '}
                {overallStatus.charAt(0).toUpperCase() + overallStatus.slice(1)}
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
        <View className='flex-row items-center'>
          {stages.map((stage, index) => {
            const config = statusConfig[stage.status];
            const isLast = index === stages.length - 1;

            const stageContent = (
              <View className='items-center'>
                <View
                  className={cn(
                    'w-24 p-3 rounded-lg border-2',
                    config.badge,
                    config.borderColor
                  )}
                >
                  <View className='items-center'>
                    <Text className={cn('text-lg', config.color)}>
                      {config.icon}
                    </Text>
                    <Text
                      className='text-xs font-medium text-foreground mt-1 text-center'
                      numberOfLines={2}
                    >
                      {stage.name}
                    </Text>
                    {stage.duration !== undefined && (
                      <Text className='text-xs text-muted-foreground mt-1'>
                        {formatDuration(stage.duration)}
                      </Text>
                    )}
                  </View>
                </View>
                {stage.jobs && stage.jobs.length > 0 && (
                  <View className='mt-2'>
                    <Text className='text-xs text-muted-foreground'>
                      {stage.jobs.filter(j => j.status === 'success').length}/
                      {stage.jobs.length} jobs
                    </Text>
                  </View>
                )}
              </View>
            );

            return (
              <View key={stage.id} className='flex-row items-center'>
                {onStagePress ? (
                  <Pressable
                    onPress={() => onStagePress(stage)}
                    accessibilityRole='button'
                    accessibilityLabel={`${stage.name} - ${stage.status}`}
                  >
                    {stageContent}
                  </Pressable>
                ) : (
                  stageContent
                )}
                {!isLast && (
                  <View className='mx-2'>
                    <View className='w-8 h-0.5 bg-muted dark:bg-muted' />
                    <Text className='absolute -top-2 left-2 text-muted-foreground'>
                      →
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
      <View className='px-4 py-2 bg-muted border-t border-border'>
        <Text className={textVariants.caption.default()}>
          {stages.length} stages |{' '}
          {stages.filter(s => s.status === 'success').length} completed
        </Text>
      </View>
    </Card>
  );
};

export default PipelineView;
