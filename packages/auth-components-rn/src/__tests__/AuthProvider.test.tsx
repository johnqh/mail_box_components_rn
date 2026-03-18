import React from 'react';
import { render, screen, act } from '@testing-library/react-native';
import { Text } from 'react-native';
import {
  AuthProvider,
  useAuthStatus,
  createDefaultErrorTexts,
} from '../AuthProvider';

// Mock @sudobility/components-rn (imported by child components)
jest.mock('@sudobility/components-rn', () => ({
  cn: function () {
    var args = Array.prototype.slice.call(arguments);
    return args.filter(Boolean).join(' ');
  },
  Button: function (props) {
    var RN = require('react-native');
    var R = require('react');
    return R.createElement(
      RN.Pressable,
      { onPress: props.onPress, disabled: props.disabled, accessibilityRole: 'button' },
      typeof props.children === 'string'
        ? R.createElement(RN.Text, null, props.children)
        : props.children
    );
  },
  Card: function (props) {
    var RN = require('react-native');
    var R = require('react');
    return R.createElement(RN.View, null, props.children);
  },
}));

var defaultTexts = {
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

var defaultErrorTexts = createDefaultErrorTexts();

var defaultProviderConfig = {
  providers: ['google', 'email'],
};

function renderWithProvider(ui, options) {
  var opts = options || {};
  return render(
    <AuthProvider
      providerConfig={defaultProviderConfig}
      texts={defaultTexts}
      errorTexts={defaultErrorTexts}
      callbacks={opts.callbacks}
      resolveErrorMessage={opts.resolveErrorMessage}
    >
      {ui}
    </AuthProvider>
  );
}

/** Helper component that exposes context values via text */
function AuthStatusDisplay() {
  var ctx = useAuthStatus();
  return (
    <>
      <Text testID="loading">{String(ctx.loading)}</Text>
      <Text testID="error">{ctx.error != null ? ctx.error : 'null'}</Text>
      <Text testID="isAuthenticated">{String(ctx.isAuthenticated)}</Text>
      <Text testID="isAnonymous">{String(ctx.isAnonymous)}</Text>
      <Text testID="user">{ctx.user ? ctx.user.uid : 'null'}</Text>
    </>
  );
}

describe('AuthProvider', () => {
  describe('createDefaultErrorTexts', () => {
    it('returns an object with expected error keys', () => {
      var texts = createDefaultErrorTexts();
      expect(texts['auth/user-not-found']).toBe(
        'No account found with this email.'
      );
      expect(texts['auth/wrong-password']).toBe('Incorrect password.');
      expect(texts.default).toBe('An error occurred. Please try again.');
    });
  });

  describe('useAuthStatus outside provider', () => {
    it('throws when used outside AuthProvider', () => {
      var spy = jest.spyOn(console, 'error').mockImplementation(function () {});

      expect(function () {
        render(<AuthStatusDisplay />);
      }).toThrow('useAuthStatus must be used within an AuthProvider');

      spy.mockRestore();
    });
  });

  describe('initial state', () => {
    it('starts with loading false after mount and no user', async () => {
      renderWithProvider(<AuthStatusDisplay />);

      await act(async () => {});

      expect(screen.getByTestId('loading').props.children).toBe('false');
      expect(screen.getByTestId('user').props.children).toBe('null');
      expect(screen.getByTestId('isAuthenticated').props.children).toBe('false');
      expect(screen.getByTestId('isAnonymous').props.children).toBe('false');
      expect(screen.getByTestId('error').props.children).toBe('null');
    });
  });

  describe('signOut', () => {
    it('calls onSignOut callback on sign out', async () => {
      var onSignOut = jest.fn();

      function SignOutTrigger() {
        var ctx = useAuthStatus();
        return (
          <Text testID="signout" onPress={function () { ctx.signOut(); }}>
            Sign Out
          </Text>
        );
      }

      renderWithProvider(
        <>
          <AuthStatusDisplay />
          <SignOutTrigger />
        </>,
        { callbacks: { onSignOut: onSignOut } }
      );

      await act(async () => {});

      await act(async () => {
        screen.getByTestId('signout').props.onPress();
      });

      expect(onSignOut).toHaveBeenCalledTimes(1);
    });
  });

  describe('signInWithEmail', () => {
    it('sets error when sign-in fails (placeholder implementation)', async () => {
      var onError = jest.fn();

      function SignInTrigger() {
        var ctx = useAuthStatus();
        return (
          <Text
            testID="signin"
            onPress={function () { ctx.signInWithEmail('test@test.com', 'pass'); }}
          >
            Sign In
          </Text>
        );
      }

      renderWithProvider(
        <>
          <AuthStatusDisplay />
          <SignInTrigger />
        </>,
        { callbacks: { onError: onError } }
      );

      await act(async () => {});

      await act(async () => {
        screen.getByTestId('signin').props.onPress();
      });

      expect(screen.getByTestId('error').props.children).toBe(
        'An error occurred. Please try again.'
      );
      expect(onError).toHaveBeenCalledTimes(1);
    });
  });

  describe('signUpWithEmail', () => {
    it('sets error when sign-up fails (placeholder implementation)', async () => {
      function SignUpTrigger() {
        var ctx = useAuthStatus();
        return (
          <Text
            testID="signup"
            onPress={function () {
              ctx.signUpWithEmail('test@test.com', 'pass123', 'Test User');
            }}
          >
            Sign Up
          </Text>
        );
      }

      renderWithProvider(
        <>
          <AuthStatusDisplay />
          <SignUpTrigger />
        </>
      );

      await act(async () => {});

      await act(async () => {
        screen.getByTestId('signup').props.onPress();
      });

      expect(screen.getByTestId('error').props.children).not.toBe('null');
    });
  });

  describe('signInWithGoogle', () => {
    it('sets error when Google sign-in fails (placeholder)', async () => {
      function GoogleTrigger() {
        var ctx = useAuthStatus();
        return (
          <Text testID="google" onPress={function () { ctx.signInWithGoogle(); }}>
            Google
          </Text>
        );
      }

      renderWithProvider(
        <>
          <AuthStatusDisplay />
          <GoogleTrigger />
        </>
      );

      await act(async () => {});

      await act(async () => {
        screen.getByTestId('google').props.onPress();
      });

      expect(screen.getByTestId('error').props.children).not.toBe('null');
    });
  });

  describe('signInWithApple', () => {
    it('sets error when Apple sign-in fails (placeholder)', async () => {
      function AppleTrigger() {
        var ctx = useAuthStatus();
        return (
          <Text testID="apple" onPress={function () { ctx.signInWithApple(); }}>
            Apple
          </Text>
        );
      }

      renderWithProvider(
        <>
          <AuthStatusDisplay />
          <AppleTrigger />
        </>
      );

      await act(async () => {});

      await act(async () => {
        screen.getByTestId('apple').props.onPress();
      });

      expect(screen.getByTestId('error').props.children).not.toBe('null');
    });
  });

  describe('resetPassword', () => {
    it('sets error when password reset fails (placeholder)', async () => {
      function ResetTrigger() {
        var ctx = useAuthStatus();
        return (
          <Text testID="reset" onPress={function () { ctx.resetPassword('test@test.com'); }}>
            Reset
          </Text>
        );
      }

      renderWithProvider(
        <>
          <AuthStatusDisplay />
          <ResetTrigger />
        </>
      );

      await act(async () => {});

      await act(async () => {
        screen.getByTestId('reset').props.onPress();
      });

      expect(screen.getByTestId('error').props.children).not.toBe('null');
    });
  });

  describe('signInAnonymously', () => {
    it('sets error when anonymous sign-in fails (placeholder)', async () => {
      function AnonTrigger() {
        var ctx = useAuthStatus();
        return (
          <Text testID="anon" onPress={function () { ctx.signInAnonymously(); }}>
            Anon
          </Text>
        );
      }

      renderWithProvider(
        <>
          <AuthStatusDisplay />
          <AnonTrigger />
        </>
      );

      await act(async () => {});

      await act(async () => {
        screen.getByTestId('anon').props.onPress();
      });

      expect(screen.getByTestId('error').props.children).not.toBe('null');
    });
  });

  describe('clearError', () => {
    it('clears error state', async () => {
      function ErrorTrigger() {
        var ctx = useAuthStatus();
        return (
          <>
            <Text
              testID="signin"
              onPress={function () { ctx.signInWithEmail('a@b.com', 'p'); }}
            >
              Sign In
            </Text>
            <Text testID="clear" onPress={function () { ctx.clearError(); }}>
              Clear
            </Text>
          </>
        );
      }

      renderWithProvider(
        <>
          <AuthStatusDisplay />
          <ErrorTrigger />
        </>
      );

      await act(async () => {});

      // Trigger an error
      await act(async () => {
        screen.getByTestId('signin').props.onPress();
      });

      expect(screen.getByTestId('error').props.children).not.toBe('null');

      // Clear the error
      await act(async () => {
        screen.getByTestId('clear').props.onPress();
      });

      expect(screen.getByTestId('error').props.children).toBe('null');
    });
  });

  describe('resolveErrorMessage', () => {
    it('uses custom resolveErrorMessage when provided', async () => {
      var customResolver = jest.fn(function (code) {
        return 'Custom: ' + code;
      });

      function ErrorTrigger() {
        var ctx = useAuthStatus();
        return (
          <Text
            testID="signin"
            onPress={function () { ctx.signInWithEmail('a@b.com', 'p'); }}
          >
            Sign In
          </Text>
        );
      }

      renderWithProvider(
        <>
          <AuthStatusDisplay />
          <ErrorTrigger />
        </>,
        { resolveErrorMessage: customResolver }
      );

      await act(async () => {});

      await act(async () => {
        screen.getByTestId('signin').props.onPress();
      });

      expect(customResolver).toHaveBeenCalled();
      expect(screen.getByTestId('error').props.children).toMatch(/^Custom:/);
    });
  });

  describe('context values', () => {
    it('exposes texts and providerConfig from provider', async () => {
      function ConfigDisplay() {
        var ctx = useAuthStatus();
        return (
          <>
            <Text testID="login-text">{ctx.texts.login}</Text>
            <Text testID="providers">
              {ctx.providerConfig.providers.join(',')}
            </Text>
          </>
        );
      }

      renderWithProvider(<ConfigDisplay />);

      await act(async () => {});

      expect(screen.getByTestId('login-text').props.children).toBe('Log In');
      expect(screen.getByTestId('providers').props.children).toBe(
        'google,email'
      );
    });
  });
});
