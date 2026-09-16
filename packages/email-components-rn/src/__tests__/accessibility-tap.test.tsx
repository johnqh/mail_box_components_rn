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
import { ContactCard } from '../ContactCard';
import { CollapsibleEmailField } from '../EmailInputGroup';
import { EmailTemplate } from '../EmailTemplate';
import { FreeEmailBanner } from '../FreeEmailBanner';

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
  Card: (props: { children?: React.ReactNode }) => {
    const RN = require('react-native');
    const R = require('react');
    return R.createElement(RN.View, null, props.children);
  },
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

describe('ContactCard', () => {
  it('runs its handler on a press', () => {
    const onPress = jest.fn();
    render(
      <ContactCard name='Ada' email='ada@example.com' onPress={onPress} />
    );
    fireEvent.press(screen.getByLabelText('Contact Ada'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('runs its handler on an accessibility tap', () => {
    const onPress = jest.fn();
    render(
      <ContactCard name='Ada' email='ada@example.com' onPress={onPress} />
    );
    fireEvent(screen.getByLabelText('Contact Ada'), 'accessibilityTap');
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

describe('EmailTemplate', () => {
  it('runs its handler on a press', () => {
    const onPress = jest.fn();
    render(
      <EmailTemplate onPress={onPress}>
        <Text>Body</Text>
      </EmailTemplate>
    );
    fireEvent.press(screen.getByLabelText('Email Template'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('runs its handler on an accessibility tap', () => {
    const onPress = jest.fn();
    render(
      <EmailTemplate onPress={onPress}>
        <Text>Body</Text>
      </EmailTemplate>
    );
    fireEvent(screen.getByLabelText('Email Template'), 'accessibilityTap');
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does neither when disabled', () => {
    const onPress = jest.fn();
    render(
      <EmailTemplate onPress={onPress} disabled>
        <Text>Body</Text>
      </EmailTemplate>
    );
    const control = screen.getByLabelText('Email Template');
    expect(touchableFor(control).props.onAccessibilityTap).toBeUndefined();
    expect(control.props.accessibilityState).toEqual({ disabled: true });
    fireEvent.press(control);
    fireEvent(control, 'accessibilityTap');
    expect(onPress).not.toHaveBeenCalled();
  });
});

describe('CollapsibleEmailField toggle', () => {
  const tree = (onToggle: () => void) => (
    <CollapsibleEmailField
      isVisible={false}
      onToggle={onToggle}
      showLabel='Add Cc'
      value=''
      onChangeText={jest.fn()}
    />
  );

  it('runs its handler on a press', () => {
    const onToggle = jest.fn();
    render(tree(onToggle));
    fireEvent.press(screen.getByRole('button'));
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('runs its handler on an accessibility tap', () => {
    const onToggle = jest.fn();
    render(tree(onToggle));
    fireEvent(screen.getByRole('button'), 'accessibilityTap');
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});

describe('FreeEmailBanner dismiss', () => {
  const tree = (onDismiss: () => void) => (
    <FreeEmailBanner
      isDismissible
      onDismiss={onDismiss}
      dismissAriaLabel='Dismiss banner'
    />
  );

  it('runs its handler on a press', () => {
    const onDismiss = jest.fn();
    render(tree(onDismiss));
    fireEvent.press(screen.getByLabelText('Dismiss banner'));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('runs its handler on an accessibility tap', () => {
    const onDismiss = jest.fn();
    render(tree(onDismiss));
    fireEvent(screen.getByLabelText('Dismiss banner'), 'accessibilityTap');
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});
