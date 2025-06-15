import path from "path";
import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig([
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"], plugins: { js }, extends: ["js/recommended"] },
  // { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"], languageOptions: { globals: globals.browser } },
  {
    files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        process: 'readonly',
        __dirname: 'readonly',
      },
      ecmaVersion: 2022,
      sourceType: 'module',
    },
  },
  { ignores: ['dist/**', 'node_modules/**'], },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    settings: {
      react: {
        version: "detect",
        jsxRuntime: "automatic",
      }, 'import/resolver': {
        alias: {
          map: [
            ['@assets', path.resolve(__dirname, 'src/assets')],
            ['@globalComps', path.resolve(__dirname, 'src/globals/components')],
            ['@globals', path.resolve(__dirname, 'src/globals')],
            ['@redux', path.resolve(__dirname, 'src/redux')],
            ['@screens', path.resolve(__dirname, 'src/screens')],
            ['@utils', path.resolve(__dirname, 'src/utils')],
            ['@', path.resolve(__dirname, 'src')],
          ],
          extensions: ['.ts', '.tsx', '.js', '.jsx', '.scss'],
        },
      },
    },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/jsx-uses-vars": "error",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: '^_', args: "all" }],
      "no-restricted-imports": [
        "error",
        {
          paths: [],
          patterns: [
            '**/../assets/*',
            '**/../globals/*',
            '**/../redux/*',
            '**/../screens/*',
            '**/../utils/*',
          ],
        },
      ],
      "no-duplicate-imports": "error",
      "no-console": "warn",
      "no-unreachable": "error",
      "no-undef": "error",
      "no-trailing-spaces": "error",
      "no-unused-vars": "off",
      "no-extra-semi": "error",
      "no-nested-ternary": "error",
      "no-multiple-empty-lines": ["error", { max: 1, maxEOF: 0 }],
      "no-var": "error",
      "jsx-quotes": ["warn", "prefer-double"],
    },
  },
]);