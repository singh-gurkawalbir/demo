import produce from 'immer';
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

  return produce(state, draft => {
    switch (type) {
      case actionTypes.EDITOR_UPDATE_HELPER_FUNCTIONS:
        draft.helperFunctions = helperFunctions;
        break;
      case actionTypes.EDITOR_INIT: {
        const initChangeIdentifier =
          (draft[id] && draft[id].initChangeIdentifier) || 0;
        const saveStatus = draft[id] && draft[id].saveStatus;
        const init = processorLogic.init(processor);
        const formattedInitOptions = init ? init(options) : options;

        draft[id] = {
          processor,
          defaultOptions: deepClone(formattedInitOptions),
          ...deepClone(formattedInitOptions),
          lastChange: Date.now(),
          initChangeIdentifier: initChangeIdentifier + 1,
          saveStatus,
        };
        break;
      }

      case actionTypes.EDITOR_CHANGE_LAYOUT: {
        const initChangeIdentifier =
          (draft[id] && draft[id].initChangeIdentifier) || 0;

        draft[id].initChangeIdentifier = initChangeIdentifier + 1;
        break;
      }

      case actionTypes.EDITOR_RESET: {
        Object.assign(draft[id], draft[id].defaultOptions);
        draft[id].lastChange = Date.now();
        delete draft[id].violations;
        delete draft[id].error;
        delete draft[id].result;

        break;
      }

      case actionTypes.EDITOR_PATCH: {
        Object.assign(draft[id], deepClone(patch));
        draft[id].lastChange = Date.now();
        draft[id].status = 'requested';
        break;
      }

      case actionTypes.EDITOR_EVALUATE_RESPONSE: {
        draft[id].result = result;
        draft[id].status = 'received';
        delete draft[id].error;
        delete draft[id].violations;
        break;
      }

      case actionTypes.EDITOR_VALIDATE_FAILURE: {
        draft[id].violations = violations;
        draft[id].status = 'error';
        break;
      }

      case actionTypes.EDITOR_EVALUATE_FAILURE: {
        draft[id].error = error;
        draft[id].status = 'error';
        break;
      }

      case actionTypes.EDITOR_SAVE: {
        draft[id].saveStatus = 'requested';
        break;
      }

      case actionTypes.EDITOR_SAVE_FAILED: {
        draft[id].saveStatus = 'failed';
        break;
      }

      case actionTypes.EDITOR_SAVE_COMPLETE: {
        draft[id].saveStatus = 'completed';
        break;
      }

      default:
    }
  });
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

export function isEditorDirty(state, id) {
  if (!state) return;

  const editor = state[id];

  if (!editor) return;

  return processorLogic.isDirty(editor);
}

export function editorPatchSet(state, id) {
  if (!state) return;

  const editor = state[id];

  if (!editor) return;

  return processorPatchSet.getPatchSet(editor);
}

export function editorPatchStatus(state, id) {
  if (!state || !state[id]) {
    return emptyObj;
  }

  const { saveStatus } = state[id];

  return {
    saveTerminated: saveStatus === 'completed' || saveStatus === 'failed',
    saveCompleted: saveStatus === 'completed',
    saveInProgress: saveStatus === 'requested',
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
