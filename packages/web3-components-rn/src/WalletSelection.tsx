import React from 'react';
import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Linking,
  type ViewProps,
} from 'react-native';
import { cn } from '@sudobility/components-rn';
import { WalletIcon, type WalletProvider } from './WalletIcon';

export interface WalletOption {
  id: string;
  name: string;
  icon?: string;
  available: boolean;
  connecting?: boolean;
  chainType: 'evm' | 'solana';
  connector?: unknown;
  onPress: () => void;
}

export interface WalletSelectionButtonProps extends ViewProps {
  wallet: WalletOption;
  disabled?: boolean;
  statusLabels?: {
    available: string;
    notAvailable: string;
  };
}

const getProviderFromName = (name: string): WalletProvider => {
  const lower = name.toLowerCase();
  if (lower.includes('metamask')) return 'metamask';
  if (lower.includes('walletconnect')) return 'walletconnect';
  if (lower.includes('coinbase')) return 'coinbase';
  if (lower.includes('rainbow')) return 'rainbow';
  if (lower.includes('phantom')) return 'phantom';
  if (lower.includes('trust')) return 'trust';
  return 'generic';
};

export const WalletSelectionButton: React.FC<WalletSelectionButtonProps> = ({
  wallet,
  disabled = false,
  className,
  statusLabels = { available: 'Available', notAvailable: 'Not Available' },
  ...props
}) => {
  const isDisabled = disabled || !wallet.available;

  return (
    <Pressable
      onPress={wallet.onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={`Connect ${wallet.name} wallet for ${wallet.chainType === 'solana' ? 'Solana' : 'Ethereum'} network`}
      accessibilityState={{ disabled: isDisabled }}
      className={cn(
        'w-full flex-row items-center justify-between p-4',
        'border border-gray-200 dark:border-gray-700 rounded-lg',
        'bg-white dark:bg-gray-900',
        'active:bg-gray-50 dark:active:bg-gray-700',
        isDisabled && 'opacity-50',
        className
      )}
      {...props}
    >
      <View className="flex-row items-center gap-3">
        <WalletIcon provider={getProviderFromName(wallet.name)} size="md" />
        <View>
          <Text className="font-medium text-gray-900 dark:text-white">
            {wallet.name}
          </Text>
          <Text
            className={cn(
              'text-xs',
              wallet.available
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
            )}
          >
            {wallet.available
              ? statusLabels.available
              : statusLabels.notAvailable}
          </Text>
        </View>
      </View>

      {wallet.connecting && (
        <ActivityIndicator
          size="small"
          color={wallet.chainType === 'solana' ? '#9333ea' : '#2563eb'}
        />
      )}
    </Pressable>
  );
};

export interface WalletTabProps {
  active: boolean;
  onPress: () => void;
  icon: string;
  label: string;
  color: 'blue' | 'purple';
}

export const WalletTab: React.FC<WalletTabProps> = ({
  active,
  onPress,
  icon,
  label,
  color,
}) => {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      className={cn(
        'flex-1 py-2 px-4 rounded-md',
        active
          ? color === 'blue'
            ? 'bg-white dark:bg-gray-800'
            : 'bg-white dark:bg-gray-800'
          : 'bg-transparent'
      )}
    >
      <View className="flex-row items-center justify-center gap-2">
        <Text
          className={cn(
            'text-base',
            active
              ? color === 'blue'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-purple-600 dark:text-purple-400'
              : 'text-gray-600 dark:text-gray-400'
          )}
        >
          {icon}
        </Text>
        <Text
          className={cn(
            'font-medium',
            active
              ? color === 'blue'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-purple-600 dark:text-purple-400'
              : 'text-gray-600 dark:text-gray-400'
          )}
        >
          {label}
        </Text>
      </View>
    </Pressable>
  );
};

export interface WalletSelectionGridProps extends ViewProps {
  evmWallets: WalletOption[];
  solanaWallets: WalletOption[];
  activeTab: 'ethereum' | 'solana';
  onTabChange: (tab: 'ethereum' | 'solana') => void;
  connectingWallet?: string | null;
  labels?: {
    ethereum?: string;
    solana?: string;
    available?: string;
    notAvailable?: string;
    noWalletText?: string;
    installMetaMask?: string;
    installPhantom?: string;
  };
}

export const WalletSelectionGrid: React.FC<WalletSelectionGridProps> = ({
  evmWallets,
  solanaWallets,
  activeTab,
  onTabChange,
  connectingWallet,
  className,
  labels = {},
  ...props
}) => {
  const defaultLabels = {
    ethereum: 'Ethereum',
    solana: 'Solana',
    available: 'Available',
    notAvailable: 'Not Available',
    noWalletText: "Don't have a wallet?",
    installMetaMask: 'Install MetaMask',
    installPhantom: 'Install Phantom',
  };

  const finalLabels = { ...defaultLabels, ...labels };
  const currentWallets = activeTab === 'ethereum' ? evmWallets : solanaWallets;

  const handleInstallPress = () => {
    const url =
      activeTab === 'ethereum'
        ? 'https://metamask.io/download/'
        : 'https://phantom.app/download';
    Linking.openURL(url);
  };

  return (
    <View className={cn('gap-6', className)} {...props}>
      {/* Tab Navigation */}
      <View className="flex-row gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-lg">
        <WalletTab
          active={activeTab === 'ethereum'}
          onPress={() => onTabChange('ethereum')}
          icon="⟠"
          label={finalLabels.ethereum}
          color="blue"
        />
        <WalletTab
          active={activeTab === 'solana'}
          onPress={() => onTabChange('solana')}
          icon="◎"
          label={finalLabels.solana}
          color="purple"
        />
      </View>

      {/* Wallet List */}
      <View className="gap-3">
        {currentWallets.map((wallet) => (
          <WalletSelectionButton
            key={wallet.id}
            wallet={{
              ...wallet,
              connecting: connectingWallet === wallet.name,
            }}
            disabled={!!connectingWallet}
            statusLabels={{
              available: finalLabels.available,
              notAvailable: finalLabels.notAvailable,
            }}
          />
        ))}
      </View>

      {/* Help Text */}
      <View className="items-center pt-2">
        <Text className="text-sm text-gray-600 dark:text-gray-400">
          {finalLabels.noWalletText}{' '}
        </Text>
        <Pressable onPress={handleInstallPress} accessibilityRole="link">
          <Text
            className={cn(
              'text-sm font-medium',
              activeTab === 'ethereum'
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-purple-600 dark:text-purple-400'
            )}
          >
            {activeTab === 'ethereum'
              ? finalLabels.installMetaMask
              : finalLabels.installPhantom}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};
