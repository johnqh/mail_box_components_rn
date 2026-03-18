/**
 * @sudobility/subscription-components-rn
 *
 * Subscription UI components for React Native with RevenueCat integration.
 * All components support full localization - text labels are passed by the consumer.
 *
 * Aligned with @sudobility/subscription-components (web).
 */

// Components
export {
  SubscriptionTile,
  type SubscriptionTileProps,
} from './SubscriptionTile';
export {
  SubscriptionLayout,
  SubscriptionDivider,
  SubscriptionFooter,
  type SubscriptionLayoutProps,
  type SubscriptionLayoutVariant,
  type SubscriptionDividerProps,
  type SubscriptionFooterProps,
} from './SubscriptionLayout';
export {
  SegmentedControl,
  PeriodSelector,
  type SegmentedControlProps,
  type SegmentedControlOption,
  type PeriodSelectorProps,
} from './SegmentedControl';
export {
  SubscriptionProvider,
  useSubscriptionContext,
  SubscriptionContext,
  type SubscriptionProviderProps,
} from './SubscriptionProvider';

// Types
export type {
  SubscriptionProduct,
  SubscriptionStatus,
  SubscriptionContextValue,
  SubscriptionProviderConfig,
  BadgeConfig,
  CtaButtonConfig,
  DiscountBadgeConfig,
  PremiumCalloutConfig,
  FreeTileConfig,
  SubscriptionStatusConfig,
  ActionButtonConfig,
  SubscriptionTileTrackingData,
  SubscriptionLayoutTrackingData,
} from './types';
