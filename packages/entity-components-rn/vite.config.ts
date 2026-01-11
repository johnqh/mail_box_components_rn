import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'SudobilityEntityComponentsRN',
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`,
    },
    rollupOptions: {
      external: [
        'react',
        'react-native',
        '@sudobility/components-rn',
        '@sudobility/design',
        '@sudobility/types',
      ],
      output: {
        globals: {
          react: 'React',
          'react-native': 'ReactNative',
          '@sudobility/components-rn': 'SudobilityComponentsRN',
          '@sudobility/design': 'SudobilityDesign',
          '@sudobility/types': 'SudobilityTypes',
        },
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});
