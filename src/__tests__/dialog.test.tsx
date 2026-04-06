import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Dialog } from '../ui/Dialog';

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe('Dialog', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    children: <Text>Dialog content</Text>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children when open', () => {
    render(<Dialog {...defaultProps} />);
    act(() => {
      jest.runAllTimers();
    });
    expect(screen.getByText('Dialog content')).toBeTruthy();
  });

  it('renders close button by default when onClose is provided', () => {
    render(<Dialog {...defaultProps} />);
    act(() => {
      jest.runAllTimers();
    });
    const closeButton = screen.getByLabelText('Close dialog');
    expect(closeButton).toBeTruthy();
  });

  it('calls onClose when close button is pressed', () => {
    const onClose = jest.fn();
    render(
      <Dialog isOpen={true} onClose={onClose}>
        <Text>Content</Text>
      </Dialog>
    );
    act(() => {
      jest.runAllTimers();
    });
    fireEvent.press(screen.getByLabelText('Close dialog'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('hides close button when showCloseButton is false', () => {
    render(<Dialog {...defaultProps} showCloseButton={false} />);
    act(() => {
      jest.runAllTimers();
    });
    expect(screen.queryByLabelText('Close dialog')).toBeNull();
  });

  it('renders with different sizes without crashing', () => {
    const sizes = ['sm', 'md', 'lg', 'xl', 'full'] as const;

    sizes.forEach(size => {
      const { unmount } = render(
        <Dialog {...defaultProps} size={size}>
          <Text>{size}</Text>
        </Dialog>
      );
      act(() => {
        jest.runAllTimers();
      });
      expect(screen.getByText(size)).toBeTruthy();
      unmount();
    });
  });

  it('does not render close button when onClose is not provided', () => {
    render(
      <Dialog isOpen={true}>
        <Text>No close</Text>
      </Dialog>
    );
    act(() => {
      jest.runAllTimers();
    });
    expect(screen.queryByLabelText('Close dialog')).toBeNull();
  });

  it('renders without close button when showCloseButton is false', () => {
    render(
      <Dialog {...defaultProps} showCloseButton={false}>
        <Text>No X button</Text>
      </Dialog>
    );
    act(() => {
      jest.runAllTimers();
    });
    expect(screen.getByText('No X button')).toBeTruthy();
    expect(screen.queryByLabelText('Close dialog')).toBeNull();
  });
});
