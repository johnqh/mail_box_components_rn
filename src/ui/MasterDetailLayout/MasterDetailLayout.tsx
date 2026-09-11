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
      className={cn('relative p-4 border-b border-border', className)}
      accessibilityRole='button'
      accessibilityState={{ selected: isSelected }}
    >
      {/* Selection overlay */}
      {isSelected && (
        <View className='absolute inset-1 bg-primary/10 /10 rounded-lg' />
      )}

      {/* Content */}
      <View className='relative flex-row items-start'>
        {icon && (
          <View
            className={cn(
              'mr-3 mt-0.5',
              isSelected ? 'text-primary' : 'text-muted-foreground'
            )}
          >
            {icon}
          </View>
        )}
        <View className='flex-1'>
          <Text
            className={cn(
              'font-medium',
              isSelected ? 'text-primary' : 'text-foreground'
            )}
          >
            {label}
          </Text>
          {description && (
            <Text
              className={cn(
                'text-xs mt-0.5',
                isSelected
                  ? 'text-primary dark:text-primary'
                  : 'text-muted-foreground'
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
  /**
   * Name of the master list. Not rendered as a heading — a title above the list
   * only repeated what the screen already says. It labels the mobile back button
   * when `backButtonText` is not given.
   */
  masterTitle?: string;
  /** Subtitle shown above the master list (e.g. a wallet address) */
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
  /**
   * Whether the master panel paints its own recessed surface (default: false).
   *
   * By default the master sits flat on the page and a `border-r` divider
   * separates it from the detail — a tinted list cost readability. Set true to
   * paint `bg-well`, the theme's recessed role.
   */
  showMasterBackground?: boolean;
  /**
   * Inset the detail panel's title and content (default: false).
   *
   * The layout adds no padding of its own, so the master list runs to the screen
   * edge; turn this on to give the detail a gutter from the divider and the
   * screen edge.
   */
  detailPadding?: boolean;
}

/**
 * MasterDetailLayout Component
 *
 * A responsive master-detail layout for React Native, matching the web
 * `MasterDetailLayout` in `@sudobility/components`.
 * - Mobile: Toggle between master (navigation) and detail (content) views
 * - Tablet/Desktop: Side-by-side, edge to edge, master separated by a divider
 * - Master sits on the page background (opt in to `showMasterBackground`)
 * - Optional detail inset (`detailPadding`)
 *
 * @example
 * ```tsx
 * <MasterDetailLayout
 *   masterTitle="Table of Contents" // mobile back-button label
 *   masterContent={<NavigationMenu items={sections} />}
 *   detailContent={<Article content={currentSection} />}
 *   mobileView={view}
 *   onBackToNavigation={() => setView('navigation')}
 *   detailPadding
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
  showMasterBackground = false,
  detailPadding = false,
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

  const subtitle = masterSubtitle ? (
    <Text className='text-sm text-muted-foreground px-4 pt-4 mb-2'>
      {masterSubtitle}
    </Text>
  ) : null;

  // Tablet/Desktop: Side-by-side layout
  if (isTablet) {
    return (
      <View className='flex-1 flex-row'>
        {/* Master Panel */}
        <View
          testID='master-detail-master'
          style={{ width: masterWidth }}
          className={cn(
            'border-r border-border',
            showMasterBackground && 'bg-well',
            masterClassName
          )}
        >
          {subtitle}
          <ScrollView>{masterContent}</ScrollView>
        </View>

        {/* Detail Panel */}
        <View
          testID='master-detail-detail'
          className={cn(
            'flex-1',
            detailPadding && 'px-6 py-6',
            detailClassName
          )}
        >
          {detailTitle && (
            <Text className='text-2xl font-bold text-foreground mb-6'>
              {detailTitle}
            </Text>
          )}
          <ScrollView>{detailContent}</ScrollView>
        </View>
      </View>
    );
  }

  // Mobile: Toggle between views
  return (
    <View className='flex-1'>
      {/* Mobile Navigation View */}
      {mobileView === 'navigation' && (
        <View
          testID='master-detail-master'
          className={cn('flex-1', showMasterBackground && 'bg-well')}
        >
          {subtitle}
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
              className='mb-4 px-4 py-2 border border-border rounded-md bg-card self-start'
              accessibilityRole='button'
              accessibilityLabel={`Back to ${buttonText}`}
            >
              <Text className='text-sm font-medium text-muted-foreground'>
                ← {buttonText}
              </Text>
            </Pressable>
          )}

          {/* Detail content */}
          <View
            testID='master-detail-detail'
            className={cn(
              'flex-1 bg-card rounded-lg border border-border',
              detailPadding && 'p-4',
              detailClassName
            )}
          >
            {detailTitle && (
              <Text className='text-2xl font-bold text-foreground mb-6'>
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
