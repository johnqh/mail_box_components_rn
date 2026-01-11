import React, { ReactNode } from 'react';
import { View, Text, ScrollView } from 'react-native';

/**
 * Props for SubscriptionLayout component
 */
export interface SubscriptionLayoutProps {
  /** Layout content (subscription tiles) */
  children: ReactNode;
  /** Layout title */
  title?: string;
  /** Layout subtitle/description */
  subtitle?: string;
  /** Header content (e.g., period selector) */
  headerContent?: ReactNode;
  /** Footer content (e.g., CTA button, terms) */
  footerContent?: ReactNode;
  /** Layout direction for tiles */
  direction?: 'vertical' | 'horizontal';
  /** Spacing between tiles */
  spacing?: 'compact' | 'normal' | 'relaxed';
  /** Enable scrolling */
  scrollable?: boolean;
  /** Custom container class */
  className?: string;
  /** Custom content container class */
  contentClassName?: string;
}

/**
 * Spacing class mapping
 */
const spacingClasses = {
  compact: 'gap-2',
  normal: 'gap-4',
  relaxed: 'gap-6',
};

/**
 * Layout wrapper for subscription tiles
 * Provides consistent structure for subscription UI screens
 */
export function SubscriptionLayout({
  children,
  title,
  subtitle,
  headerContent,
  footerContent,
  direction = 'vertical',
  spacing = 'normal',
  scrollable = true,
  className = '',
  contentClassName = '',
}: SubscriptionLayoutProps) {
  const directionClass = direction === 'horizontal' ? 'flex-row' : 'flex-col';
  const contentClasses = [directionClass, spacingClasses[spacing], contentClassName].filter(Boolean).join(' ');

  const content = (
    <View className={'flex-1 ' + className}>
      {/* Header Section */}
      {(title || subtitle || headerContent) && (
        <View className="mb-6">
          {title && (
            <Text className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              {title}
            </Text>
          )}
          {subtitle && (
            <Text className="text-base text-neutral-600 dark:text-neutral-400">
              {subtitle}
            </Text>
          )}
          {headerContent && (
            <View className="mt-4">
              {headerContent}
            </View>
          )}
        </View>
      )}

      {/* Tiles Content */}
      <View className={contentClasses}>
        {children}
      </View>

      {/* Footer Section */}
      {footerContent && (
        <View className="mt-6">
          {footerContent}
        </View>
      )}
    </View>
  );

  if (scrollable) {
    return (
      <ScrollView
        className="flex-1"
        contentContainerClassName="p-4"
        showsVerticalScrollIndicator={false}
      >
        {content}
      </ScrollView>
    );
  }

  return (
    <View className="flex-1 p-4">
      {content}
    </View>
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
      <View className={'flex-row items-center gap-4 my-4 ' + className}>
        <View className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
        <Text className="text-sm text-neutral-500 dark:text-neutral-400">
          {label}
        </Text>
        <View className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
      </View>
    );
  }

  return (
    <View className={'h-px bg-neutral-200 dark:bg-neutral-700 my-4 ' + className} />
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
    <View className={'items-center gap-3 ' + className}>
      {/* Restore Button */}
      {onRestore && (
        <Text
          className="text-sm text-blue-500 dark:text-blue-400 underline"
          onPress={onRestore}
          accessibilityRole="button"
        >
          {restoreText}
        </Text>
      )}

      {/* Legal Links */}
      <View className="flex-row items-center gap-4">
        {onTermsPress && (
          <Text
            className="text-xs text-neutral-500 dark:text-neutral-400 underline"
            onPress={onTermsPress}
            accessibilityRole="link"
          >
            {termsText}
          </Text>
        )}
        {onPrivacyPress && (
          <Text
            className="text-xs text-neutral-500 dark:text-neutral-400 underline"
            onPress={onPrivacyPress}
            accessibilityRole="link"
          >
            {privacyText}
          </Text>
        )}
      </View>

      {/* Disclaimer */}
      <Text className="text-xs text-neutral-400 dark:text-neutral-500 text-center px-4">
        Subscriptions will automatically renew unless canceled at least 24 hours before the end of the current period.
      </Text>
    </View>
  );
}

export default SubscriptionLayout;
