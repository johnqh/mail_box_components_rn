import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { cn } from '../../lib/utils';

export interface GradientIconContainerProps {
  /** Icon element */
  children: React.ReactNode;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Shape variant */
  shape?: 'square' | 'rounded' | 'circle';
  /** Color variant */
  variant?: 'blue' | 'purple' | 'green' | 'orange' | 'gray';
  /** Additional className */
  className?: string;
}

/**
 * GradientIconContainer Component
 *
 * Container for icons with gradient-like background colors.
 * Note: True gradients require expo-linear-gradient; this uses solid colors.
 *
 * @example
 * ```tsx
 * <GradientIconContainer size="lg" variant="blue" shape="rounded">
 *   <ShieldIcon />
 * </GradientIconContainer>
 * ```
 */
export const GradientIconContainer: React.FC<GradientIconContainerProps> = ({
  children,
  size = 'md',
  shape = 'rounded',
  variant = 'blue',
  className,
}) => {
  // Size configurations
  const sizeConfig = {
    sm: { container: 'w-10 h-10', icon: styles.iconSm },
    md: { container: 'w-12 h-12', icon: styles.iconMd },
    lg: { container: 'w-16 h-16', icon: styles.iconLg },
    xl: { container: 'w-20 h-20', icon: styles.iconXl },
  };

  // Shape configurations
  const shapeClasses = {
    square: 'rounded-lg',
    rounded: 'rounded-xl',
    circle: 'rounded-full',
  };

  // Color variants (solid colors approximating gradients)
  const variantClasses = {
    blue: 'bg-blue-600',
    purple: 'bg-purple-600',
    green: 'bg-green-600',
    orange: 'bg-orange-600',
    gray: 'bg-gray-700 dark:bg-gray-600',
  };

  const config = sizeConfig[size];

  return (
    <View
      className={cn(
        'items-center justify-center',
        config.container,
        shapeClasses[shape],
        variantClasses[variant],
        className
      )}
    >
      <View style={config.icon}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  iconSm: { width: 20, height: 20 },
  iconMd: { width: 24, height: 24 },
  iconLg: { width: 32, height: 32 },
  iconXl: { width: 40, height: 40 },
});
