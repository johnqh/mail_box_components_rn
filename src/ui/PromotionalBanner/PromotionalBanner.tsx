import * as React from 'react';
import { View, Text, Pressable } from 'react-native';
import { cn } from '../../lib/utils';
import { colors } from '@sudobility/design';

export interface PromotionalBannerProps {
  /** Banner title */
  title: string;
  /** Optional subtitle */
  subtitle?: string;
  /** Button text */
  buttonText: string;
  /** Button press handler */
  onButtonPress: () => void;
  /** Visual variant */
  variant?: 'default' | 'prominent';
  /** Badge text */
  badgeText?: string;
  /** Icon element (optional) */
  icon?: React.ReactNode;
  /** Additional className */
  className?: string;
}

/**
 * PromotionalBanner Component
 *
 * Banner for promotions, announcements, or CTAs.
 *
 * @example
 * ```tsx
 * <PromotionalBanner
 *   title="Get Started Free"
 *   subtitle="No credit card required"
 *   buttonText="Sign Up"
 *   onButtonPress={handleSignUp}
 *   badgeText="FREE"
 * />
 * ```
 */
export const PromotionalBanner: React.FC<PromotionalBannerProps> = ({
  title,
  subtitle,
  buttonText,
  onButtonPress,
  variant = 'default',
  badgeText = 'FREE',
  icon,
  className,
}) => {
  const isProminent = variant === 'prominent';

  return (
    <View
      className={cn(
        // Derive green palette from DS alert.success colors
        colors.component.alert.success.base,
        colors.component.alert.success.dark,
        'border-b',
        isProminent && 'border-b-2',
        className
      )}
    >
      <View className='px-4 py-4'>
        <View className='flex-row items-center justify-between gap-4 flex-wrap'>
          {/* Left side: Badge + Title */}
          <View className='flex-row items-center flex-1'>
            {/* Badge -- green-500 from colors.raw.green */}
            <View className='bg-success px-3 py-1 rounded-full mr-3'>
              <Text className='text-white text-xs font-bold'>{badgeText}</Text>
            </View>

            {/* Title & Subtitle */}
            <View className='flex-1'>
              <Text
                className={cn(
                  'text-success font-semibold',
                  isProminent && 'text-lg'
                )}
              >
                {title}
              </Text>
              {subtitle && (
                <Text className='text-success text-sm'>{subtitle}</Text>
              )}
            </View>
          </View>

          {/* CTA Button -- success button from DS */}
          <Pressable
            onPress={onButtonPress}
            className={cn(
              'bg-success  rounded-lg',
              'flex-row items-center',
              isProminent ? 'px-6 py-3' : 'px-4 py-2'
            )}
            accessibilityRole='button'
            accessibilityLabel={buttonText}
          >
            {icon && <View className='mr-2'>{icon}</View>}
            <Text
              className={cn(
                'text-white font-bold',
                isProminent ? 'text-base' : 'text-sm'
              )}
            >
              {buttonText}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};
