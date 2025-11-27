import * as React from 'react';
import { useEffect } from 'react';
import { View } from 'react-native';
import { cn } from '../../lib/utils';
import { Alert } from '../Alert';

export interface FormAlertsProps {
  /** Success message to display */
  successMessage?: string;
  /** Error message to display */
  errorMessage?: string;
  /** Title for success alert */
  successTitle?: string;
  /** Title for error alert */
  errorTitle?: string;
  /** Auto-dismiss success message after milliseconds (0 = no auto-dismiss) */
  autoDismissDelay?: number;
  /** Callback when success message should be cleared */
  onSuccessDismiss?: () => void;
  /** Additional className */
  className?: string;
}

/**
 * FormAlerts Component
 *
 * Displays success and error alerts for form submissions.
 * Success messages can auto-dismiss after a configured delay.
 *
 * @example
 * ```tsx
 * const [success, setSuccess] = useState('');
 * const [error, setError] = useState('');
 *
 * <FormAlerts
 *   successMessage={success}
 *   errorMessage={error}
 *   onSuccessDismiss={() => setSuccess('')}
 *   autoDismissDelay={3000}
 * />
 * ```
 */
export const FormAlerts: React.FC<FormAlertsProps> = ({
  successMessage,
  errorMessage,
  successTitle = 'Success',
  errorTitle = 'Error',
  autoDismissDelay = 0,
  onSuccessDismiss,
  className,
}) => {
  // Auto-dismiss success message
  useEffect(() => {
    if (successMessage && autoDismissDelay > 0 && onSuccessDismiss) {
      const timer = setTimeout(() => {
        onSuccessDismiss();
      }, autoDismissDelay);

      return () => clearTimeout(timer);
    }
  }, [successMessage, autoDismissDelay, onSuccessDismiss]);

  if (!successMessage && !errorMessage) {
    return null;
  }

  return (
    <View className={cn('gap-3', className)}>
      {errorMessage && (
        <Alert variant='error' title={errorTitle} description={errorMessage} />
      )}
      {successMessage && (
        <Alert
          variant='success'
          title={successTitle}
          description={successMessage}
        />
      )}
    </View>
  );
};
