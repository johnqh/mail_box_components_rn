import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Pressable,
} from 'react-native';
import { ModalHost } from '../ModalHost';
import { useSurfaceInsets } from '../../lib/safe-area-edges';
import { safeAreaPadding } from '../../lib/safe-area';
import { selectTriggerLabelStyle } from '../../lib/select-trigger';
import { pressProps } from '../../lib/a11y';

export interface PopupSelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface PopupSelectProps {
  /** Currently selected value */
  value?: string;
  /** Callback when value changes */
  onValueChange?: (value: string) => void;
  /** Options to display */
  options: PopupSelectOption[];
  /** Placeholder text when no value selected */
  placeholder?: string;
  /** Title shown in the modal header */
  title?: string;
  /** Whether the select is disabled */
  disabled?: boolean;
  /** Style overrides for the trigger button */
  triggerStyle?: object;
  /** Style overrides for the trigger text */
  triggerTextStyle?: object;
}

/*
  Layout is in `styles`; every colour is a semantic class, so it follows the
  palette the host applied (including one set at run time with `vars()`).
  A caller's `triggerStyle`/`triggerTextStyle` still wins: inline style
  overrides a class.
*/
const ItemSeparator = () => <View style={styles.separator} />;

/**
 * PopupSelect Component
 *
 * A select component that opens a pageSheet modal with a styled option list.
 * Provides a native-feeling selection experience on iOS and Android.
 *
 * @example
 * ```tsx
 * <PopupSelect
 *   value={selected}
 *   onValueChange={setSelected}
 *   options={[
 *     { label: 'Option A', value: 'a' },
 *     { label: 'Option B', value: 'b' },
 *   ]}
 *   placeholder="Choose..."
 *   title="Select Option"
 * />
 * ```
 */
export const PopupSelect: React.FC<PopupSelectProps> = ({
  value,
  onValueChange,
  options,
  placeholder = 'Select...',
  title = 'Select',
  disabled = false,
  triggerStyle,
  triggerTextStyle,
}) => {
  const insets = useSurfaceInsets();
  const [modalVisible, setModalVisible] = useState(false);

  const selectedOption = options.find(opt => opt.value === value);

  const handleSelect = useCallback(
    (optionValue: string) => {
      onValueChange?.(optionValue);
      setModalVisible(false);
    },
    [onValueChange]
  );

  const renderOption = ({ item }: { item: PopupSelectOption }) => {
    const isSelected = item.value === value;
    return (
      <TouchableOpacity
        style={styles.optionItem}
        className={isSelected ? 'bg-primary/10' : 'bg-muted'}
        {...pressProps(
          () => !item.disabled && handleSelect(item.value),
          item.disabled
        )}
        disabled={item.disabled}
        activeOpacity={0.7}
        accessibilityRole='menuitem'
        accessibilityState={{ selected: isSelected, disabled: item.disabled }}
      >
        <Text
          style={[
            styles.optionLabel,
            isSelected && styles.optionLabelSelected,
            item.disabled && styles.optionDisabled,
          ]}
          className={isSelected ? 'text-primary' : 'text-foreground'}
        >
          {item.label}
        </Text>
        {isSelected && (
          <Text style={styles.checkmark} className='text-primary'>
            ✓
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.trigger,
          disabled && styles.triggerDisabled,
          triggerStyle,
        ]}
        className='border-input bg-card'
        {...pressProps(() => !disabled && setModalVisible(true), disabled)}
        activeOpacity={0.7}
        accessibilityRole='combobox'
        accessibilityState={{ disabled, expanded: modalVisible }}
      >
        <Text
          style={[styles.triggerText, triggerTextStyle]}
          className={
            selectedOption ? 'text-foreground' : 'text-muted-foreground'
          }
          numberOfLines={1}
        >
          {selectedOption?.label ?? placeholder}
        </Text>
        <Text style={styles.triggerArrow} className='text-muted-foreground'>
          ▼
        </Text>
      </TouchableOpacity>

      <ModalHost
        visible={modalVisible}
        animationType='slide'
        onRequestClose={() => setModalVisible(false)}
      >
        {/*
          A full-screen modal, so all four insets — the horizontal pair used to
          be missing and put the header and the option rows under a landscape
          phone's cutout, and the bottom one keeps the last row clear of the
          home indicator.
        */}
        <View
          style={[styles.modalContainer, safeAreaPadding(insets)]}
          className='bg-background'
        >
          <View style={styles.modalHeader} className='border-border'>
            <Text style={styles.modalTitle} className='text-foreground'>
              {title}
            </Text>
            <Pressable
              style={styles.closeButton}
              {...pressProps(() => setModalVisible(false))}
            >
              <Text style={styles.closeButtonText} className='text-primary'>
                Done
              </Text>
            </Pressable>
          </View>

          <FlatList
            data={options}
            keyExtractor={(item: PopupSelectOption) => item.value}
            renderItem={renderOption}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={ItemSeparator}
          />
        </View>
      </ModalHost>
    </>
  );
};

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  triggerDisabled: {
    opacity: 0.5,
  },
  triggerText: {
    // Not `flex: 1` — see `lib/select-trigger.ts`. This trigger is
    // `justify-content: space-between`, which is exactly the row where a
    // flex-basis of zero leaves nothing but the arrow visible.
    ...selectTriggerLabelStyle,
    fontSize: 16,
  },
  triggerArrow: {
    fontSize: 10,
    marginStart: 8,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  optionLabel: {
    flex: 1,
    fontSize: 16,
  },
  optionLabelSelected: {
    fontWeight: '600',
  },
  optionDisabled: {
    opacity: 0.5,
  },
  checkmark: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  separator: {
    height: 8,
  },
});
