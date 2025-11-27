import * as React from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { cn } from '../../lib/utils';

export interface ScrollSpySection {
  /** Section ID */
  id: string;
  /** Section label */
  label: string;
  /** Subsections */
  subsections?: ScrollSpySection[];
}

export interface ScrollSpyProps {
  /** Sections to track */
  sections: ScrollSpySection[];
  /** Active section ID */
  activeId?: string;
  /** Active section change handler */
  onActiveChange?: (id: string) => void;
  /** Section press handler - called when user taps a section link */
  onSectionPress?: (id: string) => void;
  /** Show subsections */
  showSubsections?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * ScrollSpy Component
 *
 * Navigation that highlights the active section.
 * Pairs with ScrollSpyContainer for automatic scroll tracking.
 *
 * @example
 * ```tsx
 * <ScrollSpy
 *   sections={[
 *     { id: 'intro', label: 'Introduction' },
 *     { id: 'features', label: 'Features' },
 *     { id: 'pricing', label: 'Pricing' }
 *   ]}
 *   activeId={activeSection}
 *   onSectionPress={(id) => scrollToSection(id)}
 * />
 * ```
 */
export const ScrollSpy: React.FC<ScrollSpyProps> = ({
  sections,
  activeId,
  onActiveChange,
  onSectionPress,
  showSubsections = true,
  className,
}) => {
  const handlePress = (id: string) => {
    if (onActiveChange) {
      onActiveChange(id);
    }
    if (onSectionPress) {
      onSectionPress(id);
    }
  };

  // Render section
  const renderSection = (section: ScrollSpySection, level: number = 0) => {
    const isActive = activeId === section.id;
    const hasActiveChild =
      section.subsections?.some(sub => activeId === sub.id) || false;

    return (
      <View key={section.id}>
        <Pressable
          onPress={() => handlePress(section.id)}
          className={cn(
            'py-2 px-3 rounded-lg',
            isActive
              ? 'bg-blue-50 dark:bg-blue-900/30'
              : 'active:bg-gray-100 dark:active:bg-gray-800'
          )}
          style={{ paddingLeft: level * 12 + 12 }}
          accessibilityRole='button'
          accessibilityLabel={section.label}
          accessibilityState={{ selected: isActive }}
        >
          <Text
            className={cn(
              'text-sm',
              level === 0 ? 'font-medium' : 'font-normal',
              isActive
                ? 'text-blue-700 dark:text-blue-300'
                : hasActiveChild
                  ? 'text-gray-700 dark:text-gray-300'
                  : 'text-gray-600 dark:text-gray-400'
            )}
          >
            {section.label}
          </Text>
        </Pressable>

        {/* Subsections */}
        {showSubsections &&
          section.subsections &&
          section.subsections.length > 0 && (
            <View className='ml-3 border-l-2 border-gray-200 dark:border-gray-700'>
              {section.subsections.map(subsection =>
                renderSection(subsection, level + 1)
              )}
            </View>
          )}
      </View>
    );
  };

  return (
    <View className={cn('gap-1', className)}>
      {sections.map(section => renderSection(section, 0))}
    </View>
  );
};

export interface SectionPosition {
  id: string;
  y: number;
  height: number;
}

export interface ScrollSpyContainerProps {
  /** Children content with sections */
  children: React.ReactNode;
  /** Sections configuration for tracking */
  sections: ScrollSpySection[];
  /** Active section change handler */
  onActiveChange?: (id: string) => void;
  /** Offset from top for determining active section */
  offset?: number;
  /** Additional className */
  className?: string;
}

/**
 * ScrollSpyContainer Component
 *
 * Scrollable container that tracks section visibility.
 * Use with ScrollSpySection to mark sections for tracking.
 *
 * @example
 * ```tsx
 * <ScrollSpyContainer
 *   sections={tocSections}
 *   onActiveChange={setActiveSection}
 * >
 *   <ScrollSpySection id="intro">
 *     <Introduction />
 *   </ScrollSpySection>
 *   <ScrollSpySection id="features">
 *     <Features />
 *   </ScrollSpySection>
 * </ScrollSpyContainer>
 * ```
 */
export const ScrollSpyContainer: React.FC<ScrollSpyContainerProps> = ({
  children,
  sections,
  onActiveChange,
  offset = 80,
  className,
}) => {
  const scrollViewRef = React.useRef<ScrollView>(null);
  const sectionPositions = React.useRef<Map<string, SectionPosition>>(
    new Map()
  );

  // Handle scroll event
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y;

    // Find active section based on scroll position
    const getAllIds = (secs: ScrollSpySection[]): string[] => {
      return secs.flatMap(section => [
        section.id,
        ...(section.subsections ? getAllIds(section.subsections) : []),
      ]);
    };

    const allIds = getAllIds(sections);
    let activeId = allIds[0];

    for (const id of allIds) {
      const position = sectionPositions.current.get(id);
      if (position && position.y <= y + offset) {
        activeId = id;
      }
    }

    if (onActiveChange) {
      onActiveChange(activeId);
    }
  };

  // Scroll to section
  const scrollToSection = React.useCallback(
    (id: string) => {
      const position = sectionPositions.current.get(id);
      if (position && scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          y: Math.max(0, position.y - offset + 1),
          animated: true,
        });
      }
    },
    [offset]
  );

  // Context for child sections to register positions
  const contextValue = React.useMemo(
    () => ({
      registerSection: (id: string, y: number, height: number) => {
        sectionPositions.current.set(id, { id, y, height });
      },
      unregisterSection: (id: string) => {
        sectionPositions.current.delete(id);
      },
      scrollToSection,
    }),
    [scrollToSection]
  );

  return (
    <ScrollSpyContext.Provider value={contextValue}>
      <ScrollView
        ref={scrollViewRef}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        className={cn('flex-1', className)}
      >
        {children}
      </ScrollView>
    </ScrollSpyContext.Provider>
  );
};

// Context for section registration
interface ScrollSpyContextType {
  registerSection: (id: string, y: number, height: number) => void;
  unregisterSection: (id: string) => void;
  scrollToSection: (id: string) => void;
}

const ScrollSpyContext = React.createContext<ScrollSpyContextType | null>(null);

export const useScrollSpy = () => {
  const context = React.useContext(ScrollSpyContext);
  return context;
};

export interface ScrollSpySectionWrapperProps {
  /** Section ID - must match an ID in ScrollSpy sections */
  id: string;
  /** Section content */
  children: React.ReactNode;
  /** Additional className */
  className?: string;
}

/**
 * ScrollSpySectionWrapper Component
 *
 * Wrapper for content sections that should be tracked by ScrollSpy.
 *
 * @example
 * ```tsx
 * <ScrollSpySectionWrapper id="features">
 *   <FeaturesList />
 * </ScrollSpySectionWrapper>
 * ```
 */
export const ScrollSpySectionWrapper: React.FC<
  ScrollSpySectionWrapperProps
> = ({ id, children, className }) => {
  const context = React.useContext(ScrollSpyContext);

  const handleLayout = React.useCallback(
    (event: { nativeEvent: { layout: { y: number; height: number } } }) => {
      if (context) {
        const { y, height } = event.nativeEvent.layout;
        context.registerSection(id, y, height);
      }
    },
    [context, id]
  );

  React.useEffect(() => {
    return () => {
      if (context) {
        context.unregisterSection(id);
      }
    };
  }, [context, id]);

  return (
    <View onLayout={handleLayout} className={className}>
      {children}
    </View>
  );
};
