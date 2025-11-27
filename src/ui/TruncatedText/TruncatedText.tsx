import * as React from 'react';
import { Text } from 'react-native';
import { cn } from '../../lib/utils';

export interface TruncatedTextProps {
  /** Text content to truncate */
  children: string;
  /** Maximum length before truncation */
  maxLength?: number;
  /** Position of truncation */
  position?: 'end' | 'middle' | 'start';
  /** Custom ellipsis character */
  ellipsis?: string;
  /** Additional className */
  className?: string;
}

/**
 * TruncatedText Component
 *
 * Intelligently truncates text with ellipsis at various positions.
 * Useful for displaying long text like addresses, IDs, or descriptions.
 *
 * @example
 * ```tsx
 * <TruncatedText maxLength={50}>
 *   This is a very long text that will be truncated...
 * </TruncatedText>
 * ```
 *
 * @example
 * ```tsx
 * <TruncatedText
 *   maxLength={20}
 *   position="middle"
 * >
 *   0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
 * </TruncatedText>
 * ```
 */
export const TruncatedText: React.FC<TruncatedTextProps> = ({
  children,
  maxLength = 50,
  position = 'end',
  ellipsis = '...',
  className,
}) => {
  const text = children || '';

  // No truncation needed
  if (text.length <= maxLength) {
    return <Text className={className}>{text}</Text>;
  }

  // Calculate truncated text based on position
  const getTruncatedText = (): string => {
    const ellipsisLength = ellipsis.length;
    const availableLength = maxLength - ellipsisLength;

    switch (position) {
      case 'start':
        return ellipsis + text.slice(text.length - availableLength);

      case 'middle': {
        const halfLength = Math.floor(availableLength / 2);
        const start = text.slice(0, halfLength);
        const end = text.slice(text.length - (availableLength - halfLength));
        return start + ellipsis + end;
      }

      case 'end':
      default:
        return text.slice(0, availableLength) + ellipsis;
    }
  };

  const truncatedText = getTruncatedText();

  return <Text className={cn(className)}>{truncatedText}</Text>;
};
