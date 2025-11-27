import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { cn } from '../../lib/utils';

// Enable LayoutAnimation on Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export interface CollapsibleSectionItem {
  /** Unique identifier */
  id: string;
  /** Item title */
  title: string;
  /** Item content */
  content?: React.ReactNode;
}

export interface CollapsibleSectionProps {
  /** Section ID */
  id: string;
  /** Section title */
  title: string;
  /** Section content (shown when no subsections) */
  content?: React.ReactNode;
  /** Subsections */
  subsections?: CollapsibleSectionItem[];
  /** Whether section is selected */
  isSelected?: boolean;
  /** Currently selected subsection ID */
  selectedSubsection?: string | null;
  /** Section select handler */
  onSectionSelect?: (sectionId: string) => void;
  /** Subsection select handler */
  onSubsectionSelect?: (subsectionId: string, parentSectionId: string) => void;
  /** Additional className */
  className?: string;
}

/**
 * CollapsibleSection Component
 *
 * Collapsible section with optional subsections.
 * Useful for documentation, FAQs, or navigation.
 *
 * @example
 * ```tsx
 * <CollapsibleSection
 *   id="getting-started"
 *   title="Getting Started"
 *   subsections={[
 *     { id: 'install', title: 'Installation' },
 *     { id: 'setup', title: 'Setup' },
 *   ]}
 *   isSelected={selectedSection === 'getting-started'}
 *   onSectionSelect={setSelectedSection}
 *   onSubsectionSelect={handleSubsectionSelect}
 * />
 * ```
 */
export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  id,
  title,
  subsections,
  isSelected = false,
  selectedSubsection = null,
  onSectionSelect,
  onSubsectionSelect,
  className,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const hasSubsections = subsections && subsections.length > 0;

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: isExpanded ? 1 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isExpanded, rotateAnim]);

  const handleToggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  const handleSectionPress = () => {
    onSectionSelect?.(id);
  };

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'],
  });

  return (
    <View className={className}>
      {/* Section Header */}
      <View className='flex-row items-center'>
        {/* Selection overlay */}
        {isSelected && !selectedSubsection && (
          <View className='absolute top-1 bottom-1 left-1 right-10 bg-blue-500/20 dark:bg-blue-400/20 rounded-lg' />
        )}

        {/* Title button */}
        <Pressable
          onPress={handleSectionPress}
          className='flex-1 py-4 pl-4 pr-2'
          accessibilityRole='button'
          accessibilityLabel={title}
          accessibilityState={{ selected: isSelected && !selectedSubsection }}
        >
          <Text
            className={cn(
              'text-base font-medium',
              isSelected && !selectedSubsection
                ? 'text-blue-700 dark:text-blue-300'
                : 'text-gray-700 dark:text-gray-300'
            )}
          >
            {title}
          </Text>
        </Pressable>

        {/* Expand/collapse button */}
        {hasSubsections && (
          <Pressable
            onPress={handleToggle}
            className='p-2 rounded-md'
            accessibilityRole='button'
            accessibilityLabel={isExpanded ? 'Collapse' : 'Expand'}
          >
            <Animated.View style={{ transform: [{ rotate: rotation }] }}>
              <Text className='text-gray-500 text-lg'>›</Text>
            </Animated.View>
          </Pressable>
        )}
      </View>

      {/* Subsections */}
      {hasSubsections && isExpanded && (
        <View className='ml-6 mb-2'>
          {subsections.map(subsection => (
            <View key={subsection.id} className='relative'>
              {/* Selection overlay */}
              {selectedSubsection === subsection.id && (
                <View className='absolute top-0.5 bottom-0.5 left-0 right-8 bg-blue-500/20 dark:bg-blue-400/20 rounded-lg' />
              )}

              <Pressable
                onPress={() => onSubsectionSelect?.(subsection.id, id)}
                className='py-2 pl-4 pr-3'
                accessibilityRole='button'
                accessibilityLabel={subsection.title}
                accessibilityState={{
                  selected: selectedSubsection === subsection.id,
                }}
              >
                <Text
                  className={cn(
                    'text-sm',
                    selectedSubsection === subsection.id
                      ? 'text-blue-700 dark:text-blue-300'
                      : 'text-gray-600 dark:text-gray-400'
                  )}
                >
                  {subsection.title}
                </Text>
              </Pressable>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};
