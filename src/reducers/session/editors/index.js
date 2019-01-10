import actionTypes from '../../../actions/types';
import processorLogic from './processorLogic';

export default function reducer(state = {}, action) {
  const {
    type,
    processor,
    id,
    options,
    patch,
    result,
    error,
    helperFunctions,
    violations,
  } = action;
  const newState = Object.assign({}, state);

  switch (type) {
    case actionTypes.EDITOR_UPDATE_HELPER_FUNCTIONS:
      newState[id] = {
        helperFunctions,
        ...newState[id],
      };

      return newState;
    case actionTypes.EDITOR_INIT:
      newState[id] = {
        processor,
        defaultOptions: options,
        ...options,
        lastChange: Date.now(),
      };

      return newState;

    case actionTypes.EDITOR_RESET:
      newState[id] = {
        ...newState[id],
        ...newState[id].defaultOptions,
        lastChange: Date.now(),
      };

      delete newState[id].violations;
      delete newState[id].error;
      delete newState[id].result;

      return newState;

    case actionTypes.EDITOR_PATCH:
      newState[id] = { ...newState[id], ...patch, lastChange: Date.now() };

      return newState;

    case actionTypes.EDITOR_EVALUATE_RESPONSE:
      newState[id] = { ...newState[id], result };
      delete newState[id].error;
      delete newState[id].violations;

      return newState;

    case actionTypes.EDITOR_VALIDATE_FAILURE:
      newState[id] = { ...newState[id], violations };

      // Maybe we dont delete the results on violations?
      // lets experiment with it and see how the UX is...
      // delete newState[id].result;

      return newState;

    case actionTypes.EDITOR_EVALUATE_FAILURE:
      newState[id] = { ...newState[id], error };
      delete newState[id].result;

      return newState;

    default:
      return state;
  }
}

// #region PUBLIC SELECTORS
export function editor(state, id) {
  if (!state) {
    return {};
  }

  const editor = state[id];

  if (!editor) return {};

  return { ...editor, violations: processorLogic.validate(editor) };
}

export function processorRequestOptions(state, id) {
  if (!state || !state[id]) {
    return {};
  }

  const editor = state[id];

  return processorLogic.requestOptions(editor);
}
// #endregion
