// eslint.config.mjs
// @ts-check

import eslint from '@eslint/js';
import astroPlugin from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.astro'],
    ...astroPlugin.configs.recommended,
    rules: {
      'astro/no-set-html-directive': 'off',
    },
  },
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.astro/**',
      'public/**',
      'test-results/**',
    ],
  }
);