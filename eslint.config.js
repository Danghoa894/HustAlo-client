// eslint.config.js — rule client của monorepo HustAlo (development_guide.md §8.2), đường dẫn tính từ gốc HustAlo-client.
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const restrictedSyntax = [
  {
    selector: "CallExpression[callee.property.name='skip']",
    message: 'Cấm phân trang bằng skip — dùng cursor (createdAt, _id) (CLAUDE.md, D-20).',
  },
  {
    selector: "MemberExpression[object.name='localStorage'][property.name=/^(setItem)$/] > Literal[value=/token/i]",
    message: 'Không lưu token vào localStorage (access token chỉ ở RAM).',
  },
  {
    selector:
      "CallExpression[callee.object.name='localStorage'][callee.property.name='setItem'] > Literal[value=/token/i]",
    message: 'Không lưu token vào localStorage (access token chỉ ở RAM).',
  },
];

const hustaloRules = {
  'no-console': 'error',
  '@typescript-eslint/no-explicit-any': 'error',
  '@typescript-eslint/ban-ts-comment': ['error', { 'ts-expect-error': 'allow-with-description' }],
  'react/no-danger': 'error',
  'react-hooks/rules-of-hooks': 'error',
  'react-hooks/exhaustive-deps': 'error',
  'import/no-cycle': 'error',
  'no-restricted-syntax': ['error', ...restrictedSyntax],
};

const clientForbidden = ['mongoose', 'ioredis'];
const toServer = { group: ['**/server/**', '@hustalo/server', '@hustalo/server/*'] };
const nodeBuiltins = { regex: '^node:', message: 'client không dùng module Node (node:*).' };
const restrict = (paths, patterns) => [
  'error',
  {
    paths: paths.map((name) => ({ name, message: 'Import bị cấm ở thư mục này (development_guide.md §8.2).' })),
    patterns: patterns.map((p) => ({
      ...p,
      message: p.message ?? 'Import bị cấm ở thư mục này (development_guide.md §8.2).',
    })),
  },
];

export default tseslint.config(
  {
    ignores: [
      '**/node_modules/**',
      '**/dist/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      'lighthouse-report/**',
      '.lighthouseci/**',
      '.claude/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    ...react.configs.flat.recommended,
    ...react.configs.flat['jsx-runtime'],
    plugins: { react, 'react-hooks': reactHooks },
    settings: { react: { version: 'detect' } },
    languageOptions: { globals: globals.browser },
  },
  {
    files: ['**/*.{ts,tsx}'],
    rules: { ...react.configs.flat.recommended.rules, ...react.configs.flat['jsx-runtime'].rules },
  },
  {
    plugins: { react, 'react-hooks': reactHooks },
    rules: {
      ...hustaloRules,
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
      '@typescript-eslint/restrict-template-expressions': ['error', { allowNumber: true }],
      '@typescript-eslint/no-confusing-void-expression': ['error', { ignoreArrowShorthand: true }],
    },
  },
  {
    plugins: { import: importPlugin },
    settings: {
      'import/resolver': { typescript: { alwaysTryTypes: true } },
      'import/parsers': { '@typescript-eslint/parser': ['.ts', '.tsx'] },
    },
    rules: { 'import/no-cycle': 'error' },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    rules: { 'no-restricted-imports': restrict(clientForbidden, [toServer, nodeBuiltins]) },
  },
  {
    // Script Node (CLI) và file cấu hình JS: không type-check, được in ra console.
    files: ['**/*.{js,mjs,cjs}'],
    ...tseslint.configs.disableTypeChecked,
    languageOptions: { ...tseslint.configs.disableTypeChecked.languageOptions, globals: globals.node },
    rules: { ...tseslint.configs.disableTypeChecked.rules, 'no-console': 'off' },
  },
  {
    // theme-init.js chạy trong trình duyệt trước khi bundle tải, không phải module.
    files: ['public/**/*.js'],
    languageOptions: {
      ...tseslint.configs.disableTypeChecked.languageOptions,
      globals: globals.browser,
      sourceType: 'script',
    },
  },
  prettier,
);
