import * as React from 'react';
import { useEffect, useRef } from 'react';
import { Animated, ViewStyle } from 'react-native';
import { cn } from '../../lib/utils';

export type AnimationType =
  | 'fade-in'
  | 'fade-in-up'
  | 'fade-in-down'
  | 'fade-in-left'
  | 'fade-in-right'
  | 'scale-in';

export interface AnimatedSectionProps {
  /** Animation type */
  animation?: AnimationType;
  /** Animation delay in milliseconds */
  delay?: number;
  /** Animation duration in milliseconds */
  duration?: number;
  /** Children to animate */
  children: React.ReactNode;
  /** Additional className */
  className?: string;
  /** Additional style */
  style?: ViewStyle;
}

/**
 * AnimatedSection Component
 *
 * Wrapper component that animates its children on mount.
 * Supports various animation types for entrance animations.
 *
 * @example
 * ```tsx
 * <AnimatedSection animation="fade-in-up" delay={200}>
 *   <Card>Content</Card>
 * </AnimatedSection>
 * ```
 */
export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  animation = 'fade-in',
  delay = 0,
  duration = 400,
  children,
  className,
  style,
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Set initial values based on animation type
    switch (animation) {
      case 'fade-in':
        opacity.setValue(0);
        break;
      case 'fade-in-up':
        opacity.setValue(0);
        translateY.setValue(20);
        break;
      case 'fade-in-down':
        opacity.setValue(0);
        translateY.setValue(-20);
        break;
      case 'fade-in-left':
        opacity.setValue(0);
        translateX.setValue(-20);
        break;
      case 'fade-in-right':
        opacity.setValue(0);
        translateX.setValue(20);
        break;
      case 'scale-in':
        opacity.setValue(0);
        scale.setValue(0.9);
        break;
    }

    // Animate to final values
    const animations: Animated.CompositeAnimation[] = [];

    animations.push(
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        delay,
        useNativeDriver: true,
      })
    );

    if (animation === 'fade-in-up' || animation === 'fade-in-down') {
      animations.push(
        Animated.timing(translateY, {
          toValue: 0,
          duration,
          delay,
          useNativeDriver: true,
        })
      );
    }

    if (animation === 'fade-in-left' || animation === 'fade-in-right') {
      animations.push(
        Animated.timing(translateX, {
          toValue: 0,
          duration,
          delay,
          useNativeDriver: true,
        })
      );
    }

    if (animation === 'scale-in') {
      animations.push(
        Animated.timing(scale, {
          toValue: 1,
          duration,
          delay,
          useNativeDriver: true,
        })
      );
    }

    Animated.parallel(animations).start();
  }, [animation, delay, duration, opacity, translateY, translateX, scale]);

  return (
    <Animated.View
      className={cn(className)}
      style={[
        style,
        {
          opacity,
          transform: [{ translateY }, { translateX }, { scale }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

// Utility components for common animation patterns
export const FadeIn: React.FC<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
}> = ({ children, delay = 0, className }) => (
  <AnimatedSection animation='fade-in' delay={delay} className={className}>
    {children}
  </AnimatedSection>
);

export const FadeInUp: React.FC<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
}> = ({ children, delay = 0, className }) => (
  <AnimatedSection animation='fade-in-up' delay={delay} className={className}>
    {children}
  </AnimatedSection>
);

export const FadeInScale: React.FC<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
}> = ({ children, delay = 0, className }) => (
  <AnimatedSection animation='scale-in' delay={delay} className={className}>
    {children}
  </AnimatedSection>
);
