/**
 * EmailSignInForm - Email sign-in form for React Native
 */

import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { cn } from '@sudobility/components-rn';
import type { EmailSignInFormProps } from './types';
import { useAuthStatus } from './AuthProvider';

/**
 * Email sign-in form component
 */
export const EmailSignInForm: React.FC<EmailSignInFormProps> = ({
  onSwitchToSignUp,
  onSwitchToForgotPassword,
  onSuccess,
  onTrack,
  trackingLabel,
  componentName = 'EmailSignInForm',
}) => {
  const { texts, signInWithEmail, loading, error, clearError } = useAuthStatus();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    onTrack?.({
      action: 'form_submit',
      trackingLabel,
      componentName,
    });

    clearError();
    await signInWithEmail(email, password);
    onSuccess?.();
  };

  return (
    <View className="gap-4">
      <View className="gap-2">
        <Text className="text-sm font-medium text-gray-900 dark:text-white">
          {texts.email}
        </Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder={texts.emailPlaceholder}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <View className="gap-2">
        <Text className="text-sm font-medium text-gray-900 dark:text-white">
          {texts.password}
        </Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder={texts.passwordPlaceholder}
          secureTextEntry
          className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {error && (
        <Text className="text-sm text-red-600 dark:text-red-400">{error}</Text>
      )}

      <Pressable
        onPress={handleSubmit}
        disabled={loading || !email || !password}
        className={cn(
          'py-3 px-4 rounded-lg items-center justify-center',
          'bg-blue-600 active:bg-blue-700',
          (loading || !email || !password) && 'opacity-50'
        )}
        accessibilityRole="button"
        accessibilityLabel={texts.signIn}
      >
        <Text className="font-medium text-white">
          {loading ? texts.loading : texts.signIn}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => {
          onTrack?.({
            action: 'switch_mode',
            trackingLabel,
            componentName,
          });
          onSwitchToForgotPassword();
        }}
        className="items-center py-2"
        accessibilityRole="button"
      >
        <Text className="text-sm text-blue-600 dark:text-blue-400">
          {texts.forgotPassword}
        </Text>
      </Pressable>

      <View className="flex-row items-center justify-center gap-1">
        <Text className="text-sm text-gray-500 dark:text-gray-400">
          {texts.noAccount}
        </Text>
        <Pressable
          onPress={() => {
            onTrack?.({
              action: 'switch_mode',
              trackingLabel,
              componentName,
            });
            onSwitchToSignUp();
          }}
          accessibilityRole="button"
        >
          <Text className="text-sm font-medium text-blue-600 dark:text-blue-400">
            {texts.signUp}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};
