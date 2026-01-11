/**
 * ForgotPasswordForm - Password reset form for React Native
 */

import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { cn } from '@sudobility/components-rn';
import type { ForgotPasswordFormProps } from './types';
import { useAuthStatus } from './AuthProvider';

/**
 * Forgot password form component
 */
export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSwitchToSignIn,
  onTrack,
  trackingLabel,
  componentName = 'ForgotPasswordForm',
}) => {
  const { texts, resetPassword, loading, error, clearError } = useAuthStatus();
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    clearError();
    setSuccess(false);

    onTrack?.({
      action: 'form_submit',
      trackingLabel,
      componentName,
    });

    await resetPassword(email);
    setSuccess(true);
  };

  if (success) {
    return (
      <View className="gap-4">
        <View className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20">
          <Text className="text-base font-medium text-green-800 dark:text-green-200">
            {texts.resetEmailSent}
          </Text>
          <Text className="mt-1 text-sm text-green-700 dark:text-green-300">
            {texts.resetEmailSentDesc.replace('{{email}}', email)}
          </Text>
        </View>

        <Pressable
          onPress={() => {
            onTrack?.({
              action: 'switch_mode',
              trackingLabel,
              componentName,
            });
            onSwitchToSignIn();
          }}
          className="py-3 px-4 rounded-lg items-center justify-center bg-blue-600 active:bg-blue-700"
          accessibilityRole="button"
        >
          <Text className="font-medium text-white">{texts.backToSignIn}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="gap-4">
      <Text className="text-sm text-gray-500 dark:text-gray-400">
        Enter your email address and we'll send you a link to reset your password.
      </Text>

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

      {error && (
        <Text className="text-sm text-red-600 dark:text-red-400">{error}</Text>
      )}

      <Pressable
        onPress={handleSubmit}
        disabled={loading || !email}
        className={cn(
          'py-3 px-4 rounded-lg items-center justify-center',
          'bg-blue-600 active:bg-blue-700',
          (loading || !email) && 'opacity-50'
        )}
        accessibilityRole="button"
        accessibilityLabel={texts.sendResetLink}
      >
        <Text className="font-medium text-white">
          {loading ? texts.loading : texts.sendResetLink}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => {
          onTrack?.({
            action: 'switch_mode',
            trackingLabel,
            componentName,
          });
          onSwitchToSignIn();
        }}
        className="items-center py-2"
        accessibilityRole="button"
      >
        <Text className="text-sm text-blue-600 dark:text-blue-400">
          {texts.backToSignIn}
        </Text>
      </Pressable>
    </View>
  );
};
