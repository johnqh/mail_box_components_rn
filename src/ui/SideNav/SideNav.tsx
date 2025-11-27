import * as React from 'react';
import { View, Text, Pressable } from 'react-native';
import { cn } from '../../lib/utils';

export interface NavItem {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Icon component or element */
  icon?: React.ReactNode;
  /** Press handler */
  onPress?: () => void;
  /** Active/selected state */
  active?: boolean;
  /** Badge content */
  badge?: string | number;
}

export interface SideNavProps {
  /** Navigation items */
  items: NavItem[];
  /** Additional className */
  className?: string;
}

/**
 * SideNav Component
 *
 * Side navigation for drawer menus or sidebar layouts.
 * Displays items with icons, labels, and badges.
 *
 * @example
 * ```tsx
 * <SideNav
 *   items={[
 *     { id: 'home', label: 'Home', icon: <HomeIcon />, active: true },
 *     { id: 'settings', label: 'Settings', icon: <CogIcon />, badge: 3 },
 *   ]}
 * />
 * ```
 */
export const SideNav: React.FC<SideNavProps> = ({ items, className }) => {
  return (
    <View className={cn('gap-1', className)} accessibilityRole='list'>
      {items.map(item => (
        <Pressable
          key={item.id}
          onPress={item.onPress}
          className={cn(
            'flex-row items-center gap-3 px-4 py-3 rounded-lg',
            item.active
              ? 'bg-blue-50 dark:bg-blue-900/20'
              : 'active:bg-gray-100 dark:active:bg-gray-800'
          )}
          accessibilityRole='button'
          accessibilityState={{ selected: item.active }}
          accessibilityLabel={item.label}
        >
          {item.icon && <View className='w-5 h-5'>{item.icon}</View>}
          <Text
            className={cn(
              'flex-1 font-medium',
              item.active
                ? 'text-blue-600 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300'
            )}
          >
            {item.label}
          </Text>
          {item.badge !== undefined && (
            <View className='px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded'>
              <Text className='text-xs text-gray-700 dark:text-gray-300'>
                {item.badge}
              </Text>
            </View>
          )}
        </Pressable>
      ))}
    </View>
  );
};
