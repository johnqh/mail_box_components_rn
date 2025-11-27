import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Text, Animated } from 'react-native';
import { cn } from '../../lib/utils';

export interface AnimatedCounterProps {
  /** Target value to count to */
  value: number;
  /** Animation duration in milliseconds */
  duration?: number;
  /** Number of decimal places */
  decimals?: number;
  /** Prefix (e.g., "$") */
  prefix?: string;
  /** Suffix (e.g., "%") */
  suffix?: string;
  /** Format with commas */
  formatWithCommas?: boolean;
  /** Additional className */
  className?: string;
  /** Text color className */
  textClassName?: string;
}

/**
 * AnimatedCounter Component
 *
 * Animated number counter that counts up/down to target value.
 * Useful for statistics, dashboards, and metrics display.
 *
 * @example
 * ```tsx
 * <AnimatedCounter
 *   value={1234}
 *   duration={2000}
 *   prefix="$"
 *   formatWithCommas
 * />
 * ```
 *
 * @example
 * ```tsx
 * <AnimatedCounter
 *   value={99.9}
 *   decimals={1}
 *   suffix="%"
 * />
 * ```
 */
export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1000,
  decimals = 0,
  prefix = '',
  suffix = '',
  formatWithCommas = false,
  className,
  textClassName,
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const previousValue = useRef(0);

  useEffect(() => {
    // Listen to animated value changes
    const listenerId = animatedValue.addListener(({ value: animValue }) => {
      setDisplayValue(animValue);
    });

    // Animate from previous value to new value
    Animated.timing(animatedValue, {
      toValue: value,
      duration,
      useNativeDriver: false,
    }).start();

    previousValue.current = value;

    return () => {
      animatedValue.removeListener(listenerId);
    };
  }, [value, duration, animatedValue]);

  // Format the display value
  const formatValue = (val: number): string => {
    const fixed = val.toFixed(decimals);

    if (formatWithCommas) {
      const parts = fixed.split('.');
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return parts.join('.');
    }

    return fixed;
  };

  return (
    <Text
      className={cn(
        'text-2xl font-bold text-gray-900 dark:text-white',
        textClassName,
        className
      )}
    >
      {prefix}
      {formatValue(displayValue)}
      {suffix}
    </Text>
  );
};
