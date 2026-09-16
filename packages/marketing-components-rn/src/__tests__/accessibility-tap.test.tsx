/**
 * Every control here is reachable by assistive technology, not only by a press.
 *
 * On react-native-macos an assistive activation arrives as `onAccessibilityTap`
 * and not as `onPress` — there is no synthesized touch behind it — so a
 * touchable wired with `onPress` alone announces itself, takes focus, and then
 * does nothing. Every touchable in this package spreads `pressProps` from
 * `@sudobility/components-rn`, which returns both routes from one handler.
 *
 * `accessibility-tap-guard.test.ts` is the structural half: it parses the
 * source, so a component added tomorrow is covered without a case here.
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import type { ReactTestInstance } from 'react-test-renderer';
import { Text } from 'react-native';
import { pressProps } from '@sudobility/components-rn';
import { CtaBanner } from '../CtaBanner';
import { FeatureSpotlight } from '../FeatureSpotlight';
import { HeroBannerWithBadge } from '../HeroBannerWithBadge';
import { InternalLink } from '../InternalLinkClusters';
import { NpsSurvey } from '../NpsSurvey';
import { TestimonialSlider } from '../TestimonialSlider';

/*
  Mocked the way this repo's other package suites mock it: jest's rootDir is
  this package, so the real library's own imports resolve outside the haste map
  and it cannot be loaded here. `pressProps` is written out rather than stubbed
  — a stub would let every wiring assertion below pass while nothing worked on
  a Mac — and the two tests under `pressProps` are what stop it drifting. The
  real implementation is proven in components-rn's own `a11y.test.ts`.
*/
jest.mock('@sudobility/components-rn', () => ({
  cn: (...args: unknown[]) => args.filter(Boolean).join(' '),
  pressProps: (onPress?: (e?: unknown) => unknown, disabled?: boolean) => ({
    onPress,
    onAccessibilityTap:
      !onPress || disabled ? undefined : () => onPress(undefined),
  }),
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

/**
 * The four card-shaped components share one body: a labelled Pressable with a
 * `disabled` prop. Testing them from a table keeps the four identical cases
 * from being four copies that can drift apart.
 */
const CARDS = [
  { name: 'CtaBanner', Component: CtaBanner, label: 'CTA Banner' },
  {
    name: 'FeatureSpotlight',
    Component: FeatureSpotlight,
    label: 'Feature Spotlight',
  },
  { name: 'NpsSurvey', Component: NpsSurvey, label: 'NPS Survey' },
  {
    name: 'TestimonialSlider',
    Component: TestimonialSlider,
    label: 'Testimonial Slider',
  },
] as const;

describe('pressProps, as this package receives it', () => {
  it('returns both activation routes', () => {
    const onPress = jest.fn();
    const props = pressProps(onPress);
    expect(props.onPress).toBe(onPress);
    props.onAccessibilityTap?.();
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('withholds the tap when disabled', () => {
    expect(pressProps(jest.fn(), true).onAccessibilityTap).toBeUndefined();
  });
});

describe.each(CARDS)('$name', ({ Component, label }) => {
  it('runs its handler on a press', () => {
    const onPress = jest.fn();
    render(
      <Component onPress={onPress}>
        <Text>Body</Text>
      </Component>
    );
    fireEvent.press(screen.getByLabelText(label));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('runs its handler on an accessibility tap', () => {
    const onPress = jest.fn();
    render(
      <Component onPress={onPress}>
        <Text>Body</Text>
      </Component>
    );
    fireEvent(screen.getByLabelText(label), 'accessibilityTap');
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does neither when disabled', () => {
    const onPress = jest.fn();
    render(
      <Component onPress={onPress} disabled>
        <Text>Body</Text>
      </Component>
    );
    const control = screen.getByLabelText(label);
    expect(touchableFor(control).props.onAccessibilityTap).toBeUndefined();
    expect(control.props.accessibilityState.disabled).toBe(true);
    fireEvent.press(control);
    fireEvent(control, 'accessibilityTap');
    expect(onPress).not.toHaveBeenCalled();
  });
});

describe('HeroBannerWithBadge primary button', () => {
  const tree = (onPress: () => void) => (
    <HeroBannerWithBadge
      badgeText='New'
      title='Ship faster'
      description='A description.'
      primaryButton={{ text: 'Get started', onPress }}
    />
  );

  it('runs its handler on a press', () => {
    const onPress = jest.fn();
    render(tree(onPress));
    fireEvent.press(screen.getByText('Get started'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('runs its handler on an accessibility tap', () => {
    const onPress = jest.fn();
    render(tree(onPress));
    fireEvent(screen.getByText('Get started'), 'accessibilityTap');
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

describe('InternalLink', () => {
  it('runs its handler on a press', () => {
    const onPress = jest.fn();
    render(
      <InternalLink to='/pricing' onPress={onPress}>
        Pricing
      </InternalLink>
    );
    fireEvent.press(screen.getByText('Pricing'));
    expect(onPress).toHaveBeenCalledWith('/pricing');
  });

  it('runs its handler on an accessibility tap', () => {
    const onPress = jest.fn();
    render(
      <InternalLink to='/pricing' onPress={onPress}>
        Pricing
      </InternalLink>
    );
    fireEvent(screen.getByText('Pricing'), 'accessibilityTap');
    expect(onPress).toHaveBeenCalledWith('/pricing');
  });
});
