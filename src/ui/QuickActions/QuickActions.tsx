import * as React from 'react';
import { View, Text, Pressable } from 'react-native';
import { cn } from '../../lib/utils';
import { designTokens } from '@sudobility/design';

const { typography } = designTokens;

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
  // Variant styles aligned with DS button colors (colors.component.button)
  const variantStyles = {
    default: {
      bg: 'bg-background border-border',
      bgActive: 'active:bg-muted',
      text: 'text-foreground',
    },
    primary: {
      bg: 'bg-primary border-primary',
      bgActive: 'active:bg-primary',
      text: 'text-white',
    },
    success: {
      bg: 'bg-success border-success',
      bgActive: 'active:bg-success',
      text: 'text-white',
    },
    warning: {
      bg: 'bg-warning border-warning',
      bgActive: 'active:bg-warning',
      text: 'text-white',
    },
    danger: {
      bg: 'bg-destructive border-destructive',
      bgActive: 'active:bg-destructive',
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
            <Text className={cn(typography.weight.medium, styles.text)}>
              {action.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};
