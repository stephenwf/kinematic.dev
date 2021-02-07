// import typescript from '@rollup/plugin-typescript';
import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import visualizer from 'rollup-plugin-visualizer';
import replace from '@rollup/plugin-replace';
import json from '@rollup/plugin-json';
import compiler from '@ampproject/rollup-plugin-closure-compiler';
import * as path from 'path';
import pkg from './package.json';

// The path in the main repository to this bundle.
const entrypoint = '../../src/npm/helpers/index.ts';

const isProduction = process.env.NODE_ENV === 'production';

module.exports = [
  {
    input: path.join(__dirname, entrypoint),
    output: [
      {
        file: path.join(__dirname, pkg.web),
        name: 'Kinematic',
        format: 'umd',
        sourcemap: true,
        globals: {
          'node-fetch': 'fetch',
        },
      },
    ],
    plugins: [
      typescript({ target: 'es5', tsconfig: 'tsconfig.rollup.json' }),
      replace({
        'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
      }),
      resolve({ browser: true }), // so Rollup can find `ms`
      commonjs({ extensions: ['.js', '.ts'] }), // the ".ts" extension is required
      json(),
      isProduction && terser(),
      isProduction && compiler(),
      isProduction && visualizer({ filename: path.join(__dirname, 'stats.umd.html') }),
    ].filter(Boolean),
    external: ['node-fetch'],
  },
  {
    input: path.join(__dirname, entrypoint),
    output: [
      {
        file: path.join(__dirname, pkg.main),
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: path.join(__dirname, pkg.module),
        format: 'es',
        sourcemap: true,
      },
    ],
    external: ['crypto', ...Object.keys(pkg.dependencies || {})],
    plugins: [
      typescript({ tsconfig: 'tsconfig.rollup.json' }),
      replace({
        'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development'),
      }),
      resolve(), // so Rollup can find `ms`
      commonjs({ extensions: ['.js', '.ts'] }), // the ".ts" extension is required
      json(),
      isProduction && visualizer({ filename: path.join(__dirname, 'stats.cjs.html') }),
    ].filter(Boolean),
  },
];
