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

export interface ToastContextValue {
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

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

  // Variant styles - background
  const variantBgClasses = {
    default: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
    success:
      'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    warning:
      'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
  };

  // Variant styles - icon color
  const iconColorClasses = {
    default: 'text-gray-600 dark:text-gray-400',
    success: 'text-green-600 dark:text-green-400',
    error: 'text-red-600 dark:text-red-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    info: 'text-blue-600 dark:text-blue-400',
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
          <Text className='font-semibold text-gray-900 dark:text-white'>
            {title}
          </Text>
        )}
        {description && (
          <Text className='text-sm text-gray-600 dark:text-gray-300 mt-1'>
            {description}
          </Text>
        )}
        {action && (
          <Pressable onPress={action.onPress} className='mt-2'>
            <Text className='text-sm font-medium text-blue-600 dark:text-blue-400'>
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
        <Text className='text-gray-400 text-lg'>✕</Text>
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
