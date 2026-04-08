import React from 'react';
import { Text, Pressable, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';
import { getCardVariantColors } from '@sudobility/design';

export interface WorkflowTemplateProps extends ViewProps {
  disabled?: boolean;
  onPress?: () => void;
  children?: React.ReactNode;
}

export const WorkflowTemplate: React.FC<WorkflowTemplateProps> = ({
  className,
  children,
  disabled = false,
  onPress,
  ...props
}) => (
  <Pressable
    onPress={disabled ? undefined : onPress}
    disabled={disabled}
    accessibilityRole='button'
    accessibilityLabel='Workflow Template'
    className={cn(
      'p-4 rounded-lg',
      getCardVariantColors('bordered'),
      disabled && 'opacity-50',
      className
    )}
    {...props}
  >
    {children || (
      <Text className='text-gray-900 dark:text-white'>
        WorkflowTemplate Component
      </Text>
    )}
  </Pressable>
);
