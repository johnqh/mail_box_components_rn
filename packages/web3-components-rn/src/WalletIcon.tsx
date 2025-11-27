import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export type WalletProvider =
  | 'metamask'
  | 'walletconnect'
  | 'coinbase'
  | 'rainbow'
  | 'phantom'
  | 'trust'
  | 'generic';

export interface WalletIconProps extends ViewProps {
  provider: WalletProvider;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const walletConfig: Record<WalletProvider, { label: string; emoji: string; color: string }> = {
  metamask: { label: 'MetaMask', emoji: '🦊', color: 'bg-orange-100 dark:bg-orange-900/30' },
  walletconnect: { label: 'WalletConnect', emoji: '🔗', color: 'bg-blue-100 dark:bg-blue-900/30' },
  coinbase: { label: 'Coinbase', emoji: '🔵', color: 'bg-blue-100 dark:bg-blue-900/30' },
  rainbow: { label: 'Rainbow', emoji: '🌈', color: 'bg-purple-100 dark:bg-purple-900/30' },
  phantom: { label: 'Phantom', emoji: '👻', color: 'bg-purple-100 dark:bg-purple-900/30' },
  trust: { label: 'Trust Wallet', emoji: '🛡️', color: 'bg-blue-100 dark:bg-blue-900/30' },
  generic: { label: 'Wallet', emoji: '💳', color: 'bg-gray-100 dark:bg-gray-800' },
};

const sizeClasses = {
  sm: 'w-6 h-6',
  md: 'w-10 h-10',
  lg: 'w-14 h-14',
};

const textSizes = {
  sm: 'text-sm',
  md: 'text-lg',
  lg: 'text-2xl',
};

/**
 * Wallet icon component for displaying wallet provider icons
 */
export const WalletIcon: React.FC<WalletIconProps> = ({
  provider,
  size = 'md',
  showLabel = false,
  className,
  ...props
}) => {
  const config = walletConfig[provider] || walletConfig.generic;

  return (
    <View
      className={cn('flex-row items-center gap-2', className)}
      accessibilityLabel={config.label}
      {...props}
    >
      <View
        className={cn(
          'rounded-full items-center justify-center',
          sizeClasses[size],
          config.color
        )}
      >
        <Text className={textSizes[size]}>{config.emoji}</Text>
      </View>
      {showLabel && (
        <Text className="text-gray-900 dark:text-white font-medium">
          {config.label}
        </Text>
      )}
    </View>
  );
};
