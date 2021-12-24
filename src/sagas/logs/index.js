import {connectionsLogSagas} from './connections';
import {scriptsLogSagas} from './scripts';
import flowStepLogSagas from './flowStep';

export const logsSagas = [
  ...connectionsLogSagas,
  ...scriptsLogSagas,
  ...flowStepLogSagas,
];
