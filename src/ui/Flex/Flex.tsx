import * as React from 'react';
import { cn } from '../../lib/utils';
import { Box, BoxProps } from '../Box';

export interface FlexProps extends Omit<BoxProps, 'className'> {
  /** Flex direction */
  direction?: 'row' | 'row-reverse' | 'col' | 'col-reverse';
  /** Align items */
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  /** Justify content */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  /** Wrap items */
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  /** Gap between items */
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /** Additional className */
  className?: string;
}

/**
 * Flex Component
 *
 * Flexbox layout component extending Box with flex-specific properties.
 * Provides convenient props for common flexbox patterns.
 *
 * @example
 * ```tsx
 * <Flex justify="between" align="center" p="md">
 *   <Text>Left</Text>
 *   <Button>Right</Button>
 * </Flex>
 * ```
 *
 * @example
 * ```tsx
 * <Flex direction="col" gap="md" p="lg">
 *   <Card>Item 1</Card>
 *   <Card>Item 2</Card>
 * </Flex>
 * ```
 */
export const Flex: React.FC<FlexProps> = ({
  direction = 'row',
  align,
  justify,
  wrap = 'nowrap',
  gap,
  className,
  ...boxProps
}) => {
  // Direction configurations
  const directionClasses: Record<string, string> = {
    row: 'flex-row',
    'row-reverse': 'flex-row-reverse',
    col: 'flex-col',
    'col-reverse': 'flex-col-reverse',
  };

  // Align items configurations
  const alignClasses = align
    ? {
        start: 'items-start',
        center: 'items-center',
        end: 'items-end',
        stretch: 'items-stretch',
        baseline: 'items-baseline',
      }[align]
    : '';

  // Justify content configurations
  const justifyClasses = justify
    ? {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
        between: 'justify-between',
        around: 'justify-around',
        evenly: 'justify-evenly',
      }[justify]
    : '';

  // Wrap configurations
  const wrapClasses: Record<string, string> = {
    nowrap: 'flex-nowrap',
    wrap: 'flex-wrap',
    'wrap-reverse': 'flex-wrap-reverse',
  };

  // Gap configurations
  const gapClasses = gap
    ? {
        none: 'gap-0',
        xs: 'gap-1',
        sm: 'gap-2',
        md: 'gap-4',
        lg: 'gap-6',
        xl: 'gap-8',
        '2xl': 'gap-12',
      }[gap]
    : '';

  return (
    <Box
      {...boxProps}
      className={cn(
        'flex',
        directionClasses[direction],
        alignClasses,
        justifyClasses,
        wrapClasses[wrap],
        gapClasses,
        className
      )}
    />
  );
};
