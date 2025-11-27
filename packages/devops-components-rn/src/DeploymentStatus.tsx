import React from 'react';
import { Text, Pressable, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface DeploymentStatusProps extends ViewProps {
  disabled?: boolean;
  onPress?: () => void;
  children?: React.ReactNode;
}

export const DeploymentStatus: React.FC<DeploymentStatusProps> = ({
  className,
  children,
  disabled = false,
  onPress,
  ...props
}) => (
  <Pressable
    onPress={disabled ? undefined : onPress}
    disabled={disabled}
    accessibilityRole="button"
    accessibilityLabel="Deployment Status"
    className={cn(
      'p-4 rounded-lg border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700',
      disabled && 'opacity-50',
      className
    )}
    {...props}
  >
    {children || <Text className="text-gray-900 dark:text-white">DeploymentStatus Component</Text>}
  </Pressable>
);
