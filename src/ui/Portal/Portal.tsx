import * as React from 'react';
import { useContext, useEffect, useId, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';

/**
 * Portal / PortalHost
 *
 * Renders content at the root of the app rather than where it is written.
 *
 * Needed because an overlay written inside a scrolling toolbar is clipped by
 * it: a menu that opens downward out of a horizontal `ScrollView` is cut off at
 * the bar's edge. The web solves this by portalling to `document.body`; React
 * Native has no such target, so one is provided here.
 *
 * It also replaces `Modal` where `Modal` cannot go. React Native macOS's Fabric
 * renderer throws `Exception in HostFunction` when a `Modal` is mounted — and
 * it mounts even with `visible={false}`, so a component that merely *has* one
 * takes the screen down. A portalled overlay behaves the same on every platform
 * and needs no host view.
 *
 * Mount one `PortalHost` at the root, above everything that might portal.
 *
 * @example
 * ```tsx
 * <PortalHost>
 *   <App />
 * </PortalHost>
 * // ...anywhere below:
 * {open ? <Portal><Sheet /></Portal> : null}
 * ```
 */

type Entry = { id: string; node: React.ReactNode };
type Listener = (entries: Entry[]) => void;
type Registry = { entries: Entry[]; listeners: Set<Listener> };

function createRegistry(): Registry {
  return { entries: [], listeners: new Set() };
}

/**
 * The app's one registry, module-level for the reason given above.
 *
 * A second, scoped registry exists for exactly one case: content presented in
 * a **separate native window** — a macOS sheet. A portal written inside a sheet
 * must render inside that sheet, because the sheet blocks the window behind
 * it; portalled to the app root, a Select opened in a dialog would draw its
 * list in the main window, underneath the sheet and unreachable. A scoped
 * `PortalHost` provides its own registry to everything below it, and a
 * `Portal` renders into the nearest one.
 */
const appRegistry = createRegistry();
const RegistryContext = React.createContext<Registry>(appRegistry);

function emit(registry: Registry): void {
  const snapshot = [...registry.entries];
  for (const listener of registry.listeners) listener(snapshot);
}

function setEntry(registry: Registry, id: string, node: React.ReactNode): void {
  const index = registry.entries.findIndex(e => e.id === id);
  if (index === -1) registry.entries.push({ id, node });
  else registry.entries[index] = { id, node };
  emit(registry);
}

function removeEntry(registry: Registry, id: string): void {
  const index = registry.entries.findIndex(e => e.id === id);
  if (index === -1) return;
  registry.entries.splice(index, 1);
  emit(registry);
}

export interface PortalProps {
  children: React.ReactNode;
}

export const Portal: React.FC<PortalProps> = ({ children }) => {
  const id = useId();
  const registry = useContext(RegistryContext);
  useEffect(() => {
    setEntry(registry, id, children);
    return () => removeEntry(registry, id);
  }, [registry, id, children]);
  return null;
};

export interface PortalHostProps {
  children: React.ReactNode;
  /**
   * Give this host its own registry, so portals written below it render here
   * rather than at the app root. For content in a separate native window; the
   * app's root host is never scoped.
   */
  scoped?: boolean;
  /** Style for the host's box. Defaults to filling its parent. */
  style?: StyleProp<ViewStyle>;
}

export const PortalHost: React.FC<PortalHostProps> = ({
  children,
  scoped = false,
  style,
}) => {
  const inherited = useContext(RegistryContext);
  const [own] = useState(createRegistry);
  const registry = scoped ? own : inherited;
  const [portalled, setPortalled] = useState<Entry[]>([]);

  useEffect(() => {
    const listener: Listener = next => setPortalled(next);
    registry.listeners.add(listener);
    // Anything portalled before this mounted is picked up here rather than
    // waiting for the next change.
    listener([...registry.entries]);
    return () => {
      registry.listeners.delete(listener);
    };
  }, [registry]);

  const content = (
    <View style={style ?? styles.fill}>
      {children}
      {portalled.map(entry => (
        // `pointerEvents` is left alone: an overlay decides for itself whether
        // it swallows touches, and a host that blocked them would make every
        // portal modal.
        <View key={entry.id} style={StyleSheet.absoluteFill}>
          {entry.node}
        </View>
      ))}
    </View>
  );
  return scoped ? (
    <RegistryContext.Provider value={registry}>
      {content}
    </RegistryContext.Provider>
  ) : (
    content
  );
};

const styles = StyleSheet.create({ fill: { flex: 1 } });
