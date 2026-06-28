import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';
import { getCardVariantColors } from '@sudobility/design';

export interface EmailCampaignProps extends ViewProps {
  disabled?: boolean;
  children?: React.ReactNode;
}

/**
 * EmailCampaign component for React Native
 * Email campaign display container
 */
export const EmailCampaign: React.FC<EmailCampaignProps> = ({
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
      accessibilityLabel='Email Campaign'
      {...props}
    >
      {children || (
        <Text className='text-foreground'>EmailCampaign Component</Text>
      )}
    </View>
  );
};
