import 'regenerator-runtime/runtime';
import '@testing-library/jest-dom';
import 'whatwg-fetch';

import { cleanup } from '@testing-library/react';
import server from '../src/test/api/server';

require('dotenv').config();

Object.defineProperty(window, 'open', { value() {}, writable: true });

beforeAll(() => server.listen({onUnhandledRequest: 'error'}));
afterEach(() => {
  server.resetHandlers();
  jest.setTimeout(5000);
  cleanup();
});
afterAll(() => server.close());

global.fetch = window.fetch;

