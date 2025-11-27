import * as React from 'react';
import { useState, useCallback } from 'react';
import { View, Text, Pressable, Linking } from 'react-native';
import { cn } from '../../lib/utils';

export interface AddressLinkProps {
  /** The blockchain address to display */
  address: string;
  /** Chain ID for EVM chains (positive) or Solana chains (negative) */
  chainId?: number;
  /** Block explorer base URL (if not using chainId) */
  explorerUrl?: string;
  /** Label to display before the address */
  label?: string;
  /** Display format: 'short' (default), 'medium', or 'full' */
  format?: 'short' | 'medium' | 'full';
  /** Show copy button */
  showCopy?: boolean;
  /** Show explorer link button */
  showExplorer?: boolean;
  /** Custom copy handler - receives address string */
  onCopy?: (address: string) => Promise<void>;
  /** Custom className */
  className?: string;
}

/**
 * Get block explorer URL for an address
 */
const getExplorerUrl = (
  address: string,
  chainId?: number,
  explorerUrl?: string
): string | null => {
  if (explorerUrl) {
    return `${explorerUrl}/address/${address}`;
  }

  if (!chainId) {
    return null;
  }

  // Solana chains (negative chainIds)
  if (chainId < 0) {
    const cluster =
      chainId === -101
        ? ''
        : chainId === -102
          ? '?cluster=devnet'
          : '?cluster=testnet';
    return `https://explorer.solana.com/address/${address}${cluster}`;
  }

  // EVM chains
  const explorerMap: Record<number, string> = {
    1: 'https://etherscan.io',
    11155111: 'https://sepolia.etherscan.io',
    5: 'https://goerli.etherscan.io',
    137: 'https://polygonscan.com',
    80002: 'https://amoy.polygonscan.com',
    42161: 'https://arbiscan.io',
    421614: 'https://sepolia.arbiscan.io',
    10: 'https://optimistic.etherscan.io',
    11155420: 'https://sepolia-optimism.etherscan.io',
    8453: 'https://basescan.org',
    84532: 'https://sepolia.basescan.org',
  };

  const baseUrl = explorerMap[chainId];
  if (!baseUrl) {
    return null;
  }

  return `${baseUrl}/address/${address}`;
};

/**
 * Format address based on display format
 */
const formatAddress = (
  address: string,
  format: 'short' | 'medium' | 'full'
): string => {
  if (format === 'full') {
    return address;
  }

  if (format === 'medium') {
    return `${address.substring(0, 10)}...${address.substring(address.length - 8)}`;
  }

  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

/**
 * AddressLink Component
 *
 * Displays a blockchain address with copy and block explorer link functionality.
 * Supports both EVM chains and Solana chains.
 *
 * @example
 * ```tsx
 * <AddressLink
 *   address="0x1234...5678"
 *   chainId={1}
 *   showCopy
 *   showExplorer
 * />
 * ```
 */
export const AddressLink: React.FC<AddressLinkProps> = ({
  address,
  chainId,
  explorerUrl,
  label,
  format = 'short',
  showCopy = true,
  showExplorer = true,
  onCopy,
  className,
}) => {
  const [copied, setCopied] = useState(false);

  const formattedAddress = formatAddress(address, format);
  const explorerLink = getExplorerUrl(address, chainId, explorerUrl);

  const handleCopy = useCallback(async () => {
    if (!onCopy) return;
    try {
      await onCopy(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Copy failed
    }
  }, [address, onCopy]);

  const handleOpenExplorer = useCallback(() => {
    if (explorerLink) {
      Linking.openURL(explorerLink);
    }
  }, [explorerLink]);

  return (
    <View className={cn('flex-row items-center gap-2', className)}>
      {label && (
        <Text className='text-sm text-gray-600 dark:text-gray-400'>
          {label}:
        </Text>
      )}

      <Text
        className={cn(
          'font-mono text-sm text-gray-900 dark:text-white',
          format === 'full' && 'flex-1'
        )}
        numberOfLines={format === 'full' ? undefined : 1}
      >
        {formattedAddress}
      </Text>

      <View className='flex-row items-center gap-1'>
        {showCopy && onCopy && (
          <Pressable
            onPress={handleCopy}
            className='p-1 rounded active:bg-gray-100 dark:active:bg-gray-800'
            accessibilityRole='button'
            accessibilityLabel={copied ? 'Copied!' : 'Copy address'}
          >
            <Text className='text-sm text-gray-500 dark:text-gray-400'>
              {copied ? '✓' : '📋'}
            </Text>
          </Pressable>
        )}

        {showExplorer && explorerLink && (
          <Pressable
            onPress={handleOpenExplorer}
            className='p-1 rounded active:bg-gray-100 dark:active:bg-gray-800'
            accessibilityRole='link'
            accessibilityLabel='View on block explorer'
          >
            <Text className='text-sm text-blue-600 dark:text-blue-400'>↗</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};
