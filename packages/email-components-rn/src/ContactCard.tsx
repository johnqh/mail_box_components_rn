import React from 'react';
import { View, Text, Image, Pressable, type ViewProps } from 'react-native';
import { cn, Card } from '@sudobility/components-rn';

export interface ContactCardProps extends Omit<ViewProps, 'role'> {
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  onPress?: () => void;
}

/**
 * Contact card component for displaying email contacts
 */
export const ContactCard: React.FC<ContactCardProps> = ({
  name,
  email,
  avatar,
  role,
  onPress,
  className,
  ...props
}) => {
  const content = (
    <View className="flex-row items-center gap-3">
      {avatar ? (
        <Image
          source={{ uri: avatar }}
          className="w-12 h-12 rounded-full"
          accessibilityLabel={`${name}'s avatar`}
        />
      ) : (
        <View className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 items-center justify-center">
          <Text className="text-blue-600 dark:text-blue-400 text-lg font-semibold">
            {name.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
      <View className="flex-1">
        <Text className="font-semibold text-gray-900 dark:text-white">{name}</Text>
        <Text className="text-sm text-gray-500 dark:text-gray-400">{email}</Text>
        {role && (
          <Text className="text-xs text-gray-400 dark:text-gray-500">{role}</Text>
        )}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className={cn('active:opacity-80', className)}
        accessibilityRole="button"
        accessibilityLabel={`Contact ${name}`}
        {...props}
      >
        <Card variant="bordered" padding="md">
          {content}
        </Card>
      </Pressable>
    );
  }

  return (
    <Card variant="bordered" padding="md" className={className} {...props}>
      {content}
    </Card>
  );
};
