import 'regenerator-runtime/runtime';
import '@testing-library/jest-dom';
import 'whatwg-fetch';

import server from '../src/test/api/server';

require('dotenv').config();

Object.defineProperty(window, 'open', { value() {}, writable: true });

beforeAll(() => server.listen({onUnhandledRequest: 'bypass'}));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

global.fetch = window.fetch;

