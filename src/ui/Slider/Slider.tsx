import * as React from 'react';
import NativeSlider from '@react-native-community/slider';
import { View } from 'react-native';
import { cn } from '../../lib/utils';

export interface SliderProps {
  /** Current value, clamped into [min, max]. */
  value: number;
  min?: number;
  max?: number;
  /** Quantum. 0 means continuous. */
  step?: number;
  /** macOS: a narrow audio-fader thumb for position controls such as pan. */
  thumbStyle?: 'default' | 'fader';
  /** Called continuously while dragging. */
  onValueChange?: (value: number) => void;
  /** Called once, on release — for work too expensive to do per frame. */
  onSlidingComplete?: (value: number) => void;
  disabled?: boolean;
  className?: string;
  accessibilityLabel?: string;
}

/**
 * Native platform slider on iOS, Android, and Windows.
 * macOS uses the package's AppKit NSSlider view in `Slider.macos.tsx`.
 */
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

  return (
    <View
      className={cn('justify-center', disabled && 'opacity-40', className)}
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min, max, now: safeValue }}
    >
      <NativeSlider
        style={{ width: '100%', height: 40 }}
        minimumValue={min}
        maximumValue={max}
        value={safeValue}
        {...(step > 0 ? { step } : {})}
        disabled={disabled}
        onValueChange={onValueChange}
        onSlidingComplete={onSlidingComplete}
        accessibilityLabel={accessibilityLabel}
      />
    </View>
  );
};
