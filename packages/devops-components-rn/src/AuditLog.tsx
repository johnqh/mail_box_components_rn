import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { cn, Card } from '@sudobility/components-rn';
import { colors, textVariants } from '@sudobility/design';

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
  { color: string; badge: string; icon: string }
> = {
  create: {
    color: 'text-green-700 dark:text-green-300',
    badge: `${colors.component.badge.success.base} ${colors.component.badge.success.dark}`,
    icon: '+',
  },
  update: {
    color: 'text-blue-700 dark:text-blue-300',
    badge: `${colors.component.badge.primary.base} ${colors.component.badge.primary.dark}`,
    icon: '~',
  },
  delete: {
    color: 'text-red-700 dark:text-red-300',
    badge: `${colors.component.badge.error.base} ${colors.component.badge.error.dark}`,
    icon: '-',
  },
  login: {
    color: 'text-purple-700 dark:text-purple-300',
    badge: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
    icon: '→',
  },
  logout: {
    color: 'text-gray-700 dark:text-gray-300',
    badge: `${colors.component.badge.default.base} ${colors.component.badge.default.dark}`,
    icon: '←',
  },
  access: {
    color: 'text-cyan-700 dark:text-cyan-300',
    badge: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
    icon: '◉',
  },
  export: {
    color: 'text-orange-700 dark:text-orange-300',
    badge: `${colors.component.badge.warning.base} ${colors.component.badge.warning.dark}`,
    icon: '↑',
  },
  import: {
    color: 'text-teal-700 dark:text-teal-300',
    badge: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-300',
    icon: '↓',
  },
  approve: {
    color: 'text-emerald-700 dark:text-emerald-300',
    badge: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300',
    icon: '✓',
  },
  reject: {
    color: 'text-rose-700 dark:text-rose-300',
    badge: 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300',
    icon: '✗',
  },
  deploy: {
    color: 'text-indigo-700 dark:text-indigo-300',
    badge: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300',
    icon: '▲',
  },
  rollback: {
    color: 'text-amber-700 dark:text-amber-300',
    badge: `${colors.component.badge.attention.base} ${colors.component.badge.attention.dark}`,
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
        <View className='px-4 py-3 border-b border-gray-200 dark:border-gray-700'>
          <Text className={textVariants.label.default()}>
            {title}
          </Text>
        </View>
      )}
      <ScrollView style={{ maxHeight }} showsVerticalScrollIndicator={true}>
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
              <View className='flex-row items-start'>
                <View
                  className={cn(
                    'w-8 h-8 rounded-full items-center justify-center mr-3',
                    config.badge
                  )}
                >
                  <Text className={cn('text-sm font-bold', config.color)}>
                    {config.icon}
                  </Text>
                </View>
                <View className='flex-1'>
                  <View className='flex-row items-center flex-wrap'>
                    <Text className='text-sm font-medium text-gray-900 dark:text-gray-100'>
                      {entry.actor.name}
                    </Text>
                    <Text className='text-sm text-gray-600 dark:text-gray-400 mx-1'>
                      {entry.action}d
                    </Text>
                    <Text className='text-sm font-medium text-gray-900 dark:text-gray-100'>
                      {entry.resource.name}
                    </Text>
                  </View>
                  <View className='flex-row items-center mt-1'>
                    <View
                      className={cn(
                        'px-1.5 py-0.5 rounded mr-2',
                        config.badge
                      )}
                    >
                      <Text
                        className={cn(
                          'text-xs font-medium uppercase',
                          config.color
                        )}
                      >
                        {entry.action}
                      </Text>
                    </View>
                    <Text className='text-xs text-gray-500 dark:text-gray-500'>
                      {entry.resource.type}
                    </Text>
                  </View>
                  <View className='flex-row items-center mt-2'>
                    <Text className='text-xs text-gray-400 dark:text-gray-600'>
                      {formatTimestamp(entry.timestamp)}
                    </Text>
                    {entry.ipAddress && (
                      <Text className='text-xs text-gray-400 dark:text-gray-600 ml-2'>
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
                accessibilityRole='button'
              >
                {content}
              </Pressable>
            );
          }

          return <View key={entry.id}>{content}</View>;
        })}
      </ScrollView>
      <View className='px-4 py-2 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700'>
        <Text className={textVariants.caption.default()}>
          Showing {entries.length} audit entries
        </Text>
      </View>
    </Card>
  );
};

export default AuditLog;
