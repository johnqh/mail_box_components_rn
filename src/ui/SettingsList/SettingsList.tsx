import * as React from 'react';
import { View, Text, Pressable } from 'react-native';
import { cn } from '../../lib/utils';

/**
 * Setting item interface
 */
export interface SettingItem {
  /** Unique identifier */
  id: string;
  /** Setting title */
  title: string;
  /** Icon component or element */
  icon?: React.ReactNode;
  /** Optional description */
  description?: string;
}

export interface SettingsListProps {
  /** Array of setting items to display */
  settings: SettingItem[];
  /** Currently selected setting ID */
  selectedSetting?: string;
  /** Callback when a setting is selected */
  onSettingSelect: (settingId: string) => void;
  /** Additional className */
  className?: string;
}

/**
 * SettingsList Component
 *
 * Displays a list of setting items for navigation, similar to how
 * mailboxes are displayed in a mail client sidebar.
 *
 * Features:
 * - Each item shows an icon and title
 * - Highlights the currently selected setting
 * - Active states for better UX
 * - Dark mode support
 * - Accessible navigation
 *
 * @example
 * ```tsx
 * <SettingsList
 *   settings={[
 *     { id: 'general', title: 'General', icon: <CogIcon /> },
 *     { id: 'forwarding', title: 'Forwarding', icon: <ArrowRightIcon /> },
 *   ]}
 *   selectedSetting="general"
 *   onSettingSelect={handleSelect}
 * />
 * ```
 */
export const SettingsList: React.FC<SettingsListProps> = ({
  settings,
  selectedSetting,
  onSettingSelect,
  className,
}) => {
  return (
    <View
      className={cn('gap-1', className)}
      accessibilityRole='list'
      accessibilityLabel='Settings navigation'
    >
      {settings.map(setting => {
        const isSelected = selectedSetting === setting.id;

        return (
          <Pressable
            key={setting.id}
            onPress={() => onSettingSelect(setting.id)}
            className={cn(
              'flex-row items-center px-3 py-2.5 rounded-lg min-h-[44px]',
              isSelected
                ? 'bg-orange-100 dark:bg-orange-900/30'
                : 'active:bg-gray-100 dark:active:bg-gray-700'
            )}
            accessibilityRole='button'
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={setting.title}
            accessibilityHint={setting.description}
          >
            {setting.icon && (
              <View className='w-5 h-5 mr-3 flex-shrink-0'>{setting.icon}</View>
            )}
            <View className='flex-1 min-w-0'>
              <Text
                className={cn(
                  'text-sm',
                  isSelected
                    ? 'text-orange-700 dark:text-orange-300'
                    : 'text-gray-700 dark:text-gray-300'
                )}
                numberOfLines={1}
              >
                {setting.title}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
};
