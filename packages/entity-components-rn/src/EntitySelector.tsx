import React, { useState } from 'react';
import { View, Text, Pressable, Modal, FlatList, Image } from 'react-native';
import type { EntitySelectorProps, Entity } from './types';

/**
 * EntitySelector - Dropdown/Pressable selector for switching entities
 */
export const EntitySelector: React.FC<EntitySelectorProps> = ({
  entities,
  selectedEntity,
  onSelect,
  placeholder = 'Select an entity',
  disabled = false,
  loading = false,
  showAvatars = true,
  showRoles = false,
  className = '',
  style,
  testID,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    if (!disabled && !loading) {
      setIsOpen(true);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSelect = (entity: Entity) => {
    onSelect(entity);
    handleClose();
  };

  const renderAvatar = (entity: Entity, size: 'sm' | 'md' = 'md') => {
    const sizeClasses = size === 'sm' ? 'w-8 h-8' : 'w-10 h-10';
    const textSize = size === 'sm' ? 'text-sm' : 'text-base';

    if (entity.avatarUrl) {
      return (
        <Image
          source={{ uri: entity.avatarUrl }}
          className={`${sizeClasses} rounded-full bg-gray-200 dark:bg-gray-600`}
          accessibilityIgnoresInvertColors
        />
      );
    }

    return (
      <View className={`${sizeClasses} rounded-full bg-gray-200 dark:bg-gray-600 items-center justify-center`}>
        <Text className={`${textSize} font-semibold text-gray-600 dark:text-gray-300`}>
          {entity.name.charAt(0).toUpperCase()}
        </Text>
      </View>
    );
  };

  const renderItem = ({ item }: { item: Entity }) => (
    <Pressable
      onPress={() => handleSelect(item)}
      className={`
        flex-row items-center px-4 py-3
        ${selectedEntity?.id === item.id ? 'bg-blue-50 dark:bg-blue-900/30' : ''}
        active:bg-gray-100 dark:active:bg-gray-700
      `}
      accessibilityRole="button"
      accessibilityLabel={`Select ${item.name}`}
      accessibilityState={{ selected: selectedEntity?.id === item.id }}
    >
      {showAvatars && <View className="mr-3">{renderAvatar(item, 'sm')}</View>}
      <View className="flex-1">
        <Text className="text-base text-gray-900 dark:text-white" numberOfLines={1}>
          {item.name}
        </Text>
        {showRoles && item.role && (
          <Text className="text-xs text-gray-500 dark:text-gray-400 capitalize">
            {item.role}
          </Text>
        )}
      </View>
      {selectedEntity?.id === item.id && (
        <Text className="text-blue-500 dark:text-blue-400 text-lg">✓</Text>
      )}
    </Pressable>
  );

  return (
    <View className={className} style={style} testID={testID}>
      {/* Trigger Button */}
      <Pressable
        onPress={handleOpen}
        disabled={disabled || loading}
        className={`
          flex-row items-center px-4 py-3 rounded-xl
          bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700
          ${disabled ? 'opacity-50' : ''}
          active:opacity-80
        `}
        accessibilityRole="button"
        accessibilityLabel={selectedEntity ? `Selected: ${selectedEntity.name}` : placeholder}
        accessibilityState={{ disabled }}
      >
        {loading ? (
          <View className="flex-row items-center">
            <Text className="text-gray-500 dark:text-gray-400">Loading...</Text>
          </View>
        ) : selectedEntity ? (
          <>
            {showAvatars && <View className="mr-3">{renderAvatar(selectedEntity)}</View>}
            <View className="flex-1">
              <Text className="text-base font-medium text-gray-900 dark:text-white" numberOfLines={1}>
                {selectedEntity.name}
              </Text>
              {showRoles && selectedEntity.role && (
                <Text className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                  {selectedEntity.role}
                </Text>
              )}
            </View>
          </>
        ) : (
          <Text className="flex-1 text-gray-500 dark:text-gray-400">{placeholder}</Text>
        )}
        <Text className="text-gray-400 dark:text-gray-500 text-lg ml-2">▼</Text>
      </Pressable>

      {/* Dropdown Modal */}
      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <Pressable
          onPress={handleClose}
          className="flex-1 bg-black/50 justify-center px-4"
        >
          <Pressable
            onPress={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden max-h-96"
          >
            {/* Header */}
            <View className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                Select Entity
              </Text>
            </View>

            {/* List */}
            <FlatList
              data={entities}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View className="py-8 items-center">
                  <Text className="text-gray-500 dark:text-gray-400">No entities available</Text>
                </View>
              }
            />

            {/* Cancel Button */}
            <Pressable
              onPress={handleClose}
              className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 items-center active:bg-gray-100 dark:active:bg-gray-700"
            >
              <Text className="text-blue-500 dark:text-blue-400 font-medium">Cancel</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default EntitySelector;
