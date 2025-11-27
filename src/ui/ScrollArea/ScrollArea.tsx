import * as React from 'react';
import { ScrollView, View } from 'react-native';
import { cn } from '../../lib/utils';

export interface ScrollAreaProps {
  /** Scrollable content */
  children: React.ReactNode;
  /** Maximum height */
  maxHeight?: number;
  /** Hide scrollbar */
  hideScrollbar?: boolean;
  /** Scroll direction */
  direction?: 'vertical' | 'horizontal' | 'both';
  /** Show scroll indicators */
  showsIndicator?: boolean;
  /** Additional className */
  className?: string;
  /** Content container className */
  contentClassName?: string;
}

/**
 * ScrollArea Component
 *
 * Container with scrollable content and optional scroll indicators.
 * Provides consistent scrollable areas across the application.
 *
 * @example
 * ```tsx
 * <ScrollArea maxHeight={400}>
 *   <View>Long content...</View>
 * </ScrollArea>
 * ```
 *
 * @example
 * ```tsx
 * <ScrollArea direction="horizontal" hideScrollbar>
 *   <View className="w-[2000px]">Wide content</View>
 * </ScrollArea>
 * ```
 */
export const ScrollArea: React.FC<ScrollAreaProps> = ({
  children,
  maxHeight,
  hideScrollbar = false,
  direction = 'vertical',
  showsIndicator = true,
  className,
  contentClassName,
}) => {
  const isVertical = direction === 'vertical' || direction === 'both';
  const isHorizontal = direction === 'horizontal' || direction === 'both';

  return (
    <View
      className={cn('relative', className)}
      style={maxHeight ? { maxHeight } : undefined}
    >
      <ScrollView
        horizontal={direction === 'horizontal'}
        showsVerticalScrollIndicator={
          isVertical && showsIndicator && !hideScrollbar
        }
        showsHorizontalScrollIndicator={
          isHorizontal && showsIndicator && !hideScrollbar
        }
        scrollEnabled
        nestedScrollEnabled
        contentContainerStyle={
          direction === 'horizontal' ? { flexDirection: 'row' } : undefined
        }
      >
        <View className={contentClassName}>{children}</View>
      </ScrollView>
    </View>
  );
};
