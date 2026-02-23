import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Modal, ModalHeader, ModalContent, ModalFooter } from '../ui/Modal';

describe('Modal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    children: <Text>Modal body</Text>,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders children when open', () => {
    render(<Modal {...defaultProps} />);
    expect(screen.getByText('Modal body')).toBeTruthy();
  });

  it('renders title when provided', () => {
    render(<Modal {...defaultProps} title='My Modal' />);
    expect(screen.getByText('My Modal')).toBeTruthy();
  });

  it('renders close button by default', () => {
    render(<Modal {...defaultProps} title='Modal' />);
    const closeButton = screen.getByLabelText('Close modal');
    expect(closeButton).toBeTruthy();
  });

  it('calls onClose when close button is pressed', () => {
    const onClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title='Modal'>
        <Text>Content</Text>
      </Modal>
    );
    fireEvent.press(screen.getByLabelText('Close modal'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('hides close button when showCloseButton is false', () => {
    render(<Modal {...defaultProps} title='Modal' showCloseButton={false} />);
    expect(screen.queryByLabelText('Close modal')).toBeNull();
  });

  it('renders with different sizes without crashing', () => {
    const sizes = ['small', 'medium', 'large', 'fullWidth'] as const;

    sizes.forEach(size => {
      const { unmount } = render(
        <Modal {...defaultProps} size={size}>
          <Text>{size}</Text>
        </Modal>
      );
      expect(screen.getByText(size)).toBeTruthy();
      unmount();
    });
  });

  it('does not show header when no title and showCloseButton is false', () => {
    const { toJSON } = render(
      <Modal {...defaultProps} showCloseButton={false} />
    );
    expect(screen.queryByLabelText('Close modal')).toBeNull();
    expect(toJSON()).toBeTruthy();
  });
});

describe('ModalHeader', () => {
  it('renders children', () => {
    render(
      <ModalHeader>
        <Text>Header content</Text>
      </ModalHeader>
    );
    expect(screen.getByText('Header content')).toBeTruthy();
  });
});

describe('ModalContent', () => {
  it('renders children', () => {
    render(
      <ModalContent>
        <Text>Content area</Text>
      </ModalContent>
    );
    expect(screen.getByText('Content area')).toBeTruthy();
  });
});

describe('ModalFooter', () => {
  it('renders children', () => {
    render(
      <ModalFooter>
        <Text>Footer actions</Text>
      </ModalFooter>
    );
    expect(screen.getByText('Footer actions')).toBeTruthy();
  });
});

describe('Modal composition', () => {
  it('renders with all sub-components', () => {
    render(
      <Modal isOpen={true} onClose={jest.fn()} title='Full Modal'>
        <ModalHeader>
          <Text>Custom Header</Text>
        </ModalHeader>
        <ModalContent>
          <Text>Main content</Text>
        </ModalContent>
        <ModalFooter>
          <Text>Footer</Text>
        </ModalFooter>
      </Modal>
    );
    expect(screen.getByText('Full Modal')).toBeTruthy();
    expect(screen.getByText('Custom Header')).toBeTruthy();
    expect(screen.getByText('Main content')).toBeTruthy();
    expect(screen.getByText('Footer')).toBeTruthy();
  });
});
