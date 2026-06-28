import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';
import { getCardVariantColors } from '@sudobility/design';

export interface ChangelogDisplayProps extends ViewProps {
  disabled?: boolean;
  children?: React.ReactNode;
}

export const ChangelogDisplay: React.FC<ChangelogDisplayProps> = ({
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
    accessibilityLabel='Changelog Display'
    {...props}
  >
    {children || (
      <Text className='text-foreground'>
        ChangelogDisplay Component
      </Text>
    )}
  </View>
);
