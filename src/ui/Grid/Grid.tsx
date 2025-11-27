import * as React from 'react';
import { View, Dimensions } from 'react-native';
import { cn } from '../../lib/utils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface GridProps {
  /** Grid content */
  children: React.ReactNode;
  /** Number of columns */
  cols?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Gap between items */
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /** Align items */
  alignItems?: 'start' | 'center' | 'end' | 'stretch';
  /** Additional className */
  className?: string;
}

export interface GridItemProps {
  /** Grid item content */
  children: React.ReactNode;
  /** Column span */
  colSpan?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Additional className */
  className?: string;
}

/**
 * Grid Component
 *
 * Flexbox-based grid layout component for React Native.
 * Uses flex-wrap to simulate CSS Grid behavior.
 *
 * @example
 * ```tsx
 * <Grid cols={3} gap="md">
 *   <GridItem><Card>Item 1</Card></GridItem>
 *   <GridItem><Card>Item 2</Card></GridItem>
 *   <GridItem><Card>Item 3</Card></GridItem>
 * </Grid>
 * ```
 *
 * @example
 * ```tsx
 * <Grid cols={2} gap="lg">
 *   <GridItem colSpan={2}><Card>Full width</Card></GridItem>
 *   <GridItem><Card>Half</Card></GridItem>
 *   <GridItem><Card>Half</Card></GridItem>
 * </Grid>
 * ```
 */
export const Grid: React.FC<GridProps> = ({
  children,
  cols = 1,
  gap = 'md',
  alignItems = 'stretch',
  className,
}) => {
  // Gap configurations (in pixels for calculation)
  const gapValues = {
    none: 0,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
  };

  // Gap class mapping
  const gapClasses = {
    none: '',
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
    '2xl': 'gap-12',
  };

  // Align items configurations
  const alignItemsClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  const gapValue = gapValues[gap];

  // Calculate item width based on columns and gap
  // Note: In RN, we need to calculate this manually
  const getItemWidth = (span: number = 1) => {
    const totalGap = gapValue * (cols - 1);
    const availableWidth = SCREEN_WIDTH - 32; // Account for container padding
    const columnWidth = (availableWidth - totalGap) / cols;
    return columnWidth * span + gapValue * (span - 1);
  };

  // Clone children with calculated width
  const childrenWithWidth = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      const colSpan = (child.props as GridItemProps).colSpan || 1;
      return React.cloneElement(child as React.ReactElement, {
        style: {
          width: getItemWidth(colSpan),
          ...(child.props as { style?: object }).style,
        },
      });
    }
    return child;
  });

  return (
    <View
      className={cn(
        'flex flex-row flex-wrap',
        gapClasses[gap],
        alignItemsClasses[alignItems],
        className
      )}
    >
      {childrenWithWidth}
    </View>
  );
};

/**
 * GridItem Component
 *
 * Individual grid item that can span multiple columns.
 */
export const GridItem: React.FC<GridItemProps & { style?: object }> = ({
  children,
  className,
  style,
}) => {
  return (
    <View className={cn(className)} style={style}>
      {children}
    </View>
  );
};
