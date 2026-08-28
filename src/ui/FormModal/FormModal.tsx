import * as React from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { ModalHost } from '../ModalHost';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cn } from '../../lib/utils';
import { designTokens } from '@sudobility/design';
import { Button } from '../Button';
import type { ButtonProps } from '../Button';
import { Heading } from '../Heading';

const { typography } = designTokens;

/**
 * One button in the modal's bottom bar.
 *
 * Exists so the same shell can carry the footers real dialogs need — a
 * destructive confirm, a wizard's Back/Next pair, three peer choices — rather
 * than only the single primary CTA a save-form wants. Mirrors the web
 * package's `FormModalAction` field for field, so a dialog written for one
 * platform ports without its footer being redesigned.
 */
export interface FormModalAction {
  /** Button text, also its accessible name unless `accessibilityLabel` overrides it. */
  label: string;
  onPress: () => void;
  /** Defaults to `'primary'` for the last action and `'ghost'` for the others. */
  variant?: ButtonProps['variant'];
  disabled?: boolean;
  /** Shows a spinner in place of the label and disables the button. */
  loading?: boolean;
  /** Overrides the accessible name when `label` is ambiguous elsewhere. */
  accessibilityLabel?: string;
}

/** Props for the {@link FormModal} component. */
export interface FormModalProps {
  /** Whether the modal is visible. */
  visible: boolean;
  /** Title shown in the top bar. */
  title: string;
  /** Called when the user cancels (top-bar close button, overlay press on desktop, or hardware back). */
  onClose: () => void;
  /**
   * Called when the user activates the primary confirmation button. Renders a
   * single full-width CTA. Omit it and pass {@link FormModalProps.actions} for
   * any other footer; omit both for a modal with no actions at all.
   */
  onSave?: () => void;
  /**
   * Bottom-bar buttons, in visual order — the last is the primary one. Takes
   * precedence over `onSave`/`saveLabel`. Pass `[]` for no bottom bar.
   */
  actions?: FormModalAction[];
  /** Whether the confirm action is in progress. */
  saving?: boolean;
  /** Whether the confirm action is currently allowed. */
  canSave?: boolean;
  /** Label for the primary confirmation button (e.g. "Save", "OK"). */
  saveLabel?: string;
  /** Dialog width on tablet/desktop. */
  size?: 'small' | 'medium' | 'large';
  closeOnOverlayClick?: boolean;
  /**
   * The accessible name of the top-bar close control.
   *
   * Any dialog whose footer already has a Cancel must set this to something
   * else: two controls with one accessible name are ambiguous read aloud.
   */
  closeAriaLabel?: string;
  /** Extra element rendered in the top bar, before the close button. */
  headerRight?: React.ReactNode;
  children: React.ReactNode;
}

/** Screens at or above this width render the modal as a centered dialog. */
const TABLET_MIN_WIDTH = 768;

const SIZE_WIDTH: Record<NonNullable<FormModalProps['size']>, number> = {
  small: 400,
  medium: 520,
  large: 720,
};

/**
 * A responsive form modal with a fixed top bar (title + cancel), a vertically
 * scrollable content area, and a sticky bottom bar holding the positive
 * confirmation button.
 *
 * Full-screen on phones, centered dialog on tablets/desktops.
 *
 * Prefer this over composing `Modal` + `ModalHeader/Content/Footer` for forms.
 */
export const FormModal: React.FC<FormModalProps> = props => {
  const { width } = useWindowDimensions();
  // Phones render a full-screen sheet, so it should slide up from the bottom
  // like a native modal; tablets render a centered dialog over a dim backdrop,
  // where a fade reads correctly (sliding the whole overlay up would look off).
  const isLarge = width >= TABLET_MIN_WIDTH;
  return (
    <ModalHost
      visible={props.visible}
      animationType={isLarge ? 'fade' : 'slide'}
      onRequestClose={props.onClose}
    >
      {/* ModalHost re-provides the SafeAreaProvider a detached view tree
          loses, so insets resolve inside here without a second one. */}
      <FormModalContent {...props} />
    </ModalHost>
  );
};

function FormModalContent({
  title,
  onClose,
  onSave,
  saving = false,
  actions,
  canSave = true,
  saveLabel = 'Save',
  size = 'medium',
  closeOnOverlayClick = true,
  closeAriaLabel = 'Cancel',
  headerRight,
  children,
}: FormModalProps) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isLarge = width >= TABLET_MIN_WIDTH;
  const disabled = !canSave || saving;

  const header = (
    <View className='flex-row items-center justify-between border-b border-border px-4 py-3'>
      <View className='flex-1 pr-3'>
        <Heading level={2} size='lg' weight='semibold'>
          {title}
        </Heading>
      </View>
      {headerRight}
      <Pressable
        onPress={saving ? undefined : onClose}
        accessibilityRole='button'
        accessibilityLabel={closeAriaLabel}
        className='rounded-full p-1'
      >
        <Text className={cn(typography.size.xl, 'text-muted-foreground')}>
          ✕
        </Text>
      </Pressable>
    </View>
  );

  const body = (
    <ScrollView
      /*
        Sized per branch, because the two branches give it different parents.

        The centred dialog's container has a `maxHeight` and no height, so it
        sizes to its content — and `flex: 1` compiles to `flexBasis: 0%`, which
        against a parent with no definite height resolves to **zero**. The
        header and footer have intrinsic height and survive; the body vanishes,
        leaving a dialog that is a title and some buttons with nothing between
        them. Shrink-only lets it take its content height and still give way to
        the container's `maxHeight` when the content is tall.

        The full-screen branch keeps `flex: 1`: there the parent really is
        `flex-1`, so the basis has a height to resolve against.
      */
      style={isLarge ? { flexGrow: 0, flexShrink: 1 } : { flex: 1 }}
      keyboardShouldPersistTaps='handled'
      bounces={false}
    >
      <View className='px-4 py-4'>{children}</View>
    </ScrollView>
  );

  /*
    Three footers, in precedence order: an explicit `actions` list, then the
    `onSave` shorthand, then none at all. `actions={[]}` therefore means "no
    bottom bar" rather than falling through to the CTA — which is what a
    dialog whose settings apply on change needs.
  */
  const footer = actions ? (
    actions.length === 0 ? null : (
      <View className='flex-row justify-end gap-2 border-t border-border px-4 py-3'>
        {actions.map((action, index) => (
          <Button
            key={action.label}
            variant={
              action.variant ??
              (index === actions.length - 1 ? 'primary' : 'ghost')
            }
            onPress={action.onPress}
            disabled={action.disabled || action.loading}
            loading={action.loading ?? false}
            {...(action.accessibilityLabel
              ? { accessibilityLabel: action.accessibilityLabel }
              : {})}
          >
            {action.label}
          </Button>
        ))}
      </View>
    )
  ) : onSave ? (
    <View className='border-t border-border px-4 py-3'>
      <Button
        variant='primary'
        onPress={onSave}
        disabled={disabled}
        loading={saving}
        className='w-full'
      >
        {saveLabel}
      </Button>
    </View>
  ) : null;

  if (isLarge) {
    // Centered dialog (tablet / desktop)
    return (
      <Pressable
        onPress={closeOnOverlayClick && !saving ? onClose : undefined}
        className='flex-1 items-center justify-center bg-black/50 px-4'
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          className='w-full items-center'
        >
          <Pressable
            onPress={e => e.stopPropagation()}
            style={{
              width: Math.min(SIZE_WIDTH[size], width - 32),
              maxHeight: height * 0.85,
            }}
            className='overflow-hidden rounded-xl bg-card shadow-xl'
          >
            {header}
            {body}
            {footer}
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    );
  }

  // Full-screen (phone)
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className='flex-1 bg-background'
      style={{ paddingTop: insets.top }}
    >
      {header}
      {body}
      <View style={{ paddingBottom: insets.bottom }}>{footer}</View>
    </KeyboardAvoidingView>
  );
}
