import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';
import { getCardVariantColors } from '@sudobility/design';

export interface ApiReferenceProps extends ViewProps {
  disabled?: boolean;
  children?: React.ReactNode;
}

export const ApiReference: React.FC<ApiReferenceProps> = ({
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
    accessibilityLabel='API Reference'
    {...props}
  >
    {children || (
      <Text className='text-gray-900 dark:text-white'>
        ApiReference Component
      </Text>
    )}
  </View>
);
