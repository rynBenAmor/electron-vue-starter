//npm init @eslint/config@latest
//npx eslint src --ext .js,.vue
import js from "@eslint/js";
import globals from "globals";
import pluginVue from "eslint-plugin-vue";
import json from "@eslint/json";
import { defineConfig } from "eslint/config";

export default defineConfig([
    {
    ignores: [
      "node_modules",
      "dist",
      "dist-*",
      "out",
      "build",
      "*.config.*",
    ],
  },
  {
    files: ["**/*.{js,mjs,cjs,mts,cts,vue}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },

  // * vue
  pluginVue.configs["flat/essential"],

  {
    files: ["**/*.jsonc"],
    plugins: { json },
    language: "json/jsonc",
    extends: ["json/recommended"],
  },

]);
