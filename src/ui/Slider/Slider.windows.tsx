import * as React from 'react';
import { View } from 'react-native';
import { cn } from '../../lib/utils';
import { useThemeColor } from '../../lib/theme-color';
import type { SliderProps } from './Slider';
import NativeSlider from './MoosiacNativeSliderNativeComponent';

/** Native Windows Fabric slider, rendered by Windows Composition. */
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
  thumbStyle = 'default',
}) => {
  const nativeMax = max > min ? max : min + 1;
  const safeValue = Math.min(nativeMax, Math.max(min, value));
  const fillColor = useThemeColor('primary');
  const trackColor = useThemeColor('border');

  return (
    <View className={cn('justify-center', className)}>
      <NativeSlider
        style={{ width: '100%', height: 24 }}
        minimumValue={min}
        maximumValue={nativeMax}
        value={safeValue}
        step={step}
        disabled={disabled}
        trackFillColor={fillColor}
        trackColor={trackColor}
        faderThumb={thumbStyle === 'fader'}
        focusable={!disabled}
        accessibilityRole='adjustable'
        accessibilityLabel={accessibilityLabel}
        accessibilityValue={{
          min: 0,
          max: 100,
          now: Math.round(((safeValue - min) / (nativeMax - min)) * 100),
        }}
        onValueChange={event => onValueChange?.(event.nativeEvent.value)}
        onSlidingComplete={event =>
          onSlidingComplete?.(event.nativeEvent.value)
        }
      />
    </View>
  );
};
