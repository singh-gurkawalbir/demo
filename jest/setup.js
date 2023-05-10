import 'regenerator-runtime/runtime';
import '@testing-library/jest-dom';

require('dotenv').config();

process.env.ZD_CHATBOT_URL = 'https://static.zdassets.com/ekr/snippet.js?key=';
process.env.ZD_CHATBOT_KEY = 'chatbotkey';
Object.defineProperty(window, 'open', { value() { return {}; }, writable: true });
// Since current material-ui used is deprecated, each test case is printing a warning message and huge logs are added as part of this.
// Hence ignoring console.warn for now and should remove this mock once material-ui is updated to mui@v5
Object.defineProperty(console, 'warn', { value() {}, writable: true });
Object.defineProperty(window, 'prompt', { value() {}, writable: true });
Object.defineProperty(window, 'ResizeObserver', { value() {
  return {
    observe() {
      // do nothing
    },
    unobserve() {
      // do nothing
    },
    disconnect() {
      // do nothing
    },
  };
},
writable: true});
// runServer() method from test/server should be run here ideally
// Few saga test cases are failing in CI
// Hence moved runServer to the individual test suites for Integration tests
