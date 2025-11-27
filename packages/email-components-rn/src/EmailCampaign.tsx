import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface EmailCampaignProps extends ViewProps {
  disabled?: boolean;
  children?: React.ReactNode;
}

/**
 * EmailCampaign component for React Native
 * Email campaign display container
 */
export const EmailCampaign: React.FC<EmailCampaignProps> = ({
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
      accessibilityLabel="Email Campaign"
      {...props}
    >
      {children || (
        <Text className="text-gray-900 dark:text-white">
          EmailCampaign Component
        </Text>
      )}
    </View>
  );
};
