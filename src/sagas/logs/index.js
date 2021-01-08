import {connectionsLogSagas} from './connections';
import {scriptsLogSagas} from './scripts';

export const logsSagas = [
  ...connectionsLogSagas,
  ...scriptsLogSagas,
];
