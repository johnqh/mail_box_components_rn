import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { cn } from '../../lib/utils';

export interface CommandItem {
  /** Item ID */
  id: string;
  /** Item label */
  label: string;
  /** Item icon */
  icon?: React.ReactNode;
  /** Action handler */
  onSelect: () => void;
  /** Group/category */
  group?: string;
  /** Keyboard shortcut display */
  shortcut?: string;
  /** Keywords for search */
  keywords?: string[];
}

export interface CommandProps {
  /** Whether command palette is open */
  isOpen: boolean;
  /** Close handler */
  onClose: () => void;
  /** Available command items */
  items: CommandItem[];
  /** Placeholder text */
  placeholder?: string;
  /** Empty state message */
  emptyMessage?: string;
  /** Additional className */
  className?: string;
}

/**
 * Command Component
 *
 * Command palette for quick actions and navigation in React Native.
 * Searchable interface with grouping support.
 *
 * @example
 * ```tsx
 * <Command
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   items={[
 *     { id: 'new', label: 'New File', icon: <PlusIcon />, onSelect: handleNew },
 *     { id: 'open', label: 'Open File', icon: <FolderIcon />, onSelect: handleOpen }
 *   ]}
 *   placeholder="Type a command or search..."
 * />
 * ```
 */
export const Command: React.FC<CommandProps> = ({
  isOpen,
  onClose,
  items,
  placeholder = 'Type a command or search...',
  emptyMessage = 'No results found.',
  className,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<TextInput>(null);

  // Filter items based on search query
  const filteredItems = items.filter(item => {
    const query = searchQuery.toLowerCase();
    return (
      item.label.toLowerCase().includes(query) ||
      item.keywords?.some(keyword => keyword.toLowerCase().includes(query)) ||
      item.group?.toLowerCase().includes(query)
    );
  });

  // Group items
  const groupedItems = filteredItems.reduce(
    (groups, item) => {
      const group = item.group || 'Commands';
      if (!groups[group]) {
        groups[group] = [];
      }
      groups[group].push(item);
      return groups;
    },
    {} as Record<string, CommandItem[]>
  );

  // Reset state when closing
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Focus input when opening
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Reset selected index when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  const handleSelect = (item: CommandItem) => {
    item.onSelect();
    onClose();
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType='fade'
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className='flex-1'
      >
        {/* Backdrop */}
        <Pressable
          className='flex-1 bg-black/50 justify-start pt-20'
          onPress={onClose}
        >
          {/* Command Palette */}
          <Pressable
            className={cn(
              'mx-4 bg-white dark:bg-gray-900 rounded-xl overflow-hidden',
              'shadow-xl',
              className
            )}
            onPress={e => e.stopPropagation()}
          >
            {/* Search Input */}
            <View className='border-b border-gray-200 dark:border-gray-700 p-4'>
              <View className='flex-row items-center gap-3'>
                <View className='w-5 h-5 items-center justify-center'>
                  <Text className='text-gray-400'>🔍</Text>
                </View>
                <TextInput
                  ref={inputRef}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  placeholder={placeholder}
                  placeholderTextColor='#9ca3af'
                  className='flex-1 text-gray-900 dark:text-white text-base'
                  autoCapitalize='none'
                  autoCorrect={false}
                  returnKeyType='search'
                />
              </View>
            </View>

            {/* Results */}
            <ScrollView
              className='max-h-96'
              keyboardShouldPersistTaps='handled'
            >
              <View className='p-2'>
                {Object.keys(groupedItems).length === 0 ? (
                  <View className='px-4 py-8'>
                    <Text className='text-sm text-gray-500 dark:text-gray-400 text-center'>
                      {emptyMessage}
                    </Text>
                  </View>
                ) : (
                  Object.entries(groupedItems).map(
                    ([groupName, groupItems]) => (
                      <View key={groupName} className='mb-4'>
                        {/* Group Header */}
                        <Text className='px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
                          {groupName}
                        </Text>

                        {/* Group Items */}
                        <View className='gap-1'>
                          {groupItems.map(item => {
                            const globalIndex = filteredItems.indexOf(item);
                            const isSelected = globalIndex === selectedIndex;

                            return (
                              <Pressable
                                key={item.id}
                                onPress={() => handleSelect(item)}
                                className={cn(
                                  'flex-row items-center gap-3 px-3 py-2 rounded-md',
                                  isSelected
                                    ? 'bg-blue-50 dark:bg-blue-900/30'
                                    : 'active:bg-gray-100 dark:active:bg-gray-800'
                                )}
                                accessibilityRole='button'
                                accessibilityLabel={item.label}
                              >
                                {item.icon && (
                                  <View className='w-4 h-4'>{item.icon}</View>
                                )}
                                <Text
                                  className={cn(
                                    'flex-1 text-sm',
                                    isSelected
                                      ? 'text-blue-700 dark:text-blue-300'
                                      : 'text-gray-900 dark:text-white'
                                  )}
                                  numberOfLines={1}
                                >
                                  {item.label}
                                </Text>
                                {item.shortcut && (
                                  <Text className='text-xs text-gray-500 dark:text-gray-400 font-mono'>
                                    {item.shortcut}
                                  </Text>
                                )}
                              </Pressable>
                            );
                          })}
                        </View>
                      </View>
                    )
                  )
                )}
              </View>
            </ScrollView>

            {/* Footer */}
            <View className='border-t border-gray-200 dark:border-gray-700 px-4 py-2'>
              <Text className='text-xs text-gray-500 dark:text-gray-400 text-center'>
                Tap an item to select
              </Text>
            </View>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
};
