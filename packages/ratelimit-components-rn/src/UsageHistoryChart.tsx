import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { cn } from '@sudobility/components-rn';
import type { UsageHistoryChartProps, HistoryEntryData, UsageBarColor } from './types';

/**
 * Get color classes for chart elements
 */
function getColorClasses(color: UsageBarColor): { bg: string; border: string; text: string } {
  const colorMap: Record<UsageBarColor, { bg: string; border: string; text: string }> = {
    green: { bg: 'bg-green-500', border: 'border-green-500', text: 'text-green-600 dark:text-green-400' },
    yellow: { bg: 'bg-yellow-500', border: 'border-yellow-500', text: 'text-yellow-600 dark:text-yellow-400' },
    orange: { bg: 'bg-orange-500', border: 'border-orange-500', text: 'text-orange-600 dark:text-orange-400' },
    red: { bg: 'bg-red-500', border: 'border-red-500', text: 'text-red-600 dark:text-red-400' },
    blue: { bg: 'bg-blue-500', border: 'border-blue-500', text: 'text-blue-600 dark:text-blue-400' },
    gray: { bg: 'bg-gray-500', border: 'border-gray-500', text: 'text-gray-600 dark:text-gray-400' },
  };
  return colorMap[color];
}

/**
 * Format timestamp for display
 */
function formatTimestamp(timestamp: string | Date): string {
  if (typeof timestamp === 'string') {
    return timestamp;
  }
  return timestamp.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

/**
 * Bar chart mode component
 */
interface BarChartProps {
  data: HistoryEntryData[];
  height: number;
  color: UsageBarColor;
  showLimit: boolean;
  showLabels: boolean;
  onDataPointPress?: (entry: HistoryEntryData, index: number) => void;
}

function BarChart({ data, height, color, showLimit, showLabels, onDataPointPress }: BarChartProps) {
  const maxValue = Math.max(...data.map(d => Math.max(d.value, d.limit || 0)));
  const colors = getColorClasses(color);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row items-end" style={{ height }}>
        {data.map((entry, index) => {
          const barHeight = maxValue > 0 ? (entry.value / maxValue) * (height - 40) : 0;
          const limitHeight = entry.limit && maxValue > 0 ? (entry.limit / maxValue) * (height - 40) : 0;
          const label = entry.label || formatTimestamp(entry.timestamp);

          const barContent = (
            <View className="items-center mx-1.5" key={index}>
              {/* Value label */}
              {showLabels && (
                <Text className={cn('text-xs font-medium mb-1', colors.text)}>
                  {entry.value.toLocaleString()}
                </Text>
              )}

              {/* Bar container */}
              <View
                className="relative items-center justify-end"
                style={{ height: height - 40, width: 32 }}
              >
                {/* Limit indicator */}
                {showLimit && entry.limit && (
                  <View
                    className="absolute left-0 right-0 border-t-2 border-dashed border-red-400"
                    style={{ bottom: limitHeight }}
                  />
                )}

                {/* Bar */}
                <View
                  className={cn('w-6 rounded-t', colors.bg)}
                  style={{ height: Math.max(barHeight, 4) }}
                />
              </View>

              {/* Timestamp label */}
              <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1 w-12 text-center">
                {label}
              </Text>
            </View>
          );

          if (onDataPointPress) {
            return (
              <Pressable
                key={index}
                onPress={() => onDataPointPress(entry, index)}
                className="active:opacity-70"
                accessibilityRole="button"
                accessibilityLabel={label + ': ' + entry.value}
              >
                {barContent}
              </Pressable>
            );
          }

          return barContent;
        })}
      </View>
    </ScrollView>
  );
}

/**
 * Line chart mode component (simplified without SVG)
 */
interface LineChartProps {
  data: HistoryEntryData[];
  height: number;
  color: UsageBarColor;
  showLimit: boolean;
  showLabels: boolean;
  onDataPointPress?: (entry: HistoryEntryData, index: number) => void;
}

function LineChart({ data, height, color, showLimit, showLabels, onDataPointPress }: LineChartProps) {
  const maxValue = Math.max(...data.map(d => Math.max(d.value, d.limit || 0)));
  const colors = getColorClasses(color);

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View className="flex-row items-end" style={{ height }}>
        {data.map((entry, index) => {
          const dotY = maxValue > 0 ? (1 - entry.value / maxValue) * (height - 50) : height - 50;
          const limitY = entry.limit && maxValue > 0 ? (1 - entry.limit / maxValue) * (height - 50) : null;
          const label = entry.label || formatTimestamp(entry.timestamp);

          const pointContent = (
            <View className="items-center mx-3" key={index}>
              {/* Chart area */}
              <View
                className="relative items-center"
                style={{ height: height - 40, width: 40 }}
              >
                {/* Limit line */}
                {showLimit && limitY !== null && (
                  <View
                    className="absolute left-0 right-0 h-0.5 bg-red-400/50"
                    style={{ top: limitY }}
                  />
                )}

                {/* Value label above dot */}
                {showLabels && (
                  <View style={{ position: 'absolute', top: dotY - 20 }}>
                    <Text className={cn('text-xs font-medium', colors.text)}>
                      {entry.value.toLocaleString()}
                    </Text>
                  </View>
                )}

                {/* Data point dot */}
                <View
                  className={cn('w-3 h-3 rounded-full absolute', colors.bg)}
                  style={{ top: dotY }}
                />

                {/* Vertical guide line */}
                <View
                  className="w-px bg-gray-200 dark:bg-gray-700 absolute bottom-0"
                  style={{ height: height - 50 - dotY, top: dotY + 6 }}
                />
              </View>

              {/* Timestamp label */}
              <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1 w-14 text-center">
                {label}
              </Text>
            </View>
          );

          if (onDataPointPress) {
            return (
              <Pressable
                key={index}
                onPress={() => onDataPointPress(entry, index)}
                className="active:opacity-70"
                accessibilityRole="button"
                accessibilityLabel={label + ': ' + entry.value}
              >
                {pointContent}
              </Pressable>
            );
          }

          return pointContent;
        })}
      </View>
    </ScrollView>
  );
}

/**
 * UsageHistoryChart component displays historical usage data
 */
export function UsageHistoryChart({
  data,
  title,
  height = 200,
  color = 'blue',
  showLimit = true,
  showLabels = true,
  mode = 'bar',
  onDataPointPress,
  className,
}: UsageHistoryChartProps) {
  // Calculate summary stats
  const totalUsage = data.reduce((sum, entry) => sum + entry.value, 0);
  const avgUsage = data.length > 0 ? Math.round(totalUsage / data.length) : 0;
  const maxUsage = data.length > 0 ? Math.max(...data.map(d => d.value)) : 0;

  return (
    <View
      className={cn(
        'bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm',
        className
      )}
      accessibilityRole="none"
      accessibilityLabel={title || 'Usage History Chart'}
    >
      {/* Header */}
      {title && (
        <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {title}
        </Text>
      )}

      {/* Stats row */}
      <View className="flex-row justify-between mb-4 pb-3 border-b border-gray-100 dark:border-gray-700">
        <View className="items-center">
          <Text className="text-xs text-gray-500 dark:text-gray-400">Total</Text>
          <Text className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {totalUsage.toLocaleString()}
          </Text>
        </View>
        <View className="items-center">
          <Text className="text-xs text-gray-500 dark:text-gray-400">Average</Text>
          <Text className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {avgUsage.toLocaleString()}
          </Text>
        </View>
        <View className="items-center">
          <Text className="text-xs text-gray-500 dark:text-gray-400">Peak</Text>
          <Text className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            {maxUsage.toLocaleString()}
          </Text>
        </View>
      </View>

      {/* Chart */}
      {data.length > 0 ? (
        mode === 'bar' ? (
          <BarChart
            data={data}
            height={height}
            color={color}
            showLimit={showLimit}
            showLabels={showLabels}
            onDataPointPress={onDataPointPress}
          />
        ) : (
          <LineChart
            data={data}
            height={height}
            color={color}
            showLimit={showLimit}
            showLabels={showLabels}
            onDataPointPress={onDataPointPress}
          />
        )
      ) : (
        <View className="items-center justify-center" style={{ height }}>
          <Text className="text-gray-500 dark:text-gray-400">
            No history data available
          </Text>
        </View>
      )}

      {/* Legend */}
      {showLimit && data.some(d => d.limit) && (
        <View className="flex-row items-center justify-center mt-3 pt-2 border-t border-gray-100 dark:border-gray-700">
          <View className="w-4 h-0.5 bg-red-400 mr-2" />
          <Text className="text-xs text-gray-500 dark:text-gray-400">Limit</Text>
        </View>
      )}
    </View>
  );
}

export default UsageHistoryChart;
