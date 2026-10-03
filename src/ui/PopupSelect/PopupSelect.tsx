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
import { colors } from '@sudobility/design';
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
        style={[styles.optionItem, isSelected && styles.optionItemSelected]}
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
        >
          {item.label}
        </Text>
        {isSelected && <Text style={styles.checkmark}>✓</Text>}
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
        {...pressProps(() => !disabled && setModalVisible(true), disabled)}
        activeOpacity={0.7}
        accessibilityRole='combobox'
        accessibilityState={{ disabled, expanded: modalVisible }}
      >
        <Text
          style={[
            styles.triggerText,
            !selectedOption && styles.triggerPlaceholder,
            triggerTextStyle,
          ]}
          numberOfLines={1}
        >
          {selectedOption?.label ?? placeholder}
        </Text>
        <Text style={styles.triggerArrow}>▼</Text>
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
        <View style={[styles.modalContainer, safeAreaPadding(insets)]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <Pressable
              style={styles.closeButton}
              {...pressProps(() => setModalVisible(false))}
            >
              <Text style={styles.closeButtonText}>Done</Text>
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
    borderColor: colors.raw.neutral[300],
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: colors.raw.neutral[0],
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
    color: colors.raw.neutral[900],
  },
  triggerPlaceholder: {
    color: colors.raw.neutral[400],
  },
  triggerArrow: {
    fontSize: 10,
    color: colors.raw.neutral[400],
    marginStart: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.raw.neutral[0],
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.raw.neutral[200],
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.raw.neutral[900],
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.raw.blue[500],
  },
  listContent: {
    padding: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.raw.neutral[50],
    borderRadius: 12,
  },
  optionItemSelected: {
    backgroundColor: colors.raw.blue[100],
  },
  optionLabel: {
    flex: 1,
    fontSize: 16,
    color: colors.raw.neutral[900],
  },
  optionLabelSelected: {
    fontWeight: '600',
    color: colors.raw.blue[500],
  },
  optionDisabled: {
    opacity: 0.5,
  },
  checkmark: {
    fontSize: 18,
    color: colors.raw.blue[500],
    fontWeight: 'bold',
  },
  separator: {
    height: 8,
  },
});
