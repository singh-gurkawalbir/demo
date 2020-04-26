import { combineReducers } from 'redux';
import openErrors from './openErrors';
import errorDetails, * as fromErrorDetails from './errorDetails';
import getFilteredErrors from '../../../utils/errorManagement';

export default combineReducers({
  openErrors,
  errorDetails,
});

export function resourceOpenErrors(state, { flowId, resourceId, options }) {
  const openErrors = fromErrorDetails.getErrors(state && state.errorDetails, {
    flowId,
    resourceId,
    type: 'open',
  });

  return {
    ...openErrors,
    errors: getFilteredErrors(openErrors.errors, options),
  };
}

export function getResourceResolvedErrors(state, { flowId, resourceId }) {
  return fromErrorDetails.getErrors(state && state.errorDetails, {
    flowId,
    resourceId,
    type: 'resolved',
  });
}

export function isErrorSelected(state, { flowId, resourceId, type, errorId }) {
  const { errors = [] } = fromErrorDetails.getErrors(
    state && state.errorDetails,
    {
      flowId,
      resourceId,
      type,
    }
  );
  const error = errors.find(error => error.errorId === errorId) || {};

  return !!error.selected;
}

export function isAllErrorsSelected(
  state,
  { flowId, resourceId, type, errorIds }
) {
  const errorDetailsState = state && state.errorDetails;
  const { errors = [] } = fromErrorDetails.getErrors(errorDetailsState, {
    flowId,
    resourceId,
    type,
  });

  if (!errorIds.length) return false;

  return !errors.some(
    error => errorIds.includes(error.errorId) && !error.selected
  );
}
