import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { cn } from '@sudobility/components-rn';
import type { EntityCardProps, EntityRole } from './types';
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
 * EntityCard - Card displaying entity with avatar, name, role badge, and description
 */
export const EntityCard: React.FC<EntityCardProps> = ({
  entity,
  onPress,
  onLongPress,
  selected = false,
  showRole = true,
  showMemberCount = true,
  showDescription = true,
  className = '',
  style,
  testID,
}) => {
  const handlePress = () => {
    onPress?.(entity);
  };

  const handleLongPress = () => {
    onLongPress?.(entity);
  };

  return (
    <Pressable
      onPress={handlePress}
      onLongPress={handleLongPress}
      disabled={!onPress && !onLongPress}
      className={cn(
        'flex-row items-center p-4 rounded-xl',
        'bg-card',
        'border border-border',
        selected && 'border-primary dark:border-primary bg-primary/10',
        'active:opacity-80',
        className
      )}
      style={style}
      testID={testID}
      accessibilityRole='button'
      accessibilityLabel={`Entity: ${entity.name}`}
      accessibilityState={{ selected }}
    >
      {/* Avatar */}
      <View className='mr-3'>
        {entity.avatarUrl ? (
          <Image
            source={{ uri: entity.avatarUrl }}
            className='w-12 h-12 rounded-full bg-muted dark:bg-muted'
            accessibilityIgnoresInvertColors
          />
        ) : (
          <View className='w-12 h-12 rounded-full bg-muted dark:bg-muted items-center justify-center'>
            <Text className='text-lg font-semibold text-muted-foreground'>
              {entity.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View className='flex-1'>
        <View className='flex-row items-center flex-wrap'>
          <Text
            className='text-base font-semibold text-foreground mr-2'
            numberOfLines={1}
          >
            {entity.name}
          </Text>

          {showRole && entity.role && (
            <View
              className={cn(
                'px-2 py-0.5 rounded-full',
                getRoleBadgeClasses(entity.role)
              )}
            >
              <Text className='text-xs font-medium'>
                {getRoleLabel(entity.role)}
              </Text>
            </View>
          )}
        </View>

        {showDescription && entity.description && (
          <Text
            className='text-sm text-muted-foreground mt-1'
            numberOfLines={2}
          >
            {entity.description}
          </Text>
        )}

        {showMemberCount && entity.memberCount !== undefined && (
          <Text className='text-xs text-muted-foreground mt-1'>
            {entity.memberCount}{' '}
            {entity.memberCount === 1 ? 'member' : 'members'}
          </Text>
        )}
      </View>

      {/* Chevron indicator */}
      {onPress && (
        <View className='ml-2'>
          <Text className='text-muted-foreground text-lg'>›</Text>
        </View>
      )}
    </Pressable>
  );
};

export default EntityCard;
