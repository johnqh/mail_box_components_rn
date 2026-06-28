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
    color: 'text-success',
    badge: `${colors.component.badge.success.base} ${colors.component.badge.success.dark}`,
    icon: '+',
  },
  update: {
    color: 'text-primary',
    badge: `${colors.component.badge.primary.base} ${colors.component.badge.primary.dark}`,
    icon: '~',
  },
  delete: {
    color: 'text-destructive',
    badge: `${colors.component.badge.error.base} ${colors.component.badge.error.dark}`,
    icon: '-',
  },
  login: {
    color: 'text-accent-foreground',
    badge: 'bg-accent text-accent-foreground  ',
    icon: '→',
  },
  logout: {
    color: 'text-muted-foreground',
    badge: `${colors.component.badge.default.base} ${colors.component.badge.default.dark}`,
    icon: '←',
  },
  access: {
    color: 'text-info',
    badge: 'bg-info/10 text-info  ',
    icon: '◉',
  },
  export: {
    color: 'text-warning ',
    badge: `${colors.component.badge.warning.base} ${colors.component.badge.warning.dark}`,
    icon: '↑',
  },
  import: {
    color: 'text-info dark:text-info',
    badge: 'bg-info/10 text-info  dark:text-info',
    icon: '↓',
  },
  approve: {
    color: 'text-success ',
    badge: 'bg-success/10 text-success  ',
    icon: '✓',
  },
  reject: {
    color: 'text-secondary-foreground dark:text-secondary-foreground',
    badge: 'bg-secondary text-secondary-foreground  dark:text-secondary-foreground',
    icon: '✗',
  },
  deploy: {
    color: 'text-primary ',
    badge: 'bg-primary/10 text-primary  ',
    icon: '▲',
  },
  rollback: {
    color: 'text-warning ',
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
        <View className='px-4 py-3 border-b border-border'>
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
                !isLast && 'border-b border-border'
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
                    <Text className='text-sm font-medium text-foreground'>
                      {entry.actor.name}
                    </Text>
                    <Text className='text-sm text-muted-foreground mx-1'>
                      {entry.action}d
                    </Text>
                    <Text className='text-sm font-medium text-foreground'>
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
                    <Text className='text-xs text-muted-foreground'>
                      {entry.resource.type}
                    </Text>
                  </View>
                  <View className='flex-row items-center mt-2'>
                    <Text className='text-xs text-muted-foreground'>
                      {formatTimestamp(entry.timestamp)}
                    </Text>
                    {entry.ipAddress && (
                      <Text className='text-xs text-muted-foreground ml-2'>
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
      <View className='px-4 py-2 bg-muted border-t border-border'>
        <Text className={textVariants.caption.default()}>
          Showing {entries.length} audit entries
        </Text>
      </View>
    </Card>
  );
};

export default AuditLog;
