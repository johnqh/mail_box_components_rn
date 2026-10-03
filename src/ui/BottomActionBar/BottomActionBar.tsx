import * as React from 'react';
import { View, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { useSurfaceInsets } from '../../lib/safe-area-edges';
import { safeAreaPadding } from '../../lib/safe-area';

const SPACING = 16;

export interface BottomActionBarProps {
  /** Button(s) to pin to the bottom of the screen. */
  children: React.ReactNode;
  /**
   * Surface background color override. When omitted, the bar uses the
   * theme-aware `bg-card` token so it flips with light/dark automatically.
   */
  backgroundColor?: string;
  /**
   * Top hairline border color override. When omitted, the bar uses the
   * theme-aware `border-border` token.
   */
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
  backgroundColor,
  borderColor,
  tabBarHeight,
  style,
}: BottomActionBarProps) {
  const insets = useSurfaceInsets();
  const hasTabBar = (tabBarHeight ?? 0) > 0;
  const paddingBottom = hasTabBar ? SPACING : insets.bottom + SPACING;
  /*
    The sides take their insets too. This bar spans the full width and is
    anchored to an edge, so on a landscape phone with a display cutout its
    buttons sat under the housing — the same omission `FormModal` had, and
    invisible in portrait for the same reason (both insets are 0 there).
    `paddingHorizontal` in `styles.bar` stays as the base; Yoga resolves the
    specific edge over the shorthand, so these win.
  */
  const horizontal = safeAreaPadding(insets, ['left', 'right'], SPACING);
  // Default to semantic theme tokens; explicit color props still win because
  // inline style overrides the className-provided colors.
  return (
    <View
      className='bg-card border-border'
      style={[
        styles.bar,
        horizontal,
        { paddingBottom },
        backgroundColor != null && { backgroundColor },
        borderColor != null && { borderTopColor: borderColor },
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
