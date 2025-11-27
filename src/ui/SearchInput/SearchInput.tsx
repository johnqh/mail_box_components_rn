import * as React from 'react';
import { useState, useCallback } from 'react';
import {
  View,
  TextInput,
  Pressable,
  Text,
  ActivityIndicator,
  TextInputProps,
} from 'react-native';
import { cn } from '../../lib/utils';

export interface SearchInputProps extends Omit<TextInputProps, 'onChange'> {
  /** Current search query */
  value?: string;
  /** Callback when query changes */
  onChangeText?: (query: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Auto-focus on mount */
  autoFocus?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Show search icon */
  showIcon?: boolean;
  /** Show clear button when has value */
  showClear?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * SearchInput Component
 *
 * Search input field with icon, clear button, and loading state.
 *
 * @example
 * ```tsx
 * <SearchInput
 *   placeholder="Search emails..."
 *   onChangeText={query => setSearchQuery(query)}
 * />
 * ```
 */
export const SearchInput: React.FC<SearchInputProps> = ({
  value: controlledValue,
  onChangeText,
  placeholder = 'Search...',
  autoFocus = false,
  disabled = false,
  size = 'md',
  showIcon = true,
  showClear = true,
  loading = false,
  className,
  ...textInputProps
}) => {
  const [internalValue, setInternalValue] = useState('');

  // Use controlled value if provided, otherwise use internal state
  const value = controlledValue !== undefined ? controlledValue : internalValue;
  const isControlled = controlledValue !== undefined;

  // Size configurations
  const sizeClasses = {
    sm: {
      input: 'py-1.5 text-sm',
      icon: 'text-base',
      paddingLeft: showIcon ? 'pl-8' : 'pl-3',
      paddingRight: 'pr-8',
    },
    md: {
      input: 'py-2 text-base',
      icon: 'text-lg',
      paddingLeft: showIcon ? 'pl-10' : 'pl-3',
      paddingRight: 'pr-10',
    },
    lg: {
      input: 'py-3 text-lg',
      icon: 'text-xl',
      paddingLeft: showIcon ? 'pl-12' : 'pl-4',
      paddingRight: 'pr-12',
    },
  };

  const sizeConfig = sizeClasses[size];

  const handleChange = useCallback(
    (newValue: string) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onChangeText?.(newValue);
    },
    [onChangeText, isControlled]
  );

  const handleClear = useCallback(() => {
    if (!isControlled) {
      setInternalValue('');
    }
    onChangeText?.('');
  }, [onChangeText, isControlled]);

  return (
    <View className={cn('relative w-full', className)}>
      {/* Search Icon */}
      {showIcon && (
        <View className='absolute inset-y-0 left-0 flex items-center justify-center pl-3 z-10'>
          <Text
            className={cn(sizeConfig.icon, 'text-gray-400 dark:text-gray-500')}
          >
            🔍
          </Text>
        </View>
      )}

      {/* Input */}
      <TextInput
        value={value}
        onChangeText={handleChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        editable={!disabled && !loading}
        className={cn(
          'w-full rounded-lg border',
          'bg-white dark:bg-gray-800',
          'text-gray-900 dark:text-gray-100',
          'border-gray-300 dark:border-gray-600',
          sizeConfig.input,
          sizeConfig.paddingLeft,
          sizeConfig.paddingRight,
          disabled && 'opacity-50',
          loading && 'opacity-60'
        )}
        placeholderTextColor='#9CA3AF'
        accessibilityRole='search'
        accessibilityState={{ disabled }}
        {...textInputProps}
      />

      {/* Clear Button or Loading Spinner */}
      {showClear && value && !loading && (
        <Pressable
          onPress={handleClear}
          disabled={disabled}
          className='absolute inset-y-0 right-0 flex items-center justify-center pr-3'
          accessibilityRole='button'
          accessibilityLabel='Clear search'
        >
          <Text className={cn(sizeConfig.icon, 'text-gray-400')}>✕</Text>
        </Pressable>
      )}

      {/* Loading Spinner */}
      {loading && (
        <View className='absolute inset-y-0 right-0 flex items-center justify-center pr-3'>
          <ActivityIndicator size='small' color='#9CA3AF' />
        </View>
      )}
    </View>
  );
};
