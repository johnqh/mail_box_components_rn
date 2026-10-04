import * as React from 'react';
import { View, Text, Pressable } from 'react-native';
import { cn } from '../../lib/utils';
import { designTokens } from '@sudobility/design';
import { pressProps } from '../../lib/a11y';

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
  /**
   * `light` (the default) draws the text in the surface's own foreground
   * colour, which reads on it in every theme; `dark` uses the page's.
   */
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
  /*
    Each surface is a theme colour, and what sits on it takes that colour's
    foreground — written out in full so NativeWind sees every class.
  */
  const surfaces = {
    'blue-purple': {
      bg: 'bg-primary dark:bg-primary',
      text: 'text-primary-foreground',
      buttonText: 'text-primary',
      ghost: 'bg-primary-foreground/20 border border-primary-foreground/30',
    },
    'green-blue': {
      bg: 'bg-success',
      text: 'text-success-foreground',
      buttonText: 'text-success',
      ghost: 'bg-success-foreground/20 border border-success-foreground/30',
    },
    'orange-red': {
      bg: 'bg-warning',
      text: 'text-warning-foreground',
      buttonText: 'text-warning',
      ghost: 'bg-warning-foreground/20 border border-warning-foreground/30',
    },
    'purple-pink': {
      bg: 'bg-accent',
      text: 'text-accent-foreground',
      buttonText: 'text-accent-foreground',
      ghost: 'bg-accent-foreground/20 border border-accent-foreground/30',
    },
  };
  const surface = surfaces[gradient];

  const sizeClasses = {
    sm: 'py-8 px-4',
    md: 'py-12 px-6',
    lg: 'py-16 px-8',
  };

  // Typography sizing from design tokens
  const titleSizeClasses = {
    sm: designTokens.typography.size['2xl'],
    md: designTokens.typography.size['3xl'],
    lg: designTokens.typography.size['4xl'],
  };

  const descriptionSizeClasses = {
    sm: designTokens.typography.size.base,
    md: designTokens.typography.size.lg,
    lg: designTokens.typography.size.xl,
  };

  const textColorClass =
    textColor === 'light' ? surface.text : 'text-foreground';

  const renderButton = (button: CTAButton, isPrimary: boolean) => (
    <Pressable
      {...pressProps(button.onPress)}
      className={cn(
        'px-6 py-3 rounded-lg',
        isPrimary ? 'bg-background' : surface.ghost
      )}
      accessibilityRole='button'
      accessibilityLabel={button.label}
    >
      <Text
        className={cn(
          'text-base font-semibold text-center',
          isPrimary ? surface.buttonText : textColorClass
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
        surface.bg,
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
