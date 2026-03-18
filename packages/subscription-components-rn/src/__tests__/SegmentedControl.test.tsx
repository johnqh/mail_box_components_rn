import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { SegmentedControl, PeriodSelector } from '../SegmentedControl';

const options = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'yearly', label: 'Yearly' },
];

describe('SegmentedControl', () => {
  it('renders all options', () => {
    const onChange = jest.fn();
    render(
      <SegmentedControl options={options} value="monthly" onChange={onChange} />
    );

    expect(screen.getByText('Monthly')).toBeTruthy();
    expect(screen.getByText('Yearly')).toBeTruthy();
  });

  it('marks the selected option with accessibilityState.selected', () => {
    const onChange = jest.fn();
    render(
      <SegmentedControl options={options} value="monthly" onChange={onChange} />
    );

    const tabs = screen.getAllByRole('tab');
    expect(tabs[0].props.accessibilityState.selected).toBe(true);
    expect(tabs[1].props.accessibilityState.selected).toBe(false);
  });

  it('calls onChange when an unselected option is pressed', () => {
    const onChange = jest.fn();
    render(
      <SegmentedControl options={options} value="monthly" onChange={onChange} />
    );

    fireEvent.press(screen.getByText('Yearly'));
    expect(onChange).toHaveBeenCalledWith('yearly');
  });

  it('does not call onChange when the entire control is disabled', () => {
    const onChange = jest.fn();
    render(
      <SegmentedControl
        options={options}
        value="monthly"
        onChange={onChange}
        disabled
      />
    );

    fireEvent.press(screen.getByText('Yearly'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not call onChange when an individual option is disabled', () => {
    const onChange = jest.fn();
    const optionsWithDisabled = [
      { value: 'a', label: 'A' },
      { value: 'b', label: 'B', disabled: true },
    ];
    render(
      <SegmentedControl
        options={optionsWithDisabled}
        value="a"
        onChange={onChange}
      />
    );

    fireEvent.press(screen.getByText('B'));
    expect(onChange).not.toHaveBeenCalled();
  });

  it('renders badge text when option has a badge', () => {
    const onChange = jest.fn();
    const optionsWithBadge = [
      { value: 'monthly', label: 'Monthly' },
      { value: 'yearly', label: 'Yearly', badge: 'Save 20%' },
    ];
    render(
      <SegmentedControl
        options={optionsWithBadge}
        value="monthly"
        onChange={onChange}
      />
    );

    expect(screen.getByText('Save 20%')).toBeTruthy();
  });

  it('includes badge in accessibility label', () => {
    const onChange = jest.fn();
    const optionsWithBadge = [
      { value: 'monthly', label: 'Monthly' },
      { value: 'yearly', label: 'Yearly', badge: 'Save 20%' },
    ];
    render(
      <SegmentedControl
        options={optionsWithBadge}
        value="monthly"
        onChange={onChange}
      />
    );

    const tabs = screen.getAllByRole('tab');
    expect(tabs[1].props.accessibilityLabel).toBe('Yearly, Save 20%');
  });

  it('applies custom accessibilityLabel to the container', () => {
    const onChange = jest.fn();
    render(
      <SegmentedControl
        options={options}
        value="monthly"
        onChange={onChange}
        accessibilityLabel="Period picker"
      />
    );

    expect(screen.getByLabelText('Period picker')).toBeTruthy();
  });
});

describe('PeriodSelector', () => {
  it('renders Monthly and Yearly options with default labels', () => {
    const onPeriodChange = jest.fn();
    render(
      <PeriodSelector period="monthly" onPeriodChange={onPeriodChange} />
    );

    expect(screen.getByText('Monthly')).toBeTruthy();
    expect(screen.getByText('Yearly')).toBeTruthy();
  });

  it('uses custom labels', () => {
    const onPeriodChange = jest.fn();
    render(
      <PeriodSelector
        period="monthly"
        onPeriodChange={onPeriodChange}
        monthlyLabel="Mensuel"
        yearlyLabel="Annuel"
      />
    );

    expect(screen.getByText('Mensuel')).toBeTruthy();
    expect(screen.getByText('Annuel')).toBeTruthy();
  });

  it('calls onPeriodChange when switching period', () => {
    const onPeriodChange = jest.fn();
    render(
      <PeriodSelector period="monthly" onPeriodChange={onPeriodChange} />
    );

    fireEvent.press(screen.getByText('Yearly'));
    expect(onPeriodChange).toHaveBeenCalledWith('yearly');
  });

  it('renders yearly savings badge when provided', () => {
    const onPeriodChange = jest.fn();
    render(
      <PeriodSelector
        period="monthly"
        onPeriodChange={onPeriodChange}
        yearlySavings="Save 20%"
      />
    );

    expect(screen.getByText('Save 20%')).toBeTruthy();
  });

  it('has the billing period selector accessibility label', () => {
    const onPeriodChange = jest.fn();
    render(
      <PeriodSelector period="monthly" onPeriodChange={onPeriodChange} />
    );

    expect(screen.getByLabelText('Billing period selector')).toBeTruthy();
  });
});
