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
import { AlertDialog } from '../AlertDialog';
import { ApiPlayground } from '../ApiPlayground';
import { AuditLog } from '../AuditLog';
import { MetricsGrid } from '../MetricsGrid';
import { SystemStatusIndicator } from '../SystemStatusIndicator';

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

/**
 * The touchable host under or above `element`.
 *
 * `fireEvent` cannot prove the disabled half on its own: React Native Testing
 * Library refuses to deliver any event through a host whose
 * `onStartShouldSetResponder` answers false, so a disabled control looks inert
 * whether or not it is actually wired. The platform has no such courtesy, so
 * the assertion reads the prop.
 */
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

const entry = {
  id: 'e1',
  action: 'create' as const,
  actor: { id: 'u1', name: 'Ada' },
  resource: { type: 'service', id: 's1', name: 'Billing' },
  timestamp: new Date('2026-01-01T00:00:00Z'),
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

describe('ApiPlayground', () => {
  it('runs its handler on a press', () => {
    const onPress = jest.fn();
    render(
      <ApiPlayground onPress={onPress}>
        <Text>Body</Text>
      </ApiPlayground>
    );
    fireEvent.press(screen.getByLabelText('API Playground'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('runs its handler on an accessibility tap', () => {
    const onPress = jest.fn();
    render(
      <ApiPlayground onPress={onPress}>
        <Text>Body</Text>
      </ApiPlayground>
    );
    fireEvent(screen.getByLabelText('API Playground'), 'accessibilityTap');
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does neither when disabled', () => {
    const onPress = jest.fn();
    render(
      <ApiPlayground onPress={onPress} disabled>
        <Text>Body</Text>
      </ApiPlayground>
    );
    const control = screen.getByLabelText('API Playground');
    expect(touchableFor(control).props.onAccessibilityTap).toBeUndefined();
    expect(control.props.accessibilityState).toEqual({ disabled: true });
    fireEvent.press(control);
    fireEvent(control, 'accessibilityTap');
    expect(onPress).not.toHaveBeenCalled();
  });
});

describe('AlertDialog confirm', () => {
  const setup = (confirmDisabled = false) => {
    const onConfirm = jest.fn();
    render(
      <AlertDialog
        isOpen
        title='Delete service'
        confirmLabel='Delete'
        onClose={jest.fn()}
        onConfirm={onConfirm}
        confirmDisabled={confirmDisabled}
      />
    );
    return onConfirm;
  };

  it('runs its handler on a press', () => {
    const onConfirm = setup();
    fireEvent.press(screen.getByText('Delete'));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('runs its handler on an accessibility tap', () => {
    const onConfirm = setup();
    fireEvent(screen.getByText('Delete'), 'accessibilityTap');
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('does neither when disabled', () => {
    const onConfirm = setup(true);
    const control = screen.getByText('Delete');
    expect(touchableFor(control).props.onAccessibilityTap).toBeUndefined();
    fireEvent.press(control);
    fireEvent(control, 'accessibilityTap');
    expect(onConfirm).not.toHaveBeenCalled();
  });
});

describe('AuditLog entry', () => {
  it('runs its handler on a press', () => {
    const onEntryPress = jest.fn();
    render(<AuditLog entries={[entry]} onEntryPress={onEntryPress} />);
    fireEvent.press(screen.getByText('Billing'));
    expect(onEntryPress).toHaveBeenCalledTimes(1);
  });

  it('runs its handler on an accessibility tap', () => {
    const onEntryPress = jest.fn();
    render(<AuditLog entries={[entry]} onEntryPress={onEntryPress} />);
    fireEvent(screen.getByText('Billing'), 'accessibilityTap');
    expect(onEntryPress).toHaveBeenCalledTimes(1);
  });
});

describe('MetricsGrid metric', () => {
  const metrics = [{ id: 'm1', label: 'Requests', value: 42 }];

  it('runs its handler on a press', () => {
    const onMetricPress = jest.fn();
    render(<MetricsGrid metrics={metrics} onMetricPress={onMetricPress} />);
    fireEvent.press(screen.getByText('Requests'));
    expect(onMetricPress).toHaveBeenCalledTimes(1);
  });

  it('runs its handler on an accessibility tap', () => {
    const onMetricPress = jest.fn();
    render(<MetricsGrid metrics={metrics} onMetricPress={onMetricPress} />);
    fireEvent(screen.getByText('Requests'), 'accessibilityTap');
    expect(onMetricPress).toHaveBeenCalledTimes(1);
  });
});

describe('SystemStatusIndicator', () => {
  it('runs its handler on a press', () => {
    const onPress = jest.fn();
    render(
      <SystemStatusIndicator
        status='operational'
        systemName='API'
        onPress={onPress}
      />
    );
    fireEvent.press(screen.getByText('API'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('runs its handler on an accessibility tap', () => {
    const onPress = jest.fn();
    render(
      <SystemStatusIndicator
        status='operational'
        systemName='API'
        onPress={onPress}
      />
    );
    fireEvent(screen.getByText('API'), 'accessibilityTap');
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
