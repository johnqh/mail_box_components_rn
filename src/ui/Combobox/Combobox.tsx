import * as React from 'react';
import { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { cn } from '../../lib/utils';

export interface ComboboxOption {
  /** Option value */
  value: string;
  /** Option label */
  label: string;
  /** Disabled state */
  disabled?: boolean;
}

export interface ComboboxProps {
  /** Available options */
  options: ComboboxOption[];
  /** Selected value */
  value?: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Search placeholder */
  searchPlaceholder?: string;
  /** Empty state message */
  emptyMessage?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * Combobox Component
 *
 * Searchable select dropdown.
 * Combines input and select functionality.
 *
 * @example
 * ```tsx
 * <Combobox
 *   options={[
 *     { value: 'apple', label: 'Apple' },
 *     { value: 'banana', label: 'Banana' },
 *     { value: 'orange', label: 'Orange' }
 *   ]}
 *   value={selectedFruit}
 *   onChange={setSelectedFruit}
 *   placeholder="Select a fruit..."
 * />
 * ```
 */
export const Combobox: React.FC<ComboboxProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select option...',
  searchPlaceholder = 'Search...',
  emptyMessage = 'No results found.',
  disabled = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter options based on search query
  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get selected option label
  const selectedOption = options.find(opt => opt.value === value);

  const handleSelect = useCallback(
    (optionValue: string, optionDisabled?: boolean) => {
      if (optionDisabled) return;
      onChange(optionValue);
      setIsOpen(false);
      setSearchQuery('');
    },
    [onChange]
  );

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setSearchQuery('');
  }, []);

  return (
    <View className={cn('w-full', className)}>
      {/* Trigger Button */}
      <Pressable
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        className={cn(
          'flex-row items-center justify-between px-3 py-2',
          'bg-white dark:bg-gray-900',
          'border border-gray-300 dark:border-gray-700',
          'rounded-md',
          disabled && 'opacity-50'
        )}
        accessibilityRole='button'
        accessibilityLabel={placeholder}
        accessibilityState={{ disabled, expanded: isOpen }}
      >
        <Text
          className={cn(
            'flex-1 text-sm',
            selectedOption
              ? 'text-gray-900 dark:text-white'
              : 'text-gray-500 dark:text-gray-400'
          )}
          numberOfLines={1}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Text className='text-gray-600 dark:text-gray-400 ml-2'>▼</Text>
      </Pressable>

      {/* Dropdown Modal */}
      <Modal
        visible={isOpen}
        transparent
        animationType='fade'
        onRequestClose={handleClose}
      >
        <TouchableWithoutFeedback onPress={handleClose}>
          <View className='flex-1 justify-center px-4 bg-black/50'>
            <TouchableWithoutFeedback>
              <View className='bg-white dark:bg-gray-900 rounded-lg max-h-[70%] shadow-xl'>
                {/* Search Input */}
                <View className='p-3 border-b border-gray-200 dark:border-gray-700'>
                  <TextInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder={searchPlaceholder}
                    placeholderTextColor='#9ca3af'
                    autoFocus
                    className='px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-md'
                  />
                </View>

                {/* Options List */}
                <ScrollView className='max-h-80'>
                  {filteredOptions.length === 0 ? (
                    <View className='px-3 py-4 items-center'>
                      <Text className='text-sm text-gray-500 dark:text-gray-400'>
                        {emptyMessage}
                      </Text>
                    </View>
                  ) : (
                    filteredOptions.map(option => (
                      <Pressable
                        key={option.value}
                        onPress={() =>
                          handleSelect(option.value, option.disabled)
                        }
                        disabled={option.disabled}
                        className={cn(
                          'px-4 py-3',
                          'active:bg-gray-100 dark:active:bg-gray-800',
                          option.disabled && 'opacity-50',
                          option.value === value &&
                            'bg-blue-50 dark:bg-blue-900/30'
                        )}
                        accessibilityRole='button'
                        accessibilityState={{
                          selected: option.value === value,
                          disabled: option.disabled,
                        }}
                      >
                        <Text
                          className={cn(
                            'text-sm',
                            option.value === value
                              ? 'text-blue-700 dark:text-blue-300 font-medium'
                              : 'text-gray-900 dark:text-white'
                          )}
                        >
                          {option.label}
                        </Text>
                      </Pressable>
                    ))
                  )}
                </ScrollView>

                {/* Close button */}
                <View className='p-3 border-t border-gray-200 dark:border-gray-700'>
                  <Pressable
                    onPress={handleClose}
                    className='items-center py-2'
                    accessibilityRole='button'
                    accessibilityLabel='Close'
                  >
                    <Text className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                      Cancel
                    </Text>
                  </Pressable>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};
