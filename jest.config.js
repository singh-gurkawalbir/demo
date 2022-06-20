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
    'src/components/ResourceDrawerLink/.{js,jsx}',
    'src/components/RunFlowButton/.{js,jsx}',
    'src/components/ResourceFormWithStatusPanel/.{js,jsx}',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest/setup.js', 'jest-date-mock', 'core-js'],
  coverageThreshold: {
    global: {
      statements: 84,
      branches: 75,
      functions: 82,
      lines: 84,
    },
  },
  testURL: 'http://localhost:4000',
  // these variables are injected through webpack definePlugin and
  // are not injected in out test case, hence generating undefined errors
  // through globals we are able to inject these variables
  globals: {
    RELEASE_VERSION: 'some release version',
    LOGROCKET_IDENTIFIER: 'some logrocket identifier',
    LOGROCKET_IDENTIFIER_EU: 'some logrocket identifier europe',
    CDN_BASE_URI: 'CDN_BASE_URI',
    IO_LOGIN_PROMOTION_URL: 'https://staging.celigo.com/login/display',
    PORTAL_URL: 'https://portal.productboard.com/wcpkv3awtdpkze4x7wwbpog7',
  },
};
