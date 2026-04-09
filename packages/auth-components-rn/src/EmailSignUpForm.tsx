/**
 * EmailSignUpForm - Email sign-up form for React Native
 */

import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { cn } from '@sudobility/components-rn';
import { textVariants, variants as v, colors } from '@sudobility/design';
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
  const { texts, signUpWithEmail, loading, error, clearError } =
    useAuthStatus();
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
    <View className='gap-4'>
      <View className='gap-2'>
        <Text className={textVariants.label.default()}>
          {texts.displayName}
        </Text>
        <TextInput
          value={displayName}
          onChangeText={setDisplayName}
          placeholder={texts.displayNamePlaceholder}
          autoCapitalize='words'
          className={cn(v.input.default(), 'px-4 py-3 rounded-lg')}
          placeholderTextColor={colors.raw.neutral[400]}
        />
      </View>

      <View className='gap-2'>
        <Text className={textVariants.label.default()}>
          {texts.email}
        </Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder={texts.emailPlaceholder}
          keyboardType='email-address'
          autoCapitalize='none'
          autoCorrect={false}
          className={cn(v.input.default(), 'px-4 py-3 rounded-lg')}
          placeholderTextColor={colors.raw.neutral[400]}
        />
      </View>

      <View className='gap-2'>
        <Text className={textVariants.label.default()}>
          {texts.password}
        </Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder={texts.passwordPlaceholder}
          secureTextEntry
          className={cn(v.input.default(), 'px-4 py-3 rounded-lg')}
          placeholderTextColor={colors.raw.neutral[400]}
        />
      </View>

      <View className='gap-2'>
        <Text className={textVariants.label.default()}>
          {texts.confirmPassword}
        </Text>
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder={texts.confirmPasswordPlaceholder}
          secureTextEntry
          className={cn(v.input.default(), 'px-4 py-3 rounded-lg')}
          placeholderTextColor={colors.raw.neutral[400]}
        />
      </View>

      {displayError && (
        <Text className={textVariants.label.error()}>
          {displayError}
        </Text>
      )}

      <Pressable
        onPress={handleSubmit}
        disabled={loading || !email || !password || !confirmPassword}
        className={cn(
          v.button.primary.default(),
          'py-3 px-4 rounded-lg',
          (loading || !email || !password || !confirmPassword) && 'opacity-50'
        )}
        accessibilityRole='button'
        accessibilityLabel={texts.signUp}
      >
        <Text className='font-medium text-white'>
          {loading ? texts.loading : texts.signUp}
        </Text>
      </Pressable>

      <View className='flex-row items-center justify-center gap-1'>
        <Text className={textVariants.body.sm()}>
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
          accessibilityRole='button'
        >
          <Text className={textVariants.link.subtle()}>
            {texts.signIn}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};
