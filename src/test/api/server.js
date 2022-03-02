/* global beforeAll,jest, afterAll, afterEach */
import {setupServer} from 'msw/node';
import path from 'path';
import { cleanup } from '@testing-library/react';
import { getAllDefaultExports } from './utils';

import 'whatwg-fetch';

const routesPath = path.join(__dirname, 'routes');
const handlers = Object.values(getAllDefaultExports(routesPath));

const server = setupServer(
  ...handlers
);

export function runServer() {
  const originalFetch = global.fetch;

  beforeAll(() => {
    global.fetch = window.fetch;
    server.listen({onUnhandledRequest: 'bypass'});
  });
  afterEach(() => {
    server.resetHandlers();
    jest.setTimeout(5000);
    cleanup();
  });
  afterAll(() => {
    global.fetch = originalFetch;
    server.close();
  });
}
export default server;
