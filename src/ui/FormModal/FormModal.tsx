import * as React from 'react';
import {
  View,
  Text,
  Modal as RNModal,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  useWindowDimensions,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { cn } from '../../lib/utils';
import { designTokens } from '@sudobility/design';
import { Button } from '../Button';
import { Heading } from '../Heading';

const { typography } = designTokens;

/** Props for the {@link FormModal} component. */
export interface FormModalProps {
  /** Whether the modal is visible. */
  visible: boolean;
  /** Title shown in the top bar. */
  title: string;
  /** Called when the user cancels (top-bar close button, overlay press on desktop, or hardware back). */
  onClose: () => void;
  /** Called when the user activates the primary confirmation button. */
  onSave: () => void;
  /** Whether the confirm action is in progress. */
  saving?: boolean;
  /** Whether the confirm action is currently allowed. */
  canSave?: boolean;
  /** Label for the primary confirmation button (e.g. "Save", "OK"). */
  saveLabel?: string;
  /** Dialog width on tablet/desktop. */
  size?: 'small' | 'medium' | 'large';
  closeOnOverlayClick?: boolean;
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
  return (
    <RNModal
      visible={props.visible}
      animationType='fade'
      transparent
      onRequestClose={props.onClose}
      statusBarTranslucent
    >
      {/* RN <Modal> renders in a detached view tree where the app's
          SafeAreaProvider doesn't reach; re-provide it so insets resolve. */}
      <SafeAreaProvider>
        <FormModalContent {...props} />
      </SafeAreaProvider>
    </RNModal>
  );
};

function FormModalContent({
  title,
  onClose,
  onSave,
  saving = false,
  canSave = true,
  saveLabel = 'Save',
  size = 'medium',
  closeOnOverlayClick = true,
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
        accessibilityLabel='Cancel'
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
      className='flex-1'
      keyboardShouldPersistTaps='handled'
      bounces={false}
    >
      <View className='px-4 py-4'>{children}</View>
    </ScrollView>
  );

  const footer = (
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
  );

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
