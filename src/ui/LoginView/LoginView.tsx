import * as React from 'react';
import { Platform, Text, View, useColorScheme } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import { cn } from '../../lib/utils';
import { Button } from '../Button';
import { Input } from '../Input';
import { AppleLogo, GoogleLogo } from './BrandLogos';
import type { AppleLogoTone } from './BrandLogos';

/** Whether the view is signing somebody in or creating their account. */
export type LoginViewMode = 'signIn' | 'signUp';

/** What a failed attempt reports to `onAuthError`. */
export interface LoginViewError {
  /** The provider's error code, or `unknown`. */
  code: string;
  message: string;
  /** The user backed out — dismissed a sheet — rather than something failing. */
  isUserAction: boolean;
}

/** Every string the view shows. English by default; pass `text` to localise. */
export interface LoginViewText {
  signIn: string;
  signUp: string;
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  orContinueWith: string;
  signInWithGoogle: string;
  signInWithApple: string;
  /** The whole line that leads back to signing in. */
  alreadyHaveAccount: string;
  /** The whole line that leads to creating an account. */
  dontHaveAccount: string;
  /** Shown when either field is empty. */
  missingFields: string;
  /** Shown when an attempt fails with no message of its own. */
  genericError: string;
}

export const DEFAULT_LOGIN_VIEW_TEXT: LoginViewText = {
  signIn: 'Sign in',
  signUp: 'Sign up',
  emailLabel: 'Email address',
  emailPlaceholder: '',
  passwordLabel: 'Password',
  passwordPlaceholder: '',
  orContinueWith: 'Or continue with',
  signInWithGoogle: 'Sign in with Google',
  signInWithApple: 'Sign in with Apple',
  alreadyHaveAccount: 'Already have an account? Sign in',
  dontHaveAccount: "Don't have an account? Sign up",
  missingFields: 'Enter your email and password.',
  genericError: 'Authentication failed',
};

/** The widest the view is drawn, in points, on every platform. */
export const LOGIN_VIEW_MAX_WIDTH = 360;

// Codes that mean the user backed out rather than that something failed.
const USER_ACTION_ERROR_CODES = [
  'auth/popup-closed-by-user',
  'auth/cancelled-popup-request',
  'auth/user-cancelled',
];

export interface LoginViewProps {
  /** Signs in with email and password. Throws on failure. */
  onEmailSignIn: (email: string, password: string) => Promise<void>;
  /**
   * Creates an account. Throws on failure. The way to create one is offered
   * only when this is given.
   */
  onEmailSignUp?: (email: string, password: string) => Promise<void>;
  /** Signs in with Google. The button is drawn only when this is given. */
  onGoogleSignIn?: () => Promise<void>;
  /** Signs in with Apple. The button is drawn only when this is given. */
  onAppleSignIn?: () => Promise<void>;
  /** Somebody signed in, or made their account. */
  onSuccess?: () => void;
  /** Takes over error reporting: when given, nothing is shown inline. */
  onAuthError?: (error: LoginViewError) => void;
  /**
   * Which of the two the view is doing. Leave it out and the view keeps track
   * itself; pass it, with `onModeChange`, to follow along — a modal's title
   * does.
   */
  mode?: LoginViewMode;
  onModeChange?: (mode: LoginViewMode) => void;
  text?: Partial<LoginViewText>;
  /**
   * Apple's mark in black or white, against what the view is placed on. An
   * app with a theme of its own passes what that theme resolved to; left out,
   * it follows the device's appearance.
   */
  appleLogoTone?: AppleLogoTone;
  className?: string;
  style?: StyleProp<ViewStyle>;
}

/**
 * Sign in, or create an account: the form alone, to be placed in another view.
 *
 * **It brings no screen with it.** No background, no heading, no card and no
 * scroller: the background is transparent so whatever it is placed on shows
 * through, and the view that holds it says what it is — a pane's title, a
 * modal's bar. It is as wide as it is given up to `LOGIN_VIEW_MAX_WIDTH`, and
 * centred in anything wider.
 *
 * Presentational and provider-agnostic: it takes the handlers and knows
 * nothing of Firebase. The fields and buttons are this package's own `Input`
 * and `Button`, so they follow the design system's theme.
 *
 * Apple comes before Google on an Apple device, which is Apple's condition
 * for offering the other at all.
 */
export function LoginView({
  onEmailSignIn,
  onEmailSignUp,
  onGoogleSignIn,
  onAppleSignIn,
  onSuccess,
  onAuthError,
  mode: controlledMode,
  onModeChange,
  text: textOverrides,
  appleLogoTone,
  className,
  style,
}: LoginViewProps) {
  const text = { ...DEFAULT_LOGIN_VIEW_TEXT, ...textOverrides };
  const [ownMode, setOwnMode] = React.useState<LoginViewMode>('signIn');
  // Creating an account is a mode only where there is a way to create one.
  const requestedMode = controlledMode ?? ownMode;
  const mode: LoginViewMode = onEmailSignUp ? requestedMode : 'signIn';
  const creating = mode === 'signUp';

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const deviceScheme = useColorScheme();
  const appleTone: AppleLogoTone =
    appleLogoTone ?? (deviceScheme === 'dark' ? 'white' : 'black');

  const report = (err: unknown) => {
    const failure = err as { code?: string; message?: string };
    const code = failure?.code || 'unknown';
    const message = failure?.message || text.genericError;
    const isUserAction = USER_ACTION_ERROR_CODES.includes(code);
    if (onAuthError) onAuthError({ code, message, isUserAction });
    // Backing out of a sheet is not an error to be told about.
    else if (!isUserAction) setError(message);
  };

  const attempt = async (signIn: () => Promise<void>) => {
    setError(null);
    setBusy(true);
    try {
      await signIn();
      onSuccess?.();
    } catch (err) {
      report(err);
    } finally {
      setBusy(false);
    }
  };

  const submit = () => {
    const address = email.trim();
    if (!address || !password) {
      setError(text.missingFields);
      return;
    }
    void attempt(() =>
      creating && onEmailSignUp
        ? onEmailSignUp(address, password)
        : onEmailSignIn(address, password)
    );
  };

  const toggleMode = () => {
    const next: LoginViewMode = creating ? 'signIn' : 'signUp';
    setError(null);
    setOwnMode(next);
    onModeChange?.(next);
  };

  const googleButton = onGoogleSignIn ? (
    <Button
      key='google'
      variant='outline'
      accessibilityLabel={text.signInWithGoogle}
      onPress={() => void attempt(onGoogleSignIn)}
      disabled={busy}
    >
      {/*
        The mark beside the words, as Google's own guidelines ask. Children
        that are not a plain string are laid out here, and the button has no
        text of its own to read out — hence the label.
      */}
      <View className='flex-row items-center justify-center gap-2'>
        <GoogleLogo />
        <Text className='text-foreground text-base font-medium'>
          {text.signInWithGoogle}
        </Text>
      </View>
    </Button>
  ) : null;

  const appleButton = onAppleSignIn ? (
    <Button
      key='apple'
      variant='outline'
      accessibilityLabel={text.signInWithApple}
      onPress={() => void attempt(onAppleSignIn)}
      disabled={busy}
    >
      <View className='flex-row items-center justify-center gap-2'>
        <AppleLogo tone={appleTone} />
        <Text className='text-foreground text-base font-medium'>
          {text.signInWithApple}
        </Text>
      </View>
    </Button>
  ) : null;

  const appleFirst = Platform.OS === 'ios' || Platform.OS === 'macos';

  return (
    <View
      testID='login-view'
      className={cn('w-full gap-4 self-center bg-transparent', className)}
      style={[{ maxWidth: LOGIN_VIEW_MAX_WIDTH }, style]}
    >
      {error ? (
        <View
          accessibilityRole='alert'
          className='border-destructive/40 bg-destructive/10 rounded-md border px-4 py-3'
        >
          <Text className='text-destructive text-base'>{error}</Text>
        </View>
      ) : null}

      <View className='gap-1'>
        <Text className='text-foreground text-sm font-medium'>
          {text.emailLabel}
        </Text>
        {/*
          `Input`'s default is a filled surface with no border. On a
          background this view does not choose, a field the colour of what is
          behind it says nothing of where to type, so it is given the border
          every bordered card already uses.
        */}
        <Input
          value={email}
          onChangeText={setEmail}
          placeholder={text.emailPlaceholder}
          autoCapitalize='none'
          autoCorrect={false}
          autoComplete='email'
          textContentType='emailAddress'
          keyboardType='email-address'
          accessibilityLabel={text.emailLabel}
          disabled={busy}
          className='border-border rounded-md border'
        />
      </View>

      <View className='gap-1'>
        <Text className='text-foreground text-sm font-medium'>
          {text.passwordLabel}
        </Text>
        <Input
          value={password}
          onChangeText={setPassword}
          placeholder={text.passwordPlaceholder}
          secureTextEntry
          autoCapitalize='none'
          autoCorrect={false}
          autoComplete={creating ? 'new-password' : 'current-password'}
          textContentType={creating ? 'newPassword' : 'password'}
          accessibilityLabel={text.passwordLabel}
          onSubmitEditing={submit}
          returnKeyType='go'
          disabled={busy}
          className='border-border rounded-md border'
        />
      </View>

      <Button variant='primary' onPress={submit} disabled={busy} loading={busy}>
        {creating ? text.signUp : text.signIn}
      </Button>

      {googleButton || appleButton ? (
        <>
          <View className='flex-row items-center gap-3'>
            <View className='bg-border h-px flex-1' />
            <Text className='text-muted-foreground text-sm'>
              {text.orContinueWith}
            </Text>
            <View className='bg-border h-px flex-1' />
          </View>
          <View className='gap-3'>
            {appleFirst
              ? [appleButton, googleButton]
              : [googleButton, appleButton]}
          </View>
        </>
      ) : null}

      {onEmailSignUp ? (
        <Button
          variant='link'
          textClassName='text-base'
          onPress={toggleMode}
          disabled={busy}
        >
          {creating ? text.alreadyHaveAccount : text.dontHaveAccount}
        </Button>
      ) : null}
    </View>
  );
}
