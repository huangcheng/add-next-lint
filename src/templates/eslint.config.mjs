// eslint-disable-next-line unicorn/import-style
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { FlatCompat } from '@eslint/eslintrc';
// import jsdoc from 'eslint-plugin-jsdoc';
import unicorn from 'eslint-plugin-unicorn';

import { recommended } from '@cspell/eslint-plugin/configs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  //...compat.extends('next/core-web-vitals', 'next/typescript'),
  unicorn.configs.recommended,
  // jsdoc.configs['flat/recommended-typescript-error'],
  recommended,
  ...compat.config({
    parser: '@typescript-eslint/parser',
    extends: [
      'next',
      'plugin:@typescript-eslint/recommended',
      'plugin:import/recommended',
      'plugin:import/typescript',
      'plugin:import/react',
    ],
    plugins: ['prettier', 'import'],
    settings: {
      'import/resolver': {
        typescript: true,
      },
      'import/parsers': {
        '@typescript-eslint/parser': ['.ts', '.tsx'],
      },
    },
    rules: {
      'prettier/prettier': 'error',
      'react-hooks/exhaustive-deps': 'error',
      'unicorn/no-abusive-eslint-disable': 'off',
      'unicorn/prevent-abbreviations': [
        'error',
        {
          checkProperties: false,
          checkVariables: false,
          replacements: {
            ref: false,
            props: false,
            propsWithCallback: false,
            propsWithChildren: false,
            propsWithRef: false,
            propsWithRenderProps: false,
            propsWithRenderProp: false,
            propsWithRenderPropsChildren: false,
          },
        },
      ],
    },
  }),
];

export default eslintConfig;
