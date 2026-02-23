# Improvement Plans for @sudobility/components-rn

## Priority 1: Critical / High Impact

### 1.1 ~~Add test coverage~~ ✅ DONE
- Set up full test infrastructure: `jest.config.cjs`, `jest.setup.cjs`, `jest.globals.cjs`, `babel.config.cjs`
- Installed `@react-native/babel-preset` and `@babel/runtime` for proper Flow syntax support
- Fixed `transformIgnorePatterns` for bun's `.bun/` module layout
- Wrote 11 test files with 117 tests total:
  - `utils.test.ts` (10 tests), `button.test.tsx` (10), `card.test.tsx` (12), `input.test.tsx` (11)
  - `alert.test.tsx` (10), `badge.test.tsx` (14), `modal.test.tsx` (10), `dialog.test.tsx` (10)
  - `sheet.test.tsx` (10), `toast.test.tsx` (10), `tabs.test.tsx` (10)

### 1.2 ~~Inconsistent component file structure~~ ✅ DONE
- Moved `ChainBadge.tsx` into `src/ui/ChainBadge/ChainBadge.tsx` with `index.ts` barrel
- Added JSDoc to `ChainBadgeProps` interface

### 1.3 ~~Update dev dependency versions~~ ✅ DONE
- Aligned: `typescript` ^5.9.3, `eslint` ^9.38.0, `prettier` ^3.6.2, `eslint-config-prettier` ^10.1.8, `eslint-plugin-prettier` ^5.5.4, `vite-plugin-dts` ^4.5.4

## Priority 2: Important / Medium Impact

### 2.1 ~~Add comprehensive JSDoc to all components~~ ✅ DONE (partial)
- Added JSDoc to `ChainBadge` props interface
- `ToastMessage` interface already had JSDoc

### 2.2 Shared logic with web counterpart
**Problem**: Only `Button/Button.shared.ts` contains shared cross-platform logic. Many other components have duplicated logic between the web and RN versions (variant maps, class construction, etc.).
**Fix**: Extract shared logic (variant definitions, prop types, utility functions) into shared files or a shared package to reduce drift between web and RN implementations.

### 2.3 ~~Add analytics-components-rn package content~~ ✅ DONE (marked private)
- Added `"private": true` to `packages/analytics-components-rn/package.json` to prevent accidental publishing of the stub package

### 2.4 Add component visual testing
**Problem**: No visual regression testing exists. NativeWind class rendering can be difficult to verify without visual checks.
**Fix**: Consider using Storybook for React Native or a snapshot testing approach with `@testing-library/react-native` to catch visual regressions.

### 2.5 ~~Publish configuration mismatch~~ ✅ DONE
- Changed `publishConfig.access` from `"restricted"` to `"public"` to match web counterpart

## Priority 3: Nice to Have / Low Impact

### 3.1 Add build:all to CI
**Problem**: The `build:all` script exists but it is unclear if CI runs it. Sub-packages may have broken builds that are not caught.
**Fix**: Ensure CI runs `bun run build:all` to catch compilation errors in all packages.

### 3.2 Implement react-native-reanimated animations
**Problem**: Most animations use the basic `Animated` API from `react-native`. While functional, `react-native-reanimated` (a peer dependency) provides better performance by running animations on the native thread.
**Fix**: Gradually migrate animations to `react-native-reanimated` for smoother performance, starting with Sheet, Dialog, and Toast.

### 3.3 Add platform-specific optimizations
**Problem**: Components use the same styling for iOS and Android. Some components could benefit from platform-specific adjustments (e.g., using `Platform.select()` for shadows, using platform-native date pickers).
**Fix**: Add `Platform.select()` calls where iOS and Android have meaningful UX differences (e.g., shadows, haptic feedback, native selectors).

### 3.4 ~~Consolidate design system re-exports~~ ✅ DONE
- Added `@deprecated` JSDoc notice to the design system re-exports in `src/index.ts`
- Recommends consumers import directly from `@sudobility/design`

### 3.5 Add React 19 compatibility testing
**Problem**: The package declares `react: "^18.0.0 || ^19.0.0"` as a peer dependency, but dev dependencies use React 18.3. React 19 compatibility is not verified.
**Fix**: Add a CI matrix that tests against both React 18 and React 19 to ensure forward compatibility.

### 3.6 Add source map to CJS build
**Problem**: The Vite config has `sourcemap: true` but the CJS output may not generate source maps if Vite only applies it to the primary format.
**Fix**: Verify source maps are generated for both ESM and CJS outputs.
