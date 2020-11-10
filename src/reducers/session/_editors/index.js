import produce from 'immer';
import { deepClone } from 'fast-json-patch';
import actionTypes from '../../../actions/types';
import processorLogic from './processorLogic';
import processorPatchSet from '../editors/processorPatchSet';
import editorFeaturesMap from './featuresMap';

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
    version,
    sampleData,
    templateVersion,
    autoPreview,
    sampleDataError,
  } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes._EDITOR.UPDATE_HELPER_FUNCTIONS:
        draft.helperFunctions = helperFunctions;
        break;
      case actionTypes._EDITOR.INIT: {
        const initChangeIdentifier = draft[id]?.initChangeIdentifier || 0;
        const init = processorLogic.init(processor);
        const {rule} = options || {};
        const optionsCopy = deepClone(options);
        const formattedInitOptions = init ? init(optionsCopy) : optionsCopy;

        let v1Rule; let
          v2Rule;

        if (processor === 'handlebars' && options.isEditorV2Supported) {
          v1Rule = rule;
          v2Rule = rule;
        }

        let dirty = rule;

        if (typeof rule === 'object') {
          dirty = deepClone(rule);
        }

        draft[id] = {
          processor,
          ...deepClone(formattedInitOptions),
          ...deepClone(editorFeaturesMap[processor]),
          dirty,
          lastChange: Date.now(),
          initChangeIdentifier: initChangeIdentifier + 1,
          initStatus: 'requested',
          v1Rule,
          v2Rule,
        };
        break;
      }

      case actionTypes._EDITOR.CHANGE_LAYOUT: {
        // TODO: find out where this is used
        const initChangeIdentifier =
          draft[id]?.initChangeIdentifier || 0;

        draft[id].initChangeIdentifier = initChangeIdentifier + 1;
        break;
      }

      case actionTypes._EDITOR.CLEAR: {
        delete draft[id];

        break;
      }

      case actionTypes._EDITOR.SAMPLEDATA.RECEIVED: {
        draft[id].data = sampleData;
        draft[id].dataVersion = templateVersion;
        draft[id].initStatus = 'received';
        break;
      }

      case actionTypes._EDITOR.SAMPLEDATA.FAILED: {
        draft[id].initStatus = 'error';
        draft[id].initError = sampleDataError;
        break;
      }

      case actionTypes._EDITOR.TOGGLE_VERSION: {
        draft[id].initStatus = 'requested';
        draft[id].dataVersion = version;
        break;
      }

      case actionTypes._EDITOR.TOGGLE_AUTO_PREVIEW: {
        draft[id].autoEvaluate = autoPreview || !draft[id].autoEvaluate;
        if (draft[id].autoEvaluate) {
          draft[id].previewStatus = 'requested';
        }
        break;
      }

      case actionTypes._EDITOR.PATCH: {
        Object.assign(draft[id], deepClone(patch));
        draft[id].lastChange = Date.now();
        if (draft[id].autoEvaluate) {
          draft[id].previewStatus = 'requested';
        }
        break;
      }

      case actionTypes._EDITOR.EVALUATE_RESPONSE: {
        draft[id].result = result;
        draft[id].previewStatus = 'received';
        delete draft[id].error;
        delete draft[id].errorLine;
        delete draft[id].violations;
        break;
      }

      case actionTypes._EDITOR.VALIDATE_FAILURE: {
        draft[id].violations = violations;
        draft[id].previewStatus = 'error';
        break;
      }

      case actionTypes._EDITOR.EVALUATE_FAILURE: {
        draft[id].error = error?.errorMessage;
        draft[id].errorLine = error?.errorLine;
        draft[id].previewStatus = 'error';
        break;
      }

      case actionTypes._EDITOR.SAVE: {
        draft[id].saveStatus = 'requested';
        break;
      }

      case actionTypes._EDITOR.SAVE_FAILED: {
        draft[id].saveStatus = 'failed';
        break;
      }

      case actionTypes._EDITOR.SAVE_COMPLETE: {
        const editor = draft[id];

        editor.saveStatus = 'completed';
        let dirty = editor.rule;

        if (typeof dirty === 'object') {
          dirty = deepClone(editor.rule);
        }
        editor.dirty = dirty;

        break;
      }

      default:
    }
  });
}

// #region PUBLIC SELECTORS
export const selectors = {};

selectors._editor = (state, id) => {
  if (!state) return emptyObj;

  const editor = state[id];

  if (!editor) return emptyObj;

  return editor || emptyObj;
};

selectors._editorDataVersion = (state, id) => {
  if (!state) return emptyObj;

  const editor = state[id];

  if (!editor) return undefined;

  return editor.dataVersion;
};

selectors._editorViolations = (state, id) => {
  if (!state) return;

  const editor = state[id];

  if (!editor) return;

  return processorLogic.validate(editor);
};

selectors._isEditorDirty = (state, id) => {
  if (!state) return;

  const editor = state[id];

  if (!editor) return;

  return processorLogic.isDirty(editor);
};

selectors._editorPatchSet = (state, id) => {
  if (!state) return;

  const editor = state[id];

  if (!editor) return;

  return processorPatchSet.getPatchSet(editor);
};

selectors._editorPatchStatus = (state, id) => {
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

selectors._processorRequestOptions = (state, id) => {
  if (!state || !state[id]) {
    return emptyObj;
  }

  const editor = state[id];

  return processorLogic.requestOptions(editor);
};
// #endregion
