import * as React from 'react';
import { View, Text } from 'react-native';
import { cn } from '../../lib/utils';

export interface SectionBadgeProps {
  /** Icon element */
  icon: React.ReactNode;
  /** Badge text */
  text: string;
  /** Visual variant */
  variant?: 'default' | 'premium' | 'primary' | 'light';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional className */
  className?: string;
}

/**
 * SectionBadge Component
 *
 * Badge with icon for section headers and feature highlights.
 * Commonly used for premium features, new features, or category labels.
 *
 * @example
 * ```tsx
 * <SectionBadge
 *   icon={<StarIcon />}
 *   text="Premium Feature"
 *   variant="premium"
 * />
 * ```
 */
export const SectionBadge: React.FC<SectionBadgeProps> = ({
  icon,
  text,
  variant = 'default',
  size = 'md',
  className,
}) => {
  // Variant color configurations
  const variantClasses = {
    default: 'bg-muted',
    premium: 'bg-warning/10 ',
    primary: 'bg-primary/10',
    light: 'bg-background border border-border',
  };

  const iconColorClasses = {
    default: 'text-muted-foreground',
    premium: 'text-warning ',
    primary: 'text-primary',
    light: 'text-muted-foreground',
  };

  const textColorClasses = {
    default: 'text-foreground',
    premium: 'text-warning ',
    primary: 'text-primary dark:text-primary-foreground',
    light: 'text-foreground',
  };

  // Size configurations
  const sizeClasses = {
    sm: {
      container: 'px-4 py-2',
      iconSize: 'w-4 h-4',
      text: 'text-xs',
    },
    md: {
      container: 'px-6 py-3',
      iconSize: 'w-5 h-5',
      text: 'text-sm',
    },
    lg: {
      container: 'px-8 py-4',
      iconSize: 'w-6 h-6',
      text: 'text-base',
    },
  };

  const sizeConfig = sizeClasses[size];

  return (
    <View
      className={cn(
        'flex-row items-center rounded-full mb-6',
        variantClasses[variant],
        sizeConfig.container,
        className
      )}
    >
      <View className={cn('mr-2', iconColorClasses[variant])}>{icon}</View>
      <Text
        className={cn(
          'font-semibold',
          sizeConfig.text,
          textColorClasses[variant]
        )}
      >
        {text}
      </Text>
    </View>
  );
};
