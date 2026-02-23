import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Input } from '../ui/Input';

// Mock @sudobility/design
jest.mock('@sudobility/design', () => ({
  variants: {
    input: {
      default: () => 'mocked-input-class',
    },
  },
}));

describe('Input', () => {
  it('renders with placeholder', () => {
    render(<Input placeholder='Enter text' />);
    expect(screen.getByPlaceholderText('Enter text')).toBeTruthy();
  });

  it('displays the current value', () => {
    render(<Input value='Hello' />);
    expect(screen.getByDisplayValue('Hello')).toBeTruthy();
  });

  it('calls onChangeText when text changes', () => {
    const onChangeText = jest.fn();
    render(<Input placeholder='Type here' onChangeText={onChangeText} />);
    fireEvent.changeText(screen.getByPlaceholderText('Type here'), 'New text');
    expect(onChangeText).toHaveBeenCalledWith('New text');
  });

  it('is not editable when disabled', () => {
    render(<Input placeholder='Disabled' disabled />);
    const input = screen.getByPlaceholderText('Disabled');
    expect(input.props.editable).toBe(false);
  });

  it('is not editable when editable is false', () => {
    render(<Input placeholder='Read only' editable={false} />);
    const input = screen.getByPlaceholderText('Read only');
    expect(input.props.editable).toBe(false);
  });

  it('sets disabled accessibility state when disabled', () => {
    render(<Input placeholder='Disabled' disabled />);
    const input = screen.getByPlaceholderText('Disabled');
    expect(input.props.accessibilityState).toEqual({ disabled: true });
  });

  it('calls onFocus and onBlur handlers', () => {
    const onFocus = jest.fn();
    const onBlur = jest.fn();
    render(
      <Input placeholder='Focus test' onFocus={onFocus} onBlur={onBlur} />
    );
    const input = screen.getByPlaceholderText('Focus test');
    fireEvent(input, 'focus');
    expect(onFocus).toHaveBeenCalledTimes(1);
    fireEvent(input, 'blur');
    expect(onBlur).toHaveBeenCalledTimes(1);
  });

  it('renders with error state without crashing', () => {
    render(<Input placeholder='Error input' error />);
    expect(screen.getByPlaceholderText('Error input')).toBeTruthy();
  });

  it('passes through TextInput props', () => {
    render(
      <Input
        placeholder='Email'
        keyboardType='email-address'
        autoCapitalize='none'
      />
    );
    const input = screen.getByPlaceholderText('Email');
    expect(input.props.keyboardType).toBe('email-address');
    expect(input.props.autoCapitalize).toBe('none');
  });
});
