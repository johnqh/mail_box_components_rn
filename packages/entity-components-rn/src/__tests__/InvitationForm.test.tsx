import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react-native';
import { InvitationForm } from '../InvitationForm';

describe('InvitationForm', () => {
  it('renders email input and submit button', () => {
    render(<InvitationForm onSubmit={jest.fn()} />);
    expect(screen.getByLabelText('Email address input')).toBeTruthy();
    expect(screen.getByText('Send Invitation')).toBeTruthy();
  });

  it('renders custom placeholder text', () => {
    render(
      <InvitationForm onSubmit={jest.fn()} placeholder='user@example.com' />
    );
    expect(screen.getByPlaceholderText('user@example.com')).toBeTruthy();
  });

  it('renders custom submit label', () => {
    render(<InvitationForm onSubmit={jest.fn()} submitLabel='Invite' />);
    expect(screen.getByText('Invite')).toBeTruthy();
  });

  it('disables submit button when email is empty', () => {
    render(<InvitationForm onSubmit={jest.fn()} />);
    const button = screen.getByLabelText('Send Invitation');
    expect(button.props.accessibilityState).toEqual(
      expect.objectContaining({ disabled: true })
    );
  });

  it('shows error for invalid email on submit', async () => {
    render(<InvitationForm onSubmit={jest.fn()} />);
    fireEvent.changeText(
      screen.getByLabelText('Email address input'),
      'notanemail'
    );
    fireEvent.press(screen.getByLabelText('Send Invitation'));
    await waitFor(() => {
      expect(
        screen.getByText('Please enter a valid email address')
      ).toBeTruthy();
    });
  });

  it('clears error when user types after validation failure', async () => {
    render(<InvitationForm onSubmit={jest.fn()} />);
    // Type invalid email and submit to trigger error
    fireEvent.changeText(
      screen.getByLabelText('Email address input'),
      'notanemail'
    );
    fireEvent.press(screen.getByLabelText('Send Invitation'));
    await waitFor(() => {
      expect(
        screen.getByText('Please enter a valid email address')
      ).toBeTruthy();
    });
    // Type something new to clear error
    fireEvent.changeText(
      screen.getByLabelText('Email address input'),
      'new-text'
    );
    expect(screen.queryByText('Please enter a valid email address')).toBeNull();
  });

  it('calls onSubmit with email and default role on valid submission', async () => {
    const onSubmit = jest.fn();
    render(<InvitationForm onSubmit={onSubmit} />);
    fireEvent.changeText(
      screen.getByLabelText('Email address input'),
      'test@example.com'
    );
    fireEvent.press(screen.getByLabelText('Send Invitation'));
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith('test@example.com', 'member');
    });
  });

  it('uses defaultRole when specified', async () => {
    const onSubmit = jest.fn();
    render(<InvitationForm onSubmit={onSubmit} defaultRole='viewer' />);
    fireEvent.changeText(
      screen.getByLabelText('Email address input'),
      'test@example.com'
    );
    fireEvent.press(screen.getByLabelText('Send Invitation'));
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith('test@example.com', 'viewer');
    });
  });

  it('clears form after successful submission', async () => {
    const onSubmit = jest.fn().mockResolvedValue(undefined);
    render(<InvitationForm onSubmit={onSubmit} />);
    const input = screen.getByLabelText('Email address input');
    fireEvent.changeText(input, 'test@example.com');
    fireEvent.press(screen.getByLabelText('Send Invitation'));
    await waitFor(() => {
      expect(input.props.value).toBe('');
    });
  });

  it('shows error message when onSubmit throws', async () => {
    const onSubmit = jest.fn().mockRejectedValue(new Error('Network error'));
    render(<InvitationForm onSubmit={onSubmit} />);
    fireEvent.changeText(
      screen.getByLabelText('Email address input'),
      'test@example.com'
    );
    fireEvent.press(screen.getByLabelText('Send Invitation'));
    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeTruthy();
    });
  });

  it('shows generic error when onSubmit throws non-Error', async () => {
    const onSubmit = jest.fn().mockRejectedValue('unknown');
    render(<InvitationForm onSubmit={onSubmit} />);
    fireEvent.changeText(
      screen.getByLabelText('Email address input'),
      'test@example.com'
    );
    fireEvent.press(screen.getByLabelText('Send Invitation'));
    await waitFor(() => {
      expect(screen.getByText('Failed to send invitation')).toBeTruthy();
    });
  });

  it('trims email before submitting', async () => {
    const onSubmit = jest.fn();
    render(<InvitationForm onSubmit={onSubmit} />);
    fireEvent.changeText(
      screen.getByLabelText('Email address input'),
      '  test@example.com  '
    );
    fireEvent.press(screen.getByLabelText('Send Invitation'));
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith('test@example.com', 'member');
    });
  });

  it('renders help text', () => {
    render(<InvitationForm onSubmit={jest.fn()} />);
    expect(
      screen.getByText(
        'The invitee will receive an email with instructions to join.'
      )
    ).toBeTruthy();
  });
});
