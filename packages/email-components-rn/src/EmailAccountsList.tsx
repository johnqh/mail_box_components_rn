import React from 'react';
import { View, Text, Pressable, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';
import { ChainBadge } from '@sudobility/components-rn';

export interface EmailAccount {
  address: string;
  name: string;
  type: 'primary' | 'ens' | 'sns';
  walletAddress: string;
  addressType: 'evm' | 'solana';
}

export interface WalletEmailGroup {
  walletAddress: string;
  addressType: 'evm' | 'solana';
  primaryEmail: EmailAccount;
  domainEmails: EmailAccount[];
  customColor?: string;
}

export interface EmailAccountsListProps extends ViewProps {
  walletGroups: WalletEmailGroup[];
  selectedAccount?: string;
  expandedWallets: string[];
  onAccountSelect: (address: string) => void;
  onToggleWallet: (walletAddress: string) => void;
  onAccountSettings?: (address: string) => void;
}

const formatWalletAddress = (address: string): string => {
  if (!address) return '';
  if (address.length <= 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

interface ChainPillProps {
  type: 'primary' | 'ens' | 'sns';
  addressType: 'evm' | 'solana';
}

const ChainPill: React.FC<ChainPillProps> = ({ type, addressType }) => {
  if (type === 'primary') {
    return (
      <ChainBadge
        chainType={addressType === 'solana' ? 'solana' : 'evm'}
        size="sm"
      />
    );
  }

  const getChainLabel = () => type.toUpperCase();

  const getChainStyle = () => {
    switch (type) {
      case 'ens':
        return 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800';
      case 'sns':
        return 'bg-orange-50 dark:bg-orange-900/10 border-orange-200 dark:border-orange-800';
      default:
        return 'bg-gray-50 dark:bg-gray-900/10 border-gray-200 dark:border-gray-800';
    }
  };

  const getTextStyle = () => {
    switch (type) {
      case 'ens':
        return 'text-green-700 dark:text-green-300';
      case 'sns':
        return 'text-orange-700 dark:text-orange-300';
      default:
        return 'text-gray-700 dark:text-gray-300';
    }
  };

  return (
    <View className={cn('px-2.5 py-0.5 rounded-md border', getChainStyle())}>
      <Text className={cn('text-xs font-medium', getTextStyle())}>
        {getChainLabel()}
      </Text>
    </View>
  );
};

interface CollapsibleDomainEmailsProps {
  domainEmails: EmailAccount[];
  isExpanded: boolean;
  selectedAccount?: string;
  onAccountSelect: (address: string) => void;
}

const CollapsibleDomainEmails: React.FC<CollapsibleDomainEmailsProps> = ({
  domainEmails,
  isExpanded,
  selectedAccount,
  onAccountSelect,
}) => {
  if (!isExpanded) return null;

  return (
    <View className="ml-6 mt-2 gap-1">
      {domainEmails.map((email) => (
        <Pressable
          key={email.address}
          onPress={() => onAccountSelect(email.address)}
          accessibilityRole="button"
          className={cn(
            'w-full flex-row items-center justify-between px-3 py-2 rounded-lg',
            selectedAccount === email.address
              ? 'bg-blue-100 dark:bg-blue-900/30'
              : 'active:bg-gray-100 dark:active:bg-gray-700'
          )}
        >
          <Text
            className={cn(
              'flex-1 text-sm',
              selectedAccount === email.address
                ? 'text-blue-700 dark:text-blue-300'
                : 'text-gray-900 dark:text-white'
            )}
            numberOfLines={1}
          >
            {email.name}
          </Text>
          <ChainPill type={email.type} addressType={email.addressType} />
        </Pressable>
      ))}
    </View>
  );
};

/**
 * EmailAccountsList component for React Native
 * Displays a list of email accounts grouped by wallet
 */
export const EmailAccountsList: React.FC<EmailAccountsListProps> = ({
  walletGroups,
  selectedAccount,
  expandedWallets,
  onAccountSelect,
  onToggleWallet,
  onAccountSettings,
  className,
  ...props
}) => {
  return (
    <View className={cn('gap-1', className)} {...props}>
      {walletGroups.map((group) => (
        <View key={group.walletAddress}>
          <Pressable
            onPress={() => onAccountSelect(group.primaryEmail.address)}
            accessibilityRole="button"
            className={cn(
              'w-full flex-row items-center justify-between px-3 py-2 rounded-lg',
              selectedAccount === group.primaryEmail.address &&
                group.domainEmails.length === 0
                ? 'bg-blue-100 dark:bg-blue-900/30'
                : 'active:bg-gray-100 dark:active:bg-gray-700'
            )}
          >
            <View className="flex-row items-center flex-1 min-w-0 gap-2">
              <Text
                className={cn(
                  'flex-1 text-sm',
                  selectedAccount === group.primaryEmail.address
                    ? 'text-blue-700 dark:text-blue-300'
                    : 'text-gray-900 dark:text-white'
                )}
                numberOfLines={1}
              >
                {formatWalletAddress(group.walletAddress)}
              </Text>
              <ChainPill
                type={group.primaryEmail.type}
                addressType={group.addressType}
              />
            </View>
            {group.domainEmails.length > 0 && (
              <Pressable
                onPress={() => onToggleWallet(group.walletAddress)}
                accessibilityRole="button"
                className="p-1 rounded-lg active:bg-gray-200 dark:active:bg-gray-600"
              >
                <Text
                  className={cn(
                    'text-gray-500',
                    expandedWallets.includes(group.walletAddress) &&
                      'rotate-90'
                  )}
                >
                  ›
                </Text>
              </Pressable>
            )}
          </Pressable>

          {group.domainEmails.length > 0 && (
            <CollapsibleDomainEmails
              domainEmails={group.domainEmails}
              isExpanded={expandedWallets.includes(group.walletAddress)}
              selectedAccount={selectedAccount}
              onAccountSelect={onAccountSelect}
            />
          )}
        </View>
      ))}
    </View>
  );
};
