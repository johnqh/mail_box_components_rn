import * as React from 'react';
import { View, Text, Pressable } from 'react-native';
import { cn } from '../../lib/utils';

export interface Feature {
  /** Unique identifier */
  id?: string;
  /** Icon element */
  icon: React.ReactNode;
  /** Feature title */
  title: string;
  /** Feature description */
  description: string | React.ReactNode;
  /** Badge text and variant */
  badge?: {
    text: string;
    variant?: 'success' | 'info' | 'warning' | 'default';
  };
}

export interface FeatureGridProps {
  /** Array of features to display */
  features: Feature[];
  /** Number of columns */
  columns?: 1 | 2 | 3 | 4;
  /** Gap between items */
  gap?: 'sm' | 'md' | 'lg';
  /** Card style variant */
  cardVariant?: 'default' | 'card' | 'minimal';
  /** Icon size */
  iconSize?: 'sm' | 'md' | 'lg';
  /** Feature press handler */
  onFeaturePress?: (feature: Feature) => void;
  /** Additional className */
  className?: string;
}

/**
 * FeatureGrid Component
 *
 * Grid layout for displaying feature cards.
 *
 * @example
 * ```tsx
 * <FeatureGrid
 *   features={[
 *     { icon: <Icon1 />, title: 'Feature 1', description: 'Description 1' },
 *     { icon: <Icon2 />, title: 'Feature 2', description: 'Description 2' },
 *   ]}
 *   columns={2}
 * />
 * ```
 */
export const FeatureGrid: React.FC<FeatureGridProps> = ({
  features,
  columns = 2,
  gap = 'md',
  cardVariant = 'default',
  iconSize = 'md',
  onFeaturePress,
  className,
}) => {
  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
  };

  const iconSizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20',
  };

  const badgeVariants = {
    success:
      'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
    info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
    warning:
      'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300',
    default: 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300',
  };

  const renderFeature = (feature: Feature, index: number) => {
    const content = (
      <View
        className={cn(
          'items-center',
          cardVariant === 'card' &&
            'bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg',
          cardVariant === 'minimal' && 'gap-4'
        )}
      >
        {/* Badge */}
        {feature.badge && (
          <View className='mb-4'>
            <View
              className={cn(
                'px-2.5 py-0.5 rounded-full',
                badgeVariants[feature.badge.variant || 'default']
              )}
            >
              <Text className='text-xs font-medium'>{feature.badge.text}</Text>
            </View>
          </View>
        )}

        {/* Icon */}
        <View
          className={cn(
            'items-center justify-center rounded-2xl mb-4',
            'bg-blue-100 dark:bg-blue-900/30',
            iconSizeClasses[iconSize]
          )}
        >
          <View className='text-blue-600 dark:text-blue-400'>
            {feature.icon}
          </View>
        </View>

        {/* Title */}
        <Text className='text-lg font-bold text-gray-900 dark:text-white mb-2 text-center'>
          {feature.title}
        </Text>

        {/* Description */}
        {typeof feature.description === 'string' ? (
          <Text className='text-gray-600 dark:text-gray-300 text-center leading-relaxed'>
            {feature.description}
          </Text>
        ) : (
          feature.description
        )}
      </View>
    );

    if (onFeaturePress) {
      return (
        <Pressable
          key={feature.id || index}
          onPress={() => onFeaturePress(feature)}
          className='flex-1'
          style={{ minWidth: `${100 / columns - 5}%` }}
          accessibilityRole='button'
          accessibilityLabel={feature.title}
        >
          {content}
        </Pressable>
      );
    }

    return (
      <View
        key={feature.id || index}
        className='flex-1'
        style={{ minWidth: `${100 / columns - 5}%` }}
      >
        {content}
      </View>
    );
  };

  return (
    <View className={cn('flex-row flex-wrap', gapClasses[gap], className)}>
      {features.map(renderFeature)}
    </View>
  );
};

// Helper function to create feature objects
export const createFeature = (
  icon: React.ReactNode,
  title: string,
  description: string | React.ReactNode,
  options?: Partial<Feature>
): Feature => ({
  icon,
  title,
  description,
  ...options,
});
