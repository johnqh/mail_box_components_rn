import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';
import { getCardVariantColors } from '@sudobility/design';

export interface BodyMetricsProps extends ViewProps {
  disabled?: boolean;
  children?: React.ReactNode;
}

export const BodyMetrics: React.FC<BodyMetricsProps> = ({
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
    accessibilityLabel='Body Metrics'
    {...props}
  >
    {children || (
      <Text className='text-foreground'>
        BodyMetrics Component
      </Text>
    )}
  </View>
);
