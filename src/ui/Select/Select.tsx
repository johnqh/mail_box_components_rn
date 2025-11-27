import * as React from 'react';
import { useState, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { cn } from '../../lib/utils';

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps {
  /** Currently selected value */
  value?: string;
  /** Callback when value changes */
  onValueChange?: (value: string) => void;
  /** Options to display */
  options: SelectOption[];
  /** Placeholder text when no value selected */
  placeholder?: string;
  /** Whether the select is disabled */
  disabled?: boolean;
  /** Additional className for the trigger */
  className?: string;
  /** Title for the modal */
  title?: string;
}

/**
 * Select Component
 *
 * Dropdown select component using a modal picker for React Native.
 * Provides a native-feeling selection experience.
 *
 * @example
 * ```tsx
 * <Select
 *   value={selectedValue}
 *   onValueChange={setSelectedValue}
 *   options={[
 *     { label: 'Option 1', value: '1' },
 *     { label: 'Option 2', value: '2' },
 *     { label: 'Option 3', value: '3' },
 *   ]}
 *   placeholder="Select an option..."
 * />
 * ```
 */
export const Select: React.FC<SelectProps> = ({
  value,
  onValueChange,
  options,
  placeholder = 'Select...',
  disabled = false,
  className,
  title = 'Select Option',
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(opt => opt.value === value);

  const handleSelect = useCallback(
    (optionValue: string) => {
      onValueChange?.(optionValue);
      setIsOpen(false);
    },
    [onValueChange]
  );

  const renderOption = ({ item }: { item: SelectOption; index: number }) => (
    <Pressable
      onPress={() => !item.disabled && handleSelect(item.value)}
      disabled={item.disabled}
      className={cn(
        'px-4 py-3 border-b border-gray-200 dark:border-gray-700',
        item.value === value && 'bg-blue-50 dark:bg-blue-900/30',
        item.disabled && 'opacity-50'
      )}
      accessibilityRole='button'
      accessibilityState={{
        selected: item.value === value,
        disabled: item.disabled,
      }}
    >
      <View className='flex flex-row items-center justify-between'>
        <Text
          className={cn(
            'text-base',
            item.value === value
              ? 'text-blue-600 dark:text-blue-400 font-medium'
              : 'text-gray-900 dark:text-gray-100'
          )}
        >
          {item.label}
        </Text>
        {item.value === value && (
          <Text className='text-blue-600 dark:text-blue-400'>✓</Text>
        )}
      </View>
    </Pressable>
  );

  return (
    <>
      {/* Trigger */}
      <Pressable
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        className={cn(
          'flex flex-row items-center justify-between h-11 px-3 py-2 rounded-md border',
          'border-gray-300 dark:border-gray-600',
          'bg-white dark:bg-gray-800',
          disabled && 'opacity-50',
          className
        )}
        accessibilityRole='combobox'
        accessibilityState={{ disabled, expanded: isOpen }}
      >
        <Text
          className={cn(
            'text-base flex-1',
            selectedOption
              ? 'text-gray-900 dark:text-gray-100'
              : 'text-gray-400 dark:text-gray-500'
          )}
          numberOfLines={1}
        >
          {selectedOption?.label || placeholder}
        </Text>
        <Text className='text-gray-400 dark:text-gray-500 ml-2'>▼</Text>
      </Pressable>

      {/* Modal Picker */}
      <Modal
        visible={isOpen}
        animationType='slide'
        transparent
        onRequestClose={() => setIsOpen(false)}
      >
        <View className='flex-1 justify-end bg-black/50'>
          <SafeAreaView className='bg-white dark:bg-gray-800 rounded-t-xl'>
            {/* Header */}
            <View className='flex flex-row items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700'>
              <Pressable onPress={() => setIsOpen(false)}>
                <Text className='text-blue-600 dark:text-blue-400 text-base'>
                  Cancel
                </Text>
              </Pressable>
              <Text className='text-base font-semibold text-gray-900 dark:text-white'>
                {title}
              </Text>
              <View style={{ width: 60 }} />
            </View>

            {/* Options */}
            <FlatList
              data={options}
              renderItem={renderOption}
              keyExtractor={(item: SelectOption) => item.value}
              style={{ maxHeight: 300 }}
            />
          </SafeAreaView>
        </View>
      </Modal>
    </>
  );
};

/**
 * SelectTrigger - For compound component pattern
 */
export const SelectTrigger = Select;

/**
 * SelectValue - Display component for the selected value
 */
export const SelectValue: React.FC<{ placeholder?: string }> = ({
  placeholder = 'Select...',
}) => <Text className='text-gray-400 dark:text-gray-500'>{placeholder}</Text>;
