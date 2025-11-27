import * as React from 'react';
import { View, Text, Pressable } from 'react-native';
import { cn } from '../../lib/utils';

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
        'bg-green-50 dark:bg-green-900/20',
        'border-b border-green-200 dark:border-green-700',
        isProminent && 'border-b-2',
        className
      )}
    >
      <View className='px-4 py-4'>
        <View className='flex-row items-center justify-between gap-4 flex-wrap'>
          {/* Left side: Badge + Title */}
          <View className='flex-row items-center flex-1'>
            {/* Badge */}
            <View className='bg-green-500 px-3 py-1 rounded-full mr-3'>
              <Text className='text-white text-xs font-bold'>{badgeText}</Text>
            </View>

            {/* Title & Subtitle */}
            <View className='flex-1'>
              <Text
                className={cn(
                  'text-green-800 dark:text-green-200 font-semibold',
                  isProminent && 'text-lg'
                )}
              >
                {title}
              </Text>
              {subtitle && (
                <Text className='text-green-700 dark:text-green-300 text-sm'>
                  {subtitle}
                </Text>
              )}
            </View>
          </View>

          {/* CTA Button */}
          <Pressable
            onPress={onButtonPress}
            className={cn(
              'bg-green-600 dark:bg-green-700 rounded-lg',
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
