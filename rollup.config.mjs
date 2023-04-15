import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import commonjs from '@rollup/plugin-commonjs';
import shebang from 'rollup-plugin-preserve-shebang';

export default {
  input: 'bin/cli.ts',
  output: [
    {
      file: 'dist/bundle.js',
      format: 'umd',
    },
    {
      file: 'dist/bundle.min.js',
      format: 'umd',
      plugins: [terser()],
    },
  ],
  plugins: [
    typescript({ module: 'esnext' }),
    commonjs(),
    shebang({ shebang: '#!/usr/bin/env node' }),
  ],
};
