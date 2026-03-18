const path = require('path');
const monoRoot = path.resolve(__dirname, '../..');

/** @type {import('jest').Config} */
module.exports = {
  preset: 'react-native',
  rootDir: __dirname,
  setupFiles: [path.join(monoRoot, 'jest.globals.cjs')],
  setupFilesAfterEnv: [path.join(monoRoot, 'jest.setup.cjs')],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testMatch: ['**/__tests__/**/*.test.{ts,tsx}'],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': [
      'babel-jest',
      { configFile: path.join(monoRoot, 'babel.config.cjs') },
    ],
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(\\.bun/[^/]+/node_modules/)?(react-native|@react-native|nativewind|react-native-reanimated|clsx|class-variance-authority|@testing-library)/)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
  ],
};
