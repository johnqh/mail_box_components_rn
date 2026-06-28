import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { TierComparisonTable } from '../TierComparisonTable';
import { TierDisplayData } from '../types';

jest.mock('@sudobility/components-rn', () => ({
  cn: (...args: unknown[]) => args.filter(Boolean).join(' '),
}));

const sampleTiers: TierDisplayData[] = [
  {
    name: 'Free',
    hourlyLimit: 100,
    dailyLimit: 1000,
    monthlyLimit: 10000,
    price: '$0/mo',
    isCurrent: true,
  },
  {
    name: 'Pro',
    hourlyLimit: 1000,
    dailyLimit: 10000,
    monthlyLimit: 100000,
    price: '$29/mo',
    isRecommended: true,
    description: 'Best for growing teams',
    features: ['Priority support', 'Advanced analytics'],
  },
  {
    name: 'Enterprise',
    hourlyLimit: 10000,
    dailyLimit: 100000,
    monthlyLimit: 1000000,
    price: '$99/mo',
  },
];

describe('TierComparisonTable', () => {
  it('renders tier names', () => {
    render(<TierComparisonTable tiers={sampleTiers} />);
    expect(screen.getByText('Free')).toBeTruthy();
    expect(screen.getByText('Pro')).toBeTruthy();
    expect(screen.getByText('Enterprise')).toBeTruthy();
  });

  it('renders title when provided', () => {
    render(<TierComparisonTable tiers={sampleTiers} title='Choose a Plan' />);
    expect(screen.getByText('Choose a Plan')).toBeTruthy();
  });

  it('shows Current badge on current tier', () => {
    render(<TierComparisonTable tiers={sampleTiers} />);
    expect(screen.getByText('Current')).toBeTruthy();
  });

  it('shows Recommended badge on recommended tier', () => {
    render(<TierComparisonTable tiers={sampleTiers} />);
    expect(screen.getByText('Recommended')).toBeTruthy();
  });

  it('displays formatted limits with K/M suffixes', () => {
    render(<TierComparisonTable tiers={sampleTiers} />);
    // Free tier: 100, 1K, 10K
    expect(screen.getByText('100')).toBeTruthy();
    expect(screen.getAllByText('1K').length).toBeGreaterThan(0);
    expect(screen.getAllByText('10K').length).toBeGreaterThan(0);
    // Enterprise tier: 1M
    expect(screen.getByText('1M')).toBeTruthy();
  });

  it('displays prices when showPrice is true', () => {
    render(<TierComparisonTable tiers={sampleTiers} showPrice />);
    expect(screen.getByText('$0/mo')).toBeTruthy();
    expect(screen.getByText('$29/mo')).toBeTruthy();
    expect(screen.getByText('$99/mo')).toBeTruthy();
  });

  it('hides prices when showPrice is false', () => {
    render(<TierComparisonTable tiers={sampleTiers} showPrice={false} />);
    expect(screen.queryByText('$0/mo')).toBeNull();
    expect(screen.queryByText('$29/mo')).toBeNull();
  });

  it('renders tier description', () => {
    render(<TierComparisonTable tiers={sampleTiers} />);
    expect(screen.getByText('Best for growing teams')).toBeTruthy();
  });

  it('renders tier features', () => {
    render(<TierComparisonTable tiers={sampleTiers} />);
    expect(screen.getByText('Priority support')).toBeTruthy();
    expect(screen.getByText('Advanced analytics')).toBeTruthy();
  });

  it('calls onTierSelect when a non-current tier is pressed', () => {
    const onTierSelect = jest.fn();
    render(
      <TierComparisonTable tiers={sampleTiers} onTierSelect={onTierSelect} />
    );

    // Non-current tiers should have select buttons
    const buttons = screen.getAllByRole('button');
    fireEvent.press(buttons[0]);

    expect(onTierSelect).toHaveBeenCalledTimes(1);
  });

  it('does not render select button for current tier', () => {
    const onTierSelect = jest.fn();
    render(
      <TierComparisonTable tiers={sampleTiers} onTierSelect={onTierSelect} />
    );

    // Current tier (Free) should not have a select button.
    // Non-current tiers (Pro, Enterprise) should have buttons.
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
  });

  it('shows Upgrade Now text for recommended tier', () => {
    const onTierSelect = jest.fn();
    render(
      <TierComparisonTable tiers={sampleTiers} onTierSelect={onTierSelect} />
    );
    expect(screen.getByText('Upgrade Now')).toBeTruthy();
  });

  it('shows Select Plan text for non-recommended, non-current tier', () => {
    const onTierSelect = jest.fn();
    render(
      <TierComparisonTable tiers={sampleTiers} onTierSelect={onTierSelect} />
    );
    expect(screen.getByText('Select Plan')).toBeTruthy();
  });

  it('renders empty state when tiers array is empty', () => {
    render(<TierComparisonTable tiers={[]} />);
    expect(screen.getByText('No tiers available')).toBeTruthy();
  });

  it('passes selected tier data to onTierSelect', () => {
    const onTierSelect = jest.fn();
    render(
      <TierComparisonTable tiers={sampleTiers} onTierSelect={onTierSelect} />
    );

    // Press the Pro tier (recommended) button -- first button
    const buttons = screen.getAllByRole('button');
    fireEvent.press(buttons[0]);

    expect(onTierSelect).toHaveBeenCalledWith(sampleTiers[1]);
  });
});
