import * as React from 'react';
import { useRef, useEffect } from 'react';
import { View, Animated } from 'react-native';
import { cn } from '../../lib/utils';

export interface LoadingDotsProps {
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Color variant */
  variant?: 'primary' | 'secondary' | 'white';
  /** Additional className */
  className?: string;
}

/**
 * LoadingDots Component
 *
 * Animated loading indicator with bouncing dots.
 * Simple and lightweight alternative to spinners.
 *
 * @example
 * ```tsx
 * <LoadingDots size="md" variant="primary" />
 * ```
 */
export const LoadingDots: React.FC<LoadingDotsProps> = ({
  size = 'md',
  variant = 'primary',
  className,
}) => {
  const dot1Anim = useRef(new Animated.Value(0)).current;
  const dot2Anim = useRef(new Animated.Value(0)).current;
  const dot3Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createAnimation = (animValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animValue, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.delay(600 - delay),
        ])
      );
    };

    const anim1 = createAnimation(dot1Anim, 0);
    const anim2 = createAnimation(dot2Anim, 150);
    const anim3 = createAnimation(dot3Anim, 300);

    anim1.start();
    anim2.start();
    anim3.start();

    return () => {
      anim1.stop();
      anim2.stop();
      anim3.stop();
    };
  }, [dot1Anim, dot2Anim, dot3Anim]);

  const sizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
  };

  const variantClasses = {
    primary: 'bg-blue-600 dark:bg-blue-500',
    secondary: 'bg-gray-600 dark:bg-gray-400',
    white: 'bg-white',
  };

  const gapClasses = {
    sm: 'gap-1',
    md: 'gap-1.5',
    lg: 'gap-2',
  };

  const dotClass = cn(
    'rounded-full',
    sizeClasses[size],
    variantClasses[variant]
  );

  const getAnimatedStyle = (animValue: Animated.Value) => ({
    opacity: animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 1],
    }),
    transform: [
      {
        scale: animValue.interpolate({
          inputRange: [0, 1],
          outputRange: [0.8, 1.2],
        }),
      },
    ],
  });

  return (
    <View
      className={cn('flex flex-row items-center', gapClasses[size], className)}
    >
      <Animated.View className={dotClass} style={getAnimatedStyle(dot1Anim)} />
      <Animated.View className={dotClass} style={getAnimatedStyle(dot2Anim)} />
      <Animated.View className={dotClass} style={getAnimatedStyle(dot3Anim)} />
    </View>
  );
};
