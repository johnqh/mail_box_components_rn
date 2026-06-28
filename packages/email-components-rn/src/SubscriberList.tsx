import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';
import { getCardVariantColors } from '@sudobility/design';

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
        'p-4 rounded-lg',
        getCardVariantColors('bordered'),
        disabled && 'opacity-50',
        className
      )}
      accessibilityLabel='Subscriber List'
      {...props}
    >
      {children || (
        <Text className='text-foreground'>SubscriberList Component</Text>
      )}
    </View>
  );
};
