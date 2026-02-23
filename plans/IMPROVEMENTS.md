# Improvement Plans for @sudobility/components-rn

## Priority 1: Critical / High Impact

### 1.1 Add test coverage
**Problem**: The project uses `jest --passWithNoTests`, suggesting there are no tests at all. For a UI component library with 90+ components and 10 sub-packages, this is a significant gap.
**Fix**: Set up testing infrastructure with `@testing-library/react-native` and write tests for:
- Core components (Button, Card, Input, Alert, Badge, Modal, Dialog, Sheet, Toast)
- All hooks (useToast)
- The cn() utility function
- Compound component patterns (Tabs, Toast, Card, Modal)

### 1.2 Inconsistent component file structure
**Problem**: Most components follow the `src/ui/ComponentName/ComponentName.tsx` + `index.ts` pattern, but `ChainBadge.tsx` is a single file directly in `src/ui/` without a directory. This inconsistency can confuse contributors.
**Fix**: Move `ChainBadge.tsx` into its own `src/ui/ChainBadge/ChainBadge.tsx` directory with an `index.ts` barrel.

### 1.3 Update dev dependency versions
**Problem**: Several dev dependencies are behind the web counterpart:
- `typescript` is `^5.6.0` (web uses `^5.9.3`)
- `vite` is `^6.0.0` (web uses `^7.1.12`)
- `eslint` is `^9.15.0` (web uses `^9.38.0`)
- `@types/react` is `^18.3.0` (web uses `^19.2.2`)
**Fix**: Align dev dependency versions with the web project where possible to maintain consistency across the ecosystem.

## Priority 2: Important / Medium Impact

### 2.1 Add comprehensive JSDoc to all components
**Problem**: While some components (Button, Toast, Badge, Text, Heading, Spinner) have good JSDoc, many lack documentation. Consumers relying on TypeScript intellisense benefit greatly from JSDoc on props interfaces.
**Fix**: Add `@fileoverview` to all component files and `@param`/`@returns`/`@example` to all exported components and interfaces.

### 2.2 Shared logic with web counterpart
**Problem**: Only `Button/Button.shared.ts` contains shared cross-platform logic. Many other components have duplicated logic between the web and RN versions (variant maps, class construction, etc.).
**Fix**: Extract shared logic (variant definitions, prop types, utility functions) into shared files or a shared package to reduce drift between web and RN implementations.

### 2.3 Add analytics-components-rn package content
**Problem**: The `analytics-components-rn` package is a stub with only a `cn` utility and no actual components. It is published but provides no value.
**Fix**: Either implement the analytics components or remove the stub package until it has real content.

### 2.4 Add component visual testing
**Problem**: No visual regression testing exists. NativeWind class rendering can be difficult to verify without visual checks.
**Fix**: Consider using Storybook for React Native or a snapshot testing approach with `@testing-library/react-native` to catch visual regressions.

### 2.5 Publish configuration mismatch
**Problem**: The package uses `"publishConfig": { "access": "restricted" }` but the web counterpart uses `"access": "public"`. If this is intended to be a paid/private package, this is fine. If not, it should be changed to `"public"`.
**Fix**: Verify the intended access level and update if needed.

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

### 3.4 Consolidate design system re-exports
**Problem**: The `src/index.ts` re-exports `variants`, `textVariants`, `designTokens`, and `colors` from `@sudobility/design`. This creates a transitive dependency that may confuse consumers about where these originate.
**Fix**: Consider removing the re-exports and letting consumers import directly from `@sudobility/design`. Document this in the migration guide.

### 3.5 Add React 19 compatibility testing
**Problem**: The package declares `react: "^18.0.0 || ^19.0.0"` as a peer dependency, but dev dependencies use React 18.3. React 19 compatibility is not verified.
**Fix**: Add a CI matrix that tests against both React 18 and React 19 to ensure forward compatibility.

### 3.6 Add source map to CJS build
**Problem**: The Vite config has `sourcemap: true` but the CJS output may not generate source maps if Vite only applies it to the primary format.
**Fix**: Verify source maps are generated for both ESM and CJS outputs.
