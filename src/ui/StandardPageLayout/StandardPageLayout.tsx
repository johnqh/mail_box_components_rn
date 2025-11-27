import * as React from 'react';
import { View } from 'react-native';
import { cn } from '../../lib/utils';

export interface StandardPageLayoutProps {
  /** Page content */
  children: React.ReactNode;
  /** Background className */
  backgroundClassName?: string;
  /** Content className */
  contentClassName?: string;
}

/**
 * StandardPageLayout Component
 *
 * A simple page layout wrapper that applies consistent background
 * and content styling.
 *
 * @example
 * ```tsx
 * <StandardPageLayout
 *   backgroundClassName="bg-gray-100 dark:bg-gray-900"
 *   contentClassName="p-4"
 * >
 *   <YourPageContent />
 * </StandardPageLayout>
 * ```
 */
export const StandardPageLayout: React.FC<StandardPageLayoutProps> = ({
  children,
  backgroundClassName,
  contentClassName,
}) => {
  return (
    <View className={cn('flex-1', backgroundClassName)}>
      <View className={cn('flex-1', contentClassName)}>{children}</View>
    </View>
  );
};
