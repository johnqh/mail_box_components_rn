import * as React from 'react';
import { View, Text, Pressable } from 'react-native';
import { cn } from '../../lib/utils';

export interface QuickAction {
  /** Unique identifier */
  id: string;
  /** Button label */
  label: string;
  /** Icon component or element */
  icon?: React.ReactNode;
  /** Press handler */
  onPress: () => void;
  /** Button variant */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  /** Whether button is disabled */
  disabled?: boolean;
}

export interface QuickActionsProps {
  /** Actions to display */
  actions: QuickAction[];
  /** Layout orientation */
  orientation?: 'horizontal' | 'vertical' | 'grid';
  /** Grid columns (when orientation is grid) */
  columns?: number;
  /** Additional className */
  className?: string;
}

/**
 * QuickActions Component
 *
 * Quick action buttons for dashboard.
 * Supports multiple layouts and variants.
 *
 * @example
 * ```tsx
 * <QuickActions
 *   actions={[
 *     { id: '1', label: 'New Project', icon: <PlusIcon />, onPress: () => {}, variant: 'primary' },
 *     { id: '2', label: 'Upload File', icon: <UploadIcon />, onPress: () => {} },
 *     { id: '3', label: 'Export Data', icon: <DownloadIcon />, onPress: () => {} }
 *   ]}
 *   orientation="grid"
 *   columns={3}
 * />
 * ```
 */
export const QuickActions: React.FC<QuickActionsProps> = ({
  actions,
  orientation = 'horizontal',
  columns = 3,
  className,
}) => {
  const variantStyles = {
    default: {
      bg: 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700',
      bgActive: 'active:bg-gray-50 dark:active:bg-gray-800',
      text: 'text-gray-900 dark:text-white',
    },
    primary: {
      bg: 'bg-blue-500 border-blue-500',
      bgActive: 'active:bg-blue-600',
      text: 'text-white',
    },
    success: {
      bg: 'bg-green-500 border-green-500',
      bgActive: 'active:bg-green-600',
      text: 'text-white',
    },
    warning: {
      bg: 'bg-yellow-500 border-yellow-500',
      bgActive: 'active:bg-yellow-600',
      text: 'text-white',
    },
    danger: {
      bg: 'bg-red-500 border-red-500',
      bgActive: 'active:bg-red-600',
      text: 'text-white',
    },
  };

  const layoutClasses = {
    horizontal: 'flex-row flex-wrap gap-2',
    vertical: 'flex-col gap-2',
    grid: 'flex-row flex-wrap gap-2',
  };

  // Calculate item flex for grid layout
  const getGridFlex = () => {
    if (orientation !== 'grid') return undefined;
    return 1 / columns;
  };

  return (
    <View className={cn(layoutClasses[orientation], className)}>
      {actions.map(action => {
        const variant = action.variant || 'default';
        const styles = variantStyles[variant];

        return (
          <Pressable
            key={action.id}
            onPress={action.onPress}
            disabled={action.disabled}
            className={cn(
              'flex-row items-center justify-center gap-2 px-4 py-3 rounded-lg border',
              styles.bg,
              !action.disabled && styles.bgActive,
              action.disabled && 'opacity-50',
              orientation === 'vertical' && 'w-full'
            )}
            style={
              orientation === 'grid'
                ? { flex: getGridFlex(), minWidth: 100 }
                : undefined
            }
            accessibilityRole='button'
            accessibilityLabel={action.label}
            accessibilityState={{ disabled: action.disabled }}
          >
            {action.icon && <View className='w-5 h-5'>{action.icon}</View>}
            <Text className={cn('font-medium', styles.text)}>
              {action.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};
