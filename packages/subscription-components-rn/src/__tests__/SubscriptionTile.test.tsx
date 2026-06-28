import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { SubscriptionTile } from '../SubscriptionTile';

const baseProps = {
  id: 'pro',
  title: 'Pro Plan',
  price: '$9.99',
  periodLabel: '/month',
  features: ['Unlimited access', 'Priority support'],
  isSelected: false,
  onSelect: jest.fn(),
};

describe('SubscriptionTile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders title, price, period label, and features', () => {
    render(<SubscriptionTile {...baseProps} />);

    expect(screen.getByText('Pro Plan')).toBeTruthy();
    expect(screen.getByText('$9.99')).toBeTruthy();
    expect(screen.getByText('/month')).toBeTruthy();
    expect(screen.getByText('Unlimited access')).toBeTruthy();
    expect(screen.getByText('Priority support')).toBeTruthy();
  });

  it('calls onSelect when pressed in normal mode', () => {
    const onSelect = jest.fn();
    render(<SubscriptionTile {...baseProps} onSelect={onSelect} />);

    fireEvent.press(screen.getByRole('radio'));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });

  it('does not call onSelect when disabled', () => {
    const onSelect = jest.fn();
    render(<SubscriptionTile {...baseProps} onSelect={onSelect} disabled />);

    fireEvent.press(screen.getByRole('radio'));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('does not call onSelect when not enabled', () => {
    const onSelect = jest.fn();
    render(
      <SubscriptionTile {...baseProps} onSelect={onSelect} enabled={false} />
    );

    fireEvent.press(screen.getByRole('radio'));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('renders with radio accessibility role in selection mode', () => {
    render(<SubscriptionTile {...baseProps} />);
    expect(screen.getByRole('radio')).toBeTruthy();
  });

  it('sets checked state matching isSelected', () => {
    const { rerender } = render(
      <SubscriptionTile {...baseProps} isSelected={false} />
    );
    expect(screen.getByRole('radio').props.accessibilityState.checked).toBe(
      false
    );

    rerender(<SubscriptionTile {...baseProps} isSelected={true} />);
    expect(screen.getByRole('radio').props.accessibilityState.checked).toBe(
      true
    );
  });

  it('renders top badge when provided', () => {
    render(
      <SubscriptionTile
        {...baseProps}
        topBadge={{ text: 'Most Popular', color: 'purple' }}
      />
    );

    expect(screen.getByText('Most Popular')).toBeTruthy();
  });

  it('renders discount badge when provided', () => {
    render(
      <SubscriptionTile {...baseProps} discountBadge={{ text: 'Save 40%' }} />
    );

    expect(screen.getByText('Save 40%')).toBeTruthy();
  });

  it('renders bottom note when provided', () => {
    render(
      <SubscriptionTile {...baseProps} bottomNote='Renews on Jan 1, 2027' />
    );

    expect(screen.getByText('Renews on Jan 1, 2027')).toBeTruthy();
  });

  it('renders intro price note when provided', () => {
    render(
      <SubscriptionTile {...baseProps} introPriceNote='First month free!' />
    );

    expect(screen.getByText('First month free!')).toBeTruthy();
  });

  it('renders premium callout with title and features', () => {
    render(
      <SubscriptionTile
        {...baseProps}
        premiumCallout={{
          title: 'Premium Features',
          features: ['AI Assistant', 'Analytics'],
        }}
      />
    );

    expect(screen.getByText('Premium Features')).toBeTruthy();
    expect(screen.getByText(/AI Assistant/)).toBeTruthy();
    expect(screen.getByText(/Analytics/)).toBeTruthy();
  });

  it('renders CTA button in cta mode with summary role', () => {
    const onCtaPress = jest.fn();
    render(
      <SubscriptionTile
        {...baseProps}
        ctaButton={{ label: 'Subscribe Now', onPress: onCtaPress }}
      />
    );

    // In CTA mode, role should be 'summary' not 'radio'
    expect(screen.getByRole('summary')).toBeTruthy();
    expect(screen.getByText('Subscribe Now')).toBeTruthy();
  });

  it('calls CTA onPress when CTA button is pressed', () => {
    const onCtaPress = jest.fn();
    render(
      <SubscriptionTile
        {...baseProps}
        ctaButton={{ label: 'Subscribe Now', onPress: onCtaPress }}
      />
    );

    fireEvent.press(screen.getByText('Subscribe Now'));
    expect(onCtaPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onSelect when in CTA mode (tile press is disabled)', () => {
    const onSelect = jest.fn();
    render(
      <SubscriptionTile
        {...baseProps}
        onSelect={onSelect}
        ctaButton={{ label: 'Buy', onPress: jest.fn() }}
      />
    );

    fireEvent.press(screen.getByRole('summary'));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('calls onTrack with select action when tile is pressed', () => {
    const onTrack = jest.fn();
    const onSelect = jest.fn();
    render(
      <SubscriptionTile
        {...baseProps}
        onSelect={onSelect}
        onTrack={onTrack}
        trackingLabel='pro_plan'
      />
    );

    fireEvent.press(screen.getByRole('radio'));
    expect(onTrack).toHaveBeenCalledWith({
      action: 'select',
      trackingLabel: 'pro_plan',
      componentName: 'SubscriptionTile',
    });
  });

  it('calls onTrack with cta_click action when CTA is pressed', () => {
    const onTrack = jest.fn();
    render(
      <SubscriptionTile
        {...baseProps}
        ctaButton={{ label: 'Buy', onPress: jest.fn() }}
        onTrack={onTrack}
        trackingLabel='pro_cta'
      />
    );

    fireEvent.press(screen.getByText('Buy'));
    expect(onTrack).toHaveBeenCalledWith({
      action: 'cta_click',
      trackingLabel: 'pro_cta',
      componentName: 'SubscriptionTile',
    });
  });

  it('does not show indicator when isCurrentPlan is true', () => {
    const onSelect = jest.fn();
    render(
      <SubscriptionTile {...baseProps} onSelect={onSelect} isCurrentPlan />
    );

    // Should be non-interactive when isCurrentPlan
    fireEvent.press(screen.getByRole('radio'));
    expect(onSelect).not.toHaveBeenCalled();
  });

  it('uses default accessibility label with title, price, and period', () => {
    render(<SubscriptionTile {...baseProps} />);

    const tile = screen.getByRole('radio');
    expect(tile.props.accessibilityLabel).toBe('Pro Plan - $9.99/month');
  });

  it('uses custom accessibility label when provided', () => {
    render(
      <SubscriptionTile
        {...baseProps}
        accessibilityLabel='Pro plan nine ninety nine per month'
      />
    );

    const tile = screen.getByRole('radio');
    expect(tile.props.accessibilityLabel).toBe(
      'Pro plan nine ninety nine per month'
    );
  });
});
