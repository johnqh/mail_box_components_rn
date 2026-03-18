import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { EntityCard } from '../EntityCard';
import type { Entity } from '../types';

const baseEntity: Entity = {
  id: '1',
  name: 'Acme Corp',
  description: 'A test organization',
  role: 'admin',
  memberCount: 5,
};

describe('EntityCard', () => {
  it('renders entity name', () => {
    render(<EntityCard entity={baseEntity} />);
    expect(screen.getByText('Acme Corp')).toBeTruthy();
  });

  it('renders avatar initial when no avatarUrl', () => {
    render(<EntityCard entity={baseEntity} />);
    expect(screen.getByText('A')).toBeTruthy();
  });

  it('renders description when showDescription is true', () => {
    render(<EntityCard entity={baseEntity} showDescription />);
    expect(screen.getByText('A test organization')).toBeTruthy();
  });

  it('hides description when showDescription is false', () => {
    render(<EntityCard entity={baseEntity} showDescription={false} />);
    expect(screen.queryByText('A test organization')).toBeNull();
  });

  it('renders role badge when showRole is true and entity has role', () => {
    render(<EntityCard entity={baseEntity} showRole />);
    expect(screen.getByText('Admin')).toBeTruthy();
  });

  it('hides role badge when showRole is false', () => {
    render(<EntityCard entity={baseEntity} showRole={false} />);
    expect(screen.queryByText('Admin')).toBeNull();
  });

  it('renders member count when showMemberCount is true', () => {
    render(<EntityCard entity={baseEntity} showMemberCount />);
    expect(screen.getByText(/5\s+members/)).toBeTruthy();
  });

  it('shows singular "member" for count of 1', () => {
    const entity = { ...baseEntity, memberCount: 1 };
    render(<EntityCard entity={entity} showMemberCount />);
    expect(screen.getByText(/1\s+member$/)).toBeTruthy();
  });

  it('calls onPress with entity when pressed', () => {
    const onPress = jest.fn();
    render(<EntityCard entity={baseEntity} onPress={onPress} />);
    fireEvent.press(screen.getByRole('button'));
    expect(onPress).toHaveBeenCalledWith(baseEntity);
  });

  it('calls onLongPress with entity when long-pressed', () => {
    const onLongPress = jest.fn();
    render(<EntityCard entity={baseEntity} onLongPress={onLongPress} />);
    fireEvent(screen.getByRole('button'), 'longPress');
    expect(onLongPress).toHaveBeenCalledWith(baseEntity);
  });

  it('sets selected accessibility state when selected', () => {
    render(<EntityCard entity={baseEntity} selected onPress={jest.fn()} />);
    const button = screen.getByRole('button');
    expect(button.props.accessibilityState).toEqual(
      expect.objectContaining({ selected: true })
    );
  });

  it('sets accessibility label with entity name', () => {
    render(<EntityCard entity={baseEntity} onPress={jest.fn()} />);
    const button = screen.getByRole('button');
    expect(button.props.accessibilityLabel).toBe('Entity: Acme Corp');
  });

  it('renders chevron when onPress is provided', () => {
    render(<EntityCard entity={baseEntity} onPress={jest.fn()} />);
    expect(screen.getByText('\u203A')).toBeTruthy();
  });

  it('does not render chevron when no onPress', () => {
    render(<EntityCard entity={baseEntity} />);
    expect(screen.queryByText('\u203A')).toBeNull();
  });

  it('renders all role types without crashing', () => {
    const roles = ['owner', 'admin', 'member', 'viewer', 'guest'] as const;
    roles.forEach(role => {
      const entity = { ...baseEntity, role };
      const { unmount } = render(<EntityCard entity={entity} showRole />);
      expect(screen.getByText('Acme Corp')).toBeTruthy();
      unmount();
    });
  });
});
