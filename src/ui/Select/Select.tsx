import * as React from 'react';
import { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  FlatList,
  SafeAreaView,
  Platform,
  NativeModules,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { cn } from '../../lib/utils';
import { designTokens } from '@sudobility/design';

const { typography } = designTokens;

const isDesktop = Platform.OS === 'macos' || Platform.OS === 'windows';

interface PopupMenuModuleInterface {
  show(
    items: { key: string; label: string; selected?: boolean }[],
    screenX: number,
    screenY: number
  ): Promise<string | null>;
}

const PopupMenuModule = isDesktop
  ? (NativeModules.PopupMenuModule as PopupMenuModuleInterface | undefined)
  : undefined;

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
  const triggerRef = useRef<View>(null);

  const selectedOption = options.find(opt => opt.value === value);

  const handleSelect = useCallback(
    (optionValue: string) => {
      onValueChange?.(optionValue);
      setIsOpen(false);
    },
    [onValueChange]
  );

  const handleDesktopPress = useCallback(async () => {
    if (disabled || !PopupMenuModule || !triggerRef.current) return;
    triggerRef.current.measureInWindow((x, y, _width, height) => {
      const items = options
        .filter(opt => !opt.disabled)
        .map(opt => ({
          key: opt.value,
          label: opt.label,
          selected: opt.value === value,
        }));
      PopupMenuModule!.show(items, x, y + height).then(selected => {
        if (selected) {
          onValueChange?.(selected);
        }
      });
    });
  }, [disabled, options, value, onValueChange]);

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
            typography.size.base,
            item.value === value
              ? `text-blue-600 dark:text-blue-400 ${typography.weight.medium}`
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
      <View ref={triggerRef} collapsable={false}>
        <Pressable
          onPress={
            isDesktop ? handleDesktopPress : () => !disabled && setIsOpen(true)
          }
          disabled={disabled}
          className={cn(
            'bg-white dark:bg-gray-800',
            disabled && 'opacity-50',
            className
          )}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            minHeight: 36,
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderWidth: 1,
            borderColor: '#d1d5db',
            borderRadius: 6,
          }}
          accessibilityRole='combobox'
          accessibilityState={{ disabled, expanded: isOpen }}
        >
          <Text
            className={cn(
              typography.size.base,
              selectedOption
                ? 'text-gray-900 dark:text-gray-100'
                : 'text-gray-400 dark:text-gray-500'
            )}
            numberOfLines={1}
            style={{ flex: 1 }}
          >
            {selectedOption?.label || placeholder}
          </Text>
          <Svg
            width={16}
            height={16}
            viewBox='0 0 20 20'
            style={{ marginLeft: 8 }}
          >
            <Path
              fillRule='evenodd'
              d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z'
              clipRule='evenodd'
              fill='#6b7280'
            />
          </Svg>
        </Pressable>
      </View>

      {/* Modal Picker — mobile only */}
      {!isDesktop && (
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
                  <Text
                    className={cn(
                      'text-blue-600 dark:text-blue-400',
                      typography.size.base
                    )}
                  >
                    Cancel
                  </Text>
                </Pressable>
                <Text
                  className={cn(
                    typography.size.base,
                    typography.weight.semibold,
                    'text-gray-900 dark:text-white'
                  )}
                >
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
      )}
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
