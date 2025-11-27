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
    default: 'bg-gray-100 dark:bg-gray-800',
    premium: 'bg-amber-100 dark:bg-amber-900/30',
    primary: 'bg-blue-100 dark:bg-blue-900/30',
    light:
      'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700',
  };

  const iconColorClasses = {
    default: 'text-gray-600 dark:text-gray-400',
    premium: 'text-amber-600 dark:text-amber-400',
    primary: 'text-blue-600 dark:text-blue-400',
    light: 'text-gray-600 dark:text-gray-400',
  };

  const textColorClasses = {
    default: 'text-gray-900 dark:text-white',
    premium: 'text-amber-900 dark:text-amber-100',
    primary: 'text-blue-900 dark:text-blue-100',
    light: 'text-gray-900 dark:text-white',
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
