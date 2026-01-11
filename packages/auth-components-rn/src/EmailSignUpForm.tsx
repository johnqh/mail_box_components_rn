/**
 * EmailSignUpForm - Email sign-up form for React Native
 */

import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { cn } from '@sudobility/components-rn';
import type { EmailSignUpFormProps } from './types';
import { useAuthStatus } from './AuthProvider';

/**
 * Email sign-up form component
 */
export const EmailSignUpForm: React.FC<EmailSignUpFormProps> = ({
  onSwitchToSignIn,
  onSuccess,
  onTrack,
  trackingLabel,
  componentName = 'EmailSignUpForm',
}) => {
  const { texts, signUpWithEmail, loading, error, clearError } = useAuthStatus();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setLocalError(null);
    clearError();

    // Validate passwords match
    if (password !== confirmPassword) {
      setLocalError(texts.passwordMismatch);
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setLocalError(texts.passwordTooShort);
      return;
    }

    onTrack?.({
      action: 'form_submit',
      trackingLabel,
      componentName,
    });

    await signUpWithEmail(email, password, displayName || undefined);
    onSuccess?.();
  };

  const displayError = localError || error;

  return (
    <View className="gap-4">
      <View className="gap-2">
        <Text className="text-sm font-medium text-gray-900 dark:text-white">
          {texts.displayName}
        </Text>
        <TextInput
          value={displayName}
          onChangeText={setDisplayName}
          placeholder={texts.displayNamePlaceholder}
          autoCapitalize="words"
          className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          placeholderTextColor="#9CA3AF"
        />
      </View>

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

      <View className="gap-2">
        <Text className="text-sm font-medium text-gray-900 dark:text-white">
          {texts.confirmPassword}
        </Text>
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder={texts.confirmPasswordPlaceholder}
          secureTextEntry
          className="px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          placeholderTextColor="#9CA3AF"
        />
      </View>

      {displayError && (
        <Text className="text-sm text-red-600 dark:text-red-400">
          {displayError}
        </Text>
      )}

      <Pressable
        onPress={handleSubmit}
        disabled={loading || !email || !password || !confirmPassword}
        className={cn(
          'py-3 px-4 rounded-lg items-center justify-center',
          'bg-blue-600 active:bg-blue-700',
          (loading || !email || !password || !confirmPassword) && 'opacity-50'
        )}
        accessibilityRole="button"
        accessibilityLabel={texts.signUp}
      >
        <Text className="font-medium text-white">
          {loading ? texts.loading : texts.signUp}
        </Text>
      </Pressable>

      <View className="flex-row items-center justify-center gap-1">
        <Text className="text-sm text-gray-500 dark:text-gray-400">
          {texts.haveAccount}
        </Text>
        <Pressable
          onPress={() => {
            onTrack?.({
              action: 'switch_mode',
              trackingLabel,
              componentName,
            });
            onSwitchToSignIn();
          }}
          accessibilityRole="button"
        >
          <Text className="text-sm font-medium text-blue-600 dark:text-blue-400">
            {texts.signIn}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};
