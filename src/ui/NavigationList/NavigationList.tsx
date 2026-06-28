import * as React from 'react';
import { View, Text, Pressable } from 'react-native';
import { cn } from '../../lib/utils';
import { designTokens } from '@sudobility/design';

const { typography } = designTokens;

export interface NavigationItem {
  /** Unique identifier for the item */
  id: string;
  /** Display label */
  label: string;
  /** Optional description/subtitle */
  description?: string;
  /** Icon component or element */
  icon: React.ReactNode;
  /** Path or identifier for selection */
  path: string;
  /** Optional badge count */
  badge?: number;
  /** Whether the item is disabled */
  disabled?: boolean;
}

export interface NavigationListProps {
  /** Array of navigation items */
  items: NavigationItem[];
  /** Currently selected item path */
  selectedPath?: string;
  /** Callback when an item is selected */
  onSelect: (path: string) => void;
  /** Variant of the navigation list */
  variant?: 'default' | 'compact' | 'sidebar';
  /** Additional className for the container */
  className?: string;
}

/**
 * NavigationList Component
 *
 * Displays a list of navigation items with icons, labels, and descriptions.
 * Commonly used in settings pages and documentation for master-detail layouts.
 *
 * @example
 * ```tsx
 * const items = [
 *   {
 *     id: 'general',
 *     label: 'General',
 *     description: 'Basic account settings',
 *     icon: <Cog6ToothIcon />,
 *     path: '/settings/general'
 *   },
 *   // ...
 * ];
 *
 * <NavigationList
 *   items={items}
 *   selectedPath={currentPath}
 *   onSelect={handleSelect}
 * />
 * ```
 */
export const NavigationList: React.FC<NavigationListProps> = ({
  items,
  selectedPath,
  onSelect,
  variant = 'default',
  className,
}) => {
  const containerClass = variant === 'compact' ? 'gap-1' : 'gap-0';

  return (
    <View className={cn(containerClass, className)} accessibilityRole='list'>
      {items.map((item, index) => {
        const isSelected = selectedPath === item.path;
        const isDisabled = item.disabled;
        const isLast = index === items.length - 1;

        return (
          <Pressable
            key={item.id}
            onPress={() => !isDisabled && onSelect(item.path)}
            disabled={isDisabled}
            className={cn(
              'flex-row items-start',
              variant === 'compact'
                ? 'p-3 rounded-lg'
                : cn('p-4', !isLast && 'border-b border-border'),
              isDisabled && 'opacity-50',
              !isDisabled && (isSelected ? 'bg-primary/10' : 'active:bg-muted ')
            )}
            accessibilityRole='button'
            accessibilityState={{
              selected: isSelected,
              disabled: isDisabled,
            }}
            accessibilityLabel={item.label}
            accessibilityHint={item.description}
          >
            <View className='w-5 h-5 mt-0.5 mr-3 flex-shrink-0'>
              {item.icon}
            </View>
            <View className='flex-1 min-w-0'>
              <View className='flex-row items-center'>
                <Text
                  className={cn(
                    typography.weight.medium,
                    isSelected ? 'text-primary' : 'text-muted-foreground'
                  )}
                >
                  {item.label}
                </Text>
                {item.badge !== undefined && item.badge > 0 && (
                  <View className='ml-2 px-2 py-0.5 bg-primary/10  rounded-full'>
                    <Text
                      className={cn(
                        typography.size.xs,
                        typography.weight.medium,
                        'text-primary dark:text-primary-foreground'
                      )}
                    >
                      {item.badge}
                    </Text>
                  </View>
                )}
              </View>
              {item.description && (
                <Text
                  className={cn(
                    typography.size.xs,
                    'text-muted-foreground mt-0.5'
                  )}
                >
                  {item.description}
                </Text>
              )}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};
