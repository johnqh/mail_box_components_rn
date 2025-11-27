import * as React from 'react';
import { View, ScrollView, SafeAreaView } from 'react-native';
import { cn } from '../../lib/utils';

export interface PageContainerProps {
  /** Page content */
  children: React.ReactNode;
  /** Background variant */
  background?: 'default' | 'surface' | 'transparent';
  /** Enable scrolling */
  scrollable?: boolean;
  /** Use SafeAreaView */
  safeArea?: boolean;
  /** Padding variant */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** Additional className */
  className?: string;
}

/**
 * PageContainer Component
 *
 * Full-screen page container with background and safe area handling.
 * Provides consistent page layouts across the app.
 *
 * @example
 * ```tsx
 * <PageContainer>
 *   <Header />
 *   <Content />
 * </PageContainer>
 * ```
 *
 * @example
 * ```tsx
 * <PageContainer
 *   background="surface"
 *   scrollable
 *   safeArea
 *   padding="md"
 * >
 *   <FormContent />
 * </PageContainer>
 * ```
 */
export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  background = 'default',
  scrollable = false,
  safeArea = true,
  padding = 'none',
  className,
}) => {
  const backgroundClasses = {
    default: 'bg-gray-50 dark:bg-gray-900',
    surface: 'bg-white dark:bg-gray-800',
    transparent: 'bg-transparent',
  };

  const paddingClasses = {
    none: '',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6',
  };

  const containerClasses = cn(
    'flex-1',
    backgroundClasses[background],
    paddingClasses[padding],
    className
  );

  const content = scrollable ? (
    <ScrollView
      className={containerClasses}
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View className={containerClasses}>{children}</View>
  );

  if (safeArea) {
    return (
      <SafeAreaView className={cn('flex-1', backgroundClasses[background])}>
        {content}
      </SafeAreaView>
    );
  }

  return content;
};
