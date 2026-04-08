import React from 'react';
import { View, Text, Pressable, type ViewProps } from 'react-native';
import { cn } from '../../lib/utils';
import { textVariants, getCardVariantColors } from '@sudobility/design';

/**
 * Props for the Card component.
 *
 * Supports multiple visual variants (bordered, elevated, info, success, etc.),
 * configurable padding, optional icon display, and a close button for
 * info-type variants.
 */
export interface CardProps extends ViewProps {
  variant?:
    | 'default'
    | 'bordered'
    | 'elevated'
    | 'info'
    | 'success'
    | 'warning'
    | 'error'
    | 'callout';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** For callout variant: apply gradient background */
  gradient?: boolean;
  /** For info/callout variants: show icon */
  icon?: React.ReactNode;
  /** For info variants: show close button */
  onClose?: () => void;
}

// Callout uses the DS info card variant colors
const calloutStyle = getCardVariantColors('info');

const paddingStyles = {
  none: '',
  sm: 'p-3',
  md: 'p-6',
  lg: 'p-8',
};

/**
 * Card component for React Native.
 *
 * A versatile container with variant-based styling from the design system.
 * Info-type variants (info, success, warning, error) support an optional
 * icon and close button.
 *
 * @example
 * ```tsx
 * <Card variant="elevated" padding="md">
 *   <CardHeader title="Title" description="Subtitle" />
 *   <CardContent><Text>Body</Text></CardContent>
 *   <CardFooter><Button>Action</Button></CardFooter>
 * </Card>
 * ```
 */
export const Card: React.FC<CardProps> = ({
  variant = 'elevated',
  padding = 'md',
  icon,
  onClose,
  className,
  children,
  ...props
}) => {
  const isInfoVariant = ['info', 'success', 'warning', 'error'].includes(
    variant
  );
  const showIconOrClose = isInfoVariant && (icon || onClose);

  const variantClasses =
    variant === 'callout'
      ? calloutStyle
      : getCardVariantColors(
          variant as Parameters<typeof getCardVariantColors>[0]
        );

  return (
    <View
      className={cn(
        'rounded-lg',
        variantClasses,
        paddingStyles[padding],
        className
      )}
      {...props}
    >
      {showIconOrClose ? (
        <View className='flex-row items-start gap-3'>
          {icon && <View className='flex-shrink-0'>{icon}</View>}
          <View className='flex-1'>{children}</View>
          {onClose && (
            <Pressable
              onPress={onClose}
              className='flex-shrink-0 opacity-70'
              accessibilityLabel='Close'
              accessibilityRole='button'
            >
              <Text className='text-lg'>×</Text>
            </Pressable>
          )}
        </View>
      ) : (
        children
      )}
    </View>
  );
};

/** Props for the CardHeader sub-component. */
interface CardHeaderProps extends ViewProps {
  /** Card title rendered as a heading. */
  title?: string;
  /** Card description rendered below the title. */
  description?: string;
}

/**
 * Card header sub-component with optional title and description.
 * Uses design system text variants for consistent typography.
 */
export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  description,
  className,
  children,
  ...props
}) => {
  return (
    <View className={cn('gap-1.5', className)} {...props}>
      {title && <Text className={textVariants.heading.h4()}>{title}</Text>}
      {description && (
        <Text className={textVariants.body.sm()}>{description}</Text>
      )}
      {children}
    </View>
  );
};

/** Card body content area. */
export const CardContent: React.FC<ViewProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <View className={cn('', className)} {...props}>
      {children}
    </View>
  );
};

/** Card footer area, rendered as a horizontal row with top padding. */
export const CardFooter: React.FC<ViewProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <View className={cn('flex-row items-center pt-4', className)} {...props}>
      {children}
    </View>
  );
};
