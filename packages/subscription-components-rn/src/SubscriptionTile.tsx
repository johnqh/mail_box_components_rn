import type { ReactNode } from 'react';
import { View, Text, Pressable } from 'react-native';
import { cn } from '@sudobility/components-rn';
import type {
  BadgeConfig,
  CtaButtonConfig,
  DiscountBadgeConfig,
  PremiumCalloutConfig,
  SubscriptionTileTrackingData,
} from './types';

export interface SubscriptionTileProps {
  /** Unique identifier for the subscription */
  id: string;
  /** Plan title */
  title: string;
  /** Formatted price string (e.g., "$9.99") */
  price: string;
  /** Period label (e.g., "/month", "/year") - passed by consumer for localization */
  periodLabel?: string;
  /** List of features/benefits */
  features: string[];
  /** Whether this tile is currently selected */
  isSelected: boolean;
  /** Selection callback */
  onSelect: () => void;
  /** Whether this is the user's current plan (shows persistent blue border) */
  isCurrentPlan?: boolean;

  /** Optional top badge (e.g., "Most Popular", "Free Trial") */
  topBadge?: BadgeConfig;
  /** Optional discount badge (e.g., "Save 40%") */
  discountBadge?: DiscountBadgeConfig;
  /** Optional premium callout section */
  premiumCallout?: PremiumCalloutConfig;
  /** Optional bottom note (e.g., new expiration date) */
  bottomNote?: string;
  /** Optional intro price note */
  introPriceNote?: string;

  /** Whether this is the best value option (affects styling) */
  isBestValue?: boolean;
  /** CTA button configuration - when provided, renders a button instead of radio indicator */
  ctaButton?: CtaButtonConfig;
  /** Additional NativeWind classes */
  className?: string;
  /** Custom content to render in the content area */
  children?: ReactNode;
  /** Disabled state (prevents interaction but keeps normal appearance) */
  disabled?: boolean;
  /** Whether this tile is enabled/selectable (false = grayed out, no indicator) */
  enabled?: boolean;

  /** Accessibility label */
  accessibilityLabel?: string;

  /** Optional tracking callback */
  onTrack?: (data: SubscriptionTileTrackingData) => void;
  /** Optional tracking label */
  trackingLabel?: string;
  /** Optional component name for tracking */
  componentName?: string;
  /** Hide both radio button and CTA button (for free tier tiles) */
  hideSelectionIndicator?: boolean;
}

const BADGE_COLORS: Record<BadgeConfig['color'], string> = {
  purple: 'bg-accent',
  green: 'bg-success',
  blue: 'bg-primary',
  yellow: 'bg-warning',
  red: 'bg-destructive',
};

/**
 * SubscriptionTile - A reusable subscription plan display component
 *
 * Displays a subscription plan with pricing, features, badges, and selection state.
 * All text is passed by the consumer for full localization control.
 *
 * Layout: Uses flexbox with content area (flex-1) and a fixed-height bottom area
 * for button/radio. This ensures no overlap between content and bottom elements.
 */
export function SubscriptionTile({
  id: _id,
  title,
  price,
  periodLabel,
  features,
  isSelected,
  onSelect,
  isCurrentPlan = false,
  topBadge,
  discountBadge,
  premiumCallout,
  bottomNote,
  introPriceNote,
  isBestValue: _isBestValue = false,
  ctaButton,
  className = '',
  children,
  disabled = false,
  enabled = true,
  accessibilityLabel,
  onTrack,
  trackingLabel,
  componentName = 'SubscriptionTile',
  hideSelectionIndicator = false,
}: SubscriptionTileProps) {
  // When ctaButton is provided, tile is not selectable (CTA mode)
  const isCtaMode = !!ctaButton;
  // Whether to show any bottom indicator (radio or CTA)
  // Hide indicator when: hideSelectionIndicator, isCurrentPlan (user's current plan), or not enabled
  const showIndicator = !hideSelectionIndicator && !isCurrentPlan && enabled;
  // Whether the tile is interactive (can be pressed/selected)
  const isInteractive = enabled && !isCurrentPlan && !disabled;

  // Styling logic:
  // - Selected: Blue background with blue border
  // - Current plan (not selected): Blue border to indicate current subscription
  // - Not enabled: Grayed out with opacity-50
  // - Default: Gray background
  const containerClasses = cn(
    'relative rounded-2xl p-6',
    isSelected
      ? 'bg-primary border-2 border-primary'
      : isCurrentPlan
        ? 'bg-muted border-2 border-primary dark:border-primary'
        : !enabled
          ? 'bg-muted border-2 border-border opacity-50'
          : 'bg-muted border-2 border-border',
    className
  );

  const handlePress = () => {
    if (isInteractive && !isCtaMode) {
      onTrack?.({ action: 'select', trackingLabel, componentName });
      onSelect();
    }
  };

  const handleCtaPress = () => {
    onTrack?.({ action: 'cta_click', trackingLabel, componentName });
    ctaButton?.onPress?.();
  };

  const defaultLabel = `${title} - ${price}${periodLabel || ''}`;

  return (
    <Pressable
      onPress={handlePress}
      disabled={!isInteractive || isCtaMode}
      accessibilityRole={isCtaMode ? 'summary' : 'radio'}
      accessibilityState={{
        checked: isCtaMode ? undefined : isSelected,
        disabled: !isInteractive,
      }}
      accessibilityLabel={accessibilityLabel || defaultLabel}
      className={containerClasses}
    >
      {/* Top Badge - vertically centered on the top border */}
      {topBadge && (
        <View className='absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10'>
          <View
            className={cn(
              BADGE_COLORS[topBadge.color],
              'px-4 py-1.5 rounded-full'
            )}
          >
            <Text className='text-white text-sm font-semibold'>
              {topBadge.text}
            </Text>
          </View>
        </View>
      )}

      {/* Main content - flex-1 takes available space above the fixed bottom area */}
      <View className='flex-1'>
        {/* Title and Price - add top margin when there's a topBadge */}
        <View
          className={cn('items-center mb-6', topBadge && 'mt-2')}
        >
          <Text
            className={cn(
              'text-xl font-bold mb-2',
              isSelected ? 'text-white' : 'text-foreground'
            )}
          >
            {title}
          </Text>
          <View className='flex-row items-baseline mb-3'>
            <Text
              className={cn(
                'text-4xl font-bold',
                isSelected ? 'text-white' : 'text-foreground'
              )}
            >
              {price}
            </Text>
            {periodLabel && (
              <Text
                className={cn(
                  'text-lg',
                  isSelected
                    ? 'text-primary-foreground'
                    : 'text-muted-foreground'
                )}
              >
                {periodLabel}
              </Text>
            )}
          </View>

          {/* Discount Badge */}
          {discountBadge && (
            <View
              className={cn(
                'px-2 py-1 rounded-full',
                isSelected
                  ? 'bg-primary'
                  : 'bg-success/10 /50'
              )}
            >
              <Text
                className={cn(
                  'text-sm font-semibold',
                  isSelected
                    ? 'text-white'
                    : 'text-success'
                )}
              >
                {discountBadge.text}
              </Text>
            </View>
          )}
        </View>

        {/* Custom Content Area */}
        {children}

        {/* Features List - no flex-grow, just takes its natural height */}
        {features.length > 0 && (
          <View className='gap-3 mb-6'>
            {features.map((feature, index) => (
              <View key={index} className='flex-row items-start'>
                <Text
                  className={cn(
                    'mr-3',
                    isSelected ? 'text-primary-foreground' : 'text-success'
                  )}
                >
                  ✓
                </Text>
                <Text
                  className={cn(
                    'text-sm flex-1',
                    isSelected
                      ? 'text-white'
                      : 'text-muted-foreground'
                  )}
                >
                  {feature.replace(/^✓\s*/, '')}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Premium Callout */}
        {premiumCallout && (
          <View
            className={cn(
              'rounded-lg p-4 mb-4',
              isSelected
                ? 'bg-primary/30'
                : 'bg-accent/50'
            )}
          >
            <Text
              className={cn(
                'font-semibold text-sm mb-2',
                isSelected
                  ? 'text-white'
                  : 'text-accent-foreground'
              )}
            >
              {premiumCallout.title}
            </Text>
            {premiumCallout.features.map((feat, idx) => (
              <Text
                key={idx}
                className={cn(
                  'text-xs',
                  isSelected
                    ? 'text-primary-foreground'
                    : 'text-muted-foreground'
                )}
              >
                • {feat}
              </Text>
            ))}
          </View>
        )}

        {/* Bottom Note (e.g., new expiration date) */}
        {bottomNote && (
          <Text
            className={cn(
              'text-center text-sm font-medium mb-4',
              isSelected ? 'text-primary-foreground' : 'text-primary'
            )}
          >
            {bottomNote}
          </Text>
        )}

        {/* Intro Price Banner */}
        {introPriceNote && (
          <View
            className={cn(
              'p-3 rounded-lg',
              isSelected
                ? 'bg-primary/30'
                : 'bg-warning/10 border border-warning/20'
            )}
          >
            <Text
              className={cn(
                'text-sm font-semibold text-center',
                isSelected
                  ? 'text-white'
                  : 'text-warning'
              )}
            >
              {introPriceNote}
            </Text>
          </View>
        )}
      </View>

      {/* Fixed-height bottom area - always present to reserve space */}
      <View className='h-14 justify-end items-center'>
        {/* CTA Button */}
        {showIndicator && isCtaMode && (
          <Pressable
            onPress={handleCtaPress}
            disabled={disabled}
            className={cn(
              'w-full py-3 rounded-lg items-center',
              isSelected ? 'bg-white' : 'bg-primary',
              disabled && 'opacity-50'
            )}
          >
            <Text
              className={cn(
                'font-semibold',
                isSelected ? 'text-primary' : 'text-white'
              )}
            >
              {ctaButton.label}
            </Text>
          </Pressable>
        )}

        {/* Radio button indicator */}
        {showIndicator && !isCtaMode && (
          <View
            className={cn(
              'w-5 h-5 rounded-full border-2 items-center justify-center',
              isSelected
                ? 'border-white bg-white'
                : 'border-border'
            )}
          >
            {isSelected && (
              <View className='w-2 h-2 rounded-full bg-primary' />
            )}
          </View>
        )}
      </View>
    </Pressable>
  );
}

export default SubscriptionTile;
