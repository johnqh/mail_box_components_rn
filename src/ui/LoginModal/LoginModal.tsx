import * as React from 'react';
import { FormModal } from '../FormModal';
import { LoginView } from '../LoginView';
import type { LoginViewMode, LoginViewProps } from '../LoginView';

export interface LoginModalText {
  /** The bar's title while signing in. */
  signInTitle: string;
  /** The bar's title while creating an account. */
  signUpTitle: string;
  /** The bar's title while sending a link to reset a password. */
  resetPasswordTitle: string;
  /** The accessible name of the close button. */
  close: string;
}

export const DEFAULT_LOGIN_MODAL_TEXT: LoginModalText = {
  signInTitle: 'Sign in',
  signUpTitle: 'Create your account',
  resetPasswordTitle: 'Reset your password',
  close: 'Close',
};

export interface LoginModalProps extends Omit<
  LoginViewProps,
  'mode' | 'onModeChange' | 'className' | 'style'
> {
  visible: boolean;
  /** The close button, the backdrop, hardware Back — and a successful sign-in. */
  onClose: () => void;
  modalText?: Partial<LoginModalText>;
}

/**
 * `LoginView` in a modal: a title bar with a close button, and the form.
 *
 * The shell is `FormModal` with no bottom bar — the form's own button is the
 * action, and a second one beneath it would be two ways to submit. Full
 * screen on a phone and a dialog on a tablet or a desktop, as every
 * `FormModal` is. Signing in closes the modal, after `onSuccess` has been
 * told.
 */
export function LoginModal({
  visible,
  onClose,
  onSuccess,
  modalText,
  ...view
}: LoginModalProps) {
  const text = { ...DEFAULT_LOGIN_MODAL_TEXT, ...modalText };
  const [mode, setMode] = React.useState<LoginViewMode>('signIn');
  return (
    <FormModal
      visible={visible}
      title={
        mode === 'signUp'
          ? text.signUpTitle
          : mode === 'resetPassword'
            ? text.resetPasswordTitle
            : text.signInTitle
      }
      onClose={onClose}
      actions={[]}
      closeAriaLabel={text.close}
      // `small` is 400 wide: the form at its full 360, inside the padding.
      size='small'
    >
      <LoginView
        {...view}
        mode={mode}
        onModeChange={setMode}
        onSuccess={() => {
          onSuccess?.();
          onClose();
        }}
      />
    </FormModal>
  );
}
