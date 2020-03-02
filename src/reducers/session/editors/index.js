import { deepClone } from 'fast-json-patch';
import actionTypes from '../../../actions/types';
import processorLogic from './processorLogic';
import processorPatchSet from './processorPatchSet';

const emptyObj = {};

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
  let newState = { ...state };

  switch (type) {
    case actionTypes.EDITOR_UPDATE_HELPER_FUNCTIONS:
      newState = {
        helperFunctions,
        ...newState,
      };

      return newState;
    case actionTypes.EDITOR_INIT: {
      const initChangeIdentifier =
        (newState[id] && newState[id].initChangeIdentifier) || 0;
      const saveStatus = newState[id] && newState[id].saveStatus;

      newState[id] = {
        processor,
        defaultOptions: deepClone(options),
        ...deepClone(options),
        lastChange: Date.now(),
        initChangeIdentifier: initChangeIdentifier + 1,
        saveStatus,
      };

      return newState;
    }

    case actionTypes.EDITOR_CHANGE_LAYOUT: {
      const initChangeIdentifier =
        (newState[id] && newState[id].initChangeIdentifier) || 0;

      newState[id].initChangeIdentifier = initChangeIdentifier + 1;

      return newState;
    }

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
      newState[id] = {
        ...newState[id],
        ...deepClone(patch),
        lastChange: Date.now(),
        status: 'requested',
      };

      return newState;

    case actionTypes.EDITOR_EVALUATE_RESPONSE:
      newState[id] = { ...newState[id], result, status: 'received' };
      delete newState[id].error;
      delete newState[id].violations;

      return newState;

    case actionTypes.EDITOR_VALIDATE_FAILURE:
      newState[id] = { ...newState[id], violations, status: 'error' };

      // Maybe we dont delete the results on violations?
      // lets experiment with it and see how the UX is...
      // delete newState[id].result;

      return newState;

    case actionTypes.EDITOR_EVALUATE_FAILURE:
      newState[id] = { ...newState[id], error, status: 'error' };
      delete newState[id].result;

      return newState;

    case actionTypes.EDITOR_SAVE:
      newState[id] = {
        ...newState[id],
        saveStatus: 'requested',
      };

      return newState;
    case actionTypes.EDITOR_SAVE_FAILED:
      newState[id] = {
        ...newState[id],
        saveStatus: 'failed',
      };

      return newState;
    case actionTypes.EDITOR_SAVE_COMPLETE:
      newState[id] = {
        ...newState[id],
        saveStatus: 'completed',
      };

      return newState;

    default:
      return state;
  }
}

// #region PUBLIC SELECTORS
export function editor(state, id) {
  if (!state) return emptyObj;

  const editor = state[id];

  if (!editor) return emptyObj;

  return editor || emptyObj;
}

export function editorViolations(state, id) {
  if (!state) return;

  const editor = state[id];

  if (!editor) return;

  return processorLogic.validate(editor);
}

export function editorPatchSet(state, id) {
  if (!state) return;

  const editor = state[id];

  if (!editor) return;

  return processorPatchSet.getPatchSet(editor);
}

export function editorSaveProcessTerminate(state, id) {
  if (!state || !state[id]) {
    return emptyObj;
  }

  const { saveStatus } = state[id];

  return {
    saveTerminated: saveStatus === 'completed' || saveStatus === 'failed',
    saveCompleted: saveStatus === 'completed',
  };
}

export function processorRequestOptions(state, id) {
  if (!state || !state[id]) {
    return emptyObj;
  }

  const editor = state[id];

  return processorLogic.requestOptions(editor);
}
// #endregion
