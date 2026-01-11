import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'SudobilityRatelimitComponentsRN',
      formats: ['es', 'cjs'],
      fileName: (format) => {
        return format === 'es' ? 'index.mjs' : 'index.js';
      },
    },
    rollupOptions: {
      external: [
        'react',
        'react-native',
        'react-native-svg',
        '@sudobility/components-rn',
        '@sudobility/design',
      ],
      output: {
        globals: {
          react: 'React',
          'react-native': 'ReactNative',
          'react-native-svg': 'ReactNativeSvg',
          '@sudobility/components-rn': 'SudobilityComponentsRN',
          '@sudobility/design': 'SudobilityDesign',
        },
      },
    },
    sourcemap: true,
    minify: false,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
