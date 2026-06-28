import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { cn, Card } from '@sudobility/components-rn';
import { colors, textVariants } from '@sudobility/design';

export type LogLevel = 'info' | 'warn' | 'error' | 'debug' | 'success';

export interface LogEntry {
  id: string;
  level: LogLevel;
  message: string;
  timestamp: Date;
  source?: string;
}

export interface BuildLogProps {
  entries: LogEntry[];
  title?: string;
  maxHeight?: number;
  showTimestamp?: boolean;
  showSource?: boolean;
  className?: string;
}

const levelConfig: Record<
  LogLevel,
  { color: string; bgColor: string; darkBgColor: string; prefix: string }
> = {
  info: {
    color: `${colors.component.alert.info.icon}`,
    bgColor: 'bg-primary/10',
    darkBgColor: '',
    prefix: 'INFO',
  },
  warn: {
    color: 'text-warning',
    bgColor: 'bg-warning/10',
    darkBgColor: '',
    prefix: 'WARN',
  },
  error: {
    color: `${colors.component.alert.error.icon}`,
    bgColor: 'bg-destructive/10',
    darkBgColor: '',
    prefix: 'ERROR',
  },
  debug: {
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
    darkBgColor: 'dark:bg-popover',
    prefix: 'DEBUG',
  },
  success: {
    color: `${colors.component.alert.success.icon}`,
    bgColor: 'bg-success/10',
    darkBgColor: '',
    prefix: 'SUCCESS',
  },
};

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

export const BuildLog: React.FC<BuildLogProps> = ({
  entries,
  title,
  maxHeight = 400,
  showTimestamp = true,
  showSource = false,
  className,
}) => {
  return (
    <Card className={cn('overflow-hidden', className)}>
      {title && (
        <View className='px-4 py-3 border-b border-border'>
          <Text className={textVariants.label.default()}>{title}</Text>
        </View>
      )}
      <ScrollView
        style={{ maxHeight }}
        className='bg-popover '
        showsVerticalScrollIndicator={true}
      >
        <View className='p-3'>
          {entries.map(entry => {
            const config = levelConfig[entry.level];
            return (
              <View
                key={entry.id}
                className={cn(
                  'flex-row flex-wrap py-1 px-2 mb-1 rounded',
                  config.bgColor,
                  config.darkBgColor
                )}
              >
                {showTimestamp && (
                  <Text className='font-mono text-xs text-muted-foreground mr-2'>
                    [{formatTime(entry.timestamp)}]
                  </Text>
                )}
                <Text
                  className={cn(
                    'font-mono text-xs font-bold mr-2',
                    config.color
                  )}
                >
                  [{config.prefix}]
                </Text>
                {showSource && entry.source && (
                  <Text className='font-mono text-xs text-muted-foreground mr-2'>
                    [{entry.source}]
                  </Text>
                )}
                <Text className='font-mono text-xs text-muted-foreground dark:text-muted-foreground flex-1'>
                  {entry.message}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
      <View className='px-4 py-2 bg-muted  border-t border-border'>
        <Text className={textVariants.caption.default()}>
          {entries.length} log entries
        </Text>
      </View>
    </Card>
  );
};

export default BuildLog;
