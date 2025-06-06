const js = require("@eslint/js");
const globals = require("globals");
const react = require("eslint-plugin-react");
const reactHooks = require("eslint-plugin-react-hooks");
const reactRefresh = require("eslint-plugin-react-refresh");
const tseslint = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");
const jestPlugin = require("eslint-plugin-jest");
const babelEslintParser = require("@babel/eslint-parser");

module.exports = [
  { ignores: ["dist", "coverage/", "node_modules/", "public/"] },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        jest: true,
      },
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    settings: { react: { version: "18.3" } },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      jest: jestPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      "react/jsx-no-target-blank": "off",
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "jest/no-disabled-tests": "warn",
      "jest/no-focused-tests": "error",
      "jest/no-identical-title": "error",
      "jest/prefer-to-have-length": "warn",
    },
  },
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
    },
  },
  {
    files: ["**/*.test.{js,jsx,ts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.jest,
        global: true,
        jest: true,
        describe: true,
        test: true,
        expect: true,
        require: true,
        module: true,
      },
    },
  },
  {
    files: ["vite.config.js"],
    languageOptions: {
      parser: babelEslintParser, // use the imported parser object here
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ["@babel/preset-env"],
        },
        ecmaVersion: 2022,
        sourceType: "module",
      },
    },
  },
  {
    files: ["babel.config.js", "__mocks__/**", "**/*.config.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: {
        module: true,
        require: true,
        exports: true,
      },
    },
  },
  {
    files: ["jest.setup.js"],
    languageOptions: {
      globals: {
        ...globals.jest,
        jest: true,
        global: true,
        module: true,
      },
    },
  },
];
