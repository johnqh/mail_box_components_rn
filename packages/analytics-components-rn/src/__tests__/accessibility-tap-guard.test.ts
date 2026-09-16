/**
 * No touchable in this package is operable by a pointer alone.
 *
 * On react-native-macos an assistive activation arrives as `onAccessibilityTap`
 * and not as `onPress` — there is no synthesized touch behind it — so a control
 * wired with `onPress` alone announces itself, takes focus, and then does
 * nothing at all. Every sibling package carries this guard; this one carries it
 * **before** it carries any components, because the whole point of a structural
 * guard is to be there for the code that has not been written yet.
 *
 * There is deliberately no count to pin here, unlike the other packages: this
 * package is still a placeholder (`src` holds an index, a `cn` and a type
 * declaration), so pinning "zero touchables" would fail the first time somebody
 * added a perfectly correct one. The scanner itself is exercised by the nine
 * sibling guards that share it — see `jest.touchable-scan.cjs` at the repo
 * root, and the note there on why it parses rather than matching patterns.
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
  it('never wires onPress without onAccessibilityTap', () => {
    expect(offenders(SITES)).toEqual([]);
  });

  it('excuses a touchable only with a written reason', () => {
    // `no-a11y-tap` on its own is not an exemption; the colon and a reason are.
    expect(SITES.filter(site => site.mentionsMarker && !site.excused)).toEqual(
      []
    );
  });
});
