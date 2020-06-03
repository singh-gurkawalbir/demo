module.exports = {
  bail: false,
  testRegex: undefined,
  roots: [
    '<rootDir>/src'
  ],
  setupFiles: [
    'react-app-polyfill/jsdom'
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
    '^.+\\.css$': '<rootDir>/jest/cssTransform.js',
    '^(?!.*\\.(js|jsx|ts|tsx|css|json)$)': '<rootDir>/jest/fileTransform.js'
  },
  transformIgnorePatterns: [
    '[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$',
    '^.+\\.module\\.(css|sass|scss)$'
  ],
  collectCoverageFrom: [
    // If we consistently follow the current abstractions,
    // these should be the only folders that need test coverage...
    'src/actions/**/*.{js,jsx}',
    'src/reducers/**/*.{js,jsx}',
    'src/sagas/**/*.{js,jsx}',
    // 'src/utils/**/*.{js,jsx}',
  ],
  setupFiles: ['<rootDir>/jest/setup.js', 'jest-date-mock', 'core-js'],
  coverageThreshold: {
    global: {
      statements: 75,
      branches: 65,
      functions: 65,
      lines: 80,
    },
  },
};
