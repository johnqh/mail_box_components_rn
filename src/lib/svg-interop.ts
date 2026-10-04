/**
 * Lets an `<Svg>` drawn by this package take its colour from a class.
 *
 * Registered once, as a side effect of importing this module (every component
 * that draws an `Svg` imports it): NativeWind then maps the colour a
 * `className` resolves to onto the `Svg`'s `color` prop, and paths drawn with
 * `fill='currentColor'` take it. So `<Svg className='text-muted-foreground'>`
 * follows the host's theme — including variables a host applies at run time
 * with `vars()` — with no hook.
 *
 * It applies only to `Svg` elements created through NativeWind's JSX runtime,
 * which is how this package's own JSX is compiled (`jsxImportSource:
 * 'nativewind'` in `vite.config.ts` for `dist`, and a host's NativeWind babel
 * preset for `src`). A prebuilt icon component that creates its `Svg` some
 * other way does not get it; see `resolveIconColor` for icons.
 *
 * Safe alongside a host that registers the same thing: `cssInterop` keys the
 * registration by component, so a second identical one replaces the first.
 */
import Svg from 'react-native-svg';
import { cssInterop } from 'nativewind';

if (typeof cssInterop === 'function') {
  cssInterop(Svg, {
    className: { target: 'style', nativeStyleToProp: { color: true } },
  });
}

export {};
