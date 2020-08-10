import { combineReducers } from 'redux';
import resourceForm, { selectors as fromResourceForm } from './resourceForm';
import iaForm, { selectors as fromIAForm } from './iaForm';
import flows, { selectors as fromFlows } from './flows';
import featureCheck, { selectors as fromFeatureCheck } from './featureCheck';
import account, { selectors as fromAccount } from './account';
import installer, { selectors as fromInstaller } from './installer';
import mappings, { selectors as fromMappings } from './mappings';
import importSampleData, { selectors as fromImportSampleData } from './sampleData/import';
import flowSampleData, { selectors as fromFlowSampleData } from './sampleData/flow';
import { genSelectors } from '../../util';

export default combineReducers({
  mappings,
  resourceForm,
  iaForm,
  flows,
  featureCheck,
  account,
  installer,
  importSampleData,
  flowSampleData,
});

export const selectors = {};
const subSelectors = {
  resourceFrom: fromResourceForm,
  iaForm: fromIAForm,
  flows: fromFlows,
  featureCheck: fromFeatureCheck,
  account: fromAccount,
  installer: fromInstaller,
  mappings: fromMappings,
  importSampleData: fromImportSampleData,
  flowSampleData: fromFlowSampleData,
};

genSelectors(selectors, subSelectors);
