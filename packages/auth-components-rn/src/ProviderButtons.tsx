/**
 * ProviderButtons - OAuth provider buttons for React Native
 */

import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { cn } from '@sudobility/components-rn';
import type { ProviderButtonsProps, AuthProviderType } from './types';
import { useAuthStatus } from './AuthProvider';

interface ProviderButtonProps {
  provider: AuthProviderType;
  label: string;
  onPress: () => void;
  className?: string;
}

const ProviderButton: React.FC<ProviderButtonProps> = ({
  provider,
  label,
  onPress,
  className,
}) => {
  const bgColors: Record<AuthProviderType, string> = {
    google: 'bg-white border border-gray-300',
    apple: 'bg-black',
    email: 'bg-blue-600',
  };

  const textColors: Record<AuthProviderType, string> = {
    google: 'text-gray-900',
    apple: 'text-white',
    email: 'text-white',
  };

  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'flex-row items-center justify-center py-3 px-4 rounded-lg',
        'active:opacity-80',
        bgColors[provider],
        className
      )}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text className={cn('font-medium text-base', textColors[provider])}>
        {label}
      </Text>
    </Pressable>
  );
};

/**
 * Provider buttons component for OAuth and email sign-in
 */
export const ProviderButtons: React.FC<ProviderButtonsProps> = ({
  providers,
  onEmailPress,
  onTrack,
  trackingLabel,
  componentName = 'ProviderButtons',
}) => {
  const { texts, signInWithGoogle, signInWithApple } = useAuthStatus();

  const handleProviderPress = async (provider: AuthProviderType) => {
    onTrack?.({
      action: 'provider_press',
      trackingLabel,
      componentName,
    });

    if (provider === 'google') {
      await signInWithGoogle();
    } else if (provider === 'apple') {
      await signInWithApple();
    } else if (provider === 'email') {
      onEmailPress();
    }
  };

  const getLabel = (provider: AuthProviderType): string => {
    switch (provider) {
      case 'google':
        return texts.continueWithGoogle;
      case 'apple':
        return texts.continueWithApple;
      case 'email':
        return texts.continueWithEmail;
    }
  };

  return (
    <View className="gap-3">
      {providers.map((provider) => (
        <ProviderButton
          key={provider}
          provider={provider}
          label={getLabel(provider)}
          onPress={() => handleProviderPress(provider)}
        />
      ))}
    </View>
  );
};
