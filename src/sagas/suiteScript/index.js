import { resourceFormSagas } from './resourceForm';
import { resourceSagas } from './resources';

// eslint-disable-next-line import/prefer-default-export
export const suiteScriptSagas = [...resourceFormSagas, ...resourceSagas];
