import * as React from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  ImageSourcePropType,
} from 'react-native';
import { cn } from '../../lib/utils';

export interface LogoProps {
  /** Logo size */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Additional className */
  className?: string;
  /** Show text alongside logo */
  showText?: boolean;
  /** Press handler */
  onPress?: () => void;
  /** Logo image source */
  logoSource?: ImageSourcePropType;
  /** Logo alt text */
  logoAlt?: string;
  /** Logo text (required) */
  logoText: string;
}

/**
 * Logo Component
 *
 * Displays a logo with optional text.
 * Supports multiple sizes and optional press handler.
 *
 * @example
 * ```tsx
 * <Logo
 *   logoText="MyApp"
 *   logoSource={require('./assets/logo.png')}
 *   size="lg"
 *   onPress={() => navigation.navigate('Home')}
 * />
 * ```
 */
export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  className,
  showText = true,
  onPress,
  logoSource,
  logoAlt = 'Logo',
  logoText,
}) => {
  // Size configurations
  const sizeConfig = {
    sm: {
      container: 'gap-2',
      image: { width: 24, height: 24 },
      text: 'text-lg',
    },
    md: {
      container: 'gap-2',
      image: { width: 32, height: 32 },
      text: 'text-2xl',
    },
    lg: {
      container: 'gap-3',
      image: { width: 40, height: 40 },
      text: 'text-3xl',
    },
    xl: {
      container: 'gap-4',
      image: { width: 48, height: 48 },
      text: 'text-4xl',
    },
  };

  const config = sizeConfig[size];

  const logoContent = (
    <>
      {logoSource && (
        <Image
          source={logoSource}
          style={config.image}
          accessibilityLabel={logoAlt}
          resizeMode='contain'
        />
      )}
      {showText && (
        <Text
          className={cn(
            'font-bold text-gray-900 dark:text-gray-100',
            config.text
          )}
        >
          {logoText}
        </Text>
      )}
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className={cn(
          'flex-row items-center',
          config.container,
          'active:opacity-80',
          className
        )}
        accessibilityRole='button'
        accessibilityLabel={`${logoText} logo`}
      >
        {logoContent}
      </Pressable>
    );
  }

  return (
    <View
      className={cn('flex-row items-center', config.container, className)}
      accessibilityRole='image'
      accessibilityLabel={`${logoText} logo`}
    >
      {logoContent}
    </View>
  );
};
