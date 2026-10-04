import * as React from 'react';
import { useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { ModalHost } from '../ModalHost';
import { cn } from '../../lib/utils';
import { selectTriggerLabelStyle } from '../../lib/select-trigger';
import { textInputDefaults } from '../../lib/text-input';
import { pressProps } from '../../lib/a11y';

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
        {...pressProps(() => !disabled && setIsOpen(true), disabled)}
        disabled={disabled}
        className={cn(
          'flex-row items-center justify-between px-3 py-2',
          'bg-background',
          'border border-border',
          'rounded-md',
          disabled && 'opacity-50'
        )}
        accessibilityRole='button'
        accessibilityLabel={placeholder}
        accessibilityState={{ disabled, expanded: isOpen }}
      >
        <Text
          className={cn(
            'text-sm',
            selectedOption ? 'text-foreground' : 'text-muted-foreground'
          )}
          numberOfLines={1}
          /*
            Was `flex-1`, which NativeWind emits as `flex: 1` — a flex-basis of
            zero. See `lib/select-trigger.ts`. The `w-full` wrapper usually
            spares this trigger the worst of it, but the row is the same shape
            as the ones where it bit, and one picker measuring differently from
            the rest is how the next report of this starts.
          */
          style={selectTriggerLabelStyle}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Text className='text-muted-foreground ml-2'>▼</Text>
      </Pressable>

      {/* Dropdown Modal */}
      <ModalHost
        visible={isOpen}
        animationType='fade'
        onRequestClose={handleClose}
      >
        <TouchableWithoutFeedback {...pressProps(handleClose)}>
          <View className='flex-1 justify-center px-4 bg-black/50'>
            <TouchableWithoutFeedback>
              <View className='bg-background rounded-lg max-h-[70%] shadow-xl'>
                {/* Search Input */}
                <View className='p-3 border-b border-border'>
                  <TextInput
                    {...textInputDefaults}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder={searchPlaceholder}
                    autoFocus
                    className='px-3 py-2 text-sm bg-card text-foreground rounded-md placeholder:text-muted-foreground'
                  />
                </View>

                {/* Options List */}
                <ScrollView className='max-h-80'>
                  {filteredOptions.length === 0 ? (
                    <View className='px-3 py-4 items-center'>
                      <Text className='text-sm text-muted-foreground'>
                        {emptyMessage}
                      </Text>
                    </View>
                  ) : (
                    filteredOptions.map(option => (
                      <Pressable
                        key={option.value}
                        {...pressProps(
                          () => handleSelect(option.value, option.disabled),
                          option.disabled
                        )}
                        disabled={option.disabled}
                        className={cn(
                          'px-4 py-3',
                          'active:bg-muted',
                          option.disabled && 'opacity-50',
                          option.value === value && 'bg-primary/10'
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
                              ? 'text-primary font-medium'
                              : 'text-foreground'
                          )}
                        >
                          {option.label}
                        </Text>
                      </Pressable>
                    ))
                  )}
                </ScrollView>

                {/* Close button */}
                <View className='p-3 border-t border-border'>
                  <Pressable
                    {...pressProps(handleClose)}
                    className='items-center py-2'
                    accessibilityRole='button'
                    accessibilityLabel='Close'
                  >
                    <Text className='text-sm font-medium text-muted-foreground'>
                      Cancel
                    </Text>
                  </Pressable>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </ModalHost>
    </View>
  );
};
