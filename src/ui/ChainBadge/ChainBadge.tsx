import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '../../lib/utils';
import { colors, designTokens } from '@sudobility/design';

export type ChainType = 'evm' | 'solana' | 'bitcoin' | 'cosmos';

/** Badge displaying a blockchain network identifier with chain-specific color and icon */
export interface ChainBadgeProps extends ViewProps {
  chainType: ChainType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

/**
 * Split combined DS badge color strings (which include both bg-* and text-*)
 * into separate bg and text class strings.
 */
function splitBadgeClasses(base: string, dark: string) {
  const all = `${base} ${dark}`.split(' ');
  return {
    bg: all.filter(c => c.includes('bg-')).join(' '),
    text: all.filter(c => c.includes('text-')).join(' '),
  };
}

// Lazily derive chain colors from DS to avoid ESM issues in tests.
let _chainColors: ReturnType<typeof buildChainColors> | null = null;
function getChainColors() {
  if (!_chainColors) _chainColors = buildChainColors();
  return _chainColors;
}
function buildChainColors() {
  const badge = colors.component.badge;
  return {
    evm: splitBadgeClasses(badge.ethereum.base, badge.ethereum.dark),
    solana: splitBadgeClasses(badge.solana.base, badge.solana.dark),
    bitcoin: splitBadgeClasses(badge.bitcoin.base, badge.bitcoin.dark),
    // DS has no cosmos badge — use local fallback (indigo)
    cosmos: {
      bg: 'bg-primary/10 dark:bg-primary/10',
      text: 'text-primary ',
    },
  };
}

const chainMeta: Record<ChainType, { label: string; emoji: string }> = {
  evm: { label: 'EVM', emoji: '⟠' },
  solana: { label: 'SOL', emoji: '◎' },
  bitcoin: { label: 'BTC', emoji: '₿' },
  cosmos: { label: 'ATOM', emoji: '⚛' },
};

const sizeConfig = {
  sm: {
    padding: 'px-1.5 py-0.5',
    text: designTokens.typography.size.xs,
    gap: 'gap-0.5',
  },
  md: {
    padding: 'px-2 py-1',
    text: designTokens.typography.size.sm,
    gap: 'gap-1',
  },
  lg: {
    padding: 'px-2.5 py-1.5',
    text: designTokens.typography.size.base,
    gap: 'gap-1.5',
  },
};

export const ChainBadge: React.FC<ChainBadgeProps> = ({
  chainType,
  size = 'md',
  showLabel = true,
  className,
  ...props
}) => {
  const chainColors = getChainColors()[chainType];
  const meta = chainMeta[chainType];
  const sizeStyles = sizeConfig[size];

  return (
    <View
      className={cn(
        'flex-row items-center rounded-md border',
        chainColors.bg,
        sizeStyles.padding,
        sizeStyles.gap,
        className
      )}
      accessibilityLabel={`${meta.label} chain`}
      {...props}
    >
      <Text className={cn(sizeStyles.text, chainColors.text)}>
        {meta.emoji}
      </Text>
      {showLabel && (
        <Text
          className={cn(
            designTokens.typography.weight.medium,
            sizeStyles.text,
            chainColors.text
          )}
        >
          {meta.label}
        </Text>
      )}
    </View>
  );
};
