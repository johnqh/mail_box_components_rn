/**
 * Every control here is reachable by assistive technology, not only by a press.
 *
 * On react-native-macos an assistive activation arrives as `onAccessibilityTap`
 * and not as `onPress` — there is no synthesized touch behind it — so a
 * touchable wired with `onPress` alone announces itself, takes focus, and then
 * does nothing. Every touchable in this package spreads `pressProps` from
 * `@sudobility/components-rn`, which returns both routes from one handler.
 *
 * `accessibility-tap-guard.test.ts` is the structural half: it parses the
 * source, so a component added tomorrow is covered without a case here.
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import type { ReactTestInstance } from 'react-test-renderer';
import { Avatar } from '../Avatar';
import { ProviderButtons } from '../ProviderButtons';
import { EmailSignInForm } from '../EmailSignInForm';
import { ForgotPasswordForm } from '../ForgotPasswordForm';
import { AuthProvider, createDefaultErrorTexts } from '../AuthProvider';
import { pressProps } from '@sudobility/components-rn';

/*
  Mocked the way this package's other suites mock it: jest's rootDir is this
  package, so the real library's own imports (`@sudobility/types`) resolve
  outside the haste map and the module cannot be loaded here. `pressProps` is
  written out rather than stubbed — a stub would let every wiring assertion
  below pass while nothing worked on a Mac — and the two tests directly under
  this mock are what stop it drifting from the real one. The real
  implementation is proven in components-rn's own `a11y.test.ts`.
*/
jest.mock('@sudobility/components-rn', () => ({
  cn: (...args: unknown[]) => args.filter(Boolean).join(' '),
  pressProps: (onPress?: (e?: unknown) => unknown, disabled?: boolean) => ({
    onPress,
    onAccessibilityTap:
      !onPress || disabled ? undefined : () => onPress(undefined),
  }),
  Button: (props: Record<string, unknown>) => {
    const RN = require('react-native');
    const R = require('react');
    return R.createElement(
      RN.Pressable,
      {
        onPress: props.onPress,
        disabled: props.disabled,
        accessibilityRole: 'button',
      },
      typeof props.children === 'string'
        ? R.createElement(RN.Text, null, props.children)
        : props.children
    );
  },
  Card: (props: Record<string, unknown>) => {
    const RN = require('react-native');
    const R = require('react');
    return R.createElement(RN.View, null, props.children);
  },
}));

const texts = {
  signInTitle: 'Sign In',
  signInWithEmail: 'Sign in with Email',
  createAccount: 'Create Account',
  resetPassword: 'Reset Password',
  signIn: 'Sign In',
  signUp: 'Sign Up',
  logout: 'Log Out',
  login: 'Log In',
  continueWithGoogle: 'Continue with Google',
  continueWithApple: 'Continue with Apple',
  continueWithEmail: 'Continue with Email',
  sendResetLink: 'Send Reset Link',
  backToSignIn: 'Back to Sign In',
  close: 'Close',
  email: 'Email',
  password: 'Password',
  confirmPassword: 'Confirm Password',
  displayName: 'Display Name',
  emailPlaceholder: 'you@example.com',
  passwordPlaceholder: 'Enter password',
  confirmPasswordPlaceholder: 'Confirm password',
  displayNamePlaceholder: 'Your name',
  forgotPassword: 'Forgot password?',
  noAccount: "Don't have an account?",
  haveAccount: 'Already have an account?',
  or: 'or',
  resetEmailSent: 'Email Sent',
  resetEmailSentDesc: 'Check {{email}} for a reset link.',
  passwordMismatch: 'Passwords do not match',
  passwordTooShort: 'Password must be at least 6 characters',
  loading: 'Loading...',
};

function withProvider(ui: React.ReactElement) {
  return render(
    <AuthProvider
      providerConfig={{ providers: ['google', 'email'] }}
      texts={texts}
      errorTexts={createDefaultErrorTexts()}
    >
      {ui}
    </AuthProvider>
  );
}

const user = {
  uid: 'u1',
  email: 'ada@example.com',
  displayName: 'Ada Lovelace',
  photoURL: null,
  isAnonymous: false,
  emailVerified: true,
  providerId: 'password',
};

/**
 * The touchable host under or above `element`.
 *
 * `fireEvent` cannot prove the disabled half on its own: React Native Testing
 * Library refuses to deliver any event through a host whose
 * `onStartShouldSetResponder` answers false, so a disabled control looks inert
 * whether or not it is actually wired. The platform has no such courtesy, so
 * the assertion reads the prop.
 */
function touchableFor(element: ReactTestInstance): ReactTestInstance {
  let node: ReactTestInstance | null = element;
  while (node) {
    if (
      typeof node.type === 'string' &&
      typeof node.props.onStartShouldSetResponder === 'function'
    ) {
      return node;
    }
    node = node.parent;
  }
  throw new Error('no touchable found for the element under test');
}

describe('pressProps, as this package receives it', () => {
  // The suite runs against a mock of components-rn; if that mock ever became a
  // stub, every wiring assertion below would pass while nothing worked.
  it('returns both activation routes', () => {
    const onPress = jest.fn();
    const props = pressProps(onPress);
    expect(props.onPress).toBe(onPress);
    props.onAccessibilityTap?.();
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('withholds the tap when disabled', () => {
    expect(pressProps(jest.fn(), true).onAccessibilityTap).toBeUndefined();
  });
});

describe('Avatar', () => {
  it('runs its handler on a press', () => {
    const onPress = jest.fn();
    render(<Avatar user={user} onPress={onPress} />);
    fireEvent.press(screen.getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('runs its handler on an accessibility tap', () => {
    const onPress = jest.fn();
    render(<Avatar user={user} onPress={onPress} />);
    fireEvent(screen.getByRole('button'), 'accessibilityTap');
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

describe('ProviderButtons', () => {
  it('runs its handler on a press', () => {
    const onEmailPress = jest.fn();
    withProvider(
      <ProviderButtons providers={['email']} onEmailPress={onEmailPress} />
    );
    fireEvent.press(screen.getByText('Continue with Email'));
    expect(onEmailPress).toHaveBeenCalledTimes(1);
  });

  it('runs its handler on an accessibility tap', () => {
    const onEmailPress = jest.fn();
    withProvider(
      <ProviderButtons providers={['email']} onEmailPress={onEmailPress} />
    );
    fireEvent(screen.getByText('Continue with Email'), 'accessibilityTap');
    expect(onEmailPress).toHaveBeenCalledTimes(1);
  });
});

describe('EmailSignInForm switch links', () => {
  const setup = () => {
    const onSwitchToSignUp = jest.fn();
    withProvider(
      <EmailSignInForm
        onSwitchToSignUp={onSwitchToSignUp}
        onSwitchToForgotPassword={jest.fn()}
      />
    );
    return onSwitchToSignUp;
  };

  it('runs its handler on a press', () => {
    const onSwitchToSignUp = setup();
    fireEvent.press(screen.getByText('Sign Up'));
    expect(onSwitchToSignUp).toHaveBeenCalledTimes(1);
  });

  it('runs its handler on an accessibility tap', () => {
    const onSwitchToSignUp = setup();
    fireEvent(screen.getByText('Sign Up'), 'accessibilityTap');
    expect(onSwitchToSignUp).toHaveBeenCalledTimes(1);
  });
});

describe('EmailSignInForm submit button', () => {
  // Empty fields disable it, which is this package's only disabled state.
  it('offers neither route while the form is incomplete', () => {
    withProvider(
      <EmailSignInForm
        onSwitchToSignUp={jest.fn()}
        onSwitchToForgotPassword={jest.fn()}
      />
    );
    const submit = screen.getByLabelText('Sign In');
    expect(touchableFor(submit).props.onAccessibilityTap).toBeUndefined();
    expect(submit.props.accessibilityState).toEqual({ disabled: true });
  });
});

describe('ForgotPasswordForm submit button', () => {
  it('offers neither route while the form is incomplete', () => {
    withProvider(<ForgotPasswordForm onSwitchToSignIn={jest.fn()} />);
    const submit = screen.getByLabelText('Send Reset Link');
    expect(touchableFor(submit).props.onAccessibilityTap).toBeUndefined();
    expect(submit.props.accessibilityState).toEqual({ disabled: true });
  });
});
