import * as React from 'react';
import { Text } from 'react-native';
import { cn } from '../../lib/utils';

export interface FormattedNumberProps {
  /** Number value to format */
  value: number;
  /** Number style */
  style?: 'decimal' | 'currency' | 'percent';
  /** Currency code (for currency style) */
  currency?: string;
  /** Minimum fraction digits */
  minimumFractionDigits?: number;
  /** Maximum fraction digits */
  maximumFractionDigits?: number;
  /** Locale */
  locale?: string;
  /** Notation (compact for abbreviations like 1.2K) */
  notation?: 'standard' | 'compact';
  /** Additional className */
  className?: string;
}

/**
 * FormattedNumber Component
 *
 * Formats numbers using Intl.NumberFormat with various styles and locales.
 * Supports currencies, percentages, and compact notation.
 *
 * @example
 * ```tsx
 * <FormattedNumber value={1234.56} />
 * <FormattedNumber value={1234.56} notation="compact" />
 * <FormattedNumber
 *   value={1234.56}
 *   style="currency"
 *   currency="USD"
 * />
 * ```
 *
 * @example
 * ```tsx
 * <FormattedNumber
 *   value={0.1234}
 *   style="percent"
 *   minimumFractionDigits={2}
 * />
 * ```
 */
export const FormattedNumber: React.FC<FormattedNumberProps> = ({
  value,
  style = 'decimal',
  currency = 'USD',
  minimumFractionDigits,
  maximumFractionDigits,
  locale = 'en-US',
  notation = 'standard',
  className,
}) => {
  const formatNumber = (): string => {
    try {
      const options: Intl.NumberFormatOptions = {
        style,
        notation,
        minimumFractionDigits,
        maximumFractionDigits,
      };

      if (style === 'currency') {
        options.currency = currency;
      }

      return new Intl.NumberFormat(locale, options).format(value);
    } catch (error) {
      // Fallback to basic formatting if Intl fails
      console.error('Number formatting error:', error);
      return value.toLocaleString(locale);
    }
  };

  return <Text className={cn(className)}>{formatNumber()}</Text>;
};
