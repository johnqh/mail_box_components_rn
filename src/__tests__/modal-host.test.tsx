/**
 * Every dialog in this library goes through one overlay host.
 *
 * The reason is React Native macOS: its Fabric renderer has no modal host view,
 * and mounting `<Modal>` throws there even when it is not visible. So a direct
 * import of `Modal` in any component is a component that cannot run on macOS —
 * which is invisible until somebody builds for it, because every other platform
 * is fine. This checks the rule instead of trusting it to be remembered.
 */
import * as fs from 'node:fs';
import * as path from 'node:path';

function sourceFiles(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(full);
    return entry.name.endsWith('.tsx') ? [full] : [];
  });
}

/** The file as code: block comments and line comments removed. */
function codeOf(file: string): string {
  return fs
    .readFileSync(file, 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/^[ \t]*\/\/.*$/gm, '');
}

describe('ModalHost', () => {
  it('is the only thing that imports React Native Modal', () => {
    const offenders = sourceFiles(path.join(__dirname, '..', 'ui'))
      .filter(f => !f.includes('ModalHost'))
      .filter(f => {
        const code = codeOf(f);
        const rn = /import \{([^}]*)\} from 'react-native';/s.exec(code);
        return rn ? /(?<![A-Za-z])Modal(?![A-Za-z])/.test(rn[1]) : false;
      })
      .map(f => path.relative(path.join(__dirname, '..'), f));

    expect(offenders).toEqual([]);
  });

  it('has a macOS variant, since that is the platform without one', () => {
    // A `.macos.tsx` beside the default is how Metro picks the other
    // implementation. Losing the file would silently restore the crash.
    const dir = path.join(__dirname, '..', 'ui', 'ModalHost');
    expect(fs.existsSync(path.join(dir, 'ModalHost.macos.tsx'))).toBe(true);
    expect(codeOf(path.join(dir, 'ModalHost.macos.tsx'))).not.toMatch(
      /from 'react-native'[\s\S]*Modal(?![A-Za-z])/
    );
  });
});

describe('SafeAreaView', () => {
  it('always comes from react-native-safe-area-context', () => {
    /*
      React Native's own `SafeAreaView` is deprecated, and it was iOS-only
      before that: on Android and macOS it applies no inset at all, so a sheet
      using it looks right on a phone and wrong everywhere else. The context
      package's version works on every platform, and is what the app already
      mounts a provider for.
    */
    const offenders = sourceFiles(path.join(__dirname, '..', 'ui'))
      .filter(f => {
        const rn = /import \{([^}]*)\} from 'react-native';/s.exec(codeOf(f));
        return rn ? /(?<![A-Za-z])SafeAreaView(?![A-Za-z])/.test(rn[1]) : false;
      })
      .map(f => path.relative(path.join(__dirname, '..'), f));

    expect(offenders).toEqual([]);
  });
});

/**
 * A modal must never narrow the orientations its app supports.
 *
 * React Native defaults `supportedOrientations` to `['portrait']`, which the
 * modal then asserts on behalf of the whole application. In a landscape-only
 * app iOS reports "Modal was presented with 0x2 orientations mask but the
 * application only supports 0x18" — a warning in development and **a crash in
 * release**. Listing every orientation hands the decision back to the host's
 * Info.plist, which is the only place that should be making it.
 *
 * Source-scanned rather than rendered: what matters is that the prop is passed
 * at all, and a render test would assert the default of whatever platform the
 * suite happens to run on.
 */
describe('ModalHost orientations', () => {
  const source = fs.readFileSync(
    path.join(__dirname, '..', 'ui', 'ModalHost', 'ModalHost.tsx'),
    'utf8'
  );

  it('passes supportedOrientations to Modal', () => {
    expect(source).toMatch(/supportedOrientations=/);
  });

  it('lists landscape as well as portrait', () => {
    // Only listing portrait would reproduce the very default this exists to
    // override.
    expect(source).toMatch(/'landscape'/);
    expect(source).toMatch(/'portrait'/);
  });

  it('asks iOS for a real presentation rather than a drawn one', () => {
    // `presentationStyle` is what makes an iPad dialog a UIKit form sheet —
    // the system's corners, shadow, dimming and drag-to-dismiss — instead of a
    // white box this library painted inside a transparent window.
    expect(source).toMatch(/presentationStyle/);
    expect(source).toMatch(/formSheet/);
  });

  it('keeps the modal opaque where it asks for a presentation style', () => {
    // iOS ignores `presentationStyle` on a transparent modal: there is no view
    // controller frame to style, so the sheet silently never appears.
    expect(source).toMatch(/transparent:\s*false/);
  });
});
