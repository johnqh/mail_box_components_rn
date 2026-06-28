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
          'bg-background',
          'border border-border',
          'rounded-md',
          disabled && 'opacity-50'
        )}
        accessibilityRole='button'
        accessibilityLabel='Select time'
      >
        <Text
          className={cn(
            'text-sm',
            value ? 'text-foreground' : 'text-muted-foreground'
          )}
        >
          {formatDisplay()}
        </Text>
        <Text className='text-muted-foreground'>🕐</Text>
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
              <View className='bg-background rounded-t-xl'>
                <View className='flex-row p-4 gap-2'>
                  {/* Hours */}
                  <View className='flex-1'>
                    <Text className='text-xs font-medium text-muted-foreground text-center mb-2'>
                      Hour
                    </Text>
                    <ScrollView className='h-48 border border-border rounded'>
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
                            'active:bg-muted',
                            hour === internalHour && 'bg-primary/10'
                          )}
                        >
                          <Text
                            className={cn(
                              'text-sm text-center',
                              hour === internalHour
                                ? 'text-primary font-medium'
                                : 'text-foreground'
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
                    <Text className='text-xs font-medium text-muted-foreground text-center mb-2'>
                      Min
                    </Text>
                    <ScrollView className='h-48 border border-border rounded'>
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
                            'active:bg-muted',
                            minute === internalMinute && 'bg-primary/10'
                          )}
                        >
                          <Text
                            className={cn(
                              'text-sm text-center',
                              minute === internalMinute
                                ? 'text-primary font-medium'
                                : 'text-foreground'
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
                      <Text className='text-xs font-medium text-muted-foreground text-center mb-2'>
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
                            'active:bg-muted',
                            period === 'AM' && 'bg-primary/10'
                          )}
                        >
                          <Text
                            className={cn(
                              'text-sm text-center',
                              period === 'AM'
                                ? 'text-primary font-medium'
                                : 'text-foreground'
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
                            'active:bg-muted',
                            period === 'PM' && 'bg-primary/10'
                          )}
                        >
                          <Text
                            className={cn(
                              'text-sm text-center',
                              period === 'PM'
                                ? 'text-primary font-medium'
                                : 'text-foreground'
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
                <View className='p-3 border-t border-border'>
                  <Pressable
                    onPress={() => setIsOpen(false)}
                    className='items-center py-3'
                  >
                    <Text className='text-sm font-medium text-primary'>
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
