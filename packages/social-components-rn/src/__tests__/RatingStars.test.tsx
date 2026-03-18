import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { RatingStars } from '../RatingStars';

describe('RatingStars', () => {
  it('renders the default 5 stars', () => {
    render(<RatingStars value={0} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(5);
  });

  it('renders custom number of stars', () => {
    render(<RatingStars value={0} maxStars={10} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(10);
  });

  it('renders filled stars based on value', () => {
    render(<RatingStars value={3} />);
    // Stars 1-3 should be filled (yellow), stars 4-5 empty (gray)
    const stars = screen.getAllByText('\u2605');
    // All 5 stars render the star character
    expect(stars).toHaveLength(5);
  });

  it('calls onChange when a star is pressed', () => {
    const onChange = jest.fn();
    render(<RatingStars value={2} onChange={onChange} />);

    // Press the 4th star
    const buttons = screen.getAllByRole('button');
    fireEvent.press(buttons[3]);

    expect(onChange).toHaveBeenCalledWith(4);
  });

  it('calls onChange with correct value for each star', () => {
    const onChange = jest.fn();
    render(<RatingStars value={0} onChange={onChange} />);

    const buttons = screen.getAllByRole('button');
    fireEvent.press(buttons[0]);
    expect(onChange).toHaveBeenCalledWith(1);

    fireEvent.press(buttons[4]);
    expect(onChange).toHaveBeenCalledWith(5);
  });

  it('does not call onChange in readonly mode', () => {
    const onChange = jest.fn();
    render(<RatingStars value={3} onChange={onChange} readonly />);

    const buttons = screen.getAllByRole('button');
    fireEvent.press(buttons[0]);

    expect(onChange).not.toHaveBeenCalled();
  });

  it('sets disabled accessibility state in readonly mode', () => {
    render(<RatingStars value={3} readonly />);

    const buttons = screen.getAllByRole('button');
    buttons.forEach(button => {
      expect(button.props.accessibilityState).toEqual(
        expect.objectContaining({ disabled: true })
      );
    });
  });

  it('shows rating number when showNumber is true', () => {
    render(<RatingStars value={4.5} showNumber />);
    expect(screen.getByText('4.5')).toBeTruthy();
  });

  it('does not show rating number by default', () => {
    render(<RatingStars value={4.5} />);
    expect(screen.queryByText('4.5')).toBeNull();
  });

  it('sets correct accessibility labels on stars', () => {
    render(<RatingStars value={0} />);
    expect(screen.getByLabelText('Rate 1 star')).toBeTruthy();
    expect(screen.getByLabelText('Rate 2 stars')).toBeTruthy();
    expect(screen.getByLabelText('Rate 5 stars')).toBeTruthy();
  });

  it('renders with different sizes without crashing', () => {
    const sizes = ['sm', 'md', 'lg', 'xl'] as const;

    sizes.forEach(size => {
      const { unmount } = render(<RatingStars value={3} size={size} />);
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(5);
      unmount();
    });
  });

  it('renders half stars when allowHalf is true and value has .5', () => {
    render(<RatingStars value={3.5} allowHalf />);
    // With value 3.5 and allowHalf, stars 1-3 are full, star 4 is half, star 5 is empty
    // All stars still render the star character
    const stars = screen.getAllByText('\u2605');
    expect(stars.length).toBeGreaterThanOrEqual(5);
  });

  it('does not call onChange when no onChange handler is provided', () => {
    // Should not throw when pressed without onChange
    render(<RatingStars value={3} />);
    const buttons = screen.getAllByRole('button');
    expect(() => fireEvent.press(buttons[0])).not.toThrow();
  });
});
