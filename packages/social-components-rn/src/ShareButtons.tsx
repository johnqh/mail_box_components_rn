import * as React from 'react';
import { View, Text, Pressable, Share, Linking, Alert } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { cn } from './utils';

export type SharePlatform =
  | 'native'
  | 'twitter'
  | 'facebook'
  | 'linkedin'
  | 'reddit'
  | 'email'
  | 'copy';

export interface ShareButtonsProps {
  /** URL to share */
  url: string;
  /** Title to share */
  title?: string;
  /** Description to share */
  description?: string;
  /** Platforms to show */
  platforms?: SharePlatform[];
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  /** Display variant */
  variant?: 'icons' | 'buttons';
  /** Additional className */
  className?: string;
}

/**
 * ShareButtons Component
 *
 * Social media share buttons for React Native.
 * Supports native share, Twitter, Facebook, LinkedIn, Reddit, email, and copy link.
 *
 * @example
 * ```tsx
 * <ShareButtons
 *   url="https://example.com/article"
 *   title="Check out this article!"
 *   platforms={['native', 'twitter', 'copy']}
 *   variant="buttons"
 * />
 * ```
 */
export const ShareButtons: React.FC<ShareButtonsProps> = ({
  url,
  title = '',
  description = '',
  platforms = ['native', 'twitter', 'facebook', 'copy'],
  size = 'md',
  variant = 'icons',
  className,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleShare = async (platform: SharePlatform) => {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedDescription = encodeURIComponent(description);

    try {
      switch (platform) {
        case 'native':
          await Share.share({
            message: description ? `${title}\n\n${description}\n\n${url}` : `${title}\n\n${url}`,
            url: url,
            title: title,
          });
          break;

        case 'twitter':
          await Linking.openURL(
            `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`
          );
          break;

        case 'facebook':
          await Linking.openURL(
            `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
          );
          break;

        case 'linkedin':
          await Linking.openURL(
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
          );
          break;

        case 'reddit':
          await Linking.openURL(
            `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`
          );
          break;

        case 'email':
          await Linking.openURL(
            `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`
          );
          break;

        case 'copy':
          if (Clipboard && Clipboard.setStringAsync) {
            await Clipboard.setStringAsync(url);
          }
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
          break;
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to share');
    }
  };

  const sizeConfig = {
    sm: { icon: 24, button: 'px-2 py-1', text: 'text-xs' },
    md: { icon: 32, button: 'px-3 py-2', text: 'text-sm' },
    lg: { icon: 40, button: 'px-4 py-3', text: 'text-base' },
  };

  const config = sizeConfig[size];

  const platformConfig: Record<SharePlatform, { name: string; color: string; icon: string }> = {
    native: {
      name: 'Share',
      color: 'bg-blue-600',
      icon: '↗',
    },
    twitter: {
      name: 'Twitter',
      color: 'bg-sky-500',
      icon: '𝕏',
    },
    facebook: {
      name: 'Facebook',
      color: 'bg-blue-600',
      icon: 'f',
    },
    linkedin: {
      name: 'LinkedIn',
      color: 'bg-blue-700',
      icon: 'in',
    },
    reddit: {
      name: 'Reddit',
      color: 'bg-orange-600',
      icon: 'r',
    },
    email: {
      name: 'Email',
      color: 'bg-gray-600',
      icon: '✉',
    },
    copy: {
      name: copied ? 'Copied!' : 'Copy',
      color: 'bg-gray-700',
      icon: copied ? '✓' : '🔗',
    },
  };

  return (
    <View className={cn('flex-row flex-wrap gap-2', className)}>
      {platforms.map(platform => {
        const platformCfg = platformConfig[platform];

        if (variant === 'icons') {
          return (
            <Pressable
              key={platform}
              onPress={() => handleShare(platform)}
              className={cn(
                'rounded-full items-center justify-center',
                platformCfg.color
              )}
              style={{
                width: config.icon,
                height: config.icon,
              }}
              accessibilityRole="button"
              accessibilityLabel={`Share on ${platformCfg.name}`}
            >
              {({ pressed }) => (
                <Text
                  className="text-white font-bold"
                  style={{
                    fontSize: config.icon * 0.5,
                    opacity: pressed ? 0.7 : 1,
                  }}
                >
                  {platformCfg.icon}
                </Text>
              )}
            </Pressable>
          );
        }

        return (
          <Pressable
            key={platform}
            onPress={() => handleShare(platform)}
            className={cn(
              'rounded items-center justify-center',
              config.button,
              platformCfg.color
            )}
            accessibilityRole="button"
            accessibilityLabel={`Share on ${platformCfg.name}`}
          >
            {({ pressed }) => (
              <Text
                className={cn('text-white font-medium', config.text)}
                style={{ opacity: pressed ? 0.7 : 1 }}
              >
                {platformCfg.name}
              </Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
};
