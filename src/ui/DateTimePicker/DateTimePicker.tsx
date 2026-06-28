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
import { TimePicker } from '../TimePicker';

export interface DateTimePickerProps {
  /** Date time value */
  value: Date;
  /** Change handler */
  onChange: (value: Date) => void;
  /** Use 12-hour format for time */
  use12Hour?: boolean;
  /** Minute step interval */
  minuteStep?: number;
  /** Minimum date */
  minDate?: Date;
  /** Maximum date */
  maxDate?: Date;
  /** Disabled state */
  disabled?: boolean;
  /** Placeholder text */
  placeholder?: string;
  /** Additional className */
  className?: string;
}

/**
 * DateTimePicker Component
 *
 * Combined date and time picker with calendar and time selection.
 * Supports min/max dates and 12/24 hour formats.
 *
 * @example
 * ```tsx
 * <DateTimePicker
 *   value={appointment}
 *   onChange={setAppointment}
 *   use12Hour
 *   minDate={new Date()}
 * />
 * ```
 */
export const DateTimePicker: React.FC<DateTimePickerProps> = ({
  value,
  onChange,
  use12Hour = false,
  minuteStep = 1,
  minDate,
  maxDate,
  disabled = false,
  placeholder = 'Select date and time',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(value);

  // Format date time for display
  const formatDisplay = (date: Date): string => {
    const dateStr = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    const hours = date.getHours();
    const minutes = date.getMinutes();

    if (use12Hour) {
      const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      const period = hours >= 12 ? 'PM' : 'AM';
      return `${dateStr}, ${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
    }

    return `${dateStr}, ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  // Handle date change
  const handleDateChange = useCallback(
    (date: Date) => {
      const newDateTime = new Date(date);
      newDateTime.setHours(selectedDate.getHours());
      newDateTime.setMinutes(selectedDate.getMinutes());
      setSelectedDate(newDateTime);
    },
    [selectedDate]
  );

  // Handle time change
  const handleTimeChange = useCallback(
    (timeStr: string) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      const newDateTime = new Date(selectedDate);
      newDateTime.setHours(hours);
      newDateTime.setMinutes(minutes);
      setSelectedDate(newDateTime);
    },
    [selectedDate]
  );

  // Get time string from date
  const getTimeString = (date: Date): string => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setSelectedDate(value);
  }, [value]);

  const handleConfirm = useCallback(() => {
    onChange(selectedDate);
    setIsOpen(false);
  }, [selectedDate, onChange]);

  const handleOpen = useCallback(() => {
    setSelectedDate(value);
    setIsOpen(true);
  }, [value]);

  return (
    <View className={cn('w-full', className)}>
      {/* Trigger Button */}
      <Pressable
        onPress={() => !disabled && handleOpen()}
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
        accessibilityState={{ disabled }}
      >
        <Text className='text-sm text-foreground'>{formatDisplay(value)}</Text>
        <Text className='text-muted-foreground'>📅</Text>
      </Pressable>

      {/* Picker Modal */}
      <Modal
        visible={isOpen}
        transparent
        animationType='fade'
        onRequestClose={handleClose}
      >
        <TouchableWithoutFeedback onPress={handleClose}>
          <View className='flex-1 justify-center px-4 bg-black/50'>
            <TouchableWithoutFeedback>
              <View className='bg-background rounded-lg p-4 shadow-xl'>
                {/* Calendar */}
                <View className='mb-4'>
                  <Text className='text-xs font-medium text-muted-foreground mb-2'>
                    Select Date
                  </Text>
                  <Calendar
                    value={selectedDate}
                    onChange={handleDateChange}
                    minDate={minDate}
                    maxDate={maxDate}
                  />
                </View>

                {/* Divider */}
                <View className='h-px bg-muted my-3' />

                {/* Time picker */}
                <View>
                  <Text className='text-xs font-medium text-muted-foreground mb-2'>
                    Select Time
                  </Text>
                  <TimePicker
                    value={getTimeString(selectedDate)}
                    onChange={handleTimeChange}
                    use12Hour={use12Hour}
                    minuteStep={minuteStep}
                  />
                </View>

                {/* Actions */}
                <View className='flex-row gap-2 pt-4 mt-4 border-t border-border'>
                  <Pressable
                    onPress={handleClose}
                    className={cn(
                      'flex-1 items-center py-2',
                      'bg-muted',
                      'rounded-md',
                      'active:bg-muted'
                    )}
                    accessibilityRole='button'
                    accessibilityLabel='Cancel'
                  >
                    <Text className='text-sm text-muted-foreground'>
                      Cancel
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={handleConfirm}
                    className={cn(
                      'flex-1 items-center py-2',
                      'bg-primary dark:bg-primary',
                      'rounded-md',
                      'active:bg-primary/90'
                    )}
                    accessibilityRole='button'
                    accessibilityLabel='Confirm'
                  >
                    <Text className='text-sm text-white font-medium'>OK</Text>
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
