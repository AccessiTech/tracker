module.exports = {
  env: {
    browser: true,
    es2021: true,
    jest: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:jsx-a11y/recommended",
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint", "jsx-a11y"],
  rules: {
    "@typescript-eslint/no-unused-vars": "warn",
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx", "**/*.ts", "**/*.tsx"],
      parser: "@typescript-eslint/parser",
    },
  ],
};
