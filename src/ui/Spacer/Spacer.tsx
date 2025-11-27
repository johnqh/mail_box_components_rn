import * as React from 'react';
import { View } from 'react-native';
import { cn } from '../../lib/utils';

export interface SpacerProps {
  /** Size of the spacer */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | number;
  /** Direction of spacing */
  axis?: 'horizontal' | 'vertical';
  /** Flex grow to fill available space */
  flex?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * Spacer Component
 *
 * Creates empty space between elements. Can be a fixed size or flexible.
 * Useful for creating consistent spacing in layouts.
 *
 * @example
 * ```tsx
 * <HStack>
 *   <Button>Cancel</Button>
 *   <Spacer flex />
 *   <Button>Save</Button>
 * </HStack>
 * ```
 *
 * @example
 * ```tsx
 * <VStack>
 *   <Text>Title</Text>
 *   <Spacer size="lg" />
 *   <Text>Content</Text>
 * </VStack>
 * ```
 */
export const Spacer: React.FC<SpacerProps> = ({
  size = 'md',
  axis = 'vertical',
  flex = false,
  className,
}) => {
  // Size configurations
  const sizeClasses = {
    vertical: {
      xs: 'h-1',
      sm: 'h-2',
      md: 'h-4',
      lg: 'h-6',
      xl: 'h-8',
      '2xl': 'h-12',
    },
    horizontal: {
      xs: 'w-1',
      sm: 'w-2',
      md: 'w-4',
      lg: 'w-6',
      xl: 'w-8',
      '2xl': 'w-12',
    },
  };

  // Custom size (number)
  const customSizeStyle =
    typeof size === 'number'
      ? axis === 'vertical'
        ? { height: size }
        : { width: size }
      : undefined;

  const sizeClass = typeof size === 'string' ? sizeClasses[axis][size] : '';

  return (
    <View
      className={cn(flex && 'flex-1', !flex && sizeClass, className)}
      style={customSizeStyle}
      accessibilityElementsHidden
    />
  );
};
