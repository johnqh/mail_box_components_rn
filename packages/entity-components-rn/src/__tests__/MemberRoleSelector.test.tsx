import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { MemberRoleSelector } from '../MemberRoleSelector';

describe('MemberRoleSelector', () => {
  it('renders the selected role label', () => {
    render(
      <MemberRoleSelector selectedRole='admin' onRoleChange={jest.fn()} />
    );
    expect(screen.getByText('Admin')).toBeTruthy();
  });

  it('renders role description when showDescriptions is true', () => {
    render(
      <MemberRoleSelector
        selectedRole='admin'
        onRoleChange={jest.fn()}
        showDescriptions
      />
    );
    expect(screen.getByText('Can manage members and settings')).toBeTruthy();
  });

  it('has correct accessibility label for trigger', () => {
    render(
      <MemberRoleSelector selectedRole='member' onRoleChange={jest.fn()} />
    );
    const trigger = screen.getByLabelText('Selected role: Member');
    expect(trigger).toBeTruthy();
  });

  it('opens modal when trigger is pressed', () => {
    render(
      <MemberRoleSelector selectedRole='member' onRoleChange={jest.fn()} />
    );
    fireEvent.press(screen.getByLabelText('Selected role: Member'));
    expect(screen.getByText('Select Role')).toBeTruthy();
  });

  it('does not open modal when disabled', () => {
    render(
      <MemberRoleSelector
        selectedRole='member'
        onRoleChange={jest.fn()}
        disabled
      />
    );
    fireEvent.press(screen.getByLabelText('Selected role: Member'));
    expect(screen.queryByText('Select Role')).toBeNull();
  });

  it('shows only available roles in modal', () => {
    render(
      <MemberRoleSelector
        selectedRole='member'
        onRoleChange={jest.fn()}
        availableRoles={['member', 'viewer']}
      />
    );
    fireEvent.press(screen.getByLabelText('Selected role: Member'));
    // Should show member and viewer
    expect(screen.getByLabelText(/^Member:/)).toBeTruthy();
    expect(screen.getByLabelText(/^Viewer:/)).toBeTruthy();
    // Should not show admin, owner, or guest
    expect(screen.queryByLabelText(/^Admin:/)).toBeNull();
    expect(screen.queryByLabelText(/^Owner:/)).toBeNull();
    expect(screen.queryByLabelText(/^Guest:/)).toBeNull();
  });

  it('calls onRoleChange when a role is selected', () => {
    const onRoleChange = jest.fn();
    render(
      <MemberRoleSelector selectedRole='member' onRoleChange={onRoleChange} />
    );
    fireEvent.press(screen.getByLabelText('Selected role: Member'));
    fireEvent.press(screen.getByLabelText(/^Viewer:/));
    expect(onRoleChange).toHaveBeenCalledWith('viewer');
  });

  it('closes modal after selecting a role', () => {
    render(
      <MemberRoleSelector selectedRole='member' onRoleChange={jest.fn()} />
    );
    fireEvent.press(screen.getByLabelText('Selected role: Member'));
    expect(screen.getByText('Select Role')).toBeTruthy();
    fireEvent.press(screen.getByLabelText(/^Viewer:/));
    expect(screen.queryByText('Select Role')).toBeNull();
  });

  it('closes modal when Cancel is pressed', () => {
    render(
      <MemberRoleSelector selectedRole='member' onRoleChange={jest.fn()} />
    );
    fireEvent.press(screen.getByLabelText('Selected role: Member'));
    expect(screen.getByText('Select Role')).toBeTruthy();
    fireEvent.press(screen.getByText('Cancel'));
    expect(screen.queryByText('Select Role')).toBeNull();
  });

  it('shows checkmark next to the currently selected role', () => {
    render(
      <MemberRoleSelector selectedRole='admin' onRoleChange={jest.fn()} />
    );
    fireEvent.press(screen.getByLabelText('Selected role: Admin'));
    // The admin option should have selected state
    const adminOption = screen.getByLabelText(/^Admin:/);
    expect(adminOption.props.accessibilityState).toEqual(
      expect.objectContaining({ selected: true })
    );
  });

  it('defaults availableRoles to admin, member, viewer, guest', () => {
    render(
      <MemberRoleSelector selectedRole='member' onRoleChange={jest.fn()} />
    );
    fireEvent.press(screen.getByLabelText('Selected role: Member'));
    expect(screen.getByLabelText(/^Admin:/)).toBeTruthy();
    expect(screen.getByLabelText(/^Member:/)).toBeTruthy();
    expect(screen.getByLabelText(/^Viewer:/)).toBeTruthy();
    expect(screen.getByLabelText(/^Guest:/)).toBeTruthy();
    expect(screen.queryByLabelText(/^Owner:/)).toBeNull();
  });
});
