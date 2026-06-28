import * as React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { cn } from '../../lib/utils';
import { colors, designTokens } from '@sudobility/design';

export interface CodeDisplayProps {
  /** Code or text to display */
  children: React.ReactNode;
  /** Visual variant */
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'neutral';
  /** Size variant */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** Display as inline or block */
  inline?: boolean;
  /** Text alignment (for block display) */
  align?: 'left' | 'center' | 'right';
  /** Whether to enable text wrapping */
  wrap?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * CodeDisplay Component
 *
 * Displays code, wallet addresses, or monospace text in a styled container.
 * Commonly used for displaying blockchain addresses, code snippets, or
 * technical identifiers.
 *
 * @example
 * ```tsx
 * <CodeDisplay variant="primary" size="lg" align="center">
 *   wallet@example.com
 * </CodeDisplay>
 * ```
 *
 * @example
 * ```tsx
 * <CodeDisplay variant="success" inline>
 *   0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
 * </CodeDisplay>
 * ```
 */

// Lazily derive display colors from DS to avoid ESM issues in tests.
let _displayColors: ReturnType<typeof buildDisplayColors> | null = null;
function getDisplayColors() {
  if (!_displayColors) _displayColors = buildDisplayColors();
  return _displayColors;
}
function buildDisplayColors() {
  const alert = colors.component.alert;
  function splitClasses(base: string, dark: string) {
    const all = `${base} ${dark}`.split(' ');
    return {
      text: all.filter(c => c.includes('text-')).join(' '),
      bg: all.filter(c => c.includes('bg-')).join(' '),
    };
  }
  const info = splitClasses(alert.info.base, alert.info.dark);
  const success = splitClasses(alert.success.base, alert.success.dark);
  const warning = splitClasses(alert.warning.base, alert.warning.dark);
  return {
    primary: `${info.text} ${info.bg}`,
    // secondary uses purple — no DS mapping, keep local
    secondary: 'text-accent-foreground bg-accent ',
    success: `${success.text} ${success.bg}`,
    warning: `${warning.text} ${warning.bg}`,
    neutral: 'text-muted-foreground bg-muted',
  } as Record<string, string>;
}

export const CodeDisplay: React.FC<CodeDisplayProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  inline = false,
  align = 'left',
  wrap = false,
  className,
}) => {
  // Color variant configurations from DS
  const variantClasses = getDisplayColors();

  // Size configurations using DS typography tokens
  const sizeClasses = {
    xs: {
      text: designTokens.typography.size.xs,
      padding: inline ? 'px-1.5 py-0.5' : 'px-2 py-1',
    },
    sm: {
      text: designTokens.typography.size.sm,
      padding: inline ? 'px-2 py-0.5' : 'px-3 py-1.5',
    },
    md: {
      text: designTokens.typography.size.base,
      padding: inline ? 'px-2.5 py-1' : 'px-4 py-2',
    },
    lg: {
      text: designTokens.typography.size.lg,
      padding: inline ? 'px-3 py-1' : 'px-4 py-2',
    },
  };

  // Text alignment classes
  const alignClasses = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  const sizeConfig = sizeClasses[size];

  // Extract background and text color classes from combined variant string
  const variantParts = variantClasses[variant].split(' ');
  const textColorClass = variantParts
    .filter(c => c.includes('text-'))
    .join(' ');
  const bgClass = variantParts.filter(c => c.includes('bg-')).join(' ');

  if (inline) {
    return (
      <Text
        className={cn(
          `${designTokens.typography.family.mono} rounded-lg`,
          textColorClass,
          bgClass,
          sizeConfig.text,
          sizeConfig.padding,
          className
        )}
      >
        {children}
      </Text>
    );
  }

  const content = (
    <Text
      className={cn(
        designTokens.typography.family.mono,
        textColorClass,
        sizeConfig.text,
        !inline && alignClasses[align],
        wrap ? 'flex-wrap' : ''
      )}
      numberOfLines={wrap ? undefined : 1}
    >
      {children}
    </Text>
  );

  if (wrap) {
    return (
      <View
        className={cn('rounded-lg', bgClass, sizeConfig.padding, className)}
      >
        {content}
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className={cn('rounded-lg', bgClass, className)}
      contentContainerStyle={{ padding: 0 }}
    >
      <View className={sizeConfig.padding}>{content}</View>
    </ScrollView>
  );
};
