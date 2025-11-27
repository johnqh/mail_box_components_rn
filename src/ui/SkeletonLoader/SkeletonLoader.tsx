import * as React from 'react';
import { useEffect, useRef } from 'react';
import { View, Animated, DimensionValue } from 'react-native';
import { cn } from '../../lib/utils';

export interface SkeletonLoaderProps {
  /** Shape/type of skeleton */
  variant?: 'text' | 'circle' | 'rectangle' | 'avatar' | 'button';
  /** Width of the skeleton */
  width?: DimensionValue;
  /** Height of the skeleton */
  height?: DimensionValue;
  /** Additional className for the skeleton */
  className?: string;
  /** Number of skeleton elements to render */
  count?: number;
  /** Number of lines (for text variant) - alias for count */
  lines?: number;
  /** Enable/disable animation */
  animate?: boolean;
  /** Custom border radius */
  borderRadius?: number;
  /** Gap between lines (for multi-line text) */
  gap?: 'sm' | 'md' | 'lg';
}

/**
 * SkeletonLoader Component
 *
 * A loading placeholder component that displays a pulsing skeleton
 * while content is being fetched. Supports various shapes and sizes.
 *
 * @example
 * ```tsx
 * // Loading text
 * <SkeletonLoader variant="text" width={200} />
 * <SkeletonLoader variant="text" count={3} />
 *
 * // Loading avatar
 * <SkeletonLoader variant="circle" width={40} height={40} />
 *
 * // Loading button
 * <SkeletonLoader variant="button" width={120} />
 * ```
 */
export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'text',
  width,
  height,
  className,
  count,
  lines = 1,
  animate = true,
  borderRadius,
  gap = 'md',
}) => {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!animate) return;

    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 0.5,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [animate, opacity]);

  // Variant-specific styles
  const variantClasses = {
    text: 'h-4 rounded',
    circle: 'rounded-full',
    rectangle: 'rounded-lg',
    avatar: 'w-10 h-10 rounded-full',
    button: 'h-10 rounded-lg',
  };

  // Default dimensions based on variant
  const getDefaultDimensions = (): {
    width: DimensionValue;
    height: DimensionValue;
  } => {
    switch (variant) {
      case 'text':
        return { width: '100%', height: 16 };
      case 'circle':
        return { width: 40, height: 40 };
      case 'rectangle':
        return { width: '100%', height: 100 };
      case 'avatar':
        return { width: 40, height: 40 };
      case 'button':
        return { width: 120, height: 40 };
      default:
        return { width: '100%', height: 16 };
    }
  };

  const defaults = getDefaultDimensions();

  // Gap between lines
  const gapValues = {
    sm: 4,
    md: 8,
    lg: 12,
  };

  // Determine number of elements to render
  const elementCount = count ?? lines;

  // Build style object
  const getStyle = (): {
    width?: DimensionValue;
    height?: DimensionValue;
    borderRadius?: number;
  } => {
    const style: {
      width?: DimensionValue;
      height?: DimensionValue;
      borderRadius?: number;
    } = {};

    style.width = width !== undefined ? width : defaults.width;
    style.height = height !== undefined ? height : defaults.height;

    if (borderRadius !== undefined) {
      style.borderRadius = borderRadius;
    }

    return style;
  };

  // Single skeleton element
  const renderSkeleton = (key?: number) => (
    <Animated.View
      key={key}
      className={cn(
        'bg-gray-200 dark:bg-gray-700',
        variantClasses[variant],
        className
      )}
      style={[getStyle(), { opacity }]}
    />
  );

  // Multiple skeletons
  if (elementCount > 1) {
    return (
      <View style={{ gap: gapValues[gap] }}>
        {Array.from({ length: elementCount }).map((_, i) => renderSkeleton(i))}
      </View>
    );
  }

  return renderSkeleton();
};
