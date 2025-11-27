import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '../../lib/utils';
import { variants as v } from '@sudobility/design';

export interface AlertProps extends ViewProps {
  variant?: 'info' | 'success' | 'warning' | 'attention' | 'error';
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

// Default icons as simple text - can be replaced with react-native-heroicons
const defaultIcons: Record<string, string> = {
  info: 'ℹ️',
  success: '✓',
  warning: '⚠️',
  attention: '🔔',
  error: '✕',
};

export const AlertTitle: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <Text className={cn('font-medium mb-1', className)}>{children}</Text>
);

export const AlertDescription: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <Text className={cn('text-sm', className)}>{children}</Text>
);

/**
 * Alert component for React Native
 *
 * @example
 * ```tsx
 * <Alert variant="success" title="Success!" description="Your changes have been saved." />
 * ```
 */
export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  title,
  description,
  icon,
  children,
  className,
  ...props
}) => {
  const IconComponent = icon || (
    <Text className='text-lg'>{defaultIcons[variant]}</Text>
  );

  const alertClass =
    typeof v.alert[variant] === 'function' ? v.alert[variant]() : '';

  return (
    <View
      className={cn(alertClass, 'flex-row items-start gap-3', className)}
      accessibilityRole='alert'
      {...props}
    >
      {IconComponent && <View className='flex-shrink-0'>{IconComponent}</View>}
      <View className='flex-1'>
        {title && <Text className='font-medium mb-1'>{title}</Text>}
        {description && <Text className='text-sm'>{description}</Text>}
        {children}
      </View>
    </View>
  );
};
