import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { UsageDashboard } from '../UsageDashboard';
import { UsageBarConfig } from '../types';

jest.mock('@sudobility/components-rn', () => ({
  cn: (...args: unknown[]) => args.filter(Boolean).join(' '),
}));

const sampleBars: UsageBarConfig[] = [
  { label: 'Hourly', current: 50, limit: 100 },
  { label: 'Daily', current: 800, limit: 1000, subtitle: 'Resets at midnight' },
  { label: 'Monthly', current: 9500, limit: 10000, colorOverride: 'red' },
];

describe('UsageDashboard', () => {
  it('renders bar labels', () => {
    render(<UsageDashboard bars={sampleBars} />);
    expect(screen.getByText('Hourly')).toBeTruthy();
    expect(screen.getByText('Daily')).toBeTruthy();
    expect(screen.getByText('Monthly')).toBeTruthy();
  });

  it('renders title and subtitle', () => {
    render(
      <UsageDashboard
        bars={sampleBars}
        title="API Usage"
        subtitle="Current billing period"
      />
    );
    expect(screen.getByText('API Usage')).toBeTruthy();
    expect(screen.getByText('Current billing period')).toBeTruthy();
  });

  it('displays current/limit values', () => {
    render(<UsageDashboard bars={[{ label: 'Hourly', current: 50, limit: 100 }]} />);
    expect(screen.getByText('50 / 100')).toBeTruthy();
  });

  it('displays percentage', () => {
    render(
      <UsageDashboard
        bars={[{ label: 'Hourly', current: 50, limit: 100 }]}
        showPercentage
      />
    );
    expect(screen.getByText('50.0%')).toBeTruthy();
  });

  it('hides percentage when showPercentage is false', () => {
    render(
      <UsageDashboard
        bars={[{ label: 'Hourly', current: 50, limit: 100 }]}
        showPercentage={false}
      />
    );
    expect(screen.queryByText('50.0%')).toBeNull();
  });

  it('displays remaining count', () => {
    render(
      <UsageDashboard
        bars={[{ label: 'Hourly', current: 30, limit: 100 }]}
        showRemaining
      />
    );
    expect(screen.getByText('70 remaining')).toBeTruthy();
  });

  it('hides remaining when showRemaining is false', () => {
    render(
      <UsageDashboard
        bars={[{ label: 'Hourly', current: 30, limit: 100 }]}
        showRemaining={false}
      />
    );
    expect(screen.queryByText('70 remaining')).toBeNull();
  });

  it('renders empty state when bars array is empty', () => {
    render(<UsageDashboard bars={[]} />);
    expect(screen.getByText('No usage data available')).toBeTruthy();
  });

  it('calls onBarPress with correct bar and index', () => {
    const onBarPress = jest.fn();
    render(<UsageDashboard bars={sampleBars} onBarPress={onBarPress} />);

    const buttons = screen.getAllByRole('button');
    fireEvent.press(buttons[1]);

    expect(onBarPress).toHaveBeenCalledTimes(1);
    expect(onBarPress).toHaveBeenCalledWith(sampleBars[1], 1);
  });

  it('does not render pressable when onBarPress is not provided', () => {
    render(<UsageDashboard bars={sampleBars} />);
    expect(screen.queryAllByRole('button')).toHaveLength(0);
  });

  it('renders bar subtitle when provided', () => {
    render(<UsageDashboard bars={sampleBars} />);
    expect(screen.getByText('Resets at midnight')).toBeTruthy();
  });

  it('caps percentage at 100% when current exceeds limit', () => {
    render(
      <UsageDashboard
        bars={[{ label: 'Over', current: 150, limit: 100 }]}
        showPercentage
      />
    );
    expect(screen.getByText('100.0%')).toBeTruthy();
  });
});
