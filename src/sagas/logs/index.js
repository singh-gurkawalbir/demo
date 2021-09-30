import {connectionsLogSagas} from './connections';
import {scriptsLogSagas} from './scripts';
import listenerLogSagas from './listener';

export const logsSagas = [
  ...connectionsLogSagas,
  ...scriptsLogSagas,
  ...listenerLogSagas,
];
