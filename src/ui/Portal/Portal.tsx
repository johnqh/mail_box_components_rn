import * as React from 'react';
import { useEffect, useId, useState } from 'react';
import { StyleSheet, View } from 'react-native';

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

/**
 * Module-level, deliberately: a portal is written far from its host and
 * threading a context through every component in between is the thing this
 * exists to avoid. One host per app is the assumption, and a second would be a
 * bug rather than a feature.
 */
const entries: Entry[] = [];
const listeners = new Set<Listener>();

function emit(): void {
  const snapshot = [...entries];
  for (const listener of listeners) listener(snapshot);
}

function setEntry(id: string, node: React.ReactNode): void {
  const index = entries.findIndex(e => e.id === id);
  if (index === -1) entries.push({ id, node });
  else entries[index] = { id, node };
  emit();
}

function removeEntry(id: string): void {
  const index = entries.findIndex(e => e.id === id);
  if (index === -1) return;
  entries.splice(index, 1);
  emit();
}

export interface PortalProps {
  children: React.ReactNode;
}

/** Renders `children` into the nearest `PortalHost` instead of in place. */
export const Portal: React.FC<PortalProps> = ({ children }) => {
  const id = useId();
  useEffect(() => {
    setEntry(id, children);
    return () => removeEntry(id);
  }, [id, children]);
  return null;
};

export interface PortalHostProps {
  children: React.ReactNode;
}

/** Wraps the app and draws whatever has been portalled, on top. */
export const PortalHost: React.FC<PortalHostProps> = ({ children }) => {
  const [portalled, setPortalled] = useState<Entry[]>([]);

  useEffect(() => {
    const listener: Listener = next => setPortalled(next);
    listeners.add(listener);
    // Anything portalled before this mounted is picked up here rather than
    // waiting for the next change.
    listener([...entries]);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return (
    <View style={styles.fill}>
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
};

const styles = StyleSheet.create({ fill: { flex: 1 } });
