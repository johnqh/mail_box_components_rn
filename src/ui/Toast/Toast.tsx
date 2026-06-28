import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { View, Text, Pressable, Animated, SafeAreaView } from 'react-native';
import { cn } from '../../lib/utils';
import { colors, textVariants } from '@sudobility/design';

// Split DS alert colors for RN (Views don't cascade text color)
function splitAlertClasses(base: string, dark: string) {
  const all = `${base} ${dark}`.split(' ');
  return {
    container: all
      .filter(c => c.includes('bg-') || c.includes('border-'))
      .join(' '),
    icon: all.filter(c => c.includes('text-')).join(' '),
  };
}

// Lazily derive alert colors so module-level access doesn't fail
// when Jest transforms ESM chunk imports.
let _alertColors: Record<string, ReturnType<typeof splitAlertClasses>> | null =
  null;
function getAlertColors() {
  if (!_alertColors) {
    const alert = colors.component.alert;
    _alertColors = {
      success: splitAlertClasses(alert.success.base, alert.success.dark),
      error: splitAlertClasses(alert.error.base, alert.error.dark),
      warning: splitAlertClasses(alert.warning.base, alert.warning.dark),
      info: splitAlertClasses(alert.info.base, alert.info.dark),
    };
  }
  return _alertColors;
}

/** Data structure representing a single toast notification. */
export interface ToastMessage {
  id: string;
  title?: string;
  description?: string;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  action?: {
    label: string;
    onPress: () => void;
  };
}

export interface ToastProps {
  /** Toast message */
  toast: ToastMessage;
  /** Remove toast handler */
  onRemove: (id: string) => void;
}

/** Context value provided by ToastProvider for managing toast notifications. */
export interface ToastContextValue {
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

/**
 * Hook to access the toast notification system.
 *
 * Must be used within a ToastProvider. Returns functions to add and remove
 * toast notifications, plus the current list of active toasts.
 *
 * @returns The toast context value with addToast, removeToast, and toasts
 * @throws Error if used outside of a ToastProvider
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

/**
 * Toast Component
 *
 * Individual toast notification with variants and actions.
 */
export const Toast: React.FC<ToastProps> = ({ toast, onRemove }) => {
  const { id, title, description, variant = 'default', action } = toast;
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      friction: 8,
    }).start();
  }, [slideAnim]);

  const ac = getAlertColors();

  // Variant background+border from design system (colors.component.alert)
  const variantBgClasses = {
    default: 'bg-card border-border',
    success: ac.success.container,
    error: ac.error.container,
    warning: ac.warning.container,
    info: ac.info.container,
  };

  // Variant icon colors from design system
  const alert = colors.component.alert;
  const iconColorClasses = {
    default: 'text-muted-foreground',
    success: alert.success.icon,
    error: alert.error.icon,
    warning: alert.warning.icon,
    info: alert.info.icon,
  };

  // Icon symbols
  const icons = {
    default: 'ℹ',
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ',
  };

  return (
    <Animated.View
      style={{ transform: [{ translateY: slideAnim }] }}
      className={cn(
        'flex flex-row items-start gap-3 p-4 rounded-lg border shadow-lg',
        'w-full max-w-md',
        variantBgClasses[variant]
      )}
    >
      <View className={cn('flex-shrink-0', iconColorClasses[variant])}>
        <Text className='text-lg'>{icons[variant]}</Text>
      </View>

      <View className='flex-1 min-w-0'>
        {title && (
          <Text className={cn(textVariants.label.default(), 'text-foreground')}>
            {title}
          </Text>
        )}
        {description && (
          <Text className={cn(textVariants.body.sm(), 'mt-1')}>
            {description}
          </Text>
        )}
        {action && (
          <Pressable onPress={action.onPress} className='mt-2'>
            <Text className='text-sm font-medium text-primary'>
              {action.label}
            </Text>
          </Pressable>
        )}
      </View>

      <Pressable
        onPress={() => onRemove(id)}
        className='flex-shrink-0 p-1'
        accessibilityRole='button'
        accessibilityLabel='Close notification'
      >
        <Text className='text-muted-foreground text-lg'>✕</Text>
      </Pressable>
    </Animated.View>
  );
};

/**
 * Individual toast wrapper with auto-remove timer
 */
const ToastItem: React.FC<{
  toast: ToastMessage;
  onRemove: (id: string) => void;
}> = ({ toast, onRemove }) => {
  useEffect(() => {
    const duration = toast.duration ?? 5000;

    if (duration > 0) {
      const timer = setTimeout(() => {
        onRemove(toast.id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, onRemove]);

  return <Toast toast={toast} onRemove={onRemove} />;
};

/**
 * ToastProvider Component
 *
 * Provider for toast notifications system.
 * Wrap your app with this provider to enable toasts.
 *
 * @example
 * ```tsx
 * <ToastProvider>
 *   <App />
 * </ToastProvider>
 * ```
 *
 * @example
 * ```tsx
 * // Using the toast hook
 * const { addToast } = useToast();
 *
 * const showSuccess = () => {
 *   addToast({
 *     title: 'Success!',
 *     description: 'Your action was completed.',
 *     variant: 'success',
 *   });
 * };
 * ```
 */
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const addToast = useCallback((toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      {toasts.length > 0 && (
        <SafeAreaView
          className='absolute top-0 left-0 right-0 z-50 px-4 pt-4'
          pointerEvents='box-none'
        >
          <View className='items-center gap-2'>
            {toasts.map(toast => (
              <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
            ))}
          </View>
        </SafeAreaView>
      )}
    </ToastContext.Provider>
  );
};
