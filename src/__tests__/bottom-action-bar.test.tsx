import * as React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomActionBar } from '../ui/BottomActionBar';

const metrics = {
  frame: { x: 0, y: 0, width: 320, height: 640 },
  insets: { top: 0, left: 0, right: 0, bottom: 34 },
};

describe('BottomActionBar', () => {
  it('renders its children', () => {
    const { getByText } = render(
      <SafeAreaProvider initialMetrics={metrics}>
        <BottomActionBar backgroundColor='#fff' borderColor='#eee'>
          <Text>Save</Text>
        </BottomActionBar>
      </SafeAreaProvider>
    );
    expect(getByText('Save')).toBeTruthy();
  });
});
