import * as React from 'react';
import { View, Text, Pressable } from 'react-native';
import { cn } from '../../lib/utils';

export interface CTAButton {
  /** Button label */
  label: string;
  /** Press handler */
  onPress: () => void;
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'outline';
}

export interface CTASectionProps {
  /** Section title */
  title: string;
  /** Section description */
  description: string;
  /** Primary CTA button */
  primaryButton: CTAButton;
  /** Secondary CTA button */
  secondaryButton?: CTAButton;
  /** Gradient preset */
  gradient?: 'blue-purple' | 'green-blue' | 'orange-red' | 'purple-pink';
  /** Text color theme */
  textColor?: 'light' | 'dark';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional className */
  className?: string;
}

/**
 * CTASection Component
 *
 * Call-to-action section with gradient background and buttons.
 *
 * @example
 * ```tsx
 * <CTASection
 *   title="Ready to get started?"
 *   description="Join thousands of users today."
 *   primaryButton={{ label: 'Sign Up', onPress: handleSignUp }}
 *   secondaryButton={{ label: 'Learn More', onPress: handleLearnMore }}
 * />
 * ```
 */
export const CTASection: React.FC<CTASectionProps> = ({
  title,
  description,
  primaryButton,
  secondaryButton,
  gradient = 'blue-purple',
  textColor = 'light',
  size = 'lg',
  className,
}) => {
  const gradientClasses = {
    'blue-purple': 'bg-blue-600 dark:bg-blue-700',
    'green-blue': 'bg-green-600 dark:bg-green-700',
    'orange-red': 'bg-orange-600 dark:bg-orange-700',
    'purple-pink': 'bg-purple-600 dark:bg-purple-700',
  };

  const sizeClasses = {
    sm: 'py-8 px-4',
    md: 'py-12 px-6',
    lg: 'py-16 px-8',
  };

  const titleSizeClasses = {
    sm: 'text-2xl',
    md: 'text-3xl',
    lg: 'text-4xl',
  };

  const descriptionSizeClasses = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
  };

  const textColorClass = textColor === 'light' ? 'text-white' : 'text-gray-900';

  const renderButton = (button: CTAButton, isPrimary: boolean) => (
    <Pressable
      onPress={button.onPress}
      className={cn(
        'px-6 py-3 rounded-lg',
        isPrimary ? 'bg-white' : 'bg-white/20 border border-white/30'
      )}
      accessibilityRole='button'
      accessibilityLabel={button.label}
    >
      <Text
        className={cn(
          'text-base font-semibold text-center',
          isPrimary ? 'text-blue-600' : 'text-white'
        )}
      >
        {button.label}
      </Text>
    </Pressable>
  );

  return (
    <View
      className={cn(
        'rounded-2xl overflow-hidden',
        gradientClasses[gradient],
        sizeClasses[size],
        className
      )}
    >
      <View className='items-center'>
        {/* Title */}
        <Text
          className={cn(
            'font-bold mb-4 text-center',
            titleSizeClasses[size],
            textColorClass
          )}
        >
          {title}
        </Text>

        {/* Description */}
        <Text
          className={cn(
            'mb-8 text-center opacity-90 max-w-lg',
            descriptionSizeClasses[size],
            textColorClass
          )}
        >
          {description}
        </Text>

        {/* Buttons */}
        <View className='flex-row gap-4'>
          {renderButton(primaryButton, true)}
          {secondaryButton && renderButton(secondaryButton, false)}
        </View>
      </View>
    </View>
  );
};
