import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/Card';

// Mock @sudobility/design
jest.mock('@sudobility/design', () => ({
  textVariants: {
    heading: { h4: () => 'mocked-heading' },
    body: { sm: () => 'mocked-body' },
  },
  getCardVariantColors: () => 'mocked-card-variant',
}));

describe('Card', () => {
  it('renders children', () => {
    render(
      <Card>
        <Text>Card content</Text>
      </Card>
    );
    expect(screen.getByText('Card content')).toBeTruthy();
  });

  it('renders with different variants without crashing', () => {
    const variants = [
      'default',
      'bordered',
      'elevated',
      'info',
      'success',
      'warning',
      'error',
      'callout',
    ] as const;

    variants.forEach(variant => {
      const { unmount } = render(
        <Card variant={variant}>
          <Text>{variant}</Text>
        </Card>
      );
      expect(screen.getByText(variant)).toBeTruthy();
      unmount();
    });
  });

  it('renders icon for info-type variants', () => {
    render(
      <Card variant='info' icon={<Text testID='card-icon'>Icon</Text>}>
        <Text>Info card</Text>
      </Card>
    );
    expect(screen.getByTestId('card-icon')).toBeTruthy();
    expect(screen.getByText('Info card')).toBeTruthy();
  });

  it('renders close button for info-type variants with onClose', () => {
    const onClose = jest.fn();
    render(
      <Card variant='error' onClose={onClose}>
        <Text>Error card</Text>
      </Card>
    );
    const closeButton = screen.getByLabelText('Close');
    expect(closeButton).toBeTruthy();
    fireEvent.press(closeButton);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not render icon/close layout for non-info variants', () => {
    render(
      <Card variant='elevated'>
        <Text>Plain card</Text>
      </Card>
    );
    expect(screen.queryByLabelText('Close')).toBeNull();
  });
});

describe('CardHeader', () => {
  it('renders title', () => {
    render(<CardHeader title='Card Title' />);
    expect(screen.getByText('Card Title')).toBeTruthy();
  });

  it('renders description', () => {
    render(<CardHeader description='Card description' />);
    expect(screen.getByText('Card description')).toBeTruthy();
  });

  it('renders title and description together', () => {
    render(<CardHeader title='Title' description='Description' />);
    expect(screen.getByText('Title')).toBeTruthy();
    expect(screen.getByText('Description')).toBeTruthy();
  });

  it('renders children alongside title', () => {
    render(
      <CardHeader title='Title'>
        <Text>Extra content</Text>
      </CardHeader>
    );
    expect(screen.getByText('Title')).toBeTruthy();
    expect(screen.getByText('Extra content')).toBeTruthy();
  });
});

describe('CardContent', () => {
  it('renders children', () => {
    render(
      <CardContent>
        <Text>Body content</Text>
      </CardContent>
    );
    expect(screen.getByText('Body content')).toBeTruthy();
  });
});

describe('CardFooter', () => {
  it('renders children', () => {
    render(
      <CardFooter>
        <Text>Footer content</Text>
      </CardFooter>
    );
    expect(screen.getByText('Footer content')).toBeTruthy();
  });
});

describe('Card composition', () => {
  it('renders full card with all sub-components', () => {
    render(
      <Card variant='elevated'>
        <CardHeader title='My Card' description='A description' />
        <CardContent>
          <Text>Main body</Text>
        </CardContent>
        <CardFooter>
          <Text>Action area</Text>
        </CardFooter>
      </Card>
    );
    expect(screen.getByText('My Card')).toBeTruthy();
    expect(screen.getByText('A description')).toBeTruthy();
    expect(screen.getByText('Main body')).toBeTruthy();
    expect(screen.getByText('Action area')).toBeTruthy();
  });
});
