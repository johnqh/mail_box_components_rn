import * as React from 'react';
import { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
  RefreshControl,
} from 'react-native';
import { cn } from '../../lib/utils';

export interface InfiniteScrollProps<T> {
  /** Data items to render */
  data: T[];
  /** Render function for each item */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** Key extractor for list items */
  keyExtractor: (item: T, index: number) => string;
  /** Load more callback */
  onLoadMore: () => void | Promise<void>;
  /** Loading state */
  loading?: boolean;
  /** Has more data */
  hasMore?: boolean;
  /** Pull to refresh handler */
  onRefresh?: () => void | Promise<void>;
  /** Refreshing state */
  refreshing?: boolean;
  /** Loading component */
  loader?: React.ReactNode;
  /** End message component */
  endMessage?: React.ReactNode;
  /** Empty state component */
  emptyComponent?: React.ReactNode;
  /** List header component */
  headerComponent?: React.ReactNode;
  /** Threshold to trigger load more (0-1) */
  threshold?: number;
  /** Horizontal scroll */
  horizontal?: boolean;
  /** Show scroll to top button */
  showScrollTop?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * InfiniteScroll Component
 *
 * FlatList wrapper with infinite scrolling support.
 * Automatically loads more data when approaching the end.
 *
 * @example
 * ```tsx
 * <InfiniteScroll
 *   data={items}
 *   renderItem={(item) => <ItemCard {...item} />}
 *   keyExtractor={(item) => item.id}
 *   onLoadMore={loadMoreItems}
 *   loading={isLoading}
 *   hasMore={hasNextPage}
 * />
 * ```
 */
export function InfiniteScroll<T>({
  data,
  renderItem,
  keyExtractor,
  onLoadMore,
  loading = false,
  hasMore = true,
  onRefresh,
  refreshing = false,
  loader,
  endMessage,
  emptyComponent,
  headerComponent,
  threshold = 0.5,
  horizontal = false,
  showScrollTop = false,
  className,
}: InfiniteScrollProps<T>) {
  const flatListRef = React.useRef<FlatList>(null);
  const [showScrollTopButton, setShowScrollTopButton] = React.useState(false);

  // Handle end reached
  const handleEndReached = useCallback(() => {
    if (!loading && hasMore) {
      onLoadMore();
    }
  }, [loading, hasMore, onLoadMore]);

  // Handle scroll for scroll-to-top button
  const handleScroll = useCallback(
    (event: { nativeEvent: { contentOffset: { y: number } } }) => {
      if (showScrollTop && !horizontal) {
        setShowScrollTopButton(event.nativeEvent.contentOffset.y > 300);
      }
    },
    [showScrollTop, horizontal]
  );

  // Scroll to top
  const scrollToTop = useCallback(() => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);

  // Default empty component
  const defaultEmptyComponent = (
    <View className='flex-1 justify-center items-center py-8'>
      <Text className='text-gray-500 dark:text-gray-400'>No items found</Text>
    </View>
  );

  // Footer component
  const ListFooterComponent = useCallback(() => {
    const footerLoader = (
      <View className='flex-row justify-center items-center py-4'>
        <ActivityIndicator size='small' color='#3b82f6' />
        <Text className='ml-2 text-sm text-gray-600 dark:text-gray-400'>
          Loading...
        </Text>
      </View>
    );

    const footerEndMessage = (
      <View className='flex-row justify-center items-center py-4'>
        <Text className='text-sm text-gray-600 dark:text-gray-400'>
          No more items to load
        </Text>
      </View>
    );

    if (loading) {
      return <>{loader || footerLoader}</>;
    }
    if (!hasMore && data.length > 0) {
      return <>{endMessage || footerEndMessage}</>;
    }
    return null;
  }, [loading, hasMore, data.length, loader, endMessage]);

  return (
    <View className={cn('flex-1', className)}>
      <FlatList
        ref={flatListRef}
        data={data}
        renderItem={({ item, index }: { item: T; index: number }) => (
          <>{renderItem(item, index)}</>
        )}
        keyExtractor={keyExtractor}
        onEndReached={handleEndReached}
        onEndReachedThreshold={threshold}
        horizontal={horizontal}
        showsVerticalScrollIndicator={!horizontal}
        showsHorizontalScrollIndicator={horizontal}
        ListHeaderComponent={headerComponent ? <>{headerComponent}</> : null}
        ListFooterComponent={ListFooterComponent}
        ListEmptyComponent={
          !loading ? <>{emptyComponent || defaultEmptyComponent}</> : null
        }
        onScroll={showScrollTop ? handleScroll : undefined}
        scrollEventThrottle={showScrollTop ? 16 : undefined}
        refreshControl={
          onRefresh ? (
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          ) : undefined
        }
      />

      {/* Scroll to top button */}
      {showScrollTop && showScrollTopButton && (
        <Pressable
          onPress={scrollToTop}
          className={cn(
            'absolute bottom-4 right-4',
            'w-12 h-12 rounded-full',
            'bg-blue-600 dark:bg-blue-500',
            'items-center justify-center',
            'shadow-lg',
            'active:bg-blue-700 dark:active:bg-blue-600'
          )}
          accessibilityRole='button'
          accessibilityLabel='Scroll to top'
        >
          <Text className='text-white text-lg'>↑</Text>
        </Pressable>
      )}
    </View>
  );
}
