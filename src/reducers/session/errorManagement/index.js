import { combineReducers } from 'redux';
import openErrors, { selectors as fromOpenErrors } from './openErrors';
import errorDetails, { selectors as fromErrorDetails } from './errorDetails';
import getFilteredErrors from '../../../utils/errorManagement';
import retryData, { selectors as fromRetryData } from './retryData';
import { genSelectors } from '../../util';

export default combineReducers({
  openErrors,
  errorDetails,
  retryData,
});

export const selectors = {};
const subSelectors = {
  openErrors: fromOpenErrors,
  errorDetails: fromErrorDetails,
  retryData: fromRetryData,
};

genSelectors(selectors, subSelectors);

selectors.resourceErrors = (state, { flowId, resourceId, options = {} }) => {
  const errorDetails = fromErrorDetails.getErrors(state && state.errorDetails, {
    flowId,
    resourceId,
    errorType: options.isResolved ? 'resolved' : 'open',
  });

  return {
    ...errorDetails,
    errors: getFilteredErrors(errorDetails.errors, options),
  };
};

selectors.isAllErrorsSelected = (state, { flowId, resourceId, isResolved, errorIds }) => {
  const errorDetailsState = state && state.errorDetails;
  const { errors = [] } = fromErrorDetails.getErrors(errorDetailsState, {
    flowId,
    resourceId,
    errorType: isResolved ? 'resolved' : 'open',
  });

  if (!errorIds.length) return false;

  return !errors.some(
    error => errorIds.includes(error.errorId) && !error.selected
  );
};
