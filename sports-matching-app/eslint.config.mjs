import globals from "globals";
import pluginReact from "eslint-plugin-react";


/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["**/*.{js,mjs,cjs,jsx}"]},
  {ignores: ["dist/", ".expo/", "node_modules/"]},
  {languageOptions: { globals: globals.browser }},
  {settings: {
    react: {
      version: "detect", // Automatically detects React version
    },
  },},
  pluginReact.configs.flat.recommended,
];
