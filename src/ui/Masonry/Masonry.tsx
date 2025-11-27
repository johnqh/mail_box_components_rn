import * as React from 'react';
import { View } from 'react-native';
import { cn } from '../../lib/utils';

export interface MasonryProps {
  /** Children elements */
  children: React.ReactNode;
  /** Number of columns */
  columns?: number;
  /** Gap between items */
  gap?: number;
  /** Additional className */
  className?: string;
}

/**
 * Masonry Component
 *
 * Pinterest-style masonry grid layout for React Native.
 * Distributes items across columns for optimal spacing.
 *
 * @example
 * ```tsx
 * <Masonry columns={2} gap={16}>
 *   {items.map(item => <Card key={item.id}>{item.content}</Card>)}
 * </Masonry>
 * ```
 */
export const Masonry: React.FC<MasonryProps> = ({
  children,
  columns = 2,
  gap = 16,
  className,
}) => {
  // Distribute items into columns
  const childArray = React.Children.toArray(children);
  const columnArrays: React.ReactNode[][] = Array.from(
    { length: columns },
    () => []
  );

  childArray.forEach((child, index) => {
    columnArrays[index % columns].push(child);
  });

  return (
    <View className={cn('flex-row', className)} style={{ gap }}>
      {columnArrays.map((column, columnIndex) => (
        <View key={columnIndex} className='flex-1' style={{ gap }}>
          {column.map((item, itemIndex) => (
            <View key={itemIndex}>{item}</View>
          ))}
        </View>
      ))}
    </View>
  );
};
