import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react-native';
import { Text, Pressable } from 'react-native';
import {
  SubscriptionProvider,
  useSubscriptionContext,
} from '../SubscriptionProvider';

// Helper component that exposes context values for testing
function TestConsumer() {
  const ctx = useSubscriptionContext();
  return (
    <>
      <Text testID="loading">{ctx.isLoading ? 'true' : 'false'}</Text>
      <Text testID="error">{ctx.error ?? 'none'}</Text>
      <Text testID="subscription">
        {ctx.currentSubscription ? 'active' : 'none'}
      </Text>
      <Pressable
        testID="initialize"
        onPress={() => {
          ctx.initialize();
        }}
      />
      <Pressable
        testID="purchase"
        onPress={() => {
          ctx.purchase('test_product');
        }}
      />
      <Pressable
        testID="restore"
        onPress={() => {
          ctx.restore();
        }}
      />
      <Pressable testID="clearError" onPress={() => ctx.clearError()} />
    </>
  );
}

describe('SubscriptionProvider', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('throws when useSubscriptionContext is used outside provider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<TestConsumer />)).toThrow(
      'useSubscriptionContext must be used within a SubscriptionProvider'
    );
    spy.mockRestore();
  });

  it('provides initial state with no loading, no error, no subscription', () => {
    render(
      <SubscriptionProvider apiKey="test_key">
        <TestConsumer />
      </SubscriptionProvider>
    );

    expect(screen.getByTestId('loading').props.children).toBe('false');
    expect(screen.getByTestId('error').props.children).toBe('none');
    expect(screen.getByTestId('subscription').props.children).toBe('none');
  });

  it('initializes in development mode (no real API key)', async () => {
    const onError = jest.fn();
    render(
      <SubscriptionProvider apiKey="" onError={onError}>
        <TestConsumer />
      </SubscriptionProvider>
    );

    await act(async () => {
      fireEvent.press(screen.getByTestId('initialize'));
    });

    expect(screen.getByTestId('loading').props.children).toBe('false');
    expect(screen.getByTestId('error').props.children).toBe('none');
    expect(onError).not.toHaveBeenCalled();
  });

  it('purchase flow sets active subscription in dev mode', async () => {
    const onPurchaseSuccess = jest.fn();
    render(
      <SubscriptionProvider apiKey="" onPurchaseSuccess={onPurchaseSuccess}>
        <TestConsumer />
      </SubscriptionProvider>
    );

    // Start purchase
    await act(async () => {
      fireEvent.press(screen.getByTestId('purchase'));
    });

    // Advance past the 2000ms simulated delay
    await act(async () => {
      jest.advanceTimersByTime(2100);
    });

    expect(screen.getByTestId('subscription').props.children).toBe('active');
    expect(onPurchaseSuccess).toHaveBeenCalledWith('test_product');
  });

  it('restore flow sets error "No previous purchases found" in dev mode', async () => {
    render(
      <SubscriptionProvider apiKey="">
        <TestConsumer />
      </SubscriptionProvider>
    );

    await act(async () => {
      fireEvent.press(screen.getByTestId('restore'));
    });

    await act(async () => {
      jest.advanceTimersByTime(1100);
    });

    expect(screen.getByTestId('error').props.children).toBe(
      'No previous purchases found'
    );
  });

  it('clearError resets error to null', async () => {
    render(
      <SubscriptionProvider apiKey="">
        <TestConsumer />
      </SubscriptionProvider>
    );

    // Trigger restore to get an error
    await act(async () => {
      fireEvent.press(screen.getByTestId('restore'));
    });
    await act(async () => {
      jest.advanceTimersByTime(1100);
    });

    expect(screen.getByTestId('error').props.children).toBe(
      'No previous purchases found'
    );

    // Clear it
    await act(async () => {
      fireEvent.press(screen.getByTestId('clearError'));
    });

    expect(screen.getByTestId('error').props.children).toBe('none');
  });

  it('initialize only runs once (idempotent)', async () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    render(
      <SubscriptionProvider apiKey="">
        <TestConsumer />
      </SubscriptionProvider>
    );

    await act(async () => {
      fireEvent.press(screen.getByTestId('initialize'));
    });

    warn.mockClear();

    // Second call should be a no-op (isInitialized is true)
    await act(async () => {
      fireEvent.press(screen.getByTestId('initialize'));
    });

    // The warning should not fire again because initialize returns early
    expect(warn).not.toHaveBeenCalled();
    warn.mockRestore();
  });
});
