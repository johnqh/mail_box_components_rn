import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';
import { getCardVariantColors } from '@sudobility/design';

export interface TestResultProps extends ViewProps {
  disabled?: boolean;
  children?: React.ReactNode;
}

export const TestResult: React.FC<TestResultProps> = ({
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
    accessibilityLabel='Test Result'
    {...props}
  >
    {children || (
      <Text className='text-foreground'>
        TestResult Component
      </Text>
    )}
  </View>
);
