import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';
import { colors, textVariants } from '@sudobility/design';

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
  iconColor = colors.component.alert.info.icon,
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
        <View className={cn('w-6 h-6 rounded-full items-center justify-center', colors.component.badge.primary.base, colors.component.badge.primary.dark)}>
          <Text className={colors.component.alert.info.icon}>✓</Text>
        </View>
      )}
      <View className='flex-1'>
        <Text className={textVariants.body.strong.md()}>
          {title}
        </Text>
        {description && (
          <Text className={cn(textVariants.body.sm(), 'mt-1')}>
            {description}
          </Text>
        )}
      </View>
    </View>
  );
};
