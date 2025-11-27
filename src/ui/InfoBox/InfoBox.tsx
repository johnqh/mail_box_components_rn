import * as React from 'react';
import { View, Text } from 'react-native';
import { cn } from '../../lib/utils';

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
  // Color variant configurations
  const variantClasses = {
    info: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      title: 'text-blue-900 dark:text-blue-300',
      text: 'text-blue-800 dark:text-blue-400',
    },
    success: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      title: 'text-green-900 dark:text-green-300',
      text: 'text-green-800 dark:text-green-400',
    },
    warning: {
      bg: 'bg-yellow-50 dark:bg-yellow-900/20',
      border: 'border-yellow-200 dark:border-yellow-800',
      title: 'text-yellow-900 dark:text-yellow-300',
      text: 'text-yellow-800 dark:text-yellow-400',
    },
    danger: {
      bg: 'bg-red-50 dark:bg-red-900/20',
      border: 'border-red-200 dark:border-red-800',
      title: 'text-red-900 dark:text-red-300',
      text: 'text-red-800 dark:text-red-400',
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
