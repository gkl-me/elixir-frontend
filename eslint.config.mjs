import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";
import unusedImports from "eslint-plugin-unused-imports";
import reactPlugin from "eslint-plugin-react";
import prettier from "eslint-config-prettier";

export default [
  // Ignore files
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "dist/**",
      "build/**",
      "coverage/**",
      "public/**",
    ],
  },

  // Base JS rules
  js.configs.recommended,

  //TypeScript setup
  ...tseslint.configs.recommended,
  prettier,

  //Next.js plugin
  {
    plugins: {
      "@next/next": nextPlugin,
      import: importPlugin,
      "unused-imports": unusedImports,
      react: reactPlugin,
    },
    rules: {
      //General
      "no-console": "warn",
      "no-debugger": "error",
      eqeqeq: ["error", "always"],
      curly: "error",
      "prefer-const": "error",

      //TypeScript
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      // "@typescript-eslint/consistent-type-imports": "error",

      //Imports
      "unused-imports/no-unused-imports": "warn",

      //react and next
      "react/jsx-key": "error",
      "react/react-in-jsx-scope": "off",
      "@next/next/no-img-element": "warn",
    },
  },
];
