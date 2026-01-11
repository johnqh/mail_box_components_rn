import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { cn, Card } from '@sudobility/components-rn';

export type AuditActionType =
  | 'create'
  | 'update'
  | 'delete'
  | 'login'
  | 'logout'
  | 'access'
  | 'export'
  | 'import'
  | 'approve'
  | 'reject'
  | 'deploy'
  | 'rollback';

export interface AuditEntry {
  id: string;
  action: AuditActionType;
  actor: {
    id: string;
    name: string;
    email?: string;
    avatar?: string;
  };
  resource: {
    type: string;
    id: string;
    name: string;
  };
  timestamp: Date;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
}

export interface AuditLogProps {
  entries: AuditEntry[];
  title?: string;
  maxHeight?: number;
  onEntryPress?: (entry: AuditEntry) => void;
  className?: string;
}

const actionConfig: Record<
  AuditActionType,
  { color: string; bgColor: string; darkBgColor: string; icon: string }
> = {
  create: {
    color: 'text-green-700 dark:text-green-300',
    bgColor: 'bg-green-100',
    darkBgColor: 'dark:bg-green-900',
    icon: '+',
  },
  update: {
    color: 'text-blue-700 dark:text-blue-300',
    bgColor: 'bg-blue-100',
    darkBgColor: 'dark:bg-blue-900',
    icon: '~',
  },
  delete: {
    color: 'text-red-700 dark:text-red-300',
    bgColor: 'bg-red-100',
    darkBgColor: 'dark:bg-red-900',
    icon: '-',
  },
  login: {
    color: 'text-purple-700 dark:text-purple-300',
    bgColor: 'bg-purple-100',
    darkBgColor: 'dark:bg-purple-900',
    icon: '→',
  },
  logout: {
    color: 'text-gray-700 dark:text-gray-300',
    bgColor: 'bg-gray-100',
    darkBgColor: 'dark:bg-gray-800',
    icon: '←',
  },
  access: {
    color: 'text-cyan-700 dark:text-cyan-300',
    bgColor: 'bg-cyan-100',
    darkBgColor: 'dark:bg-cyan-900',
    icon: '◉',
  },
  export: {
    color: 'text-orange-700 dark:text-orange-300',
    bgColor: 'bg-orange-100',
    darkBgColor: 'dark:bg-orange-900',
    icon: '↑',
  },
  import: {
    color: 'text-teal-700 dark:text-teal-300',
    bgColor: 'bg-teal-100',
    darkBgColor: 'dark:bg-teal-900',
    icon: '↓',
  },
  approve: {
    color: 'text-emerald-700 dark:text-emerald-300',
    bgColor: 'bg-emerald-100',
    darkBgColor: 'dark:bg-emerald-900',
    icon: '✓',
  },
  reject: {
    color: 'text-rose-700 dark:text-rose-300',
    bgColor: 'bg-rose-100',
    darkBgColor: 'dark:bg-rose-900',
    icon: '✗',
  },
  deploy: {
    color: 'text-indigo-700 dark:text-indigo-300',
    bgColor: 'bg-indigo-100',
    darkBgColor: 'dark:bg-indigo-900',
    icon: '▲',
  },
  rollback: {
    color: 'text-amber-700 dark:text-amber-300',
    bgColor: 'bg-amber-100',
    darkBgColor: 'dark:bg-amber-900',
    icon: '↺',
  },
};

const formatTimestamp = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

export const AuditLog: React.FC<AuditLogProps> = ({
  entries,
  title,
  maxHeight = 500,
  onEntryPress,
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
        showsVerticalScrollIndicator={true}
      >
        {entries.map((entry, index) => {
          const config = actionConfig[entry.action];
          const isLast = index === entries.length - 1;

          const content = (
            <View
              className={cn(
                'px-4 py-3',
                !isLast && 'border-b border-gray-100 dark:border-gray-800'
              )}
            >
              <View className="flex-row items-start">
                <View
                  className={cn(
                    'w-8 h-8 rounded-full items-center justify-center mr-3',
                    config.bgColor,
                    config.darkBgColor
                  )}
                >
                  <Text className={cn('text-sm font-bold', config.color)}>
                    {config.icon}
                  </Text>
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center flex-wrap">
                    <Text className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {entry.actor.name}
                    </Text>
                    <Text className="text-sm text-gray-600 dark:text-gray-400 mx-1">
                      {entry.action}d
                    </Text>
                    <Text className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {entry.resource.name}
                    </Text>
                  </View>
                  <View className="flex-row items-center mt-1">
                    <View
                      className={cn(
                        'px-1.5 py-0.5 rounded mr-2',
                        config.bgColor,
                        config.darkBgColor
                      )}
                    >
                      <Text className={cn('text-xs font-medium uppercase', config.color)}>
                        {entry.action}
                      </Text>
                    </View>
                    <Text className="text-xs text-gray-500 dark:text-gray-500">
                      {entry.resource.type}
                    </Text>
                  </View>
                  <View className="flex-row items-center mt-2">
                    <Text className="text-xs text-gray-400 dark:text-gray-600">
                      {formatTimestamp(entry.timestamp)}
                    </Text>
                    {entry.ipAddress && (
                      <Text className="text-xs text-gray-400 dark:text-gray-600 ml-2">
                        IP: {entry.ipAddress}
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            </View>
          );

          if (onEntryPress) {
            return (
              <Pressable
                key={entry.id}
                onPress={() => onEntryPress(entry)}
                accessibilityRole="button"
              >
                {content}
              </Pressable>
            );
          }

          return <View key={entry.id}>{content}</View>;
        })}
      </ScrollView>
      <View className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
        <Text className="text-xs text-gray-500 dark:text-gray-500">
          Showing {entries.length} audit entries
        </Text>
      </View>
    </Card>
  );
};

export default AuditLog;
