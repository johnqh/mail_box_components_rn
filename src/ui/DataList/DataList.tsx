import * as React from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import { cn } from '../../lib/utils';

export interface DataListColumn<T> {
  /** Column key */
  key: string;
  /** Column label */
  label: string;
  /** Render cell content */
  render?: (row: T, index: number) => React.ReactNode;
  /** Flex value for width */
  flex?: number;
  /** Align content */
  align?: 'left' | 'center' | 'right';
}

export interface DataListProps<T> {
  /** Table columns */
  columns: DataListColumn<T>[];
  /** Table data */
  data: T[];
  /** Row key extractor */
  keyExtractor: (row: T, index: number) => string;
  /** Row press handler */
  onRowPress?: (row: T, index: number) => void;
  /** Compact mode */
  compact?: boolean;
  /** Show column headers */
  showHeader?: boolean;
  /** Empty state message */
  emptyMessage?: string;
  /** Additional className */
  className?: string;
}

/**
 * DataList Component
 *
 * Mobile-friendly data list component (alternative to table).
 * Uses FlatList for virtualization and performance.
 *
 * @example
 * ```tsx
 * <DataList
 *   columns={[
 *     { key: 'name', label: 'Name', flex: 2 },
 *     { key: 'email', label: 'Email', flex: 3 },
 *     { key: 'role', label: 'Role', flex: 1, align: 'right' }
 *   ]}
 *   data={users}
 *   keyExtractor={(user) => user.id}
 *   onRowPress={handleRowPress}
 * />
 * ```
 */
export function DataList<T extends Record<string, unknown>>({
  columns,
  data,
  keyExtractor,
  onRowPress,
  compact = false,
  showHeader = true,
  emptyMessage = 'No data available',
  className,
}: DataListProps<T>) {
  const alignClasses = {
    left: 'items-start',
    center: 'items-center',
    right: 'items-end',
  };

  const renderHeader = () => {
    if (!showHeader) return null;

    return (
      <View className='flex-row bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700'>
        {columns.map(column => (
          <View
            key={column.key}
            className={cn(
              compact ? 'px-3 py-2' : 'px-4 py-3',
              alignClasses[column.align || 'left']
            )}
            style={{ flex: column.flex || 1 }}
          >
            <Text className='text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider'>
              {column.label}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderRow = ({ item, index }: { item: T; index: number }) => {
    const isOdd = index % 2 === 1;

    return (
      <Pressable
        onPress={() => onRowPress?.(item, index)}
        className={cn(
          'flex-row border-b border-gray-200 dark:border-gray-700',
          isOdd && 'bg-gray-50 dark:bg-gray-800/50',
          onRowPress && 'active:bg-gray-100 dark:active:bg-gray-800'
        )}
        disabled={!onRowPress}
        accessibilityRole={onRowPress ? 'button' : 'none'}
      >
        {columns.map(column => (
          <View
            key={column.key}
            className={cn(
              compact ? 'px-3 py-2' : 'px-4 py-3',
              alignClasses[column.align || 'left'],
              'justify-center'
            )}
            style={{ flex: column.flex || 1 }}
          >
            {column.render ? (
              column.render(item, index)
            ) : (
              <Text
                className='text-sm text-gray-900 dark:text-white'
                numberOfLines={1}
              >
                {String(item[column.key] ?? '')}
              </Text>
            )}
          </View>
        ))}
      </Pressable>
    );
  };

  const renderEmpty = () => (
    <View className='py-8 items-center'>
      <Text className='text-sm text-gray-500 dark:text-gray-400'>
        {emptyMessage}
      </Text>
    </View>
  );

  return (
    <View className={cn('bg-white dark:bg-gray-900', className)}>
      {renderHeader()}
      <FlatList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderRow}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
