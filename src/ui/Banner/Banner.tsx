import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
import { InfoType } from '@sudobility/types';
import { cn } from '../../lib/utils';

export interface BannerProps {
  /** Whether the banner is visible */
  isVisible: boolean;
  /** Callback when banner is dismissed */
  onDismiss: () => void;
  /** Banner title */
  title: string;
  /** Banner description (optional) */
  description?: string;
  /** Visual variant */
  variant?: InfoType;
  /** Auto-dismiss duration in milliseconds (0 to disable, default: 5000) */
  duration?: number;
  /** Custom icon (overrides variant icon) */
  icon?: React.ReactNode;
  /** Additional NativeWind classes */
  className?: string;
  /** Accessible label for close button */
  closeAccessibilityLabel?: string;
}

const variantConfig: Record<
  InfoType,
  {
    icon: string;
    container: string;
    iconColor: string;
    titleColor: string;
    descriptionColor: string;
  }
> = {
  [InfoType.INFO]: {
    icon: '\u2139',
    container:
      'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800',
    iconColor: 'text-blue-600 dark:text-blue-400',
    titleColor: 'text-blue-900 dark:text-blue-100',
    descriptionColor: 'text-blue-700 dark:text-blue-300',
  },
  [InfoType.SUCCESS]: {
    icon: '\u2713',
    container:
      'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',
    iconColor: 'text-green-600 dark:text-green-400',
    titleColor: 'text-green-900 dark:text-green-100',
    descriptionColor: 'text-green-700 dark:text-green-300',
  },
  [InfoType.WARNING]: {
    icon: '\u26A0',
    container:
      'bg-yellow-50 dark:bg-amber-950 border-yellow-200 dark:border-amber-800',
    iconColor: 'text-yellow-600 dark:text-amber-400',
    titleColor: 'text-yellow-900 dark:text-amber-100',
    descriptionColor: 'text-yellow-700 dark:text-amber-300',
  },
  [InfoType.ERROR]: {
    icon: '\u2717',
    container: 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800',
    iconColor: 'text-red-600 dark:text-red-400',
    titleColor: 'text-red-900 dark:text-red-100',
    descriptionColor: 'text-red-700 dark:text-red-300',
  },
};

/**
 * Banner Component
 *
 * A temporary notification banner that slides down from the top of the screen.
 * React Native port of the web Banner from @sudobility/components.
 *
 * Features:
 * - Slides down from top with spring animation
 * - Auto-dismisses after configurable duration (default 5 seconds)
 * - Manual dismiss via close button
 * - Multiple variants: info, success, warning, error
 * - Dark/light theme support via NativeWind
 *
 * @example
 * ```tsx
 * const [showBanner, setShowBanner] = useState(false);
 *
 * <Banner
 *   isVisible={showBanner}
 *   onDismiss={() => setShowBanner(false)}
 *   variant={InfoType.SUCCESS}
 *   title="Changes saved"
 *   description="Your settings have been updated successfully."
 * />
 * ```
 */
export const Banner: React.FC<BannerProps> = ({
  isVisible,
  onDismiss,
  title,
  description,
  variant = InfoType.INFO,
  duration = 5000,
  icon,
  className,
  closeAccessibilityLabel = 'Dismiss banner',
}) => {
  const [mounted, setMounted] = useState(false);
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const dismissTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const config = variantConfig[variant];

  const clearDismissTimeout = useCallback(() => {
    if (dismissTimeoutRef.current) {
      clearTimeout(dismissTimeoutRef.current);
      dismissTimeoutRef.current = null;
    }
  }, []);

  const handleDismiss = useCallback(() => {
    clearDismissTimeout();
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setMounted(false);
      onDismiss();
    });
  }, [clearDismissTimeout, slideAnim, opacityAnim, onDismiss]);

  // Handle visibility changes
  useEffect(() => {
    if (isVisible) {
      setMounted(true);
      slideAnim.setValue(-100);
      opacityAnim.setValue(0);

      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          friction: 8,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Start auto-dismiss timer after animation completes
        if (duration > 0) {
          dismissTimeoutRef.current = setTimeout(() => {
            handleDismiss();
          }, duration);
        }
      });
    } else if (mounted) {
      handleDismiss();
    }

    return () => clearDismissTimeout();
  }, [isVisible]); // eslint-disable-line react-hooks/exhaustive-deps

  // Cleanup on unmount
  useEffect(() => {
    return () => clearDismissTimeout();
  }, [clearDismissTimeout]);

  if (!mounted) {
    return null;
  }

  return (
    <Animated.View
      style={{
        transform: [{ translateY: slideAnim }],
        opacity: opacityAnim,
      }}
      className={cn('absolute top-0 left-0 right-0 z-50', className)}
      accessibilityRole='alert'
      accessibilityLiveRegion='polite'
    >
      <View
        className={cn(
          'flex-row items-start gap-3 p-4 border-b',
          config.container
        )}
      >
        {/* Icon */}
        <View className='flex-shrink-0 mt-0.5'>
          {icon || (
            <Text className={cn('text-lg', config.iconColor)}>
              {config.icon}
            </Text>
          )}
        </View>

        {/* Content */}
        <View className='flex-1 min-w-0'>
          <Text className={cn('font-semibold', config.titleColor)}>
            {title}
          </Text>
          {description ? (
            <Text className={cn('text-sm mt-1', config.descriptionColor)}>
              {description}
            </Text>
          ) : null}
        </View>

        {/* Close button */}
        <Pressable
          onPress={handleDismiss}
          className='flex-shrink-0 p-1 rounded-md'
          accessibilityRole='button'
          accessibilityLabel={closeAccessibilityLabel}
        >
          <Text className={cn('text-lg', config.iconColor)}>{'\u2717'}</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
};

/**
 * Hook for managing banner state
 *
 * @example
 * ```tsx
 * const { isVisible, bannerProps, showBanner, hideBanner } = useBanner();
 *
 * showBanner({
 *   title: 'Success!',
 *   description: 'Your changes have been saved.',
 *   variant: InfoType.SUCCESS,
 * });
 *
 * {bannerProps && (
 *   <Banner
 *     isVisible={isVisible}
 *     onDismiss={hideBanner}
 *     {...bannerProps}
 *   />
 * )}
 * ```
 */
export interface UseBannerOptions {
  /** Default duration for auto-dismiss (default: 5000) */
  defaultDuration?: number;
}

export interface UseBannerReturn {
  /** Whether the banner is currently visible */
  isVisible: boolean;
  /** Current banner props */
  bannerProps: {
    title: string;
    description?: string;
    variant: InfoType;
    duration: number;
  } | null;
  /** Show a banner */
  showBanner: (options: {
    title: string;
    description?: string;
    variant?: InfoType;
    duration?: number;
  }) => void;
  /** Hide the current banner */
  hideBanner: () => void;
}

export const useBanner = (options: UseBannerOptions = {}): UseBannerReturn => {
  const { defaultDuration = 5000 } = options;
  const [isVisible, setIsVisible] = useState(false);
  const [bannerProps, setBannerProps] =
    useState<UseBannerReturn['bannerProps']>(null);

  const showBanner = useCallback(
    ({
      title,
      description,
      variant = InfoType.INFO,
      duration = defaultDuration,
    }: {
      title: string;
      description?: string;
      variant?: InfoType;
      duration?: number;
    }) => {
      setBannerProps({ title, description, variant, duration });
      setIsVisible(true);
    },
    [defaultDuration]
  );

  const hideBanner = useCallback(() => {
    setIsVisible(false);
  }, []);

  return {
    isVisible,
    bannerProps,
    showBanner,
    hideBanner,
  };
};
