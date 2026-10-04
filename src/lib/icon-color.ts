/**
 * The colour contract for icon slots.
 *
 * A component with an `icon` prop (`DashboardStatCard`, `EmptyState`,
 * `FeatureGrid`, `MasterDetailLayout`, `SectionBadge`, `Alert`) used to tint
 * the `View` wrapped around it with a `text-*` class. That colours nothing on
 * React Native — there is no inheritance — so a caller's heroicon, which draws
 * `currentColor` from its own `color` prop, rendered black on every theme.
 * Nor can a class reach it: a prebuilt icon component creates its `Svg`
 * outside NativeWind's JSX runtime, so a `className` on it is dropped.
 *
 * **The contract:** when the `icon` is a single React element **with no
 * `color` prop of its own** (and no text colour class), it is cloned with
 * `color` set to the slot's theme colour, resolved the way the host applied
 * it ({@link useIconColor}). An element that states a `color` keeps it, and
 * anything else — a string, a fragment, an array — is drawn as given. With no
 * theme to resolve the colour is `undefined` and nothing is cloned, so an
 * unthemed host sees exactly what it saw before.
 */
import * as React from 'react';
import { useThemeColor, type ThemeColorToken } from './theme-color';
import { extractTextColorClasses } from './text-color';

/** The slot's colour as a string an icon's `color` prop takes. */
export function useIconColor(token: ThemeColorToken): string | undefined {
  return useThemeColor(token);
}

/**
 * `icon`, given `color` if it is an element that does not choose its own.
 * See the module comment for the contract.
 */
export function resolveIconColor(
  icon: React.ReactNode,
  color: string | undefined
): React.ReactNode {
  if (!color || !React.isValidElement(icon) || icon.type === React.Fragment) {
    return icon;
  }
  const props = (icon.props ?? {}) as { color?: unknown; className?: unknown };
  if (props.color !== undefined && props.color !== null) return icon;
  if (
    typeof props.className === 'string' &&
    extractTextColorClasses(props.className)
  ) {
    return icon;
  }
  return React.cloneElement(icon as React.ReactElement<{ color?: string }>, {
    color,
  });
}
