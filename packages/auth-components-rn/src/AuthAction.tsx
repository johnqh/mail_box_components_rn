/**
 * AuthAction - Authentication action component for headers in React Native
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { cn, Button } from '@sudobility/components-rn';
import { textVariants, colors } from '@sudobility/design';
import type { AuthActionProps } from './types';
import { useAuthStatus } from './AuthProvider';
import { Avatar } from './Avatar';

/**
 * Authentication action component for app headers
 */
export const AuthAction: React.FC<AuthActionProps> = ({
  className,
  loginButtonVariant = 'primary',
  size = 'md',
  loginButtonContent,
  avatarSize = 32,
  menuItems: _menuItems = [],
  showUserInfo = true,
  renderUserInfo: _renderUserInfo,
  renderAvatar,
  onLoginPress,
  onLogoutPress,
  onTrack,
  trackingLabel,
  componentName = 'AuthAction',
}) => {
  const { user, isAuthenticated, texts, signOut, loading } = useAuthStatus();

  const handleLoginPress = () => {
    onTrack?.({
      action: 'login_press',
      trackingLabel,
      componentName,
    });

    const result = onLoginPress?.();
    // If onLoginPress returns false, don't proceed with default behavior
    if (result === false) return;
  };

  const handleLogoutPress = async () => {
    onTrack?.({
      action: 'logout_press',
      trackingLabel,
      componentName,
    });

    onLogoutPress?.();
    await signOut();
  };

  // Not authenticated - show login button
  if (!isAuthenticated || !user) {
    return (
      <Button
        variant={loginButtonVariant}
        size={size === 'md' ? 'default' : size}
        onPress={handleLoginPress}
        disabled={loading}
        className={className}
      >
        {loginButtonContent || texts.login}
      </Button>
    );
  }

  // Authenticated - show avatar and user info
  // For React Native, we show a simplified version without dropdown
  // A full dropdown menu would require a modal or action sheet
  return (
    <View className={cn('flex-row items-center gap-3', className)}>
      {showUserInfo && (
        <View className='items-end'>
          <Text className={textVariants.label.default()}>
            {user.displayName || user.email}
          </Text>
          {user.displayName && user.email && (
            <Text className={textVariants.caption.default()}>
              {user.email}
            </Text>
          )}
        </View>
      )}

      {renderAvatar ? (
        renderAvatar(user)
      ) : (
        <Avatar user={user} size={avatarSize} />
      )}

      <Pressable
        onPress={handleLogoutPress}
        className={cn(
          colors.component.button.secondary.base,
          colors.component.button.secondary.dark,
          'px-3 py-1.5 rounded-md active:opacity-80'
        )}
        accessibilityRole='button'
        accessibilityLabel={texts.logout}
      >
        <Text className={textVariants.body.sm()}>
          {texts.logout}
        </Text>
      </Pressable>
    </View>
  );
};
