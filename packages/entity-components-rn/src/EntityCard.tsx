import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import type { EntityCardProps, EntityRole } from './types';
import { DEFAULT_ROLE_CONFIGS } from './types';

/**
 * Get role badge color classes
 */
const getRoleBadgeClasses = (role: EntityRole): string => {
  const colorMap: Record<EntityRole, string> = {
    owner: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
    admin: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
    member: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
    viewer: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
    guest: 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200',
  };
  return colorMap[role] || colorMap.member;
};

/**
 * Get role label
 */
const getRoleLabel = (role: EntityRole): string => {
  const config = DEFAULT_ROLE_CONFIGS.find((c) => c.role === role);
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
      className={`
        flex-row items-center p-4 rounded-xl
        bg-white dark:bg-gray-800
        border border-gray-200 dark:border-gray-700
        ${selected ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20' : ''}
        active:opacity-80
        ${className}
      `}
      style={style}
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={`Entity: ${entity.name}`}
      accessibilityState={{ selected }}
    >
      {/* Avatar */}
      <View className="mr-3">
        {entity.avatarUrl ? (
          <Image
            source={{ uri: entity.avatarUrl }}
            className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600"
            accessibilityIgnoresInvertColors
          />
        ) : (
          <View className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-600 items-center justify-center">
            <Text className="text-lg font-semibold text-gray-600 dark:text-gray-300">
              {entity.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
      </View>

      {/* Content */}
      <View className="flex-1">
        <View className="flex-row items-center flex-wrap">
          <Text
            className="text-base font-semibold text-gray-900 dark:text-white mr-2"
            numberOfLines={1}
          >
            {entity.name}
          </Text>
          
          {showRole && entity.role && (
            <View className={`px-2 py-0.5 rounded-full ${getRoleBadgeClasses(entity.role)}`}>
              <Text className="text-xs font-medium">
                {getRoleLabel(entity.role)}
              </Text>
            </View>
          )}
        </View>

        {showDescription && entity.description && (
          <Text
            className="text-sm text-gray-600 dark:text-gray-400 mt-1"
            numberOfLines={2}
          >
            {entity.description}
          </Text>
        )}

        {showMemberCount && entity.memberCount !== undefined && (
          <Text className="text-xs text-gray-500 dark:text-gray-500 mt-1">
            {entity.memberCount} {entity.memberCount === 1 ? 'member' : 'members'}
          </Text>
        )}
      </View>

      {/* Chevron indicator */}
      {onPress && (
        <View className="ml-2">
          <Text className="text-gray-400 dark:text-gray-500 text-lg">›</Text>
        </View>
      )}
    </Pressable>
  );
};

export default EntityCard;
