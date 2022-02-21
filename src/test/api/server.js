import {setupServer} from 'msw/node';
import path from 'path';
import { getAllDefaultEports } from './utils';

const routesPath = path.join(__dirname, 'routes');
const handlers = Object.values(getAllDefaultEports(routesPath));

const server = setupServer(
  ...handlers
);

export default server;
