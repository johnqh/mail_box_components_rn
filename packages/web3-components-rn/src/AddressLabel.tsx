import React from 'react';
import { View, Text, Pressable, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface AddressLabelProps extends ViewProps {
  address: string;
  truncate?: boolean;
  truncateLength?: number;
  showCopy?: boolean;
  onCopy?: (address: string) => void;
  variant?: 'default' | 'badge' | 'link';
}

/**
 * Formats an Ethereum address for display
 */
const formatAddress = (address: string, length: number = 4): string => {
  if (address.length <= length * 2 + 2) return address;
  return `${address.slice(0, length + 2)}...${address.slice(-length)}`;
};

/**
 * Address label component for displaying Ethereum addresses
 */
export const AddressLabel: React.FC<AddressLabelProps> = ({
  address,
  truncate = true,
  truncateLength = 4,
  showCopy = true,
  onCopy,
  variant = 'default',
  className,
  ...props
}) => {
  const displayAddress = truncate
    ? formatAddress(address, truncateLength)
    : address;

  const handleCopy = () => {
    onCopy?.(address);
  };

  const variantStyles = {
    default: 'text-gray-900 dark:text-gray-100',
    badge: 'bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-md',
    link: 'text-blue-600 dark:text-blue-400 underline',
  };

  const content = (
    <Text
      className={cn(
        'font-mono text-sm',
        variantStyles[variant],
        className
      )}
      selectable
    >
      {displayAddress}
    </Text>
  );

  if (showCopy && onCopy) {
    return (
      <Pressable
        onPress={handleCopy}
        className="flex-row items-center gap-1"
        accessibilityRole="button"
        accessibilityLabel={`Copy address ${displayAddress}`}
        {...props}
      >
        {content}
        <Text className="text-gray-400">📋</Text>
      </Pressable>
    );
  }

  return (
    <View className="flex-row items-center" {...props}>
      {content}
    </View>
  );
};
