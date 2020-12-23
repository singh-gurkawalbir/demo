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
      case actionTypes.EDITOR.UPDATE_HELPER_FUNCTIONS:
        draft.helperFunctions = helperFunctions;
        break;
      case actionTypes.EDITOR.INIT: {
        const initChangeIdentifier =
          (draft[id] && draft[id].initChangeIdentifier) || 0;
        const saveStatus = draft[id] && draft[id].saveStatus;
        const init = processorLogic.init(processor);
        const {autoEvaluate: autoEvaluateProp, ...rest} = options || {};
        const optionsCopy = deepClone(rest);
        const formattedInitOptions = init ? init(optionsCopy) : optionsCopy;
        const autoEvaluate = (draft[id] && 'autoEvaluate' in draft[id])
          ? draft[id].autoEvaluate : autoEvaluateProp;

        draft[id] = {
          processor,
          defaultOptions: formattedInitOptions,
          ...deepClone(formattedInitOptions),
          lastChange: Date.now(),
          initChangeIdentifier: initChangeIdentifier + 1,
          saveStatus,
          autoEvaluate,
        };
        break;
      }

      case actionTypes.EDITOR.CHANGE_LAYOUT: {
        if (!draft[id]) break;
        const initChangeIdentifier =
          draft[id].initChangeIdentifier || 0;

        draft[id].initChangeIdentifier = initChangeIdentifier + 1;
        break;
      }

      case actionTypes.EDITOR.RESET: {
        Object.assign(draft[id], draft[id].defaultOptions);
        draft[id].lastChange = Date.now();
        delete draft[id].violations;
        delete draft[id].error;
        delete draft[id].errorLine;
        delete draft[id].result;

        break;
      }

      case actionTypes.EDITOR.CLEAR: {
        delete draft[id];

        break;
      }

      case actionTypes.EDITOR.PATCH: {
        if (!draft[id]) break;
        Object.assign(draft[id], deepClone(patch));
        draft[id].lastChange = Date.now();
        draft[id].status = 'requested';
        break;
      }

      case actionTypes.EDITOR.EVALUATE_RESPONSE: {
        if (!draft[id]) break;
        draft[id].result = result;
        draft[id].status = 'received';
        delete draft[id].error;
        delete draft[id].errorLine;
        delete draft[id].violations;
        break;
      }

      case actionTypes.EDITOR.VALIDATE_FAILURE: {
        if (!draft[id]) break;
        draft[id].violations = violations;
        draft[id].status = 'error';
        break;
      }

      case actionTypes.EDITOR.EVALUATE_FAILURE: {
        if (!draft[id]) break;
        draft[id].error = error?.errorMessage;
        draft[id].errorLine = error?.errorLine;
        draft[id].status = 'error';
        break;
      }

      case actionTypes.EDITOR.SAVE: {
        draft[id].saveStatus = 'requested';
        break;
      }

      case actionTypes.EDITOR.SAVE_FAILED: {
        draft[id].saveStatus = 'failed';
        break;
      }

      case actionTypes.EDITOR.SAVE_COMPLETE: {
        const editor = draft[id];

        editor.saveStatus = 'completed';

        const initKeys = Object.keys(editor).filter(key => key.indexOf('_init_') !== -1);

        initKeys.forEach(initKey => {
          const key = initKey.replace('_init_', '');

          editor[`_init_${key}`] = editor[key];
        });
        break;
      }

      default:
    }
  });
}

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.editor = (state, id) => {
  if (!state) return emptyObj;

  const editor = state[id];

  if (!editor) return emptyObj;

  return editor || emptyObj;
};

selectors.editorViolations = (state, id) => {
  if (!state) return;

  const editor = state[id];

  if (!editor) return;

  return processorLogic.validate(editor);
};

selectors.isEditorDirty = (state, id) => {
  if (!state) return;

  const editor = state[id];

  if (!editor) return;

  return processorLogic.isDirty(editor);
};

selectors.editorPatchSet = (state, id) => {
  if (!state) return;

  const editor = state[id];

  if (!editor) return;

  return processorPatchSet.getPatchSet(editor);
};

selectors.editorPatchStatus = (state, id) => {
  if (!state || !state[id]) {
    return emptyObj;
  }

  const { saveStatus } = state[id];

  return {
    saveTerminated: saveStatus === 'completed' || saveStatus === 'failed',
    saveCompleted: saveStatus === 'completed',
    saveInProgress: saveStatus === 'requested',
  };
};

selectors.processorRequestOptions = (state, id) => {
  if (!state || !state[id]) {
    return emptyObj;
  }

  const editor = state[id];

  return processorLogic.requestOptions(editor);
};
selectors.editorHelperFunctions = state => state?.helperFunctions || [];

// #endregion
