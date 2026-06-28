import * as React from 'react';
import { View, Text } from 'react-native';
import { cn } from '../../lib/utils';
import { designTokens, getCardVariantColors } from '@sudobility/design';

export interface DashboardStatCardProps {
  /** Stat title */
  title: string;
  /** Stat value */
  value: string | number;
  /** Change percentage */
  change?: number;
  /** Change period description */
  changePeriod?: string;
  /** Icon element */
  icon?: React.ReactNode;
  /** Color variant */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  /** Additional className */
  className?: string;
}

/**
 * DashboardStatCard Component
 *
 * Statistics display card for dashboards.
 * Shows value, change indicator, and optional icon.
 *
 * @example
 * ```tsx
 * <DashboardStatCard
 *   title="Total Revenue"
 *   value="$45,231"
 *   change={12.5}
 *   changePeriod="vs last month"
 *   variant="success"
 * />
 * ```
 */

// Lazily derive card variant colors from DS to avoid ESM issues in tests.
let _cardColors: Record<string, string> | null = null;
function getDashboardCardColors() {
  if (!_cardColors) {
    _cardColors = {
      default: getCardVariantColors('default'),
      primary: getCardVariantColors('info'),
      success: getCardVariantColors('success'),
      warning: getCardVariantColors('warning'),
      danger: getCardVariantColors('error'),
    };
  }
  return _cardColors;
}

export const DashboardStatCard: React.FC<DashboardStatCardProps> = ({
  title,
  value,
  change,
  changePeriod = 'vs last period',
  icon,
  variant = 'default',
  className,
}) => {
  const variantClasses = getDashboardCardColors();

  const isPositive = change !== undefined && change >= 0;

  return (
    <View
      className={cn(
        'rounded-lg border border-border p-6',
        variantClasses[variant],
        className
      )}
    >
      {/* Header */}
      <View className='flex-row items-start justify-between mb-2'>
        <Text
          className={`${designTokens.typography.size.sm} ${designTokens.typography.weight.medium} text-muted-foreground`}
        >
          {title}
        </Text>
        {icon && <View className='text-muted-foreground'>{icon}</View>}
      </View>

      {/* Value */}
      <Text
        className={`${designTokens.typography.size['3xl']} ${designTokens.typography.weight.bold} text-foreground`}
      >
        {value}
      </Text>

      {/* Change indicator */}
      {change !== undefined && (
        <View className='flex-row items-center gap-1 mt-2'>
          <Text
            className={cn(
              designTokens.typography.size.sm,
              designTokens.typography.weight.medium,
              isPositive ? 'text-success' : 'text-destructive'
            )}
          >
            {isPositive ? '↑' : '↓'} {Math.abs(change)}%
          </Text>
          <Text
            className={`${designTokens.typography.size.xs} text-muted-foreground`}
          >
            {changePeriod}
          </Text>
        </View>
      )}
    </View>
  );
};
