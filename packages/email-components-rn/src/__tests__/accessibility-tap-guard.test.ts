/**
 * No touchable in this package is operable by a pointer alone.
 *
 * On react-native-macos an assistive activation arrives as `onAccessibilityTap`
 * and not as `onPress` — there is no synthesized touch behind it — so a control
 * wired with `onPress` alone announces itself, takes focus, and then does
 * nothing at all. The behaviour tests next door prove the controls they name;
 * this proves every other one, including the components added after today.
 *
 * The fix is to spread `pressProps`, which returns both routes from one
 * handler; a tag that spreads it carries neither prop literally and so has
 * nothing here to answer for. The scanning is shared with every sibling
 * package — see `jest.touchable-scan.cjs` at the repo root, and the note there
 * on why it parses rather than matching patterns.
 */
import { resolve } from 'path';

const {
  scanTouchables,
  offenders,
} = require('../../../../jest.touchable-scan.cjs');

interface Site {
  file: string;
  line: number;
  tag: string;
  hasOnPress: boolean;
  hasTap: boolean;
  excused: boolean;
  mentionsMarker: boolean;
}

const SRC = resolve(__dirname, '..');
const SITES: Site[] = scanTouchables(SRC, SRC);

describe('every touchable can be activated by assistive technology', () => {
  it('finds this package\u2019s touchables at all', () => {
    // A scanner that silently matches nothing passes every assertion below —
    // which is how the first version of it went wrong.
    expect(SITES.length).toBe(9);
  });

  it('never wires onPress without onAccessibilityTap', () => {
    expect(offenders(SITES)).toEqual([]);
  });

  it('excuses a touchable only with a written reason', () => {
    // `no-a11y-tap` on its own is not an exemption; the colon and a reason are.
    expect(SITES.filter(site => site.mentionsMarker && !site.excused)).toEqual(
      []
    );
  });

  it('needs no exemptions at all', () => {
    // Nothing in this package swallows a press without being a control.
    expect(SITES.filter(site => site.excused)).toEqual([]);
  });
});
