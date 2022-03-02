import 'regenerator-runtime/runtime';
import '@testing-library/jest-dom';

require('dotenv').config();

Object.defineProperty(window, 'open', { value() {}, writable: true });

// runServer() method from test/server should be run here ideally
// Few saga test cases are failing in CI
// Hence moved runServer to the individual test suites for Integration tests
