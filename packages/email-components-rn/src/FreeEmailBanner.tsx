import React from 'react';
import { View, Text, Pressable, Linking, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';
import { colors } from '@sudobility/design';

type BannerVariant = 'default' | 'compact' | 'minimal' | 'vibrant';
type BannerSize = 'default' | 'compact' | 'large';

export interface FreeEmailBannerProps extends ViewProps {
  variant?: BannerVariant;
  size?: BannerSize;
  message?: string;
  ctaText?: string;
  ctaLink?: string;
  showBadge?: boolean;
  badgeText?: string;
  onDismiss?: () => void;
  isDismissible?: boolean;
  dismissAriaLabel?: string;
  onCtaPress?: () => void;
}

const getBannerStyle = (variant: BannerVariant) => {
  switch (variant) {
    case 'compact':
      return `${colors.component.card.success.base} ${colors.component.card.success.dark}`;
    case 'minimal':
      return 'bg-muted/50 border-border';
    case 'vibrant':
      return 'bg-primary border-primary';
    default:
      return `${colors.component.badge.success.base} ${colors.component.badge.success.dark} border-success/20`;
  }
};

const getSizeStyle = (size: BannerSize) => {
  switch (size) {
    case 'compact':
      return 'py-3';
    case 'large':
      return 'py-6';
    default:
      return 'py-4';
  }
};

const getTextStyle = (variant: BannerVariant) => {
  switch (variant) {
    case 'compact':
      return `${colors.component.card.success.text}`;
    case 'minimal':
      return 'text-muted-foreground';
    case 'vibrant':
      return 'text-white';
    default:
      return `${colors.component.card.success.text}`;
  }
};

const getButtonStyle = (variant: BannerVariant) => {
  switch (variant) {
    case 'compact':
      return 'bg-success active:bg-success';
    case 'minimal':
      return 'bg-primary active:bg-primary/90';
    case 'vibrant':
      return 'bg-white active:bg-muted';
    default:
      return 'bg-success active:bg-success';
  }
};

const getButtonTextStyle = (variant: BannerVariant) => {
  if (variant === 'vibrant') {
    return 'text-primary';
  }
  return 'text-white';
};

/**
 * FreeEmailBanner component for React Native
 * Promotional banner for free email signup
 */
export const FreeEmailBanner: React.FC<FreeEmailBannerProps> = ({
  className,
  variant = 'default',
  size = 'default',
  message = 'Get Your Free Email Address - Start Using Web3 Email Today',
  ctaText = 'Get Free Email',
  ctaLink = '/connect',
  showBadge = true,
  badgeText = 'FREE',
  onDismiss,
  isDismissible = false,
  dismissAriaLabel = 'Dismiss banner',
  onCtaPress,
  ...props
}) => {
  const handleCtaPress = () => {
    if (onCtaPress) {
      onCtaPress();
    } else if (ctaLink.startsWith('http')) {
      Linking.openURL(ctaLink);
    }
  };

  return (
    <View
      className={cn(
        'border-b px-4',
        getBannerStyle(variant),
        getSizeStyle(size),
        className
      )}
      accessibilityLabel='Free Email Banner'
      {...props}
    >
      <View className='items-center gap-4'>
        {isDismissible && onDismiss && (
          <Pressable
            onPress={onDismiss}
            accessibilityRole='button'
            accessibilityLabel={dismissAriaLabel}
            className='absolute right-2 top-2 p-1 rounded-full'
          >
            <Text className='text-current opacity-60'>✕</Text>
          </Pressable>
        )}

        <View className='flex-row items-center justify-center flex-wrap gap-2'>
          {showBadge && (
            <View
              className={cn(
                'px-3 py-1 rounded-full',
                variant === 'vibrant' ? 'bg-white' : 'bg-success'
              )}
            >
              <Text
                className={cn(
                  'text-xs font-bold',
                  variant === 'vibrant' ? 'text-primary' : 'text-white'
                )}
              >
                {badgeText}
              </Text>
            </View>
          )}
          <Text
            className={cn('font-semibold text-center', getTextStyle(variant))}
          >
            {message}
          </Text>
        </View>

        <Pressable
          onPress={handleCtaPress}
          accessibilityRole='button'
          className={cn('px-6 py-2 rounded-lg', getButtonStyle(variant))}
        >
          <Text className={cn('font-medium', getButtonTextStyle(variant))}>
            {ctaText}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};
