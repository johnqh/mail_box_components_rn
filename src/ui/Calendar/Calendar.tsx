import * as React from 'react';
import { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { cn } from '../../lib/utils';
import { designTokens } from '@sudobility/design';

const { typography } = designTokens;

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
    <View className={cn('bg-background rounded-lg p-4', className)}>
      {/* Header */}
      <View className='flex-row items-center justify-between mb-4'>
        <Pressable
          onPress={goToPreviousMonth}
          className='p-2 active:bg-muted rounded-md'
          accessibilityRole='button'
          accessibilityLabel='Previous month'
        >
          <Text className={cn(typography.size.lg, 'text-muted-foreground')}>
            ‹
          </Text>
        </Pressable>

        <Text
          className={cn(
            typography.size.base,
            typography.weight.semibold,
            'text-foreground'
          )}
        >
          {monthYear}
        </Text>

        <Pressable
          onPress={goToNextMonth}
          className='p-2 active:bg-muted rounded-md'
          accessibilityRole='button'
          accessibilityLabel='Next month'
        >
          <Text className={cn(typography.size.lg, 'text-muted-foreground')}>
            ›
          </Text>
        </Pressable>
      </View>

      {/* Week days header */}
      <View className='flex-row mb-2'>
        {weekDays.map(day => (
          <View key={day} className='flex-1 items-center py-2'>
            <Text
              className={cn(
                typography.size.xs,
                typography.weight.medium,
                'text-muted-foreground'
              )}
            >
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
                  !isDisabled && 'active:bg-muted',
                  isDisabled && 'opacity-40',
                  isSelected && 'bg-primary dark:bg-primary',
                  isToday && !isSelected && 'border-2 border-primary '
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
                    typography.size.sm,
                    isCurrentMonth
                      ? 'text-foreground'
                      : 'text-muted-foreground',
                    isSelected && `text-white ${typography.weight.semibold}`
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
