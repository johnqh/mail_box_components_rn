// Jest setup file for React Native Testing Library
require('@testing-library/jest-native/extend-expect');

// Mock @sudobility/design
jest.mock('@sudobility/design', () => ({
  variants: new Proxy(
    {},
    {
      get: () =>
        new Proxy(
          {},
          {
            get: () =>
              new Proxy(() => '', {
                get: () => () => '',
              }),
          }
        ),
    }
  ),
  textVariants: new Proxy(
    {},
    {
      get: () =>
        new Proxy(
          {},
          {
            get: () => () => '',
          }
        ),
    }
  ),
  designTokens: {},
  colors: {},
  getCardVariantColors: () => '',
}));

// Mock NativeWind
jest.mock('nativewind', () => ({
  styled: (component) => component,
}));
