import * as React from 'react';
import { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { cn } from '../../lib/utils';

export interface TimePickerProps {
  /** Time value in HH:mm format (24-hour) */
  value: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Use 12-hour format */
  use12Hour?: boolean;
  /** Minute step interval */
  minuteStep?: number;
  /** Disabled state */
  disabled?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * TimePicker Component
 *
 * Time selection with scrollable columns.
 * Supports 12-hour and 24-hour formats.
 *
 * @example
 * ```tsx
 * <TimePicker
 *   value={time}
 *   onChange={setTime}
 *   use12Hour
 *   minuteStep={15}
 * />
 * ```
 */
export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  use12Hour = false,
  minuteStep = 1,
  disabled = false,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [internalHour, setInternalHour] = useState('12');
  const [internalMinute, setInternalMinute] = useState('00');
  const [period, setPeriod] = useState<'AM' | 'PM'>('AM');

  // Parse value to hours and minutes
  useEffect(() => {
    if (value) {
      const [hours, minutes] = value.split(':');
      const hour = parseInt(hours, 10);

      if (use12Hour) {
        const isPM = hour >= 12;
        const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        setInternalHour(hour12.toString().padStart(2, '0'));
        setPeriod(isPM ? 'PM' : 'AM');
      } else {
        setInternalHour(hours);
      }

      setInternalMinute(minutes);
    }
  }, [value, use12Hour]);

  // Format display value
  const formatDisplay = (): string => {
    if (!value) return 'Select time';

    const [hours, minutes] = value.split(':');
    const hour = parseInt(hours, 10);

    if (use12Hour) {
      const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const displayPeriod = hour >= 12 ? 'PM' : 'AM';
      return `${hour12}:${minutes} ${displayPeriod}`;
    }

    return `${hours}:${minutes}`;
  };

  // Handle time selection
  const handleTimeChange = (
    newHour: string,
    newMinute: string,
    newPeriod?: 'AM' | 'PM'
  ) => {
    let hour = parseInt(newHour, 10);
    const minute = parseInt(newMinute, 10);

    if (use12Hour && newPeriod) {
      if (newPeriod === 'PM' && hour !== 12) {
        hour += 12;
      } else if (newPeriod === 'AM' && hour === 12) {
        hour = 0;
      }
    }

    const formattedTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
    onChange(formattedTime);
  };

  // Generate hour options
  const hourOptions = use12Hour
    ? Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'))
    : Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, '0'));

  // Generate minute options
  const minuteOptions = Array.from(
    { length: Math.ceil(60 / minuteStep) },
    (_, i) => (i * minuteStep).toString().padStart(2, '0')
  );

  return (
    <View className={cn('w-full', className)}>
      {/* Input trigger */}
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
        accessibilityLabel='Select time'
      >
        <Text
          className={cn(
            'text-sm',
            value
              ? 'text-gray-900 dark:text-white'
              : 'text-gray-500 dark:text-gray-400'
          )}
        >
          {formatDisplay()}
        </Text>
        <Text className='text-gray-600 dark:text-gray-400'>🕐</Text>
      </Pressable>

      {/* Time picker modal */}
      <Modal
        visible={isOpen}
        transparent
        animationType='slide'
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableWithoutFeedback onPress={() => setIsOpen(false)}>
          <View className='flex-1 justify-end bg-black/50'>
            <TouchableWithoutFeedback>
              <View className='bg-white dark:bg-gray-900 rounded-t-xl'>
                <View className='flex-row p-4 gap-2'>
                  {/* Hours */}
                  <View className='flex-1'>
                    <Text className='text-xs font-medium text-gray-700 dark:text-gray-300 text-center mb-2'>
                      Hour
                    </Text>
                    <ScrollView className='h-48 border border-gray-200 dark:border-gray-700 rounded'>
                      {hourOptions.map(hour => (
                        <Pressable
                          key={hour}
                          onPress={() => {
                            setInternalHour(hour);
                            handleTimeChange(
                              hour,
                              internalMinute,
                              use12Hour ? period : undefined
                            );
                          }}
                          className={cn(
                            'px-3 py-2',
                            'active:bg-gray-100 dark:active:bg-gray-800',
                            hour === internalHour &&
                              'bg-blue-100 dark:bg-blue-900/30'
                          )}
                        >
                          <Text
                            className={cn(
                              'text-sm text-center',
                              hour === internalHour
                                ? 'text-blue-700 dark:text-blue-300 font-medium'
                                : 'text-gray-900 dark:text-white'
                            )}
                          >
                            {hour}
                          </Text>
                        </Pressable>
                      ))}
                    </ScrollView>
                  </View>

                  {/* Minutes */}
                  <View className='flex-1'>
                    <Text className='text-xs font-medium text-gray-700 dark:text-gray-300 text-center mb-2'>
                      Min
                    </Text>
                    <ScrollView className='h-48 border border-gray-200 dark:border-gray-700 rounded'>
                      {minuteOptions.map(minute => (
                        <Pressable
                          key={minute}
                          onPress={() => {
                            setInternalMinute(minute);
                            handleTimeChange(
                              internalHour,
                              minute,
                              use12Hour ? period : undefined
                            );
                          }}
                          className={cn(
                            'px-3 py-2',
                            'active:bg-gray-100 dark:active:bg-gray-800',
                            minute === internalMinute &&
                              'bg-blue-100 dark:bg-blue-900/30'
                          )}
                        >
                          <Text
                            className={cn(
                              'text-sm text-center',
                              minute === internalMinute
                                ? 'text-blue-700 dark:text-blue-300 font-medium'
                                : 'text-gray-900 dark:text-white'
                            )}
                          >
                            {minute}
                          </Text>
                        </Pressable>
                      ))}
                    </ScrollView>
                  </View>

                  {/* AM/PM */}
                  {use12Hour && (
                    <View className='w-16'>
                      <Text className='text-xs font-medium text-gray-700 dark:text-gray-300 text-center mb-2'>
                        {' '}
                      </Text>
                      <View className='h-48 justify-center gap-2'>
                        <Pressable
                          onPress={() => {
                            setPeriod('AM');
                            handleTimeChange(
                              internalHour,
                              internalMinute,
                              'AM'
                            );
                          }}
                          className={cn(
                            'px-3 py-2 rounded',
                            'active:bg-gray-100 dark:active:bg-gray-800',
                            period === 'AM' && 'bg-blue-100 dark:bg-blue-900/30'
                          )}
                        >
                          <Text
                            className={cn(
                              'text-sm text-center',
                              period === 'AM'
                                ? 'text-blue-700 dark:text-blue-300 font-medium'
                                : 'text-gray-900 dark:text-white'
                            )}
                          >
                            AM
                          </Text>
                        </Pressable>
                        <Pressable
                          onPress={() => {
                            setPeriod('PM');
                            handleTimeChange(
                              internalHour,
                              internalMinute,
                              'PM'
                            );
                          }}
                          className={cn(
                            'px-3 py-2 rounded',
                            'active:bg-gray-100 dark:active:bg-gray-800',
                            period === 'PM' && 'bg-blue-100 dark:bg-blue-900/30'
                          )}
                        >
                          <Text
                            className={cn(
                              'text-sm text-center',
                              period === 'PM'
                                ? 'text-blue-700 dark:text-blue-300 font-medium'
                                : 'text-gray-900 dark:text-white'
                            )}
                          >
                            PM
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  )}
                </View>

                {/* Done button */}
                <View className='p-3 border-t border-gray-200 dark:border-gray-700'>
                  <Pressable
                    onPress={() => setIsOpen(false)}
                    className='items-center py-3'
                  >
                    <Text className='text-sm font-medium text-blue-600 dark:text-blue-400'>
                      Done
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
