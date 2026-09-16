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
import { pressProps } from '@sudobility/components-rn';
import { TierComparisonTable } from '../TierComparisonTable';
import { UsageDashboard } from '../UsageDashboard';
import { UsageHistoryChart } from '../UsageHistoryChart';
import type { TierDisplayData } from '../types';

/*
  Mocked the way this package's other suites mock it. `pressProps` is written
  out rather than stubbed — a stub would let every wiring assertion below pass
  while nothing worked on a Mac — and the two tests under `pressProps` are what
  stop it drifting. The real implementation is proven in components-rn's own
  `a11y.test.ts`.
*/
jest.mock('@sudobility/components-rn', () => ({
  cn: (...args: unknown[]) => args.filter(Boolean).join(' '),
  pressProps: (onPress?: (e?: unknown) => unknown, disabled?: boolean) => ({
    onPress,
    onAccessibilityTap:
      !onPress || disabled ? undefined : () => onPress(undefined),
  }),
}));

const tiers: TierDisplayData[] = [
  {
    name: 'Free',
    hourlyLimit: 100,
    dailyLimit: 1000,
    monthlyLimit: 10000,
    isCurrent: true,
  },
  {
    name: 'Pro',
    hourlyLimit: 1000,
    dailyLimit: 10000,
    monthlyLimit: 100000,
  },
];

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

describe('TierComparisonTable tier', () => {
  it('runs its handler on a press', () => {
    const onTierSelect = jest.fn();
    render(<TierComparisonTable tiers={tiers} onTierSelect={onTierSelect} />);
    fireEvent.press(screen.getByLabelText('Select Pro plan'));
    expect(onTierSelect).toHaveBeenCalledTimes(1);
  });

  it('runs its handler on an accessibility tap', () => {
    const onTierSelect = jest.fn();
    render(<TierComparisonTable tiers={tiers} onTierSelect={onTierSelect} />);
    fireEvent(screen.getByLabelText('Select Pro plan'), 'accessibilityTap');
    expect(onTierSelect).toHaveBeenCalledTimes(1);
  });

  it('offers no route on the tier already in use', () => {
    // The current tier is deliberately not a control, so there is nothing for
    // either route to reach.
    render(<TierComparisonTable tiers={tiers} onTierSelect={jest.fn()} />);
    expect(screen.queryByLabelText('Select Free plan')).toBeNull();
  });
});

describe('UsageDashboard bar', () => {
  const bars = [{ label: 'Hourly', current: 10, limit: 100 }];

  it('runs its handler on a press', () => {
    const onBarPress = jest.fn();
    render(<UsageDashboard bars={bars} onBarPress={onBarPress} />);
    fireEvent.press(screen.getByLabelText('Hourly: 10 of 100 used'));
    expect(onBarPress).toHaveBeenCalledTimes(1);
  });

  it('runs its handler on an accessibility tap', () => {
    const onBarPress = jest.fn();
    render(<UsageDashboard bars={bars} onBarPress={onBarPress} />);
    fireEvent(
      screen.getByLabelText('Hourly: 10 of 100 used'),
      'accessibilityTap'
    );
    expect(onBarPress).toHaveBeenCalledTimes(1);
  });
});

describe('UsageHistoryChart data point', () => {
  const data = [
    { timestamp: '2026-01-01', value: 5, limit: 10 },
    { timestamp: '2026-01-02', value: 7, limit: 10 },
  ];

  it('runs its handler on a press', () => {
    const onDataPointPress = jest.fn();
    render(
      <UsageHistoryChart data={data} onDataPointPress={onDataPointPress} />
    );
    fireEvent.press(screen.getAllByRole('button')[0]);
    expect(onDataPointPress).toHaveBeenCalledTimes(1);
  });

  it('runs its handler on an accessibility tap', () => {
    const onDataPointPress = jest.fn();
    render(
      <UsageHistoryChart data={data} onDataPointPress={onDataPointPress} />
    );
    fireEvent(screen.getAllByRole('button')[0], 'accessibilityTap');
    expect(onDataPointPress).toHaveBeenCalledTimes(1);
  });
});
