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
import { SegmentedControl } from '../SegmentedControl';
import { SubscriptionLayout } from '../SubscriptionLayout';
import { SubscriptionTile } from '../SubscriptionTile';

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

const options = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

describe('pressProps, as this package receives it', () => {
  // The suite runs against the repo-wide mock of components-rn in
  // `jest.mocks.cjs`; if that mock ever became a stub, every wiring assertion
  // below would pass while nothing worked on a Mac.
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

describe('SegmentedControl option', () => {
  it('runs its handler on a press', () => {
    const onChange = jest.fn();
    render(
      <SegmentedControl options={options} value='monthly' onChange={onChange} />
    );
    fireEvent.press(screen.getByText('Yearly'));
    expect(onChange).toHaveBeenCalledWith('yearly');
  });

  it('runs its handler on an accessibility tap', () => {
    const onChange = jest.fn();
    render(
      <SegmentedControl options={options} value='monthly' onChange={onChange} />
    );
    fireEvent(screen.getByText('Yearly'), 'accessibilityTap');
    expect(onChange).toHaveBeenCalledWith('yearly');
  });

  it('does neither when the control is disabled', () => {
    const onChange = jest.fn();
    render(
      <SegmentedControl
        options={options}
        value='monthly'
        onChange={onChange}
        disabled
      />
    );
    const option = screen.getByText('Yearly');
    expect(touchableFor(option).props.onAccessibilityTap).toBeUndefined();
    fireEvent.press(option);
    fireEvent(option, 'accessibilityTap');
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe('SubscriptionLayout primary action', () => {
  const tree = (action: {
    label: string;
    onPress: () => void;
    disabled?: boolean;
  }) => (
    <SubscriptionLayout title='Choose a Plan' primaryAction={action}>
      <Text>Tiles</Text>
    </SubscriptionLayout>
  );

  it('runs its handler on a press', () => {
    const onPress = jest.fn();
    render(tree({ label: 'Subscribe', onPress }));
    fireEvent.press(screen.getByLabelText('Subscribe'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('runs its handler on an accessibility tap', () => {
    const onPress = jest.fn();
    render(tree({ label: 'Subscribe', onPress }));
    fireEvent(screen.getByLabelText('Subscribe'), 'accessibilityTap');
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does neither when disabled', () => {
    const onPress = jest.fn();
    render(tree({ label: 'Subscribe', onPress, disabled: true }));
    const button = screen.getByLabelText('Subscribe');
    expect(touchableFor(button).props.onAccessibilityTap).toBeUndefined();
    expect(button.props.accessibilityState.disabled).toBe(true);
    fireEvent.press(button);
    fireEvent(button, 'accessibilityTap');
    expect(onPress).not.toHaveBeenCalled();
  });
});

describe('SubscriptionTile', () => {
  const tile = (
    props: Partial<React.ComponentProps<typeof SubscriptionTile>>
  ) => (
    <SubscriptionTile
      id='pro'
      title='Pro'
      price='$9.99'
      features={['Everything']}
      isSelected={false}
      onSelect={jest.fn()}
      {...props}
    />
  );

  it('runs its handler on a press', () => {
    const onSelect = jest.fn();
    render(tile({ onSelect }));
    fireEvent.press(screen.getByText('Pro'));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('runs its handler on an accessibility tap', () => {
    const onSelect = jest.fn();
    render(tile({ onSelect }));
    fireEvent(screen.getByText('Pro'), 'accessibilityTap');
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('does neither when disabled', () => {
    const onSelect = jest.fn();
    render(tile({ onSelect, disabled: true }));
    const target = screen.getByText('Pro');
    expect(touchableFor(target).props.onAccessibilityTap).toBeUndefined();
    fireEvent.press(target);
    fireEvent(target, 'accessibilityTap');
    expect(onSelect).not.toHaveBeenCalled();
  });
});

describe('SubscriptionTile CTA button', () => {
  const tile = (onPress: () => void, disabled = false) => (
    <SubscriptionTile
      id='pro'
      title='Pro'
      price='$9.99'
      features={['Everything']}
      isSelected={false}
      onSelect={jest.fn()}
      ctaButton={{ label: 'Start trial', onPress }}
      disabled={disabled}
    />
  );

  it('runs its handler on a press', () => {
    const onPress = jest.fn();
    render(tile(onPress));
    fireEvent.press(screen.getByLabelText('Start trial'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('runs its handler on an accessibility tap', () => {
    const onPress = jest.fn();
    render(tile(onPress));
    fireEvent(screen.getByLabelText('Start trial'), 'accessibilityTap');
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does neither when disabled', () => {
    const onPress = jest.fn();
    render(tile(onPress, true));
    const button = screen.getByLabelText('Start trial');
    expect(touchableFor(button).props.onAccessibilityTap).toBeUndefined();
    expect(button.props.accessibilityState.disabled).toBe(true);
    fireEvent.press(button);
    fireEvent(button, 'accessibilityTap');
    expect(onPress).not.toHaveBeenCalled();
  });
});
