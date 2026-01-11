import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import type { InvitationFormProps, EntityRole } from './types';
import { MemberRoleSelector } from './MemberRoleSelector';

/**
 * Validate email format
 */
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * InvitationForm - Form for inviting members with email input and role selector
 */
export const InvitationForm: React.FC<InvitationFormProps> = ({
  onSubmit,
  availableRoles = ['admin', 'member', 'viewer', 'guest'],
  defaultRole = 'member',
  loading = false,
  disabled = false,
  placeholder = 'Enter email address',
  submitLabel = 'Send Invitation',
  className = '',
  style,
  testID,
}) => {
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<EntityRole>(defaultRole);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async () => {
    // Validate email
    const trimmedEmail = email.trim();
    
    if (!trimmedEmail) {
      setError('Email address is required');
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit(trimmedEmail, selectedRole);
      // Clear form on success
      setEmail('');
      setSelectedRole(defaultRole);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send invitation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDisabled = disabled || loading || isSubmitting;
  const canSubmit = email.trim().length > 0 && !isDisabled;

  return (
    <View className={`${className}`} style={style} testID={testID}>
      {/* Email Input */}
      <View className="mb-4">
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Email Address
        </Text>
        <TextInput
          value={email}
          onChangeText={handleEmailChange}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          editable={!isDisabled}
          className={`
            px-4 py-3 rounded-xl
            bg-white dark:bg-gray-800
            border ${error ? 'border-red-500' : 'border-gray-200 dark:border-gray-700'}
            text-gray-900 dark:text-white
            ${isDisabled ? 'opacity-50' : ''}
          `}
          accessibilityLabel="Email address input"
          accessibilityHint="Enter the email address of the person you want to invite"
        />
        {error && (
          <Text className="text-sm text-red-500 dark:text-red-400 mt-1">
            {error}
          </Text>
        )}
      </View>

      {/* Role Selector */}
      <View className="mb-4">
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Role
        </Text>
        <MemberRoleSelector
          selectedRole={selectedRole}
          onRoleChange={setSelectedRole}
          availableRoles={availableRoles}
          disabled={isDisabled}
          showDescriptions
        />
      </View>

      {/* Submit Button */}
      <Pressable
        onPress={handleSubmit}
        disabled={!canSubmit}
        className={`
          flex-row items-center justify-center px-6 py-4 rounded-xl
          ${canSubmit ? 'bg-blue-500 dark:bg-blue-600 active:bg-blue-600 dark:active:bg-blue-700' : 'bg-gray-300 dark:bg-gray-600'}
        `}
        accessibilityRole="button"
        accessibilityLabel={submitLabel}
        accessibilityState={{ disabled: !canSubmit }}
      >
        {isSubmitting ? (
          <>
            <ActivityIndicator size="small" color="#FFFFFF" />
            <Text className="text-white font-semibold ml-2">Sending...</Text>
          </>
        ) : (
          <Text className={`font-semibold ${canSubmit ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}>
            {submitLabel}
          </Text>
        )}
      </Pressable>

      {/* Help Text */}
      <Text className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
        The invitee will receive an email with instructions to join.
      </Text>
    </View>
  );
};

export default InvitationForm;
