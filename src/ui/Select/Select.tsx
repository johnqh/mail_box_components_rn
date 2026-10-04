import * as React from 'react';
import { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,
  Platform,
  NativeModules,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';
// React Native's own SafeAreaView is deprecated and iOS-only; the context
// package's works on every platform and is what the app already provides.
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaEdges } from '../../lib/safe-area-edges';
import { ModalHost } from '../ModalHost';
import Svg, { Path } from 'react-native-svg';
import { cn } from '../../lib/utils';
import '../../lib/svg-interop';
import { selectTriggerLabelStyle } from '../../lib/select-trigger';
import { designTokens } from '@sudobility/design';
import { optionsFromChildren } from './SelectComposition';
import { pressProps } from '../../lib/a11y';
import { useFormFactor } from '../../lib/form-factor';
import { measureAnchor, popoverPlacement } from '../../lib/select-popover';
import type { PopoverAnchor } from '../../lib/select-popover';

const { typography } = designTokens;

/** Read when asked rather than once at load, so a test can say which. */
const onDesktop = (): boolean =>
  Platform.OS === 'macos' || Platform.OS === 'windows';

interface PopupMenuModuleInterface {
  show(
    items: { key: string; label: string; selected?: boolean }[],
    screenX: number,
    screenY: number
  ): Promise<string | null>;
}

/**
 * The system's own menu, where the app provides one.
 *
 * On a desktop the choices should open as that: an `NSMenu` is what a Mac
 * user expects under a pop-up button, and it can leave the window where a
 * drawn list cannot. But that menu is native code, and this package has
 * none — the module is the app's to provide, and only one app in the family
 * ever did. Everywhere else a press reached `if (!PopupMenuModule) return`
 * and stopped: the control drew, took focus, and did nothing, with no error
 * to say why. The picker below was compiled out for the same platforms, so
 * there was nothing to fall back to either.
 *
 * So the native menu is used where it exists, and the drawn picker
 * everywhere it does not. A select that opens the plainer of two lists is a
 * working control; one that opens neither is not a control.
 */
function nativeMenu(): PopupMenuModuleInterface | undefined {
  return onDesktop()
    ? (NativeModules.PopupMenuModule as PopupMenuModuleInterface | undefined)
    : undefined;
}

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps {
  /**
   * The options.
   *
   * Optional because this component also accepts the web library's
   * compositional children (`<SelectContent><SelectItem/></SelectContent>`) —
   * see `SelectComposition.tsx`. Exactly one of the two is used: children win
   * when both are given, because a caller who wrote them meant them.
   */
  children?: React.ReactNode;
  /** Currently selected value */
  value?: string;
  /** Callback when value changes */
  onValueChange?: (value: string) => void;
  /** Options to display */
  options?: SelectOption[];
  /** Placeholder text when no value selected */
  placeholder?: string;
  /** Whether the select is disabled */
  disabled?: boolean;
  /** Additional className for the trigger */
  className?: string;
  /** Title for the modal */
  title?: string;
  /**
   * The control's accessible name.
   *
   * A select's visible label usually sits outside it, so without this a screen
   * reader announces only the current *value* — "Treble", with no word for what
   * is treble. The web package takes an `ariaLabel` for the same reason.
   */
  accessibilityLabel?: string;
}

/**
 * Select Component
 *
 * A select, opening the way its platform opens one: the system's own menu
 * on a desktop whose app provides it, a menu beside the control on a tablet,
 * and a sheet from the bottom edge on a phone.
 *
 * @example
 * ```tsx
 * <Select
 *   value={selectedValue}
 *   onValueChange={setSelectedValue}
 *   options={[
 *     { label: 'Option 1', value: '1' },
 *     { label: 'Option 2', value: '2' },
 *     { label: 'Option 3', value: '3' },
 *   ]}
 *   placeholder="Select an option..."
 * />
 * ```
 */
export const Select: React.FC<SelectProps> = ({
  children,
  options: optionsProp,
  value,
  onValueChange,
  placeholder = 'Select...',
  disabled = false,
  className,
  title = 'Select Option',
  accessibilityLabel,
}) => {
  const safeEdges = useSafeAreaEdges();
  /*
    Either shape is accepted: an `options` array, or the web library's
    compositional children. Children win when both are given, because a caller
    who wrote `<SelectItem>` meant it — and silently preferring the array would
    render a list they cannot see in their own JSX.
  */
  const options = React.useMemo(
    () => (children ? optionsFromChildren(children) : (optionsProp ?? [])),
    [children, optionsProp]
  );
  const [isOpen, setIsOpen] = useState(false);
  const isDesktop = onDesktop();
  const menu = nativeMenu();
  const usesNativeMenu = menu !== undefined;
  const triggerRef = useRef<View>(null);
  /*
    A tablet opens the choices beside the control — see
    `lib/select-popover.ts`. It used to open the phone's sheet along the
    bottom edge, a screen's length from a control in the far corner of an
    iPad, for a choice of three things.
  */
  const opensBeside = useFormFactor() === 'tablet' && !usesNativeMenu;
  const [anchor, setAnchor] = useState<PopoverAnchor | null>(null);
  const window = useWindowDimensions();

  const open = useCallback(() => {
    if (disabled) return;
    if (!opensBeside || !triggerRef.current) {
      setIsOpen(true);
      return;
    }
    // Measured when pressed, not when laid out: the control may have
    // scrolled since, and the menu belongs where it is now.
    measureAnchor(triggerRef.current, measured => {
      setAnchor(measured);
      setIsOpen(true);
    });
  }, [disabled, opensBeside]);

  const selectedOption = options.find(opt => opt.value === value);

  const handleSelect = useCallback(
    (optionValue: string) => {
      onValueChange?.(optionValue);
      setIsOpen(false);
    },
    [onValueChange]
  );

  const handleNativeMenuPress = useCallback(async () => {
    if (disabled || !menu || !triggerRef.current) return;
    triggerRef.current.measureInWindow((x, y, _width, height) => {
      const items = options
        .filter(opt => !opt.disabled)
        .map(opt => ({
          key: opt.value,
          label: opt.label,
          selected: opt.value === value,
        }));
      menu.show(items, x, y + height).then(selected => {
        if (selected) {
          onValueChange?.(selected);
        }
      });
    });
  }, [disabled, menu, options, value, onValueChange]);

  const renderOption = ({ item }: { item: SelectOption; index: number }) => (
    <Pressable
      {...pressProps(
        () => !item.disabled && handleSelect(item.value),
        item.disabled
      )}
      disabled={item.disabled}
      className={cn(
        'px-4 py-3 border-b border-border',
        item.value === value && 'bg-primary/10',
        item.disabled && 'opacity-50'
      )}
      accessibilityRole='button'
      accessibilityState={{
        selected: item.value === value,
        disabled: item.disabled,
      }}
    >
      <View className='flex flex-row items-center justify-between'>
        <Text
          className={cn(
            typography.size.base,
            item.value === value
              ? `text-primary ${typography.weight.medium}`
              : 'text-foreground'
          )}
        >
          {item.label}
        </Text>
        {item.value === value && <Text className='text-primary'>✓</Text>}
      </View>
    </Pressable>
  );

  return (
    <>
      {/* Trigger */}
      <View ref={triggerRef} collapsable={false}>
        <Pressable
          {...pressProps(
            usesNativeMenu ? handleNativeMenuPress : open,
            disabled
          )}
          disabled={disabled}
          /*
            The border and the height are classes, not `style`. As style they
            beat any class a caller passed: the border was a palette grey that
            stayed light in a dark theme, and a trigger beside a 44-point
            button could not be given its height, so a row of the two came out
            ragged. `border-input` is the border the theme gives a field.
          */
          className={cn(
            'bg-card border border-input min-h-[36px]',
            disabled && 'opacity-50',
            className
          )}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 6,
          }}
          accessibilityRole='combobox'
          {...(accessibilityLabel ? { accessibilityLabel } : {})}
          accessibilityState={{ disabled, expanded: isOpen }}
        >
          <Text
            className={cn(
              typography.size.base,
              selectedOption ? 'text-foreground' : 'text-muted-foreground'
            )}
            numberOfLines={1}
            /*
              Not `flex: 1`. That is a flex-basis of zero — a claim the label
              needs no width — so inside a row whose own width comes from its
              content the trigger measured as padding plus chevron and the value
              was invisible. See `lib/select-trigger.ts`.
            */
            style={selectTriggerLabelStyle}
          >
            {selectedOption?.label || placeholder}
          </Text>
          <Svg
            width={16}
            height={16}
            viewBox='0 0 20 20'
            style={{ marginLeft: 8 }}
            className='text-muted-foreground'
          >
            <Path
              fillRule='evenodd'
              d='M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z'
              clipRule='evenodd'
              fill='currentColor'
            />
          </Svg>
        </Pressable>
      </View>

      {/*
        The drawn picker: every phone and tablet, and any desktop whose app
        provides no native menu. A sheet rising from the bottom edge is a
        touch idiom, so on a desktop it is a card in the middle of the window
        instead, and the dimmed area around it dismisses it as a click
        outside a menu would.
      */}
      {opensBeside && anchor ? (
        <ModalHost
          visible={isOpen}
          animationType='fade'
          presentation='popover'
          onRequestClose={() => setIsOpen(false)}
        >
          {/*
            Clear, not dimmed: what is behind a menu stays as it was. A press
            anywhere outside the card puts the menu away, as it does for the
            platform's own.
          */}
          <Pressable
            {...pressProps(() => setIsOpen(false))}
            accessibilityRole='none'
            accessible={false}
            style={StyleSheet.absoluteFill}
          />
          <View
            testID='select-popover'
            className='bg-card rounded-lg border border-border'
            style={[styles.popover, popoverPlacement(anchor, window)]}
          >
            <FlatList
              data={options}
              renderItem={renderOption}
              keyExtractor={(item: SelectOption) => item.value}
              accessibilityLabel={accessibilityLabel ?? title}
            />
          </View>
        </ModalHost>
      ) : null}
      {!usesNativeMenu && !opensBeside && (
        <ModalHost
          visible={isOpen}
          animationType={isDesktop ? 'fade' : 'slide'}
          presentation={isDesktop ? 'dialog' : 'fullScreen'}
          onRequestClose={() => setIsOpen(false)}
        >
          <Pressable
            {...pressProps(() => setIsOpen(false))}
            accessibilityRole='none'
            accessible={false}
            className={cn(
              'flex-1 bg-black/50',
              isDesktop ? 'items-center justify-center p-6' : 'justify-end'
            )}
          >
            {/*
              Swallows the press, so choosing inside the card is not also a
              click on the backdrop behind it.
            */}
            <Pressable
              {...pressProps(() => undefined)}
              accessibilityRole='none'
              accessible={false}
              style={isDesktop ? { width: '100%', maxWidth: 420 } : undefined}
            >
              <SafeAreaView
                edges={safeEdges}
                className={cn(
                  'bg-card',
                  isDesktop ? 'rounded-xl border border-border' : 'rounded-t-xl'
                )}
              >
                {/* Header */}
                <View className='flex flex-row items-center justify-between px-4 py-3 border-b border-border'>
                  <Pressable
                    {...pressProps(() => setIsOpen(false))}
                    accessibilityRole='button'
                  >
                    <Text className={cn('text-primary', typography.size.base)}>
                      Cancel
                    </Text>
                  </Pressable>
                  <Text
                    className={cn(
                      typography.size.base,
                      typography.weight.semibold,
                      'text-foreground'
                    )}
                  >
                    {accessibilityLabel ?? title}
                  </Text>
                  <View style={{ width: 60 }} />
                </View>

                {/* Options */}
                <FlatList
                  data={options}
                  renderItem={renderOption}
                  keyExtractor={(item: SelectOption) => item.value}
                  style={{ maxHeight: isDesktop ? 360 : 300 }}
                />
              </SafeAreaView>
            </Pressable>
          </Pressable>
        </ModalHost>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  // Lifted off what it covers, which is what says "over" where nothing is
  // dimmed to say it.
  popover: {
    position: 'absolute',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
});

/**
 * SelectTrigger - For compound component pattern
 */
export const SelectTrigger = Select;

/**
 * SelectValue - Display component for the selected value
 */
export const SelectValue: React.FC<{ placeholder?: string }> = ({
  placeholder = 'Select...',
}) => <Text className='text-muted-foreground'>{placeholder}</Text>;
