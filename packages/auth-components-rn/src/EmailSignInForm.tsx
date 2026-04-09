/**
 * EmailSignInForm - Email sign-in form for React Native
 */

import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { cn } from '@sudobility/components-rn';
import { textVariants, variants as v, colors } from '@sudobility/design';
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
  const { texts, signInWithEmail, loading, error, clearError } =
    useAuthStatus();
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
    <View className='gap-4'>
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

      {error && (
        <Text className={textVariants.label.error()}>{error}</Text>
      )}

      <Pressable
        onPress={handleSubmit}
        disabled={loading || !email || !password}
        className={cn(
          v.button.primary.default(),
          'py-3 px-4 rounded-lg',
          (loading || !email || !password) && 'opacity-50'
        )}
        accessibilityRole='button'
        accessibilityLabel={texts.signIn}
      >
        <Text className='font-medium text-white'>
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
        className='items-center py-2'
        accessibilityRole='button'
      >
        <Text className={textVariants.link.subtle()}>
          {texts.forgotPassword}
        </Text>
      </Pressable>

      <View className='flex-row items-center justify-center gap-1'>
        <Text className={textVariants.body.sm()}>
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
          accessibilityRole='button'
        >
          <Text className={textVariants.link.subtle()}>
            {texts.signUp}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};
