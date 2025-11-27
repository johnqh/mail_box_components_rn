import * as React from 'react';
import { View } from 'react-native';
import { cn } from '../../lib/utils';

export interface CenterProps {
  /** Content to center */
  children: React.ReactNode;
  /** Axis to center on */
  axis?: 'horizontal' | 'vertical' | 'both';
  /** Additional className */
  className?: string;
}

/**
 * Center Component
 *
 * Centers content horizontally, vertically, or both using flexbox.
 * Useful for centering loading states, empty states, and modal content.
 *
 * @example
 * ```tsx
 * <Center>
 *   <Spinner />
 * </Center>
 * ```
 *
 * @example
 * ```tsx
 * <Center axis="horizontal">
 *   <Button>Centered Button</Button>
 * </Center>
 * ```
 */
export const Center: React.FC<CenterProps> = ({
  children,
  axis = 'both',
  className,
}) => {
  const getFlexClasses = () => {
    switch (axis) {
      case 'horizontal':
        return 'justify-center';
      case 'vertical':
        return 'items-center';
      case 'both':
      default:
        return 'justify-center items-center';
    }
  };

  return (
    <View className={cn('flex', getFlexClasses(), className)}>{children}</View>
  );
};
