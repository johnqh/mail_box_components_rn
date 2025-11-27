import * as React from 'react';
import { View, Text } from 'react-native';
import { cn } from '../../lib/utils';

export interface ListProps {
  /** List items */
  children: React.ReactNode;
  /** List type */
  type?: 'unordered' | 'ordered';
  /** Spacing between items */
  spacing?: 'none' | 'sm' | 'md' | 'lg';
  /** Marker/bullet style */
  marker?: 'disc' | 'circle' | 'square' | 'decimal' | 'alpha' | 'none';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Additional className */
  className?: string;
}

export interface ListItemProps {
  /** List item content */
  children: React.ReactNode;
  /** Item index (for ordered lists) */
  index?: number;
  /** Marker type (inherited from List) */
  marker?: 'disc' | 'circle' | 'square' | 'decimal' | 'alpha' | 'none';
  /** List type (inherited from List) */
  listType?: 'unordered' | 'ordered';
  /** Size (inherited from List) */
  size?: 'sm' | 'md' | 'lg';
  /** Additional className */
  className?: string;
}

// Context for passing list props to items
const ListContext = React.createContext<{
  type: 'unordered' | 'ordered';
  marker: 'disc' | 'circle' | 'square' | 'decimal' | 'alpha' | 'none';
  size: 'sm' | 'md' | 'lg';
}>({
  type: 'unordered',
  marker: 'disc',
  size: 'md',
});

/**
 * List Component
 *
 * List component with consistent styling and spacing options.
 * Supports both ordered and unordered lists with various marker styles.
 *
 * @example
 * ```tsx
 * <List>
 *   <ListItem>First item</ListItem>
 *   <ListItem>Second item</ListItem>
 *   <ListItem>Third item</ListItem>
 * </List>
 * ```
 *
 * @example
 * ```tsx
 * <List type="ordered" marker="decimal" spacing="md">
 *   <ListItem>Step one</ListItem>
 *   <ListItem>Step two</ListItem>
 * </List>
 * ```
 */
export const List: React.FC<ListProps> = ({
  children,
  type = 'unordered',
  spacing = 'sm',
  marker,
  size = 'md',
  className,
}) => {
  // Default marker based on type
  const defaultMarker = type === 'ordered' ? 'decimal' : 'disc';
  const actualMarker = marker || defaultMarker;

  // Spacing configurations
  const spacingClasses = {
    none: 'gap-0',
    sm: 'gap-1',
    md: 'gap-2',
    lg: 'gap-4',
  };

  // Clone children with index for ordered lists
  const childrenWithIndex = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child as React.ReactElement<ListItemProps>, {
        index: index + 1,
      });
    }
    return child;
  });

  return (
    <ListContext.Provider value={{ type, marker: actualMarker, size }}>
      <View
        className={cn('ml-4', spacingClasses[spacing], className)}
        accessibilityRole='list'
      >
        {childrenWithIndex}
      </View>
    </ListContext.Provider>
  );
};

/**
 * ListItem Component
 *
 * Individual list item to be used within List component.
 */
export const ListItem: React.FC<ListItemProps> = ({
  children,
  index = 1,
  className,
}) => {
  const { type, marker, size } = React.useContext(ListContext);

  // Size configurations
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  // Get marker symbol
  const getMarker = (): string => {
    if (marker === 'none') return '';

    if (type === 'ordered') {
      switch (marker) {
        case 'decimal':
          return `${index}.`;
        case 'alpha':
          return `${String.fromCharCode(96 + index)}.`;
        default:
          return `${index}.`;
      }
    } else {
      switch (marker) {
        case 'disc':
          return '•';
        case 'circle':
          return '○';
        case 'square':
          return '▪';
        default:
          return '•';
      }
    }
  };

  const markerSymbol = getMarker();

  return (
    <View className={cn('flex flex-row', className)}>
      {markerSymbol !== '' && (
        <Text
          className={cn(
            'mr-2 text-gray-600 dark:text-gray-400',
            sizeClasses[size],
            type === 'ordered' ? 'w-6' : 'w-3'
          )}
        >
          {markerSymbol}
        </Text>
      )}
      <Text
        className={cn(
          'flex-1 text-gray-900 dark:text-gray-100 leading-relaxed',
          sizeClasses[size]
        )}
      >
        {children}
      </Text>
    </View>
  );
};
