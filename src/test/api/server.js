/* eslint-disable jest/require-top-level-describe */
import {setupServer} from 'msw/node';
import path from 'path';
import {rest} from 'msw';
import { cleanup } from '@testing-library/react';
import { getAllDefaultExports } from './utils';

import 'whatwg-fetch';

const routesPath = path.join(__dirname, 'routes');
const handlers = Object.values(getAllDefaultExports(routesPath));

const server = setupServer(
  ...handlers,
  rest.get('*', {}),
  rest.post('*', (req, res, ctx) => res(
    // Respond with a 200 status code
    ctx.status(200),
  )),
  rest.put('*', (req, res, ctx) => res(
    // Respond with a 200 status code
    ctx.status(200),
  )),
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
