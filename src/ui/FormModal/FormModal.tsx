import * as React from 'react';
import { TABLET_MIN_WIDTH } from '../../lib/large-screen';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import { HAS_NATIVE_PRESENTATION, ModalHost } from '../ModalHost';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cn } from '../../lib/utils';
import { designTokens } from '@sudobility/design';
import { Button } from '../Button';
import type { ButtonProps } from '../Button';

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
// Shared with `SheetSelector`, so a dialog and the picker inside it cannot
// disagree about when a window is big enough for a centred panel.

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
 * **The shell is the same three parts everywhere**, and callers get them by
 * saying what goes in each rather than by laying anything out:
 *
 * 1. a **bar** carrying the `title` and the dismiss control — see the header
 *    below for why those sit differently on iOS and Android;
 * 2. the **content**, which is `children` and scrolls when it is taller than
 *    the space it is given;
 * 3. the **actions**, optional, and **always against the bottom edge** —
 *    `actions` for an ordered list, `onSave` for a single CTA, `actions={[]}`
 *    for none at all.
 *
 * Nothing about that changes with the platform. What changes is the shell they
 * sit in: full-screen on phones, a dialog on tablets and desktops.
 *
 * **The dialog is the platform's own where the platform has one.** On iPadOS
 * that is a UIKit form sheet — the system draws the corners, the shadow, the
 * dimmed background and the drag-to-dismiss, so it looks like every other
 * dialog on the device rather than like a white box this library painted. On
 * Android and macOS there is no such presentation to ask for (RN's `Modal`
 * offers no Android dialog, and macOS has no `RCTModalHostView` at all), so
 * those keep the drawn frame — which is what a Material dialog and a macOS
 * panel look like anyway.
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
      presentation={isLarge ? 'sheet' : 'fullScreen'}
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

  /*
    The top bar, laid out the way each platform lays out *its* top bar.

    This used to be one arrangement everywhere — a large left-aligned heading
    with a small ✕ floating at the right — which is neither platform's
    convention and is why the dialog read as "not native" even once iOS was
    presenting a real form sheet. The two conventions genuinely differ, and the
    difference is not decoration:

    - **iOS / iPadOS / macOS: a navigation bar.** 44pt tall, the title centred
      and set in the system's 17pt semibold, and the dismiss control as a
      *bar button item* at the trailing edge. Centring the title is what makes
      it read as a title rather than as the first line of the content.
    - **Android: an app bar.** 56dp tall, and the dismiss control is the
      **navigation icon at the leading edge** — where Up/Close lives on
      Android — with the title after it at the 72dp keyline. Putting the close
      control on the right is an iOS habit that looks wrong here, and putting
      the title in the middle looks wronger still.

    Both give the dismiss control a 44/48pt touch target, which is the figure
    each platform's own guidance asks for and which the old 1-padding ✕ was
    well under.
  */
  const isAndroid = Platform.OS === 'android';

  const closeButton = (
    <Pressable
      onPress={saving ? undefined : onClose}
      accessibilityRole='button'
      accessibilityLabel={closeAriaLabel}
      disabled={saving}
      hitSlop={8}
      style={{
        width: isAndroid ? 48 : 44,
        height: isAndroid ? 48 : 44,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: saving ? 0.4 : 1,
      }}
    >
      {/*
        Tinted like a bar button, not like body text. A dismiss control set in
        the muted foreground reads as disabled; on both platforms the bar's
        actions take the accent colour.
      */}
      <Text
        className={cn(
          typography.size.xl,
          isAndroid ? 'text-foreground' : 'text-primary'
        )}
      >
        ✕
      </Text>
    </Pressable>
  );

  const header = isAndroid ? (
    // App bar: navigation icon, then the title on the keyline, then actions.
    <View
      className='flex-row items-center border-b border-border'
      style={{ height: 56, paddingLeft: 4, paddingRight: 4 }}
    >
      {closeButton}
      <View className='flex-1' style={{ paddingLeft: 20 }}>
        <Text
          accessibilityRole='header'
          numberOfLines={1}
          className='text-foreground text-xl font-medium'
        >
          {title}
        </Text>
      </View>
      {headerRight}
    </View>
  ) : (
    // Navigation bar: centred title, dismiss as a trailing bar button item.
    <View
      className='flex-row items-center border-b border-border'
      style={{ height: 44, paddingHorizontal: 8 }}
    >
      {/*
        The leading spacer is what actually centres the title: with only a
        trailing button, a `flex-1` title centres itself in the space *left
        over*, which is off-centre by half the button. Matching the trailing
        width on both sides makes the centre the bar's centre.
      */}
      <View style={{ width: 44 }} />
      <View className='flex-1 items-center px-1'>
        {/*
          A `Text`, not the library's `Heading`: a bar title has to truncate to
          one line, and `Heading` takes no `numberOfLines` — a long title
          wrapped to two lines and pushed the bar out of its 44pt height.
        */}
        <Text
          accessibilityRole='header'
          numberOfLines={1}
          className='text-foreground text-base font-semibold'
        >
          {title}
        </Text>
      </View>
      {headerRight}
      {closeButton}
    </View>
  );

  /*
    Whether the content should hug its own height rather than fill the shell.

    The question is not "is this a tablet" — it is **does this shell have a
    definite height**, and only the drawn centred dialog does not. That one is
    sized by `maxHeight` and grows to its content, so `flex: 1` there compiles
    to `flexBasis: 0%` against a parent with no height and resolves to *zero*:
    the bar and the actions have intrinsic height and survive, the content
    vanishes, and the dialog is a title and some buttons with nothing between.

    Every other shell — a native form sheet, a native full screen, a drawn full
    screen — is `flex-1` with a real height, so the content fills it and the
    actions are pushed to the bottom, which is where they belong. Keying this
    off `isLarge` was what left the buttons floating in the middle of an iPad
    form sheet: the sheet is a fixed size the system chooses, and content that
    hugs leaves the rest of it empty underneath.
  */
  const hugsContent = !HAS_NATIVE_PRESENTATION && isLarge;

  const body = (
    <ScrollView
      style={hugsContent ? { flexGrow: 0, flexShrink: 1 } : { flex: 1 }}
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

  /*
    Where the platform presented the dialog itself, the content just fills it.

    UIKit has already drawn the sheet and dimmed what is behind it, so painting
    a backdrop and a rounded card *inside* that sheet would stack two frames:
    a grey border around a white box inside the system's own white box. The
    same is true of the full-screen presentation on a phone.
  */
  if (HAS_NATIVE_PRESENTATION) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className='flex-1 bg-card'
      >
        {header}
        {body}
        {/*
          Below the content, not after it. The content is `flex: 1` here, so it
          takes the sheet's remaining height and the actions land against the
          bottom edge — which is what makes a fixed-size form sheet look
          deliberate rather than half-filled.
        */}
        {footer}
      </KeyboardAvoidingView>
    );
  }

  if (isLarge) {
    // Centered dialog drawn by us (Android tablet, macOS)
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
