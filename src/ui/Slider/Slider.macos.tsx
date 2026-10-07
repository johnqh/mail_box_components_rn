import * as React from 'react';
import { View } from 'react-native';
import { cn } from '../../lib/utils';
import type { SliderProps } from './Slider';
import NativeSlider from './MoosiacNativeSliderNativeComponent';

/** AppKit NSSlider exposed through the package's macOS native view manager. */
export const Slider: React.FC<SliderProps> = ({
  value,
  min = 0,
  max = 1,
  step = 0,
  onValueChange,
  onSlidingComplete,
  disabled = false,
  className,
  accessibilityLabel,
}) => {
  const safeValue = Math.min(max, Math.max(min, value));
  const nativeMax = max === min ? min + 1 : max;

  return (
    <View className={cn('justify-center', disabled && 'opacity-40', className)}>
      <NativeSlider
        style={{ width: '100%', height: 24 }}
        minimumValue={min}
        maximumValue={nativeMax}
        value={safeValue}
        step={step}
        disabled={disabled}
        accessibilityRole='adjustable'
        accessibilityLabel={accessibilityLabel}
        accessibilityValue={{ min, max, now: safeValue }}
        onValueChange={event => onValueChange?.(event.nativeEvent.value)}
        onSlidingComplete={event =>
          onSlidingComplete?.(event.nativeEvent.value)
        }
      />
    </View>
  );
};
