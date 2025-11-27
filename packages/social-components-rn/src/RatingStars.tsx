import * as React from 'react';
import { View, Text, Pressable } from 'react-native';
import { cn } from './utils';

export interface RatingStarsProps {
  /** Current rating value (0-5) */
  value: number;
  /** Rating change handler */
  onChange?: (rating: number) => void;
  /** Max number of stars */
  maxStars?: number;
  /** Star size */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Read-only mode */
  readonly?: boolean;
  /** Show rating number */
  showNumber?: boolean;
  /** Allow half stars */
  allowHalf?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * RatingStars Component
 *
 * Star rating display and input for React Native.
 * Supports interactive and read-only modes.
 *
 * @example
 * ```tsx
 * <RatingStars
 *   value={4.5}
 *   onChange={(rating) => setRating(rating)}
 *   size="lg"
 *   showNumber
 *   allowHalf
 * />
 * ```
 *
 * @example
 * ```tsx
 * <RatingStars
 *   value={3}
 *   readonly
 *   size="sm"
 * />
 * ```
 */
export const RatingStars: React.FC<RatingStarsProps> = ({
  value,
  onChange,
  maxStars = 5,
  size = 'md',
  readonly = false,
  showNumber = false,
  allowHalf = false,
  className,
}) => {
  const [hoverRating, setHoverRating] = React.useState(0);

  const sizeConfig = {
    sm: { star: 16, text: 'text-sm', gap: 'gap-0.5' },
    md: { star: 24, text: 'text-base', gap: 'gap-1' },
    lg: { star: 32, text: 'text-lg', gap: 'gap-1.5' },
    xl: { star: 40, text: 'text-xl', gap: 'gap-2' },
  };

  const config = sizeConfig[size];

  const handlePress = (starIndex: number) => {
    if (readonly || !onChange) return;
    onChange(starIndex);
  };

  const getStarFill = (starIndex: number): 'full' | 'half' | 'empty' => {
    const rating = hoverRating || value;

    if (starIndex <= rating) return 'full';
    if (allowHalf && starIndex - 0.5 <= rating) return 'half';
    return 'empty';
  };

  // Simple star character rendering (can be replaced with SVG later)
  const renderStar = (fill: 'full' | 'half' | 'empty') => {
    const starSize = config.star;

    if (fill === 'full') {
      return (
        <Text
          style={{ fontSize: starSize, lineHeight: starSize * 1.2 }}
          className="text-yellow-400"
        >
          ★
        </Text>
      );
    }

    if (fill === 'half') {
      return (
        <View style={{ width: starSize, height: starSize * 1.2 }}>
          <Text
            style={{
              fontSize: starSize,
              lineHeight: starSize * 1.2,
              position: 'absolute',
            }}
            className="text-gray-300 dark:text-gray-600"
          >
            ★
          </Text>
          <View style={{ overflow: 'hidden', width: starSize / 2 }}>
            <Text
              style={{ fontSize: starSize, lineHeight: starSize * 1.2 }}
              className="text-yellow-400"
            >
              ★
            </Text>
          </View>
        </View>
      );
    }

    return (
      <Text
        style={{ fontSize: starSize, lineHeight: starSize * 1.2 }}
        className="text-gray-300 dark:text-gray-600"
      >
        ★
      </Text>
    );
  };

  return (
    <View className={cn('flex-row items-center gap-2', className)}>
      <View className={cn('flex-row items-center', config.gap)}>
        {Array.from({ length: maxStars }, (_, i) => i + 1).map(starIndex => {
          const fill = getStarFill(starIndex);

          return (
            <Pressable
              key={starIndex}
              onPress={() => handlePress(starIndex)}
              disabled={readonly}
              accessibilityRole="button"
              accessibilityLabel={`Rate ${starIndex} star${starIndex !== 1 ? 's' : ''}`}
              accessibilityState={{ disabled: readonly }}
              style={({ pressed }) => ({
                opacity: pressed && !readonly ? 0.7 : 1,
                transform: [{ scale: pressed && !readonly ? 1.1 : 1 }],
              })}
            >
              {renderStar(fill)}
            </Pressable>
          );
        })}
      </View>

      {showNumber && (
        <Text
          className={cn(
            'font-semibold text-gray-900 dark:text-white',
            config.text
          )}
        >
          {value.toFixed(1)}
        </Text>
      )}
    </View>
  );
};
