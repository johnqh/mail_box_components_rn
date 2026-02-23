import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Badge } from '../ui/Badge';

describe('Badge', () => {
  it('renders children text', () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText('Active')).toBeTruthy();
  });

  it('renders with different variants without crashing', () => {
    const variants = [
      'default',
      'primary',
      'success',
      'warning',
      'danger',
      'info',
      'purple',
    ] as const;

    variants.forEach(variant => {
      const { unmount } = render(<Badge variant={variant}>{variant}</Badge>);
      expect(screen.getByText(variant)).toBeTruthy();
      unmount();
    });
  });

  it('renders with different sizes without crashing', () => {
    const sizes = ['sm', 'md', 'lg'] as const;

    sizes.forEach(size => {
      const { unmount } = render(<Badge size={size}>Size {size}</Badge>);
      expect(screen.getByText(`Size ${size}`)).toBeTruthy();
      unmount();
    });
  });

  it('renders an icon when provided', () => {
    render(
      <Badge icon={<Text testID='badge-icon'>Star</Text>}>Featured</Badge>
    );
    expect(screen.getByTestId('badge-icon')).toBeTruthy();
    expect(screen.getByText('Featured')).toBeTruthy();
  });

  it('renders a dot indicator when dot is true', () => {
    const { toJSON } = render(<Badge dot>Pending</Badge>);
    expect(screen.getByText('Pending')).toBeTruthy();
    // The dot is a View element that gets rendered in the tree
    expect(toJSON()).toBeTruthy();
  });

  it('renders as a pressable when onPress is provided', () => {
    const onPress = jest.fn();
    render(<Badge onPress={onPress}>Clickable</Badge>);
    fireEvent.press(screen.getByRole('button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('does not have button role when onPress is not provided', () => {
    render(<Badge>Static</Badge>);
    expect(screen.queryByRole('button')).toBeNull();
  });

  it('renders dismiss button when dismissible', () => {
    const onDismiss = jest.fn();
    render(
      <Badge dismissible onDismiss={onDismiss}>
        Dismissable
      </Badge>
    );
    const dismissButton = screen.getByLabelText('Dismiss');
    expect(dismissButton).toBeTruthy();
    fireEvent.press(dismissButton);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('does not render dismiss button when not dismissible', () => {
    render(<Badge>Not dismissable</Badge>);
    expect(screen.queryByLabelText('Dismiss')).toBeNull();
  });

  it('displays count', () => {
    render(<Badge count={5}>Items</Badge>);
    expect(screen.getByText('5')).toBeTruthy();
  });

  it('displays maxCount with + when count exceeds it', () => {
    render(
      <Badge count={150} maxCount={99}>
        Items
      </Badge>
    );
    expect(screen.getByText('99+')).toBeTruthy();
  });

  it('displays exact count when within maxCount', () => {
    render(
      <Badge count={50} maxCount={99}>
        Items
      </Badge>
    );
    expect(screen.getByText('50')).toBeTruthy();
  });

  it('renders with outline style without crashing', () => {
    render(
      <Badge variant='primary' outline>
        Outlined
      </Badge>
    );
    expect(screen.getByText('Outlined')).toBeTruthy();
  });

  it('renders with pill shape without crashing', () => {
    render(<Badge pill>Pill</Badge>);
    expect(screen.getByText('Pill')).toBeTruthy();
  });
});
