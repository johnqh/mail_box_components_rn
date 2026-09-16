/**
 * A picker trigger sizes to its own label.
 *
 * Every picker here draws the same trigger: a row holding the current value and
 * a chevron. The label carried `flex: 1`, which React Native expands to
 * `flexGrow: 1, flexShrink: 1, flexBasis: 0` — and **a flex-basis of zero is a
 * claim that the text needs no width**. Inside a parent with a width that is
 * harmless. Inside a parent whose width comes from its own content — a toolbar
 * row, a settings row laid out beside its label, anything not stretched — there
 * is nothing left over, because the row asked its children how wide they were
 * and the label answered zero. The trigger then measures as its padding plus
 * the chevron and renders as a bare chevron with the value invisible.
 *
 * A consumer app worked around this three separate times with hardcoded widths
 * (`w-56`, `w-56`, `w-40`), which is the signal it is the library's bug.
 *
 * **What these tests can see.** Yoga does not run here — RNTL over jsdom
 * measures nothing — so none of this proves a rendered width. What it pins is
 * the resolved style, which is exactly where the defect lived: three numbers,
 * one of which was wrong. The three have to be asserted *together*, because
 * each alone is satisfied by a fix that breaks one of the other two:
 *
 * - drop `flexGrow` and a picker in a form column stops filling it;
 * - drop `flexShrink` and a label in a parent narrower than the text pushes the
 *   chevron off the end instead of truncating — the consumer's "Follows the
 *   sy…" at `w-44` is correct behaviour and has to survive;
 * - leave `flexBasis` at 0 and nothing is fixed at all.
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as React from 'react';
import { render } from '@testing-library/react-native';
import { Text } from 'react-native';
import type { TextStyle } from 'react-native';

import { Select } from '../ui/Select';
import { CheckableSelect } from '../ui/CheckableSelect';
import { SheetSelector } from '../ui/SheetSelector';
import { PopupSelect } from '../ui/PopupSelect';
import { Combobox } from '../ui/Combobox';
import { selectTriggerLabelStyle } from '../lib/select-trigger';

const OPTIONS = [
  { label: 'Follows the system', value: 'system' },
  { label: 'Always dark', value: 'dark' },
];

/** The flattened style of the node whose text content is `label`. */
function labelStyle(
  view: { getByText: (t: string) => { props: { style?: unknown } } },
  label: string
): TextStyle {
  const { StyleSheet } = require('react-native');
  return (StyleSheet.flatten(view.getByText(label).props.style) ??
    {}) as TextStyle;
}

/**
 * The three numbers, asserted together.
 *
 * `flexBasis: 'auto'` is what makes the label's intrinsic width its text again;
 * `flexGrow: 1` keeps the trigger filling a parent that does give it a width;
 * `flexShrink: 1` keeps `numberOfLines={1}` truncating rather than overflowing
 * when the parent is narrower than the text.
 */
function expectSizesToItsLabel(style: TextStyle) {
  expect(style.flexBasis).toBe('auto');
  expect(style.flexGrow).toBe(1);
  expect(style.flexShrink).toBe(1);
  // The old value, spelled out so a regression reads as what it is.
  expect(style.flexBasis).not.toBe(0);
  expect(style.flex).toBeUndefined();
}

describe('selectTriggerLabelStyle', () => {
  it('is grow + shrink over an auto basis, never flex: 1', () => {
    expectSizesToItsLabel(selectTriggerLabelStyle);
  });
});

describe('picker triggers size to their label', () => {
  it('Select', () => {
    const view = render(
      <Select value='system' onValueChange={jest.fn()} options={OPTIONS} />
    );
    expectSizesToItsLabel(labelStyle(view, 'Follows the system'));
  });

  it('CheckableSelect', () => {
    const view = render(
      <CheckableSelect
        options={OPTIONS}
        value='system'
        onChange={jest.fn()}
        checked={[]}
        onCheckedChange={jest.fn()}
      />
    );
    expectSizesToItsLabel(labelStyle(view, 'Follows the system'));
  });

  it('SheetSelector', () => {
    const view = render(
      <SheetSelector options={OPTIONS} value='system' onChange={jest.fn()} />
    );
    expectSizesToItsLabel(labelStyle(view, 'Follows the system'));
  });

  it('PopupSelect', () => {
    const view = render(
      <PopupSelect options={OPTIONS} value='system' onValueChange={jest.fn()} />
    );
    expectSizesToItsLabel(labelStyle(view, 'Follows the system'));
  });

  it('Combobox', () => {
    const view = render(
      <Combobox options={OPTIONS} value='system' onValueChange={jest.fn()} />
    );
    expectSizesToItsLabel(labelStyle(view, 'Follows the system'));
  });
});

describe('the label still truncates rather than overflows', () => {
  it.each([
    [
      'Select',
      <Select
        key='s'
        value='system'
        onValueChange={jest.fn()}
        options={OPTIONS}
      />,
    ],
    [
      'CheckableSelect',
      <CheckableSelect
        key='c'
        options={OPTIONS}
        value='system'
        onChange={jest.fn()}
        checked={[]}
        onCheckedChange={jest.fn()}
      />,
    ],
    [
      'SheetSelector',
      <SheetSelector
        key='h'
        options={OPTIONS}
        value='system'
        onChange={jest.fn()}
      />,
    ],
    [
      'PopupSelect',
      <PopupSelect
        key='p'
        options={OPTIONS}
        value='system'
        onValueChange={jest.fn()}
      />,
    ],
    [
      'Combobox',
      <Combobox
        key='b'
        options={OPTIONS}
        value='system'
        onValueChange={jest.fn()}
      />,
    ],
  ])('%s keeps numberOfLines={1} beside a shrinkable label', (_n, element) => {
    // The pair is what produces an ellipsis: `flexShrink` lets the box get
    // narrower than the text, `numberOfLines` decides what happens then.
    // Without the second the text wraps and the trigger grows a line taller.
    const view = render(element as React.ReactElement);
    const node = view.getByText('Follows the system');
    expect(node.props.numberOfLines).toBe(1);
  });
});

/**
 * The guard the per-component tests cannot be: the next picker.
 *
 * Five assertions above name five components. A sixth written next month passes
 * all of them by not being mentioned, and `flex: 1` on a trigger label is the
 * obvious thing to type. This reads the source instead.
 */
describe('no picker trigger goes back to flex: 1', () => {
  const TRIGGER_FILES = [
    'Select/Select.tsx',
    'CheckableSelect/CheckableSelect.tsx',
    'SheetSelector/SheetSelector.tsx',
    'PopupSelect/PopupSelect.tsx',
    'Combobox/Combobox.tsx',
  ];

  it.each(TRIGGER_FILES)('%s uses the shared style for its trigger', file => {
    const source = fs.readFileSync(
      path.join(__dirname, '..', 'ui', file),
      'utf8'
    );
    expect(source).toMatch(/selectTriggerLabelStyle/);
  });
});

/** Kept so the JSX factory import is used even if a case above is removed. */
void Text;
