import React from 'react';
import { Text, Pressable, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';
import { getCardVariantColors } from '@sudobility/design';
import { pressProps } from '@sudobility/components-rn';

export interface FeatureSpotlightProps extends ViewProps {
  disabled?: boolean;
  onPress?: () => void;
  children?: React.ReactNode;
}

/**
 * FeatureSpotlight component for React Native
 * Feature spotlight display
 */
export const FeatureSpotlight: React.FC<FeatureSpotlightProps> = ({
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
      accessibilityLabel='Feature Spotlight'
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
        <Text className='text-foreground'>FeatureSpotlight Component</Text>
      )}
    </Pressable>
  );
};
