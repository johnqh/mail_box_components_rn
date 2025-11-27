import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface DriverLogProps extends ViewProps {
  disabled?: boolean;
  children?: React.ReactNode;
}

export const DriverLog: React.FC<DriverLogProps> = ({
  className,
  children,
  disabled,
  ...props
}) => (
  <View
    className={cn(
      'p-4 rounded-lg border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700',
      disabled && 'opacity-50',
      className
    )}
    accessibilityLabel="Driver Log"
    {...props}
  >
    {children || <Text className="text-gray-900 dark:text-white">DriverLog Component</Text>}
  </View>
);
