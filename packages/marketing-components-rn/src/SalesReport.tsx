import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';
import { getCardVariantColors } from '@sudobility/design';

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
        'p-4 rounded-lg',
        getCardVariantColors('bordered'),
        disabled && 'opacity-50',
        className
      )}
      accessibilityLabel='Sales Report'
      {...props}
    >
      {children || (
        <Text className='text-foreground'>
          SalesReport Component
        </Text>
      )}
    </View>
  );
};
