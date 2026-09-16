/**
 * Every full-screen or edge-anchored surface pads for all four insets.
 *
 * The bug this pins shipped in `FormModal` and was invisible on the device most
 * of the work is done on. A portrait phone reports `left` and `right` as 0, so
 * applying `top` and `bottom` alone looks complete: the modal is correct on
 * every simulator anybody opens by habit. It is a **landscape** phone with a
 * display cutout that has horizontal insets, and there the housing takes a
 * whole column down one side — 159px on the Android phone this was measured
 * on. `FormModal`'s Close button landed at `[12,167][156,311]`, entirely inside
 * that column and impossible to press, and the body text started at x=45,
 * underneath it.
 *
 * **What these tests can and cannot see.** There is no layout engine here — RNTL
 * over jsdom measures nothing — so nothing below proves a pixel. What they pin
 * is the *mechanism*: that the style each surface resolves to carries a padding
 * on each edge it touches, computed from the insets rather than from zero. That
 * is exactly the level the defect lived at, since the omission was a missing
 * key in a style object and not a wrong number in a correct one.
 *
 * The insets are mocked asymmetrically on purpose — 159 left and 0 right is the
 * real shape of a cutout, and a symmetric fixture would pass against code that
 * read `insets.left` for both sides.
 */
import * as React from 'react';
import { render } from '@testing-library/react-native';
import { Text, View } from 'react-native';

const INSETS = { top: 24, right: 0, bottom: 34, left: 159 };

// A file-level mock replaces `jest.setup.cjs`'s all-zero one, which would make
// every assertion below pass against the unfixed code.
jest.mock('react-native-safe-area-context', () => {
  const ReactLocal = require('react');
  const frame = { x: 0, y: 0, width: 844, height: 390 };
  return {
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) =>
      ReactLocal.createElement(ReactLocal.Fragment, null, children),
    SafeAreaView: ({
      children,
      ...rest
    }: {
      children?: React.ReactNode;
    } & Record<string, unknown>) =>
      ReactLocal.createElement(
        require('react-native').View,
        rest as object,
        children
      ),
    SafeAreaInsetsContext: ReactLocal.createContext(INSETS),
    SafeAreaFrameContext: ReactLocal.createContext(frame),
    useSafeAreaInsets: () => INSETS,
    useSafeAreaFrame: () => frame,
    initialWindowMetrics: { insets: INSETS, frame },
  };
});

import { FormModal } from '../ui/FormModal';
import { BottomActionBar } from '../ui/BottomActionBar';
import { Sheet } from '../ui/Sheet';
import { Modal } from '../ui/Modal';
import { Dialog } from '../ui/Dialog';
import { Overlay } from '../ui/Overlay';
import { PopupSelect } from '../ui/PopupSelect';
import { safeAreaPadding } from '../lib/safe-area';
import type { ViewStyle } from 'react-native';

/** Flattens whatever shape a `style` prop arrived in. */
function flatten(style: unknown): ViewStyle {
  const { StyleSheet } = require('react-native');
  return (StyleSheet.flatten(style) ?? {}) as ViewStyle;
}

/** The flattened styles of every host `View`-ish node in a render. */
function allStyles(root: {
  UNSAFE_root: { findAll: (p: (n: unknown) => boolean) => unknown[] };
}): ViewStyle[] {
  const nodes = root.UNSAFE_root.findAll(() => true) as {
    props?: { style?: unknown };
  }[];
  return nodes.map(n => flatten(n.props?.style));
}

/** Whether any node in the tree resolved to every one of these style keys. */
function someNodeHas(
  styles: ViewStyle[],
  expected: Partial<Record<keyof ViewStyle, number>>
): boolean {
  return styles.some(s =>
    Object.entries(expected).every(
      ([key, value]) => s[key as keyof ViewStyle] === value
    )
  );
}

describe('safeAreaPadding', () => {
  it('pads every edge by default — all four, never just the vertical pair', () => {
    expect(safeAreaPadding(INSETS)).toEqual({
      paddingTop: 24,
      paddingRight: 0,
      paddingBottom: 34,
      paddingLeft: 159,
    });
  });

  it('pads only the edges it is given, and leaves the others absent', () => {
    // Absent, not zero: a surface that does not touch an edge must not have
    // that edge's padding written at all, or it overrides a caller's own.
    expect(safeAreaPadding(INSETS, ['bottom', 'left', 'right'])).toEqual({
      paddingRight: 0,
      paddingBottom: 34,
      paddingLeft: 159,
    });
  });

  it('adds the base to each padded edge, and to no other', () => {
    expect(safeAreaPadding(INSETS, ['left', 'right'], 16)).toEqual({
      paddingLeft: 175,
      paddingRight: 16,
    });
  });
});

describe('FormModal safe area', () => {
  it('applies the horizontal insets, not only the vertical ones', () => {
    // The shipped defect: `paddingTop`/`paddingBottom` were applied and
    // `paddingLeft`/`paddingRight` were not, which puts the close button
    // inside a landscape phone's cutout column with no way to reach it.
    const view = render(
      <FormModal visible title='Note duration' onClose={jest.fn()} actions={[]}>
        <Text>body</Text>
      </FormModal>
    );
    const styles = allStyles(view);
    expect(someNodeHas(styles, { paddingLeft: 159, paddingRight: 0 })).toBe(
      true
    );
  });

  it('still applies the vertical insets it always did', () => {
    const view = render(
      <FormModal visible title='T' onClose={jest.fn()} actions={[]}>
        <Text>body</Text>
      </FormModal>
    );
    const styles = allStyles(view);
    expect(someNodeHas(styles, { paddingTop: 24 })).toBe(true);
    expect(someNodeHas(styles, { paddingBottom: 34 })).toBe(true);
  });
});

describe('BottomActionBar safe area', () => {
  it('adds the horizontal insets to its own spacing', () => {
    // It spans the full width against the bottom edge, so its buttons sat
    // under a landscape cutout exactly as FormModal's close button did.
    const view = render(
      <BottomActionBar>
        <Text>Save</Text>
      </BottomActionBar>
    );
    const styles = allStyles(view);
    expect(someNodeHas(styles, { paddingLeft: 175, paddingRight: 16 })).toBe(
      true
    );
  });

  it('keeps the bottom inset behaviour it already had', () => {
    const view = render(
      <BottomActionBar>
        <Text>Save</Text>
      </BottomActionBar>
    );
    expect(someNodeHas(allStyles(view), { paddingBottom: 50 })).toBe(true);
  });
});

describe('Sheet safe area', () => {
  it('pads the three edges a bottom sheet touches, and not its top', () => {
    const view = render(
      <Sheet isOpen onClose={jest.fn()} side='bottom'>
        <Text>content</Text>
      </Sheet>
    );
    const styles = allStyles(view);
    expect(
      someNodeHas(styles, {
        paddingBottom: 34,
        paddingLeft: 159,
        paddingRight: 0,
      })
    ).toBe(true);
    // Padding the top would push the drag handle off its own rounded corner.
    expect(
      styles.some(
        s =>
          s.paddingBottom === 34 && s.paddingLeft === 159 && 'paddingTop' in s
      )
    ).toBe(false);
  });

  it('pads the leading edge for a left sheet', () => {
    const view = render(
      <Sheet isOpen onClose={jest.fn()} side='left'>
        <Text>content</Text>
      </Sheet>
    );
    expect(
      someNodeHas(allStyles(view), {
        paddingLeft: 159,
        paddingTop: 24,
        paddingBottom: 34,
      })
    ).toBe(true);
  });
});

describe('centred dialogs are centred in the safe area', () => {
  it.each([
    [
      'Modal',
      <Modal key='m' isOpen onClose={jest.fn()} title='T'>
        <Text>body</Text>
      </Modal>,
    ],
    [
      'Dialog',
      <Dialog key='d' isOpen onClose={jest.fn()}>
        <Text>body</Text>
      </Dialog>,
    ],
    [
      'Overlay',
      <Overlay key='o' isOpen onClose={jest.fn()}>
        <View>
          <Text>body</Text>
        </View>
      </Overlay>,
    ],
  ])('%s keeps its panel clear of a cutout column', (_name, element) => {
    const view = render(element as React.ReactElement);
    expect(
      someNodeHas(allStyles(view), {
        paddingLeft: 159,
        paddingRight: 0,
        paddingTop: 24,
        paddingBottom: 34,
      })
    ).toBe(true);
  });
});

describe('PopupSelect safe area', () => {
  it('pads all four edges of its full-screen picker', () => {
    // It applied `paddingTop` alone, so the header and every option row ran
    // under a landscape cutout and the last row under the home indicator.
    const view = render(
      <PopupSelect
        value='a'
        onValueChange={jest.fn()}
        options={[{ label: 'A', value: 'a' }]}
      />
    );
    // The trigger opens it; render it open by pressing.
    const { fireEvent, screen } = require('@testing-library/react-native');
    fireEvent.press(screen.getByRole('combobox'));
    expect(
      someNodeHas(allStyles(view), {
        paddingTop: 24,
        paddingLeft: 159,
        paddingRight: 0,
        paddingBottom: 34,
      })
    ).toBe(true);
  });
});
