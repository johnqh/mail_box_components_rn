import * as React from 'react';
import { View, ViewProps } from 'react-native';
import { cn } from '../../lib/utils';

export interface BoxProps extends ViewProps {
  /** Box content */
  children?: React.ReactNode;
  /** Padding */
  p?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /** Padding X-axis */
  px?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /** Padding Y-axis */
  py?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /** Margin */
  m?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'auto';
  /** Margin X-axis */
  mx?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'auto';
  /** Margin Y-axis */
  my?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'auto';
  /** Background color */
  bg?:
    | 'transparent'
    | 'white'
    | 'gray'
    | 'primary'
    | 'success'
    | 'warning'
    | 'danger';
  /** Border */
  border?: boolean;
  /** Border radius */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Shadow */
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** Width */
  w?: 'auto' | 'full';
  /** Height */
  h?: 'auto' | 'full';
  /** Additional className */
  className?: string;
}

/**
 * Box Component
 *
 * Fundamental layout primitive with spacing, sizing, and styling props.
 * Acts as a building block for creating layouts and containers.
 *
 * @example
 * ```tsx
 * <Box p="md" bg="white" rounded="lg" shadow="md">
 *   <Text>Card Content</Text>
 * </Box>
 * ```
 */
export const Box: React.FC<BoxProps> = ({
  children,
  p,
  px,
  py,
  m,
  mx,
  my,
  bg,
  border = false,
  rounded,
  shadow,
  w,
  h,
  className,
  ...viewProps
}) => {
  // Spacing configurations
  const spacingClasses: Record<string, string> = {
    none: '0',
    xs: '1',
    sm: '2',
    md: '4',
    lg: '6',
    xl: '8',
    '2xl': '12',
    auto: 'auto',
  };

  // Background configurations
  const bgClasses = bg
    ? {
        transparent: 'bg-transparent',
        white: 'bg-card',
        gray: 'bg-muted',
        primary: 'bg-primary/10',
        success: 'bg-success/10',
        warning: 'bg-warning/10',
        danger: 'bg-destructive/10',
      }[bg]
    : '';

  // Border radius configurations
  const roundedClasses = rounded
    ? {
        none: 'rounded-none',
        sm: 'rounded-sm',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        full: 'rounded-full',
      }[rounded]
    : '';

  // Shadow configurations
  const shadowClasses = shadow
    ? {
        none: 'shadow-none',
        sm: 'shadow-sm',
        md: 'shadow-md',
        lg: 'shadow-lg',
        xl: 'shadow-xl',
      }[shadow]
    : '';

  // Width configurations
  const wClasses = w
    ? {
        auto: '',
        full: 'w-full',
      }[w]
    : '';

  // Height configurations
  const hClasses = h
    ? {
        auto: '',
        full: 'h-full',
      }[h]
    : '';

  // Build padding classes
  const paddingClasses: string[] = [];
  if (p) paddingClasses.push('p-' + spacingClasses[p]);
  if (px) paddingClasses.push('px-' + spacingClasses[px]);
  if (py) paddingClasses.push('py-' + spacingClasses[py]);

  // Build margin classes
  const marginClasses: string[] = [];
  if (m) marginClasses.push('m-' + spacingClasses[m]);
  if (mx) marginClasses.push('mx-' + spacingClasses[mx]);
  if (my) marginClasses.push('my-' + spacingClasses[my]);

  return (
    <View
      className={cn(
        ...paddingClasses,
        ...marginClasses,
        bgClasses,
        border && 'border border-border',
        roundedClasses,
        shadowClasses,
        wClasses,
        hClasses,
        className
      )}
      {...viewProps}
    >
      {children}
    </View>
  );
};
