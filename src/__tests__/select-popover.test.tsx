/**
 * A Select on a tablet opens beside the control, not along the bottom edge.
 *
 * It opened the phone's sheet there: a panel across the foot of an iPad for
 * a choice of three things, a screen's length from a control in the far
 * corner. The platform's own answer on a tablet is a menu anchored to the
 * control.
 */
import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { Select } from '../ui/Select';
import {
  POPOVER_GAP,
  POPOVER_MARGIN,
  POPOVER_MAX_HEIGHT,
  POPOVER_MIN_WIDTH,
  popoverPlacement,
} from '../lib/select-popover';

const WINDOW = { width: 1210, height: 834 };

describe('popoverPlacement', () => {
  it('hangs below the control, from its leading edge', () => {
    const placed = popoverPlacement(
      { x: 300, y: 100, width: 320, height: 36 },
      WINDOW
    );
    expect(placed).toEqual({
      left: 300,
      width: 320,
      top: 100 + 36 + POPOVER_GAP,
      maxHeight: POPOVER_MAX_HEIGHT,
    });
  });

  it('is never narrower than a menu can be read at', () => {
    const placed = popoverPlacement(
      { x: 300, y: 100, width: 90, height: 36 },
      WINDOW
    );
    expect(placed.width).toBe(POPOVER_MIN_WIDTH);
  });

  it('is pulled back inside the window from the trailing edge', () => {
    // A picker in the top right corner: the settings rows are exactly this.
    const placed = popoverPlacement(
      { x: 1100, y: 100, width: 90, height: 36 },
      WINDOW
    );
    expect(placed.left + placed.width).toBe(WINDOW.width - POPOVER_MARGIN);
  });

  it('opens upward at the foot of the window, where there is more room above', () => {
    const anchor = { x: 300, y: 760, width: 320, height: 36 };
    const placed = popoverPlacement(anchor, WINDOW);
    expect(placed.top).toBeUndefined();
    expect(placed.bottom).toBe(WINDOW.height - anchor.y + POPOVER_GAP);
    expect(placed.maxHeight).toBe(POPOVER_MAX_HEIGHT);
  });

  it('stays below when below is merely short, and is as tall as the room left', () => {
    const anchor = { x: 300, y: 500, width: 320, height: 36 };
    const placed = popoverPlacement(anchor, WINDOW);
    expect(placed.top).toBe(anchor.y + anchor.height + POPOVER_GAP);
    expect(placed.maxHeight).toBe(
      WINDOW.height - (anchor.y + anchor.height) - POPOVER_GAP - POPOVER_MARGIN
    );
  });

  it('never claims a height the window does not have', () => {
    const placed = popoverPlacement(
      { x: 0, y: 0, width: 100, height: 30 },
      { width: 200, height: 20 }
    );
    expect(placed.maxHeight).toBe(0);
    expect(placed.width).toBe(200 - POPOVER_MARGIN * 2);
  });
});

const OPTIONS = [
  { label: 'English', value: 'en' },
  { label: '中文', value: 'zh' },
];

const reactNative = jest.requireActual('react-native');
const realOS = reactNative.Platform.OS;
const realPad = reactNative.Platform.isPad;

function device(os: string, isPad: boolean) {
  reactNative.Platform.OS = os;
  // A getter on the real object, so it is redefined rather than assigned:
  // an assignment is accepted and ignored.
  Object.defineProperty(reactNative.Platform, 'isPad', {
    configurable: true,
    get: () => isPad,
  });
}

/*
  Stands in for the native measurement, which a test renderer has none of:
  it lays nothing out, and its `measureInWindow` never answers.
*/
jest.mock('../lib/select-popover', () => ({
  ...jest.requireActual('../lib/select-popover'),
  measureAnchor: (
    _view: unknown,
    onMeasured: (anchor: {
      x: number;
      y: number;
      width: number;
      height: number;
    }) => void
  ) => onMeasured({ x: 1100, y: 100, width: 90, height: 36 }),
}));

afterEach(() => {
  device(realOS, realPad);
  jest.restoreAllMocks();
});

function renderSelect(onValueChange = jest.fn()) {
  render(
    <Select
      value='en'
      options={OPTIONS}
      accessibilityLabel='Language'
      onValueChange={onValueChange}
    />
  );
  return onValueChange;
}

describe('Select on a tablet', () => {
  beforeEach(() => {
    device('ios', true);
  });

  it('opens a menu beside the control, with no sheet and no Cancel', () => {
    renderSelect();
    expect(popover()).toBeNull();

    fireEvent.press(screen.getByRole('combobox', { name: 'Language' }));

    expect(popover()).toBeTruthy();
    expect(screen.getByText('中文')).toBeTruthy();
    // The sheet's own furniture: a menu is put away by pressing elsewhere.
    expect(screen.queryByText('Cancel')).toBeNull();
  });

  it('is placed from where the control is', () => {
    renderSelect();
    fireEvent.press(screen.getByRole('combobox', { name: 'Language' }));
    const style = StyleSheetFlatten(popover()!.props.style);
    expect(style.position).toBe('absolute');
    expect(style.top).toBe(100 + 36 + POPOVER_GAP);
    expect(style.width).toBe(POPOVER_MIN_WIDTH);
  });

  it('reports the choice and closes', () => {
    const onValueChange = renderSelect();
    fireEvent.press(screen.getByRole('combobox', { name: 'Language' }));
    fireEvent.press(screen.getByText('中文'));
    expect(onValueChange).toHaveBeenCalledWith('zh');
    expect(popover()).toBeNull();
  });
});

describe('Select on a phone', () => {
  it('still opens the sheet from the bottom edge', () => {
    device('ios', false);
    renderSelect();
    fireEvent.press(screen.getByRole('combobox', { name: 'Language' }));
    expect(popover()).toBeNull();
    expect(screen.getByText('Cancel')).toBeTruthy();
    expect(screen.getByText('中文')).toBeTruthy();
  });
});

/**
 * The card, by the id it is drawn with. Asked of the element tree rather than
 * of the host tree: the modal host is a native window the test renderer does
 * not draw into, so a host query finds nothing inside it.
 */
function popover() {
  return screen.UNSAFE_queryAllByProps({ testID: 'select-popover' })[0] ?? null;
}

function StyleSheetFlatten(style: unknown): Record<string, unknown> {
  return reactNative.StyleSheet.flatten(style) as Record<string, unknown>;
}

describe('the Select trigger follows the theme and its caller', () => {
  const source = require('node:fs').readFileSync(
    require('node:path').join(__dirname, '../ui/Select/Select.tsx'),
    'utf8'
  ) as string;

  it('takes its border from the theme, not from the palette', () => {
    expect(source).toContain('border-input');
    expect(source).not.toMatch(/borderColor:\s*colors\.raw/);
  });

  it('states its height as a class a caller can replace', () => {
    expect(source).toContain('min-h-[36px]');
    expect(source).not.toMatch(/minHeight:\s*36/);
  });
});
