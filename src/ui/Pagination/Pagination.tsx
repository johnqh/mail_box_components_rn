import * as React from 'react';
import { View, Text, Pressable } from 'react-native';
import { cn } from '../../lib/utils';

export interface PaginationProps {
  /** Current page number (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Page change handler */
  onPageChange: (page: number) => void;
  /** Number of page buttons to show on each side */
  siblingCount?: number;
  /** Show first/last buttons */
  showFirstLast?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Previous icon */
  prevIcon?: React.ReactNode;
  /** Next icon */
  nextIcon?: React.ReactNode;
  /** Additional className */
  className?: string;
}

/**
 * Pagination Component
 *
 * Flexible pagination controls with page numbers and navigation buttons.
 * Automatically handles ellipsis for large page counts.
 *
 * @example
 * ```tsx
 * <Pagination
 *   currentPage={3}
 *   totalPages={10}
 *   onPageChange={setPage}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <Pagination
 *   currentPage={currentPage}
 *   totalPages={totalPages}
 *   onPageChange={handlePageChange}
 *   siblingCount={2}
 *   showFirstLast
 *   size="lg"
 * />
 * ```
 */
export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  showFirstLast = false,
  size = 'md',
  prevIcon,
  nextIcon,
  className,
}) => {
  // Size configurations
  const sizeConfig = {
    sm: {
      button: 'h-8 w-8',
      text: 'text-xs',
      icon: 'text-xs',
    },
    md: {
      button: 'h-10 w-10',
      text: 'text-sm',
      icon: 'text-sm',
    },
    lg: {
      button: 'h-12 w-12',
      text: 'text-base',
      icon: 'text-base',
    },
  };

  const config = sizeConfig[size];

  // Generate page numbers to display
  const generatePageNumbers = (): (number | 'ellipsis')[] => {
    const pages: (number | 'ellipsis')[] = [];

    // Always show first page
    pages.push(1);

    // Calculate range around current page
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 2);
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPages - 1
    );

    // Add left ellipsis if needed
    if (leftSiblingIndex > 2) {
      pages.push('ellipsis');
    }

    // Add pages around current page
    for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
      pages.push(i);
    }

    // Add right ellipsis if needed
    if (rightSiblingIndex < totalPages - 1) {
      pages.push('ellipsis');
    }

    // Always show last page (if more than 1 page)
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = generatePageNumbers();

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handleFirst = () => {
    onPageChange(1);
  };

  const handleLast = () => {
    onPageChange(totalPages);
  };

  const buttonBaseClasses = cn(
    'items-center justify-center rounded-md border border-gray-300 dark:border-gray-600'
  );

  const pageButtonClasses = (isActive: boolean) =>
    cn(
      buttonBaseClasses,
      config.button,
      isActive
        ? 'bg-blue-600 dark:bg-blue-500 border-blue-600 dark:border-blue-500'
        : 'bg-white dark:bg-gray-800'
    );

  const navButtonClasses = (disabled: boolean) =>
    cn(
      buttonBaseClasses,
      config.button,
      'bg-white dark:bg-gray-800',
      disabled && 'opacity-50'
    );

  return (
    <View
      className={cn('flex-row items-center gap-1', className)}
      accessibilityRole='none'
      accessibilityLabel='Pagination'
    >
      {/* First button */}
      {showFirstLast && (
        <Pressable
          onPress={handleFirst}
          disabled={currentPage === 1}
          className={navButtonClasses(currentPage === 1)}
          accessibilityRole='button'
          accessibilityLabel='Go to first page'
          accessibilityState={{ disabled: currentPage === 1 }}
        >
          <Text className={cn(config.text, 'text-gray-700 dark:text-gray-300')}>
            First
          </Text>
        </Pressable>
      )}

      {/* Previous button */}
      <Pressable
        onPress={handlePrevious}
        disabled={currentPage === 1}
        className={navButtonClasses(currentPage === 1)}
        accessibilityRole='button'
        accessibilityLabel='Go to previous page'
        accessibilityState={{ disabled: currentPage === 1 }}
      >
        {prevIcon || (
          <Text className={cn(config.icon, 'text-gray-700 dark:text-gray-300')}>
            ‹
          </Text>
        )}
      </Pressable>

      {/* Page numbers */}
      {pages.map((page, index) => {
        if (page === 'ellipsis') {
          return (
            <View
              key={`ellipsis-${index}`}
              className={cn('items-center justify-center', config.button)}
            >
              <Text className='text-gray-400 dark:text-gray-500'>...</Text>
            </View>
          );
        }

        const isActive = page === currentPage;
        return (
          <Pressable
            key={page}
            onPress={() => onPageChange(page)}
            className={pageButtonClasses(isActive)}
            accessibilityRole='button'
            accessibilityLabel={`Go to page ${page}`}
            accessibilityState={{ selected: isActive }}
          >
            <Text
              className={cn(
                config.text,
                isActive ? 'text-white' : 'text-gray-700 dark:text-gray-300'
              )}
            >
              {page}
            </Text>
          </Pressable>
        );
      })}

      {/* Next button */}
      <Pressable
        onPress={handleNext}
        disabled={currentPage === totalPages}
        className={navButtonClasses(currentPage === totalPages)}
        accessibilityRole='button'
        accessibilityLabel='Go to next page'
        accessibilityState={{ disabled: currentPage === totalPages }}
      >
        {nextIcon || (
          <Text className={cn(config.icon, 'text-gray-700 dark:text-gray-300')}>
            ›
          </Text>
        )}
      </Pressable>

      {/* Last button */}
      {showFirstLast && (
        <Pressable
          onPress={handleLast}
          disabled={currentPage === totalPages}
          className={navButtonClasses(currentPage === totalPages)}
          accessibilityRole='button'
          accessibilityLabel='Go to last page'
          accessibilityState={{ disabled: currentPage === totalPages }}
        >
          <Text className={cn(config.text, 'text-gray-700 dark:text-gray-300')}>
            Last
          </Text>
        </Pressable>
      )}
    </View>
  );
};
