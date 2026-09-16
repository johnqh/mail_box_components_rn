// Jest mocks — runs before modules are loaded (setupFiles)

// Deep proxy returns empty strings for function calls and nested proxies for property access.
// This allows any depth of property access (e.g., colors.component.badge.primary.base).
function createDeepProxy() {
  return new Proxy(() => '', {
    get: (_target, prop) => {
      if (prop === 'then') return undefined;
      if (prop === Symbol.toPrimitive) return () => '';
      if (prop === Symbol.iterator) return undefined;
      return createDeepProxy();
    },
    apply: () => '',
  });
}

jest.mock('@sudobility/design', () => ({
  variants: createDeepProxy(),
  textVariants: createDeepProxy(),
  designTokens: createDeepProxy(),
  colors: createDeepProxy(),
  Colors: createDeepProxy(),
  Tokens: createDeepProxy(),
  Typography: createDeepProxy(),
  Variants: createDeepProxy(),
  ui: createDeepProxy(),
  cn: (...args) => args.filter(Boolean).join(' '),
  getCardVariantColors: () => '',
  getCalloutVariantColors: () => ({ background: '', text: '' }),
  getSectionBadgeColors: () => ({ container: '', icon: '' }),
  getStatusIndicatorColor: () => '',
  statusIndicatorColors: createDeepProxy(),
  getColorClasses: () => '',
  buildColorClass: () => '',
  buttonVariant: () => '',
  focusRing: '',
  focusVisible: '',
  GRADIENTS: createDeepProxy(),
  GRADIENT_CLASSES: createDeepProxy(),
  SEMANTIC_COLOR_MAP: createDeepProxy(),
}));

// Mock @sudobility/components-rn for subpackage tests that don't resolve to source.
// Provides the most commonly used utilities; subpackage tests can override with
// jest.mock() in individual test files if they need more specific mocks.
jest.mock('@sudobility/components-rn', () => ({
  cn: (...args) => args.filter(Boolean).join(' '),
  /*
    Real implementations, not fakes: `pressProps` is what wires both activation
    routes on every touchable in every sibling package, so a stub here would
    make each package's accessibility-tap tests prove nothing about what ships.
    Kept in step with `src/lib/a11y.ts` by those tests — they fail if this
    returns anything else.
  */
  accessibilityTap: (onPress, disabled) =>
    !onPress || disabled ? undefined : () => onPress(undefined),
  pressProps: (onPress, disabled) => ({
    onPress: onPress ?? undefined,
    onAccessibilityTap:
      !onPress || disabled ? undefined : () => onPress(undefined),
  }),
}));

// Mock NativeWind
jest.mock('nativewind', () => ({
  styled: (component) => component,
}));
