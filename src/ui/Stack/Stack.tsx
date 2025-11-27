import * as React from 'react';
import { View, ViewProps } from 'react-native';
import { cn } from '../../lib/utils';

export interface StackProps extends ViewProps {
  /** Stack content */
  children: React.ReactNode;
  /** Stack direction */
  direction?: 'vertical' | 'horizontal';
  /** Spacing between items */
  spacing?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /** Align items */
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  /** Justify content */
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  /** Wrap items */
  wrap?: boolean;
  /** Full width/height */
  full?: boolean;
  /** Divider between items */
  divider?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * Stack Component
 *
 * Flexbox-based layout component for arranging children vertically or horizontally
 * with consistent spacing. Supports alignment, wrapping, and dividers.
 *
 * @example
 * ```tsx
 * <Stack spacing="md">
 *   <View><Text>Item 1</Text></View>
 *   <View><Text>Item 2</Text></View>
 *   <View><Text>Item 3</Text></View>
 * </Stack>
 * ```
 *
 * @example
 * ```tsx
 * <Stack
 *   direction="horizontal"
 *   spacing="lg"
 *   align="center"
 *   justify="between"
 * >
 *   <Button>Cancel</Button>
 *   <Button>Save</Button>
 * </Stack>
 * ```
 */
export const Stack: React.FC<StackProps> = ({
  children,
  direction = 'vertical',
  spacing = 'md',
  align = 'stretch',
  justify = 'start',
  wrap = false,
  full = false,
  divider = false,
  className,
  ...viewProps
}) => {
  const isVertical = direction === 'vertical';

  // Gap classes (NativeWind supports gap)
  const gapClasses: Record<string, Record<string, string>> = {
    vertical: {
      none: '',
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
      '2xl': 'gap-12',
    },
    horizontal: {
      none: '',
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
      '2xl': 'gap-12',
    },
  };

  // Align items configurations
  const alignClasses: Record<string, string> = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline',
  };

  // Justify content configurations
  const justifyClasses: Record<string, string> = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };

  return (
    <View
      className={cn(
        'flex',
        isVertical ? 'flex-col' : 'flex-row',
        gapClasses[direction][spacing],
        alignClasses[align],
        justifyClasses[justify],
        wrap && 'flex-wrap',
        full && (isVertical ? 'h-full' : 'w-full'),
        className
      )}
      {...viewProps}
    >
      {divider
        ? React.Children.map(children, (child, index) => (
            <React.Fragment key={index}>
              {child}
              {index < React.Children.count(children) - 1 && (
                <View
                  className={cn(
                    'bg-gray-200 dark:bg-gray-700',
                    isVertical ? 'h-px w-full' : 'w-px h-full'
                  )}
                />
              )}
            </React.Fragment>
          ))
        : children}
    </View>
  );
};

/**
 * VStack - Vertical Stack (alias for Stack with direction="vertical")
 */
export const VStack: React.FC<Omit<StackProps, 'direction'>> = props => (
  <Stack direction='vertical' {...props} />
);

/**
 * HStack - Horizontal Stack (alias for Stack with direction="horizontal")
 */
export const HStack: React.FC<Omit<StackProps, 'direction'>> = props => (
  <Stack direction='horizontal' {...props} />
);
