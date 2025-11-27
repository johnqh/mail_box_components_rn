import * as React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { cn } from '../../lib/utils';

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
export const CodeDisplay: React.FC<CodeDisplayProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  inline = false,
  align = 'left',
  wrap = false,
  className,
}) => {
  // Color variant configurations
  const variantClasses = {
    primary: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30',
    secondary:
      'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/30',
    success:
      'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/30',
    warning:
      'text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30',
    neutral: 'text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800',
  };

  // Size configurations
  const sizeClasses = {
    xs: {
      text: 'text-xs',
      padding: inline ? 'px-1.5 py-0.5' : 'px-2 py-1',
    },
    sm: {
      text: 'text-sm',
      padding: inline ? 'px-2 py-0.5' : 'px-3 py-1.5',
    },
    md: {
      text: 'text-base',
      padding: inline ? 'px-2.5 py-1' : 'px-4 py-2',
    },
    lg: {
      text: 'text-lg',
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

  // Extract background and text color classes
  const [textColorClass, bgClass] = variantClasses[variant].split(' ');

  if (inline) {
    return (
      <Text
        className={cn(
          'font-mono rounded-lg',
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
        'font-mono',
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
