import React from 'react';
import { View, Text, TextInput, Pressable, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface EmailInputFieldProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
}

export const EmailInputField: React.FC<EmailInputFieldProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  required = false,
  error,
  className,
}) => {
  return (
    <View className={className}>
      <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label} {required && <Text className="text-red-500">*</Text>}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        accessibilityLabel={label}
        className={cn(
          'px-3 py-2 border rounded-md',
          'bg-white dark:bg-gray-800',
          'text-gray-900 dark:text-white',
          error
            ? 'border-red-300 dark:border-red-600'
            : 'border-gray-300 dark:border-gray-600'
        )}
      />
      {error && (
        <Text className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </Text>
      )}
    </View>
  );
};

export interface CollapsibleEmailFieldProps extends EmailInputFieldProps {
  isVisible: boolean;
  onToggle: () => void;
  showLabel?: string;
  hideLabel?: string;
}

export const CollapsibleEmailField: React.FC<CollapsibleEmailFieldProps> = ({
  isVisible,
  onToggle,
  showLabel,
  hideLabel,
  ...fieldProps
}) => {
  const toggleLabel = isVisible ? hideLabel : showLabel;

  return (
    <View>
      <Pressable
        onPress={onToggle}
        accessibilityRole="button"
        className="flex-row items-center mb-2"
      >
        <Text className="text-sm text-blue-600 dark:text-blue-400">
          {isVisible ? '▲' : '▼'} {toggleLabel}
        </Text>
      </Pressable>

      {isVisible && <EmailInputField {...fieldProps} />}
    </View>
  );
};

export interface EmailInputGroupProps extends ViewProps {
  to: string;
  onToChange: (value: string) => void;
  cc?: string;
  onCcChange?: (value: string) => void;
  bcc?: string;
  onBccChange?: (value: string) => void;
  showCc?: boolean;
  showBcc?: boolean;
  onToggleCc?: () => void;
  onToggleBcc?: () => void;
  errors?: {
    to?: string;
    cc?: string;
    bcc?: string;
  };
  labels?: {
    to?: string;
    cc?: string;
    bcc?: string;
    addCc?: string;
    removeCc?: string;
    addBcc?: string;
    removeBcc?: string;
  };
  placeholders?: {
    to?: string;
    cc?: string;
    bcc?: string;
  };
}

/**
 * EmailInputGroup component for React Native
 * Group of email input fields with collapsible CC/BCC
 */
export const EmailInputGroup: React.FC<EmailInputGroupProps> = ({
  to,
  onToChange,
  cc = '',
  onCcChange,
  bcc = '',
  onBccChange,
  showCc = false,
  showBcc = false,
  onToggleCc,
  onToggleBcc,
  errors = {},
  className,
  labels = {},
  placeholders = {},
  ...props
}) => {
  const defaultLabels = {
    to: 'To',
    cc: 'CC',
    bcc: 'BCC',
    addCc: 'Add CC',
    removeCc: 'Remove CC',
    addBcc: 'Add BCC',
    removeBcc: 'Remove BCC',
  };

  const defaultPlaceholders = {
    to: 'recipient@example.com',
    cc: 'cc@example.com',
    bcc: 'bcc@example.com',
  };

  const finalLabels = { ...defaultLabels, ...labels };
  const finalPlaceholders = { ...defaultPlaceholders, ...placeholders };

  return (
    <View className={cn('gap-4', className)} {...props}>
      {/* To Field - Always visible */}
      <EmailInputField
        label={finalLabels.to}
        value={to}
        onChangeText={onToChange}
        placeholder={finalPlaceholders.to}
        required
        error={errors.to}
      />

      {/* CC Field - Collapsible */}
      {onToggleCc && onCcChange && (
        <CollapsibleEmailField
          label={finalLabels.cc}
          value={cc}
          onChangeText={onCcChange}
          placeholder={finalPlaceholders.cc}
          error={errors.cc}
          isVisible={showCc}
          onToggle={onToggleCc}
          showLabel={finalLabels.addCc}
          hideLabel={finalLabels.removeCc}
        />
      )}

      {/* BCC Field - Collapsible */}
      {onToggleBcc && onBccChange && (
        <CollapsibleEmailField
          label={finalLabels.bcc}
          value={bcc}
          onChangeText={onBccChange}
          placeholder={finalPlaceholders.bcc}
          error={errors.bcc}
          isVisible={showBcc}
          onToggle={onToggleBcc}
          showLabel={finalLabels.addBcc}
          hideLabel={finalLabels.removeBcc}
        />
      )}
    </View>
  );
};
