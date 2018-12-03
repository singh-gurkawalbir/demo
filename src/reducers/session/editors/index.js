import actionTypes from '../../../actions/types';
import processorLogic from './processorLogic';

export default function reducer(state = {}, action) {
  const { type, processor, id, options, patch, result, error } = action;
  let newState;

  switch (type) {
    case actionTypes.EDITOR_INIT:
      newState = Object.assign({}, state);

      newState[id] = {
        processor,
        defaultOptions: options,
        ...options,
        lastChange: Date.now(),
      };

      return newState;

    case actionTypes.EDITOR_RESET:
      newState = Object.assign({}, state);

      newState[id] = {
        ...newState[id],
        ...newState[id].defaultOptions,
        lastChange: Date.now(),
      };

      delete newState[id].error;
      delete newState[id].result;

      return newState;

    case actionTypes.EDITOR_PATCH:
      newState = Object.assign({}, state);
      newState[id] = { ...newState[id], ...patch, lastChange: Date.now() };

      return newState;

    case actionTypes.EDITOR_EVALUATE_RESPONSE:
      newState = Object.assign({}, state);
      newState[id] = { ...newState[id], result };
      delete newState[id].error;

      return newState;

    case actionTypes.EDITOR_EVALUATE_FAILURE:
      newState = Object.assign({}, state);
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
