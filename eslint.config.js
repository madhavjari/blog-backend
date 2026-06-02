const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: "commonjs", // Since you had commonjs: true before
      globals: {
        ...globals.node, // This replaces "node": true
      },
    },
  },
];
