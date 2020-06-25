import { resourceFormSagas } from './resourceForm';
import { resourceSagas } from './resources';
import { jobSagas } from './jobs';
import { flowSagas } from './flows';
import installerSagas from './installer';
import { importSampleDataSagas } from './sampleData/imports';
import {mappingSagas} from './mappings';

// eslint-disable-next-line import/prefer-default-export
export const suiteScriptSagas = [
  ...resourceFormSagas,
  ...resourceSagas,
  ...jobSagas,
  ...flowSagas,
  ...installerSagas,
  ...importSampleDataSagas,
  ...mappingSagas
];
