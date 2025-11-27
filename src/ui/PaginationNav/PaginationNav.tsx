import * as React from 'react';
import { View, Text, Pressable } from 'react-native';
import { cn } from '../../lib/utils';

export interface PaginationNavProps {
  /** Current page number (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Page change handler */
  onPageChange: (page: number) => void;
  /** Maximum visible page numbers */
  maxVisible?: number;
  /** Additional className */
  className?: string;
}

/**
 * PaginationNav Component
 *
 * Simple pagination navigation for React Native.
 * Shows page numbers with previous/next buttons.
 *
 * @example
 * ```tsx
 * <PaginationNav
 *   currentPage={currentPage}
 *   totalPages={10}
 *   onPageChange={setCurrentPage}
 * />
 * ```
 */
export const PaginationNav: React.FC<PaginationNavProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  maxVisible = 7,
  className,
}) => {
  // Build page numbers array
  const pages: (number | string)[] = [];

  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push('...');

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (currentPage < totalPages - 2) pages.push('...');
    pages.push(totalPages);
  }

  const isPrevDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  return (
    <View className={cn('flex-row items-center gap-1', className)}>
      {/* Previous Button */}
      <Pressable
        onPress={() => !isPrevDisabled && onPageChange(currentPage - 1)}
        disabled={isPrevDisabled}
        className={cn('px-3 py-2 rounded', isPrevDisabled && 'opacity-50')}
        accessibilityRole='button'
        accessibilityLabel='Previous page'
        accessibilityState={{ disabled: isPrevDisabled }}
      >
        <Text className='text-gray-900 dark:text-white'>Previous</Text>
      </Pressable>

      {/* Page Numbers */}
      {pages.map((page, i) =>
        page === '...' ? (
          <Text
            key={`ellipsis-${i}`}
            className='px-3 py-2 text-gray-500 dark:text-gray-400'
          >
            ...
          </Text>
        ) : (
          <Pressable
            key={page}
            onPress={() => onPageChange(page as number)}
            className={cn(
              'px-3 py-2 rounded',
              page === currentPage && 'bg-blue-500'
            )}
            accessibilityRole='button'
            accessibilityLabel={`Page ${page}`}
            accessibilityState={{ selected: page === currentPage }}
          >
            <Text
              className={cn(
                page === currentPage
                  ? 'text-white'
                  : 'text-gray-900 dark:text-white'
              )}
            >
              {page}
            </Text>
          </Pressable>
        )
      )}

      {/* Next Button */}
      <Pressable
        onPress={() => !isNextDisabled && onPageChange(currentPage + 1)}
        disabled={isNextDisabled}
        className={cn('px-3 py-2 rounded', isNextDisabled && 'opacity-50')}
        accessibilityRole='button'
        accessibilityLabel='Next page'
        accessibilityState={{ disabled: isNextDisabled }}
      >
        <Text className='text-gray-900 dark:text-white'>Next</Text>
      </Pressable>
    </View>
  );
};
