import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface SubscriberListProps extends ViewProps {
  disabled?: boolean;
  children?: React.ReactNode;
}

/**
 * SubscriberList component for React Native
 * Email subscriber list display container
 */
export const SubscriberList: React.FC<SubscriberListProps> = ({
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
      accessibilityLabel="Subscriber List"
      {...props}
    >
      {children || (
        <Text className="text-gray-900 dark:text-white">
          SubscriberList Component
        </Text>
      )}
    </View>
  );
};
