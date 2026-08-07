import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import reactPlugin from 'eslint-plugin-react'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  // `ios-app/ios` is the generated Xcode project; `cap sync` copies the built
  // web bundle into it, so linting it means linting dist/ a second time.
  globalIgnores(['dist', 'ios-app/ios']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: {
      react: reactPlugin,
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    rules: {
      'no-unused-vars': ['error', { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],
      'react/jsx-uses-vars': 'error',
      // Raw Supabase errors carry SQLSTATE codes, constraint names, and hints.
      // Route diagnostics through src/utils/devLog.js so they are stripped from
      // the production bundle instead of printed in a visitor's console.
      'no-console': ['error', { allow: ['info'] }],
    },
  },
  {
    // The dev-only logger and the Node-side build/verification scripts are the
    // legitimate console callers.
    files: ['src/utils/devLog.js', 'scripts/**/*.mjs', 'worker/**/*.js'],
    rules: { 'no-console': 'off' },
  },
])
