import React from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { cn } from '@sudobility/components-rn';
import { colors } from '@sudobility/design';
import type { InvitationListProps, Invitation, EntityRole } from './types';
import { DEFAULT_ROLE_CONFIGS } from './types';

/**
 * Get role badge color classes
 */
const getRoleBadgeClasses = (role: EntityRole): string => {
  const colorMap: Record<EntityRole, string> = {
    owner: 'bg-accent  text-accent-foreground ',
    admin: 'bg-primary/10  text-primary dark:text-primary-foreground',
    member: 'bg-success/10  text-success',
    viewer: 'bg-muted text-foreground',
    guest: 'bg-warning/10  text-warning ',
  };
  return colorMap[role] || colorMap.member;
};

/**
 * Get role label
 */
const getRoleLabel = (role: EntityRole): string => {
  const config = DEFAULT_ROLE_CONFIGS.find(c => c.role === role);
  return config?.label || role;
};

/**
 * Get status badge classes
 */
const getStatusBadgeClasses = (status: Invitation['status']): string => {
  const colorMap: Record<Invitation['status'], string> = {
    pending: 'bg-warning/10  text-warning ',
    accepted: 'bg-success/10  text-success',
    declined: 'bg-destructive/10  text-destructive ',
    expired: 'bg-muted text-foreground',
  };
  return colorMap[status] || colorMap.pending;
};

/**
 * Get status label
 */
const getStatusLabel = (status: Invitation['status']): string => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

/**
 * Format relative time
 */
const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
};

/**
 * InvitationList - List of pending invitations
 */
export const InvitationList: React.FC<InvitationListProps> = ({
  invitations,
  onResend,
  onCancel,
  canResend = true,
  canCancel = true,
  emptyMessage = 'No pending invitations',
  emptyIcon,
  loading = false,
  refreshing = false,
  onRefresh,
  ListHeaderComponent,
  ListFooterComponent,
  className = '',
  style,
  testID,
}) => {
  const renderItem = ({ item }: { item: Invitation }) => {
    const isPending = item.status === 'pending';
    const showResend = canResend && onResend && isPending;
    const showCancel = canCancel && onCancel && isPending;

    return (
      <View
        className={cn('p-4 rounded-xl mb-3', 'bg-card', 'border border-border')}
        accessibilityLabel={`Invitation to ${item.email}, Status: ${item.status}`}
      >
        {/* Header */}
        <View className='flex-row items-center justify-between mb-2'>
          <Text
            className='text-base font-semibold text-foreground flex-1'
            numberOfLines={1}
          >
            {item.email}
          </Text>
          <View
            className={cn(
              'px-2 py-0.5 rounded-full',
              getStatusBadgeClasses(item.status)
            )}
          >
            <Text className='text-xs font-medium'>
              {getStatusLabel(item.status)}
            </Text>
          </View>
        </View>

        {/* Role and Time */}
        <View className='flex-row items-center mb-2'>
          <View
            className={cn(
              'px-2 py-0.5 rounded-full mr-2',
              getRoleBadgeClasses(item.role)
            )}
          >
            <Text className='text-xs font-medium'>
              {getRoleLabel(item.role)}
            </Text>
          </View>
          <Text className='text-xs text-muted-foreground'>
            Invited {formatRelativeTime(item.invitedAt)}
          </Text>
        </View>

        {/* Invited by */}
        {item.invitedBy && (
          <Text className='text-xs text-muted-foreground mb-2'>
            by {item.invitedBy}
          </Text>
        )}

        {/* Expiration warning */}
        {item.expiresAt && isPending && (
          <Text className='text-xs text-warning mb-2'>
            Expires: {new Date(item.expiresAt).toLocaleDateString()}
          </Text>
        )}

        {/* Actions */}
        {(showResend || showCancel) && (
          <View className='flex-row items-center mt-2 pt-2 border-t border-border'>
            {showResend && (
              <Pressable
                onPress={() => onResend(item)}
                className='flex-row items-center mr-4 py-1 active:opacity-60'
                accessibilityRole='button'
                accessibilityLabel='Resend invitation'
              >
                <Text className='text-primary dark:text-primary text-sm font-medium'>
                  Resend
                </Text>
              </Pressable>
            )}
            {showCancel && (
              <Pressable
                onPress={() => onCancel(item)}
                className='flex-row items-center py-1 active:opacity-60'
                accessibilityRole='button'
                accessibilityLabel='Cancel invitation'
              >
                <Text className='text-destructive  text-sm font-medium'>
                  Cancel
                </Text>
              </Pressable>
            )}
          </View>
        )}
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) {
      return (
        <View className='flex-1 items-center justify-center py-12'>
          <ActivityIndicator size='large' color={colors.raw.blue[500]} />
          <Text className='text-muted-foreground mt-4'>Loading...</Text>
        </View>
      );
    }

    return (
      <View className='flex-1 items-center justify-center py-12'>
        {emptyIcon}
        <Text className='text-muted-foreground text-center mt-2'>
          {emptyMessage}
        </Text>
      </View>
    );
  };

  return (
    <View className={cn('flex-1', className)} style={style} testID={testID}>
      <FlatList
        data={invitations}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={ListFooterComponent}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={{ flexGrow: 1, padding: 16 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.raw.blue[500]}
            />
          ) : undefined
        }
      />
    </View>
  );
};

export default InvitationList;
