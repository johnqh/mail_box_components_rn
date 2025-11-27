import * as React from 'react';
import { View, useWindowDimensions } from 'react-native';
import { cn } from '../../lib/utils';

export interface AspectRatioProps {
  /** Content to maintain aspect ratio */
  children: React.ReactNode;
  /** Aspect ratio (width/height or preset) */
  ratio?: number | '16/9' | '4/3' | '1/1' | '21/9' | '3/2';
  /** Additional className */
  className?: string;
  /** Fixed width (optional, defaults to full width) */
  width?: number | 'full';
}

/**
 * AspectRatio Component
 *
 * Maintains a specific aspect ratio for its content.
 * Useful for responsive images, videos, and embeds.
 *
 * @example
 * ```tsx
 * <AspectRatio ratio="16/9">
 *   <Image source={{ uri: '/image.jpg' }} style={{ flex: 1 }} />
 * </AspectRatio>
 * ```
 *
 * @example
 * ```tsx
 * <AspectRatio ratio={1.5} width={200}>
 *   <View style={{ backgroundColor: 'blue', flex: 1 }} />
 * </AspectRatio>
 * ```
 */
export const AspectRatio: React.FC<AspectRatioProps> = ({
  children,
  ratio = '16/9',
  className,
  width = 'full',
}) => {
  const { width: screenWidth } = useWindowDimensions();

  // Convert preset ratios to numbers
  const ratioMap: Record<string, number> = {
    '16/9': 16 / 9,
    '4/3': 4 / 3,
    '1/1': 1,
    '21/9': 21 / 9,
    '3/2': 3 / 2,
  };

  const numericRatio = typeof ratio === 'string' ? ratioMap[ratio] : ratio;

  // Calculate container width
  const containerWidth = width === 'full' ? screenWidth : width;

  return (
    <View
      className={cn('relative overflow-hidden', className)}
      style={{
        width: width === 'full' ? '100%' : containerWidth,
        aspectRatio: numericRatio,
      }}
    >
      <View className='absolute inset-0'>{children}</View>
    </View>
  );
};
