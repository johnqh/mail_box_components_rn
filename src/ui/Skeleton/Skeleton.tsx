import * as React from 'react';
import { useEffect, useRef } from 'react';
import { View, Animated, ViewProps, DimensionValue } from 'react-native';
import { cn } from '../../lib/utils';

export interface SkeletonProps extends ViewProps {
  /** Shape/type of skeleton */
  variant?: 'text' | 'circle' | 'rectangle' | 'avatar' | 'button';
  /** Width of the skeleton */
  width?: DimensionValue;
  /** Height of the skeleton */
  height?: DimensionValue;
  /** Number of skeleton elements to render */
  count?: number;
  /** Number of lines (for text variant) */
  lines?: number;
  /** Enable/disable animation */
  animate?: boolean;
  /** Gap between lines */
  gap?: 'sm' | 'md' | 'lg';
  /** Additional className */
  className?: string;
}

/**
 * Skeleton Component
 *
 * A loading placeholder component that displays a pulsing skeleton.
 *
 * @example
 * ```tsx
 * // Loading text
 * <Skeleton variant="text" width={200} />
 * <Skeleton variant="text" count={3} />
 *
 * // Loading avatar
 * <Skeleton variant="circle" width={40} height={40} />
 *
 * // Loading button
 * <Skeleton variant="button" width={120} />
 * ```
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  count,
  lines = 1,
  animate = true,
  gap = 'md',
  className,
  ...viewProps
}) => {
  const animatedValue = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    if (animate) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 750,
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0.3,
            duration: 750,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [animate, animatedValue]);

  // Variant-specific styles
  const variantClasses = {
    text: 'h-4 rounded',
    circle: 'rounded-full',
    rectangle: 'rounded-lg',
    avatar: 'w-10 h-10 rounded-full',
    button: 'h-10 rounded-lg',
  };

  // Gap between lines
  const gapClasses = {
    sm: 'gap-1',
    md: 'gap-2',
    lg: 'gap-3',
  };

  // Determine number of elements to render
  const elementCount = count ?? lines;

  // Single skeleton element
  const renderSkeleton = (key?: number) => {
    const style: Record<string, DimensionValue | undefined> = {};

    if (width !== undefined) {
      style.width = width;
    }

    if (height !== undefined) {
      style.height = height;
    }

    return (
      <Animated.View
        key={key}
        className={cn(
          'bg-gray-200 dark:bg-gray-700',
          variantClasses[variant],
          className
        )}
        style={[style, animate ? { opacity: animatedValue } : undefined]}
        {...viewProps}
      />
    );
  };

  // Multiple skeletons
  if (elementCount > 1) {
    return (
      <View className={cn('flex flex-col', gapClasses[gap])}>
        {Array.from({ length: elementCount }).map((_, i) => renderSkeleton(i))}
      </View>
    );
  }

  return renderSkeleton();
};

/**
 * SkeletonText - Pre-configured text skeleton
 */
export const SkeletonText: React.FC<
  Omit<SkeletonProps, 'variant'> & { lines?: number }
> = ({ lines = 3, ...props }) => (
  <Skeleton variant='text' lines={lines} {...props} />
);

/**
 * SkeletonAvatar - Pre-configured avatar skeleton
 */
export const SkeletonAvatar: React.FC<
  Omit<SkeletonProps, 'variant'>
> = props => <Skeleton variant='avatar' {...props} />;

/**
 * SkeletonButton - Pre-configured button skeleton
 */
export const SkeletonButton: React.FC<
  Omit<SkeletonProps, 'variant'>
> = props => <Skeleton variant='button' width={100} {...props} />;
