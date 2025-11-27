// Jest setup file for React Native Testing Library
require('@testing-library/react-native/extend-expect');

// Mock react-native modules that don't work in test environment
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock NativeWind
jest.mock('nativewind', () => ({
  styled: (component) => component,
}));
