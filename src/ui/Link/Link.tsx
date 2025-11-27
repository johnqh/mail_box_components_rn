import * as React from 'react';
import { Text, Pressable, Linking } from 'react-native';
import { cn } from '../../lib/utils';

export interface LinkProps {
  /** Link URL */
  href: string;
  /** Link content */
  children: React.ReactNode;
  /** Variant style */
  variant?: 'default' | 'primary' | 'secondary' | 'muted' | 'underline';
  /** Show external icon indicator */
  showExternalIcon?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Additional className */
  className?: string;
  /** Press handler (if provided, href is not automatically opened) */
  onPress?: () => void;
}

/**
 * Link Component
 *
 * Versatile link component for React Native with external link handling.
 * Opens URLs using Linking API.
 *
 * @example
 * ```tsx
 * <Link href="https://example.com">External Site</Link>
 * ```
 *
 * @example
 * ```tsx
 * <Link
 *   href="https://docs.example.com"
 *   variant="primary"
 *   showExternalIcon
 * >
 *   Documentation
 * </Link>
 * ```
 */
export const Link: React.FC<LinkProps> = ({
  href,
  children,
  variant = 'default',
  showExternalIcon = false,
  disabled = false,
  className,
  onPress,
}) => {
  // Auto-detect external links
  const isExternal = href.startsWith('http://') || href.startsWith('https://');

  // Variant configurations
  const variantClasses = {
    default: 'text-blue-600 dark:text-blue-400',
    primary: 'text-blue-600 dark:text-blue-400 font-medium',
    secondary: 'text-gray-600 dark:text-gray-400',
    muted: 'text-gray-500 dark:text-gray-500',
    underline: 'text-blue-600 dark:text-blue-400 underline',
  };

  const handlePress = async () => {
    if (disabled) return;

    if (onPress) {
      onPress();
      return;
    }

    try {
      const supported = await Linking.canOpenURL(href);
      if (supported) {
        await Linking.openURL(href);
      }
    } catch (error) {
      console.error('Failed to open URL:', error);
    }
  };

  if (disabled) {
    return (
      <Text className={cn('opacity-50', variantClasses[variant], className)}>
        {children}
        {showExternalIcon && isExternal && <Text className='text-xs'> ↗</Text>}
      </Text>
    );
  }

  return (
    <Pressable
      onPress={handlePress}
      accessibilityRole='link'
      accessibilityLabel={typeof children === 'string' ? children : href}
    >
      <Text className={cn(variantClasses[variant], className)}>
        {children}
        {showExternalIcon && isExternal && <Text className='text-xs'> ↗</Text>}
      </Text>
    </Pressable>
  );
};
