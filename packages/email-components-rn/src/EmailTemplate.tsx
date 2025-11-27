import React from 'react';
import { Text, Pressable, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface EmailTemplateProps extends ViewProps {
  disabled?: boolean;
  onPress?: () => void;
  children?: React.ReactNode;
}

/**
 * EmailTemplate component for React Native
 * Email template display container
 */
export const EmailTemplate: React.FC<EmailTemplateProps> = ({
  className,
  children,
  disabled = false,
  onPress,
  ...props
}) => {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel="Email Template"
      accessibilityState={{ disabled }}
      className={cn(
        'p-4 rounded-lg border',
        'bg-white dark:bg-gray-900',
        'border-gray-200 dark:border-gray-700',
        disabled && 'opacity-50',
        'active:bg-gray-50 dark:active:bg-gray-800',
        className
      )}
      {...props}
    >
      {children || (
        <Text className="text-gray-900 dark:text-white">
          EmailTemplate Component
        </Text>
      )}
    </Pressable>
  );
};
