import {setupServer} from 'msw/node';
import path from 'path';
import { cleanup } from '@testing-library/react';
import { getAllDefaultEports } from './utils';

const routesPath = path.join(__dirname, 'routes');
const handlers = Object.values(getAllDefaultEports(routesPath));

const server = setupServer(
  ...handlers
);

export function runServer() {
  beforeAll(() => server.listen({onUnhandledRequest: 'bypass'}));
  afterEach(() => {
    server.resetHandlers();
    jest.setTimeout(5000);
    cleanup();
  });
  afterAll(() => server.close());
}
export default server;
