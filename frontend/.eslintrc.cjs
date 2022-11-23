module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    "airbnb",
    "airbnb-typescript",
    "airbnb/hooks",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  overrides: [],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint", "prettier"],
  rules: {
    "react/react-in-jsx-scope": 0,
    "react/function-component-definition": 0,
    "react/jsx-props-no-spreading": 0,
    "react/no-unused-prop-types": 0,
    "react/require-default-props": 0,
    "jsx-a11y/anchor-is-valid": 0,
    "import/no-named-as-default": 0,
    "consistent-return": 0,
    "no-nested-ternary": 0,
    "import/no-named-as-default": 0,
  },
};
