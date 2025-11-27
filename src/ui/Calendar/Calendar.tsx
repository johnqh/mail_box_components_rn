import * as React from 'react';
import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { cn } from '../../lib/utils';

export interface CalendarProps {
  /** Selected date */
  value?: Date;
  /** Change handler */
  onChange: (date: Date) => void;
  /** Minimum selectable date */
  minDate?: Date;
  /** Maximum selectable date */
  maxDate?: Date;
  /** Disabled dates */
  disabledDates?: Date[];
  /** Show outside days */
  showOutsideDays?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * Calendar Component
 *
 * Interactive calendar for date selection.
 * Supports min/max dates and disabled dates.
 *
 * @example
 * ```tsx
 * <Calendar
 *   value={selectedDate}
 *   onChange={setSelectedDate}
 *   minDate={new Date()}
 * />
 * ```
 */
export const Calendar: React.FC<CalendarProps> = ({
  value,
  onChange,
  minDate,
  maxDate,
  disabledDates = [],
  showOutsideDays = true,
  className,
}) => {
  const [currentMonth, setCurrentMonth] = useState(value || new Date());

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday, 6 = Saturday)
  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  // Check if date is same day
  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  };

  // Check if date is disabled
  const isDateDisabled = (date: Date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return disabledDates.some(disabledDate => isSameDay(date, disabledDate));
  };

  // Navigate months
  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1)
    );
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days: (Date | null)[] = [];

    // Add previous month days
    if (showOutsideDays) {
      const prevMonthDays = getDaysInMonth(new Date(year, month - 1));
      for (let i = firstDay - 1; i >= 0; i--) {
        days.push(new Date(year, month - 1, prevMonthDays - i));
      }
    } else {
      for (let i = 0; i < firstDay; i++) {
        days.push(null);
      }
    }

    // Add current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }

    // Add next month days to fill grid
    if (showOutsideDays) {
      const remainingDays = 42 - days.length; // 6 rows * 7 days
      for (let day = 1; day <= remainingDays; day++) {
        days.push(new Date(year, month + 1, day));
      }
    }

    return days;
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleDayPress = (date: Date | null) => {
    if (!date || isDateDisabled(date)) return;
    onChange(date);
  };

  const monthYear = currentMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  // Split days into weeks for grid layout
  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }

  return (
    <View className={cn('bg-white dark:bg-gray-900 rounded-lg p-4', className)}>
      {/* Header */}
      <View className='flex-row items-center justify-between mb-4'>
        <Pressable
          onPress={goToPreviousMonth}
          className='p-2 active:bg-gray-100 dark:active:bg-gray-800 rounded-md'
          accessibilityRole='button'
          accessibilityLabel='Previous month'
        >
          <Text className='text-lg text-gray-700 dark:text-gray-300'>‹</Text>
        </Pressable>

        <Text className='text-base font-semibold text-gray-900 dark:text-white'>
          {monthYear}
        </Text>

        <Pressable
          onPress={goToNextMonth}
          className='p-2 active:bg-gray-100 dark:active:bg-gray-800 rounded-md'
          accessibilityRole='button'
          accessibilityLabel='Next month'
        >
          <Text className='text-lg text-gray-700 dark:text-gray-300'>›</Text>
        </Pressable>
      </View>

      {/* Week days header */}
      <View className='flex-row mb-2'>
        {weekDays.map(day => (
          <View key={day} className='flex-1 items-center py-2'>
            <Text className='text-xs font-medium text-gray-600 dark:text-gray-400'>
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      {weeks.map((week, weekIndex) => (
        <View key={weekIndex} className='flex-row'>
          {week.map((date, dayIndex) => {
            if (!date) {
              return (
                <View
                  key={`empty-${dayIndex}`}
                  className='flex-1 aspect-square'
                />
              );
            }

            const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
            const isSelected = value && isSameDay(date, value);
            const isToday = isSameDay(date, new Date());
            const isDisabled = isDateDisabled(date);

            return (
              <Pressable
                key={`${date.getTime()}-${dayIndex}`}
                onPress={() => handleDayPress(date)}
                disabled={isDisabled}
                className={cn(
                  'flex-1 aspect-square items-center justify-center rounded-md m-0.5',
                  !isDisabled && 'active:bg-gray-100 dark:active:bg-gray-800',
                  isDisabled && 'opacity-40',
                  isSelected && 'bg-blue-600 dark:bg-blue-500',
                  isToday &&
                    !isSelected &&
                    'border-2 border-blue-600 dark:border-blue-400'
                )}
                accessibilityRole='button'
                accessibilityLabel={date.toLocaleDateString()}
                accessibilityState={{
                  selected: isSelected,
                  disabled: isDisabled,
                }}
              >
                <Text
                  className={cn(
                    'text-sm',
                    isCurrentMonth
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-400 dark:text-gray-600',
                    isSelected && 'text-white font-semibold'
                  )}
                >
                  {date.getDate()}
                </Text>
              </Pressable>
            );
          })}
        </View>
      ))}
    </View>
  );
};
