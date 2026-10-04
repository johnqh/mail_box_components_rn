/**
 * `useThemeColor` reads the host's theme for props that take no className.
 *
 * Two sources, in order: the CSS variables a host applies at run time with
 * NativeWind's `vars()` (read through `useUnstableNativeVariable`, stubbed
 * here with `mockVariables`), then the configured `@sudobility/design` theme
 * in the OS's scheme. The theme is the real swiss preset; only which theme is
 * active, which variables are set and what the OS reports are controlled.
 *
 * The case the variables exist for: a host that lets its reader choose Dark
 * on a device whose OS is light. The OS scheme says light; the variables say
 * dark; the variables must win.
 */
import * as React from 'react';
import { Text } from 'react-native';
import * as ReactNative from 'react-native';
import { render } from '@testing-library/react-native';

let mockActiveTheme: unknown = null;
jest.mock('@sudobility/design', () => ({
  ...jest.requireActual('@sudobility/design'),
  getActiveTheme: () => mockActiveTheme,
}));

let mockVariables: Record<string, unknown> = {};
jest.mock('nativewind', () => ({
  cssInterop: (component: unknown) => component,
  useUnstableNativeVariable: (name: string) => mockVariables[name],
}));

const { swissTheme } = jest.requireActual('@sudobility/design/themes');
const { Switch } = require('../ui/Switch');
const {
  hslTokenToCss,
  resolveThemeColor,
  themeVariableName,
  themeVariableToCss,
  useThemeColor,
} = require('../lib/theme-color');

/** A host's `vars()` for one palette, keyed the way `themeVariableName` keys. */
function hostVariables(tokens: Record<string, string>) {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(tokens)) {
    out['--' + key.replace(/[A-Z]/g, m => '-' + m.toLowerCase())] = value;
  }
  return out;
}

function Probe({
  token,
  fallback,
  alpha,
}: {
  token: string;
  fallback?: string;
  alpha?: number;
}) {
  const color = useThemeColor(token, fallback, { alpha });
  return <Text testID='probe'>{String(color)}</Text>;
}

function renderProbe(
  scheme: 'light' | 'dark',
  props: React.ComponentProps<typeof Probe>
) {
  jest.spyOn(ReactNative, 'useColorScheme').mockReturnValue(scheme);
  return render(<Probe {...props} />).getByTestId('probe').props.children;
}

beforeEach(() => {
  mockActiveTheme = null;
  mockVariables = {};
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe('conversions', () => {
  it('turns a token triple into hsl()', () => {
    expect(hslTokenToCss('0 84% 43.3%')).toBe('hsl(0, 84%, 43.3%)');
  });

  it('adds an alpha as hsla()', () => {
    expect(hslTokenToCss('0 84% 43.3%', 0.1)).toBe('hsla(0, 84%, 43.3%, 0.1)');
  });

  it('names a token the way a host names its variable', () => {
    expect(themeVariableName('mutedForeground')).toBe('--muted-foreground');
    expect(themeVariableName('primary')).toBe('--primary');
  });

  it('reads a variable holding a triple, a colour, or nothing', () => {
    expect(themeVariableToCss('0 84% 43%')).toBe('hsl(0, 84%, 43%)');
    expect(themeVariableToCss(['0', '84%', '43%'], 0.5)).toBe(
      'hsla(0, 84%, 43%, 0.5)'
    );
    expect(themeVariableToCss('#123456')).toBe('#123456');
    expect(themeVariableToCss(undefined)).toBeUndefined();
    expect(themeVariableToCss('')).toBeUndefined();
    // Anything that is not a colour is no answer, so the caller falls back.
    expect(themeVariableToCss('[object Object]')).toBeUndefined();
    expect(themeVariableToCss([{ type: 'x' }, '84%', '43%'])).toBeUndefined();
  });
});

describe('with nothing configured', () => {
  it('answers the fallback, so an unthemed host sees no change', () => {
    expect(
      renderProbe('light', { token: 'primary', fallback: '#2563eb' })
    ).toBe('#2563eb');
  });

  it('answers undefined without a fallback, leaving the platform colour', () => {
    expect(renderProbe('dark', { token: 'primary' })).toBe('undefined');
  });
});

describe('with a configured theme and no runtime variables', () => {
  beforeEach(() => {
    mockActiveTheme = swissTheme;
  });

  it("answers the light palette's primary when the OS is light", () => {
    expect(renderProbe('light', { token: 'primary' })).toBe(
      hslTokenToCss(swissTheme.light.primary)
    );
  });

  it("answers the dark palette's primary when the OS is dark", () => {
    expect(renderProbe('dark', { token: 'primary' })).toBe(
      hslTokenToCss(swissTheme.dark.primary)
    );
    expect(swissTheme.dark.primary).not.toBe(swissTheme.light.primary);
  });

  it('draws a token translucent when given an alpha', () => {
    expect(renderProbe('light', { token: 'primary', alpha: 0.1 })).toBe(
      hslTokenToCss(swissTheme.light.primary, 0.1)
    );
  });

  it('resolveThemeColor answers the same outside React', () => {
    expect(resolveThemeColor('mutedForeground', 'dark', undefined)).toBe(
      hslTokenToCss(swissTheme.dark.mutedForeground)
    );
  });
});

describe('with variables the host applied at run time', () => {
  beforeEach(() => {
    mockActiveTheme = swissTheme;
  });

  it("follows the host's dark palette on a light-OS device", () => {
    mockVariables = hostVariables(swissTheme.dark);
    expect(renderProbe('light', { token: 'mutedForeground' })).toBe(
      hslTokenToCss(swissTheme.dark.mutedForeground)
    );
    expect(swissTheme.dark.mutedForeground).not.toBe(
      swissTheme.light.mutedForeground
    );
  });

  it("follows the host's light palette on a dark-OS device", () => {
    mockVariables = hostVariables(swissTheme.light);
    expect(renderProbe('dark', { token: 'primary' })).toBe(
      hslTokenToCss(swissTheme.light.primary)
    );
  });

  it('applies the alpha to a variable too', () => {
    mockVariables = hostVariables(swissTheme.dark);
    expect(renderProbe('light', { token: 'primary', alpha: 0.2 })).toBe(
      hslTokenToCss(swissTheme.dark.primary, 0.2)
    );
  });

  it('needs no configured theme', () => {
    mockActiveTheme = null;
    mockVariables = { '--primary': '120 50% 40%' };
    expect(
      renderProbe('light', { token: 'primary', fallback: '#2563eb' })
    ).toBe('hsl(120, 50%, 40%)');
  });

  it('falls back per token when the host leaves one out', () => {
    mockVariables = { '--primary': '120 50% 40%' };
    expect(renderProbe('dark', { token: 'border' })).toBe(
      hslTokenToCss(swissTheme.dark.border)
    );
  });
});

describe('Switch', () => {
  const tracks = (scheme: 'light' | 'dark') => {
    jest.spyOn(ReactNative, 'useColorScheme').mockReturnValue(scheme);
    const props = render(<Switch checked />).UNSAFE_getByType(
      ReactNative.Switch
    ).props;
    return { ...props.trackColor, ios: props.ios_backgroundColor };
  };

  it('leaves the platform colours when nothing is configured', () => {
    expect(tracks('light')).toEqual({
      false: undefined,
      true: undefined,
      ios: undefined,
    });
  });

  it("takes the configured theme's palette for the OS scheme", () => {
    mockActiveTheme = swissTheme;
    expect(tracks('dark')).toEqual({
      false: hslTokenToCss(swissTheme.dark.input),
      true: hslTokenToCss(swissTheme.dark.primary),
      ios: hslTokenToCss(swissTheme.dark.input),
    });
  });

  it('takes the palette the host applied, whatever the OS says', () => {
    mockActiveTheme = swissTheme;
    mockVariables = hostVariables(swissTheme.dark);
    expect(tracks('light')).toEqual({
      false: hslTokenToCss(swissTheme.dark.input),
      true: hslTokenToCss(swissTheme.dark.primary),
      ios: hslTokenToCss(swissTheme.dark.input),
    });
  });
});
