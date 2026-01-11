import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { cn } from '@sudobility/components-rn';
import type { TierComparisonTableProps, TierDisplayData } from './types';

/**
 * Format large numbers with K/M suffixes
 */
function formatLimit(value: number): string {
  if (value >= 1000000) {
    const formatted = value / 1000000;
    return value % 1000000 === 0 ? formatted.toFixed(0) + 'M' : formatted.toFixed(1) + 'M';
  } else if (value >= 1000) {
    const formatted = value / 1000;
    return value % 1000 === 0 ? formatted.toFixed(0) + 'K' : formatted.toFixed(1) + 'K';
  }
  return value.toLocaleString();
}

/**
 * Single tier card component
 */
interface TierCardProps {
  tier: TierDisplayData;
  onSelect?: () => void;
  highlightCurrent?: boolean;
  showPrice?: boolean;
}

function TierCard({ tier, onSelect, highlightCurrent = true, showPrice = true }: TierCardProps) {
  const { name, hourlyLimit, dailyLimit, monthlyLimit, price, isCurrent, isRecommended, description, features } = tier;

  const cardClasses = cn(
    'rounded-xl p-4 border-2',
    isCurrent && highlightCurrent
      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
      : isRecommended
      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
  );

  const content = (
    <View className={cardClasses}>
      {/* Header */}
      <View className="flex-row justify-between items-start mb-3">
        <View>
          <Text className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {name}
          </Text>
          {(isCurrent || isRecommended) && (
            <View
              className={cn(
                'mt-1 px-2 py-0.5 rounded-full self-start',
                isCurrent ? 'bg-blue-500' : 'bg-green-500'
              )}
            >
              <Text className="text-xs font-medium text-white">
                {isCurrent ? 'Current' : 'Recommended'}
              </Text>
            </View>
          )}
        </View>
        {showPrice && price && (
          <Text className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {price}
          </Text>
        )}
      </View>

      {/* Description */}
      {description && (
        <Text className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          {description}
        </Text>
      )}

      {/* Limits */}
      <View className="space-y-2">
        <View className="flex-row justify-between py-2 border-b border-gray-100 dark:border-gray-700">
          <Text className="text-sm text-gray-600 dark:text-gray-400">Hourly</Text>
          <Text className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {formatLimit(hourlyLimit)}
          </Text>
        </View>
        <View className="flex-row justify-between py-2 border-b border-gray-100 dark:border-gray-700">
          <Text className="text-sm text-gray-600 dark:text-gray-400">Daily</Text>
          <Text className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {formatLimit(dailyLimit)}
          </Text>
        </View>
        <View className="flex-row justify-between py-2">
          <Text className="text-sm text-gray-600 dark:text-gray-400">Monthly</Text>
          <Text className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {formatLimit(monthlyLimit)}
          </Text>
        </View>
      </View>

      {/* Features */}
      {features && features.length > 0 && (
        <View className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          {features.map((feature, index) => (
            <View key={index} className="flex-row items-center mb-2">
              <Text className="text-green-500 mr-2">✓</Text>
              <Text className="text-sm text-gray-700 dark:text-gray-300">
                {feature}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Select button */}
      {onSelect && !isCurrent && (
        <View className="mt-4">
          <View
            className={cn(
              'py-2.5 rounded-lg items-center',
              isRecommended ? 'bg-green-500' : 'bg-blue-500'
            )}
          >
            <Text className="text-sm font-semibold text-white">
              {isRecommended ? 'Upgrade Now' : 'Select Plan'}
            </Text>
          </View>
        </View>
      )}
    </View>
  );

  if (onSelect && !isCurrent) {
    return (
      <Pressable
        onPress={onSelect}
        className="active:opacity-90 mb-4"
        accessibilityRole="button"
        accessibilityLabel={'Select ' + name + ' plan'}
      >
        {content}
      </Pressable>
    );
  }

  return <View className="mb-4">{content}</View>;
}

/**
 * TierComparisonTable component displays a comparison of different tier limits
 */
export function TierComparisonTable({
  tiers,
  title,
  onTierSelect,
  highlightCurrent = true,
  showPrice = true,
  className,
}: TierComparisonTableProps) {
  return (
    <View
      className={cn('', className)}
      accessibilityRole="none"
      accessibilityLabel={title || 'Tier Comparison'}
    >
      {/* Header */}
      {title && (
        <Text className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {title}
        </Text>
      )}

      {/* Tier cards */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {tiers.map((tier, index) => (
          <TierCard
            key={tier.name + '-' + index}
            tier={tier}
            onSelect={onTierSelect ? () => onTierSelect(tier) : undefined}
            highlightCurrent={highlightCurrent}
            showPrice={showPrice}
          />
        ))}
      </ScrollView>

      {/* Empty state */}
      {tiers.length === 0 && (
        <View className="py-8 items-center bg-gray-50 dark:bg-gray-800 rounded-xl">
          <Text className="text-gray-500 dark:text-gray-400">
            No tiers available
          </Text>
        </View>
      )}
    </View>
  );
}

export default TierComparisonTable;
