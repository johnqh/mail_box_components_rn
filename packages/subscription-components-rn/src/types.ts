/**
 * Represents a subscription product from RevenueCat or other provider
 */
export interface SubscriptionProduct {
  /** Unique identifier for the product */
  id: string;
  /** Display name of the subscription tier */
  title: string;
  /** Description of the subscription */
  description?: string;
  /** Formatted price string (e.g., "$9.99/mo") */
  priceString: string;
  /** Raw price in cents/smallest currency unit */
  priceInCents: number;
  /** Currency code (e.g., "USD") */
  currencyCode: string;
  /** Billing period: monthly, yearly, weekly, etc. */
  period: 'weekly' | 'monthly' | 'quarterly' | 'yearly' | 'lifetime';
  /** List of features included in this tier */
  features: string[];
  /** Whether this is the recommended/highlighted option */
  isRecommended?: boolean;
  /** Whether this is the current user's active subscription */
  isCurrent?: boolean;
  /** Original price if discounted */
  originalPriceString?: string;
  /** Savings percentage for annual vs monthly */
  savingsPercentage?: number;
  /** RevenueCat package identifier */
  rcPackageId?: string;
  /** Trial period info */
  trialPeriod?: {
    days: number;
    priceString: string;
  };
}

/**
 * Current subscription status
 */
export interface SubscriptionStatus {
  /** Whether user has an active subscription */
  isSubscribed: boolean;
  /** Whether user is in a trial period */
  isInTrial: boolean;
  /** Current subscription tier ID */
  currentTierId?: string;
  /** Expiration date of current subscription */
  expirationDate?: Date;
  /** Whether subscription will auto-renew */
  willRenew: boolean;
  /** Platform where subscription was purchased */
  platform?: 'ios' | 'android' | 'web';
  /** Management URL for subscription */
  managementUrl?: string;
}

/**
 * Configuration for badge display on subscription tiles
 */
export interface BadgeConfig {
  /** Badge text */
  text: string;
  /** Badge variant/color scheme */
  variant: 'default' | 'primary' | 'success' | 'warning' | 'premium';
  /** Icon name (optional) */
  icon?: string;
}

/**
 * Configuration for discount badges
 */
export interface DiscountBadgeConfig {
  /** Percentage off (e.g., 20 for 20% off) */
  percentage: number;
  /** Custom text override */
  customText?: string;
  /** Badge position */
  position?: 'top-left' | 'top-right' | 'inline';
}

/**
 * Configuration for premium callout sections
 */
export interface PremiumCalloutConfig {
  /** Callout title */
  title: string;
  /** Callout description */
  description: string;
  /** Icon name */
  icon?: string;
  /** Background gradient colors */
  gradientColors?: [string, string];
}

/**
 * Configuration for CTA button
 */
export interface CtaButtonConfig {
  /** Button text */
  text: string;
  /** Loading state text */
  loadingText?: string;
  /** Variant */
  variant?: 'default' | 'primary' | 'premium';
}

/**
 * Configuration for free tier tile
 */
export interface FreeTileConfig {
  /** Title text */
  title: string;
  /** Description */
  description?: string;
  /** Features list */
  features: string[];
  /** CTA text */
  ctaText?: string;
}

/**
 * Subscription context value
 */
export interface SubscriptionContextValue {
  /** Available subscription products */
  products: SubscriptionProduct[];
  /** Current subscription status */
  status: SubscriptionStatus;
  /** Currently selected product ID */
  selectedProductId: string | null;
  /** Selected billing period */
  selectedPeriod: 'monthly' | 'yearly';
  /** Whether products are loading */
  isLoading: boolean;
  /** Whether a purchase is in progress */
  isPurchasing: boolean;
  /** Error message if any */
  error: string | null;
  /** Select a product */
  selectProduct: (productId: string) => void;
  /** Change billing period */
  setPeriod: (period: 'monthly' | 'yearly') => void;
  /** Initiate purchase for selected product */
  purchase: () => Promise<boolean>;
  /** Restore previous purchases */
  restore: () => Promise<boolean>;
  /** Refresh products and status */
  refresh: () => Promise<void>;
}
