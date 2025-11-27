import * as React from 'react';
import { useState } from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { cn } from '../../lib/utils';

export interface AvatarProps {
  /** Image source URL */
  src?: string;
  /** Alt text for image */
  alt?: string;
  /** Fallback text (initials) to display when no image */
  fallback?: string;
  /** Name to generate initials from */
  name?: string;
  /** Size variant */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Show status indicator */
  status?: 'online' | 'offline' | 'away' | 'busy';
  /** Additional className */
  className?: string;
  /** Click handler */
  onPress?: () => void;
}

/**
 * Avatar Component
 *
 * Avatar component for displaying user images or initials.
 *
 * @example
 * ```tsx
 * // User image
 * <Avatar src="https://example.com/avatar.jpg" alt="John Doe" fallback="JD" />
 *
 * // Generate initials from name
 * <Avatar name="John Doe" />
 *
 * // With status indicator
 * <Avatar src="/avatar.jpg" status="online" />
 * ```
 */
export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  fallback,
  name,
  size = 'md',
  status,
  className,
  onPress,
}) => {
  const [imageError, setImageError] = useState(false);

  // Size configurations
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const textSizeClasses = {
    xs: 'text-xs',
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg',
  };

  const statusSizeClasses = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
  };

  // Status indicator configurations
  const statusClasses = {
    online: 'bg-green-500',
    offline: 'bg-gray-400',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
  };

  // Generate initials from name
  const generateInitials = (name: string): string => {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    return (
      parts[0].charAt(0).toUpperCase() +
      parts[parts.length - 1].charAt(0).toUpperCase()
    );
  };

  // Determine what to display
  const displayFallback = fallback || (name ? generateInitials(name) : '');
  const showImage = src && !imageError;

  const handleImageError = () => {
    setImageError(true);
  };

  const content = (
    <View className='relative'>
      <View
        className={cn(
          'flex items-center justify-center overflow-hidden rounded-full',
          sizeClasses[size],
          !showImage && 'bg-gray-300 dark:bg-gray-600',
          className
        )}
      >
        {showImage ? (
          <Image
            source={{ uri: src }}
            className='w-full h-full'
            accessibilityLabel={alt}
            onError={handleImageError}
          />
        ) : (
          <Text
            className={cn(
              'font-semibold text-gray-700 dark:text-gray-200',
              textSizeClasses[size]
            )}
          >
            {displayFallback}
          </Text>
        )}
      </View>
      {status && (
        <View
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-2 border-white dark:border-gray-800',
            statusClasses[status],
            statusSizeClasses[size]
          )}
          accessibilityLabel={status}
        />
      )}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole='button'
        accessibilityLabel={alt}
      >
        {content}
      </Pressable>
    );
  }

  return content;
};

export interface AvatarGroupProps {
  /** Avatar components */
  children: React.ReactNode;
  /** Maximum number of avatars to show */
  max?: number;
  /** Size for all avatars */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Additional className */
  className?: string;
}

/**
 * AvatarGroup - Display multiple avatars in a stack
 */
export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  children,
  max = 5,
  size = 'md',
  className,
}) => {
  const childArray = React.Children.toArray(children);
  const excess = childArray.length - max;
  const visibleChildren = childArray.slice(0, max);

  // Overlap amounts based on size
  const overlapClasses = {
    xs: '-ml-2',
    sm: '-ml-2',
    md: '-ml-3',
    lg: '-ml-4',
    xl: '-ml-5',
  };

  return (
    <View className={cn('flex flex-row items-center', className)}>
      {visibleChildren.map((child, index) => (
        <View
          key={index}
          className={cn(index > 0 && overlapClasses[size])}
          style={{ zIndex: visibleChildren.length - index }}
        >
          {React.isValidElement(child)
            ? React.cloneElement(child as React.ReactElement<AvatarProps>, {
                size,
              })
            : child}
        </View>
      ))}
      {excess > 0 && (
        <View
          className={cn(
            overlapClasses[size],
            'flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600',
            {
              xs: 'w-6 h-6',
              sm: 'w-8 h-8',
              md: 'w-10 h-10',
              lg: 'w-12 h-12',
              xl: 'w-16 h-16',
            }[size]
          )}
        >
          <Text
            className={cn(
              'font-medium text-gray-700 dark:text-gray-200',
              {
                xs: 'text-xs',
                sm: 'text-xs',
                md: 'text-sm',
                lg: 'text-base',
                xl: 'text-lg',
              }[size]
            )}
          >
            +{excess}
          </Text>
        </View>
      )}
    </View>
  );
};
