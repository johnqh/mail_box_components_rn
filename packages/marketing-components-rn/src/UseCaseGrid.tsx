import React from 'react';
import { View, Text, FlatList, type ViewProps } from 'react-native';
import { cn } from '@sudobility/components-rn';

type UseCaseColor = 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'gray';

export interface UseCase {
  icon: React.ReactNode;
  title: string;
  description: string;
  examples: string[];
  color?: UseCaseColor;
}

export interface UseCaseGridProps extends ViewProps {
  title?: string;
  description?: string;
  useCases: UseCase[];
  columns?: 2 | 3 | 4;
}

const colorClasses: Record<UseCaseColor, string> = {
  blue: 'text-blue-600 dark:text-blue-400',
  green: 'text-green-600 dark:text-green-400',
  purple: 'text-purple-600 dark:text-purple-400',
  orange: 'text-orange-600 dark:text-orange-400',
  pink: 'text-pink-600 dark:text-pink-400',
  gray: 'text-gray-600 dark:text-gray-400',
};

const bulletColors: Record<UseCaseColor, string> = {
  blue: 'bg-blue-500',
  green: 'bg-green-500',
  purple: 'bg-purple-500',
  orange: 'bg-orange-500',
  pink: 'bg-pink-500',
  gray: 'bg-gray-500',
};

interface UseCaseCardProps {
  useCase: UseCase;
}

const UseCaseCard: React.FC<UseCaseCardProps> = ({ useCase }) => {
  const iconColor = useCase.color ? colorClasses[useCase.color] : colorClasses.blue;
  const bulletColor = useCase.color ? bulletColors[useCase.color] : bulletColors.blue;

  return (
    <View className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-4 mx-2">
      <View className={cn('mb-4', iconColor)}>{useCase.icon}</View>

      <Text className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
        {useCase.title}
      </Text>

      <Text className="text-gray-600 dark:text-gray-300 mb-4">
        {useCase.description}
      </Text>

      {useCase.examples && useCase.examples.length > 0 && (
        <View>
          <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Examples:
          </Text>
          <View className="gap-1">
            {useCase.examples.map((example, exampleIndex) => (
              <View key={exampleIndex} className="flex-row items-start">
                <View
                  className={cn(
                    'w-1.5 h-1.5 rounded-full mt-2 mr-2',
                    bulletColor
                  )}
                />
                <Text className="text-sm text-gray-600 dark:text-gray-400 flex-1">
                  {example}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

/**
 * UseCaseGrid component for React Native
 * Grid display of use cases
 */
export const UseCaseGrid: React.FC<UseCaseGridProps> = ({
  title,
  description,
  useCases,
  columns = 2,
  className,
  ...props
}) => {
  return (
    <View className={cn('py-8 px-4', className)} {...props}>
      {(title || description) && (
        <View className="items-center mb-8">
          {title && (
            <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
              {title}
            </Text>
          )}
          {description && (
            <Text className="text-lg text-gray-600 dark:text-gray-300 text-center max-w-lg">
              {description}
            </Text>
          )}
        </View>
      )}

      <FlatList
        data={useCases}
        keyExtractor={(_, index) => index.toString()}
        numColumns={columns > 2 ? 2 : columns}
        renderItem={({ item }) => (
          <View className={columns > 2 ? 'flex-1' : 'flex-1'}>
            <UseCaseCard useCase={item} />
          </View>
        )}
        scrollEnabled={false}
      />
    </View>
  );
};
