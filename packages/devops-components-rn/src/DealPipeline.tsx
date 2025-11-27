import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface DealPipelineProps extends ViewProps {
  disabled?: boolean;
  children?: React.ReactNode;
}

export const DealPipeline: React.FC<DealPipelineProps> = ({
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
    accessibilityLabel="Deal Pipeline"
    {...props}
  >
    {children || <Text className="text-gray-900 dark:text-white">DealPipeline Component</Text>}
  </View>
);
