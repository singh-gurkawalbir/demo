import { combineReducers } from 'redux';
import openErrors, { selectors as fromOpenErrors } from './openErrors';
import errorDetails, { selectors as fromErrorDetails } from './errorDetails';
import latestIntegrationJobDetails, { selectors as fromLatestIntegrationJobs } from './latestJobs/integrations';
import latestFlowJobs, { selectors as fromLatestFlowJobs } from './latestJobs/flows';
import runHistory, { selectors as fromRunHistory } from './runHistory';
import retryData, { selectors as fromRetryData } from './retryData';
import metadata, { selectors as fromMetadata } from './metadata';
import errorHttpDoc, { selectors as fromErrorHttpDoc } from './errorHttpDoc';
import { genSelectors } from '../../util';

export default combineReducers({
  openErrors,
  errorDetails,
  latestIntegrationJobDetails,
  latestFlowJobs,
  runHistory,
  retryData,
  metadata,
  errorHttpDoc,
});

export const selectors = {};
const subSelectors = {
  openErrors: fromOpenErrors,
  errorDetails: fromErrorDetails,
  retryData: fromRetryData,
  metadata: fromMetadata,
  latestIntegrationJobDetails: fromLatestIntegrationJobs,
  latestFlowJobs: fromLatestFlowJobs,
  runHistory: fromRunHistory,
  errorHttpDoc: fromErrorHttpDoc,
};

genSelectors(selectors, subSelectors);
