import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface SalesReportProps extends ViewProps {
  disabled?: boolean;
  children?: React.ReactNode;
}

/**
 * SalesReport component for React Native
 * Sales report display container
 */
export const SalesReport: React.FC<SalesReportProps> = ({
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
      accessibilityLabel="Sales Report"
      {...props}
    >
      {children || (
        <Text className="text-gray-900 dark:text-white">
          SalesReport Component
        </Text>
      )}
    </View>
  );
};
