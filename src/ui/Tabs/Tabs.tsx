import * as React from 'react';
import { useState, useCallback, createContext, useContext } from 'react';
import { View, Text, Pressable, ScrollView, ViewProps } from 'react-native';
import { cn } from '../../lib/utils';

// Context for tabs state
interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

const useTabsContext = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within a Tabs provider');
  }
  return context;
};

export interface TabsProps extends ViewProps {
  /** Currently selected tab value */
  value?: string;
  /** Default selected tab (uncontrolled) */
  defaultValue?: string;
  /** Callback when tab changes */
  onValueChange?: (value: string) => void;
  /** Children (TabsList and TabsContent) */
  children: React.ReactNode;
  /** Additional className */
  className?: string;
}

/**
 * Tabs Component
 *
 * Tab navigation component for switching between content panels.
 *
 * @example
 * ```tsx
 * <Tabs defaultValue="tab1">
 *   <TabsList>
 *     <TabsTrigger value="tab1">Tab 1</TabsTrigger>
 *     <TabsTrigger value="tab2">Tab 2</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="tab1">
 *     <Text>Content for Tab 1</Text>
 *   </TabsContent>
 *   <TabsContent value="tab2">
 *     <Text>Content for Tab 2</Text>
 *   </TabsContent>
 * </Tabs>
 * ```
 */
export const Tabs: React.FC<TabsProps> = ({
  value: controlledValue,
  defaultValue = '',
  onValueChange,
  children,
  className,
  ...viewProps
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  const handleValueChange = useCallback(
    (newValue: string) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    },
    [isControlled, onValueChange]
  );

  return (
    <TabsContext.Provider value={{ value, onValueChange: handleValueChange }}>
      <View className={cn('w-full', className)} {...viewProps}>
        {children}
      </View>
    </TabsContext.Provider>
  );
};

export interface TabsListProps extends ViewProps {
  /** Tab triggers */
  children: React.ReactNode;
  /** Additional className */
  className?: string;
}

/**
 * TabsList - Container for tab triggers
 */
export const TabsList: React.FC<TabsListProps> = ({
  children,
  className,
  ...viewProps
}) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    className={cn(
      'flex-row bg-gray-100 dark:bg-gray-800 rounded-lg p-1',
      className
    )}
    contentContainerStyle={{ flexGrow: 1 }}
    {...viewProps}
  >
    {children}
  </ScrollView>
);

export interface TabsTriggerProps {
  /** Tab value */
  value: string;
  /** Tab label */
  children: React.ReactNode;
  /** Disabled state */
  disabled?: boolean;
  /** Additional className */
  className?: string;
}

/**
 * TabsTrigger - Individual tab button
 */
export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  children,
  disabled = false,
  className,
}) => {
  const { value: selectedValue, onValueChange } = useTabsContext();
  const isSelected = selectedValue === value;

  return (
    <Pressable
      onPress={() => !disabled && onValueChange(value)}
      disabled={disabled}
      className={cn(
        'flex-1 px-4 py-2 rounded-md items-center justify-center',
        isSelected ? 'bg-white dark:bg-gray-700 shadow-sm' : 'bg-transparent',
        disabled && 'opacity-50',
        className
      )}
      accessibilityRole='tab'
      accessibilityState={{ selected: isSelected, disabled }}
    >
      <Text
        className={cn(
          'text-sm font-medium text-center',
          isSelected
            ? 'text-gray-900 dark:text-white'
            : 'text-gray-600 dark:text-gray-400'
        )}
      >
        {children}
      </Text>
    </Pressable>
  );
};

export interface TabsContentProps extends ViewProps {
  /** Tab value this content belongs to */
  value: string;
  /** Content to display */
  children: React.ReactNode;
  /** Additional className */
  className?: string;
}

/**
 * TabsContent - Content panel for a tab
 */
export const TabsContent: React.FC<TabsContentProps> = ({
  value,
  children,
  className,
  ...viewProps
}) => {
  const { value: selectedValue } = useTabsContext();

  if (selectedValue !== value) {
    return null;
  }

  return (
    <View className={cn('mt-2', className)} {...viewProps}>
      {children}
    </View>
  );
};
