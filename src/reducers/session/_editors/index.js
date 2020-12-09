import produce from 'immer';
import { deepClone } from 'fast-json-patch';
import actionTypes from '../../../actions/types';
import processorLogic from './processorLogic';
// import processorPatchSet from '../editors/processorPatchSet';
import editorFeaturesMap from './featuresMap';
import editorMetadata from '../../../components/AFE2/metadata';

const emptyObj = {};

export default function reducer(state = {}, action) {
  const {
    type,
    processor,
    id,
    options,
    featuresPatch,
    rulePatch,
    dataPatch,
    result,
    error,
    helperFunctions,
    violations,
    version,
    sampleData,
    templateVersion,
    autoPreview,
    sampleDataError,
    newLayout,
  } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes._EDITOR.UPDATE_HELPER_FUNCTIONS:
        draft.helperFunctions = helperFunctions;
        break;
      case actionTypes._EDITOR.INIT: {
        const { layout } = editorMetadata[processor];

        // const initChangeIdentifier = draft[id]?.initChangeIdentifier || 0;
        const init = processorLogic.init(processor);
        const {rule} = options || {};
        const optionsCopy = deepClone(options);
        const formattedInitOptions = init ? init(optionsCopy) : optionsCopy;

        let originalRule = rule;

        if (typeof rule === 'object') {
          originalRule = deepClone(rule);
        }

        draft[id] = {
          layout,
          processor,
          ...formattedInitOptions,
          ...deepClone(editorFeaturesMap[processor]), // TODO: check later if features get mutated. if not, remove deepClone
          originalRule,
          lastChange: Date.now(),
          // initChangeIdentifier: initChangeIdentifier + 1,
          initStatus: 'requested',
        };
        break;
      }

      case actionTypes._EDITOR.CHANGE_LAYOUT: {
        draft[id].layout = newLayout;
        break;
      }

      case actionTypes._EDITOR.CLEAR: {
        // TODO:
        delete draft[id];
        // draft[id] = {};

        break;
      }

      case actionTypes._EDITOR.SAMPLEDATA.RECEIVED: {
        draft[id].data = sampleData;
        draft[id].dataVersion = templateVersion;
        draft[id].initStatus = 'received';
        // store lastValidData in case user updates data as invalid json. As we still want to show the dropdown data values in
        // the rule or handlebars panel
        draft[id].lastValidData = sampleData;
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
        draft[id].result = '';
        if (version === 2) {
          draft[id].rule = draft[id].v2Rule || '';
        } else if (version === 1) {
          draft[id].rule = draft[id].v1Rule || '';
        }
        break;
      }

      case actionTypes._EDITOR.TOGGLE_AUTO_PREVIEW: {
        // TODO: change evaluate to preview
        draft[id].autoEvaluate = autoPreview ?? !draft[id].autoEvaluate;
        if (draft[id].autoEvaluate) {
          draft[id].previewStatus = 'requested';
        }
        break;
      }

      case actionTypes._EDITOR.PATCH.RULE: {
        if (typeof rulePatch === 'string' ||
          Array.isArray(rulePatch) ||
          draft[id].rule === undefined) {
          draft[id].rule = rulePatch;
        } else {
          // TODO: Ashu, why do we need to clone the rulePatch?
          Object.assign(draft[id].rule, deepClone(rulePatch));
        }
        if (draft[id].dataVersion === 2) {
          draft[id].v2Rule = rulePatch;
        } else if (draft[id].dataVersion === 1) {
          draft[id].v1Rule = rulePatch;
        }
        draft[id].lastChange = Date.now();
        if (draft[id].autoEvaluate) {
          draft[id].previewStatus = 'requested';
        }
        break;
      }

      case actionTypes._EDITOR.PATCH.DATA: {
        // Object.assign(draft[id].data, deepClone(dataPatch));
        draft[id].data = dataPatch;
        draft[id].lastChange = Date.now();
        draft[id].lastValidData = draft[id].data;
        if (draft[id].autoEvaluate) {
          draft[id].previewStatus = 'requested';
        }
        break;
      }

      case actionTypes._EDITOR.PATCH.FEATURES: {
        Object.assign(draft[id], featuresPatch);
        draft[id].lastChange = Date.now();
        break;
      }

      case actionTypes._EDITOR.PREVIEW.RESPONSE: {
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

      case actionTypes._EDITOR.PREVIEW.FAILED: {
        draft[id].error = error?.errorMessage;
        draft[id].errorLine = error?.errorLine;
        draft[id].previewStatus = 'error';
        break;
      }

      case actionTypes._EDITOR.SAVE.REQUEST: {
        draft[id].saveStatus = 'requested';
        break;
      }

      case actionTypes._EDITOR.SAVE.FAILED: {
        draft[id].saveStatus = 'failed';
        break;
      }

      case actionTypes._EDITOR.SAVE.COMPLETE: {
        const editor = draft[id];

        editor.saveStatus = 'completed';
        let originalRule = editor.rule;

        if (typeof originalRule === 'object') {
          originalRule = deepClone(editor.rule);
        }
        editor.originalRule = originalRule;

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

  return editor || emptyObj;
};

selectors._editorData = (state, id) => {
  if (!state) return;

  const editor = state[id];

  return editor?.data;
};

selectors._editorResult = (state, id) => {
  if (!state) return emptyObj;

  const editor = state[id];

  return editor?.result || emptyObj;
};

selectors._editorRule = (state, id) => {
  if (!state) return emptyObj;

  const editor = state[id];

  return editor?.rule || emptyObj;
};

selectors._editorPreviewError = (state, id) => {
  if (!state) return emptyObj;

  const editor = state[id];

  return {
    error: editor?.error,
    errorLine: editor?.errorLine,
  };
};

selectors._editorDataVersion = (state, id) => {
  if (!state) return;

  const editor = state[id];

  return editor?.dataVersion;
};

selectors._editorLayout = (state, id) => {
  if (!state) return;

  const editor = state[id];

  return editor?.layout;
};

selectors._editorViolations = (state, id) => processorLogic.validate(state?.[id]);

selectors._isEditorDirty = (state, id) => processorLogic.isDirty(state?.[id]);

// selectors._editorPatchSet = (state, id) => processorPatchSet.getPatchSet(state?.[id]);

selectors._editorSaveStatus = (state, id) => {
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

selectors._processorRequestOptions = (state, id) => processorLogic.requestOptions(state?.[id]);
// #endregion
