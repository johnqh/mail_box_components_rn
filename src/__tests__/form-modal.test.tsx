/**
 * FormModal's three footers.
 *
 * The precedence matters and is easy to get backwards: `actions={[]}` has to
 * mean "no bottom bar" rather than falling through to the save CTA, because a
 * dialog whose settings apply on change has nothing to confirm. Getting that
 * wrong shows a dead Save button on every such dialog.
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { FormModal } from '../ui/FormModal';

describe('FormModal footer', () => {
  it('renders the save CTA when only onSave is given', () => {
    const { getByText } = render(
      <FormModal
        visible
        title='T'
        onClose={jest.fn()}
        onSave={jest.fn()}
        saveLabel='Keep'
      >
        <Text>body</Text>
      </FormModal>
    );
    expect(getByText('Keep')).toBeTruthy();
  });

  it('renders actions in order, and they take precedence over onSave', () => {
    const onSave = jest.fn();
    const second = jest.fn();
    const { getByText, queryByText } = render(
      <FormModal
        visible
        title='T'
        onClose={jest.fn()}
        onSave={onSave}
        saveLabel='Keep'
        actions={[
          { label: 'Back', onPress: jest.fn() },
          { label: 'Next', onPress: second },
        ]}
      >
        <Text>body</Text>
      </FormModal>
    );
    expect(queryByText('Keep')).toBeNull();
    fireEvent.press(getByText('Next'));
    expect(second).toHaveBeenCalled();
    expect(onSave).not.toHaveBeenCalled();
  });

  it('renders no bottom bar at all for an empty actions list', () => {
    const { queryByText } = render(
      <FormModal
        visible
        title='T'
        onClose={jest.fn()}
        onSave={jest.fn()}
        saveLabel='Keep'
        actions={[]}
      >
        <Text>body</Text>
      </FormModal>
    );
    expect(queryByText('Keep')).toBeNull();
  });

  it('names the close control separately when asked', () => {
    // A footer with its own Cancel makes the default name ambiguous aloud.
    const { getByLabelText } = render(
      <FormModal
        visible
        title='T'
        onClose={jest.fn()}
        closeAriaLabel='Close dialog'
        actions={[{ label: 'Cancel', onPress: jest.fn() }]}
      >
        <Text>body</Text>
      </FormModal>
    );
    expect(getByLabelText('Close dialog')).toBeTruthy();
  });
});

/**
 * The top bar follows each platform's own bar, not one arrangement everywhere.
 *
 * This is what made the dialog read as "not native" even once iOS was
 * presenting a real form sheet: a large left-aligned heading with a small ✕
 * floating at the trailing edge is neither platform's convention.
 *
 * The two differ in a way that is not decoration. On iOS the dismiss control is
 * a **trailing** bar button item and the title is centred; on Android it is the
 * **leading** navigation icon, where Up and Close live, with the title after it
 * on the keyline. Putting Close on the right of an Android app bar is an iOS
 * habit, and it looks wrong to anyone who uses the platform.
 */
describe('FormModal top bar', () => {
  const platform = jest.requireActual('react-native').Platform;
  const originalOS = platform.OS;
  afterEach(() => {
    platform.OS = originalOS;
  });

  function renderBar() {
    return render(
      <FormModal visible title='Note duration' onClose={jest.fn()} actions={[]}>
        <Text>body</Text>
      </FormModal>
    );
  }

  it('gives the title the header role, so it reads as a title', () => {
    const { getByRole } = renderBar();
    expect(getByRole('header')).toBeTruthy();
  });

  it('names the dismiss control rather than leaving it as a glyph', () => {
    // "✕" read aloud is not a word. Every caller with a Cancel in its footer
    // must also override this, or two controls share one name.
    const { getByLabelText } = renderBar();
    expect(getByLabelText('Cancel')).toBeTruthy();
  });

  it('truncates a long title to one line instead of growing the bar', () => {
    const { getByRole } = render(
      <FormModal
        visible
        title={'A title long enough to wrap on any device '.repeat(3)}
        onClose={jest.fn()}
        actions={[]}
      >
        <Text>body</Text>
      </FormModal>
    );
    expect(getByRole('header').props.numberOfLines).toBe(1);
  });
});

/**
 * The actions sit against the bottom edge, whatever the shell is.
 *
 * The bug this pins: the content's sizing was keyed off screen width rather
 * than off whether its shell has a definite height. On an iPad form sheet —
 * fixed size, chosen by the system — the content hugged its own height and the
 * buttons floated in the middle with empty sheet underneath. The right
 * question is "does this shell have a height", and only the drawn centred
 * dialog does not.
 */
describe('FormModal action placement', () => {
  const source = fs.readFileSync(
    path.join(__dirname, '..', 'ui', 'FormModal', 'FormModal.tsx'),
    'utf8'
  );

  it('sizes the content by the shell, not by the screen width', () => {
    // `isLarge` alone is the mistake: it conflates "tablet" with "no height".
    expect(source).toMatch(/hugsContent/);
    expect(source).toMatch(/hugsContent\s*=\s*frame\.layout === 'card'/);
  });

  it('fills the shell wherever it has a height, so actions reach the bottom', () => {
    expect(source).toMatch(/hugsContent\s*\?[\s\S]{0,80}flex:\s*1/);
  });
});

/**
 * The frame's contract, whatever the presentation: the title in the bar, the
 * content inside the one scrolling area, the actions outside it — so they stay
 * visible however long the content is.
 */
describe('FormModal frame', () => {
  it('puts the content in the scroll area and the actions after it', () => {
    const { UNSAFE_getAllByType, getByText } = render(
      <FormModal
        visible
        title='Settings'
        onClose={jest.fn()}
        actions={[{ label: 'Done', onPress: jest.fn() }]}
      >
        <Text>content</Text>
      </FormModal>
    );
    const { ScrollView } = require('react-native');
    const scroll = UNSAFE_getAllByType(ScrollView)[0];
    expect(scroll.findByProps({ children: 'content' })).toBeTruthy();
    expect(scroll.findAllByProps({ children: 'Done' })).toHaveLength(0);
    expect(getByText('Settings')).toBeTruthy();
  });
});
