import React from 'react';
import { View, Text, Pressable } from 'react-native';
import type { SubscriptionProduct, BadgeConfig, DiscountBadgeConfig } from './types';

/**
 * Props for SubscriptionTile component
 */
export interface SubscriptionTileProps {
  /** Subscription product data */
  product: SubscriptionProduct;
  /** Whether this tile is currently selected */
  isSelected?: boolean;
  /** Called when tile is pressed */
  onSelect?: (productId: string) => void;
  /** Badge configuration */
  badge?: BadgeConfig;
  /** Discount badge configuration */
  discountBadge?: DiscountBadgeConfig;
  /** Show trial info if available */
  showTrialInfo?: boolean;
  /** Custom styles */
  className?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Accessibility label override */
  accessibilityLabel?: string;
}

/**
 * Badge variant styles mapping
 */
const badgeVariants = {
  default: 'bg-neutral-200 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200',
  primary: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
  success: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
  warning: 'bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200',
  premium: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
};

/**
 * Individual subscription plan tile component
 * Displays plan details, pricing, features, and selection state
 */
export function SubscriptionTile({
  product,
  isSelected = false,
  onSelect,
  badge,
  discountBadge,
  showTrialInfo = true,
  className = '',
  disabled = false,
  accessibilityLabel,
}: SubscriptionTileProps) {
  const handlePress = () => {
    if (!disabled && onSelect) {
      onSelect(product.id);
    }
  };

  const defaultAccessibilityLabel = [
    product.title,
    'subscription',
    product.priceString,
    product.isRecommended ? 'recommended' : '',
    isSelected ? 'selected' : '',
  ].filter(Boolean).join(', ');

  const containerClasses = [
    'relative rounded-2xl p-4 border-2 transition-all',
    isSelected
      ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-950'
      : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900',
    disabled ? 'opacity-50' : '',
    product.isRecommended ? 'shadow-lg' : '',
    className,
  ].filter(Boolean).join(' ');

  const titleClasses = [
    'text-lg font-semibold',
    isSelected
      ? 'text-blue-900 dark:text-blue-100'
      : 'text-neutral-900 dark:text-neutral-100',
  ].join(' ');

  const priceClasses = [
    'text-2xl font-bold',
    isSelected
      ? 'text-blue-900 dark:text-blue-100'
      : 'text-neutral-900 dark:text-neutral-100',
  ].join(' ');

  const selectionIndicatorClasses = [
    'w-6 h-6 rounded-full border-2 items-center justify-center',
    isSelected
      ? 'border-blue-500 dark:border-blue-400 bg-blue-500 dark:bg-blue-400'
      : 'border-neutral-300 dark:border-neutral-600',
  ].join(' ');

  const discountBadgePositionClass = discountBadge?.position === 'top-left' ? 'left-4' : 'right-4';

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected, disabled }}
      accessibilityLabel={accessibilityLabel ?? defaultAccessibilityLabel}
      className={containerClasses}
    >
      {/* Discount Badge - Positioned absolutely */}
      {discountBadge && (
        <View
          className={[
            'absolute -top-3 px-3 py-1 rounded-full bg-green-500 dark:bg-green-600',
            discountBadgePositionClass,
          ].join(' ')}
        >
          <Text className="text-xs font-bold text-white">
            {discountBadge.customText ?? ('Save ' + discountBadge.percentage + '%')}
          </Text>
        </View>
      )}

      {/* Header Row */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2">
          <Text className={titleClasses}>
            {product.title}
          </Text>

          {/* Badge */}
          {badge && (
            <View className={'px-2 py-0.5 rounded-full ' + badgeVariants[badge.variant]}>
              <Text className="text-xs font-medium">{badge.text}</Text>
            </View>
          )}

          {/* Recommended Badge */}
          {product.isRecommended && !badge && (
            <View className="px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900">
              <Text className="text-xs font-medium text-purple-800 dark:text-purple-200">
                Popular
              </Text>
            </View>
          )}

          {/* Current Badge */}
          {product.isCurrent && (
            <View className="px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900">
              <Text className="text-xs font-medium text-green-800 dark:text-green-200">
                Current
              </Text>
            </View>
          )}
        </View>

        {/* Selection Indicator */}
        <View className={selectionIndicatorClasses}>
          {isSelected && (
            <View className="w-2.5 h-2.5 rounded-full bg-white" />
          )}
        </View>
      </View>

      {/* Description */}
      {product.description && (
        <Text className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
          {product.description}
        </Text>
      )}

      {/* Pricing */}
      <View className="flex-row items-baseline gap-2 mb-3">
        <Text className={priceClasses}>
          {product.priceString}
        </Text>

        {/* Original Price (strikethrough) */}
        {product.originalPriceString && (
          <Text className="text-base text-neutral-400 dark:text-neutral-500 line-through">
            {product.originalPriceString}
          </Text>
        )}

        {/* Savings */}
        {product.savingsPercentage && product.savingsPercentage > 0 && (
          <View className="px-2 py-0.5 rounded bg-green-100 dark:bg-green-900">
            <Text className="text-xs font-semibold text-green-700 dark:text-green-300">
              Save {product.savingsPercentage}%
            </Text>
          </View>
        )}
      </View>

      {/* Trial Info */}
      {showTrialInfo && product.trialPeriod && (
        <View className="bg-amber-50 dark:bg-amber-950 rounded-lg p-2 mb-3">
          <Text className="text-sm text-amber-800 dark:text-amber-200">
            {product.trialPeriod.days}-day free trial, then {product.trialPeriod.priceString}
          </Text>
        </View>
      )}

      {/* Features List */}
      {product.features.length > 0 && (
        <View className="gap-2">
          {product.features.map((feature, index) => (
            <View key={index} className="flex-row items-start gap-2">
              <Text className="text-green-500 dark:text-green-400 text-sm">✓</Text>
              <Text className="text-sm text-neutral-700 dark:text-neutral-300 flex-1">
                {feature}
              </Text>
            </View>
          ))}
        </View>
      )}
    </Pressable>
  );
}

export default SubscriptionTile;
