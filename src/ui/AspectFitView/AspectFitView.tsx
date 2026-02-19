import * as React from 'react';
import { View, ScrollView } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import { cn } from '../../lib/utils';

export interface AspectFitViewProps {
  /** Aspect ratio as width / height (e.g. 16/9) */
  aspectRatio: number;
  /** Content to render inside the aspect ratio container */
  children: React.ReactNode;
  /** Additional className for the outer container */
  className?: string;
  /** Additional className for the inner aspect ratio box */
  innerClassName?: string;
}

/**
 * AspectFitView - A container that maintains a fixed aspect ratio using AspectFit behavior.
 *
 * The inner box scales to be as large as possible while fitting entirely within
 * the parent, constrained by both width and height. Content that overflows
 * the box is scrollable. The box is horizontally centered.
 *
 * @example
 * ```tsx
 * <AspectFitView aspectRatio={16 / 9}>
 *   <MyContent />
 * </AspectFitView>
 * ```
 */
export const AspectFitView: React.FC<AspectFitViewProps> = ({
  aspectRatio,
  children,
  className,
  innerClassName,
}) => {
  const [size, setSize] = React.useState<{
    width: number;
    height: number;
  } | null>(null);

  const onLayout = React.useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setSize({ width, height });
  }, []);

  // Calculate AspectFit dimensions
  let innerWidth = 0;
  let innerHeight = 0;
  if (size) {
    const parentRatio = size.width / size.height;
    if (aspectRatio > parentRatio) {
      // Width-constrained
      innerWidth = size.width;
      innerHeight = size.width / aspectRatio;
    } else {
      // Height-constrained
      innerHeight = size.height;
      innerWidth = size.height * aspectRatio;
    }
  }

  return (
    <View className={cn('flex-1', className)} onLayout={onLayout}>
      {size && (
        <View className={cn('items-center', innerClassName)}>
          <ScrollView style={{ width: innerWidth, height: innerHeight }}>
            {children}
          </ScrollView>
        </View>
      )}
    </View>
  );
};
