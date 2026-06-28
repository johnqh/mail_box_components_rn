import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';
import { getCardVariantColors } from '@sudobility/design';

export interface XmlParserProps extends ViewProps {
  disabled?: boolean;
  children?: React.ReactNode;
}

export const XmlParser: React.FC<XmlParserProps> = ({
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
    accessibilityLabel='XML Parser'
    {...props}
  >
    {children || <Text className='text-foreground'>XmlParser Component</Text>}
  </View>
);
