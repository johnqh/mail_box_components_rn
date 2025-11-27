import * as React from 'react';
import { View, Dimensions } from 'react-native';
import { cn } from '../../lib/utils';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export interface ContainerProps {
  /** Container content */
  children: React.ReactNode;
  /** Max width variant */
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  /** Center container horizontally */
  center?: boolean;
  /** Padding */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Additional className */
  className?: string;
}

/**
 * Container Component
 *
 * Responsive container with max-width constraints and horizontal centering.
 * Useful for creating consistent page layouts and content areas.
 *
 * @example
 * ```tsx
 * <Container>
 *   <Text>Page Content</Text>
 * </Container>
 * ```
 *
 * @example
 * ```tsx
 * <Container size="lg" padding="lg">
 *   <Text>Centered content with large max-width</Text>
 * </Container>
 * ```
 */
export const Container: React.FC<ContainerProps> = ({
  children,
  size = 'xl',
  center = true,
  padding = 'md',
  className,
}) => {
  // Max-width configurations (for larger screens/tablets)
  const maxWidths = {
    sm: 384, // 24rem
    md: 448, // 28rem
    lg: 512, // 32rem
    xl: 576, // 36rem
    '2xl': 672, // 42rem
    full: SCREEN_WIDTH,
  };

  // Padding configurations
  const paddingClasses = {
    none: '',
    sm: 'px-4 py-2',
    md: 'px-4 py-4',
    lg: 'px-6 py-6',
  };

  const maxWidth = maxWidths[size];

  return (
    <View
      className={cn(
        'w-full',
        center && 'self-center',
        paddingClasses[padding],
        className
      )}
      style={{
        maxWidth: maxWidth < SCREEN_WIDTH ? maxWidth : undefined,
      }}
    >
      {children}
    </View>
  );
};
