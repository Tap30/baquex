import jsLint from "@eslint/js";
import vitestPlugin from "@vitest/eslint-plugin";
import commentsPlugin from "eslint-plugin-eslint-comments";
import prettierRecommendedConfig from "eslint-plugin-prettier/recommended";
import { config, configs as tsLintConfigs } from "typescript-eslint";

export default config(
  jsLint.configs.recommended,
  tsLintConfigs.recommendedTypeChecked,
  prettierRecommendedConfig,
  {
    files: ["*.ts", "*.tsx"],
  },
  {
    ignores: ["**/dist/"],
  },
  {
    languageOptions: {
      parserOptions: {
        project: true,
        projectService: {
          allowDefaultProject: ["eslint.config.js"],
          defaultProject: "./tsconfig.json",
        },
        sourceType: "module",
      },
    },
  },
  {
    files: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
    plugins: {
      "@vitest": vitestPlugin,
    },
    rules: {
      ...vitestPlugin.configs["legacy-recommended"].rules,
    },
  },
  {
    plugins: {
      "eslint-comments": commentsPlugin,
    },
    rules: {
      "eslint-comments/disable-enable-pair": "error",
      "eslint-comments/no-aggregating-enable": "error",
      "eslint-comments/no-duplicate-disable": "error",
      "eslint-comments/no-unlimited-disable": "error",
      "eslint-comments/no-unused-enable": "error",
      "eslint-comments/no-unused-disable": "error",
    },
  },
  {
    rules: {
      "no-alert": "error",
      "no-console": "warn",
      "prefer-const": "error",
      "default-case": "error",
      "eol-last": "error",
      "object-shorthand": "error",
      "require-atomic-updates": "error",
      "no-unused-private-class-members": "warn",
      "no-promise-executor-return": "error",
      "no-unmodified-loop-condition": "warn",
      eqeqeq: ["error", "smart"],
      "no-duplicate-imports": [
        "error",
        {
          includeExports: true,
        },
      ],
      "@typescript-eslint/unbound-method": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          fixStyle: "inline-type-imports",
        },
      ],
      "padding-line-between-statements": [
        "error",
        {
          blankLine: "always",
          prev: [
            "const",
            "let",
            "var",
            "directive",
            "import",
            "function",
            "class",
            "block",
            "block-like",
            "multiline-block-like",
          ],
          next: "*",
        },
        {
          blankLine: "any",
          prev: ["import"],
          next: ["import"],
        },
        {
          blankLine: "any",
          prev: ["directive"],
          next: ["directive"],
        },
        {
          blankLine: "any",
          prev: ["const", "let", "var"],
          next: ["const", "let", "var"],
        },
        {
          blankLine: "always",
          prev: ["multiline-const", "multiline-let"],
          next: "*",
        },
      ],
    },
  },
);
