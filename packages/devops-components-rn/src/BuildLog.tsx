import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { cn, Card } from '@sudobility/components-rn';

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
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50',
    darkBgColor: 'dark:bg-blue-950',
    prefix: 'INFO',
  },
  warn: {
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-50',
    darkBgColor: 'dark:bg-yellow-950',
    prefix: 'WARN',
  },
  error: {
    color: 'text-red-600 dark:text-red-400',
    bgColor: 'bg-red-50',
    darkBgColor: 'dark:bg-red-950',
    prefix: 'ERROR',
  },
  debug: {
    color: 'text-gray-600 dark:text-gray-400',
    bgColor: 'bg-gray-50',
    darkBgColor: 'dark:bg-gray-900',
    prefix: 'DEBUG',
  },
  success: {
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-50',
    darkBgColor: 'dark:bg-green-950',
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
        <View className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <Text className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </Text>
        </View>
      )}
      <ScrollView
        style={{ maxHeight }}
        className="bg-gray-900 dark:bg-black"
        showsVerticalScrollIndicator={true}
      >
        <View className="p-3">
          {entries.map((entry) => {
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
                  <Text className="font-mono text-xs text-gray-500 dark:text-gray-500 mr-2">
                    [{formatTime(entry.timestamp)}]
                  </Text>
                )}
                <Text
                  className={cn('font-mono text-xs font-bold mr-2', config.color)}
                >
                  [{config.prefix}]
                </Text>
                {showSource && entry.source && (
                  <Text className="font-mono text-xs text-gray-400 dark:text-gray-600 mr-2">
                    [{entry.source}]
                  </Text>
                )}
                <Text className="font-mono text-xs text-gray-200 dark:text-gray-300 flex-1">
                  {entry.message}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
      <View className="px-4 py-2 bg-gray-800 dark:bg-gray-950 border-t border-gray-700">
        <Text className="text-xs text-gray-400 dark:text-gray-500">
          {entries.length} log entries
        </Text>
      </View>
    </Card>
  );
};

export default BuildLog;
