import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface CrmDashboardProps extends ViewProps {
  disabled?: boolean;
  children?: React.ReactNode;
}

/**
 * CrmDashboard component for React Native
 * CRM dashboard display container
 */
export const CrmDashboard: React.FC<CrmDashboardProps> = ({
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
      accessibilityLabel="CRM Dashboard"
      {...props}
    >
      {children || (
        <Text className="text-gray-900 dark:text-white">
          CrmDashboard Component
        </Text>
      )}
    </View>
  );
};
