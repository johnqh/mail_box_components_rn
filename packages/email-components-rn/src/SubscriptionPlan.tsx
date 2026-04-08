import React from 'react';
import { Text, Pressable, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';
import { getCardVariantColors } from '@sudobility/design';

export interface SubscriptionPlanProps extends ViewProps {
  disabled?: boolean;
  onPress?: () => void;
  children?: React.ReactNode;
}

/**
 * SubscriptionPlan component for React Native
 * Subscription plan display container
 */
export const SubscriptionPlan: React.FC<SubscriptionPlanProps> = ({
  className,
  children,
  disabled = false,
  onPress,
  ...props
}) => {
  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      accessibilityRole='button'
      accessibilityLabel='Subscription Plan'
      accessibilityState={{ disabled }}
      className={cn(
        'p-4 rounded-lg',
        getCardVariantColors('bordered'),
        disabled && 'opacity-50',
        'active:bg-gray-50 dark:active:bg-gray-800',
        className
      )}
      {...props}
    >
      {children || (
        <Text className='text-gray-900 dark:text-white'>
          SubscriptionPlan Component
        </Text>
      )}
    </Pressable>
  );
};
