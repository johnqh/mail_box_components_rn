import React from 'react';
import { Text, Pressable, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';
import { getCardVariantColors } from '@sudobility/design';

export interface NftGalleryProps extends ViewProps {
  disabled?: boolean;
  onPress?: () => void;
  children?: React.ReactNode;
}

/**
 * NftGallery component for React Native
 * A container for NFT gallery display
 */
export const NftGallery: React.FC<NftGalleryProps> = ({
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
      accessibilityLabel='NFT Gallery'
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
          NFT Gallery Component
        </Text>
      )}
    </Pressable>
  );
};
