import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export interface VisuallyHiddenProps {
  /** Content to hide visually but keep accessible to screen readers */
  children: React.ReactNode;
}

/**
 * VisuallyHidden Component
 *
 * Hides content visually while keeping it accessible to screen readers.
 * In React Native, this uses accessibilityElementsHidden with absolute positioning.
 *
 * @example
 * ```tsx
 * <Pressable onPress={handleDelete}>
 *   <TrashIcon />
 *   <VisuallyHidden>Delete item</VisuallyHidden>
 * </Pressable>
 * ```
 */
export const VisuallyHidden: React.FC<VisuallyHiddenProps> = ({ children }) => {
  return (
    <View
      style={styles.hidden}
      accessibilityElementsHidden={false}
      importantForAccessibility='yes'
    >
      {typeof children === 'string' ? (
        <Text accessibilityRole='text'>{children}</Text>
      ) : (
        children
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  hidden: {
    position: 'absolute',
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: 'hidden',
    // clip is deprecated but needed for older devices
    // clipPath: 'inset(50%)', // Not supported in RN
  },
});
