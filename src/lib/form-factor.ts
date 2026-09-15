/**
 * What kind of device a modal is being shown on — the one question that
 * decides how it is presented.
 *
 * - **phone** fills the screen: the screen is the size of a panel.
 * - **tablet** and **desktop** show a dialog: a full-bleed form across a large
 *   screen or a Mac window reads as the app having lost its place.
 *
 * Decided from the device, not the window width. It used to be "wider than
 * 768pt", which put a dialog on an iPhone in landscape (844pt wide) and a
 * full-screen panel on an iPad in a narrow Split View — both backwards.
 */
import { Dimensions, Platform, useWindowDimensions } from 'react-native';

export type FormFactor = 'phone' | 'tablet' | 'desktop';

/** Android's own tablet line: a shortest side of 600dp (`sw600dp`). */
export const TABLET_MIN_SHORTEST_SIDE = 600;

export function formFactorFor(device: {
  os: string;
  isPad?: boolean;
  screenWidth: number;
  screenHeight: number;
}): FormFactor {
  if (device.os === 'macos' || device.os === 'windows' || device.os === 'web') {
    return 'desktop';
  }
  if (device.os === 'ios') return device.isPad ? 'tablet' : 'phone';
  return Math.min(device.screenWidth, device.screenHeight) >=
    TABLET_MIN_SHORTEST_SIDE
    ? 'tablet'
    : 'phone';
}

/** The current device's form factor; re-read when the display changes. */
export function useFormFactor(): FormFactor {
  // Subscribed for the re-render on a display change; the screen is what is read.
  useWindowDimensions();
  const screen = Dimensions.get('screen');
  return formFactorFor({
    os: Platform.OS,
    isPad: (Platform as { isPad?: boolean }).isPad,
    screenWidth: screen.width,
    screenHeight: screen.height,
  });
}
