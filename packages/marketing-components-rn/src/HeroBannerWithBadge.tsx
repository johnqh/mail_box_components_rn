import React from 'react';
import { View, Text, Pressable, Linking, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';
import { colors, textVariants } from '@sudobility/design';

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
  blue: `${colors.component.badge.primary.base} ${colors.component.badge.primary.dark} border-primary/30`,
  green: `${colors.component.badge.success.base} ${colors.component.badge.success.dark} border-success/30`,
  purple: 'bg-accent border-accent',
  orange: `${colors.component.badge.warning.base} ${colors.component.badge.warning.dark} border-warning/30`,
  pink: 'bg-secondary border-secondary',
  gray: `${colors.component.badge.default.base} ${colors.component.badge.default.dark} border-border`,
};

const badgeTextClasses: Record<BadgeColor, string> = {
  blue: 'text-primary dark:text-primary-foreground',
  green: 'text-success',
  purple: 'text-accent-foreground ',
  orange: 'text-warning ',
  pink: 'text-secondary-foreground ',
  gray: 'text-foreground',
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
      <View className='items-center'>
        {/* Badge */}
        <View
          className={cn(
            'flex-row items-center border px-6 py-3 rounded-full mb-6',
            badgeColorClasses[badgeColor]
          )}
        >
          {badgeIcon && <View className='mr-3'>{badgeIcon}</View>}
          <Text className={cn('font-semibold', badgeTextClasses[badgeColor])}>
            {badgeText}
          </Text>
        </View>

        {/* Title */}
        <Text className={cn(textVariants.heading.h2(), 'mb-2 text-center')}>
          {typeof title === 'string' ? title : null}
        </Text>
        {typeof title !== 'string' && title}

        {subtitle && (
          <Text className='text-2xl font-bold text-primary mb-6 text-center'>
            {subtitle}
          </Text>
        )}

        {/* Description */}
        <Text className={cn(textVariants.lead.md(), 'mb-8 text-center max-w-lg')}>
          {description}
        </Text>

        {/* Buttons */}
        {(primaryButton || secondaryButton) && (
          <View className='flex-row flex-wrap gap-4 justify-center mb-8'>
            {primaryButton && (
              <Pressable
                onPress={() => handleButtonPress(primaryButton)}
                accessibilityRole='button'
                className='px-8 py-3 rounded-md bg-primary active:bg-primary/90'
              >
                <Text className='text-white font-medium'>
                  {primaryButton.text}
                </Text>
              </Pressable>
            )}
            {secondaryButton && (
              <Pressable
                onPress={() => handleButtonPress(secondaryButton)}
                accessibilityRole='button'
                className='px-8 py-3 rounded-md border-2 border-border active:border-border'
              >
                <Text className='text-foreground font-medium'>
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
