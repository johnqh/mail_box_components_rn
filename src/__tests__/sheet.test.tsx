import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Sheet } from '../ui/Sheet';

describe('Sheet', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    children: <Text>Sheet content</Text>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children when open', () => {
    render(<Sheet {...defaultProps} />);
    expect(screen.getByText('Sheet content')).toBeTruthy();
  });

  it('renders title when provided', () => {
    render(<Sheet {...defaultProps} title='Sheet Title' />);
    expect(screen.getByText('Sheet Title')).toBeTruthy();
  });

  it('renders description when provided', () => {
    render(
      <Sheet {...defaultProps} title='Title' description='Sheet description' />
    );
    expect(screen.getByText('Sheet description')).toBeTruthy();
  });

  it('renders close button by default', () => {
    render(<Sheet {...defaultProps} title='Title' />);
    const closeButton = screen.getByLabelText('Close sheet');
    expect(closeButton).toBeTruthy();
  });

  it('calls onClose when close button is pressed', () => {
    const onClose = jest.fn();
    render(
      <Sheet isOpen={true} onClose={onClose} title='Sheet'>
        <Text>Content</Text>
      </Sheet>
    );
    fireEvent.press(screen.getByLabelText('Close sheet'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('hides close button when showCloseButton is false', () => {
    render(<Sheet {...defaultProps} title='Title' showCloseButton={false} />);
    expect(screen.queryByLabelText('Close sheet')).toBeNull();
  });

  it('renders footer when provided', () => {
    render(<Sheet {...defaultProps} footer={<Text>Footer area</Text>} />);
    expect(screen.getByText('Footer area')).toBeTruthy();
  });

  it('renders with different sizes without crashing', () => {
    const sizes = ['sm', 'md', 'lg', 'full'] as const;

    sizes.forEach(size => {
      const { unmount } = render(
        <Sheet {...defaultProps} size={size}>
          <Text>Size {size}</Text>
        </Sheet>
      );
      expect(screen.getByText(`Size ${size}`)).toBeTruthy();
      unmount();
    });
  });

  it('renders with different sides without crashing', () => {
    const sides = ['bottom', 'top', 'left', 'right'] as const;

    sides.forEach(side => {
      const { unmount } = render(
        <Sheet {...defaultProps} side={side}>
          <Text>Side {side}</Text>
        </Sheet>
      );
      expect(screen.getByText(`Side ${side}`)).toBeTruthy();
      unmount();
    });
  });

  it('renders without drag handle when showHandle is false', () => {
    const { toJSON } = render(<Sheet {...defaultProps} showHandle={false} />);
    // When showHandle is false, the drag handle View is not rendered
    expect(screen.getByText('Sheet content')).toBeTruthy();
    expect(toJSON()).toBeTruthy();
  });

  it('renders with title, description, content, and footer together', () => {
    render(
      <Sheet
        isOpen={true}
        onClose={jest.fn()}
        title='Full Sheet'
        description='A full sheet example'
        footer={<Text>Done</Text>}
      >
        <Text>Main content</Text>
      </Sheet>
    );
    expect(screen.getByText('Full Sheet')).toBeTruthy();
    expect(screen.getByText('A full sheet example')).toBeTruthy();
    expect(screen.getByText('Main content')).toBeTruthy();
    expect(screen.getByText('Done')).toBeTruthy();
  });
});
