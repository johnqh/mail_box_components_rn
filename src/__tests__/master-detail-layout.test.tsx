import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';
import { MasterDetailLayout } from '../ui/MasterDetailLayout';

// `useWindowDimensions` is re-exported through a getter on 'react-native', so a
// spy on the namespace never reaches the component; mock the module itself.
jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  __esModule: true,
  default: jest.fn(),
}));
const useWindowDimensions =
  require('react-native/Libraries/Utilities/useWindowDimensions')
    .default as jest.Mock;

const setWidth = (width: number) =>
  useWindowDimensions.mockReturnValue({
    width,
    height: 1000,
    scale: 2,
    fontScale: 1,
  });

const classOf = (testID: string) =>
  String(screen.getByTestId(testID).props.className ?? '');

describe.each([
  ['tablet', 1024],
  ['phone', 390],
])('MasterDetailLayout (%s)', (_label, width) => {
  beforeEach(() => setWidth(width));

  // The title above the master list repeated what the screen already says.
  // `masterTitle` now only labels the mobile back button.
  it('does not render the master title', () => {
    render(
      <MasterDetailLayout
        masterTitle='Navigation'
        masterContent={<Text>Master</Text>}
        detailContent={<Text>Detail</Text>}
      />
    );
    expect(screen.queryByText('Navigation')).toBeNull();
  });

  it('renders masterSubtitle without a masterTitle', () => {
    render(
      <MasterDetailLayout
        masterSubtitle='0xabc'
        masterContent={<Text>Master</Text>}
        detailContent={<Text>Detail</Text>}
      />
    );
    expect(screen.getByText('0xabc')).toBeTruthy();
  });

  it('sits the master panel on the page background by default', () => {
    render(
      <MasterDetailLayout
        masterContent={<Text>Master</Text>}
        detailContent={<Text>Detail</Text>}
      />
    );
    expect(classOf('master-detail-master')).not.toContain('bg-well');
  });

  it('paints the recessed surface when showMasterBackground is set', () => {
    render(
      <MasterDetailLayout
        showMasterBackground
        masterContent={<Text>Master</Text>}
        detailContent={<Text>Detail</Text>}
      />
    );
    expect(classOf('master-detail-master')).toContain('bg-well');
  });
});

describe('MasterDetailLayout detail inset', () => {
  it('insets the tablet detail panel only when detailPadding is set', () => {
    setWidth(1024);
    const { rerender } = render(
      <MasterDetailLayout
        masterContent={<Text>Master</Text>}
        detailContent={<Text>Detail</Text>}
        detailTitle='Section'
      />
    );
    expect(classOf('master-detail-detail')).not.toMatch(/\bp[xytb]?-\d/);

    rerender(
      <MasterDetailLayout
        masterContent={<Text>Master</Text>}
        detailContent={<Text>Detail</Text>}
        detailTitle='Section'
        detailPadding
      />
    );
    expect(classOf('master-detail-detail')).toContain('px-6');
    expect(classOf('master-detail-detail')).toContain('py-6');
  });

  it('insets the phone detail card only when detailPadding is set', () => {
    setWidth(390);
    const { rerender } = render(
      <MasterDetailLayout
        mobileView='content'
        masterContent={<Text>Master</Text>}
        detailContent={<Text>Detail</Text>}
      />
    );
    expect(classOf('master-detail-detail')).not.toMatch(/\bp-\d/);

    rerender(
      <MasterDetailLayout
        mobileView='content'
        masterContent={<Text>Master</Text>}
        detailContent={<Text>Detail</Text>}
        detailPadding
      />
    );
    expect(classOf('master-detail-detail')).toContain('p-4');
  });

  it('labels the back button with masterTitle', () => {
    setWidth(390);
    render(
      <MasterDetailLayout
        masterTitle='Table of Contents'
        mobileView='content'
        onBackToNavigation={() => {}}
        masterContent={<Text>Master</Text>}
        detailContent={<Text>Detail</Text>}
      />
    );
    expect(screen.getByText('← Table of Contents')).toBeTruthy();
  });
});
