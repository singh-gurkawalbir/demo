import { combineReducers } from 'redux';
import openErrors from './openErrors';
import errorDetails, * as fromErrorDetails from './errorDetails';

export default combineReducers({
  openErrors,
  errorDetails,
});

export function getResourceOpenErrors(state, { flowId, resourceId }) {
  return fromErrorDetails.getErrors(state && state.errorDetails, {
    flowId,
    resourceId,
    type: 'open',
  });
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

export function isAllErrorsSelected(state, { flowId, resourceId, type }) {
  const errorDetailsState = state && state.errorDetails;
  const { errors = [] } = fromErrorDetails.getErrors(errorDetailsState, {
    flowId,
    resourceId,
    type,
  });

  return !errors.some(error => !error.selected);
}
