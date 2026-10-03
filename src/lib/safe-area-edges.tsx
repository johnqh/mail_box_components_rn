/**
 * Which screen edges the *app* clears, so the library's surfaces follow the
 * app's rule instead of a rule of their own.
 *
 * Every edge-anchored surface here pads for the insets it touches
 * (`safe-area.ts`), and with no app to ask that is the right default. But an
 * app can have decided otherwise for a whole device: a landscape-only phone
 * that hides its status bar has no business padding its top, and the side
 * away from the camera is usable to the edge. A full-screen `FormModal` that
 * padded all four insets regardless drew a band where the hidden status bar
 * would have been and a gutter down the plain side — a different layout from
 * every screen around it.
 *
 * So the app states its edges once, with {@link SafeAreaEdgesProvider} at its
 * root, and every surface reads {@link useSurfaceInsets}: the system's insets
 * with each edge the app does not clear reported as 0. A modal is still inside
 * the provider — React context crosses a native `Modal`, unlike the
 * `SafeAreaProvider` measurement that `ModalHost` has to re-provide — so one
 * statement covers the dialogs too. With no provider, every edge is cleared,
 * which is exactly what the surfaces did before.
 */
import * as React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { EdgeInsets } from 'react-native-safe-area-context';
import { ALL_EDGES } from './safe-area';
import type { SafeAreaEdge } from './safe-area';

const SafeAreaEdgesContext =
  React.createContext<readonly SafeAreaEdge[]>(ALL_EDGES);

export interface SafeAreaEdgesProviderProps {
  /** The edges the app keeps its content clear of; the others are used to the edge. */
  edges: readonly SafeAreaEdge[];
  children: React.ReactNode;
}

export function SafeAreaEdgesProvider({
  edges,
  children,
}: SafeAreaEdgesProviderProps) {
  return (
    <SafeAreaEdgesContext.Provider value={edges}>
      {children}
    </SafeAreaEdgesContext.Provider>
  );
}

/** The edges the app clears — every edge unless a provider says otherwise. */
export function useSafeAreaEdges(): readonly SafeAreaEdge[] {
  return React.useContext(SafeAreaEdgesContext);
}

/** The insets with every edge the app does not clear reported as 0. */
export function maskInsets(
  insets: EdgeInsets,
  edges: readonly SafeAreaEdge[]
): EdgeInsets {
  return {
    top: edges.includes('top') ? insets.top : 0,
    right: edges.includes('right') ? insets.right : 0,
    bottom: edges.includes('bottom') ? insets.bottom : 0,
    left: edges.includes('left') ? insets.left : 0,
  };
}

/**
 * The insets a surface should pad for: the system's, less the edges the app
 * has said it does not clear. Use this rather than `useSafeAreaInsets` in any
 * surface that reaches a screen edge.
 */
export function useSurfaceInsets(): EdgeInsets {
  const insets = useSafeAreaInsets();
  const edges = useSafeAreaEdges();
  return React.useMemo(() => maskInsets(insets, edges), [insets, edges]);
}
