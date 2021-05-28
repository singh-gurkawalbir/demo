module.exports = {
  bail: false,
  testRegex: undefined,
  roots: [
    '<rootDir>/src',
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
    '^.+\\.css$': '<rootDir>/jest/cssTransform.js',
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '<rootDir>/jest/fileTransform.js',
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$',
    '^.+\\.module\\.(css|sass|scss)$',
  ],
  collectCoverageFrom: [
    // If we consistently follow the current abstractions,
    // these should be the only folders that need test coverage...
    'src/actions/**/*.{js,jsx}',
    'src/reducers/**/*.{js,jsx}',
    'src/sagas/**/*.{js,jsx}',
    'src/utils/**/*.{js,jsx}',
  ],
  setupFiles: ['<rootDir>/jest/setup.js', 'jest-date-mock', 'core-js'],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 72,
      functions: 79,
      lines: 80, // revert it back to 80 once we reach there. Lowering to enable a pre commit hook.
    },
  },
  // these variables are injected through webpack definePlugin and
  // are not injected in out test case, hence generating undefined errors
  // through globals we are able to inject these variables
  globals: {
    RELEASE_VERSION: 'some release version',
    LOGROCKET_IDENTIFIER: 'some logrocket identifier',
    LOGROCKET_IDENTIFIER_EU: 'some logrocket identifier europe',
  },
};
