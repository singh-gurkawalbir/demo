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
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
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
    'react-hooks'
  ],
  rules: {
    // Override AirBnB's configuration of 'always', since they only set that value due to
    // babel-preset-airbnb not supporting class properties, whereas @neutrinojs/react does.
    'react/state-in-constructor': ['error', 'never'],
    // Disable rules for which there are eslint-plugin-babel replacements:
    // https://github.com/babel/eslint-plugin-babel#rules
    'new-cap': 'off',
    'no-invalid-this': 'off',
    'object-curly-spacing': 'off',
    semi: 'off',
    'no-unused-expressions': 'off',
    'babel/no-invalid-this': airbnbBaseBestPractices['no-invalid-this'],
    // // The worker/serviceworker envs above don't properly respect
    // // the `self` global with the Airbnb preset rules
    // // https://github.com/airbnb/javascript/issues/1632
    'no-restricted-globals': airbnbBaseRules[
      'no-restricted-globals'
    ].filter(global => global !== 'self'),
    // Prefer double or quotes in JSX attributes
    // http://eslint.org/docs/rules/jsx-quotes
    'jsx-quotes': ['error', 'prefer-double'],
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
    // Must be coupled with no-extra-parens: off
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
    'react/jsx-indent': 1,
    'react/prefer-stateless-function': 'off',
    'react/prop-types': 'off',
    'react/sort-comp': 'off',
    // Too strict for now:
    'react/forbid-prop-types': 'off',
    // Can produce false-positives:
    'react/no-unused-prop-types': 'off',
    // Doesn't always help with a lot of PureComponents:
    'react/require-default-props': 'off',
    // The following rules are set by our UI team
    'max-len': 'off',
    'react/jsx-filename-extension': [
      1,
      { extensions: ['.js', '.jsx'] },
    ],
    'react/no-did-mount-set-state': 'off',
    'no-underscore-dangle': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 1,
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: ['draft', 'acc', 'response'],
      },
    ],
    'react/jsx-props-no-spreading': 'off',
    'arrow-parens': 'off',
    'object-curly-newline': 'off',
    'function-paren-newline': 'off',
    'comma-dangle': 'off',
    'implicit-arrow-linebreak': 'off',
    'react/destructuring-assignment': 'off',
    'import/no-extraneous-dependencies': [
      'error', 
      {
        'devDependencies': [
          '*.config.js',
          'jest/*',
          '**/test/**/*.js',
          '**/test.js',
          '**/test.*.js',
          '**/*.test.js',
          '**/*.spec.js'
        ]
      }
    ],
    'no-shadow': 'off',
    'no-confusing-arrow': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/jsx-wrap-multilines': 'off',
    // The following rules would actually benefit us if turned on
    // they are turned off so that we can transition into the new toolchain more easily
    'operator-linebreak': 'off',
    'consistent-return': 'off',
    'import/no-cycle': 'off',
  },
};
