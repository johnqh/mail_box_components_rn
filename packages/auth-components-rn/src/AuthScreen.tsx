/**
 * AuthScreen - Full-screen authentication component for React Native
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { cn } from '@sudobility/components-rn';
import type { AuthScreenProps, AuthMode } from './types';
import { useAuthStatus } from './AuthProvider';
import { ProviderButtons } from './ProviderButtons';
import { EmailSignInForm } from './EmailSignInForm';
import { EmailSignUpForm } from './EmailSignUpForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';

/**
 * Full-screen authentication component
 */
export const AuthScreen: React.FC<AuthScreenProps> = ({
  initialMode = 'select',
  className,
  providers,
  showTitle = true,
  title,
  onModeChange,
  onSuccess,
  onTrack,
  trackingLabel,
  componentName = 'AuthScreen',
}) => {
  const { texts, providerConfig } = useAuthStatus();
  const [mode, setMode] = useState<AuthMode>(initialMode);

  const activeProviders = providers || providerConfig.providers;

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode);
    onModeChange?.(newMode);
  };

  const getTitle = (): string => {
    if (title) return title;
    switch (mode) {
      case 'select':
        return texts.signInTitle;
      case 'email-signin':
        return texts.signInWithEmail;
      case 'email-signup':
        return texts.createAccount;
      case 'forgot-password':
        return texts.resetPassword;
    }
  };

  const renderContent = () => {
    switch (mode) {
      case 'select':
        return (
          <ProviderButtons
            providers={activeProviders}
            onEmailPress={() => handleModeChange('email-signin')}
            onTrack={onTrack}
            trackingLabel={trackingLabel}
            componentName={componentName}
          />
        );
      case 'email-signin':
        return (
          <EmailSignInForm
            onSwitchToSignUp={() => handleModeChange('email-signup')}
            onSwitchToForgotPassword={() => handleModeChange('forgot-password')}
            onSuccess={onSuccess}
            onTrack={onTrack}
            trackingLabel={trackingLabel}
            componentName={componentName}
          />
        );
      case 'email-signup':
        return (
          <EmailSignUpForm
            onSwitchToSignIn={() => handleModeChange('email-signin')}
            onSuccess={onSuccess}
            onTrack={onTrack}
            trackingLabel={trackingLabel}
            componentName={componentName}
          />
        );
      case 'forgot-password':
        return (
          <ForgotPasswordForm
            onSwitchToSignIn={() => handleModeChange('email-signin')}
            onTrack={onTrack}
            trackingLabel={trackingLabel}
            componentName={componentName}
          />
        );
    }
  };

  return (
    <SafeAreaView className={cn('flex-1 bg-white dark:bg-gray-900', className)}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow justify-center px-6 py-8"
        keyboardShouldPersistTaps="handled"
      >
        <View className="max-w-md w-full self-center gap-8">
          {showTitle && (
            <Text className="text-2xl font-bold text-gray-900 dark:text-white text-center">
              {getTitle()}
            </Text>
          )}
          {renderContent()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
