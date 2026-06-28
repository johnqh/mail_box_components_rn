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

const walletConfig: Record<
  WalletProvider,
  { label: string; emoji: string; color: string }
> = {
  metamask: {
    label: 'MetaMask',
    emoji: '🦊',
    color: 'bg-warning/10 ',
  },
  walletconnect: {
    label: 'WalletConnect',
    emoji: '🔗',
    color: 'bg-primary/10',
  },
  coinbase: {
    label: 'Coinbase',
    emoji: '🔵',
    color: 'bg-primary/10',
  },
  rainbow: {
    label: 'Rainbow',
    emoji: '🌈',
    color: 'bg-accent',
  },
  phantom: {
    label: 'Phantom',
    emoji: '👻',
    color: 'bg-accent',
  },
  trust: {
    label: 'Trust Wallet',
    emoji: '🛡️',
    color: 'bg-primary/10',
  },
  generic: {
    label: 'Wallet',
    emoji: '💳',
    color: 'bg-muted',
  },
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
        <Text className='text-foreground font-medium'>
          {config.label}
        </Text>
      )}
    </View>
  );
};
