import React from 'react';
import { View, Text, Image, Pressable, type ViewProps } from 'react-native';
import { cn, Card } from '@sudobility/components-rn';
import { colors, textVariants } from '@sudobility/design';

export interface ContactCardProps extends Omit<ViewProps, 'role'> {
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  onPress?: () => void;
}

/**
 * Contact card component for displaying email contacts
 */
export const ContactCard: React.FC<ContactCardProps> = ({
  name,
  email,
  avatar,
  role,
  onPress,
  className,
  ...props
}) => {
  const content = (
    <View className='flex-row items-center gap-3'>
      {avatar ? (
        <Image
          source={{ uri: avatar }}
          className='w-12 h-12 rounded-full'
          accessibilityLabel={`${name}'s avatar`}
        />
      ) : (
        <View className={cn('w-12 h-12 rounded-full items-center justify-center', colors.component.badge.primary.base, colors.component.badge.primary.dark)}>
          <Text className={cn(colors.component.alert.info.icon, 'text-lg font-semibold')}>
            {name.charAt(0).toUpperCase()}
          </Text>
        </View>
      )}
      <View className='flex-1'>
        <Text className={textVariants.body.strong.md()}>
          {name}
        </Text>
        <Text className={textVariants.body.sm()}>
          {email}
        </Text>
        {role && (
          <Text className={textVariants.caption.default()}>
            {role}
          </Text>
        )}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className={cn('active:opacity-80', className)}
        accessibilityRole='button'
        accessibilityLabel={`Contact ${name}`}
        {...props}
      >
        <Card variant='bordered' padding='md'>
          {content}
        </Card>
      </Pressable>
    );
  }

  return (
    <Card variant='bordered' padding='md' className={className} {...props}>
      {content}
    </Card>
  );
};
