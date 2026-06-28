import * as React from 'react';
import { View, Text, Pressable } from 'react-native';
import { cn } from '../../lib/utils';
import { colors, designTokens } from '@sudobility/design';

/**
 * Split combined DS badge color strings (which include both bg-* and text-*)
 * into separate bg and text class strings. React Native Views don't cascade
 * text color to child Text elements, so we must apply them separately.
 */
function splitBadgeClasses(base: string, dark: string) {
  const all = `${base} ${dark}`.split(' ');
  return {
    bg: all.filter(c => c.includes('bg-')).join(' '),
    text: all.filter(c => c.includes('text-')).join(' '),
  };
}

// Lazily derive badge colors from the design system so module-level access
// doesn't fail when Jest transforms ESM chunk imports.
let _badgeColors: ReturnType<typeof buildBadgeColors> | null = null;
function getBadgeColors() {
  if (!_badgeColors) _badgeColors = buildBadgeColors();
  return _badgeColors;
}
function buildBadgeColors() {
  const badge = colors.component.badge;
  return {
    default: splitBadgeClasses(badge.default.base, badge.default.dark),
    primary: splitBadgeClasses(badge.primary.base, badge.primary.dark),
    success: splitBadgeClasses(badge.success.base, badge.success.dark),
    warning: splitBadgeClasses(badge.warning.base, badge.warning.dark),
    error: splitBadgeClasses(badge.error.base, badge.error.dark),
  };
}

export interface BadgeProps {
  /** Badge content */
  children?: React.ReactNode;
  /** Color variant */
  variant?:
    | 'default'
    | 'primary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'purple';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Icon to display */
  icon?: React.ReactNode;
  /** Show dot indicator */
  dot?: boolean;
  /** Render as pill (rounded-full) */
  pill?: boolean;
  /** Render as outline style */
  outline?: boolean;
  /** Press handler */
  onPress?: () => void;
  /** Dismissible badge with close button */
  dismissible?: boolean;
  /** Dismiss handler */
  onDismiss?: () => void;
  /** Count to display */
  count?: number;
  /** Max count before showing "+" */
  maxCount?: number;
  /** Additional className */
  className?: string;
}

/**
 * Badge Component
 *
 * Small status or label component for displaying metadata, status, or categories.
 * Commonly used for tags, statuses, counts, and labels.
 *
 * @example
 * ```tsx
 * <Badge variant="success">Active</Badge>
 * <Badge variant="primary" size="sm">New</Badge>
 * <Badge variant="warning" dot>Pending</Badge>
 * ```
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  icon,
  dot = false,
  pill = false,
  outline = false,
  onPress,
  dismissible = false,
  onDismiss,
  count,
  maxCount,
  className,
}) => {
  const ds = getBadgeColors();

  // Filled badge backgrounds from design system (colors.component.badge)
  const variantClasses = {
    default: ds.default.bg,
    primary: ds.primary.bg,
    success: ds.success.bg,
    warning: ds.warning.bg,
    danger: ds.error.bg,
    info: ds.primary.bg,
    purple: 'bg-accent',
  };

  // Filled badge text colors from design system
  const variantTextClasses = {
    default: ds.default.text,
    primary: ds.primary.text,
    success: ds.success.text,
    warning: ds.warning.text,
    danger: ds.error.text,
    info: ds.primary.text,
    purple: 'text-accent-foreground dark:text-accent-foreground',
  };

  // Outline badge borders (no direct DS equivalent; aligned with DS color palette)
  const outlineClasses = {
    default: 'border border-border',
    primary: 'border border-primary ',
    success: 'border border-success ',
    warning: 'border border-warning ',
    danger: 'border border-destructive ',
    info: 'border border-primary ',
    purple: 'border border-accent ',
  };

  const outlineTextClasses = {
    default: 'text-muted-foreground',
    primary: 'text-primary',
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-destructive',
    info: 'text-primary',
    purple: 'text-accent-foreground',
  };

  // Size configurations
  const sizeClasses = {
    sm: 'px-2 py-0.5',
    md: 'px-2.5 py-1',
    lg: 'px-3 py-1.5',
  };

  // Dot indicator colors aligned with DS palette
  const dotColorClasses = {
    default: 'bg-muted ',
    primary: 'bg-primary ',
    success: 'bg-success ',
    warning: 'bg-warning ',
    danger: 'bg-destructive ',
    info: 'bg-primary ',
    purple: 'bg-accent ',
  };

  // Format count display
  const displayCount =
    count !== undefined
      ? maxCount !== undefined && count > maxCount
        ? `${maxCount}+`
        : count.toString()
      : null;

  const containerClasses = cn(
    'flex flex-row items-center',
    outline ? outlineClasses[variant] : variantClasses[variant],
    sizeClasses[size],
    pill ? 'rounded-full' : 'rounded',
    className
  );

  const { typography } = designTokens;
  const textSizeMap = {
    sm: typography.size.xs,
    md: typography.size.sm,
    lg: typography.size.base,
  };
  const textClasses = cn(
    textSizeMap[size],
    typography.weight.medium,
    outline ? outlineTextClasses[variant] : variantTextClasses[variant]
  );

  const content = (
    <>
      {dot && (
        <View
          className={cn(
            'w-2 h-2 rounded-full mr-1.5',
            dotColorClasses[variant]
          )}
        />
      )}
      {icon && <View className='mr-1'>{icon}</View>}
      {children && <Text className={textClasses}>{children}</Text>}
      {displayCount && (
        <Text className={cn(textClasses, 'ml-1')}>{displayCount}</Text>
      )}
      {dismissible && onDismiss && (
        <Pressable
          onPress={onDismiss}
          className='ml-1 p-0.5'
          accessibilityRole='button'
          accessibilityLabel='Dismiss'
        >
          <Text className={textClasses}>×</Text>
        </Pressable>
      )}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className={containerClasses}
        accessibilityRole='button'
      >
        {content}
      </Pressable>
    );
  }

  return <View className={containerClasses}>{content}</View>;
};
