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
      name: 'SudobilitySubscriptionComponentsRN',
      formats: ['es', 'cjs'],
      fileName: format => {
        return format === 'es' ? 'index.mjs' : 'index.js';
      },
    },
    rollupOptions: {
      external: [
        'react',
        'react-native',
        'react-native-safe-area-context',
        'react-native-svg',
        'react-native-gesture-handler',
        'react-native-reanimated',
        'react-native-purchases',
        '@sudobility/components-rn',
        '@sudobility/design',
      ],
      output: {
        globals: {
          react: 'React',
          'react-native': 'ReactNative',
          'react-native-purchases': 'RNPurchases',
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
