/**
 * Text colour classes, picked out of — or taken out of — a class string.
 *
 * React Native has no colour inheritance: a `text-*` colour on a `View` colours
 * nothing, and a `Text` (or an `ActivityIndicator`, or an `Svg` with the
 * interop) has to carry the class itself. The design system's variant strings
 * are written for the web, where the container's colour cascades, so the
 * colour has to be lifted off the container and put on what is drawn.
 *
 * NativeWind itself does not merge classes — given two text colours on one
 * element, the stylesheet's order decides. `cn` resolves that (it is
 * `tailwind-merge`), but a colour that must win regardless of how the string
 * is later combined can replace the other outright
 * ({@link stripTextColorClasses}).
 */

const NON_COLOR_TEXT =
  /^text-(xs|sm|base|lg|xl|[2-9]xl|left|center|right|justify|start|end|ellipsis|clip|wrap|nowrap|balance|pretty|\[.*\])$/;

function baseOf(token: string): string {
  return token.includes(':') ? token.slice(token.lastIndexOf(':') + 1) : token;
}

function isTextColor(token: string): boolean {
  const base = baseOf(token);
  return base.startsWith('text-') && !NON_COLOR_TEXT.test(base);
}

/**
 * Only the text colour classes of a class string — `text-primary-foreground`,
 * `dark:text-foreground` — without sizes or alignment.
 */
export function extractTextColorClasses(className: string | undefined): string {
  return (className ?? '')
    .split(/\s+/)
    .filter(Boolean)
    .filter(isTextColor)
    .join(' ');
}

/** A class string with its text colour classes taken out. */
export function stripTextColorClasses(className: string | undefined): string {
  return (className ?? '')
    .split(/\s+/)
    .filter(Boolean)
    .filter(token => !isTextColor(token))
    .join(' ');
}
