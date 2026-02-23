import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react-native';
import { Text, Pressable } from 'react-native';
import { Toast, ToastProvider, useToast } from '../ui/Toast';
import type { ToastMessage } from '../ui/Toast';

describe('Toast', () => {
  const baseToast: ToastMessage = {
    id: 'test-1',
    title: 'Test Toast',
    description: 'This is a test toast',
    variant: 'default',
  };

  it('renders title', () => {
    render(<Toast toast={baseToast} onRemove={jest.fn()} />);
    expect(screen.getByText('Test Toast')).toBeTruthy();
  });

  it('renders description', () => {
    render(<Toast toast={baseToast} onRemove={jest.fn()} />);
    expect(screen.getByText('This is a test toast')).toBeTruthy();
  });

  it('renders close button', () => {
    render(<Toast toast={baseToast} onRemove={jest.fn()} />);
    const closeButton = screen.getByLabelText('Close notification');
    expect(closeButton).toBeTruthy();
  });

  it('calls onRemove when close button is pressed', () => {
    const onRemove = jest.fn();
    render(<Toast toast={baseToast} onRemove={onRemove} />);
    fireEvent.press(screen.getByLabelText('Close notification'));
    expect(onRemove).toHaveBeenCalledWith('test-1');
  });

  it('renders action button when action is provided', () => {
    const onAction = jest.fn();
    const toastWithAction: ToastMessage = {
      ...baseToast,
      action: { label: 'Undo', onPress: onAction },
    };
    render(<Toast toast={toastWithAction} onRemove={jest.fn()} />);
    expect(screen.getByText('Undo')).toBeTruthy();
    fireEvent.press(screen.getByText('Undo'));
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('renders with different variants without crashing', () => {
    const variants = [
      'default',
      'success',
      'error',
      'warning',
      'info',
    ] as const;

    variants.forEach(variant => {
      const toast: ToastMessage = { ...baseToast, variant, id: variant };
      const { unmount } = render(<Toast toast={toast} onRemove={jest.fn()} />);
      expect(screen.getByText('Test Toast')).toBeTruthy();
      unmount();
    });
  });

  it('renders toast without title', () => {
    const toast: ToastMessage = {
      id: 'no-title',
      description: 'Description only',
    };
    render(<Toast toast={toast} onRemove={jest.fn()} />);
    expect(screen.getByText('Description only')).toBeTruthy();
  });

  it('renders toast without description', () => {
    const toast: ToastMessage = {
      id: 'no-desc',
      title: 'Title only',
    };
    render(<Toast toast={toast} onRemove={jest.fn()} />);
    expect(screen.getByText('Title only')).toBeTruthy();
  });
});

describe('ToastProvider', () => {
  it('renders children', () => {
    render(
      <ToastProvider>
        <Text>App content</Text>
      </ToastProvider>
    );
    expect(screen.getByText('App content')).toBeTruthy();
  });
});

describe('useToast', () => {
  it('throws when used outside ToastProvider', () => {
    // Suppress console.error for this test since we expect an error
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const BadComponent = () => {
      useToast();
      return null;
    };

    expect(() => render(<BadComponent />)).toThrow(
      'useToast must be used within ToastProvider'
    );

    consoleSpy.mockRestore();
  });

  it('addToast adds a toast that renders', () => {
    const TestComponent = () => {
      const { addToast } = useToast();
      return (
        <Pressable
          testID='add-toast'
          onPress={() =>
            addToast({
              title: 'New Toast',
              description: 'Toast was added',
              variant: 'success',
            })
          }
        >
          <Text>Add Toast</Text>
        </Pressable>
      );
    };

    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    act(() => {
      fireEvent.press(screen.getByTestId('add-toast'));
    });

    expect(screen.getByText('New Toast')).toBeTruthy();
    expect(screen.getByText('Toast was added')).toBeTruthy();
  });

  it('removeToast removes a toast', () => {
    let toastContext: ReturnType<typeof useToast>;

    const TestComponent = () => {
      toastContext = useToast();
      return <Text>Test</Text>;
    };

    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    // Add a toast first
    act(() => {
      toastContext.addToast({
        title: 'Removable Toast',
        variant: 'info',
      });
    });

    expect(screen.getByText('Removable Toast')).toBeTruthy();

    // Now remove it
    act(() => {
      const toastId = toastContext.toasts[0].id;
      toastContext.removeToast(toastId);
    });

    expect(screen.queryByText('Removable Toast')).toBeNull();
  });
});
