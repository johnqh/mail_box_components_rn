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
