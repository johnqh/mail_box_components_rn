import * as React from 'react';
import { useCallback, useRef, useState } from 'react';
import { PanResponder, View } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import { cn } from '../../lib/utils';

export interface SliderProps {
  /** Current value, clamped into [min, max]. */
  value: number;
  min?: number;
  max?: number;
  /** Quantum. 0 means continuous. */
  step?: number;
  /** Called continuously while dragging. */
  onValueChange?: (value: number) => void;
  /** Called once, on release — for work too expensive to do per frame. */
  onSlidingComplete?: (value: number) => void;
  disabled?: boolean;
  className?: string;
  accessibilityLabel?: string;
}

const TRACK_HEIGHT = 4;
const THUMB_SIZE = 16;

/**
 * Slider Component
 *
 * A horizontal value slider, for the things a number field is wrong for —
 * a volume level, a position within a track — where the useful gesture is
 * "drag until it sounds right" rather than "type 0.62".
 *
 * There is no web counterpart in `@sudobility/components`: the web uses a
 * native `<input type="range">`, which React Native has no equivalent of. So
 * this is a primitive the RN library needs on its own account, built on
 * `PanResponder` rather than a dependency.
 *
 * **Both callbacks exist because they answer different questions.**
 * `onValueChange` fires continuously, for anything that must track the finger —
 * a gain, which should be audible while dragging. `onSlidingComplete` fires
 * once, for anything too expensive to do per frame — seeking a transport, which
 * would otherwise reload the engine sixty times a second.
 *
 * @example
 * ```tsx
 * <Slider value={volume} onValueChange={setVolume} min={0} max={1} />
 * ```
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
  const [width, setWidth] = useState(0);
  // Refs, not state: the pan handlers are created once and would otherwise
  // capture the first render's width and callbacks forever.
  const widthRef = useRef(0);
  const latest = useRef({
    min,
    max,
    step,
    onValueChange,
    onSlidingComplete,
    disabled,
  });
  latest.current = {
    min,
    max,
    step,
    onValueChange,
    onSlidingComplete,
    disabled,
  };

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const next = event.nativeEvent.layout.width;
    widthRef.current = next;
    setWidth(previous => (previous === next ? previous : next));
  }, []);

  const valueAt = useCallback((x: number): number => {
    const { min: lo, max: hi, step: quantum } = latest.current;
    const usable = Math.max(1, widthRef.current - THUMB_SIZE);
    const fraction = Math.min(1, Math.max(0, (x - THUMB_SIZE / 2) / usable));
    const raw = lo + fraction * (hi - lo);
    if (!quantum) return raw;
    return Math.min(hi, Math.max(lo, Math.round(raw / quantum) * quantum));
  }, []);

  const responder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => !latest.current.disabled,
      onMoveShouldSetPanResponder: () => !latest.current.disabled,
      onPanResponderGrant: e => {
        latest.current.onValueChange?.(valueAt(e.nativeEvent.locationX));
      },
      onPanResponderMove: (_e, gesture) => {
        latest.current.onValueChange?.(
          valueAt(gesture.moveX - gesture.x0 + gesture.x0)
        );
      },
      onPanResponderRelease: (e, gesture) => {
        const at = valueAt(
          gesture.dx === 0 ? e.nativeEvent.locationX : gesture.moveX
        );
        latest.current.onValueChange?.(at);
        latest.current.onSlidingComplete?.(at);
      },
    })
  ).current;

  const span = max - min || 1;
  const fraction = Math.min(1, Math.max(0, (value - min) / span));
  const usable = Math.max(0, width - THUMB_SIZE);

  return (
    <View
      onLayout={onLayout}
      className={cn('justify-center', disabled && 'opacity-40', className)}
      style={{ height: THUMB_SIZE + 8 }}
      accessibilityRole='adjustable'
      {...(accessibilityLabel ? { accessibilityLabel } : {})}
      accessibilityValue={{ min, max, now: value }}
      {...responder.panHandlers}
    >
      <View
        className='bg-muted w-full rounded-full'
        style={{ height: TRACK_HEIGHT }}
      />
      <View
        className='bg-primary absolute rounded-full'
        style={{
          height: TRACK_HEIGHT,
          left: 0,
          width: THUMB_SIZE / 2 + fraction * usable,
        }}
      />
      <View
        className='bg-primary absolute rounded-full'
        style={{
          width: THUMB_SIZE,
          height: THUMB_SIZE,
          left: fraction * usable,
        }}
      />
    </View>
  );
};
