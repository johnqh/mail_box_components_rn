import * as React from 'react';
import { useState, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { cn } from '../../lib/utils';
import { colors } from '@sudobility/design';

export interface MultiSelectOption {
  /** Option value */
  value: string;
  /** Option label */
  label: string;
  /** Disabled state */
  disabled?: boolean;
}

export interface MultiSelectProps {
  /** Available options */
  options: MultiSelectOption[];
  /** Selected values */
  value: string[];
  /** Change handler */
  onChange: (values: string[]) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Search placeholder */
  searchPlaceholder?: string;
  /** Enable search */
  searchable?: boolean;
  /** Max selected items to show */
  maxDisplay?: number;
  /** Disabled state */
  disabled?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * MultiSelect Component
 *
 * Multi-select dropdown with search and tags.
 * Shows selected items as removable tags.
 *
 * @example
 * ```tsx
 * <MultiSelect
 *   options={categories}
 *   value={selectedCategories}
 *   onChange={setSelectedCategories}
 *   placeholder="Select categories"
 *   searchable
 * />
 * ```
 */
export const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select items...',
  searchPlaceholder = 'Search...',
  searchable = true,
  maxDisplay = 3,
  disabled = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter options based on search
  const filteredOptions = searchable
    ? options.filter(opt =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  // Get selected option labels
  const selectedOptions = options.filter(opt => value.includes(opt.value));

  // Handle option toggle
  const toggleOption = useCallback(
    (optionValue: string) => {
      if (value.includes(optionValue)) {
        onChange(value.filter(v => v !== optionValue));
      } else {
        onChange([...value, optionValue]);
      }
    },
    [value, onChange]
  );

  // Remove selected item
  const removeItem = useCallback(
    (optionValue: string) => {
      onChange(value.filter(v => v !== optionValue));
    },
    [value, onChange]
  );

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setSearchQuery('');
  }, []);

  const displayedCount = selectedOptions.length;
  const hiddenCount =
    displayedCount > maxDisplay ? displayedCount - maxDisplay : 0;

  return (
    <View className={cn('w-full', className)}>
      {/* Trigger */}
      <Pressable
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        className={cn(
          'min-h-[44px] px-3 py-2',
          'bg-background',
          'border border-border',
          'rounded-md',
          disabled && 'opacity-50'
        )}
        accessibilityRole='button'
        accessibilityLabel={placeholder}
        accessibilityState={{ disabled, expanded: isOpen }}
      >
        <View className='flex-row flex-wrap gap-1.5'>
          {selectedOptions.length === 0 ? (
            <Text className='text-sm text-muted-foreground py-0.5'>
              {placeholder}
            </Text>
          ) : (
            <>
              {selectedOptions.slice(0, maxDisplay).map(opt => (
                <View
                  key={opt.value}
                  className='flex-row items-center gap-1 px-2 py-0.5 bg-primary/10 rounded'
                >
                  <Text className='text-xs font-medium text-primary'>
                    {opt.label}
                  </Text>
                  <Pressable
                    onPress={() => removeItem(opt.value)}
                    hitSlop={8}
                    accessibilityRole='button'
                    accessibilityLabel={`Remove ${opt.label}`}
                  >
                    <Text className='text-primary'>×</Text>
                  </Pressable>
                </View>
              ))}
              {hiddenCount > 0 && (
                <View className='px-2 py-0.5 bg-muted rounded'>
                  <Text className='text-xs font-medium text-muted-foreground'>
                    +{hiddenCount} more
                  </Text>
                </View>
              )}
            </>
          )}
        </View>
      </Pressable>

      {/* Dropdown Modal */}
      <Modal
        visible={isOpen}
        transparent
        animationType='fade'
        onRequestClose={handleClose}
      >
        <TouchableWithoutFeedback onPress={handleClose}>
          <View className='flex-1 justify-end bg-black/50'>
            <TouchableWithoutFeedback>
              <View className='bg-background rounded-t-xl max-h-[70%]'>
                {/* Search */}
                {searchable && (
                  <View className='p-3 border-b border-border'>
                    <TextInput
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      placeholder={searchPlaceholder}
                      placeholderTextColor={colors.raw.neutral[400]}
                      className='px-3 py-2 text-sm bg-card text-foreground rounded-md'
                    />
                  </View>
                )}

                {/* Options */}
                <ScrollView className='max-h-80'>
                  {filteredOptions.length === 0 ? (
                    <View className='px-3 py-4 items-center'>
                      <Text className='text-sm text-muted-foreground'>
                        No options found
                      </Text>
                    </View>
                  ) : (
                    filteredOptions.map(option => {
                      const isSelected = value.includes(option.value);

                      return (
                        <Pressable
                          key={option.value}
                          onPress={() =>
                            !option.disabled && toggleOption(option.value)
                          }
                          disabled={option.disabled}
                          className={cn(
                            'flex-row items-center gap-3 px-4 py-3',
                            'active:bg-muted',
                            option.disabled && 'opacity-50'
                          )}
                          accessibilityRole='checkbox'
                          accessibilityState={{
                            checked: isSelected,
                            disabled: option.disabled,
                          }}
                        >
                          {/* Checkbox */}
                          <View
                            className={cn(
                              'w-5 h-5 border-2 rounded items-center justify-center',
                              isSelected
                                ? 'bg-primary border-primary dark:bg-primary dark:border-primary'
                                : 'border-border'
                            )}
                          >
                            {isSelected && (
                              <Text className='text-xs text-white font-bold'>
                                ✓
                              </Text>
                            )}
                          </View>

                          {/* Label */}
                          <Text className='flex-1 text-sm text-foreground'>
                            {option.label}
                          </Text>
                        </Pressable>
                      );
                    })
                  )}
                </ScrollView>

                {/* Footer */}
                <View className='p-3 border-t border-border flex-row justify-between items-center'>
                  <Text className='text-xs text-muted-foreground'>
                    {value.length} selected
                  </Text>
                  <View className='flex-row gap-3'>
                    {value.length > 0 && (
                      <Pressable
                        onPress={() => onChange([])}
                        accessibilityRole='button'
                        accessibilityLabel='Clear all'
                      >
                        <Text className='text-sm text-primary'>Clear all</Text>
                      </Pressable>
                    )}
                    <Pressable
                      onPress={handleClose}
                      accessibilityRole='button'
                      accessibilityLabel='Done'
                    >
                      <Text className='text-sm font-medium text-primary'>
                        Done
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};
