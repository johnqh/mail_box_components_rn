import React from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { cn } from '@sudobility/components-rn';
import { colors } from '@sudobility/design';
import type { MemberListProps, Member, EntityRole } from './types';
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
 * Get status indicator color
 */
const getStatusColor = (status?: string): string => {
  switch (status) {
    case 'active':
      return 'bg-success';
    case 'inactive':
      return 'bg-muted';
    case 'pending':
      return 'bg-warning';
    default:
      return 'bg-success';
  }
};

/**
 * MemberList - List of entity members with role badges
 */
export const MemberList: React.FC<MemberListProps> = ({
  members,
  onMemberPress,
  onRoleChange,
  onRemoveMember,
  currentUserRole,
  canEditRoles = false,
  canRemoveMembers = false,
  emptyMessage = 'No members found',
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
  const canEditMember = (member: Member): boolean => {
    if (!canEditRoles) return false;
    if (!currentUserRole) return false;

    // Owners can edit anyone except other owners
    if (currentUserRole === 'owner' && member.role !== 'owner') return true;

    // Admins can edit members, viewers, and guests
    if (
      currentUserRole === 'admin' &&
      ['member', 'viewer', 'guest'].includes(member.role)
    )
      return true;

    return false;
  };

  const canRemoveMember = (member: Member): boolean => {
    if (!canRemoveMembers) return false;
    if (!currentUserRole) return false;

    // Cannot remove owners
    if (member.role === 'owner') return false;

    // Owners can remove anyone except other owners
    if (currentUserRole === 'owner') return true;

    // Admins can remove members, viewers, and guests
    if (
      currentUserRole === 'admin' &&
      ['member', 'viewer', 'guest'].includes(member.role)
    )
      return true;

    return false;
  };

  const renderItem = ({ item }: { item: Member }) => (
    <Pressable
      onPress={() => onMemberPress?.(item)}
      disabled={!onMemberPress}
      className={cn(
        'flex-row items-center p-4 rounded-xl mb-3',
        'bg-card',
        'border border-border',
        'active:opacity-80'
      )}
      accessibilityRole='button'
      accessibilityLabel={`Member: ${item.name}, Role: ${item.role}`}
    >
      {/* Avatar with status indicator */}
      <View className='mr-3 relative'>
        {item.avatarUrl ? (
          <Image
            source={{ uri: item.avatarUrl }}
            className='w-12 h-12 rounded-full bg-muted dark:bg-muted'
            accessibilityIgnoresInvertColors
          />
        ) : (
          <View className='w-12 h-12 rounded-full bg-muted dark:bg-muted items-center justify-center'>
            <Text className='text-lg font-semibold text-muted-foreground'>
              {item.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        {/* Status indicator */}
        <View
          className={cn(
            'absolute bottom-0 right-0 w-3 h-3 rounded-full',
            getStatusColor(item.status),
            'border-2 border-background '
          )}
        />
      </View>

      {/* Content */}
      <View className='flex-1'>
        <View className='flex-row items-center flex-wrap'>
          <Text
            className='text-base font-semibold text-foreground mr-2'
            numberOfLines={1}
          >
            {item.name}
          </Text>
          <View
            className={cn(
              'px-2 py-0.5 rounded-full',
              getRoleBadgeClasses(item.role)
            )}
          >
            <Text className='text-xs font-medium'>
              {getRoleLabel(item.role)}
            </Text>
          </View>
        </View>
        <Text className='text-sm text-muted-foreground' numberOfLines={1}>
          {item.email}
        </Text>
        {item.joinedAt && (
          <Text className='text-xs text-muted-foreground mt-1'>
            Joined {new Date(item.joinedAt).toLocaleDateString()}
          </Text>
        )}
      </View>

      {/* Actions */}
      <View className='flex-row items-center ml-2'>
        {canEditMember(item) && onRoleChange && (
          <Pressable
            onPress={() => {}}
            className='p-2 mr-1 active:opacity-60'
            accessibilityRole='button'
            accessibilityLabel='Edit role'
          >
            <Text className='text-primary dark:text-primary text-sm'>Edit</Text>
          </Pressable>
        )}
        {canRemoveMember(item) && onRemoveMember && (
          <Pressable
            onPress={() => onRemoveMember(item)}
            className='p-2 active:opacity-60'
            accessibilityRole='button'
            accessibilityLabel='Remove member'
          >
            <Text className='text-destructive  text-sm'>Remove</Text>
          </Pressable>
        )}
      </View>
    </Pressable>
  );

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
        data={members}
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

export default MemberList;
