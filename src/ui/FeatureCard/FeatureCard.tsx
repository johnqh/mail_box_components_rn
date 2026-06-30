import * as React from 'react';
import { View, Text, Pressable } from 'react-native';
import { cn } from '../../lib/utils';
import { designTokens } from '@sudobility/design';

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
  // Color configurations -- derived from colors.raw.* palette
  // Each Tailwind class maps to a colors.raw hex value at the same shade
  const colorClasses: Record<FeatureCardColor, string> = {
    blue: 'text-primary', // colors.raw.blue[600] / [400]
    green: 'text-success', // colors.raw.green[600] / [400]
    purple: 'text-accent-foreground',
    orange: 'text-warning', // colors.raw.orange[600] / [400]
    pink: 'text-secondary-foreground',
    gray: 'text-muted-foreground', // colors.raw.neutral[600] / [400]
    red: 'text-destructive', // colors.raw.red[600] / [400]
    indigo: 'text-primary ',
    cyan: 'text-info ',
    emerald: 'text-success ',
  };

  // Decorative category colors mapped to semantic tokens, mirroring
  // bulletColorClasses so the left border matches the accent for each color.
  const borderColorClasses: Record<FeatureCardColor, string> = {
    green: 'border-l-4 border-l-success',
    blue: 'border-l-4 border-l-primary',
    purple: 'border-l-4 border-l-accent',
    orange: 'border-l-4 border-l-warning',
    red: 'border-l-4 border-l-destructive',
    indigo: 'border-l-4 border-l-primary',
    cyan: 'border-l-4 border-l-info',
    emerald: 'border-l-4 border-l-success',
    pink: 'border-l-4 border-l-secondary',
    gray: 'border-l-4 border-l-muted',
  };

  const iconBackgroundClasses: Record<FeatureCardColor, string> = {
    green: 'bg-success/10 ', // colors.raw.green[100] / [900]
    blue: 'bg-primary/10', // colors.raw.blue[100] / [900]
    purple: 'bg-accent ', // colors.raw.purple[100] / [900]
    orange: 'bg-warning/10 ', // colors.raw.orange[100] / [900]
    red: 'bg-destructive/10 ', // colors.raw.red[100] / [900]
    indigo: 'bg-primary/10 dark:bg-primary/10',
    cyan: 'bg-info/10 ',
    emerald: 'bg-success/10 ',
    pink: 'bg-secondary ',
    gray: 'bg-muted/20', // colors.raw.neutral[100] / [900]
  };

  const bulletColorClasses: Record<FeatureCardColor, string> = {
    green: 'bg-success', // colors.raw.green[500]
    blue: 'bg-primary', // colors.raw.blue[500]
    purple: 'bg-accent', // colors.raw.purple[500]
    orange: 'bg-warning', // colors.raw.orange[500]
    red: 'bg-destructive', // colors.raw.red[500]
    indigo: 'bg-primary/100',
    cyan: 'bg-info',
    emerald: 'bg-success',
    pink: 'bg-secondary',
    gray: 'bg-muted', // colors.raw.neutral[500]
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
      <Text
        className={cn(
          designTokens.typography.size.xl,
          designTokens.typography.weight.semibold,
          'text-foreground mb-3'
        )}
      >
        {title}
      </Text>

      {/* Description */}
      <Text
        className={cn(
          designTokens.typography.size.base,
          designTokens.typography.leading.relaxed,
          'text-muted-foreground mb-4'
        )}
      >
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
              <Text
                className={cn(
                  'flex-1',
                  designTokens.typography.size.sm,
                  'text-muted-foreground'
                )}
              >
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
              className='flex-1 min-w-[80px] items-center p-3 bg-muted dark:bg-muted/50 rounded-lg'
            >
              <Text
                className={cn(
                  designTokens.typography.size.lg,
                  designTokens.typography.weight.bold,
                  colorClasses[color]
                )}
              >
                {value}
              </Text>
              <Text
                className={cn(
                  designTokens.typography.size.xs,
                  'text-muted-foreground mt-1'
                )}
              >
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
      ? 'bg-primary/10 border border-primary/20'
      : 'bg-card border border-border',
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
