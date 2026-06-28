import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import {
  SubscriptionLayout,
  SubscriptionDivider,
  SubscriptionFooter,
} from '../SubscriptionLayout';

describe('SubscriptionLayout', () => {
  it('renders title and children', () => {
    render(
      <SubscriptionLayout title='Choose a Plan'>
        <Text>Child content</Text>
      </SubscriptionLayout>
    );

    expect(screen.getByText('Choose a Plan')).toBeTruthy();
    expect(screen.getByText('Child content')).toBeTruthy();
  });

  it('displays error message when error prop is provided', () => {
    render(
      <SubscriptionLayout title='Plans' error='Something went wrong'>
        <Text>Content</Text>
      </SubscriptionLayout>
    );

    expect(screen.getByText('Something went wrong')).toBeTruthy();
  });

  it('does not display error section when error is null', () => {
    render(
      <SubscriptionLayout title='Plans' error={null}>
        <Text>Content</Text>
      </SubscriptionLayout>
    );

    expect(screen.queryByText('Something went wrong')).toBeNull();
  });

  it('renders primary and secondary action buttons in selection variant', () => {
    const onPrimary = jest.fn();
    const onSecondary = jest.fn();
    render(
      <SubscriptionLayout
        title='Plans'
        variant='selection'
        primaryAction={{ label: 'Subscribe Now', onPress: onPrimary }}
        secondaryAction={{ label: 'Restore', onPress: onSecondary }}
      >
        <Text>Content</Text>
      </SubscriptionLayout>
    );

    expect(screen.getByText('Subscribe Now')).toBeTruthy();
    expect(screen.getByText('Restore')).toBeTruthy();

    fireEvent.press(screen.getByText('Subscribe Now'));
    expect(onPrimary).toHaveBeenCalledTimes(1);

    fireEvent.press(screen.getByText('Restore'));
    expect(onSecondary).toHaveBeenCalledTimes(1);
  });

  it('does not render action buttons in cta variant', () => {
    const onPrimary = jest.fn();
    render(
      <SubscriptionLayout
        title='Plans'
        variant='cta'
        primaryAction={{ label: 'Subscribe Now', onPress: onPrimary }}
      >
        <Text>Content</Text>
      </SubscriptionLayout>
    );

    expect(screen.queryByText('Subscribe Now')).toBeNull();
  });

  it('renders active subscription status', () => {
    render(
      <SubscriptionLayout
        title='Plans'
        currentStatus={{
          isActive: true,
          activeContent: {
            title: 'Pro Subscription',
            fields: [
              { label: 'Plan', value: 'Pro' },
              { label: 'Expires', value: 'Jan 1, 2027' },
            ],
          },
        }}
      >
        <Text>Content</Text>
      </SubscriptionLayout>
    );

    expect(screen.getByText('Pro Subscription')).toBeTruthy();
    expect(screen.getByText('Plan')).toBeTruthy();
    expect(screen.getByText('Pro')).toBeTruthy();
    expect(screen.getByText('Expires')).toBeTruthy();
    expect(screen.getByText('Jan 1, 2027')).toBeTruthy();
  });

  it('renders inactive subscription status', () => {
    render(
      <SubscriptionLayout
        title='Plans'
        currentStatus={{
          isActive: false,
          inactiveContent: {
            title: 'No Subscription',
            message: 'Subscribe to unlock features',
          },
        }}
      >
        <Text>Content</Text>
      </SubscriptionLayout>
    );

    expect(screen.getByText('No Subscription')).toBeTruthy();
    expect(screen.getByText('Subscribe to unlock features')).toBeTruthy();
  });

  it('renders custom currentStatusLabel', () => {
    render(
      <SubscriptionLayout
        title='Plans'
        currentStatus={{ isActive: false }}
        currentStatusLabel='Your Status'
      >
        <Text>Content</Text>
      </SubscriptionLayout>
    );

    expect(screen.getByText('Your Status')).toBeTruthy();
  });

  it('renders free tile in cta variant when freeTileConfig is provided', () => {
    render(
      <SubscriptionLayout
        title='Plans'
        variant='cta'
        freeTileConfig={{
          title: 'Free',
          price: '$0',
          features: ['Basic access'],
          ctaButton: { label: 'Get Started', onPress: jest.fn() },
        }}
      >
        <Text>Paid tiles</Text>
      </SubscriptionLayout>
    );

    expect(screen.getByText('Free')).toBeTruthy();
    expect(screen.getByText('$0')).toBeTruthy();
    expect(screen.getByText('Basic access')).toBeTruthy();
    expect(screen.getByText('Get Started')).toBeTruthy();
  });

  it('does not render free tile in selection variant', () => {
    render(
      <SubscriptionLayout
        title='Plans'
        variant='selection'
        freeTileConfig={{
          title: 'Free',
          price: '$0',
          features: ['Basic access'],
          ctaButton: { label: 'Get Started', onPress: jest.fn() },
        }}
      >
        <Text>Paid tiles</Text>
      </SubscriptionLayout>
    );

    // The free tile title won't appear since it's selection variant
    // However "Plans" title uses Text, so check for the free-specific price
    expect(screen.queryByText('$0')).toBeNull();
  });

  it('renders header and footer content', () => {
    render(
      <SubscriptionLayout
        title='Plans'
        headerContent={<Text>Header info</Text>}
        footerContent={<Text>Footer info</Text>}
      >
        <Text>Content</Text>
      </SubscriptionLayout>
    );

    expect(screen.getByText('Header info')).toBeTruthy();
    expect(screen.getByText('Footer info')).toBeTruthy();
  });

  it('renders aboveProducts content', () => {
    render(
      <SubscriptionLayout
        title='Plans'
        aboveProducts={<Text>Billing period selector</Text>}
      >
        <Text>Content</Text>
      </SubscriptionLayout>
    );

    expect(screen.getByText('Billing period selector')).toBeTruthy();
  });

  it('calls onTrack when primary action is pressed', () => {
    const onTrack = jest.fn();
    render(
      <SubscriptionLayout
        title='Plans'
        variant='selection'
        primaryAction={{ label: 'Go', onPress: jest.fn() }}
        onTrack={onTrack}
        trackingLabel='sub_layout'
      >
        <Text>Content</Text>
      </SubscriptionLayout>
    );

    fireEvent.press(screen.getByText('Go'));
    expect(onTrack).toHaveBeenCalledWith({
      action: 'primary_action',
      trackingLabel: 'sub_layout',
      componentName: 'SubscriptionLayout',
    });
  });
});

describe('SubscriptionDivider', () => {
  it('renders without label (simple divider)', () => {
    const { toJSON } = render(<SubscriptionDivider />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders with label text', () => {
    render(<SubscriptionDivider label='or' />);
    expect(screen.getByText('or')).toBeTruthy();
  });
});

describe('SubscriptionFooter', () => {
  it('renders default link text', () => {
    render(
      <SubscriptionFooter
        onRestore={jest.fn()}
        onTermsPress={jest.fn()}
        onPrivacyPress={jest.fn()}
      />
    );

    expect(screen.getByText('Restore Purchases')).toBeTruthy();
    expect(screen.getByText('Terms of Service')).toBeTruthy();
    expect(screen.getByText('Privacy Policy')).toBeTruthy();
  });

  it('renders custom link text', () => {
    render(
      <SubscriptionFooter
        restoreText='Restaurer'
        termsText='Conditions'
        privacyText='Confidentialite'
        onRestore={jest.fn()}
        onTermsPress={jest.fn()}
        onPrivacyPress={jest.fn()}
      />
    );

    expect(screen.getByText('Restaurer')).toBeTruthy();
    expect(screen.getByText('Conditions')).toBeTruthy();
    expect(screen.getByText('Confidentialite')).toBeTruthy();
  });

  it('calls onRestore when restore is pressed', () => {
    const onRestore = jest.fn();
    render(<SubscriptionFooter onRestore={onRestore} />);

    fireEvent.press(screen.getByText('Restore Purchases'));
    expect(onRestore).toHaveBeenCalledTimes(1);
  });

  it('does not render restore link when onRestore is not provided', () => {
    render(<SubscriptionFooter />);
    expect(screen.queryByText('Restore Purchases')).toBeNull();
  });

  it('renders disclaimer text', () => {
    render(<SubscriptionFooter />);
    expect(
      screen.getByText(/Subscriptions will automatically renew/)
    ).toBeTruthy();
  });

  it('calls onTermsPress and onPrivacyPress', () => {
    const onTerms = jest.fn();
    const onPrivacy = jest.fn();
    render(
      <SubscriptionFooter onTermsPress={onTerms} onPrivacyPress={onPrivacy} />
    );

    fireEvent.press(screen.getByText('Terms of Service'));
    expect(onTerms).toHaveBeenCalledTimes(1);

    fireEvent.press(screen.getByText('Privacy Policy'));
    expect(onPrivacy).toHaveBeenCalledTimes(1);
  });
});
