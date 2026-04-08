import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';
import { getCardVariantColors } from '@sudobility/design';

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
      'p-4 rounded-lg',
      getCardVariantColors('bordered'),
      disabled && 'opacity-50',
      className
    )}
    accessibilityLabel='Driver Log'
    {...props}
  >
    {children || (
      <Text className='text-gray-900 dark:text-white'>DriverLog Component</Text>
    )}
  </View>
);
