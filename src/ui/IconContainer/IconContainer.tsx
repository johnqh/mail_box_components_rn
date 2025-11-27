import * as React from 'react';
import { View } from 'react-native';
import { cn } from '../../lib/utils';

export interface IconContainerProps {
  /** Icon element */
  children: React.ReactNode;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Color variant */
  variant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'error'
    | 'neutral';
  /** Shape variant */
  shape?: 'square' | 'rounded' | 'circle';
  /** Additional className */
  className?: string;
}

/**
 * IconContainer Component
 *
 * Styled container for displaying icons with consistent sizing and colors.
 * Commonly used in feature lists, settings, and navigation.
 *
 * @example
 * ```tsx
 * <IconContainer size="lg" variant="primary" shape="rounded">
 *   <SettingsIcon />
 * </IconContainer>
 * ```
 */
export const IconContainer: React.FC<IconContainerProps> = ({
  children,
  size = 'md',
  variant = 'primary',
  shape = 'rounded',
  className,
}) => {
  // Size configurations
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  };

  // Variant configurations
  const variantClasses = {
    primary: 'bg-blue-100 dark:bg-blue-900/30',
    secondary: 'bg-purple-100 dark:bg-purple-900/30',
    success: 'bg-green-100 dark:bg-green-900/30',
    warning: 'bg-yellow-100 dark:bg-yellow-900/30',
    error: 'bg-red-100 dark:bg-red-900/30',
    neutral: 'bg-gray-100 dark:bg-gray-800',
  };

  // Shape configurations
  const shapeClasses = {
    square: 'rounded-lg',
    rounded: 'rounded-2xl',
    circle: 'rounded-full',
  };

  return (
    <View
      className={cn(
        'items-center justify-center',
        sizeClasses[size],
        variantClasses[variant],
        shapeClasses[shape],
        className
      )}
    >
      {children}
    </View>
  );
};
