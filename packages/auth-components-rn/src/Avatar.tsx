/**
 * Avatar - User avatar component for React Native
 */

import React, { useState } from 'react';
import { View, Text, Image, Pressable, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';
import type { AvatarProps } from './types';

/**
 * Get initials from display name or email
 */
function getInitials(name: string | null, email: string | null): string {
  if (name) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }
  if (email) {
    return email.slice(0, 2).toUpperCase();
  }
  return '?';
}

/**
 * Avatar component with photo URL and initials fallback
 */
export const Avatar: React.FC<AvatarProps & ViewProps> = ({
  user,
  size = 32,
  className,
  onPress,
  ...props
}) => {
  const [imageError, setImageError] = useState(false);

  const hasValidPhoto = user.photoURL && !imageError;
  const initials = getInitials(user.displayName, user.email);

  const sizeStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  const content = hasValidPhoto ? (
    <Image
      source={{ uri: user.photoURL! }}
      style={sizeStyle}
      className="bg-gray-200 dark:bg-gray-700"
      onError={() => setImageError(true)}
      accessibilityLabel={user.displayName || 'User avatar'}
    />
  ) : (
    <View
      style={sizeStyle}
      className={cn(
        'items-center justify-center bg-blue-600',
        className
      )}
    >
      <Text
        style={{ fontSize: size * 0.4 }}
        className="font-medium text-white"
      >
        {initials}
      </Text>
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className={cn('active:opacity-80', className)}
        accessibilityRole="button"
        accessibilityLabel={user.displayName || 'User avatar'}
        {...props}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <View className={className} {...props}>
      {content}
    </View>
  );
};
