import { combineReducers } from 'redux';
import openErrors, { selectors as fromOpenErrors } from './openErrors';
import errorDetails, { selectors as fromErrorDetails } from './errorDetails';
import latestIntegrationJobDetails, { selectors as fromLatestIntegrationJobs } from './latestJobs/integrations';
import latestFlowJobs, { selectors as fromLatestFlowJobs } from './latestJobs/flows';
import retryData, { selectors as fromRetryData } from './retryData';
import { genSelectors } from '../../util';

export default combineReducers({
  openErrors,
  errorDetails,
  latestIntegrationJobDetails,
  latestFlowJobs,
  retryData,
});

export const selectors = {};
const subSelectors = {
  openErrors: fromOpenErrors,
  errorDetails: fromErrorDetails,
  retryData: fromRetryData,
  latestIntegrationJobDetails: fromLatestIntegrationJobs,
  latestFlowJobs: fromLatestFlowJobs,
};

genSelectors(selectors, subSelectors);
