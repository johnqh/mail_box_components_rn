import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';
import { getCardVariantColors } from '@sudobility/design';

export interface AbTestEmailProps extends ViewProps {
  disabled?: boolean;
  children?: React.ReactNode;
}

/**
 * AbTestEmail component for React Native
 * Email A/B testing container
 */
export const AbTestEmail: React.FC<AbTestEmailProps> = ({
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
      accessibilityLabel='AB Test Email'
      {...props}
    >
      {children || (
        <Text className='text-foreground'>AbTestEmail Component</Text>
      )}
    </View>
  );
};
