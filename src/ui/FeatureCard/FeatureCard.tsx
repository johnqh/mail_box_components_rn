import * as React from 'react';
import { View, Text, Pressable } from 'react-native';
import { cn } from '../../lib/utils';

export type FeatureCardColor =
  | 'green'
  | 'blue'
  | 'purple'
  | 'orange'
  | 'red'
  | 'indigo'
  | 'cyan'
  | 'emerald'
  | 'pink'
  | 'gray';

export interface FeatureCardProps {
  /** Icon or emoji to display */
  icon: React.ReactNode;
  /** Title of the feature */
  title: string;
  /** Description of the feature */
  description: string;
  /** List of benefits (shown as bullet points) */
  benefits?: string[];
  /** Metrics to display */
  metrics?: { [key: string]: string };
  /** Color theme */
  color?: FeatureCardColor;
  /** Highlight with gradient background */
  isHighlight?: boolean;
  /** Optional CTA element */
  cta?: React.ReactNode;
  /** Press handler */
  onPress?: () => void;
  /** Show colored left border */
  borderColor?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * FeatureCard Component
 *
 * Card component for displaying features with icon, title, description,
 * benefits, and metrics.
 *
 * @example
 * ```tsx
 * <FeatureCard
 *   icon={<ShieldIcon />}
 *   title="Security"
 *   description="End-to-end encryption for all your data"
 *   benefits={['256-bit encryption', 'Zero-knowledge architecture']}
 *   color="blue"
 * />
 * ```
 */
export const FeatureCard: React.FC<FeatureCardProps> = ({
  icon,
  title,
  description,
  benefits,
  metrics,
  color = 'blue',
  isHighlight = false,
  cta,
  onPress,
  borderColor = false,
  className,
}) => {
  // Color configurations
  const colorClasses: Record<FeatureCardColor, string> = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
    purple: 'text-purple-600 dark:text-purple-400',
    orange: 'text-orange-600 dark:text-orange-400',
    pink: 'text-pink-600 dark:text-pink-400',
    gray: 'text-gray-600 dark:text-gray-400',
    red: 'text-red-600 dark:text-red-400',
    indigo: 'text-indigo-600 dark:text-indigo-400',
    cyan: 'text-cyan-600 dark:text-cyan-400',
    emerald: 'text-emerald-600 dark:text-emerald-400',
  };

  const borderColorClasses: Record<FeatureCardColor, string> = {
    green: 'border-l-4 border-l-green-500',
    blue: 'border-l-4 border-l-blue-500',
    purple: 'border-l-4 border-l-purple-500',
    orange: 'border-l-4 border-l-orange-500',
    red: 'border-l-4 border-l-red-500',
    indigo: 'border-l-4 border-l-indigo-500',
    cyan: 'border-l-4 border-l-cyan-500',
    emerald: 'border-l-4 border-l-emerald-500',
    pink: 'border-l-4 border-l-pink-500',
    gray: 'border-l-4 border-l-gray-500',
  };

  const iconBackgroundClasses: Record<FeatureCardColor, string> = {
    green: 'bg-green-100 dark:bg-green-900/20',
    blue: 'bg-blue-100 dark:bg-blue-900/20',
    purple: 'bg-purple-100 dark:bg-purple-900/20',
    orange: 'bg-orange-100 dark:bg-orange-900/20',
    red: 'bg-red-100 dark:bg-red-900/20',
    indigo: 'bg-indigo-100 dark:bg-indigo-900/20',
    cyan: 'bg-cyan-100 dark:bg-cyan-900/20',
    emerald: 'bg-emerald-100 dark:bg-emerald-900/20',
    pink: 'bg-pink-100 dark:bg-pink-900/20',
    gray: 'bg-gray-100 dark:bg-gray-900/20',
  };

  const bulletColorClasses: Record<FeatureCardColor, string> = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500',
    red: 'bg-red-500',
    indigo: 'bg-indigo-500',
    cyan: 'bg-cyan-500',
    emerald: 'bg-emerald-500',
    pink: 'bg-pink-500',
    gray: 'bg-gray-500',
  };

  const CardContent = () => (
    <>
      {/* Icon */}
      {borderColor ? (
        <View
          className={cn(
            'w-12 h-12 rounded-lg items-center justify-center mb-4',
            iconBackgroundClasses[color]
          )}
        >
          <View className={colorClasses[color]}>{icon}</View>
        </View>
      ) : (
        <View className={cn('mb-4', colorClasses[color])}>{icon}</View>
      )}

      {/* Title */}
      <Text className='text-xl font-semibold text-gray-900 dark:text-white mb-3'>
        {title}
      </Text>

      {/* Description */}
      <Text className='text-gray-600 dark:text-gray-300 mb-4 leading-relaxed'>
        {description}
      </Text>

      {/* CTA */}
      {cta && <View className='mt-3 mb-4'>{cta}</View>}

      {/* Benefits */}
      {benefits && benefits.length > 0 && (
        <View className='gap-2 mb-4'>
          {benefits.map((benefit, index) => (
            <View key={index} className='flex-row items-start'>
              <View
                className={cn(
                  'w-2 h-2 rounded-full mt-2 mr-3',
                  bulletColorClasses[color]
                )}
              />
              <Text className='flex-1 text-sm text-gray-600 dark:text-gray-400'>
                {benefit}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Metrics */}
      {metrics && Object.keys(metrics).length > 0 && (
        <View className='flex-row flex-wrap gap-4 mt-4'>
          {Object.entries(metrics).map(([key, value], index) => (
            <View
              key={index}
              className='flex-1 min-w-[80px] items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg'
            >
              <Text className={cn('text-lg font-bold', colorClasses[color])}>
                {value}
              </Text>
              <Text className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                {key}
              </Text>
            </View>
          ))}
        </View>
      )}
    </>
  );

  const baseClasses = cn(
    'p-6 rounded-xl',
    borderColor && borderColorClasses[color],
    isHighlight
      ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
      : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
    className
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className={baseClasses}
        accessibilityRole='button'
        accessibilityLabel={title}
      >
        <CardContent />
      </Pressable>
    );
  }

  return (
    <View className={baseClasses}>
      <CardContent />
    </View>
  );
};
