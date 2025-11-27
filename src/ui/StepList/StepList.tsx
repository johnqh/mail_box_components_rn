import * as React from 'react';
import { View, Text } from 'react-native';
import { cn } from '../../lib/utils';

export interface StepListItem {
  /** Step content */
  content: React.ReactNode;
  /** Sub-items under this step */
  subItems?: React.ReactNode[];
}

export interface StepListProps {
  /** List items (string or StepListItem) */
  items: (string | StepListItem)[];
  /** List type */
  type?: 'ordered' | 'unordered';
  /** Visual variant */
  variant?: 'default' | 'enhanced' | 'minimal';
  /** Additional className */
  className?: string;
  /** Item className */
  itemClassName?: string;
}

/**
 * StepList Component
 *
 * Displays a list of steps with optional numbering and sub-items.
 * Supports ordered/unordered lists with different visual styles.
 *
 * @example
 * ```tsx
 * <StepList
 *   items={[
 *     'First step',
 *     'Second step',
 *     { content: 'Third step', subItems: ['Sub-item A', 'Sub-item B'] }
 *   ]}
 *   type="ordered"
 *   variant="enhanced"
 * />
 * ```
 */
export const StepList: React.FC<StepListProps> = ({
  items,
  type = 'ordered',
  variant = 'default',
  className,
  itemClassName,
}) => {
  const renderStepNumber = (index: number) => {
    if (type === 'ordered') {
      if (variant === 'enhanced') {
        return (
          <View className='w-6 h-6 bg-blue-600 rounded-full items-center justify-center mr-3'>
            <Text className='text-white text-sm font-medium'>{index + 1}</Text>
          </View>
        );
      }
      if (variant === 'minimal') {
        return (
          <View className='w-6 h-6 bg-blue-100 dark:bg-blue-900/20 rounded-full items-center justify-center mr-3'>
            <Text className='text-blue-600 dark:text-blue-400 text-sm font-medium'>
              {index + 1}
            </Text>
          </View>
        );
      }
      return (
        <Text className='text-gray-600 dark:text-gray-400 mr-2'>
          {index + 1}.
        </Text>
      );
    }

    // Unordered
    if (variant === 'minimal') {
      return <View className='w-2 h-2 bg-blue-600 rounded-full mr-3 mt-2' />;
    }
    return <Text className='text-gray-600 dark:text-gray-400 mr-2'>•</Text>;
  };

  const renderItem = (item: string | StepListItem, index: number) => {
    const isStepItem = typeof item === 'object';
    const content = isStepItem ? item.content : item;
    const subItems = isStepItem ? item.subItems : undefined;

    return (
      <View
        key={index}
        className={cn(
          'flex-row',
          variant === 'enhanced' && 'pb-4',
          variant === 'enhanced' &&
            index < items.length - 1 &&
            'border-l-2 border-gray-200 dark:border-gray-700 ml-3 pl-6',
          itemClassName
        )}
      >
        {/* Step indicator */}
        {variant !== 'enhanced' || type === 'unordered' ? (
          renderStepNumber(index)
        ) : (
          <View className='absolute -left-3'>{renderStepNumber(index)}</View>
        )}

        {/* Content */}
        <View className='flex-1'>
          {typeof content === 'string' ? (
            <Text className='text-gray-600 dark:text-gray-400'>{content}</Text>
          ) : (
            content
          )}

          {/* Sub-items */}
          {subItems && subItems.length > 0 && (
            <View className='mt-2 ml-4 gap-1'>
              {subItems.map((subItem, subIndex) => (
                <View key={subIndex} className='flex-row'>
                  <Text className='text-gray-500 dark:text-gray-500 mr-2'>
                    •
                  </Text>
                  {typeof subItem === 'string' ? (
                    <Text className='text-sm text-gray-500 dark:text-gray-500 flex-1'>
                      {subItem}
                    </Text>
                  ) : (
                    subItem
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View
      className={cn(
        variant === 'default' && 'gap-2',
        variant === 'enhanced' && 'gap-0',
        variant === 'minimal' && 'gap-3',
        className
      )}
    >
      {items.map(renderItem)}
    </View>
  );
};
