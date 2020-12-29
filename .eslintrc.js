module.exports = {
  extends: [
    "google",
    "eslint:recommended"
  ],
  parserOptions: {
    ecmaVersion: 10,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ["import", "jest"],
  env: {
    "es6": true,
    "node": true,
    "jest/globals": true
  },
  rules: {
    "max-len": ["warn", { "code": 100 }],
    "semi": ["error", "never"],
    "quotes": ["error", "double"],
    "arrow-body-style": "off",
    "camelcase": "warn",
    "func-names": "off",
    "arrow-parens": ["error", "as-needed"],
    "comma-dangle": ["error", "never"],
    "indent": ["error", 2, { "FunctionDeclaration": { "body": 1, "parameters": 2 } }],
    "object-curly-spacing": ["error", "always"],
    "global-require": "warn",
    "import/no-dynamic-require": "warn",
    "import/no-extraneous-dependencies": "off",
    "no-console": "off",
    "no-multi-assign": "off",
    "no-param-reassign": "warn",
    "no-plusplus": "off",
    "no-shadow": "warn",
    "no-underscore-dangle": "warn",
    "no-unused-expressions": ["error", { "allowShortCircuit": true, "allowTernary": true }],
    "no-nested-ternary": "off",
    "no-unused-vars": "warn",
    "no-invalid-this": "off",
    "prefer-destructuring": "off",
    "require-jsdoc": "off",
    "valid-jsdoc": "off"
  },
  overrides: [
    {
      files: ["*.spec.js"],
      rules: {
        "no-unused-expressions": "off"
      }
    }
  ]
}
