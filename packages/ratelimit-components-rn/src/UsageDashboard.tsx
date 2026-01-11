import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { cn } from '@sudobility/components-rn';
import type { UsageDashboardProps, UsageBarConfig, UsageBarColor } from './types';

/**
 * Get color classes based on usage percentage
 */
function getUsageColor(current: number, limit: number, colorOverride?: UsageBarColor): {
  bg: string;
  text: string;
} {
  if (colorOverride) {
    const colorMap: Record<UsageBarColor, { bg: string; text: string }> = {
      green: { bg: 'bg-green-500', text: 'text-green-600 dark:text-green-400' },
      yellow: { bg: 'bg-yellow-500', text: 'text-yellow-600 dark:text-yellow-400' },
      orange: { bg: 'bg-orange-500', text: 'text-orange-600 dark:text-orange-400' },
      red: { bg: 'bg-red-500', text: 'text-red-600 dark:text-red-400' },
      blue: { bg: 'bg-blue-500', text: 'text-blue-600 dark:text-blue-400' },
      gray: { bg: 'bg-gray-500', text: 'text-gray-600 dark:text-gray-400' },
    };
    return colorMap[colorOverride];
  }

  const percentage = limit > 0 ? (current / limit) * 100 : 0;

  if (percentage >= 90) {
    return { bg: 'bg-red-500', text: 'text-red-600 dark:text-red-400' };
  } else if (percentage >= 75) {
    return { bg: 'bg-orange-500', text: 'text-orange-600 dark:text-orange-400' };
  } else if (percentage >= 50) {
    return { bg: 'bg-yellow-500', text: 'text-yellow-600 dark:text-yellow-400' };
  } else {
    return { bg: 'bg-green-500', text: 'text-green-600 dark:text-green-400' };
  }
}

/**
 * Single usage bar component
 */
interface UsageBarProps {
  config: UsageBarConfig;
  showPercentage?: boolean;
  showRemaining?: boolean;
  onPress?: () => void;
}

function UsageBar({ config, showPercentage = true, showRemaining = true, onPress }: UsageBarProps) {
  const { label, current, limit, subtitle, colorOverride } = config;
  const percentage = limit > 0 ? Math.min((current / limit) * 100, 100) : 0;
  const remaining = Math.max(limit - current, 0);
  const colors = getUsageColor(current, limit, colorOverride);

  const content = (
    <View className="mb-4">
      {/* Header row */}
      <View className="flex-row justify-between items-center mb-2">
        <View className="flex-1">
          <Text className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {label}
          </Text>
          {subtitle && (
            <Text className="text-xs text-gray-500 dark:text-gray-400">
              {subtitle}
            </Text>
          )}
        </View>
        <View className="flex-row items-center gap-2">
          {showRemaining && (
            <Text className="text-xs text-gray-500 dark:text-gray-400">
              {remaining.toLocaleString()} remaining
            </Text>
          )}
          <Text className={cn('text-sm font-semibold', colors.text)}>
            {current.toLocaleString()} / {limit.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Progress bar */}
      <View className="h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <View
          className={cn('h-full rounded-full', colors.bg)}
          style={{ width: `${percentage}%` }}
        />
      </View>

      {/* Percentage label */}
      {showPercentage && (
        <View className="flex-row justify-end mt-1">
          <Text className={cn('text-xs font-medium', colors.text)}>
            {percentage.toFixed(1)}%
          </Text>
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className="active:opacity-80"
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${current} of ${limit} used`}
      >
        {content}
      </Pressable>
    );
  }

  return content;
}

/**
 * UsageDashboard component displays multiple usage bars for different time periods
 */
export function UsageDashboard({
  bars,
  title,
  subtitle,
  showPercentage = true,
  showRemaining = true,
  onBarPress,
  className,
}: UsageDashboardProps) {
  return (
    <View
      className={cn(
        'bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm',
        className
      )}
      accessibilityRole="none"
      accessibilityLabel={title || 'Usage Dashboard'}
    >
      {/* Header */}
      {(title || subtitle) && (
        <View className="mb-4">
          {title && (
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {title}
            </Text>
          )}
          {subtitle && (
            <Text className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {subtitle}
            </Text>
          )}
        </View>
      )}

      {/* Usage bars */}
      <View>
        {bars.map((bar, index) => (
          <UsageBar
            key={`${bar.label}-${index}`}
            config={bar}
            showPercentage={showPercentage}
            showRemaining={showRemaining}
            onPress={onBarPress ? () => onBarPress(bar, index) : undefined}
          />
        ))}
      </View>

      {/* Empty state */}
      {bars.length === 0 && (
        <View className="py-8 items-center">
          <Text className="text-gray-500 dark:text-gray-400">
            No usage data available
          </Text>
        </View>
      )}
    </View>
  );
}

export default UsageDashboard;
