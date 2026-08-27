import * as React from 'react';
import { useCallback, useMemo, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
// React Native's own SafeAreaView is deprecated and iOS-only; the context
// package's works on every platform and is what the app already provides.
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { Portal } from '../Portal';
import { cn } from '../../lib/utils';
import { colors, designTokens } from '@sudobility/design';

const { typography } = designTokens;

/** A single choice offered by {@link SheetSelector}. */
export interface SheetSelectorOption {
  value: string;
  /** Defaults to the value when omitted. */
  label?: string;
  disabled?: boolean;
  /**
   * Optional heading this option sits under. Consecutive options sharing a
   * group get one heading between them, so the list stays a flat array and
   * ungrouped callers pay nothing.
   */
  group?: string;
}

export interface SheetSelectorProps {
  options: SheetSelectorOption[];
  value: string;
  /** Called with the chosen value. Not called when the user cancels. */
  onChange: (value: string) => void;
  title?: string;
  /** Trigger text when nothing is selected. */
  placeholder?: string;
  disabled?: boolean;
  /** Shown in place of the list when `options` is empty. */
  emptyMessage?: string;
  cancelLabel?: string;
  className?: string;
  accessibilityLabel?: string;
}

type Row =
  | { kind: 'group'; key: string; label: string }
  | { kind: 'option'; key: string; option: SheetSelectorOption };

/**
 * Consecutive options sharing a group get one heading between them.
 *
 * Derived rather than stored, so the caller keeps a flat array and an
 * ungrouped list costs nothing — the same shape the web component uses.
 */
function toRows(options: SheetSelectorOption[]): Row[] {
  const rows: Row[] = [];
  let current: string | undefined;
  for (const option of options) {
    if (option.group && option.group !== current) {
      rows.push({
        kind: 'group',
        key: `group:${option.group}`,
        label: option.group,
      });
      current = option.group;
    }
    if (!option.group) current = undefined;
    rows.push({ kind: 'option', key: option.value, option });
  }
  return rows;
}

/**
 * SheetSelector Component
 *
 * A single-choice picker that opens a full sheet rather than a dropdown — the
 * React Native counterpart of `SheetSelector` in `@sudobility/components`.
 *
 * Distinct from `Select`, which is for a handful of options: this one is for
 * lists long enough to need a title, groups and an empty state — the General
 * MIDI instruments, say, which are 128 options in sixteen families.
 *
 * Cancelling does not call `onChange`. That is the difference from a dropdown
 * that commits on highlight, and it is what makes the sheet safe to open just
 * to look.
 *
 * @example
 * ```tsx
 * <SheetSelector
 *   options={instruments}
 *   value={program}
 *   onChange={setProgram}
 *   title="Instrument"
 * />
 * ```
 */
export const SheetSelector: React.FC<SheetSelectorProps> = ({
  options,
  value,
  onChange,
  title,
  placeholder,
  disabled = false,
  emptyMessage,
  cancelLabel,
  className,
  accessibilityLabel,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const rows = useMemo(() => toRows(options), [options]);
  const selected = options.find(o => o.value === value);

  const choose = useCallback(
    (option: SheetSelectorOption) => {
      if (option.disabled) return;
      onChange(option.value);
      setIsOpen(false);
    },
    [onChange]
  );

  return (
    <>
      <Pressable
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
        className={cn('bg-card', disabled && 'opacity-50', className)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          minHeight: 36,
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderWidth: 1,
          borderColor: colors.raw.neutral[300],
          borderRadius: 6,
        }}
        accessibilityRole='combobox'
        {...(accessibilityLabel ? { accessibilityLabel } : {})}
        accessibilityState={{ disabled, expanded: isOpen }}
      >
        <Text
          className={cn(
            typography.size.base,
            selected ? 'text-foreground' : 'text-muted-foreground'
          )}
          numberOfLines={1}
          style={{ flex: 1 }}
        >
          {selected ? (selected.label ?? selected.value) : (placeholder ?? '')}
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
            fill={colors.raw.neutral[500]}
          />
        </Svg>
      </Pressable>

      {/*
        Portalled, not a `Modal`. React Native macOS throws
        `Exception in HostFunction` when a Modal is mounted — and it mounts even
        when hidden, so merely having one takes the screen down. Rendering only
        while open also means a closed picker costs nothing.

        `presentationStyle='pageSheet'` was here too, and is iOS-only.
      */}
      {isOpen ? (
        <Portal>
          <SafeAreaView className='bg-card flex-1'>
            <View className='border-border flex-row items-center border-b px-4 py-3'>
              <Text
                className={cn(
                  typography.size.base,
                  'text-foreground flex-1 font-semibold'
                )}
                numberOfLines={1}
              >
                {title ?? ''}
              </Text>
              <Pressable
                onPress={() => setIsOpen(false)}
                hitSlop={8}
                accessibilityRole='button'
                {...(cancelLabel ? { accessibilityLabel: cancelLabel } : {})}
              >
                <Text className={cn(typography.size.base, 'text-primary')}>
                  {cancelLabel ?? '✕'}
                </Text>
              </Pressable>
            </View>

            {options.length === 0 ? (
              <View className='flex-1 items-center justify-center p-8'>
                <Text className='text-muted-foreground'>
                  {emptyMessage ?? ''}
                </Text>
              </View>
            ) : (
              <FlatList<Row>
                data={rows}
                keyExtractor={(row: Row) => row.key}
                renderItem={({ item }: { item: Row }) =>
                  item.kind === 'group' ? (
                    <View className='bg-muted px-4 py-2'>
                      <Text
                        className={cn(
                          typography.size.sm,
                          'text-muted-foreground font-semibold uppercase'
                        )}
                      >
                        {item.label}
                      </Text>
                    </View>
                  ) : (
                    <Pressable
                      onPress={() => choose(item.option)}
                      disabled={item.option.disabled}
                      className='border-border/50 flex-row items-center border-b px-4 py-3'
                      accessibilityRole='menuitem'
                      accessibilityState={{
                        selected: item.option.value === value,
                        disabled: item.option.disabled,
                      }}
                    >
                      <Text
                        className={cn(
                          typography.size.base,
                          'text-foreground flex-1',
                          item.option.disabled && 'opacity-50'
                        )}
                        numberOfLines={1}
                      >
                        {item.option.label ?? item.option.value}
                      </Text>
                      {item.option.value === value ? (
                        <Svg width={18} height={18} viewBox='0 0 20 20'>
                          <Path
                            fillRule='evenodd'
                            d='M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4l3.3 3.3 6.8-6.8a1 1 0 011.4 0z'
                            clipRule='evenodd'
                            fill={colors.raw.neutral[800]}
                          />
                        </Svg>
                      ) : null}
                    </Pressable>
                  )
                }
              />
            )}
          </SafeAreaView>
        </Portal>
      ) : null}
    </>
  );
};
