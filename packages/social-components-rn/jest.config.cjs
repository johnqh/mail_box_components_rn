const path = require('path');
const rootDir = path.resolve(__dirname, '../..');

/** @type {import('jest').Config} */
module.exports = {
  preset: 'react-native',
  setupFiles: [path.resolve(rootDir, 'jest.globals.cjs'), path.resolve(rootDir, 'jest.mocks.cjs')],
  setupFilesAfterEnv: [path.resolve(rootDir, 'jest.setup.cjs')],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testMatch: ['**/__tests__/**/*.test.{ts,tsx}'],
  transformIgnorePatterns: [
    rootDir +
      '/node_modules/(?!(\\.bun/[^/]+/node_modules/)?(react-native|@react-native|nativewind|react-native-reanimated|clsx|class-variance-authority|@testing-library|@sudobility)/)',
  ],
  roots: [__dirname],
};
