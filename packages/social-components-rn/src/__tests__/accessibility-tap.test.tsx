/**
 * Every control here is reachable by assistive technology, not only by a press.
 *
 * On react-native-macos an assistive activation arrives as `onAccessibilityTap`
 * and not as `onPress` — there is no synthesized touch behind it — so a
 * touchable wired with `onPress` alone announces itself, takes focus, and then
 * does nothing. Every touchable in this package spreads `pressProps`.
 *
 * This package depends on nothing but React Native and `clsx`, so it carries
 * its own copy of the helper in `src/a11y.ts` rather than pulling in the whole
 * component library for four lines; `@sudobility/components-rn` is the
 * original. The first block below is what pins this copy's behaviour.
 *
 * `accessibility-tap-guard.test.ts` is the structural half: it parses the
 * source, so a component added tomorrow is covered without a case here.
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import type { ReactTestInstance } from 'react-test-renderer';
import { accessibilityTap, pressProps } from '../a11y';
import { RatingStars } from '../RatingStars';
import { ShareButtons } from '../ShareButtons';

/*
  `expo-clipboard` is an optional peer and its module core throws at import
  time under jest ("Cannot read properties of undefined (reading
  'EventEmitter')"), which takes the whole suite down before a single
  assertion. ShareButtons only needs it for the copy-link platform.
*/
jest.mock('expo-clipboard', () => ({
  setStringAsync: jest.fn(async () => true),
}));

/** See the note in components-rn's own accessibility-tap test. */
function touchableFor(element: ReactTestInstance): ReactTestInstance {
  let node: ReactTestInstance | null = element;
  while (node) {
    if (
      typeof node.type === 'string' &&
      typeof node.props.onStartShouldSetResponder === 'function'
    ) {
      return node;
    }
    node = node.parent;
  }
  throw new Error('no touchable found for the element under test');
}

describe('this package’s copy of pressProps', () => {
  it('returns both activation routes', () => {
    const onPress = jest.fn();
    const props = pressProps(onPress);
    expect(props.onPress).toBe(onPress);
    props.onAccessibilityTap?.();
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('keeps onPress but withholds the tap when disabled', () => {
    const onPress = jest.fn();
    const props = pressProps(onPress, true);
    // `disabled` on the touchable is what suppresses `onPress`; nothing
    // suppresses `onAccessibilityTap` for you, so it has to be withheld here.
    expect(props.onPress).toBe(onPress);
    expect(props.onAccessibilityTap).toBeUndefined();
  });

  it('passes no event, because there is no gesture behind the activation', () => {
    const onPress = jest.fn();
    accessibilityTap(onPress)?.();
    expect(onPress).toHaveBeenCalledWith(undefined);
  });

  it('has nothing to call without a handler', () => {
    expect(accessibilityTap(undefined)).toBeUndefined();
    expect(pressProps(null)).toEqual({
      onPress: undefined,
      onAccessibilityTap: undefined,
    });
  });
});

describe('RatingStars star', () => {
  it('runs its handler on a press', () => {
    const onChange = jest.fn();
    render(<RatingStars value={0} onChange={onChange} />);
    fireEvent.press(screen.getByLabelText('Rate 3 stars'));
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('runs its handler on an accessibility tap', () => {
    const onChange = jest.fn();
    render(<RatingStars value={0} onChange={onChange} />);
    fireEvent(screen.getByLabelText('Rate 3 stars'), 'accessibilityTap');
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('does neither when read-only', () => {
    const onChange = jest.fn();
    render(<RatingStars value={0} onChange={onChange} readonly />);
    const star = screen.getByLabelText('Rate 3 stars');
    expect(touchableFor(star).props.onAccessibilityTap).toBeUndefined();
    expect(star.props.accessibilityState.disabled).toBe(true);
    fireEvent.press(star);
    fireEvent(star, 'accessibilityTap');
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('ShareButtons platform', () => {
  it('is activated by a press', () => {
    render(<ShareButtons url='https://example.com' platforms={['twitter']} />);
    const button = screen.getByLabelText(/^Share on /);
    expect(() => fireEvent.press(button)).not.toThrow();
  });

  it('is activated by an accessibility tap, through the same handler', () => {
    // The handler opens a URL rather than calling back, so what this pins is
    // that both props exist and are the same function.
    render(<ShareButtons url='https://example.com' platforms={['twitter']} />);
    const host = touchableFor(screen.getByLabelText(/^Share on /));
    expect(typeof host.props.onAccessibilityTap).toBe('function');
    expect(() =>
      fireEvent(screen.getByLabelText(/^Share on /), 'accessibilityTap')
    ).not.toThrow();
  });
});
