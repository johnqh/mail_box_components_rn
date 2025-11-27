import * as React from 'react';
import { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { cn } from '../../lib/utils';

export interface BreadcrumbItem {
  /** Item label */
  label: string;
  /** Press handler (for navigation) */
  onPress?: () => void;
  /** Icon to display before label */
  icon?: React.ReactNode;
  /** Whether item is current page */
  isCurrent?: boolean;
}

export interface BreadcrumbProps {
  /** Breadcrumb items */
  items: BreadcrumbItem[];
  /** Separator between items */
  separator?: React.ReactNode;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Maximum items to display before collapsing */
  maxItems?: number;
  /** Additional className */
  className?: string;
}

/**
 * Breadcrumb Component
 *
 * Navigation breadcrumb trail showing current page hierarchy.
 * Supports press handlers, custom separators, and collapsing.
 *
 * @example
 * ```tsx
 * <Breadcrumb
 *   items={[
 *     { label: 'Home', onPress: () => navigate('/') },
 *     { label: 'Products', onPress: () => navigate('/products') },
 *     { label: 'Item', isCurrent: true }
 *   ]}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <Breadcrumb
 *   items={breadcrumbs}
 *   separator={<ChevronRightIcon />}
 *   maxItems={4}
 * />
 * ```
 */
export const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator = '/',
  size = 'md',
  maxItems,
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Size configurations
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  // Determine which items to display
  const getDisplayItems = (): (BreadcrumbItem | { type: 'ellipsis' })[] => {
    if (!maxItems || items.length <= maxItems || isExpanded) {
      return items;
    }

    // Show first item, ellipsis, and last (maxItems - 2) items
    const firstItems = items.slice(0, 1);
    const lastItems = items.slice(-(maxItems - 2));
    return [...firstItems, { type: 'ellipsis' as const }, ...lastItems];
  };

  const displayItems = getDisplayItems();

  const renderBreadcrumbItem = (
    item: BreadcrumbItem,
    _index: number,
    isLast: boolean
  ) => {
    const isCurrent = item.isCurrent || isLast;

    // Last item should NEVER be pressable
    if (isLast) {
      return (
        <View className='flex-row items-center gap-1.5'>
          {item.icon && <View className='flex-shrink-0'>{item.icon}</View>}
          <Text
            className={cn(
              sizeClasses[size],
              'text-gray-900 dark:text-white font-medium'
            )}
            accessibilityRole='text'
          >
            {item.label}
          </Text>
        </View>
      );
    }

    // Render pressable item
    if (item.onPress) {
      return (
        <Pressable
          onPress={item.onPress}
          className='flex-row items-center gap-1.5 active:opacity-70'
          accessibilityRole='link'
        >
          {item.icon && <View className='flex-shrink-0'>{item.icon}</View>}
          <Text
            className={cn(
              sizeClasses[size],
              'text-gray-600 dark:text-gray-400'
            )}
          >
            {item.label}
          </Text>
        </Pressable>
      );
    }

    return (
      <View className='flex-row items-center gap-1.5'>
        {item.icon && <View className='flex-shrink-0'>{item.icon}</View>}
        <Text
          className={cn(
            sizeClasses[size],
            isCurrent
              ? 'text-gray-900 dark:text-white font-medium'
              : 'text-gray-600 dark:text-gray-400'
          )}
        >
          {item.label}
        </Text>
      </View>
    );
  };

  const renderSeparator = () => {
    if (typeof separator === 'string') {
      return (
        <Text className='text-gray-400 dark:text-gray-600 mx-2'>
          {separator}
        </Text>
      );
    }
    return <View className='mx-2'>{separator}</View>;
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className={cn('flex-row', className)}
      contentContainerStyle={{ alignItems: 'center' }}
      accessibilityRole='none'
      accessibilityLabel='Breadcrumb'
    >
      {displayItems.map((item, index) => {
        // Handle ellipsis
        if ('type' in item && item.type === 'ellipsis') {
          return (
            <View key='ellipsis' className='flex-row items-center'>
              <Pressable
                onPress={() => setIsExpanded(true)}
                className='px-1 active:opacity-70'
                accessibilityRole='button'
                accessibilityLabel='Show all breadcrumb items'
              >
                <Text className='text-gray-600 dark:text-gray-400'>...</Text>
              </Pressable>
              {renderSeparator()}
            </View>
          );
        }

        const isLast = index === displayItems.length - 1;
        const breadcrumbItem = item as BreadcrumbItem;

        return (
          <View key={index} className='flex-row items-center'>
            {renderBreadcrumbItem(breadcrumbItem, index, isLast)}
            {!isLast && renderSeparator()}
          </View>
        );
      })}
    </ScrollView>
  );
};
