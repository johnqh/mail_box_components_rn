import { View, Text, Pressable, ScrollView } from 'react-native';
import { cn } from '@sudobility/components-rn';
import type { TierComparisonTableProps, TierDisplayData } from './types';

/**
 * Format large numbers with K/M suffixes
 */
function formatLimit(value: number): string {
  if (value >= 1000000) {
    const formatted = value / 1000000;
    return value % 1000000 === 0
      ? formatted.toFixed(0) + 'M'
      : formatted.toFixed(1) + 'M';
  } else if (value >= 1000) {
    const formatted = value / 1000;
    return value % 1000 === 0
      ? formatted.toFixed(0) + 'K'
      : formatted.toFixed(1) + 'K';
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

function TierCard({
  tier,
  onSelect,
  highlightCurrent = true,
  showPrice = true,
}: TierCardProps) {
  const {
    name,
    hourlyLimit,
    dailyLimit,
    monthlyLimit,
    price,
    isCurrent,
    isRecommended,
    description,
    features,
  } = tier;

  const cardClasses = cn(
    'rounded-xl p-4 border-2',
    isCurrent && highlightCurrent
      ? 'border-primary bg-primary/10'
      : isRecommended
        ? 'border-success bg-success/10'
        : 'border-border bg-card'
  );

  const content = (
    <View className={cardClasses}>
      {/* Header */}
      <View className='flex-row justify-between items-start mb-3'>
        <View>
          <Text className='text-lg font-bold text-foreground'>{name}</Text>
          {(isCurrent || isRecommended) && (
            <View
              className={cn(
                'mt-1 px-2 py-0.5 rounded-full self-start',
                isCurrent ? 'bg-primary' : 'bg-success'
              )}
            >
              <Text className='text-xs font-medium text-white'>
                {isCurrent ? 'Current' : 'Recommended'}
              </Text>
            </View>
          )}
        </View>
        {showPrice && price && (
          <Text className='text-xl font-bold text-foreground'>{price}</Text>
        )}
      </View>

      {/* Description */}
      {description && (
        <Text className='text-sm text-muted-foreground mb-3'>
          {description}
        </Text>
      )}

      {/* Limits */}
      <View className='space-y-2'>
        <View className='flex-row justify-between py-2 border-b border-border'>
          <Text className='text-sm text-muted-foreground'>Hourly</Text>
          <Text className='text-sm font-semibold text-foreground'>
            {formatLimit(hourlyLimit)}
          </Text>
        </View>
        <View className='flex-row justify-between py-2 border-b border-border'>
          <Text className='text-sm text-muted-foreground'>Daily</Text>
          <Text className='text-sm font-semibold text-foreground'>
            {formatLimit(dailyLimit)}
          </Text>
        </View>
        <View className='flex-row justify-between py-2'>
          <Text className='text-sm text-muted-foreground'>Monthly</Text>
          <Text className='text-sm font-semibold text-foreground'>
            {formatLimit(monthlyLimit)}
          </Text>
        </View>
      </View>

      {/* Features */}
      {features && features.length > 0 && (
        <View className='mt-4 pt-3 border-t border-border'>
          {features.map((feature, index) => (
            <View key={index} className='flex-row items-center mb-2'>
              <Text className='text-success mr-2'>✓</Text>
              <Text className='text-sm text-muted-foreground'>{feature}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Select button */}
      {onSelect && !isCurrent && (
        <View className='mt-4'>
          <View
            className={cn(
              'py-2.5 rounded-lg items-center',
              isRecommended ? 'bg-success' : 'bg-primary'
            )}
          >
            <Text className='text-sm font-semibold text-white'>
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
        className='active:opacity-90 mb-4'
        accessibilityRole='button'
        accessibilityLabel={'Select ' + name + ' plan'}
      >
        {content}
      </Pressable>
    );
  }

  return <View className='mb-4'>{content}</View>;
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
      accessibilityRole='none'
      accessibilityLabel={title || 'Tier Comparison'}
    >
      {/* Header */}
      {title && (
        <Text className='text-xl font-bold text-foreground mb-4'>{title}</Text>
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
        <View className='py-8 items-center bg-card rounded-xl'>
          <Text className='text-muted-foreground'>No tiers available</Text>
        </View>
      )}
    </View>
  );
}

export default TierComparisonTable;
