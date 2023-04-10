const {
  rules: airbnbBaseBestPractices,
} = require('eslint-config-airbnb-base/rules/best-practices');
const {
  rules: airbnbBaseRules,
} = require('eslint-config-airbnb-base/rules/variables');

module.exports = {
  parser: 'babel-eslint',
  env: {
    browser: true,
    es6: true,
    "jest/globals": true
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'plugin:jest/all'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    ALLOW_SIGNUP: 'readonly',
    ALLOW_GOOGLE_SIGNIN: 'readonly',
    ALLOW_SIGNUP_EU: 'readonly',
    ALLOW_GOOGLE_SIGNIN_EU: 'readonly',
    ENABLE_HELP_CONTENT: 'readonly'
  },
  parserOptions: {
    ecmaFeatures: {
      legacyDecorators: true,
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: [
    'react',
    'react-hooks',
    'jest'
  ],
  rules: {
    // Jest rules
    'jest/prefer-expect-assertions': 'off',
    'jest/consistent-test-it':["error", {"fn": "test"}],
    'jest/no-hooks': 'off',
    'jest/require-hook': 'off',
    'jest/no-done-callback': 'off',
    'jest/prefer-strict-equal': 'off',
    'jest/require-to-throw-message': 'off',
    'jest/prefer-lowercase-title': 'off',
    "jest/max-expects": "off",
    'jest/no-alias-methods': 'off',
    'jest/prefer-spy-on': 'off',
    'jest/prefer-called-with':'off',
    'jest/expect-expect': ["error", { "assertFunctionNames": ["expect", "expectSaga"] }],
    'jest/no-conditional-in-test': 'off',
    // Enable anchors with react-router Link
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['to'],
      },
    ],
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    // Override AirBnB's configuration of 'always', since they only set that value due to
    // babel-preset-airbnb not supporting class properties, whereas @neutrinojs/react does.
    'react/state-in-constructor': ['error', 'never'],
    // Disallow spaces for JSX attribute braces interior
    // JSX braces are interpolation, not objects
    'react/jsx-curly-spacing': ['error', 'never'],
    // Disallow spaces around JSX attribute assignment equals
    // (idiomatic HTML)
    'react/jsx-equals-spacing': ['error', 'never'],
    // Require JSX props to be on new lines when a component is multiline
    // improves readability
    'react/jsx-first-prop-new-line': ['error', 'multiline'],
    // Ensure JSX props are indented 2 spaces from opening tag
    'react/jsx-indent-props': ['error', 2],
    // Validate JSX has key prop when in array or iterator
    'react/jsx-key': 'error',
    // Prevent comments from being inserted as text nodes
    'react/jsx-no-comment-textnodes': 'error',
    // Prevent usage of unsafe target="_blank"
    // ensure anchors also have rel="noreferrer noopener"
    'react/jsx-no-target-blank': 'error',
    // Ensure JSX components are PascalCase
    'react/jsx-pascal-case': 'error',
    // Require space before self-closing bracket in JSX
    'react/jsx-tag-spacing': ['error', { beforeSelfClosing: 'always' }],
    // Ensure multiline JSX is wrapped in parentheses (idiomatic React)
    // Must be coupled with 
    'no-extra-parens': 'off',
    'react/jsx-wrap-multilines': 'error',
    // Disable enforcement of React PropTypes
    'react/default-props-match-prop-types': 'off',
    'react/jsx-closing-bracket-location': 'off',
    'react/jsx-handler-names': [
      'error',
      {
        eventHandlerPrefix: 'handle',
        eventHandlerPropPrefix: 'on',
      },
    ],
    'react/jsx-indent': 'warn',
    'react/prefer-stateless-function': 'off',
    'react/prop-types': 'off',
    'react/sort-comp': 'off',
    // Too strict for now:
    'react/forbid-prop-types': 'off',
    // Can produce false-positives:
    'react/no-unused-prop-types': 'off',
    // Doesn't always help with a lot of PureComponents:
    'react/require-default-props': 'off',
    'react/jsx-filename-extension': [
      'warn',
      { extensions: ['.js', '.jsx'] },
    ],
    'react/no-did-mount-set-state': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/jsx-props-no-spreading': 'off',
    "react/jsx-max-props-per-line": ['error', { maximum: 4, when: 'always' }],
    'react/destructuring-assignment': 'off',
    'react/jsx-one-expression-per-line': 'off',

    // Disable rules for which there are eslint-plugin-babel replacements:
    // https://github.com/babel/eslint-plugin-babel#rules
    'new-cap': 'off',
    'no-invalid-this': 'off',
    'object-curly-spacing': 'off',
    'semi': 'error',
    'no-unused-expressions': 'off',
    // Prefer double or quotes in JSX attributes
    // http://eslint.org/docs/rules/jsx-quotes
    'jsx-quotes': ['error', 'prefer-double'],
    'babel/no-invalid-this': airbnbBaseBestPractices['no-invalid-this'],
    // // The worker/serviceworker envs above don't properly respect
    // // the `self` global with the Airbnb preset rules
    // // https://github.com/airbnb/javascript/issues/1632
    'no-restricted-globals': airbnbBaseRules[
      'no-restricted-globals'
    ].filter(global => global !== 'self'),
    // This is a lot of custom work to fix line length...
    // save this change for last.
    'max-len': 'off', // ['error', { code: 120, ignoreComments: true }],
    'no-underscore-dangle': 'off',
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: ['draft', 'acc', 'response'],
      },
    ],
    'arrow-parens': ['error', 'as-needed'],
    'object-curly-newline': 'off',
    'function-paren-newline': 'off',
    'comma-dangle': ['error', { 
      objects: 'always-multiline', 
      arrays: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'only-multiline',
      // functions: 'never' }
    }],
    'implicit-arrow-linebreak': 'off',
    'import/no-extraneous-dependencies': [
      'error', 
      {
        'devDependencies': [
          '*.config.js',
          'jest/*',
          '**/test/**/*.js',
          '**/test.js',
          '**/test.jsx',
          '**/test.*.js',
          '**/*.test.js',
          '**/*.test.jsx',
          '**/*.spec.js'
        ]
      }
    ],
    'no-shadow': 'off',
    'no-confusing-arrow': 'off',
    'no-multiple-empty-lines': ['error', { 'max': 1 }],
    'no-multi-spaces': ["error", { 'ignoreEOLComments': true }],
    'key-spacing': 'error',
    'padding-line-between-statements': [
      "error",
      { blankLine: "always", prev: "*", next: ["return"] },
      { blankLine: "always", prev: ["export", "const", "let", "var"], next: "*"},
      { blankLine: "any",    prev: ["export", "const", "let", "var"], next: ["export", "const", "let", "var"]},
    ],
    'operator-linebreak': ["error", "after", { "overrides": { "?": "before", ":": "before" } }],
    // The following rules would actually benefit us if turned on
    // they are turned off so that we can transition into the new toolchain more easily
    'consistent-return': 'off',
    'import/no-cycle': 'off',
    'import/prefer-default-export': 'off',
  },
};
