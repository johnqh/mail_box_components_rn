import * as React from 'react';
import { useState, useCallback } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { cn } from '../../lib/utils';
import { Calendar } from '../Calendar';

export interface DateInputProps {
  /** Current value (ISO date string YYYY-MM-DD or Date object) */
  value: string | Date;
  /** Callback when value changes */
  onChange: (value: string) => void;
  /** Minimum date */
  minDate?: Date;
  /** Maximum date */
  maxDate?: Date;
  /** Disabled state */
  disabled?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional className */
  className?: string;
}

/**
 * DateInput Component
 *
 * Date input field that opens a calendar picker.
 * Displays selected date in a readable format.
 *
 * @example
 * ```tsx
 * <DateInput
 *   value={startDate}
 *   onChange={setStartDate}
 * />
 * ```
 *
 * @example
 * ```tsx
 * <DateInput
 *   value={appointmentDate}
 *   onChange={setAppointmentDate}
 *   minDate={new Date()}
 *   placeholder="Select date"
 * />
 * ```
 */
export const DateInput: React.FC<DateInputProps> = ({
  value,
  onChange,
  minDate,
  maxDate,
  disabled = false,
  placeholder = 'Select date',
  size = 'md',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Size configurations
  const sizeClasses = {
    sm: 'py-1.5 px-3 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-3 px-4 text-lg',
  };

  // Convert value to Date
  const dateValue =
    value instanceof Date ? value : value ? new Date(value) : null;

  // Format date for display
  const formatDisplay = (date: Date | null): string => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Handle date selection
  const handleDateChange = useCallback(
    (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      onChange(`${year}-${month}-${day}`);
      setIsOpen(false);
    },
    [onChange]
  );

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <View className={cn('w-full', className)}>
      {/* Trigger Button */}
      <Pressable
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        className={cn(
          'flex-row items-center justify-between',
          'bg-white dark:bg-gray-800',
          'border border-gray-300 dark:border-gray-600',
          'rounded-lg',
          sizeClasses[size],
          disabled && 'opacity-50'
        )}
        accessibilityRole='button'
        accessibilityLabel={placeholder}
        accessibilityState={{ disabled }}
      >
        <Text
          className={cn(
            'flex-1',
            dateValue
              ? 'text-gray-900 dark:text-gray-100'
              : 'text-gray-400 dark:text-gray-500'
          )}
        >
          {dateValue ? formatDisplay(dateValue) : placeholder}
        </Text>
        <Text className='text-gray-400 dark:text-gray-500 ml-2'>📅</Text>
      </Pressable>

      {/* Calendar Modal */}
      <Modal
        visible={isOpen}
        transparent
        animationType='fade'
        onRequestClose={handleClose}
      >
        <TouchableWithoutFeedback onPress={handleClose}>
          <View className='flex-1 justify-center px-4 bg-black/50'>
            <TouchableWithoutFeedback>
              <View className='bg-white dark:bg-gray-900 rounded-lg p-4 shadow-xl'>
                <Calendar
                  value={dateValue || new Date()}
                  onChange={handleDateChange}
                  minDate={minDate}
                  maxDate={maxDate}
                />

                {/* Close button */}
                <View className='mt-4 pt-4 border-t border-gray-200 dark:border-gray-700'>
                  <Pressable
                    onPress={handleClose}
                    className='items-center py-2'
                    accessibilityRole='button'
                    accessibilityLabel='Cancel'
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
