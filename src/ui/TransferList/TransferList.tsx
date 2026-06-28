import * as React from 'react';
import { useState, useCallback } from 'react';
import { View, Text, TextInput, Pressable, ScrollView } from 'react-native';
import { cn } from '../../lib/utils';
import { colors } from '@sudobility/design';

export interface TransferListItem {
  /** Item ID */
  id: string;
  /** Item label */
  label: string;
  /** Optional description */
  description?: string;
  /** Disabled state */
  disabled?: boolean;
}

export interface TransferListProps {
  /** Available items */
  source: TransferListItem[];
  /** Selected items */
  target: TransferListItem[];
  /** Change handler */
  onChange: (source: TransferListItem[], target: TransferListItem[]) => void;
  /** Source list title */
  sourceTitle?: string;
  /** Target list title */
  targetTitle?: string;
  /** Enable search */
  searchable?: boolean;
  /** Source search placeholder */
  sourceSearchPlaceholder?: string;
  /** Target search placeholder */
  targetSearchPlaceholder?: string;
  /** List height */
  height?: number;
  /** Disabled state */
  disabled?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * TransferList Component
 *
 * Dual-list component for moving items between available and selected.
 * Supports search, bulk operations, and individual item transfer.
 *
 * @example
 * ```tsx
 * <TransferList
 *   source={availableUsers}
 *   target={selectedUsers}
 *   onChange={(source, target) => {
 *     setAvailableUsers(source);
 *     setSelectedUsers(target);
 *   }}
 *   sourceTitle="Available Users"
 *   targetTitle="Selected Users"
 *   searchable
 * />
 * ```
 */
export const TransferList: React.FC<TransferListProps> = ({
  source,
  target,
  onChange,
  sourceTitle = 'Available',
  targetTitle = 'Selected',
  searchable = true,
  sourceSearchPlaceholder = 'Search available...',
  targetSearchPlaceholder = 'Search selected...',
  height = 300,
  disabled = false,
  className,
}) => {
  const [sourceSearch, setSourceSearch] = useState('');
  const [targetSearch, setTargetSearch] = useState('');
  const [sourceSelected, setSourceSelected] = useState<Set<string>>(new Set());
  const [targetSelected, setTargetSelected] = useState<Set<string>>(new Set());

  // Filter items based on search
  const filteredSource = searchable
    ? source.filter(item =>
        item.label.toLowerCase().includes(sourceSearch.toLowerCase())
      )
    : source;

  const filteredTarget = searchable
    ? target.filter(item =>
        item.label.toLowerCase().includes(targetSearch.toLowerCase())
      )
    : target;

  // Toggle item selection
  const toggleSourceSelection = useCallback((id: string) => {
    setSourceSelected(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const toggleTargetSelection = useCallback((id: string) => {
    setTargetSelected(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  // Move selected items to target
  const moveToTarget = useCallback(() => {
    const itemsToMove = source.filter(item => sourceSelected.has(item.id));
    const newSource = source.filter(item => !sourceSelected.has(item.id));
    const newTarget = [...target, ...itemsToMove];
    onChange(newSource, newTarget);
    setSourceSelected(new Set());
  }, [source, target, sourceSelected, onChange]);

  // Move selected items to source
  const moveToSource = useCallback(() => {
    const itemsToMove = target.filter(item => targetSelected.has(item.id));
    const newTarget = target.filter(item => !targetSelected.has(item.id));
    const newSource = [...source, ...itemsToMove];
    onChange(newSource, newTarget);
    setTargetSelected(new Set());
  }, [source, target, targetSelected, onChange]);

  // Move all items
  const moveAllToTarget = useCallback(() => {
    onChange([], [...target, ...source]);
    setSourceSelected(new Set());
  }, [source, target, onChange]);

  const moveAllToSource = useCallback(() => {
    onChange([...source, ...target], []);
    setTargetSelected(new Set());
  }, [source, target, onChange]);

  // Render list panel
  const renderList = (
    items: TransferListItem[],
    title: string,
    selected: Set<string>,
    onToggle: (id: string) => void,
    searchValue: string,
    onSearchChange: (value: string) => void,
    searchPlaceholder: string
  ) => (
    <View className='flex-1 border border-border rounded-md bg-background'>
      {/* Header */}
      <View className='px-3 py-2 border-b border-border bg-card'>
        <Text className='text-sm font-semibold text-foreground'>{title}</Text>
        <Text className='text-xs text-muted-foreground'>
          {items.length} item{items.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {/* Search */}
      {searchable && (
        <View className='p-2 border-b border-border'>
          <TextInput
            value={searchValue}
            onChangeText={onSearchChange}
            placeholder={searchPlaceholder}
            placeholderTextColor={colors.raw.neutral[400]}
            className='px-3 py-2 text-sm bg-card text-foreground border border-border rounded-md'
          />
        </View>
      )}

      {/* List */}
      <ScrollView style={{ height: searchable ? height - 120 : height - 60 }}>
        {items.length === 0 ? (
          <View className='flex-1 items-center justify-center py-8'>
            <Text className='text-sm text-muted-foreground'>No items</Text>
          </View>
        ) : (
          items.map(item => {
            const isSelected = selected.has(item.id);

            return (
              <Pressable
                key={item.id}
                onPress={() => !item.disabled && !disabled && onToggle(item.id)}
                disabled={item.disabled || disabled}
                className={cn(
                  'mx-2 my-1 px-3 py-2 rounded-md',
                  'active:bg-muted',
                  (item.disabled || disabled) && 'opacity-50',
                  isSelected && 'bg-primary/10 border border-primary/20 '
                )}
                accessibilityRole='checkbox'
                accessibilityState={{
                  checked: isSelected,
                  disabled: item.disabled || disabled,
                }}
              >
                <View className='flex-row items-start gap-2'>
                  {/* Checkbox */}
                  <View
                    className={cn(
                      'w-4 h-4 border-2 rounded items-center justify-center mt-0.5',
                      isSelected
                        ? 'bg-primary border-primary dark:bg-primary dark:border-primary'
                        : 'border-border'
                    )}
                  >
                    {isSelected && (
                      <Text className='text-white text-xs'>✓</Text>
                    )}
                  </View>

                  {/* Content */}
                  <View className='flex-1'>
                    <Text className='text-sm font-medium text-foreground'>
                      {item.label}
                    </Text>
                    {item.description && (
                      <Text className='text-xs text-muted-foreground'>
                        {item.description}
                      </Text>
                    )}
                  </View>
                </View>
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </View>
  );

  return (
    <View className={cn('flex-row gap-4', className)}>
      {/* Source list */}
      {renderList(
        filteredSource,
        sourceTitle,
        sourceSelected,
        toggleSourceSelection,
        sourceSearch,
        setSourceSearch,
        sourceSearchPlaceholder
      )}

      {/* Transfer buttons */}
      <View className='justify-center gap-2'>
        <Pressable
          onPress={moveAllToTarget}
          disabled={disabled || source.length === 0}
          className={cn(
            'px-3 py-2 bg-background',
            'border border-border',
            'rounded-md',
            'active:bg-muted',
            (disabled || source.length === 0) && 'opacity-50'
          )}
          accessibilityRole='button'
          accessibilityLabel='Move all to selected'
        >
          <Text className='text-muted-foreground'>»</Text>
        </Pressable>

        <Pressable
          onPress={moveToTarget}
          disabled={disabled || sourceSelected.size === 0}
          className={cn(
            'px-3 py-2 bg-background',
            'border border-border',
            'rounded-md',
            'active:bg-muted',
            (disabled || sourceSelected.size === 0) && 'opacity-50'
          )}
          accessibilityRole='button'
          accessibilityLabel='Move selected to target'
        >
          <Text className='text-muted-foreground'>›</Text>
        </Pressable>

        <Pressable
          onPress={moveToSource}
          disabled={disabled || targetSelected.size === 0}
          className={cn(
            'px-3 py-2 bg-background',
            'border border-border',
            'rounded-md',
            'active:bg-muted',
            (disabled || targetSelected.size === 0) && 'opacity-50'
          )}
          accessibilityRole='button'
          accessibilityLabel='Move selected to source'
        >
          <Text className='text-muted-foreground'>‹</Text>
        </Pressable>

        <Pressable
          onPress={moveAllToSource}
          disabled={disabled || target.length === 0}
          className={cn(
            'px-3 py-2 bg-background',
            'border border-border',
            'rounded-md',
            'active:bg-muted',
            (disabled || target.length === 0) && 'opacity-50'
          )}
          accessibilityRole='button'
          accessibilityLabel='Move all to available'
        >
          <Text className='text-muted-foreground'>«</Text>
        </Pressable>
      </View>

      {/* Target list */}
      {renderList(
        filteredTarget,
        targetTitle,
        targetSelected,
        toggleTargetSelection,
        targetSearch,
        setTargetSearch,
        targetSearchPlaceholder
      )}
    </View>
  );
};
