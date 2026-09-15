/**
 * How a modal is presented: full screen on a phone, a dialog on a tablet or a
 * desktop — decided by the device, never by the window width, which put a
 * dialog on an iPhone in landscape.
 */
import { formFactorFor } from '../lib/form-factor';
import { presentationFor } from '../ui/FormModal/FormModal';

describe('formFactorFor', () => {
  it('treats every iPhone as a phone, landscape included', () => {
    expect(
      formFactorFor({
        os: 'ios',
        isPad: false,
        screenWidth: 844,
        screenHeight: 390,
      })
    ).toBe('phone');
  });

  it('treats an iPad as a tablet, however narrow its window', () => {
    expect(
      formFactorFor({
        os: 'ios',
        isPad: true,
        screenWidth: 320,
        screenHeight: 1024,
      })
    ).toBe('tablet');
  });

  it('draws the Android line at a 600dp shortest side', () => {
    expect(
      formFactorFor({ os: 'android', screenWidth: 915, screenHeight: 412 })
    ).toBe('phone');
    expect(
      formFactorFor({ os: 'android', screenWidth: 1280, screenHeight: 800 })
    ).toBe('tablet');
  });

  it('treats macOS and Windows as desktops', () => {
    expect(
      formFactorFor({ os: 'macos', screenWidth: 500, screenHeight: 400 })
    ).toBe('desktop');
    expect(
      formFactorFor({ os: 'windows', screenWidth: 500, screenHeight: 400 })
    ).toBe('desktop');
  });
});

describe('presentationFor', () => {
  it('fills the screen on a phone and shows a dialog everywhere else', () => {
    expect(presentationFor('phone')).toBe('fullScreen');
    expect(presentationFor('tablet')).toBe('dialog');
    expect(presentationFor('desktop')).toBe('dialog');
  });
});
