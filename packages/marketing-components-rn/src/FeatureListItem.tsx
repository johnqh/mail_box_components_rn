import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

export interface FeatureListItemProps extends ViewProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  iconColor?: string;
}

/**
 * Feature list item component for marketing pages
 */
export const FeatureListItem: React.FC<FeatureListItemProps> = ({
  title,
  description,
  icon,
  iconColor = 'text-blue-600 dark:text-blue-400',
  className,
  ...props
}) => {
  return (
    <View
      className={cn('flex-row items-start gap-4 py-3', className)}
      {...props}
    >
      {icon ? (
        <View className={cn('w-6 h-6', iconColor)}>{icon}</View>
      ) : (
        <View className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 items-center justify-center">
          <Text className="text-blue-600 dark:text-blue-400">✓</Text>
        </View>
      )}
      <View className="flex-1">
        <Text className="font-semibold text-gray-900 dark:text-white">
          {title}
        </Text>
        {description && (
          <Text className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {description}
          </Text>
        )}
      </View>
    </View>
  );
};
