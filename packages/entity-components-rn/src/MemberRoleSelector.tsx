import React, { useState } from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { cn } from '@sudobility/components-rn';
import type { MemberRoleSelectorProps, EntityRole } from './types';
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

  const selectedConfig = DEFAULT_ROLE_CONFIGS.find(
    c => c.role === selectedRole
  );
  const availableConfigs = DEFAULT_ROLE_CONFIGS.filter(c =>
    availableRoles.includes(c.role)
  );

  return (
    <View className={className} style={style} testID={testID}>
      {/* Trigger Button */}
      <Pressable
        onPress={handleOpen}
        disabled={disabled}
        className={cn(
          'flex-row items-center justify-between px-4 py-3 rounded-xl',
          'bg-card',
          'border border-border',
          disabled && 'opacity-50',
          'active:opacity-80'
        )}
        accessibilityRole='button'
        accessibilityLabel={`Selected role: ${selectedConfig?.label || selectedRole}`}
        accessibilityState={{ disabled }}
      >
        <View className='flex-row items-center'>
          <View
            className={cn(
              'px-3 py-1 rounded-full mr-2',
              getRoleBadgeClasses(selectedRole)
            )}
          >
            <Text className='text-sm font-medium'>
              {selectedConfig?.label || selectedRole}
            </Text>
          </View>
          {showDescriptions && selectedConfig && (
            <Text
              className='text-sm text-muted-foreground flex-1'
              numberOfLines={1}
            >
              {selectedConfig.description}
            </Text>
          )}
        </View>
        <Text className='text-muted-foreground text-lg ml-2'>▼</Text>
      </Pressable>

      {/* Dropdown Modal */}
      <Modal
        visible={isOpen}
        transparent
        animationType='fade'
        onRequestClose={handleClose}
      >
        <Pressable
          onPress={handleClose}
          className='flex-1 bg-black/50 justify-center px-4'
        >
          <Pressable
            onPress={e => e.stopPropagation()}
            className='bg-card rounded-2xl overflow-hidden'
          >
            {/* Header */}
            <View className='px-4 py-3 border-b border-border'>
              <Text className='text-lg font-semibold text-foreground'>
                Select Role
              </Text>
            </View>

            {/* Role Options */}
            {availableConfigs.map(config => (
              <Pressable
                key={config.role}
                onPress={() => handleSelect(config.role)}
                className={cn(
                  'px-4 py-4 border-b border-border',
                  selectedRole === config.role && 'bg-primary/10',
                  'active:bg-muted'
                )}
                accessibilityRole='button'
                accessibilityLabel={`${config.label}: ${config.description}`}
                accessibilityState={{ selected: selectedRole === config.role }}
              >
                <View className='flex-row items-center justify-between'>
                  <View className='flex-1'>
                    <View className='flex-row items-center'>
                      <View
                        className={cn(
                          'px-3 py-1 rounded-full',
                          getRoleBadgeClasses(config.role)
                        )}
                      >
                        <Text className='text-sm font-medium'>
                          {config.label}
                        </Text>
                      </View>
                    </View>
                    {showDescriptions && (
                      <Text className='text-sm text-muted-foreground mt-2'>
                        {config.description}
                      </Text>
                    )}
                  </View>
                  {selectedRole === config.role && (
                    <Text className='text-primary dark:text-primary text-lg ml-2'>
                      ✓
                    </Text>
                  )}
                </View>
              </Pressable>
            ))}

            {/* Cancel Button */}
            <Pressable
              onPress={handleClose}
              className='px-4 py-3 items-center active:bg-muted'
            >
              <Text className='text-primary dark:text-primary font-medium'>
                Cancel
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

export default MemberRoleSelector;
