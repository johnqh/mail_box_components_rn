import * as React from 'react';
import { View, Text } from 'react-native';
import { cn } from '../../lib/utils';
import { colors } from '@sudobility/design';

const alert = colors.component.alert;

// Split DS alert color strings into separate parts for RN
function splitAlertClasses(base: string, dark: string) {
  const all = `${base} ${dark}`.split(' ');
  return {
    bg: all.filter(c => c.includes('bg-')).join(' '),
    border: all.filter(c => c.includes('border-')).join(' '),
    text: all.filter(c => c.includes('text-')).join(' '),
  };
}

const dsInfo = splitAlertClasses(alert.info.base, alert.info.dark);
const dsSuccess = splitAlertClasses(alert.success.base, alert.success.dark);
const dsWarning = splitAlertClasses(alert.warning.base, alert.warning.dark);
const dsError = splitAlertClasses(alert.error.base, alert.error.dark);

export interface InfoBoxProps {
  /** Content to display in the info box */
  children: React.ReactNode;
  /** Title/heading for the info box */
  title?: string;
  /** Color variant */
  variant?: 'info' | 'success' | 'warning' | 'danger' | 'neutral';
  /** Size/padding variant */
  size?: 'sm' | 'md' | 'lg';
  /** Icon element to display */
  icon?: React.ReactNode;
  /** Show border */
  bordered?: boolean;
  /** Additional className for the container */
  className?: string;
}

/**
 * InfoBox Component
 *
 * A versatile callout/info box component for highlighting important information,
 * tips, warnings, or notes. Commonly used in documentation, settings pages,
 * and forms.
 *
 * @example
 * ```tsx
 * <InfoBox variant="info" title="Quick Start">
 *   <Text>Connect your wallet to get started</Text>
 * </InfoBox>
 * ```
 *
 * @example
 * ```tsx
 * <InfoBox variant="warning" icon={<WarningIcon />}>
 *   <Text>Each wallet creates a unique email address.</Text>
 * </InfoBox>
 * ```
 */
export const InfoBox: React.FC<InfoBoxProps> = ({
  children,
  title,
  variant = 'info',
  size = 'md',
  icon,
  bordered = true,
  className,
}) => {
  // Color variants derived from design system (colors.component.alert)
  const variantClasses = {
    info: {
      bg: dsInfo.bg,
      border: dsInfo.border,
      title: dsInfo.text,
      text: dsInfo.text,
    },
    success: {
      bg: dsSuccess.bg,
      border: dsSuccess.border,
      title: dsSuccess.text,
      text: dsSuccess.text,
    },
    warning: {
      bg: dsWarning.bg,
      border: dsWarning.border,
      title: dsWarning.text,
      text: dsWarning.text,
    },
    danger: {
      bg: dsError.bg,
      border: dsError.border,
      title: dsError.text,
      text: dsError.text,
    },
    neutral: {
      bg: 'bg-gray-50 dark:bg-gray-800',
      border: 'border-gray-200 dark:border-gray-700',
      title: 'text-gray-900 dark:text-gray-100',
      text: 'text-gray-700 dark:text-gray-300',
    },
  };

  // Size/padding configurations
  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const variantConfig = variantClasses[variant];

  return (
    <View
      className={cn(
        'rounded-lg',
        variantConfig.bg,
        bordered && `border ${variantConfig.border}`,
        sizeClasses[size],
        className
      )}
    >
      {(title || icon) && (
        <View className='flex flex-row items-start gap-3 mb-2'>
          {icon}
          {title && (
            <Text className={cn('font-semibold', variantConfig.title)}>
              {title}
            </Text>
          )}
        </View>
      )}
      <View className={cn(!title && !icon && variantConfig.text)}>
        {children}
      </View>
    </View>
  );
};
