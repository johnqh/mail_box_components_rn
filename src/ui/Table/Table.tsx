import * as React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { cn } from '../../lib/utils';

export interface TableColumn<T> {
  /** Column key */
  key: string;
  /** Column label */
  label: React.ReactNode;
  /** Render cell content */
  render?: (row: T, index: number) => React.ReactNode;
  /** Column width */
  width?: number;
  /** Sortable column */
  sortable?: boolean;
  /** Align content */
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<T> {
  /** Table columns */
  columns: TableColumn<T>[];
  /** Table data */
  data: T[];
  /** Row key extractor */
  keyExtractor: (row: T, index: number) => string;
  /** Sort configuration */
  sort?: {
    column: string;
    direction: 'asc' | 'desc';
  };
  /** Sort handler */
  onSort?: (column: string) => void;
  /** Row click handler */
  onRowPress?: (row: T, index: number) => void;
  /** Striped rows */
  striped?: boolean;
  /** Compact mode */
  compact?: boolean;
  /** Show border */
  bordered?: boolean;
  /** Empty state message */
  emptyMessage?: string;
  /** Additional className */
  className?: string;
}

/**
 * Table Component
 *
 * Data table with sorting and customization for React Native.
 * Generic component supporting any data type.
 *
 * @example
 * ```tsx
 * <Table
 *   columns={[
 *     { key: 'name', label: 'Name', sortable: true },
 *     { key: 'email', label: 'Email' },
 *     { key: 'role', label: 'Role', align: 'center' }
 *   ]}
 *   data={users}
 *   keyExtractor={(user) => user.id}
 *   sort={sort}
 *   onSort={handleSort}
 *   onRowPress={handleRowPress}
 * />
 * ```
 */
export function Table<T extends Record<string, unknown>>({
  columns,
  data,
  keyExtractor,
  sort,
  onSort,
  onRowPress,
  striped = false,
  compact = false,
  bordered = false,
  emptyMessage = 'No data available',
  className,
}: TableProps<T>) {
  const handleSort = (column: TableColumn<T>) => {
    if (column.sortable && onSort) {
      onSort(column.key);
    }
  };

  const alignClasses = {
    left: 'items-start',
    center: 'items-center',
    right: 'items-end',
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={true}
      className={cn('w-full', className)}
    >
      <View className='flex-1'>
        {/* Header */}
        <View
          className={cn(
            'flex-row bg-gray-50 dark:bg-gray-800',
            'border-b border-gray-200 dark:border-gray-700'
          )}
        >
          {columns.map(column => (
            <Pressable
              key={column.key}
              onPress={() => column.sortable && handleSort(column)}
              disabled={!column.sortable}
              className={cn(
                compact ? 'px-3 py-2' : 'px-4 py-3',
                bordered &&
                  'border-r border-gray-200 dark:border-gray-700 last:border-r-0'
              )}
              style={{ width: column.width }}
              accessibilityRole='button'
              accessibilityLabel={`Sort by ${column.label}`}
            >
              <View
                className={cn(
                  'flex-row items-center gap-2',
                  alignClasses[column.align || 'left']
                )}
              >
                <Text className='text-xs font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wider'>
                  {column.label}
                </Text>
                {column.sortable && sort?.column === column.key && (
                  <Text className='text-xs text-gray-500'>
                    {sort.direction === 'asc' ? '↑' : '↓'}
                  </Text>
                )}
              </View>
            </Pressable>
          ))}
        </View>

        {/* Body */}
        <View className='bg-white dark:bg-gray-900'>
          {data.length === 0 ? (
            <View className='px-4 py-8'>
              <Text className='text-center text-sm text-gray-500 dark:text-gray-400'>
                {emptyMessage}
              </Text>
            </View>
          ) : (
            data.map((row, rowIndex) => (
              <Pressable
                key={keyExtractor(row, rowIndex)}
                onPress={() => onRowPress?.(row, rowIndex)}
                disabled={!onRowPress}
                className={cn(
                  'flex-row',
                  'border-b border-gray-200 dark:border-gray-700',
                  striped &&
                    rowIndex % 2 === 1 &&
                    'bg-gray-50 dark:bg-gray-800/50'
                )}
                accessibilityRole='button'
              >
                {columns.map(column => (
                  <View
                    key={column.key}
                    className={cn(
                      compact ? 'px-3 py-2' : 'px-4 py-3',
                      alignClasses[column.align || 'left'],
                      bordered &&
                        'border-r border-gray-200 dark:border-gray-700 last:border-r-0'
                    )}
                    style={{ width: column.width }}
                  >
                    {column.render ? (
                      column.render(row, rowIndex)
                    ) : (
                      <Text className='text-sm text-gray-900 dark:text-white'>
                        {String(row[column.key] ?? '')}
                      </Text>
                    )}
                  </View>
                ))}
              </Pressable>
            ))
          )}
        </View>
      </View>
    </ScrollView>
  );
}
