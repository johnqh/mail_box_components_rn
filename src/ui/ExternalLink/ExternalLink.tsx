import * as React from 'react';
import { useCallback } from 'react';
import { Text, Pressable, Linking } from 'react-native';
import { cn } from '../../lib/utils';

export interface ExternalLinkProps {
  /** Link URL */
  href: string;
  /** Link text content */
  children: React.ReactNode;
  /** Show external icon */
  showIcon?: boolean;
  /** Icon position */
  iconPosition?: 'left' | 'right';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Color variant */
  variant?: 'default' | 'primary' | 'muted';
  /** Additional className */
  className?: string;
  /** Press handler (called before navigation) */
  onPress?: () => void;
}

/**
 * ExternalLink Component
 *
 * Opens external URLs in the device browser.
 * Includes optional external link icon indicator.
 *
 * @example
 * ```tsx
 * <ExternalLink href="https://example.com">
 *   Visit Example
 * </ExternalLink>
 * ```
 *
 * @example
 * ```tsx
 * <ExternalLink
 *   href="https://docs.example.com"
 *   variant="primary"
 *   iconPosition="left"
 * >
 *   Read Documentation
 * </ExternalLink>
 * ```
 */
export const ExternalLink: React.FC<ExternalLinkProps> = ({
  href,
  children,
  showIcon = true,
  iconPosition = 'right',
  size = 'md',
  variant = 'default',
  className,
  onPress,
}) => {
  // Size configurations
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  // Color variant configurations
  const variantClasses = {
    default: 'text-blue-600 dark:text-blue-400',
    primary: 'text-blue-700 dark:text-blue-300 font-semibold',
    muted: 'text-gray-600 dark:text-gray-400',
  };

  const handlePress = useCallback(async () => {
    onPress?.();
    try {
      const canOpen = await Linking.canOpenURL(href);
      if (canOpen) {
        await Linking.openURL(href);
      }
    } catch {
      // Failed to open URL
    }
  }, [href, onPress]);

  return (
    <Pressable
      onPress={handlePress}
      className={cn('flex-row items-center gap-1', className)}
      accessibilityRole='link'
      accessibilityLabel={
        typeof children === 'string' ? children : 'External link'
      }
      accessibilityHint='Opens in external browser'
    >
      {showIcon && iconPosition === 'left' && (
        <Text className={cn(sizeClasses[size], variantClasses[variant])}>
          ↗
        </Text>
      )}
      <Text
        className={cn(sizeClasses[size], variantClasses[variant], 'underline')}
      >
        {children}
      </Text>
      {showIcon && iconPosition === 'right' && (
        <Text className={cn(sizeClasses[size], variantClasses[variant])}>
          ↗
        </Text>
      )}
    </Pressable>
  );
};
