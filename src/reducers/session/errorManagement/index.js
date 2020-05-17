import { combineReducers } from 'redux';
import openErrors, * as fromOpenErrors from './openErrors';
import errorDetails, * as fromErrorDetails from './errorDetails';
import getFilteredErrors from '../../../utils/errorManagement';
import miscellaneous, * as fromMiscellaneous from './miscellaneous';

export default combineReducers({
  openErrors,
  errorDetails,
  miscellaneous,
});

export function resourceErrors(state, { flowId, resourceId, options }) {
  const errorDetails = fromErrorDetails.getErrors(state && state.errorDetails, {
    flowId,
    resourceId,
    errorType: options.isResolved ? 'resolved' : 'open',
  });

  return {
    ...errorDetails,
    errors: getFilteredErrors(errorDetails.errors, options),
  };
}

export function isAllErrorsSelected(
  state,
  { flowId, resourceId, isResolved, errorIds }
) {
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
}

export function errorMap(state, resourceId) {
  return fromOpenErrors.errorMap(state && state.openErrors, resourceId);
}

export function errorActionsContext(
  state,
  { flowId, resourceId, actionType, errorType }
) {
  return fromErrorDetails.errorActionsContext(state && state.errorDetails, {
    flowId,
    resourceId,
    actionType,
    errorType,
  });
}

export function retryDataContext(state, retryId) {
  return fromMiscellaneous.retryDataContext(state && state.miscellaneous, {
    retryId,
  });
}
