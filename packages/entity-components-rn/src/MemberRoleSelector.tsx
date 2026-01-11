import React, { useState } from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import type { MemberRoleSelectorProps, EntityRole } from './types';
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
 * MemberRoleSelector - Role selection component
 */
export const MemberRoleSelector: React.FC<MemberRoleSelectorProps> = ({
  selectedRole,
  onRoleChange,
  availableRoles = ['admin', 'member', 'viewer', 'guest'],
  disabled = false,
  showDescriptions = true,
  className = '',
  style,
  testID,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    if (!disabled) {
      setIsOpen(true);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSelect = (role: EntityRole) => {
    onRoleChange(role);
    handleClose();
  };

  const selectedConfig = DEFAULT_ROLE_CONFIGS.find((c) => c.role === selectedRole);
  const availableConfigs = DEFAULT_ROLE_CONFIGS.filter((c) => availableRoles.includes(c.role));

  return (
    <View className={className} style={style} testID={testID}>
      {/* Trigger Button */}
      <Pressable
        onPress={handleOpen}
        disabled={disabled}
        className={`
          flex-row items-center justify-between px-4 py-3 rounded-xl
          bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700
          ${disabled ? 'opacity-50' : ''}
          active:opacity-80
        `}
        accessibilityRole="button"
        accessibilityLabel={`Selected role: ${selectedConfig?.label || selectedRole}`}
        accessibilityState={{ disabled }}
      >
        <View className="flex-row items-center">
          <View className={`px-3 py-1 rounded-full mr-2 ${getRoleBadgeClasses(selectedRole)}`}>
            <Text className="text-sm font-medium">{selectedConfig?.label || selectedRole}</Text>
          </View>
          {showDescriptions && selectedConfig && (
            <Text className="text-sm text-gray-500 dark:text-gray-400 flex-1" numberOfLines={1}>
              {selectedConfig.description}
            </Text>
          )}
        </View>
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
            className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden"
          >
            {/* Header */}
            <View className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                Select Role
              </Text>
            </View>

            {/* Role Options */}
            {availableConfigs.map((config) => (
              <Pressable
                key={config.role}
                onPress={() => handleSelect(config.role)}
                className={`
                  px-4 py-4 border-b border-gray-100 dark:border-gray-700
                  ${selectedRole === config.role ? 'bg-blue-50 dark:bg-blue-900/30' : ''}
                  active:bg-gray-100 dark:active:bg-gray-700
                `}
                accessibilityRole="button"
                accessibilityLabel={`${config.label}: ${config.description}`}
                accessibilityState={{ selected: selectedRole === config.role }}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <View className="flex-row items-center">
                      <View className={`px-3 py-1 rounded-full ${getRoleBadgeClasses(config.role)}`}>
                        <Text className="text-sm font-medium">{config.label}</Text>
                      </View>
                    </View>
                    {showDescriptions && (
                      <Text className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {config.description}
                      </Text>
                    )}
                  </View>
                  {selectedRole === config.role && (
                    <Text className="text-blue-500 dark:text-blue-400 text-lg ml-2">✓</Text>
                  )}
                </View>
              </Pressable>
            ))}

            {/* Cancel Button */}
            <Pressable
              onPress={handleClose}
              className="px-4 py-3 items-center active:bg-gray-100 dark:active:bg-gray-700"
            >
              <Text className="text-blue-500 dark:text-blue-400 font-medium">Cancel</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default MemberRoleSelector;
