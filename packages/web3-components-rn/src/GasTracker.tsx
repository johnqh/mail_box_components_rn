import React from 'react';
import { Text, Pressable, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';
import { getCardVariantColors } from '@sudobility/design';

export interface GasTrackerProps extends ViewProps {
  disabled?: boolean;
  onPress?: () => void;
  children?: React.ReactNode;
}

/**
 * GasTracker component for React Native
 * A container for gas price tracking display
 */
export const GasTracker: React.FC<GasTrackerProps> = ({
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
      accessibilityLabel='Gas Tracker'
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
        <Text className='text-foreground'>
          Gas Tracker Component
        </Text>
      )}
    </Pressable>
  );
};
