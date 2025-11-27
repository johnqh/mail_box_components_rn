import * as React from 'react';
import { Text, Pressable, Linking, Alert } from 'react-native';
import { cn } from '../../lib/utils';

export interface SmartLinkProps {
  /** Link destination - URL or internal path */
  to?: string;
  /** Alternative prop name for destination */
  href?: string;
  /** Force external link behavior */
  external?: boolean;
  /** Link text/content */
  children: React.ReactNode;
  /** Link variant */
  variant?: 'subtle' | 'default' | 'muted' | 'external' | 'inherit';
  /** Text size */
  size?: 'sm' | 'default' | 'lg';
  /** Navigation handler for internal links */
  onNavigate?: (path: string) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * SmartLink Component
 *
 * Intelligent link component that handles both internal and external links.
 * External links open in browser, internal links use the onNavigate callback.
 *
 * @example
 * ```tsx
 * <SmartLink to="/profile" onNavigate={navigate}>
 *   View Profile
 * </SmartLink>
 * <SmartLink href="https://example.com" external>
 *   Visit Website
 * </SmartLink>
 * ```
 */
export const SmartLink: React.FC<SmartLinkProps> = ({
  to,
  href,
  external,
  children,
  variant = 'subtle',
  size = 'default',
  onNavigate,
  disabled = false,
  className,
}) => {
  const destination = to || href;

  const variantClasses = {
    subtle: 'text-gray-700 dark:text-gray-300',
    default: 'text-blue-600 dark:text-blue-400 underline',
    muted: 'text-gray-500 dark:text-gray-500',
    external: 'text-blue-600 dark:text-blue-400 underline',
    inherit: 'text-inherit',
  };

  const sizeClasses = {
    sm: 'text-sm',
    default: 'text-base',
    lg: 'text-lg',
  };

  const handlePress = async () => {
    if (disabled || !destination) return;

    // Check if external
    const isExternal =
      external ||
      destination.startsWith('http') ||
      destination.startsWith('mailto:') ||
      destination.startsWith('tel:');

    if (isExternal) {
      // Open in browser
      try {
        const canOpen = await Linking.canOpenURL(destination);
        if (canOpen) {
          await Linking.openURL(destination);
        } else {
          Alert.alert('Error', 'Cannot open this link');
        }
      } catch {
        Alert.alert('Error', 'Failed to open link');
      }
    } else {
      // Internal navigation
      if (onNavigate) {
        onNavigate(destination);
      }
    }
  };

  // If no destination, render as plain text
  if (!destination) {
    return (
      <Text
        className={cn(
          variantClasses[variant],
          sizeClasses[size],
          disabled && 'opacity-50',
          className
        )}
      >
        {children}
      </Text>
    );
  }

  // Determine if external for styling
  const isExternal =
    external ||
    destination.startsWith('http') ||
    destination.startsWith('mailto:') ||
    destination.startsWith('tel:');

  const appliedVariant =
    isExternal && variant === 'subtle' ? 'external' : variant;

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole='link'
      accessibilityLabel={typeof children === 'string' ? children : undefined}
      accessibilityState={{ disabled }}
    >
      {({ pressed }) => (
        <Text
          className={cn(
            variantClasses[appliedVariant],
            sizeClasses[size],
            pressed && 'opacity-70',
            disabled && 'opacity-50',
            className
          )}
        >
          {children}
          {isExternal && appliedVariant === 'external' && ' ↗'}
        </Text>
      )}
    </Pressable>
  );
};

export interface SmartContentProps {
  /** Content with potential links */
  children: string;
  /** Link mappings from text to paths */
  mappings?: Record<string, string>;
  /** Navigation handler for internal links */
  onNavigate?: (path: string) => void;
  /** Link variant */
  variant?: SmartLinkProps['variant'];
  /** Additional className */
  className?: string;
}

/**
 * SmartContent Component
 *
 * Automatically converts text matches to links based on mappings.
 *
 * @example
 * ```tsx
 * <SmartContent
 *   mappings={{ 'privacy policy': '/privacy', 'contact us': '/contact' }}
 *   onNavigate={navigate}
 * >
 *   Please read our privacy policy or contact us for help.
 * </SmartContent>
 * ```
 */
export const SmartContent: React.FC<SmartContentProps> = ({
  children,
  mappings = {},
  onNavigate,
  variant = 'subtle',
  className,
}) => {
  const processedContent = React.useMemo(() => {
    if (!children || typeof children !== 'string') {
      return {
        parts: [children || ''],
        links: [] as { text: string; path: string; index: number }[],
      };
    }

    let content = children;
    const links: { text: string; path: string; index: number }[] = [];

    // Sort by length (longest first) to avoid partial replacements
    const sortedMappings = Object.entries(mappings).sort(
      ([a], [b]) => b.length - a.length
    );

    let placeholderIndex = 0;
    sortedMappings.forEach(([text, path]) => {
      if (text && path) {
        const regex = new RegExp(
          `\\b${text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`,
          'gi'
        );
        content = content.replace(regex, match => {
          links.push({ text: match, path, index: placeholderIndex });
          return `__LINK_${placeholderIndex++}__`;
        });
      }
    });

    // Split content by placeholders
    const parts = content.split(/(__LINK_\d+__)/);

    return { parts, links };
  }, [children, mappings]);

  const { parts, links } = processedContent;

  return (
    <Text className={cn('text-gray-900 dark:text-gray-100', className)}>
      {parts.map((part, index) => {
        const linkMatch = part.match(/__LINK_(\d+)__/);
        if (linkMatch) {
          const linkIndex = parseInt(linkMatch[1], 10);
          const link = links.find(l => l.index === linkIndex);
          if (link) {
            return (
              <SmartLink
                key={index}
                to={link.path}
                variant={variant}
                onNavigate={onNavigate}
              >
                {link.text}
              </SmartLink>
            );
          }
        }
        return <Text key={index}>{part}</Text>;
      })}
    </Text>
  );
};
