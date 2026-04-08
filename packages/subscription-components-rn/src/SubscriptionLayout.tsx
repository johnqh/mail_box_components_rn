import type { ReactNode } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { cn } from '@sudobility/components-rn';
import { SubscriptionTile } from './SubscriptionTile';
import { PlatformIcon, platformDisplayName } from './PlatformIcon';
import type {
  FreeTileConfig,
  SubscriptionLayoutTrackingData,
  SubscriptionStatusConfig,
  ActionButtonConfig,
} from './types';

/**
 * Layout variant:
 * - 'selection': User selects a tile, then presses a shared CTA button (default)
 * - 'cta': Each tile has its own CTA button, no shared action buttons
 */
export type SubscriptionLayoutVariant = 'selection' | 'cta';

export interface SubscriptionLayoutProps {
  /** Section title */
  title: string;
  /** Subscription tiles to render */
  children: ReactNode;
  /** Error message to display */
  error?: string | null;

  /**
   * Layout variant
   * - 'selection': User selects a tile, then presses primary action button
   * - 'cta': Each tile has its own CTA button (use ctaButton prop on tiles)
   * @default 'selection'
   */
  variant?: SubscriptionLayoutVariant;

  /** Current subscription status configuration */
  currentStatus?: SubscriptionStatusConfig;

  /** Primary action button (e.g., "Subscribe Now") - only shown in 'selection' variant */
  primaryAction?: ActionButtonConfig;

  /** Secondary action button (e.g., "Restore Purchase") - only shown in 'selection' variant */
  secondaryAction?: ActionButtonConfig;

  /** Additional NativeWind classes */
  className?: string;

  /** Custom header content */
  headerContent?: ReactNode;

  /** Content to render above the product tiles (e.g., billing period selector) */
  aboveProducts?: ReactNode;

  /** Custom footer content (rendered above action buttons) */
  footerContent?: ReactNode;

  /** Label for "Current Status" section - for localization */
  currentStatusLabel?: string;

  /**
   * Configuration for the free tile - only used when variant is 'cta'
   * When provided, a "Free" subscription tile will be shown at the start of the list
   */
  freeTileConfig?: FreeTileConfig;

  /** Optional tracking callback */
  onTrack?: (data: SubscriptionLayoutTrackingData) => void;
  /** Optional tracking label */
  trackingLabel?: string;
  /** Optional component name for tracking */
  componentName?: string;
}

/**
 * SubscriptionLayout - Container component for subscription selection UI
 *
 * Provides a consistent layout with:
 * - Optional current status display
 * - Title heading
 * - Scrollable list of subscription tiles
 * - Error message display
 * - Primary and optional secondary action buttons
 *
 * All labels are passed by the consumer for full localization control.
 */
export function SubscriptionLayout({
  title,
  children,
  error,
  variant = 'selection',
  currentStatus,
  primaryAction,
  secondaryAction,
  className = '',
  headerContent,
  aboveProducts,
  footerContent,
  currentStatusLabel = 'Current Status',
  freeTileConfig,
  onTrack,
  trackingLabel,
  componentName = 'SubscriptionLayout',
}: SubscriptionLayoutProps) {
  const showActionButtons = variant === 'selection' && primaryAction;
  // Free tile is only valid in 'cta' variant
  const shouldShowFreeTile = variant === 'cta' && freeTileConfig;

  const handlePrimaryPress = () => {
    onTrack?.({ action: 'primary_action', trackingLabel, componentName });
    primaryAction?.onPress();
  };

  const handleSecondaryPress = () => {
    onTrack?.({ action: 'secondary_action', trackingLabel, componentName });
    secondaryAction?.onPress();
  };

  return (
    <ScrollView
      className='flex-1'
      contentContainerClassName='p-4'
      showsVerticalScrollIndicator={false}
    >
      <View className={className}>
        {/* Custom Header Content */}
        {headerContent}

        {/* Current Status Section */}
        {currentStatus && (
          <View className='mb-6'>
            <Text className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
              {currentStatusLabel}
            </Text>

            {currentStatus.isActive ? (
              <View className='bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700 rounded-lg p-4'>
                <View className='flex-row items-center mb-2'>
                  <View className='w-3 h-3 bg-green-500 rounded-full mr-3' />
                  <Text className='font-semibold text-gray-800 dark:text-gray-200'>
                    {currentStatus.activeContent?.title ||
                      'Active Subscription'}
                  </Text>
                </View>
                {currentStatus.activeContent?.fields &&
                  currentStatus.activeContent.fields.length > 0 && (
                    <View className='mt-4 gap-4'>
                      {currentStatus.activeContent.fields.map(
                        (field, index) => (
                          <View key={index}>
                            <Text className='text-sm text-gray-500 dark:text-gray-400'>
                              {field.label}
                            </Text>
                            <Text className='font-semibold text-gray-700 dark:text-gray-300'>
                              {field.value}
                            </Text>
                          </View>
                        )
                      )}
                    </View>
                  )}
                {currentStatus.activeContent?.platform && (
                  <View className='mt-4'>
                    <Text className='text-sm text-gray-500 dark:text-gray-400'>
                      {currentStatus.activeContent.platform.label}
                    </Text>
                    <View className='flex-row items-center gap-1.5 mt-0.5'>
                      <PlatformIcon
                        platform={currentStatus.activeContent.platform.value}
                        className='text-gray-600 dark:text-gray-300'
                      />
                      <Text className='font-semibold text-gray-700 dark:text-gray-300'>
                        {platformDisplayName(currentStatus.activeContent.platform.value)}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            ) : (
              <View className='bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4'>
                <View className='flex-row items-center mb-2'>
                  <View className='w-3 h-3 bg-yellow-500 rounded-full mr-3' />
                  <Text className='font-semibold text-yellow-800 dark:text-yellow-300'>
                    {currentStatus.inactiveContent?.title ||
                      'No Active Subscription'}
                  </Text>
                </View>
                {currentStatus.inactiveContent?.message && (
                  <Text className='text-yellow-700 dark:text-yellow-400'>
                    {currentStatus.inactiveContent.message}
                  </Text>
                )}
              </View>
            )}
          </View>
        )}

        {/* Section Title */}
        <Text className='text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4'>
          {title}
        </Text>

        {/* Above Products Content (e.g., billing period selector) */}
        {aboveProducts}

        {/* Subscription Tiles */}
        <View className='gap-4'>
          {/* Free Tile - only shown in 'cta' variant when enabled */}
          {shouldShowFreeTile && (
            <SubscriptionTile
              id='free'
              title={freeTileConfig.title}
              price={freeTileConfig.price}
              periodLabel={freeTileConfig.periodLabel}
              features={freeTileConfig.features}
              isSelected={false}
              onSelect={() => {}}
              topBadge={freeTileConfig.topBadge}
              ctaButton={freeTileConfig.ctaButton}
            />
          )}
          {children}
        </View>

        {/* Custom Footer Content */}
        {footerContent}

        {/* Error Message */}
        {error && (
          <View className='bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mt-6'>
            <Text className='text-red-600 dark:text-red-400'>{error}</Text>
          </View>
        )}

        {/* Action Buttons - only shown in 'selection' variant */}
        {showActionButtons && (
          <View className='gap-3 mt-6'>
            {secondaryAction && (
              <Pressable
                onPress={handleSecondaryPress}
                disabled={secondaryAction.disabled || secondaryAction.loading}
                className={cn(
                  'py-3 rounded-lg border border-gray-300 dark:border-gray-600 items-center',
                  (secondaryAction.disabled || secondaryAction.loading) &&
                    'opacity-50'
                )}
              >
                {secondaryAction.loading ? (
                  <ActivityIndicator size='small' />
                ) : (
                  <Text className='font-semibold text-gray-900 dark:text-gray-100'>
                    {secondaryAction.label}
                  </Text>
                )}
              </Pressable>
            )}

            <Pressable
              onPress={handlePrimaryPress}
              disabled={primaryAction.disabled || primaryAction.loading}
              className={cn(
                'py-3 rounded-lg bg-blue-600 items-center',
                (primaryAction.disabled || primaryAction.loading) &&
                  'opacity-50'
              )}
            >
              {primaryAction.loading ? (
                <ActivityIndicator size='small' color='white' />
              ) : (
                <Text className='font-semibold text-white'>
                  {primaryAction.label}
                </Text>
              )}
            </Pressable>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

/**
 * Section divider for subscription layouts
 */
export interface SubscriptionDividerProps {
  /** Optional label text */
  label?: string;
  /** Custom class */
  className?: string;
}

export function SubscriptionDivider({
  label,
  className = '',
}: SubscriptionDividerProps) {
  if (label) {
    return (
      <View className={cn('flex-row items-center gap-4 my-4', className)}>
        <View className='flex-1 h-px bg-gray-200 dark:bg-gray-700' />
        <Text className='text-sm text-gray-500 dark:text-gray-400'>
          {label}
        </Text>
        <View className='flex-1 h-px bg-gray-200 dark:bg-gray-700' />
      </View>
    );
  }

  return (
    <View className={cn('h-px bg-gray-200 dark:bg-gray-700 my-4', className)} />
  );
}

/**
 * Footer with terms and restore button
 */
export interface SubscriptionFooterProps {
  /** Terms text */
  termsText?: string;
  /** Privacy link text */
  privacyText?: string;
  /** Restore purchases text */
  restoreText?: string;
  /** Called when restore is pressed */
  onRestore?: () => void;
  /** Called when terms is pressed */
  onTermsPress?: () => void;
  /** Called when privacy is pressed */
  onPrivacyPress?: () => void;
  /** Custom class */
  className?: string;
}

export function SubscriptionFooter({
  termsText = 'Terms of Service',
  privacyText = 'Privacy Policy',
  restoreText = 'Restore Purchases',
  onRestore,
  onTermsPress,
  onPrivacyPress,
  className = '',
}: SubscriptionFooterProps) {
  return (
    <View className={cn('items-center gap-3', className)}>
      {/* Restore Button */}
      {onRestore && (
        <Text
          className='text-sm text-blue-500 dark:text-blue-400 underline'
          onPress={onRestore}
          accessibilityRole='button'
        >
          {restoreText}
        </Text>
      )}

      {/* Legal Links */}
      <View className='flex-row items-center gap-4'>
        {onTermsPress && (
          <Text
            className='text-xs text-gray-500 dark:text-gray-400 underline'
            onPress={onTermsPress}
            accessibilityRole='link'
          >
            {termsText}
          </Text>
        )}
        {onPrivacyPress && (
          <Text
            className='text-xs text-gray-500 dark:text-gray-400 underline'
            onPress={onPrivacyPress}
            accessibilityRole='link'
          >
            {privacyText}
          </Text>
        )}
      </View>

      {/* Disclaimer */}
      <Text className='text-xs text-gray-400 dark:text-gray-500 text-center px-4'>
        Subscriptions will automatically renew unless canceled at least 24 hours
        before the end of the current period.
      </Text>
    </View>
  );
}

export default SubscriptionLayout;
