import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Button } from '../ui/Button';

// Mock @sudobility/design
jest.mock('@sudobility/design', () => ({
  variants: {
    button: new Proxy(
      {},
      {
        get: () =>
          new Proxy(() => 'mocked-class', {
            get: () => () => 'mocked-class',
          }),
      }
    ),
  },
}));

describe('Button', () => {
  it('renders with string children', () => {
    render(<Button>Press me</Button>);
    expect(screen.getByText('Press me')).toBeTruthy();
  });

  it('renders with custom children (non-string)', () => {
    render(
      <Button>
        <Text testID='custom-child'>Custom</Text>
      </Button>
    );
    expect(screen.getByTestId('custom-child')).toBeTruthy();
  });

  it('has button accessibility role', () => {
    render(<Button>Click</Button>);
    expect(screen.getByRole('button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    render(<Button onPress={onPress}>Click</Button>);
    fireEvent.press(screen.getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPress = jest.fn();
    render(
      <Button onPress={onPress} disabled>
        Click
      </Button>
    );
    fireEvent.press(screen.getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('shows spinner when loading', () => {
    render(<Button loading>Loading</Button>);
    // ActivityIndicator is rendered when loading is true
    // The button should also be disabled
    const button = screen.getByRole('button');
    expect(button.props.accessibilityState).toEqual({ disabled: true });
  });

  it('applies accessibility label', () => {
    render(<Button accessibilityLabel='Submit form'>Submit</Button>);
    const button = screen.getByRole('button');
    expect(button.props.accessibilityLabel).toBe('Submit form');
  });

  it('sets disabled accessibility state when disabled', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole('button');
    expect(button.props.accessibilityState).toEqual({ disabled: true });
  });

  it('renders with different variants without crashing', () => {
    const variants = [
      'default',
      'primary',
      'secondary',
      'outline',
      'ghost',
      'destructive',
      'success',
      'link',
    ] as const;

    variants.forEach(variant => {
      const { unmount } = render(<Button variant={variant}>{variant}</Button>);
      expect(screen.getByText(variant)).toBeTruthy();
      unmount();
    });
  });

  it('renders with different sizes without crashing', () => {
    const sizes = ['default', 'sm', 'lg', 'icon'] as const;

    sizes.forEach(size => {
      const { unmount } = render(<Button size={size}>{`Size ${size}`}</Button>);
      expect(screen.getByText(`Size ${size}`)).toBeTruthy();
      unmount();
    });
  });
});
