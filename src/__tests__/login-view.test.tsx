/**
 * LoginView, and the same view in a modal.
 *
 * What is pinned is what makes it placeable: it is no wider than its maximum,
 * centres itself, paints nothing behind itself and brings no heading — and
 * offers only what it was handed a way to do.
 */
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { LoginView, LOGIN_VIEW_MAX_WIDTH } from '../ui/LoginView';
import { LoginModal } from '../ui/LoginModal';

const signIn = () => jest.fn<Promise<void>, unknown[]>(async () => {});

function fill(view: ReturnType<typeof render>) {
  fireEvent.changeText(
    view.getByLabelText('Email address'),
    ' ada@example.com '
  );
  fireEvent.changeText(view.getByLabelText('Password'), 'secret');
}

describe('LoginView', () => {
  it('is no wider than its maximum, centred, and paints no background', () => {
    const view = render(<LoginView onEmailSignIn={signIn()} />);
    const root = view.getByTestId('login-view');
    expect(StyleSheet.flatten(root.props.style).maxWidth).toBe(
      LOGIN_VIEW_MAX_WIDTH
    );
    expect(LOGIN_VIEW_MAX_WIDTH).toBe(360);
    expect(root.props.className).toContain('w-full');
    expect(root.props.className).toContain('self-center');
    expect(root.props.className).toContain('bg-transparent');
  });

  it('brings no heading: the view that holds it says what it is', () => {
    const view = render(<LoginView onEmailSignIn={signIn()} />);
    expect(view.queryByRole('header')).toBeNull();
  });

  it('signs in with what was typed, trimmed, and says so', async () => {
    const onEmailSignIn = signIn();
    const onSuccess = jest.fn();
    const view = render(
      <LoginView onEmailSignIn={onEmailSignIn} onSuccess={onSuccess} />
    );
    fill(view);
    await act(async () => {
      fireEvent.press(view.getByText('Sign in'));
    });
    expect(onEmailSignIn).toHaveBeenCalledWith('ada@example.com', 'secret');
    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
  });

  it('asks for both fields before trying', () => {
    const onEmailSignIn = signIn();
    const view = render(<LoginView onEmailSignIn={onEmailSignIn} />);
    fireEvent.press(view.getByText('Sign in'));
    expect(onEmailSignIn).not.toHaveBeenCalled();
    expect(view.getByText('Enter your email and password.')).toBeTruthy();
  });

  it('creates an account once asked to', async () => {
    const onEmailSignIn = signIn();
    const onEmailSignUp = signIn();
    const view = render(
      <LoginView onEmailSignIn={onEmailSignIn} onEmailSignUp={onEmailSignUp} />
    );
    fireEvent.press(view.getByText("Don't have an account? Sign up"));
    fill(view);
    await act(async () => {
      fireEvent.press(view.getByText('Sign up'));
    });
    expect(onEmailSignUp).toHaveBeenCalledWith('ada@example.com', 'secret');
    expect(onEmailSignIn).not.toHaveBeenCalled();
  });

  it('offers only what it was given a way to do', () => {
    const view = render(<LoginView onEmailSignIn={signIn()} />);
    expect(view.queryByLabelText('Sign in with Google')).toBeNull();
    expect(view.queryByLabelText('Sign in with Apple')).toBeNull();
    expect(view.queryByText('Or continue with')).toBeNull();
    expect(view.queryByText("Don't have an account? Sign up")).toBeNull();
  });

  it('offers Google and Apple when given them', async () => {
    const onGoogleSignIn = signIn();
    const view = render(
      <LoginView
        onEmailSignIn={signIn()}
        onGoogleSignIn={onGoogleSignIn}
        onAppleSignIn={signIn()}
      />
    );
    expect(view.getByLabelText('Sign in with Apple')).toBeTruthy();
    await act(async () => {
      fireEvent.press(view.getByLabelText('Sign in with Google'));
    });
    expect(onGoogleSignIn).toHaveBeenCalled();
  });

  it('shows why an attempt failed', async () => {
    const view = render(
      <LoginView
        onEmailSignIn={jest.fn(async () => {
          throw new Error('Wrong password');
        })}
      />
    );
    fill(view);
    await act(async () => {
      fireEvent.press(view.getByText('Sign in'));
    });
    expect(view.getByText('Wrong password')).toBeTruthy();
  });

  it('hands errors to the caller when asked to, and shows none', async () => {
    const onAuthError = jest.fn();
    const view = render(
      <LoginView
        onAuthError={onAuthError}
        onEmailSignIn={jest.fn(async () => {
          throw Object.assign(new Error('Wrong password'), {
            code: 'auth/wrong-password',
          });
        })}
      />
    );
    fill(view);
    await act(async () => {
      fireEvent.press(view.getByText('Sign in'));
    });
    expect(onAuthError).toHaveBeenCalledWith({
      code: 'auth/wrong-password',
      message: 'Wrong password',
      isUserAction: false,
    });
    expect(view.queryByText('Wrong password')).toBeNull();
  });

  it('takes its words from the caller', () => {
    const view = render(
      <LoginView
        onEmailSignIn={signIn()}
        text={{ signIn: 'Anmelden', emailLabel: 'E-Mail' }}
      />
    );
    expect(view.getByText('Anmelden')).toBeTruthy();
    expect(view.getByLabelText('E-Mail')).toBeTruthy();
  });
});

describe('LoginModal', () => {
  it('shows the view under a title bar with a close button', () => {
    const onClose = jest.fn();
    const view = render(
      <LoginModal visible onClose={onClose} onEmailSignIn={signIn()} />
    );
    expect(view.getByRole('header')).toHaveTextContent('Sign in');
    expect(view.getByTestId('login-view')).toBeTruthy();
    fireEvent.press(view.getByLabelText('Close'));
    expect(onClose).toHaveBeenCalled();
  });

  it('retitles itself when creating an account', () => {
    const view = render(
      <LoginModal
        visible
        onClose={jest.fn()}
        onEmailSignIn={signIn()}
        onEmailSignUp={signIn()}
      />
    );
    fireEvent.press(view.getByText("Don't have an account? Sign up"));
    expect(view.getByRole('header')).toHaveTextContent('Create your account');
  });

  it('closes once somebody has signed in', async () => {
    const onClose = jest.fn();
    const onSuccess = jest.fn();
    const view = render(
      <LoginModal
        visible
        onClose={onClose}
        onSuccess={onSuccess}
        onEmailSignIn={signIn()}
      />
    );
    fill(view);
    await act(async () => {
      // The bar's title says "Sign in" too; the button is the one to press.
      fireEvent.press(view.getByRole('button', { name: 'Sign in' }));
    });
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(onSuccess).toHaveBeenCalled();
  });
});
