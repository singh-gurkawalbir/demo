import { combineReducers } from 'redux';
import openErrors from './openErrors';
import errorDetails from './errorDetails';

const defaultObject = {};

export default combineReducers({
  openErrors,
  errorDetails,
});

export function getResourceOpenErrors(state, { flowId, resourceId }) {
  const errorDetailsState = state && state.errorDetails;

  return (
    (errorDetailsState &&
      errorDetailsState[flowId] &&
      errorDetailsState[flowId][resourceId] &&
      errorDetailsState[flowId][resourceId].open) ||
    defaultObject
  );
}

export function getResourceResolvedErrors(state, { flowId, resourceId }) {
  const errorDetailsState = state && state.errorDetails;

  return (
    (errorDetailsState &&
      errorDetailsState[flowId] &&
      errorDetailsState[flowId][resourceId] &&
      errorDetailsState[flowId][resourceId].resolved) ||
    defaultObject
  );
}
