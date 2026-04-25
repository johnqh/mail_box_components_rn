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
}));

// Mock NativeWind
jest.mock('nativewind', () => ({
  styled: (component) => component,
}));
