import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface AbTestEmailProps extends ViewProps {
  disabled?: boolean;
  children?: React.ReactNode;
}

/**
 * AbTestEmail component for React Native
 * Email A/B testing container
 */
export const AbTestEmail: React.FC<AbTestEmailProps> = ({
  className,
  children,
  disabled,
  ...props
}) => {
  return (
    <View
      className={cn(
        'p-4 rounded-lg border',
        'bg-white dark:bg-gray-900',
        'border-gray-200 dark:border-gray-700',
        disabled && 'opacity-50',
        className
      )}
      accessibilityLabel="AB Test Email"
      {...props}
    >
      {children || (
        <Text className="text-gray-900 dark:text-white">
          AbTestEmail Component
        </Text>
      )}
    </View>
  );
};
