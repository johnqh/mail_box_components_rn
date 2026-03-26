/** @type {import('jest').Config} */
module.exports = {
  preset: 'react-native',
  setupFiles: ['./jest.globals.cjs'],
  setupFilesAfterEnv: ['./jest.setup.cjs'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testMatch: ['<rootDir>/src/**/__tests__/**/*.test.{ts,tsx}'],
  testPathIgnorePatterns: ['/node_modules/', '/packages/'],
  transformIgnorePatterns: [
    // Bun stores deps in node_modules/.bun/<pkg>@<ver>/node_modules/<pkg>/
    'node_modules/(?!(\\.bun/[^/]+/node_modules/)?(react-native|@react-native|nativewind|react-native-reanimated|clsx|class-variance-authority|@testing-library)/)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@sudobility/components-rn$': '<rootDir>/src/index.ts',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
  ],
};
