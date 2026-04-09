/**
 * ForgotPasswordForm - Password reset form for React Native
 */

import React, { useState } from 'react';
import { View, Text, TextInput, Pressable } from 'react-native';
import { cn } from '@sudobility/components-rn';
import { textVariants, variants as v, colors } from '@sudobility/design';
import type { ForgotPasswordFormProps } from './types';
import { useAuthStatus } from './AuthProvider';

const alertSuccess = colors.component.alert.success;

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
      <View className='gap-4'>
        <View
          className={cn(
            alertSuccess.base,
            alertSuccess.dark,
            'p-4 rounded-lg'
          )}
        >
          <Text className={textVariants.label.success()}>
            {texts.resetEmailSent}
          </Text>
          <Text className={cn(textVariants.label.success(), 'mt-1')}>
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
          className={cn(
            v.button.primary.default(),
            'py-3 px-4 rounded-lg'
          )}
          accessibilityRole='button'
        >
          <Text className='font-medium text-white'>{texts.backToSignIn}</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className='gap-4'>
      <Text className={textVariants.body.sm()}>
        Enter your email address and we'll send you a link to reset your
        password.
      </Text>

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

      {error && (
        <Text className={textVariants.label.error()}>{error}</Text>
      )}

      <Pressable
        onPress={handleSubmit}
        disabled={loading || !email}
        className={cn(
          v.button.primary.default(),
          'py-3 px-4 rounded-lg',
          (loading || !email) && 'opacity-50'
        )}
        accessibilityRole='button'
        accessibilityLabel={texts.sendResetLink}
      >
        <Text className='font-medium text-white'>
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
        className='items-center py-2'
        accessibilityRole='button'
      >
        <Text className={textVariants.link.subtle()}>
          {texts.backToSignIn}
        </Text>
      </Pressable>
    </View>
  );
};
