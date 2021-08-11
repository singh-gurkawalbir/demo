import { resourceFormSagas } from './resourceForm';
import { resourceSagas } from './resources';
import { jobSagas } from './jobs';
import { flowSagas } from './flows';
import { accountSagas } from './account';
import installerSagas from './installer';
import { importSampleDataSagas } from './sampleData/imports';
import { flowSampleDataSagas } from './sampleData/flow';

import {mappingSagas} from './mapping';

export const suiteScriptSagas = [
  ...resourceFormSagas,
  ...resourceSagas,
  ...jobSagas,
  ...flowSagas,
  ...accountSagas,
  ...installerSagas,
  ...importSampleDataSagas,
  ...mappingSagas,
  ...flowSampleDataSagas,
];
