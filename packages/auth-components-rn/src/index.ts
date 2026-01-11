/**
 * @sudobility/auth-components-rn
 * React Native Authentication components with Firebase Auth support
 */

// Context and hooks
export {
  AuthProvider,
  useAuthStatus,
  createDefaultErrorTexts,
} from './AuthProvider';

// Components
export { AuthScreen } from './AuthScreen';
export { AuthInline } from './AuthInline';
export { AuthAction } from './AuthAction';
export { Avatar } from './Avatar';
export { ProviderButtons } from './ProviderButtons';
export { EmailSignInForm } from './EmailSignInForm';
export { EmailSignUpForm } from './EmailSignUpForm';
export { ForgotPasswordForm } from './ForgotPasswordForm';

// Types
export type {
  // Provider types
  AuthProviderType,
  AuthProvidersConfig,
  // User types
  AuthUser,
  // Text types (i18n)
  AuthTexts,
  AuthErrorTexts,
  // Callbacks
  AuthCallbacks,
  // Context value
  AuthContextValue,
  // Component props
  AuthProviderProps,
  AuthMode,
  AuthScreenProps,
  AuthInlineProps,
  AuthMenuItem,
  AuthActionProps,
  AvatarProps,
  AuthContentProps,
  EmailSignInFormProps,
  EmailSignUpFormProps,
  ForgotPasswordFormProps,
  ProviderButtonsProps,
  // Tracking
  AuthTrackingData,
} from './types';
