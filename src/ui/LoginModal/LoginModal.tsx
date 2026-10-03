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
  /**
   * Which form each opening starts on (default: 'signIn') — a "Create
   * account" button passes 'signUp'. A mode the form has no way to do opens
   * on signing in, and the title follows.
   */
  initialMode?: LoginViewMode;
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
  initialMode = 'signIn',
  ...view
}: LoginModalProps) {
  const text = { ...DEFAULT_LOGIN_MODAL_TEXT, ...modalText };
  const [requestedMode, setMode] = React.useState<LoginViewMode>(initialMode);
  // Every opening starts afresh on `initialMode`, not where the last one
  // was left.
  React.useEffect(() => {
    if (visible) setMode(initialMode);
  }, [visible, initialMode]);
  const mode: LoginViewMode =
    (requestedMode === 'signUp' && !view.onEmailSignUp) ||
    (requestedMode === 'resetPassword' && !view.onPasswordReset)
      ? 'signIn'
      : requestedMode;
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
      // `medium` is 520 wide: the form at its full 448
      // (`LOGIN_VIEW_MAX_WIDTH`) inside the card's padding — the web
      // modal's 480 is the same form inside 16 either side.
      size='medium'
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
