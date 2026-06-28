import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
  ],
  // Route JSX through NativeWind's runtime so `className` props on the compiled
  // components are processed by react-native-css-interop in consuming RN apps.
  // Without this the bundle uses React's standard jsx-runtime and className is
  // inert (components render unstyled).
  esbuild: {
    jsx: 'automatic',
    jsxImportSource: 'nativewind',
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'SudobilityComponentsRN',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'esm' : format}.js`,
    },
    rollupOptions: {
      external: [
        'react',
        // jsx runtimes must stay external so the consumer's NativeWind handles them
        /^react\/jsx-(dev-)?runtime$/,
        /^nativewind(\/.*)?$/,
        /^react-native-css-interop(\/.*)?$/,
        'react-native',
        'react-native-gesture-handler',
        'react-native-reanimated',
        'react-native-safe-area-context',
        'react-native-svg',
        '@sudobility/design',
        'clsx',
        'class-variance-authority',
      ],
      output: {
        exports: 'named',
        globals: {
          react: 'React',
          'react-native': 'ReactNative',
        },
      },
    },
    sourcemap: true,
    minify: false,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
