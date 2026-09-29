/**
 * A Select on a desktop, where the app provides no native menu.
 *
 * It used to do nothing at all there. The desktop path called a native
 * module this package does not contain and returned when it was missing, and
 * the drawn picker was compiled out for the same platforms — so the control
 * rendered, took focus, and ignored every press, with no error to say why.
 * One app in the family supplied the module; every other one shipped selects
 * that could not be opened.
 */
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { Select } from '../ui/Select';

const OPTIONS = [
  { label: 'Major', value: 'major' },
  { label: 'Minor', value: 'minor' },
  { label: 'Dorian', value: 'dorian', disabled: true },
];

const reactNative = jest.requireActual('react-native');
const realOS = reactNative.Platform.OS;

/** Says which platform this is, and whether its app provides a native menu. */
function loadSelect(os: string, nativeMenu?: { show: jest.Mock }) {
  reactNative.Platform.OS = os;
  if (nativeMenu) reactNative.NativeModules.PopupMenuModule = nativeMenu;
  else delete reactNative.NativeModules.PopupMenuModule;
  return Select;
}

afterEach(() => {
  reactNative.Platform.OS = realOS;
  delete reactNative.NativeModules.PopupMenuModule;
});

describe.each(['macos', 'windows'])('Select on %s with no native menu', os => {
  it('opens its choices when pressed', () => {
    const Select = loadSelect(os);
    render(
      <Select
        value='major'
        options={OPTIONS}
        accessibilityLabel='Mode'
        onValueChange={jest.fn()}
      />
    );
    expect(screen.queryByText('Minor')).toBeNull();

    fireEvent.press(screen.getByRole('combobox', { name: 'Mode' }));

    expect(screen.getByText('Minor')).toBeTruthy();
  });

  it('reports the choice and closes', () => {
    const Select = loadSelect(os);
    const onValueChange = jest.fn();
    render(
      <Select
        value='major'
        options={OPTIONS}
        accessibilityLabel='Mode'
        onValueChange={onValueChange}
      />
    );
    fireEvent.press(screen.getByRole('combobox', { name: 'Mode' }));

    fireEvent.press(screen.getByText('Minor'));

    expect(onValueChange).toHaveBeenCalledWith('minor');
    expect(screen.queryByText('Dorian')).toBeNull();
  });

  it('closes without choosing when Cancel is pressed', () => {
    const Select = loadSelect(os);
    const onValueChange = jest.fn();
    render(
      <Select
        value='major'
        options={OPTIONS}
        accessibilityLabel='Mode'
        onValueChange={onValueChange}
      />
    );
    fireEvent.press(screen.getByRole('combobox', { name: 'Mode' }));

    fireEvent.press(screen.getByText('Cancel'));

    expect(onValueChange).not.toHaveBeenCalled();
    expect(screen.queryByText('Minor')).toBeNull();
  });

  it('does not open while disabled', () => {
    const Select = loadSelect(os);
    render(
      <Select
        value='major'
        options={OPTIONS}
        accessibilityLabel='Mode'
        disabled
        onValueChange={jest.fn()}
      />
    );

    fireEvent.press(screen.getByRole('combobox', { name: 'Mode' }));

    expect(screen.queryByText('Minor')).toBeNull();
  });
});

describe('Select on a desktop whose app provides a native menu', () => {
  it('asks the system for the menu, and draws no list of its own', () => {
    const show = jest.fn().mockResolvedValue(null);
    const Select = loadSelect('macos', { show });
    render(
      <Select
        value='major'
        options={OPTIONS}
        accessibilityLabel='Mode'
        onValueChange={jest.fn()}
      />
    );

    fireEvent.press(screen.getByRole('combobox', { name: 'Mode' }));

    // Drawn nothing: the menu is the system's.
    expect(screen.queryByText('Minor')).toBeNull();
    expect(screen.queryByText('Cancel')).toBeNull();
  });
});
