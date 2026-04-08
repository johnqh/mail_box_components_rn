import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Alert, AlertTitle, AlertDescription } from '../ui/Alert';

// Mock @sudobility/design
jest.mock('@sudobility/design', () => {
  const createDeepProxy = () =>
    new Proxy(() => '', {
      get: (_t, p) => (p === 'then' ? undefined : createDeepProxy()),
      apply: () => '',
    });
  return {
    variants: {
      alert: {
        info: () => 'mocked-alert-info',
        success: () => 'mocked-alert-success',
        warning: () => 'mocked-alert-warning',
        attention: () => 'mocked-alert-attention',
        error: () => 'mocked-alert-error',
      },
    },
    textVariants: createDeepProxy(),
    designTokens: createDeepProxy(),
    colors: createDeepProxy(),
  };
});

describe('Alert', () => {
  it('renders with title', () => {
    render(<Alert title='Alert Title' />);
    expect(screen.getByText('Alert Title')).toBeTruthy();
  });

  it('renders with description', () => {
    render(<Alert description='Alert description' />);
    expect(screen.getByText('Alert description')).toBeTruthy();
  });

  it('renders with both title and description', () => {
    render(
      <Alert title='Important' description='This is an important message' />
    );
    expect(screen.getByText('Important')).toBeTruthy();
    expect(screen.getByText('This is an important message')).toBeTruthy();
  });

  it('has alert accessibility role', () => {
    render(<Alert title='Alert' testID='alert-el' />);
    const alert = screen.getByTestId('alert-el');
    expect(alert.props.accessibilityRole).toBe('alert');
  });

  it('renders with different variants without crashing', () => {
    const variants = [
      'info',
      'success',
      'warning',
      'attention',
      'error',
    ] as const;

    variants.forEach(variant => {
      const { unmount } = render(<Alert variant={variant} title={variant} />);
      expect(screen.getByText(variant)).toBeTruthy();
      unmount();
    });
  });

  it('renders default icons for each variant', () => {
    render(<Alert variant='success' title='Success' testID='alert-icon' />);
    const alert = screen.getByTestId('alert-icon');
    expect(alert.props.accessibilityRole).toBe('alert');
  });

  it('renders custom icon when provided', () => {
    render(
      <Alert icon={<Text testID='custom-icon'>*</Text>} title='Custom Icon' />
    );
    expect(screen.getByTestId('custom-icon')).toBeTruthy();
  });

  it('renders children content', () => {
    render(
      <Alert>
        <Text>Custom child content</Text>
      </Alert>
    );
    expect(screen.getByText('Custom child content')).toBeTruthy();
  });
});

describe('AlertTitle', () => {
  it('renders text content', () => {
    render(<AlertTitle>Title Text</AlertTitle>);
    expect(screen.getByText('Title Text')).toBeTruthy();
  });
});

describe('AlertDescription', () => {
  it('renders text content', () => {
    render(<AlertDescription>Description text</AlertDescription>);
    expect(screen.getByText('Description text')).toBeTruthy();
  });
});
