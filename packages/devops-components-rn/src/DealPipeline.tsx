import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';
import { getCardVariantColors } from '@sudobility/design';

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
      'p-4 rounded-lg',
      getCardVariantColors('bordered'),
      disabled && 'opacity-50',
      className
    )}
    accessibilityLabel='Deal Pipeline'
    {...props}
  >
    {children || (
      <Text className='text-foreground'>DealPipeline Component</Text>
    )}
  </View>
);
