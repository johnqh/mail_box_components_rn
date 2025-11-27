import * as React from 'react';
import {
  View,
  FlatList,
  ListRenderItemInfo,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { cn } from '../../lib/utils';

export interface VirtualListProps<T> {
  /** List items */
  items: T[];
  /** Item height in pixels (for optimization) */
  itemHeight?: number;
  /** Container height */
  height?: number;
  /** Render item function */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** Item key extractor */
  keyExtractor: (item: T, index: number) => string;
  /** Overscan count (items to render outside viewport) */
  overscan?: number;
  /** Show separator between items */
  showSeparator?: boolean;
  /** Separator style */
  separatorClassName?: string;
  /** Empty list message */
  emptyMessage?: React.ReactNode;
  /** Loading state */
  loading?: boolean;
  /** Pull to refresh handler */
  onRefresh?: () => void;
  /** Refreshing state */
  refreshing?: boolean;
  /** End reached handler */
  onEndReached?: () => void;
  /** End reached threshold (0-1) */
  onEndReachedThreshold?: number;
  /** Horizontal list */
  horizontal?: boolean;
  /** Additional className */
  className?: string;
  /** Content container className */
  contentClassName?: string;
  /** Style prop for height */
  style?: StyleProp<ViewStyle>;
}

/**
 * VirtualList Component
 *
 * Virtualized list for rendering large datasets efficiently.
 * Built on top of React Native's FlatList.
 *
 * @example
 * ```tsx
 * <VirtualList
 *   items={largeDataset}
 *   itemHeight={48}
 *   height={600}
 *   renderItem={(item) => <Text>{item.name}</Text>}
 *   keyExtractor={(item) => item.id}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <VirtualList
 *   items={messages}
 *   itemHeight={80}
 *   renderItem={(msg, index) => <MessageItem message={msg} index={index} />}
 *   keyExtractor={(msg) => msg.id}
 *   onEndReached={loadMore}
 *   onRefresh={refresh}
 *   refreshing={isRefreshing}
 * />
 * ```
 */
export function VirtualList<T>({
  items,
  itemHeight,
  height,
  renderItem,
  keyExtractor,
  overscan = 5,
  showSeparator = false,
  separatorClassName,
  emptyMessage,
  loading = false,
  onRefresh,
  refreshing = false,
  onEndReached,
  onEndReachedThreshold = 0.5,
  horizontal = false,
  className,
  contentClassName,
  style,
}: VirtualListProps<T>) {
  // Render a single item
  const renderItemWrapper = React.useCallback(
    ({ item, index }: ListRenderItemInfo<T>) => {
      return <View>{renderItem(item, index)}</View>;
    },
    [renderItem]
  );

  // Item separator
  const ItemSeparator = React.useCallback(() => {
    if (!showSeparator) return null;
    return (
      <View
        className={cn(
          horizontal ? 'w-px h-full' : 'h-px w-full',
          'bg-gray-200 dark:bg-gray-700',
          separatorClassName
        )}
      />
    );
  }, [showSeparator, horizontal, separatorClassName]);

  // Empty component
  const ListEmpty = React.useCallback(() => {
    if (loading) return null;
    if (emptyMessage) {
      return (
        <View className='flex-1 items-center justify-center p-4'>
          {emptyMessage}
        </View>
      );
    }
    return null;
  }, [loading, emptyMessage]);

  // Get item layout for optimization
  const getItemLayout = React.useMemo(() => {
    if (!itemHeight) return undefined;
    return (_data: T[] | null | undefined, index: number) => ({
      length: itemHeight,
      offset: itemHeight * index,
      index,
    });
  }, [itemHeight]);

  return (
    <View
      className={cn('flex-1', className)}
      style={[height ? { height } : undefined, style]}
    >
      <FlatList
        data={items}
        renderItem={renderItemWrapper}
        keyExtractor={keyExtractor}
        horizontal={horizontal}
        showsVerticalScrollIndicator={!horizontal}
        showsHorizontalScrollIndicator={horizontal}
        ItemSeparatorComponent={showSeparator ? ItemSeparator : undefined}
        ListEmptyComponent={ListEmpty}
        onRefresh={onRefresh}
        refreshing={refreshing}
        onEndReached={onEndReached}
        onEndReachedThreshold={onEndReachedThreshold}
        getItemLayout={getItemLayout}
        windowSize={overscan * 2 + 1}
        maxToRenderPerBatch={overscan * 2}
        initialNumToRender={overscan * 2}
        removeClippedSubviews={true}
        contentContainerStyle={contentClassName ? undefined : undefined}
      />
    </View>
  );
}

export interface VirtualGridProps<T> {
  /** Grid items */
  items: T[];
  /** Number of columns */
  numColumns: number;
  /** Render item function */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** Item key extractor */
  keyExtractor: (item: T, index: number) => string;
  /** Item height for optimization */
  itemHeight?: number;
  /** Gap between items */
  gap?: number;
  /** Empty list message */
  emptyMessage?: React.ReactNode;
  /** Loading state */
  loading?: boolean;
  /** Pull to refresh handler */
  onRefresh?: () => void;
  /** Refreshing state */
  refreshing?: boolean;
  /** End reached handler */
  onEndReached?: () => void;
  /** Additional className */
  className?: string;
}

/**
 * VirtualGrid Component
 *
 * Virtualized grid for rendering large datasets in grid layout.
 *
 * @example
 * ```tsx
 * <VirtualGrid
 *   items={products}
 *   numColumns={2}
 *   renderItem={(product) => <ProductCard product={product} />}
 *   keyExtractor={(product) => product.id}
 *   gap={16}
 * />
 * ```
 */
export function VirtualGrid<T>({
  items,
  numColumns,
  renderItem,
  keyExtractor,
  itemHeight,
  gap = 8,
  emptyMessage,
  loading = false,
  onRefresh,
  refreshing = false,
  onEndReached,
  className,
}: VirtualGridProps<T>) {
  // Render a single item
  const renderItemWrapper = React.useCallback(
    ({ item, index }: ListRenderItemInfo<T>) => {
      return (
        <View style={{ flex: 1, margin: gap / 2 }}>
          {renderItem(item, index)}
        </View>
      );
    },
    [renderItem, gap]
  );

  // Empty component
  const ListEmpty = React.useCallback(() => {
    if (loading) return null;
    if (emptyMessage) {
      return (
        <View className='flex-1 items-center justify-center p-4'>
          {emptyMessage}
        </View>
      );
    }
    return null;
  }, [loading, emptyMessage]);

  // Get item layout for optimization
  const getItemLayout = React.useMemo(() => {
    if (!itemHeight) return undefined;
    return (_data: T[] | null | undefined, index: number) => ({
      length: itemHeight + gap,
      offset: (itemHeight + gap) * Math.floor(index / numColumns),
      index,
    });
  }, [itemHeight, gap, numColumns]);

  return (
    <View className={cn('flex-1', className)}>
      <FlatList
        data={items}
        renderItem={renderItemWrapper}
        keyExtractor={keyExtractor}
        numColumns={numColumns}
        showsVerticalScrollIndicator={true}
        ListEmptyComponent={ListEmpty}
        onRefresh={onRefresh}
        refreshing={refreshing}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        getItemLayout={getItemLayout}
        contentContainerStyle={{ padding: gap / 2 }}
        removeClippedSubviews={true}
      />
    </View>
  );
}
