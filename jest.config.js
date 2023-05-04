
module.exports = {
  bail: false,
  testRegex: undefined,
  testTimeout: 50000,
  roots: [
    '<rootDir>/src',
  ],
  transform: {
    '^.+\\.(js|jsx|mjs|cjs|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
    '^.+\\.css$': '<rootDir>/jest/cssTransform.js',
    '^(?!.*\\.(js|jsx|ts|tsx|mjs|cjs|css|json)$)': '<rootDir>/jest/fileTransform.js',
  },
  transformIgnorePatterns: [
    '^.+\\.module\\.(css|sass|scss)$',
    '/node_modules/(?!react-dnd|core-dnd|@react-dnd|dnd-core|react-dnd-html5-backend|react-toggle|react-date-range|jQuery-QueryBuilder|d3|d3-array|internmap|delaunator|robust-predicates)',
    // '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx|mjs|cjs)$',

  ],
  collectCoverageFrom: [
    // If we consistently follow the current abstractions,
    // these should be the only folders that need test coverage...
    'src/actions/**/*.{js,jsx}',
    'src/reducers/**/*.{js,jsx}',
    'src/sagas/**/*.{js,jsx}',
    'src/utils/**/*.{js,jsx}',
    'src/components/**/*.{js,jsx}',
    '!src/components/icons/**/*.{js,jsx}',
    '!src/components/SuiteScript/**/*.{js,jsx}',
    '!src/components/DynaForm/fields/SuiteScript/**/*.{js,jsx}',
    'src/views/**/*.{js,jsx}',
    '!src/views/SuiteScript/**/*.{js,jsx}',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest/setup.js', 'jest-date-mock', 'core-js', 'jest-canvas-mock'],
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
    IO_SIGNUP_PROMOTION_URL: 'https://staging.celigo.com/integratorio/signup/',
    PORTAL_URL: 'https://portal.productboard.com/wcpkv3awtdpkze4x7wwbpog7',
    SHOPIFY_USER_IDS: '',
    ALLOW_SIGNUP: 'true',
    ALLOW_GOOGLE_SIGNIN: 'true',
    ALLOW_SIGNUP_EU: 'true',
    ALLOW_GOOGLE_SIGNIN_EU: 'true',
    ENABLE_HELP_CONTENT: 'true',
  },
};
