/**
 * No touchable in this package is operable by a pointer alone.
 *
 * The behaviour tests next door prove the components they name; this proves the
 * ones nobody has written a case for yet, which is every component added after
 * today. It reads the source rather than rendering, because proving a control
 * *cannot* be activated needs a fixture per branch, while the rule itself —
 * `onPress` and `onAccessibilityTap` travel together — is visible in the text.
 *
 * The fix is almost always `pressProps` from `lib/a11y`, which returns the pair
 * from one handler; a tag that spreads it carries neither prop literally and so
 * has nothing here to answer for.
 *
 * The scanning lives in `jest.touchable-scan.cjs` at the repo root, shared with
 * every sibling package's copy of this guard — see the note there on why it
 * parses rather than matching patterns.
 */
import { resolve } from 'path';

const { scanTouchables, offenders } = require('../../jest.touchable-scan.cjs');

interface Site {
  file: string;
  line: number;
  tag: string;
  hasOnPress: boolean;
  hasTap: boolean;
  excused: boolean;
  mentionsMarker: boolean;
}

const SITES: Site[] = scanTouchables(
  resolve(__dirname, '..', 'ui'),
  resolve(__dirname, '..')
);

describe('every touchable can be activated by assistive technology', () => {
  it('finds the package’s touchables at all', () => {
    // A scanner that silently matches nothing passes every assertion below —
    // which is how the first version of it went wrong.
    expect(SITES.length).toBeGreaterThan(100);
  });

  it('never wires onPress without onAccessibilityTap', () => {
    expect(offenders(SITES)).toEqual([]);
  });

  it('excuses a touchable only with a written reason', () => {
    // `no-a11y-tap` on its own is not an exemption; the colon and a reason are.
    const bare = SITES.filter(site => site.mentionsMarker && !site.excused);
    expect(bare).toEqual([]);
  });

  it('keeps the exemptions to the handful that need a gesture', () => {
    // Every one of these swallows a press so it does not reach the scrim
    // behind it. Nothing else may quietly join them.
    expect(
      SITES.filter(site => site.excused)
        .map(site => site.file)
        .sort()
    ).toEqual([
      'ui/Command/Command.tsx',
      'ui/Dialog/Dialog.tsx',
      'ui/FormModal/FormModal.tsx',
      'ui/Modal/Modal.tsx',
      'ui/Popover/Popover.tsx',
    ]);
  });
});
