import * as React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { cn } from '../../lib/utils';
import { ui, designTokens } from '@sudobility/design';

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
        {/* Header -- using DS table.thead */}
        <View
          className={cn('flex-row', ui.table.thead, 'border-b border-border')}
        >
          {columns.map(column => (
            <Pressable
              key={column.key}
              onPress={() => column.sortable && handleSort(column)}
              disabled={!column.sortable}
              className={cn(
                compact ? 'px-3 py-2' : 'px-4 py-3',
                bordered && 'border-r border-border last:border-r-0'
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
                <Text
                  className={cn(
                    designTokens.typography.size.xs,
                    designTokens.typography.weight.medium,
                    'text-muted-foreground',
                    designTokens.typography.transform.uppercase,
                    designTokens.typography.tracking.wider
                  )}
                >
                  {column.label}
                </Text>
                {column.sortable && sort?.column === column.key && (
                  <Text className='text-xs text-muted-foreground'>
                    {sort.direction === 'asc' ? '↑' : '↓'}
                  </Text>
                )}
              </View>
            </Pressable>
          ))}
        </View>

        {/* Body -- using DS table.tr */}
        <View className={ui.table.tr}>
          {data.length === 0 ? (
            <View className='px-4 py-8'>
              <Text className='text-center text-sm text-muted-foreground'>
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
                  'border-b border-border',
                  striped && rowIndex % 2 === 1 && ui.table.trAlt
                )}
                accessibilityRole='button'
              >
                {columns.map(column => (
                  <View
                    key={column.key}
                    className={cn(
                      compact ? 'px-3 py-2' : 'px-4 py-3',
                      alignClasses[column.align || 'left'],
                      bordered && 'border-r border-border last:border-r-0'
                    )}
                    style={{ width: column.width }}
                  >
                    {column.render ? (
                      column.render(row, rowIndex)
                    ) : (
                      <Text
                        className={cn(
                          designTokens.typography.size.sm,
                          'text-foreground'
                        )}
                      >
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
