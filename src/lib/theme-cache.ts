/**
 * A value derived from the design system's classes, rebuilt when the theme
 * changes.
 *
 * `colors.component.*` and `variants.*` answer legacy classes until a host
 * calls `configureTheme`, and the active theme's afterwards. A component that
 * read them at module load — or cached them on first use for good — kept
 * whichever it saw first: before `configureTheme`, that was the legacy
 * palette for the life of the app. This caches per active theme instead, so
 * the work is still done once per theme rather than once per render.
 */
import { activeTheme } from './theme-color';

const UNSET = Symbol('unset');

export function themeCached<T>(build: () => T): () => T {
  let theme: unknown = UNSET;
  let value: T;
  return () => {
    const active = activeTheme();
    if (theme !== active) {
      value = build();
      theme = active;
    }
    return value;
  };
}
