import { resourceFormSagas } from './resourceForm';
import { resourceSagas } from './resources';
import { jobSagas } from './jobs';
import { flowSagas } from './flows';
import { accountSagas } from './account';

// eslint-disable-next-line import/prefer-default-export
export const suiteScriptSagas = [
  ...resourceFormSagas,
  ...resourceSagas,
  ...jobSagas,
  ...flowSagas,
  ...accountSagas,
];
