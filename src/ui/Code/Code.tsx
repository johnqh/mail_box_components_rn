import * as React from 'react';
import { Text, View } from 'react-native';
import { cn } from '../../lib/utils';
import { colors, designTokens } from '@sudobility/design';

export interface CodeProps {
  /** Code content */
  children: React.ReactNode;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Color variant */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  /** Additional className */
  className?: string;
}

/**
 * Code Component
 *
 * Displays inline code snippets with monospace font and consistent styling.
 *
 * @example
 * ```tsx
 * <Text>Use the <Code>useState</Code> hook</Text>
 * ```
 *
 * @example
 * ```tsx
 * <Code variant="primary" size="lg">
 *   npm install
 * </Code>
 * ```
 */

// Lazily derive code colors from DS to avoid ESM issues in tests.
let _codeColors: ReturnType<typeof buildCodeColors> | null = null;
function getCodeColors() {
  if (!_codeColors) _codeColors = buildCodeColors();
  return _codeColors;
}
function buildCodeColors() {
  const alert = colors.component.alert;
  // Split combined DS classes into separate bg/text for RN
  function splitClasses(base: string, dark: string) {
    const all = `${base} ${dark}`.split(' ');
    return {
      bg: all.filter(c => c.includes('bg-')).join(' '),
      text: all.filter(c => c.includes('text-')).join(' '),
    };
  }
  const info = splitClasses(alert.info.base, alert.info.dark);
  const success = splitClasses(alert.success.base, alert.success.dark);
  const warning = splitClasses(alert.warning.base, alert.warning.dark);
  const error = splitClasses(alert.error.base, alert.error.dark);
  return {
    bg: {
      default: 'bg-gray-100 dark:bg-gray-800',
      primary: info.bg,
      success: success.bg,
      warning: warning.bg,
      danger: error.bg,
    } as Record<string, string>,
    text: {
      default: 'text-gray-900 dark:text-gray-100',
      primary: info.text,
      success: success.text,
      warning: warning.text,
      danger: error.text,
    } as Record<string, string>,
  };
}

export const Code: React.FC<CodeProps> = ({
  children,
  size = 'md',
  variant = 'default',
  className,
}) => {
  // Size configurations
  const sizeClasses = {
    sm: `${designTokens.typography.size.xs} px-1 py-0.5`,
    md: `${designTokens.typography.size.sm} px-1.5 py-0.5`,
    lg: `${designTokens.typography.size.base} px-2 py-1`,
  };

  const codeColors = getCodeColors();
  const variantBgClasses = codeColors.bg;
  const variantTextClasses = codeColors.text;

  return (
    <View
      className={cn(
        'rounded',
        variantBgClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      <Text
        className={cn(
          designTokens.typography.family.mono,
          designTokens.typography.weight.medium,
          variantTextClasses[variant]
        )}
        style={{ fontFamily: 'monospace' }}
      >
        {children}
      </Text>
    </View>
  );
};
