import * as React from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { cn } from '../../lib/utils';

/**
 * MasterListItem - Standardized list item with selection styling
 */
export interface MasterListItemProps {
  /** Whether this item is currently selected */
  isSelected: boolean;
  /** Press handler */
  onPress: () => void;
  /** Icon element to display (optional) */
  icon?: React.ReactNode;
  /** Main label text */
  label: string;
  /** Description text (optional) */
  description?: string;
  /** Additional className */
  className?: string;
}

export const MasterListItem: React.FC<MasterListItemProps> = ({
  isSelected,
  onPress,
  icon,
  label,
  description,
  className,
}) => {
  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'relative p-4 border-b border-gray-200 dark:border-gray-700',
        className
      )}
      accessibilityRole='button'
      accessibilityState={{ selected: isSelected }}
    >
      {/* Selection overlay */}
      {isSelected && (
        <View className='absolute inset-1 bg-blue-500/10 dark:bg-blue-400/10 rounded-lg' />
      )}

      {/* Content */}
      <View className='relative flex-row items-start'>
        {icon && (
          <View
            className={cn(
              'mr-3 mt-0.5',
              isSelected
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400'
            )}
          >
            {icon}
          </View>
        )}
        <View className='flex-1'>
          <Text
            className={cn(
              'font-medium',
              isSelected
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-900 dark:text-gray-100'
            )}
          >
            {label}
          </Text>
          {description && (
            <Text
              className={cn(
                'text-xs mt-0.5',
                isSelected
                  ? 'text-blue-500 dark:text-blue-300'
                  : 'text-gray-500 dark:text-gray-400'
              )}
            >
              {description}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
};

export interface MasterDetailLayoutProps {
  /** Title shown above the master panel */
  masterTitle?: string;
  /** Subtitle shown below master title */
  masterSubtitle?: string;
  /** Text shown in the back button on mobile */
  backButtonText?: string;
  /** Content for the master panel */
  masterContent: React.ReactNode;
  /** Content for the detail panel */
  detailContent: React.ReactNode;
  /** Title for the detail panel */
  detailTitle?: string;
  /** Current mobile view state */
  mobileView?: 'navigation' | 'content';
  /** Callback when user wants to switch to navigation view */
  onBackToNavigation?: () => void;
  /** Custom class for master panel */
  masterClassName?: string;
  /** Custom class for detail panel */
  detailClassName?: string;
  /** Width of master panel on tablet (default: 320) */
  masterWidth?: number;
  /** Breakpoint for tablet layout (default: 768) */
  tabletBreakpoint?: number;
}

/**
 * MasterDetailLayout Component
 *
 * A responsive master-detail layout for React Native.
 * - Mobile: Toggle between master (navigation) and detail (content) views
 * - Tablet/Desktop: Side-by-side layout
 *
 * @example
 * ```tsx
 * <MasterDetailLayout
 *   masterTitle="Table of Contents"
 *   masterContent={<NavigationMenu items={sections} />}
 *   detailContent={<Article content={currentSection} />}
 *   mobileView={view}
 *   onBackToNavigation={() => setView('navigation')}
 * />
 * ```
 */
export const MasterDetailLayout: React.FC<MasterDetailLayoutProps> = ({
  masterTitle,
  masterSubtitle,
  backButtonText,
  masterContent,
  detailContent,
  detailTitle,
  mobileView = 'navigation',
  onBackToNavigation,
  masterClassName,
  detailClassName,
  masterWidth = 320,
  tabletBreakpoint = 768,
}) => {
  const { width } = useWindowDimensions();
  const isTablet = width >= tabletBreakpoint;

  // Extract first part of title for back button
  const extractFirstPart = (text: string | undefined) => {
    if (!text) return 'Back';
    return text.split('-')[0].trim();
  };

  const buttonText = backButtonText
    ? extractFirstPart(backButtonText)
    : masterTitle
      ? extractFirstPart(masterTitle)
      : 'Back';

  // Tablet/Desktop: Side-by-side layout
  if (isTablet) {
    return (
      <View className='flex-1 flex-row gap-8 p-4'>
        {/* Master Panel */}
        <View style={{ width: masterWidth }}>
          {masterTitle && (
            <Text className='text-lg font-semibold text-gray-900 dark:text-white mb-4'>
              {masterTitle}
            </Text>
          )}
          {masterSubtitle && (
            <Text className='text-sm text-gray-600 dark:text-gray-400 mb-6'>
              {masterSubtitle}
            </Text>
          )}
          <View
            className={cn(
              'bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700',
              masterClassName
            )}
          >
            <ScrollView>{masterContent}</ScrollView>
          </View>
        </View>

        {/* Detail Panel */}
        <View className='flex-1'>
          <View
            className={cn(
              'bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6',
              detailClassName
            )}
          >
            {detailTitle && (
              <Text className='text-2xl font-bold text-gray-900 dark:text-white mb-6'>
                {detailTitle}
              </Text>
            )}
            <ScrollView>{detailContent}</ScrollView>
          </View>
        </View>
      </View>
    );
  }

  // Mobile: Toggle between views
  return (
    <View className='flex-1'>
      {/* Mobile Navigation View */}
      {mobileView === 'navigation' && (
        <View className='flex-1 bg-white dark:bg-gray-800 p-6'>
          {masterTitle && (
            <Text className='text-xl font-semibold text-gray-900 dark:text-white mb-4'>
              {masterTitle}
            </Text>
          )}
          {masterSubtitle && (
            <Text className='text-sm text-gray-600 dark:text-gray-400 mb-6'>
              {masterSubtitle}
            </Text>
          )}
          <View className={masterClassName}>
            <ScrollView>{masterContent}</ScrollView>
          </View>
        </View>
      )}

      {/* Mobile Content View */}
      {mobileView === 'content' && (
        <View className='flex-1 p-4'>
          {/* Back button */}
          {onBackToNavigation && (
            <Pressable
              onPress={onBackToNavigation}
              className='mb-4 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 self-start'
              accessibilityRole='button'
              accessibilityLabel={`Back to ${buttonText}`}
            >
              <Text className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                ← {buttonText}
              </Text>
            </Pressable>
          )}

          {/* Detail content */}
          <View
            className={cn(
              'flex-1 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6',
              detailClassName
            )}
          >
            {detailTitle && (
              <Text className='text-2xl font-bold text-gray-900 dark:text-white mb-6'>
                {detailTitle}
              </Text>
            )}
            <ScrollView>{detailContent}</ScrollView>
          </View>
        </View>
      )}
    </View>
  );
};
