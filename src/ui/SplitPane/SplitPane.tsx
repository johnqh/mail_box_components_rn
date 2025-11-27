import * as React from 'react';
import {
  View,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
  LayoutChangeEvent,
} from 'react-native';
import { cn } from '../../lib/utils';

export interface SplitPaneProps {
  /** Left/Top panel content */
  left: React.ReactNode;
  /** Right/Bottom panel content */
  right: React.ReactNode;
  /** Split direction */
  direction?: 'horizontal' | 'vertical';
  /** Initial split position (0-1) */
  initialSplit?: number;
  /** Controlled split position */
  split?: number;
  /** Split change handler */
  onSplitChange?: (split: number) => void;
  /** Minimum left/top panel size (pixels) */
  minLeftSize?: number;
  /** Minimum right/bottom panel size (pixels) */
  minRightSize?: number;
  /** Divider size in pixels */
  dividerSize?: number;
  /** Allow resize */
  resizable?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * SplitPane Component
 *
 * Resizable split panel layout with draggable divider.
 * Supports horizontal and vertical splits.
 *
 * @example
 * ```tsx
 * <SplitPane
 *   left={<Sidebar />}
 *   right={<MainContent />}
 *   direction="horizontal"
 *   initialSplit={0.3}
 *   minLeftSize={200}
 *   minRightSize={400}
 * />
 * ```
 */
export const SplitPane: React.FC<SplitPaneProps> = ({
  left,
  right,
  direction = 'horizontal',
  initialSplit = 0.5,
  split: controlledSplit,
  onSplitChange,
  minLeftSize = 100,
  minRightSize = 100,
  dividerSize = 12,
  resizable = true,
  className,
}) => {
  const [internalSplit, setInternalSplit] = React.useState(initialSplit);
  const [isDragging, setIsDragging] = React.useState(false);
  const [containerSize, setContainerSize] = React.useState({
    width: 0,
    height: 0,
  });

  const split = controlledSplit !== undefined ? controlledSplit : internalSplit;
  const isHorizontal = direction === 'horizontal';

  // Handle layout change to get container dimensions
  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setContainerSize({ width, height });
  };

  // Calculate new split value from gesture
  const calculateSplit = React.useCallback(
    (gestureState: PanResponderGestureState): number => {
      const totalSize = isHorizontal
        ? containerSize.width
        : containerSize.height;
      if (totalSize === 0) return split;

      const delta = isHorizontal ? gestureState.dx : gestureState.dy;
      const currentPosition = split * totalSize + delta;
      let newSplit = currentPosition / totalSize;

      // Clamp between 0 and 1
      newSplit = Math.max(0, Math.min(1, newSplit));

      // Apply min sizes
      const minLeftRatio = minLeftSize / totalSize;
      const maxLeftRatio = 1 - minRightSize / totalSize;

      newSplit = Math.max(minLeftRatio, Math.min(maxLeftRatio, newSplit));

      return newSplit;
    },
    [isHorizontal, containerSize, split, minLeftSize, minRightSize]
  );

  // Create PanResponder for gesture handling
  const panResponder = React.useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => resizable,
        onMoveShouldSetPanResponder: () => resizable,
        onPanResponderGrant: () => {
          setIsDragging(true);
        },
        onPanResponderMove: (
          _event: GestureResponderEvent,
          gestureState: PanResponderGestureState
        ) => {
          const newSplit = calculateSplit(gestureState);

          if (controlledSplit !== undefined && onSplitChange) {
            onSplitChange(newSplit);
          } else {
            setInternalSplit(newSplit);
          }
        },
        onPanResponderRelease: () => {
          setIsDragging(false);
        },
        onPanResponderTerminate: () => {
          setIsDragging(false);
        },
      }),
    [resizable, controlledSplit, onSplitChange, calculateSplit]
  );

  // Calculate panel sizes
  const totalSize = isHorizontal ? containerSize.width : containerSize.height;
  const leftSize = Math.max(0, split * totalSize - dividerSize / 2);
  const rightSize = Math.max(0, (1 - split) * totalSize - dividerSize / 2);

  return (
    <View
      onLayout={handleLayout}
      className={cn(
        'flex-1',
        isHorizontal ? 'flex-row' : 'flex-col',
        className
      )}
    >
      {/* Left/Top panel */}
      <View
        className='overflow-hidden'
        style={{
          [isHorizontal ? 'width' : 'height']: leftSize,
        }}
      >
        {left}
      </View>

      {/* Divider */}
      <View
        {...(resizable ? panResponder.panHandlers : {})}
        className={cn(
          'items-center justify-center',
          'bg-gray-200 dark:bg-gray-700',
          isDragging && 'bg-blue-500 dark:bg-blue-400',
          resizable && 'active:bg-blue-500 dark:active:bg-blue-400'
        )}
        style={{
          [isHorizontal ? 'width' : 'height']: dividerSize,
        }}
      >
        {/* Divider handle indicator */}
        {resizable && (
          <View
            className={cn(
              'rounded-full',
              'bg-gray-400 dark:bg-gray-500',
              isDragging && 'bg-white'
            )}
            style={{
              [isHorizontal ? 'width' : 'height']: 4,
              [isHorizontal ? 'height' : 'width']: 40,
            }}
          />
        )}
      </View>

      {/* Right/Bottom panel */}
      <View
        className='overflow-hidden flex-1'
        style={{
          [isHorizontal ? 'width' : 'height']: rightSize,
        }}
      >
        {right}
      </View>
    </View>
  );
};
