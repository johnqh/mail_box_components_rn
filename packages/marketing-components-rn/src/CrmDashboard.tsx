import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';
import { getCardVariantColors } from '@sudobility/design';

export interface CrmDashboardProps extends ViewProps {
  disabled?: boolean;
  children?: React.ReactNode;
}

/**
 * CrmDashboard component for React Native
 * CRM dashboard display container
 */
export const CrmDashboard: React.FC<CrmDashboardProps> = ({
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
      accessibilityLabel='CRM Dashboard'
      {...props}
    >
      {children || (
        <Text className='text-foreground'>CrmDashboard Component</Text>
      )}
    </View>
  );
};
