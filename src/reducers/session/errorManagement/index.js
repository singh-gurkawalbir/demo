import { combineReducers } from 'redux';
import openErrors, * as fromOpenErrors from './openErrors';
import errorDetails, * as fromErrorDetails from './errorDetails';
import getFilteredErrors from '../../../utils/errorManagement';

export default combineReducers({
  openErrors,
  errorDetails,
});

export function resourceErrors(
  state,
  { flowId, resourceId, isResolved, options }
) {
  const errorDetails = fromErrorDetails.getErrors(state && state.errorDetails, {
    flowId,
    resourceId,
    errorType: isResolved ? 'resolved' : 'open',
  });

  return {
    ...errorDetails,
    errors: getFilteredErrors(errorDetails.errors, options),
  };
}

export function isAllErrorsSelected(
  state,
  { flowId, resourceId, type: errorType, errorIds }
) {
  const errorDetailsState = state && state.errorDetails;
  const { errors = [] } = fromErrorDetails.getErrors(errorDetailsState, {
    flowId,
    resourceId,
    errorType,
  });

  if (!errorIds.length) return false;

  return !errors.some(
    error => errorIds.includes(error.errorId) && !error.selected
  );
}

export function flowErrorMap(state, flowId) {
  return fromOpenErrors.flowErrorMap(state && state.openErrors, flowId);
}
