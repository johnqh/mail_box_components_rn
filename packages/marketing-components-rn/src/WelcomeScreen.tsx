import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn, Button } from '@sudobility/components-rn';
import { textVariants } from '@sudobility/design';

export interface WelcomeScreenProps extends ViewProps {
  title: string;
  subtitle?: string;
  description?: string;
  illustration?: React.ReactNode;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryPress?: () => void;
  onSecondaryPress?: () => void;
}

/**
 * Welcome screen component for onboarding flows
 */
export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  title,
  subtitle,
  description,
  illustration,
  primaryButtonText = 'Get Started',
  secondaryButtonText,
  onPrimaryPress,
  onSecondaryPress,
  className,
  ...props
}) => {
  return (
    <View
      className={cn('flex-1 items-center justify-center px-6 py-12', className)}
      {...props}
    >
      {illustration && <View className='mb-8'>{illustration}</View>}

      {subtitle && (
        <Text className={cn(textVariants.caption.uppercase(), 'text-primary mb-2')}>
          {subtitle}
        </Text>
      )}

      <Text className={cn(textVariants.heading.h2(), 'text-center mb-4')}>
        {title}
      </Text>

      {description && (
        <Text className={cn(textVariants.body.md(), 'text-center mb-8 max-w-sm')}>
          {description}
        </Text>
      )}

      <View className='w-full max-w-xs gap-3'>
        <Button
          variant='primary'
          size='lg'
          onPress={onPrimaryPress}
          className='w-full'
        >
          {primaryButtonText}
        </Button>

        {secondaryButtonText && (
          <Button
            variant='ghost'
            size='lg'
            onPress={onSecondaryPress}
            className='w-full'
          >
            {secondaryButtonText}
          </Button>
        )}
      </View>
    </View>
  );
};
