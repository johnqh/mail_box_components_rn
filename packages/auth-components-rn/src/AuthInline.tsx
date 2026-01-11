/**
 * AuthInline - Inline authentication component for React Native
 */

import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { cn, Card } from '@sudobility/components-rn';
import type { AuthInlineProps, AuthMode } from './types';
import { useAuthStatus } from './AuthProvider';
import { ProviderButtons } from './ProviderButtons';
import { EmailSignInForm } from './EmailSignInForm';
import { EmailSignUpForm } from './EmailSignUpForm';
import { ForgotPasswordForm } from './ForgotPasswordForm';

/**
 * Inline authentication component
 */
export const AuthInline: React.FC<AuthInlineProps> = ({
  initialMode = 'select',
  className,
  providers,
  showTitle = true,
  title,
  onModeChange,
  onSuccess,
  variant = 'card',
  onTrack,
  trackingLabel,
  componentName = 'AuthInline',
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

  const content = (
    <View className="gap-4">
      {showTitle && (
        <Text className="text-xl font-semibold text-gray-900 dark:text-white text-center">
          {getTitle()}
        </Text>
      )}
      {renderContent()}
    </View>
  );

  if (variant === 'flat') {
    return <View className={className}>{content}</View>;
  }

  return (
    <Card
      variant={variant === 'bordered' ? 'bordered' : 'default'}
      padding="lg"
      className={className}
    >
      {content}
    </Card>
  );
};
