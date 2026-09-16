/**
 * Every control here is reachable by assistive technology, not only by a press.
 *
 * On react-native-macos an assistive activation arrives as `onAccessibilityTap`
 * and not as `onPress` — there is no synthesized touch behind it — so a
 * touchable wired with `onPress` alone announces itself, takes focus, and then
 * does nothing. Every touchable in this package spreads `pressProps` from
 * `@sudobility/components-rn`, which returns both routes from one handler.
 *
 * The two exceptions are the panels inside `EntitySelector` and
 * `MemberRoleSelector`, which swallow a press so it does not reach the scrim
 * behind them. Those need the gesture an assistive activation does not carry,
 * and they are marked `no-a11y-tap` in the source.
 *
 * `accessibility-tap-guard.test.ts` is the structural half: it parses the
 * source, so a component added tomorrow is covered without a case here.
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import type { ReactTestInstance } from 'react-test-renderer';
import { pressProps } from '@sudobility/components-rn';
import { EntityCard } from '../EntityCard';
import { EntitySelector } from '../EntitySelector';
import { MemberList } from '../MemberList';
import { MemberRoleSelector } from '../MemberRoleSelector';
import type { Entity, Member } from '../types';

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

const entity: Entity = { id: 'e1', name: 'Acme Corp', role: 'admin' };
const member: Member = {
  id: 'm1',
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  role: 'admin',
};

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

describe('EntityCard', () => {
  it('runs its handler on a press', () => {
    const onPress = jest.fn();
    render(<EntityCard entity={entity} onPress={onPress} />);
    fireEvent.press(screen.getByLabelText('Entity: Acme Corp'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('runs its handler on an accessibility tap', () => {
    const onPress = jest.fn();
    render(<EntityCard entity={entity} onPress={onPress} />);
    fireEvent(screen.getByLabelText('Entity: Acme Corp'), 'accessibilityTap');
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('offers neither route when it has no handler at all', () => {
    // A card with nothing to do reports itself disabled rather than pretending
    // to be a button.
    render(<EntityCard entity={entity} />);
    const card = screen.getByLabelText('Entity: Acme Corp');
    expect(touchableFor(card).props.onAccessibilityTap).toBeUndefined();
    expect(card.props.accessibilityState.disabled).toBe(true);
  });
});

describe('MemberList row', () => {
  it('runs its handler on a press', () => {
    const onMemberPress = jest.fn();
    render(<MemberList members={[member]} onMemberPress={onMemberPress} />);
    fireEvent.press(screen.getByLabelText('Member: Ada Lovelace, Role: admin'));
    expect(onMemberPress).toHaveBeenCalledTimes(1);
  });

  it('runs its handler on an accessibility tap', () => {
    const onMemberPress = jest.fn();
    render(<MemberList members={[member]} onMemberPress={onMemberPress} />);
    fireEvent(
      screen.getByLabelText('Member: Ada Lovelace, Role: admin'),
      'accessibilityTap'
    );
    expect(onMemberPress).toHaveBeenCalledTimes(1);
  });

  it('offers neither route with no handler', () => {
    render(<MemberList members={[member]} />);
    const row = screen.getByLabelText('Member: Ada Lovelace, Role: admin');
    expect(touchableFor(row).props.onAccessibilityTap).toBeUndefined();
    expect(row.props.accessibilityState.disabled).toBe(true);
  });
});

describe('EntitySelector trigger', () => {
  it('opens the list on a press', () => {
    render(<EntitySelector entities={[entity]} onSelect={jest.fn()} />);
    fireEvent.press(screen.getByRole('button'));
    expect(screen.getByLabelText('Select Acme Corp')).toBeTruthy();
  });

  it('opens the list on an accessibility tap', () => {
    render(<EntitySelector entities={[entity]} onSelect={jest.fn()} />);
    fireEvent(screen.getByRole('button'), 'accessibilityTap');
    expect(screen.getByLabelText('Select Acme Corp')).toBeTruthy();
  });

  it('opens on neither when disabled', () => {
    render(
      <EntitySelector entities={[entity]} onSelect={jest.fn()} disabled />
    );
    const trigger = screen.getByRole('button');
    expect(touchableFor(trigger).props.onAccessibilityTap).toBeUndefined();
    fireEvent.press(trigger);
    fireEvent(trigger, 'accessibilityTap');
    expect(screen.queryByLabelText('Select Acme Corp')).toBeNull();
  });
});

describe('EntitySelector option', () => {
  const open = () => {
    const onSelect = jest.fn();
    render(<EntitySelector entities={[entity]} onSelect={onSelect} />);
    fireEvent.press(screen.getByRole('button'));
    return onSelect;
  };

  it('runs its handler on a press', () => {
    const onSelect = open();
    fireEvent.press(screen.getByLabelText('Select Acme Corp'));
    expect(onSelect).toHaveBeenCalledWith(entity);
  });

  it('runs its handler on an accessibility tap', () => {
    const onSelect = open();
    fireEvent(screen.getByLabelText('Select Acme Corp'), 'accessibilityTap');
    expect(onSelect).toHaveBeenCalledWith(entity);
  });
});

describe('MemberRoleSelector trigger', () => {
  it('opens on a press', () => {
    render(
      <MemberRoleSelector selectedRole='admin' onRoleChange={jest.fn()} />
    );
    fireEvent.press(screen.getAllByRole('button')[0]);
    expect(screen.getByLabelText('Cancel')).toBeTruthy();
  });

  it('opens on an accessibility tap', () => {
    render(
      <MemberRoleSelector selectedRole='admin' onRoleChange={jest.fn()} />
    );
    fireEvent(screen.getAllByRole('button')[0], 'accessibilityTap');
    expect(screen.getByLabelText('Cancel')).toBeTruthy();
  });

  it('opens on neither when disabled', () => {
    render(
      <MemberRoleSelector
        selectedRole='admin'
        onRoleChange={jest.fn()}
        disabled
      />
    );
    const trigger = screen.getAllByRole('button')[0];
    expect(touchableFor(trigger).props.onAccessibilityTap).toBeUndefined();
    fireEvent.press(trigger);
    fireEvent(trigger, 'accessibilityTap');
    expect(screen.queryByLabelText('Cancel')).toBeNull();
  });
});
