import React from 'react';
import { View, Text, Pressable, Linking, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface ButtonConfig {
  text: string;
  onPress?: () => void;
  href?: string;
  className?: string;
}

type BadgeColor = 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'gray';

export interface HeroBannerWithBadgeProps extends ViewProps {
  badgeIcon?: React.ReactNode;
  badgeText: string;
  badgeColor?: BadgeColor;
  title: string | React.ReactNode;
  subtitle?: string;
  description: string;
  primaryButton?: ButtonConfig;
  secondaryButton?: ButtonConfig;
  children?: React.ReactNode;
}

const badgeColorClasses: Record<BadgeColor, string> = {
  blue: 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700',
  green: 'bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700',
  purple: 'bg-purple-100 dark:bg-purple-900/30 border-purple-300 dark:border-purple-700',
  orange: 'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700',
  pink: 'bg-pink-100 dark:bg-pink-900/30 border-pink-300 dark:border-pink-700',
  gray: 'bg-gray-100 dark:bg-gray-900/30 border-gray-300 dark:border-gray-700',
};

const badgeTextClasses: Record<BadgeColor, string> = {
  blue: 'text-blue-800 dark:text-blue-200',
  green: 'text-green-800 dark:text-green-200',
  purple: 'text-purple-800 dark:text-purple-200',
  orange: 'text-orange-800 dark:text-orange-200',
  pink: 'text-pink-800 dark:text-pink-200',
  gray: 'text-gray-800 dark:text-gray-200',
};

/**
 * HeroBannerWithBadge component for React Native
 * Hero banner with badge and CTA buttons
 */
export const HeroBannerWithBadge: React.FC<HeroBannerWithBadgeProps> = ({
  badgeIcon,
  badgeText,
  badgeColor = 'blue',
  title,
  subtitle,
  description,
  primaryButton,
  secondaryButton,
  className,
  children,
  ...props
}) => {
  const handleButtonPress = (button: ButtonConfig) => {
    if (button.onPress) {
      button.onPress();
    } else if (button.href) {
      Linking.openURL(button.href);
    }
  };

  return (
    <View className={cn('py-12 px-4', className)} {...props}>
      <View className="items-center">
        {/* Badge */}
        <View
          className={cn(
            'flex-row items-center border px-6 py-3 rounded-full mb-6',
            badgeColorClasses[badgeColor]
          )}
        >
          {badgeIcon && <View className="mr-3">{badgeIcon}</View>}
          <Text className={cn('font-semibold', badgeTextClasses[badgeColor])}>
            {badgeText}
          </Text>
        </View>

        {/* Title */}
        <Text className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2 text-center">
          {typeof title === 'string' ? title : null}
        </Text>
        {typeof title !== 'string' && title}

        {subtitle && (
          <Text className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-6 text-center">
            {subtitle}
          </Text>
        )}

        {/* Description */}
        <Text className="text-lg text-gray-600 dark:text-gray-300 mb-8 text-center max-w-lg">
          {description}
        </Text>

        {/* Buttons */}
        {(primaryButton || secondaryButton) && (
          <View className="flex-row flex-wrap gap-4 justify-center mb-8">
            {primaryButton && (
              <Pressable
                onPress={() => handleButtonPress(primaryButton)}
                accessibilityRole="button"
                className="px-8 py-3 rounded-md bg-blue-600 active:bg-blue-700"
              >
                <Text className="text-white font-medium">
                  {primaryButton.text}
                </Text>
              </Pressable>
            )}
            {secondaryButton && (
              <Pressable
                onPress={() => handleButtonPress(secondaryButton)}
                accessibilityRole="button"
                className="px-8 py-3 rounded-md border-2 border-gray-300 dark:border-gray-600 active:border-gray-400"
              >
                <Text className="text-gray-900 dark:text-white font-medium">
                  {secondaryButton.text}
                </Text>
              </Pressable>
            )}
          </View>
        )}

        {children}
      </View>
    </View>
  );
};
