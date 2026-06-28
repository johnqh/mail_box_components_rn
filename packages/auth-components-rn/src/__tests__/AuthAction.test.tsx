import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react-native';
import { Text } from 'react-native';
import { AuthAction } from '../AuthAction';
import { AuthProvider, createDefaultErrorTexts } from '../AuthProvider';

// Mock @sudobility/components-rn
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

function renderWithProvider(ui) {
  return render(
    <AuthProvider
      providerConfig={defaultProviderConfig}
      texts={defaultTexts}
      errorTexts={defaultErrorTexts}
    >
      {ui}
    </AuthProvider>
  );
}

var mockUser = {
  uid: 'user-123',
  email: 'test@example.com',
  displayName: 'Test User',
  photoURL: null,
  isAnonymous: false,
  emailVerified: true,
  providerId: 'password',
};

describe('AuthAction', () => {
  describe('unauthenticated state', () => {
    it('shows login button when not authenticated', async () => {
      renderWithProvider(<AuthAction />);

      await act(async () => {});

      expect(screen.getByText('Log In')).toBeTruthy();
    });

    it('shows custom login button content', async () => {
      renderWithProvider(<AuthAction loginButtonContent='Get Started' />);

      await act(async () => {});

      expect(screen.getByText('Get Started')).toBeTruthy();
    });

    it('calls onLoginPress when login button is pressed', async () => {
      var onLoginPress = jest.fn();
      renderWithProvider(<AuthAction onLoginPress={onLoginPress} />);

      await act(async () => {});

      fireEvent.press(screen.getByText('Log In'));
      expect(onLoginPress).toHaveBeenCalledTimes(1);
    });

    it('fires tracking event on login press', async () => {
      var onTrack = jest.fn();
      renderWithProvider(
        <AuthAction onTrack={onTrack} trackingLabel='header' />
      );

      await act(async () => {});

      fireEvent.press(screen.getByText('Log In'));
      expect(onTrack).toHaveBeenCalledWith({
        action: 'login_press',
        trackingLabel: 'header',
        componentName: 'AuthAction',
      });
    });
  });

  describe('authenticated state', () => {
    var mockSignOut;

    beforeEach(() => {
      mockSignOut = jest.fn().mockResolvedValue(undefined);

      jest.spyOn(require('../AuthProvider'), 'useAuthStatus').mockReturnValue({
        user: mockUser,
        loading: false,
        error: null,
        isAuthenticated: true,
        isAnonymous: false,
        signInWithGoogle: jest.fn(),
        signInWithApple: jest.fn(),
        signInWithEmail: jest.fn(),
        signUpWithEmail: jest.fn(),
        resetPassword: jest.fn(),
        signOut: mockSignOut,
        signInAnonymously: jest.fn(),
        clearError: jest.fn(),
        texts: defaultTexts,
        providerConfig: defaultProviderConfig,
      });
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('shows user display name when authenticated', () => {
      renderWithProvider(<AuthAction />);

      expect(screen.getByText('Test User')).toBeTruthy();
    });

    it('shows user email when displayName and email both exist', () => {
      renderWithProvider(<AuthAction />);

      expect(screen.getByText('test@example.com')).toBeTruthy();
    });

    it('shows logout button when authenticated', () => {
      renderWithProvider(<AuthAction />);

      expect(screen.getByText('Log Out')).toBeTruthy();
    });

    it('calls signOut and onLogoutPress when logout is pressed', async () => {
      var onLogoutPress = jest.fn();
      renderWithProvider(<AuthAction onLogoutPress={onLogoutPress} />);

      await act(async () => {
        fireEvent.press(screen.getByText('Log Out'));
      });

      expect(onLogoutPress).toHaveBeenCalledTimes(1);
      expect(mockSignOut).toHaveBeenCalledTimes(1);
    });

    it('fires tracking event on logout press', async () => {
      var onTrack = jest.fn();
      renderWithProvider(
        <AuthAction onTrack={onTrack} trackingLabel='header' />
      );

      await act(async () => {
        fireEvent.press(screen.getByText('Log Out'));
      });

      expect(onTrack).toHaveBeenCalledWith({
        action: 'logout_press',
        trackingLabel: 'header',
        componentName: 'AuthAction',
      });
    });

    it('hides user info when showUserInfo is false', () => {
      renderWithProvider(<AuthAction showUserInfo={false} />);

      expect(screen.queryByText('Test User')).toBeNull();
      expect(screen.queryByText('test@example.com')).toBeNull();
    });

    it('shows email as primary text when displayName is null', () => {
      jest.spyOn(require('../AuthProvider'), 'useAuthStatus').mockReturnValue({
        user: Object.assign({}, mockUser, { displayName: null }),
        loading: false,
        error: null,
        isAuthenticated: true,
        isAnonymous: false,
        signInWithGoogle: jest.fn(),
        signInWithApple: jest.fn(),
        signInWithEmail: jest.fn(),
        signUpWithEmail: jest.fn(),
        resetPassword: jest.fn(),
        signOut: mockSignOut,
        signInAnonymously: jest.fn(),
        clearError: jest.fn(),
        texts: defaultTexts,
        providerConfig: defaultProviderConfig,
      });

      renderWithProvider(<AuthAction />);

      expect(screen.getByText('test@example.com')).toBeTruthy();
    });

    it('uses custom renderAvatar when provided', () => {
      renderWithProvider(
        <AuthAction
          renderAvatar={function (user) {
            return <Text testID='custom-avatar'>{user.uid}</Text>;
          }}
        />
      );

      expect(screen.getByTestId('custom-avatar')).toBeTruthy();
      expect(screen.getByText('user-123')).toBeTruthy();
    });
  });
});
