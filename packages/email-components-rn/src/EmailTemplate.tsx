import React from 'react';
import { Text, Pressable, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';
import { getCardVariantColors } from '@sudobility/design';
import { pressProps } from '@sudobility/components-rn';

export interface EmailTemplateProps extends ViewProps {
  disabled?: boolean;
  onPress?: () => void;
  children?: React.ReactNode;
}

/**
 * EmailTemplate component for React Native
 * Email template display container
 */
export const EmailTemplate: React.FC<EmailTemplateProps> = ({
  className,
  children,
  disabled = false,
  onPress,
  ...props
}) => {
  return (
    <Pressable
      {...pressProps(disabled ? undefined : onPress, disabled)}
      disabled={disabled}
      accessibilityRole='button'
      accessibilityLabel='Email Template'
      accessibilityState={{ disabled }}
      className={cn(
        'p-4 rounded-lg',
        getCardVariantColors('bordered'),
        disabled && 'opacity-50',
        'active:bg-muted',
        className
      )}
      {...props}
    >
      {children || (
        <Text className='text-foreground'>EmailTemplate Component</Text>
      )}
    </Pressable>
  );
};
