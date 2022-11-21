import 'regenerator-runtime/runtime';
import '@testing-library/jest-dom';

require('dotenv').config();

process.env.ZD_CHATBOT_URL = 'https://static.zdassets.com/ekr/snippet.js?key=';
process.env.ZD_CHATBOT_KEY = 'chatbotkey';
Object.defineProperty(window, 'open', { value() {}, writable: true });

// runServer() method from test/server should be run here ideally
// Few saga test cases are failing in CI
// Hence moved runServer to the individual test suites for Integration tests
