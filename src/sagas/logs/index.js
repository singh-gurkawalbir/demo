import {connectionsLogSagas} from './connections';
import {scriptsLogSagas} from './scripts';
import listenerLogSagas from './flowStep';

export const logsSagas = [
  ...connectionsLogSagas,
  ...scriptsLogSagas,
  ...listenerLogSagas,
];
