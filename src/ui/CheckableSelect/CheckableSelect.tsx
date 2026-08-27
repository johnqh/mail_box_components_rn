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

export interface CheckableSelectOption {
  /** Stable identity, reported to `onChange`/`onCheckedChange`. */
  value: string;
  /** Shown on the row, and on the trigger when this option is chosen. */
  label: string;
  /** Greys the row out: it can be neither chosen nor ticked. */
  disabled?: boolean;
}

export interface CheckableSelectProps {
  options: CheckableSelectOption[];
  /** The chosen option's value. */
  value: string;
  /** Called with the newly chosen option's value. */
  onChange: (value: string) => void;
  /** The ticked options' values. */
  checked: string[];
  /** Called with the whole new ticked set, in `options` order. */
  onCheckedChange: (checked: string[]) => void;
  /**
   * How few options may stay ticked. At the floor every *ticked* box is
   * disabled — unticked rows stay tappable, or the set could never grow back.
   */
  minChecked?: number;
  accessibilityLabel?: string;
  className?: string;
  /** Shown on the trigger when `value` matches no option. */
  placeholder?: string;
  /** Title for the picker sheet. */
  title?: string;
}

/**
 * CheckableSelect Component
 *
 * A select whose rows each carry a checkbox: one chosen value, plus an
 * independent set of ticked options. The React Native counterpart of
 * `CheckableSelect` in `@sudobility/components`.
 *
 * Distinct from `MultiSelect`, whose whole model is "value is an array". Here
 * the two pieces of state are independent, and collapsing them into one makes
 * both harder to read — a track picker that chooses which track is *active*
 * while ticking which are *visible* needs exactly this shape.
 *
 * Tapping a row's label chooses it and closes the sheet; tapping its box ticks
 * it and leaves the sheet open, because ticking is usually done several at a
 * time.
 *
 * @example
 * ```tsx
 * <CheckableSelect
 *   options={tracks}
 *   value={activeTrackId}
 *   onChange={setActiveTrack}
 *   checked={visibleTrackIds}
 *   onCheckedChange={setVisibleTracks}
 *   minChecked={1}
 * />
 * ```
 */
export const CheckableSelect: React.FC<CheckableSelectProps> = ({
  options,
  value,
  onChange,
  checked,
  onCheckedChange,
  minChecked = 0,
  accessibilityLabel,
  className,
  placeholder,
  title,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const checkedSet = useMemo(() => new Set(checked), [checked]);
  const selected = options.find(o => o.value === value);
  const atFloor = checkedSet.size <= minChecked;

  const toggle = useCallback(
    (option: CheckableSelectOption) => {
      const isChecked = checkedSet.has(option.value);
      // At the floor an already-ticked box cannot be cleared, but an unticked
      // one must stay tappable or the set could never grow back.
      if (isChecked && atFloor) return;
      const next = new Set(checkedSet);
      if (isChecked) next.delete(option.value);
      else next.add(option.value);
      // In `options` order, so the caller never has to sort what it is given.
      onCheckedChange(options.filter(o => next.has(o.value)).map(o => o.value));
    },
    [atFloor, checkedSet, onCheckedChange, options]
  );

  const choose = useCallback(
    (option: CheckableSelectOption) => {
      onChange(option.value);
      setIsOpen(false);
    },
    [onChange]
  );

  return (
    <>
      <Pressable
        onPress={() => setIsOpen(true)}
        className={cn('bg-card', className)}
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
        accessibilityState={{ expanded: isOpen }}
      >
        <Text
          className={cn(
            typography.size.base,
            selected ? 'text-foreground' : 'text-muted-foreground'
          )}
          numberOfLines={1}
          style={{ flex: 1 }}
        >
          {selected?.label ?? placeholder ?? ''}
        </Text>
        <Chevron />
      </Pressable>

      {/*
        Portalled rather than a `Modal`: React Native macOS throws on a mounted
        Modal, hidden or not, and an overlay written inside a scrolling toolbar
        would be clipped by it.
      */}
      {isOpen ? (
        <Portal>
          <Pressable
            className='flex-1 justify-end bg-black/50'
            onPress={() => setIsOpen(false)}
          >
            <Pressable
              className='bg-card rounded-t-xl'
              onPress={() => undefined}
            >
              <SafeAreaView>
                {title ? (
                  <View className='border-border border-b px-4 py-3'>
                    <Text
                      className={cn(
                        typography.size.base,
                        'text-foreground font-semibold'
                      )}
                    >
                      {title}
                    </Text>
                  </View>
                ) : null}
                <FlatList<CheckableSelectOption>
                  data={options}
                  keyExtractor={(o: CheckableSelectOption) => o.value}
                  renderItem={({ item }: { item: CheckableSelectOption }) => (
                    <Row
                      option={item}
                      chosen={item.value === value}
                      checked={checkedSet.has(item.value)}
                      checkDisabled={checkedSet.has(item.value) && atFloor}
                      onChoose={choose}
                      onToggle={toggle}
                    />
                  )}
                />
              </SafeAreaView>
            </Pressable>
          </Pressable>
        </Portal>
      ) : null}
    </>
  );
};

function Row({
  option,
  chosen,
  checked,
  checkDisabled,
  onChoose,
  onToggle,
}: {
  option: CheckableSelectOption;
  chosen: boolean;
  checked: boolean;
  checkDisabled: boolean;
  onChoose: (o: CheckableSelectOption) => void;
  onToggle: (o: CheckableSelectOption) => void;
}) {
  return (
    <View
      className='border-border/50 flex-row items-center border-b'
      style={{ paddingHorizontal: 16, paddingVertical: 12 }}
    >
      <Pressable
        onPress={() => !option.disabled && onToggle(option)}
        disabled={option.disabled || checkDisabled}
        hitSlop={8}
        accessibilityRole='checkbox'
        accessibilityState={{
          checked,
          disabled: option.disabled || checkDisabled,
        }}
        accessibilityLabel={option.label}
        style={{ marginRight: 12, opacity: checkDisabled ? 0.4 : 1 }}
      >
        <Box checked={checked} />
      </Pressable>
      <Pressable
        onPress={() => !option.disabled && onChoose(option)}
        disabled={option.disabled}
        style={{ flex: 1 }}
        accessibilityRole='menuitem'
        accessibilityState={{ selected: chosen }}
      >
        <Text
          className={cn(
            typography.size.base,
            chosen ? 'text-foreground font-semibold' : 'text-foreground',
            option.disabled && 'opacity-50'
          )}
          numberOfLines={1}
        >
          {option.label}
        </Text>
      </Pressable>
    </View>
  );
}

function Box({ checked }: { checked: boolean }) {
  return (
    <View
      style={{
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: checked
          ? colors.raw.neutral[800]
          : colors.raw.neutral[400],
        backgroundColor: checked ? colors.raw.neutral[800] : 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {checked ? (
        <Svg width={14} height={14} viewBox='0 0 20 20'>
          <Path
            fillRule='evenodd'
            d='M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4l3.3 3.3 6.8-6.8a1 1 0 011.4 0z'
            clipRule='evenodd'
            fill='#ffffff'
          />
        </Svg>
      ) : null}
    </View>
  );
}

function Chevron() {
  return (
    <Svg width={16} height={16} viewBox='0 0 20 20' style={{ marginLeft: 8 }}>
      <Path
        fillRule='evenodd'
        d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z'
        clipRule='evenodd'
        fill={colors.raw.neutral[500]}
      />
    </Svg>
  );
}
