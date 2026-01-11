/**
 * AuthProvider - Context provider for authentication state in React Native
 */

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import type {
  AuthUser,
  AuthTexts,
  AuthErrorTexts,
  AuthProvidersConfig,
  AuthContextValue,
  AuthProviderProps,
  AuthCallbacks,
} from './types';

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Default English error texts
 */
export function createDefaultErrorTexts(): AuthErrorTexts {
  return {
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/email-already-in-use': 'An account already exists with this email.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your connection.',
    'auth/popup-closed-by-user': 'Sign-in was cancelled.',
    'auth/popup-blocked': 'Sign-in popup was blocked.',
    'auth/account-exists-with-different-credential': 'An account already exists with a different sign-in method.',
    'auth/operation-not-allowed': 'This sign-in method is not enabled.',
    default: 'An error occurred. Please try again.',
  };
}

/**
 * Hook to access auth context
 */
export function useAuthStatus(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthStatus must be used within an AuthProvider');
  }
  return context;
}

/**
 * Auth provider component for React Native
 */
export function AuthProvider({
  children,
  providerConfig,
  texts,
  errorTexts,
  callbacks,
  resolveErrorMessage,
}: AuthProviderProps): React.ReactElement {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Resolve error message from code
  const getErrorMessage = useCallback(
    (code: string): string => {
      if (resolveErrorMessage) {
        return resolveErrorMessage(code);
      }
      const key = code as keyof AuthErrorTexts;
      return errorTexts[key] || errorTexts.default;
    },
    [errorTexts, resolveErrorMessage]
  );

  // Handle auth errors
  const handleError = useCallback(
    (err: Error & { code?: string }) => {
      const code = err.code || 'default';
      const message = getErrorMessage(code);
      setError(message);
      callbacks?.onError?.(err, code);
    },
    [getErrorMessage, callbacks]
  );

  // Auth state listener - to be connected to Firebase Auth
  useEffect(() => {
    // This is a placeholder - in actual implementation,
    // you would connect to @react-native-firebase/auth here
    // Example:
    // import auth from '@react-native-firebase/auth';
    // const unsubscribe = auth().onAuthStateChanged((firebaseUser) => {
    //   if (firebaseUser) {
    //     setUser({
    //       uid: firebaseUser.uid,
    //       email: firebaseUser.email,
    //       displayName: firebaseUser.displayName,
    //       photoURL: firebaseUser.photoURL,
    //       isAnonymous: firebaseUser.isAnonymous,
    //       emailVerified: firebaseUser.emailVerified,
    //       providerId: firebaseUser.providerData[0]?.providerId || null,
    //     });
    //   } else {
    //     setUser(null);
    //   }
    //   setLoading(false);
    // });
    // return unsubscribe;

    setLoading(false);
  }, []);

  // Sign in with Google
  const signInWithGoogle = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Placeholder - implement with @react-native-firebase/auth
      // and @react-native-google-signin/google-signin
      throw new Error('Google sign-in not implemented');
    } catch (err) {
      handleError(err as Error & { code?: string });
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Sign in with Apple
  const signInWithApple = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Placeholder - implement with @react-native-firebase/auth
      // and @invertase/react-native-apple-authentication
      throw new Error('Apple sign-in not implemented');
    } catch (err) {
      handleError(err as Error & { code?: string });
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Sign in with email/password
  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      setLoading(true);
      setError(null);
      try {
        // Placeholder - implement with @react-native-firebase/auth
        // import auth from '@react-native-firebase/auth';
        // await auth().signInWithEmailAndPassword(email, password);
        throw new Error('Email sign-in not implemented');
      } catch (err) {
        handleError(err as Error & { code?: string });
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  // Sign up with email/password
  const signUpWithEmail = useCallback(
    async (email: string, password: string, displayName?: string) => {
      setLoading(true);
      setError(null);
      try {
        // Placeholder - implement with @react-native-firebase/auth
        throw new Error('Email sign-up not implemented');
      } catch (err) {
        handleError(err as Error & { code?: string });
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  // Reset password
  const resetPassword = useCallback(
    async (email: string) => {
      setLoading(true);
      setError(null);
      try {
        // Placeholder - implement with @react-native-firebase/auth
        throw new Error('Password reset not implemented');
      } catch (err) {
        handleError(err as Error & { code?: string });
      } finally {
        setLoading(false);
      }
    },
    [handleError]
  );

  // Sign out
  const signOut = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Placeholder - implement with @react-native-firebase/auth
      // import auth from '@react-native-firebase/auth';
      // await auth().signOut();
      setUser(null);
      callbacks?.onSignOut?.();
    } catch (err) {
      handleError(err as Error & { code?: string });
    } finally {
      setLoading(false);
    }
  }, [handleError, callbacks]);

  // Sign in anonymously
  const signInAnonymously = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Placeholder - implement with @react-native-firebase/auth
      throw new Error('Anonymous sign-in not implemented');
    } catch (err) {
      handleError(err as Error & { code?: string });
    } finally {
      setLoading(false);
    }
  }, [handleError]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      error,
      isAuthenticated: !!user && !user.isAnonymous,
      isAnonymous: user?.isAnonymous ?? false,
      signInWithGoogle,
      signInWithApple,
      signInWithEmail,
      signUpWithEmail,
      resetPassword,
      signOut,
      signInAnonymously,
      clearError,
      texts,
      providerConfig,
    }),
    [
      user,
      loading,
      error,
      signInWithGoogle,
      signInWithApple,
      signInWithEmail,
      signUpWithEmail,
      resetPassword,
      signOut,
      signInAnonymously,
      clearError,
      texts,
      providerConfig,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
