/*
  This package shipped without a jest config, so `bun run test` ran jest with
  its defaults: no React Native preset, no TypeScript transform, and therefore
  no way for a `.tsx` test to run at all. It reported "No tests found" and
  passed. Copied from `auth-components-rn`, which had one.
*/
const path = require('path');
const monoRoot = path.resolve(__dirname, '../..');

/** @type {import('jest').Config} */
module.exports = {
  /*
    The preset and the modules come from the monorepo root, not from this
    package. Its own `react-native` is 0.85/0.86, which moved `jest-preset` out
    into `@react-native/jest-preset` — a package nothing here installs — so
    `preset: 'react-native'` fails outright. Resolving from the root also puts
    every package's tests on the one React Native the repo actually tests
    against, which is what the packages that already had a jest config do by
    accident of having the same version installed.
  */
  preset: path.join(monoRoot, 'node_modules/react-native'),
  rootDir: __dirname,
  setupFiles: [path.join(monoRoot, 'jest.globals.cjs'), path.join(monoRoot, 'jest.mocks.cjs')],
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
    '/node_modules/(?!(\\.bun/[^/]+/node_modules/)?(react-native|@react-native|nativewind|react-native-reanimated|clsx|class-variance-authority|@testing-library|@sudobility)/)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    // `modulePaths` is not enough: jest walks up to the nearest node_modules
    // first, which is this package's own React Native.
    // React too: this package has React 19 installed while the repo tests on
    // 18, and two React copies in one tree render a child element as a bare
    // object ("Objects are not valid as a React child").
    '^react$': path.join(monoRoot, 'node_modules/react'),
    '^react/(.*)$': path.join(monoRoot, 'node_modules/react/$1'),
    '^react-native$': path.join(monoRoot, 'node_modules/react-native'),
    '^react-native/(.*)$': path.join(monoRoot, 'node_modules/react-native/$1'),
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
  ],
};
