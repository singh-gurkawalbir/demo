import { combineReducers } from 'redux';
import openErrors, { selectors as fromOpenErrors } from './openErrors';
import errorDetails, { selectors as fromErrorDetails } from './errorDetails';
import latestIntegrationJobDetails, { selectors as fromLatestIntegrationJobs } from './latestJobs/integrations';
import latestFlowJobs, { selectors as fromLatestFlowJobs } from './latestJobs/flows';
import retryData, { selectors as fromRetryData } from './retryData';
import metadata, { selectors as fromMetadata } from './metadata';
import { genSelectors } from '../../util';

export default combineReducers({
  openErrors,
  errorDetails,
  latestIntegrationJobDetails,
  latestFlowJobs,
  retryData,
  metadata,
});

export const selectors = {};
const subSelectors = {
  openErrors: fromOpenErrors,
  errorDetails: fromErrorDetails,
  retryData: fromRetryData,
  metadata: fromMetadata,
  latestIntegrationJobDetails: fromLatestIntegrationJobs,
  latestFlowJobs: fromLatestFlowJobs,
};

genSelectors(selectors, subSelectors);
