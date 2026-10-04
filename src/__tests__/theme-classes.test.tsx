/**
 * Components colour themselves with semantic classes wherever NativeWind can
 * map a class onto the prop that needs the colour — `ActivityIndicator`'s
 * `color`, `TextInput`'s `placeholderTextColor`, an `Svg`'s `color` — so they
 * follow whatever palette the host applied, including one it sets at run time.
 * NativeWind is not running here, so these tests read the class each
 * component hands over, which is the whole of the component's part.
 *
 * The design system is the real one, configured with the swiss theme, so the
 * variant classes are the ones an app gets.
 */
import * as React from 'react';
import * as ReactNative from 'react-native';
import { ActivityIndicator, TextInput } from 'react-native';
import { render, screen } from '@testing-library/react-native';

jest.mock('@sudobility/design', () => jest.requireActual('@sudobility/design'));

let mockVariables: Record<string, unknown> = {};
jest.mock('nativewind', () => ({
  cssInterop: (component: unknown) => component,
  useUnstableNativeVariable: (name: string) => mockVariables[name],
}));

const design = jest.requireActual('@sudobility/design');
const { swissTheme } = jest.requireActual('@sudobility/design/themes');
design.configureTheme(swissTheme, { native: true });

const {
  BUTTON_VARIANT_ROUTES,
  getButtonVariantClass,
} = require('../ui/Button/Button.shared');
const { Button } = require('../ui/Button');
const { Spinner } = require('../ui/Spinner');
const { SearchInput } = require('../ui/SearchInput');
const { TextArea } = require('../ui/TextArea');
const { Alert } = require('../ui/Alert');
const { EmptyState } = require('../ui/EmptyState');
const { DashboardStatCard } = require('../ui/DashboardStatCard');
const { FormattedNumber } = require('../ui/FormattedNumber');
const { TruncatedText } = require('../ui/TruncatedText');
const { ProgressCircle } = require('../ui/ProgressCircle');
const { resolveIconColor } = require('../lib/icon-color');
const {
  extractTextColorClasses,
  stripTextColorClasses,
} = require('../lib/text-color');
const { hslTokenToCss } = require('../lib/theme-color');

beforeEach(() => {
  mockVariables = {};
});

const tokens = (className: string) => className.split(/\s+/).filter(Boolean);

describe('Button variants', () => {
  const v = design.variants;
  const primary = getButtonVariantClass('primary', undefined, v);

  it.each(Object.keys(BUTTON_VARIANT_ROUTES))(
    '%s resolves to classes of its own',
    variant => {
      const cls = getButtonVariantClass(variant, undefined, v);
      expect(cls).not.toBe('');
      if (variant === 'default' || variant === 'primary') {
        expect(cls).toBe(primary);
      } else {
        expect(cls).not.toBe(primary);
      }
    }
  );

  it('draws destructive-outline as the design system’s destructive outline', () => {
    expect(getButtonVariantClass('destructive-outline', undefined, v)).toBe(
      getButtonVariantClass('destructive', undefined, {
        button: { destructive: { default: v.button.destructive.outline } },
      })
    );
    expect(
      tokens(getButtonVariantClass('destructive-outline', undefined, v))
    ).toContain('text-destructive');
  });

  it('draws success in the success tokens', () => {
    const cls = tokens(getButtonVariantClass('success', undefined, v));
    expect(cls).toContain('bg-success');
    expect(cls).toContain('text-success-foreground');
    expect(cls.some(c => c.includes('primary'))).toBe(false);
  });

  it('keeps a variant whose group lacks the size, instead of turning primary', () => {
    const cls = getButtonVariantClass('destructive', 'lg', v);
    expect(tokens(cls)).toContain('bg-destructive');
  });

  it("colours the loading spinner with the label's colour", () => {
    render(
      <Button variant='destructive' loading>
        Delete
      </Button>
    );
    const spinner = screen.UNSAFE_getByType(ActivityIndicator);
    expect(spinner.props.color).toBeUndefined();
    expect(tokens(spinner.props.className)).toContain(
      'text-destructive-foreground'
    );
  });

  it("lets textClassName's colour reach the spinner too", () => {
    render(
      <Button loading textClassName='text-warning'>
        Wait
      </Button>
    );
    const cls = tokens(
      screen.UNSAFE_getByType(ActivityIndicator).props.className
    );
    expect(cls).toContain('text-warning');
    expect(cls).not.toContain('text-primary-foreground');
  });
});

describe('Spinner', () => {
  it.each([
    ['default', 'text-primary'],
    ['white', 'text-primary-foreground'],
    ['success', 'text-success'],
    ['warning', 'text-warning'],
    ['error', 'text-destructive'],
  ])('%s is drawn with %s', (variant, cls) => {
    render(<Spinner variant={variant} />);
    const indicator = screen.UNSAFE_getByType(ActivityIndicator);
    expect(indicator.props.className).toBe(cls);
    expect(indicator.props.color).toBeUndefined();
  });
});

describe('placeholders', () => {
  it('SearchInput takes the muted foreground by class', () => {
    render(<SearchInput placeholder='Find' />);
    const input = screen.UNSAFE_getByType(TextInput);
    expect(tokens(input.props.className)).toContain(
      'placeholder:text-muted-foreground'
    );
    expect(input.props.placeholderTextColor).toBeUndefined();
  });

  it("a caller's placeholderTextColor still wins", () => {
    render(
      <TextArea value='' placeholder='Notes' placeholderTextColor='#123456' />
    );
    const input = screen.UNSAFE_getByType(TextInput);
    expect(input.props.placeholderTextColor).toBe('#123456');
    expect(tokens(input.props.className)).not.toContain(
      'placeholder:text-muted-foreground'
    );
  });
});

describe('text that React Native does not inherit', () => {
  it('Alert draws its variant colour on the title, body and icon glyph', () => {
    render(<Alert variant='error' title='Failed' description='Try again' />);
    for (const text of ['Failed', 'Try again', '✕']) {
      expect(tokens(screen.getByText(text).props.className)).toContain(
        'text-destructive'
      );
    }
    // The title's own foreground is replaced, not left to fight it.
    expect(tokens(screen.getByText('Failed').props.className)).not.toContain(
      'text-foreground'
    );
  });

  it('FormattedNumber and TruncatedText default to the foreground', () => {
    render(
      <>
        <FormattedNumber value={42} />
        <TruncatedText>hello</TruncatedText>
        <TruncatedText className='text-primary'>override</TruncatedText>
      </>
    );
    expect(tokens(screen.getByText('42').props.className)).toContain(
      'text-foreground'
    );
    expect(tokens(screen.getByText('hello').props.className)).toContain(
      'text-foreground'
    );
    const override = tokens(screen.getByText('override').props.className);
    expect(override).toContain('text-primary');
    expect(override).not.toContain('text-foreground');
  });
});

describe('ProgressCircle', () => {
  it('draws the track and arc with classes', () => {
    const { UNSAFE_getAllByType } = render(
      <ProgressCircle value={60} variant='success' />
    );
    const classes = UNSAFE_getAllByType(ReactNative.View)
      .map(v => v.props.className)
      .filter(Boolean)
      .join(' ');
    expect(classes).toContain('border-muted');
    expect(classes).toContain('border-t-success');
    expect(classes).toContain('border-b-success');
    expect(classes).not.toContain('border-l-success');
  });

  it('keeps a passed trackColor', () => {
    const { UNSAFE_getAllByType } = render(
      <ProgressCircle value={10} trackColor='#abcdef' />
    );
    const track = UNSAFE_getAllByType(ReactNative.View).find(
      v => v.props.style?.borderColor === '#abcdef'
    );
    expect(track).toBeTruthy();
    expect(track!.props.className).toBeUndefined();
  });
});

describe('icon slots', () => {
  function Icon(_props: { color?: string; className?: string }) {
    return null;
  }

  it('gives an icon with no colour the slot colour', () => {
    const out = resolveIconColor(<Icon />, 'red');
    expect(out.props.color).toBe('red');
  });

  it("keeps an icon's own colour", () => {
    expect(resolveIconColor(<Icon color='blue' />, 'red').props.color).toBe(
      'blue'
    );
    expect(
      resolveIconColor(<Icon className='text-primary' />, 'red').props.color
    ).toBeUndefined();
  });

  it('leaves non-elements and an unthemed host alone', () => {
    expect(resolveIconColor('★', 'red')).toBe('★');
    const icon = <Icon />;
    expect(resolveIconColor(icon, undefined)).toBe(icon);
  });

  it("EmptyState hands its icon the host's muted foreground", () => {
    mockVariables = { '--muted-foreground': swissTheme.dark.mutedForeground };
    const { UNSAFE_getByType } = render(
      <EmptyState icon={<Icon />} title='Nothing here' />
    );
    expect(UNSAFE_getByType(Icon).props.color).toBe(
      hslTokenToCss(swissTheme.dark.mutedForeground)
    );
  });

  it('DashboardStatCard keeps an icon that states its colour', () => {
    const { UNSAFE_getByType } = render(
      <DashboardStatCard
        title='Sales'
        value={3}
        icon={<Icon color='green' />}
      />
    );
    expect(UNSAFE_getByType(Icon).props.color).toBe('green');
  });
});

describe('text colour helpers', () => {
  it('pick colours out of a class string and leave sizes', () => {
    expect(
      extractTextColorClasses('text-sm text-primary dark:text-foreground')
    ).toBe('text-primary dark:text-foreground');
    expect(stripTextColorClasses('text-sm text-primary font-medium')).toBe(
      'text-sm font-medium'
    );
  });
});
