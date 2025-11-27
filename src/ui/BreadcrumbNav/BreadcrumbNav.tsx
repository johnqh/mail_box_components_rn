import * as React from 'react';
import { View, Text, Pressable } from 'react-native';
import { cn } from '../../lib/utils';

export interface BreadcrumbNavItem {
  /** Item label */
  label: string;
  /** Navigation handler */
  onPress?: () => void;
}

export interface BreadcrumbNavProps {
  /** Breadcrumb items */
  items: BreadcrumbNavItem[];
  /** Custom separator */
  separator?: React.ReactNode;
  /** Additional className */
  className?: string;
}

/**
 * BreadcrumbNav Component
 *
 * Simple breadcrumb navigation for React Native.
 * Shows a trail of navigational links.
 *
 * @example
 * ```tsx
 * <BreadcrumbNav
 *   items={[
 *     { label: 'Home', onPress: () => navigate('home') },
 *     { label: 'Products', onPress: () => navigate('products') },
 *     { label: 'Electronics' }
 *   ]}
 * />
 * ```
 */
export const BreadcrumbNav: React.FC<BreadcrumbNavProps> = ({
  items,
  separator = '/',
  className,
}) => {
  return (
    <View
      className={cn('flex-row items-center gap-2', className)}
      accessibilityRole='none'
      accessibilityLabel='Breadcrumb navigation'
    >
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <Text className='text-gray-400 dark:text-gray-600 text-sm'>
              {typeof separator === 'string' ? separator : separator}
            </Text>
          )}
          {index === items.length - 1 ? (
            <Text className='text-gray-900 dark:text-white font-medium text-sm'>
              {item.label}
            </Text>
          ) : (
            <Pressable
              onPress={item.onPress}
              accessibilityRole='link'
              accessibilityLabel={item.label}
            >
              <Text className='text-blue-600 dark:text-blue-400 text-sm'>
                {item.label}
              </Text>
            </Pressable>
          )}
        </React.Fragment>
      ))}
    </View>
  );
};
