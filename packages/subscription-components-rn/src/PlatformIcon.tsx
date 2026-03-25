import { Text } from 'react-native';

type PlatformType = 'web' | 'ios' | 'android' | 'macos';

interface PlatformIconProps {
  platform: PlatformType;
  className?: string;
}

const PLATFORM_ICONS: Record<PlatformType, string> = {
  web: '🌐',
  ios: '',
  android: '🤖',
  macos: '',
};

const PLATFORM_DISPLAY_NAMES: Record<PlatformType, string> = {
  web: 'Web',
  ios: 'iOS',
  android: 'Android',
  macos: 'macOS',
};

export function PlatformIcon({ platform, className }: PlatformIconProps) {
  return (
    <Text className={className}>
      {PLATFORM_ICONS[platform]}
    </Text>
  );
}

export function platformDisplayName(platform: PlatformType): string {
  return PLATFORM_DISPLAY_NAMES[platform];
}
