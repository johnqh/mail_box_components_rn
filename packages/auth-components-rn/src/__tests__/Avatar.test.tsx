import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Avatar } from '../Avatar';

// Mock @sudobility/components-rn
jest.mock('@sudobility/components-rn', () => ({
  cn: function () {
    var args = Array.prototype.slice.call(arguments);
    return args.filter(Boolean).join(' ');
  },
}));

function createUser(overrides) {
  return Object.assign(
    {
      uid: 'user-1',
      email: 'john@example.com',
      displayName: 'John Doe',
      photoURL: null,
      isAnonymous: false,
      emailVerified: true,
      providerId: 'password',
    },
    overrides
  );
}

describe('Avatar', () => {
  describe('initials display', () => {
    it('shows two-letter initials from full display name', () => {
      var user = createUser({ displayName: 'John Doe', photoURL: null });
      render(<Avatar user={user} />);

      expect(screen.getByText('JD')).toBeTruthy();
    });

    it('shows first two chars when display name is single word', () => {
      var user = createUser({ displayName: 'Alice', photoURL: null });
      render(<Avatar user={user} />);

      expect(screen.getByText('AL')).toBeTruthy();
    });

    it('uses first and last name initials for multi-word names', () => {
      var user = createUser({
        displayName: 'Mary Jane Watson',
        photoURL: null,
      });
      render(<Avatar user={user} />);

      expect(screen.getByText('MW')).toBeTruthy();
    });

    it('falls back to email initials when no display name', () => {
      var user = createUser({
        displayName: null,
        email: 'alice@example.com',
        photoURL: null,
      });
      render(<Avatar user={user} />);

      expect(screen.getByText('AL')).toBeTruthy();
    });

    it('shows "?" when no name or email', () => {
      var user = createUser({
        displayName: null,
        email: null,
        photoURL: null,
      });
      render(<Avatar user={user} />);

      expect(screen.getByText('?')).toBeTruthy();
    });
  });

  describe('photo display', () => {
    it('renders an Image when photoURL is provided', () => {
      var user = createUser({
        photoURL: 'https://example.com/photo.jpg',
      });
      var result = render(<Avatar user={user} />);
      var tree = JSON.stringify(result.toJSON());

      expect(tree).toContain('https://example.com/photo.jpg');
    });
  });

  describe('size prop', () => {
    it('applies default size of 32', () => {
      var user = createUser({ photoURL: null });
      var result = render(<Avatar user={user} />);
      var tree = JSON.stringify(result.toJSON());

      expect(tree).toContain('"width":32');
      expect(tree).toContain('"height":32');
    });

    it('applies custom size', () => {
      var user = createUser({ photoURL: null });
      var result = render(<Avatar user={user} size={64} />);
      var tree = JSON.stringify(result.toJSON());

      expect(tree).toContain('"width":64');
      expect(tree).toContain('"height":64');
      expect(tree).toContain('"borderRadius":32');
    });

    it('scales font size based on avatar size', () => {
      var user = createUser({ photoURL: null });
      var result = render(<Avatar user={user} size={100} />);
      var tree = JSON.stringify(result.toJSON());

      // fontSize should be size * 0.4 = 40
      expect(tree).toContain('"fontSize":40');
    });
  });

  describe('onPress', () => {
    it('renders as Pressable when onPress is provided', () => {
      var onPress = jest.fn();
      var user = createUser({ photoURL: null });
      render(<Avatar user={user} onPress={onPress} />);

      var button = screen.getByRole('button');
      expect(button).toBeTruthy();
    });

    it('calls onPress when pressed', () => {
      var onPress = jest.fn();
      var user = createUser({ photoURL: null });
      render(<Avatar user={user} onPress={onPress} />);

      fireEvent.press(screen.getByRole('button'));
      expect(onPress).toHaveBeenCalledTimes(1);
    });

    it('renders as View (not Pressable) when onPress is not provided', () => {
      var user = createUser({ photoURL: null });
      render(<Avatar user={user} />);

      expect(screen.queryByRole('button')).toBeNull();
    });
  });

  describe('accessibility', () => {
    it('uses display name for accessibility label on pressable', () => {
      var onPress = jest.fn();
      var user = createUser({ displayName: 'Jane Smith' });
      render(<Avatar user={user} onPress={onPress} />);

      var button = screen.getByRole('button');
      expect(button.props.accessibilityLabel).toBe('Jane Smith');
    });

    it('falls back to "User avatar" when no display name', () => {
      var onPress = jest.fn();
      var user = createUser({ displayName: null });
      render(<Avatar user={user} onPress={onPress} />);

      var button = screen.getByRole('button');
      expect(button.props.accessibilityLabel).toBe('User avatar');
    });
  });
});
