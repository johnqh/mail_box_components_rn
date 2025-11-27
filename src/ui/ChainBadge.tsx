import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '../lib/utils';

export type ChainType = 'evm' | 'solana' | 'bitcoin' | 'cosmos';

export interface ChainBadgeProps extends ViewProps {
  chainType: ChainType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const chainConfig: Record<
  ChainType,
  { label: string; emoji: string; bgColor: string; textColor: string }
> = {
  evm: {
    label: 'EVM',
    emoji: '⟠',
    bgColor:
      'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
    textColor: 'text-blue-700 dark:text-blue-300',
  },
  solana: {
    label: 'SOL',
    emoji: '◎',
    bgColor:
      'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800',
    textColor: 'text-purple-700 dark:text-purple-300',
  },
  bitcoin: {
    label: 'BTC',
    emoji: '₿',
    bgColor:
      'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800',
    textColor: 'text-orange-700 dark:text-orange-300',
  },
  cosmos: {
    label: 'ATOM',
    emoji: '⚛',
    bgColor:
      'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800',
    textColor: 'text-indigo-700 dark:text-indigo-300',
  },
};

const sizeConfig = {
  sm: { padding: 'px-1.5 py-0.5', text: 'text-xs', gap: 'gap-0.5' },
  md: { padding: 'px-2 py-1', text: 'text-sm', gap: 'gap-1' },
  lg: { padding: 'px-2.5 py-1.5', text: 'text-base', gap: 'gap-1.5' },
};

export const ChainBadge: React.FC<ChainBadgeProps> = ({
  chainType,
  size = 'md',
  showLabel = true,
  className,
  ...props
}) => {
  const chain = chainConfig[chainType];
  const sizeStyles = sizeConfig[size];

  return (
    <View
      className={cn(
        'flex-row items-center rounded-md border',
        chain.bgColor,
        sizeStyles.padding,
        sizeStyles.gap,
        className
      )}
      accessibilityLabel={`${chain.label} chain`}
      {...props}
    >
      <Text className={cn(sizeStyles.text, chain.textColor)}>
        {chain.emoji}
      </Text>
      {showLabel && (
        <Text className={cn('font-medium', sizeStyles.text, chain.textColor)}>
          {chain.label}
        </Text>
      )}
    </View>
  );
};
