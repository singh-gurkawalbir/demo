import { original, produce } from 'immer';
import { deepClone } from 'fast-json-patch';
import actionTypes from '../../../actions/types';
import processorLogic from './processorLogic';
import { toggleData } from './processorLogic/settingsForm';

const emptyObj = {};

export default function reducer(state = {}, action) {
  const {
    type,
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
    saveMessage,
  } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes._EDITOR.UPDATE_HELPER_FUNCTIONS:
        draft.helperFunctions = helperFunctions;
        break;

      case actionTypes._EDITOR.INIT_COMPLETE: {
        draft[id] = options;
        break;
      }

      case actionTypes._EDITOR.CHANGE_LAYOUT: {
        if (!draft[id]) break;
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
        if (!draft[id]) break;
        const buildData = processorLogic.buildData(draft[id].editorType);

        if (buildData) {
          if (draft[id].editorType === 'sql') {
            const {data, defaultData} = buildData(original(draft[id]), sampleData);

            draft[id].data = data;
            draft[id].defaultData = defaultData;
          } else {
            draft[id].data = buildData(original(draft[id]), sampleData);
          }
        } else {
          draft[id].data = sampleData;
        }
        draft[id].dataVersion = templateVersion;
        draft[id].sampleDataStatus = 'received';
        // store lastValidData in case user updates data as invalid json. As we still want to show the dropdown data values in
        // the rule or handlebars panel
        draft[id].lastValidData = sampleData;
        break;
      }

      case actionTypes._EDITOR.SAMPLEDATA.FAILED: {
        if (!draft[id]) break;
        draft[id].sampleDataStatus = 'error';
        draft[id].initError = sampleDataError;
        break;
      }

      case actionTypes._EDITOR.TOGGLE_VERSION: {
        if (!draft[id]) break;
        draft[id].sampleDataStatus = 'requested';
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
        if (!draft[id]) break;
        // TODO: change evaluate to preview
        draft[id].autoEvaluate = autoPreview ?? !draft[id].autoEvaluate;
        if (draft[id].autoEvaluate) {
          draft[id].previewStatus = 'requested';
        }
        break;
      }

      case actionTypes._EDITOR.PATCH.RULE: {
        if (!draft[id]) break;
        const ap = draft[id].activeProcessor;
        const draftRule = ap ? draft[id].rule[ap] : draft[id].rule;
        const shouldReplace =
          typeof rulePatch === 'string' ||
          Array.isArray(rulePatch) ||
          draftRule === undefined;

        if (!shouldReplace) {
          // TODO: ashu do we need to deep clone?
          Object.assign(draftRule, deepClone(rulePatch));
        } else if (ap) {
          draft[id].rule[ap] = rulePatch;
        } else {
          draft[id].rule = rulePatch;
        }

        // this logic is only applicable for handlebars editor and right now
        // the dual processor editors do not support handlebars. If they do in future, then
        // below logic would have to be updated accordingly
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
        if (!draft[id]) break;
        // Object.assign(draft[id].data, deepClone(dataPatch));
        const mode = draft[id].activeProcessor;

        if (mode) {
          draft[id].data[mode] = dataPatch;
        } else {
          draft[id].data = dataPatch;
        }
        draft[id].lastChange = Date.now();
        draft[id].lastValidData = draft[id].data;
        if (draft[id].autoEvaluate) {
          draft[id].previewStatus = 'requested';
        }
        break;
      }

      case actionTypes._EDITOR.PATCH.FEATURES: {
        if (!draft[id]) break;
        Object.assign(draft[id], featuresPatch);
        const mode = featuresPatch?.activeProcessor;

        // toggle form definition data when view is changed
        if (draft[id].editorType === 'settingsForm') {
          // if view was toggled, update form defintion
          if (mode) {
            const formData = toggleData(draft[id].data, mode);

            draft[id].data = formData;
            draft[id].layout = `${mode}FormBuilder`;
          } else if (featuresPatch?.data) {
            // if metadata is updated, reset form output
            delete draft[id].formOutput;
          }
        }
        draft[id].lastChange = Date.now();
        break;
      }

      case actionTypes._EDITOR.PREVIEW.RESPONSE: {
        if (!draft[id]) break;
        draft[id].result = result;
        draft[id].previewStatus = 'received';
        delete draft[id].error;
        delete draft[id].errorLine;
        delete draft[id].violations;
        break;
      }

      case actionTypes._EDITOR.VALIDATE_FAILURE: {
        if (!draft[id]) break;
        draft[id].violations = violations;
        draft[id].previewStatus = 'error';
        break;
      }

      case actionTypes._EDITOR.PREVIEW.FAILED: {
        if (!draft[id]) break;
        draft[id].error = error?.errorMessage;
        draft[id].errorLine = error?.errorLine;
        draft[id].previewStatus = 'error';
        break;
      }

      case actionTypes._EDITOR.SAVE.REQUEST: {
        if (!draft[id]) break;
        draft[id].saveStatus = 'requested';
        break;
      }

      case actionTypes._EDITOR.SAVE.FAILED: {
        if (!draft[id]) break;
        draft[id].saveStatus = 'failed';
        draft[id].saveMessage = saveMessage;
        break;
      }

      case actionTypes._EDITOR.SAVE.COMPLETE: {
        if (!draft[id]) break;
        const editor = draft[id];

        editor.saveStatus = 'success';
        let originalRule = editor.rule;

        if (typeof originalRule === 'object') {
          originalRule = deepClone(editor.rule);
        }
        editor.originalRule = originalRule;

        // reset originalData also if already exists in state
        if (editor.originalData) {
          let originalData = editor.data;

          if (typeof originalData === 'object') {
            originalData = deepClone(editor.data);
          }
          editor.originalData = originalData;
        }

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

  if (!editor) return;
  const mode = editor.activeProcessor;

  if (mode) {
    return editor.data?.[mode];
  }

  return editor.data;
};

selectors._editorResult = (state, id) => {
  if (!state) return emptyObj;

  const editor = state[id];

  return editor?.result || emptyObj;
};

selectors._editorRule = (state, id) => {
  if (!state) return emptyObj;

  const editor = state[id];

  if (!editor) return emptyObj;
  const mode = editor.activeProcessor;

  if (mode) {
    return editor.rule?.[mode];
  }

  return editor.rule;
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

// #endregion
