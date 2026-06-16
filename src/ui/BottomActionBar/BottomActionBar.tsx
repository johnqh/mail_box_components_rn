import * as React from 'react';
import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SPACING = 16;

export interface BottomActionBarProps {
  /** Button(s) to pin to the bottom of the screen. */
  children: React.ReactNode;
  /** Surface background color; should match the screen background. */
  backgroundColor?: string;
  /** Top hairline border color. */
  borderColor?: string;
  /**
   * Height of a bottom tab/tool bar directly beneath this bar, if any.
   * When > 0, the tab bar already covers the home indicator so only top
   * spacing is added; otherwise the bar sits above the bottom safe-area inset.
   */
  tabBarHeight?: number;
  /** Optional container style override. */
  style?: StyleProp<ViewStyle>;
}

/**
 * Sticky bottom action bar. Place as the last child of a flex-column screen
 * root, after the scroll/list region, so it never scrolls with content.
 * Keyboard avoidance is the screen's responsibility (wrap the screen in
 * KeyboardAvoidingView when it has text inputs).
 */
export function BottomActionBar({
  children,
  backgroundColor = '#ffffff',
  borderColor = 'rgba(0,0,0,0.1)',
  tabBarHeight,
  style,
}: BottomActionBarProps) {
  const insets = useSafeAreaInsets();
  const hasTabBar = (tabBarHeight ?? 0) > 0;
  const paddingBottom = hasTabBar ? SPACING : insets.bottom + SPACING;
  return (
    <View
      style={[
        styles.bar,
        { backgroundColor, borderTopColor: borderColor, paddingBottom },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
