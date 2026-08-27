/**
 * FormModal's three footers.
 *
 * The precedence matters and is easy to get backwards: `actions={[]}` has to
 * mean "no bottom bar" rather than falling through to the save CTA, because a
 * dialog whose settings apply on change has nothing to confirm. Getting that
 * wrong shows a dead Save button on every such dialog.
 */
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
