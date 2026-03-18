const path = require('path');
const rootConfig = require('../../jest.config.cjs');
const rootDir = path.resolve(__dirname, '../..');

/** @type {import('jest').Config} */
module.exports = {
  ...rootConfig,
  rootDir: '.',
  setupFiles: [path.join(rootDir, 'jest.globals.cjs')],
  setupFilesAfterEnv: [path.join(rootDir, 'jest.setup.cjs')],
  moduleNameMapper: {
    '^@sudobility/components-rn$': path.join(rootDir, 'src/index.ts'),
  },
};
