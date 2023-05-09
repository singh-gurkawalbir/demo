/* eslint-disable camelcase */
import { original, produce } from 'immer';
import { set } from 'lodash';
import actionTypes from '../../../actions/types';
import customCloneDeep from '../../../utils/customCloneDeep';
import processorLogic from './processorLogic';
import { toggleData } from './processorLogic/settingsForm';

const emptyObj = {};

export const CHAT_STATUS = {
  IDLE: 'idle',
  PENDING: 'pending',
};

export default function reducer(state = {}, action) {
  const {
    type,
    id,
    options,
    featuresPatch,
    rulePatch,
    rulePath,
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
    fileKeyPatchType,
    fileKeyPatch,
  } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.EDITOR.UPDATE_HELPER_FUNCTIONS:
        draft.helperFunctions = helperFunctions;
        break;

      case actionTypes.EDITOR.INIT: {
        // initStatus is used to determine if parent url
        // redirection needs to happen or not on page refresh
        draft[id] = { initStatus: 'inProgress' };
        break;
      }

      case actionTypes.EDITOR.INIT_COMPLETE: {
        const chatOptions = processorLogic.getChatOptions(options?.editorType);

        draft[id] = {
          ...options,
          chat: !chatOptions
            ? {
              enabled: false,
            }
            : {
              formKey: `chat-${id}`,
              status: CHAT_STATUS.IDLE,
              ...chatOptions,
            },
        };
        break;
      }

      case actionTypes.EDITOR.CHANGE_LAYOUT: {
        if (!draft[id]) break;
        draft[id].layout = newLayout;
        break;
      }

      case actionTypes.EDITOR.CLEAR: {
        delete draft[id];

        break;
      }

      case actionTypes.EDITOR.SAMPLEDATA.RECEIVED: {
        if (!draft[id]) break;
        const buildData = processorLogic.buildData(draft[id].editorType);

        if (buildData) {
          if (
            draft[id].editorType === 'sql' ||
            draft[id].editorType === 'databaseMapping'
          ) {
            const { data, defaultData } = buildData(
              original(draft[id]),
              sampleData
            );

            draft[id].data = data;
            draft[id].defaultData = defaultData || '';
            draft[id].originalDefaultData = defaultData || '';
          } else {
            draft[id].data = buildData(original(draft[id]), sampleData);
          }
        } else {
          draft[id].data = sampleData;
          // for file definition generator where post map data needs to be shown
          // this action gets called so we add the originalData here
          // ref IO-27516
          if (
            draft[id].editorType === 'structuredFileGenerator' &&
            draft[id].stage
          ) {
            draft[id].originalData = sampleData;
          }
        }
        draft[id].dataVersion = templateVersion;
        draft[id].sampleDataStatus = 'received';
        // store lastValidData in case user updates data as invalid json. As we still want to show the dropdown data values in
        // the rule or handlebars panel
        draft[id].lastValidData = sampleData;
        break;
      }

      case actionTypes.EDITOR.SAMPLEDATA.FAILED: {
        if (!draft[id]) break;
        draft[id].sampleDataStatus = 'error';
        draft[id].initError = sampleDataError;
        break;
      }

      case actionTypes.EDITOR.TOGGLE_VERSION: {
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

      case actionTypes.EDITOR.TOGGLE_AUTO_PREVIEW: {
        if (!draft[id]) break;
        // TODO: change evaluate to preview
        draft[id].autoEvaluate = autoPreview ?? !draft[id].autoEvaluate;
        break;
      }

      case actionTypes.EDITOR.PATCH.RULE: {
        if (!draft[id]) break;
        // console.log('PATCH.RULE', JSON.stringify(rulePatch, null, 2));
        const ap = draft[id].activeProcessor;
        const draftRule = ap ? draft[id].rule[ap] : draft[id].rule;
        const shouldReplace =
          !rulePatch ||
          typeof rulePatch === 'string' ||
          Array.isArray(rulePatch) ||
          draftRule === undefined;

        if (rulePath) {
          set(draftRule, rulePath, rulePatch);
        } else if (processorLogic.updateRule(draft[id])) {
          processorLogic.updateRule(draft[id])(
            draft[id],
            action,
            shouldReplace
          );
        } else if (!shouldReplace) {
          Object.assign(draftRule, customCloneDeep(rulePatch));
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
        if (draft[id].autoEvaluate) {
          draft[id].previewStatus = 'requested';
        }
        break;
      }

      case actionTypes.EDITOR.PATCH.DATA: {
        if (!draft[id]) break;
        // Object.assign(draft[id].data, deepClone(dataPatch));
        const mode =
          draft[id].activeProcessor || draft[id]?.rule?.activeProcessor;

        if (mode) {
          if (!draft[id].data) {
            draft[id].data = {};
          }
          draft[id].data[mode] = dataPatch;
        } else {
          draft[id].data = dataPatch;
        }
        draft[id].lastValidData = draft[id].data;
        if (draft[id].autoEvaluate) {
          draft[id].previewStatus = 'requested';
        }
        break;
      }

      case actionTypes.EDITOR.PATCH.FEATURES: {
        if (!draft[id]) break;
        Object.assign(draft[id], featuresPatch);
        const mode = featuresPatch?.activeProcessor;

        // toggle form definition data when view is changed
        if (draft[id].editorType === 'settingsForm') {
          // if view was toggled, update form definition
          if (mode) {
            const formData = toggleData(
              draft[id].data,
              mode,
              draft[id].flowGrouping,
              draft[id].resourceDocs
            );

            draft[id].data = formData;
            draft[id].layout = `${mode}FormBuilder`;
          } else if (featuresPatch?.data) {
            // if metadata is updated, reset form output
            delete draft[id].formOutput;
          }
        } else if (draft[id].editorType === 'router') {
          if (mode) {
            delete draft[id].activeProcessor;
            draft[id].rule.activeProcessor = mode;
            draft[id].layout = `${
              mode === 'filter' ? 'json' : 'script'
            }FormBuilder`;
            // clear the output panel
            delete draft[id].result;

            const {branches} = draft[id].rule || {};

            if (Array.isArray(branches)) {
              draft[id].rule.branches = branches.map(branch => ({
                ...branch,
                skipEmptyRuleCleanup: false,
              }));
            }
          }
        }

        break;
      }

      case actionTypes.EDITOR.PATCH.FILE_KEY_COLUMN: {
        // this action is specific to DynaFileKeyColumn component
        if (!draft[id]) break;
        if (fileKeyPatchType === 'data') {
          draft[id].data = fileKeyPatch;
        } else if (fileKeyPatchType === 'rule') {
          Object.assign(draft[id].rule, customCloneDeep(fileKeyPatch));
        }

        if (draft[id].autoEvaluate) {
          draft[id].previewStatus = 'requested';
        }
        break;
      }

      case actionTypes.EDITOR.PREVIEW.REQUEST:
        if (!draft[id]) break;
        draft[id].previewStatus = 'requested';
        delete draft[id].error;
        delete draft[id].errorLine;
        delete draft[id].violations;
        break;

      case actionTypes.EDITOR.PREVIEW.RESPONSE: {
        if (!draft[id]) break;
        draft[id].result = result;
        draft[id].previewStatus = 'received';
        delete draft[id].error;
        delete draft[id].errorLine;
        delete draft[id].violations;
        break;
      }

      case actionTypes.EDITOR.VALIDATE_FAILURE: {
        if (!draft[id]) break;
        draft[id].violations = violations;
        draft[id].previewStatus = 'error';
        break;
      }

      case actionTypes.EDITOR.PREVIEW.FAILED: {
        if (!draft[id]) break;
        draft[id].error = error?.errorMessage;
        draft[id].errorLine = error?.errorLine;
        draft[id].errSourceProcessor = error?.errSourceProcessor;
        draft[id].previewStatus = 'error';
        delete draft[id].result;
        break;
      }

      case actionTypes.EDITOR.SAVE.REQUEST: {
        if (!draft[id]) break;
        draft[id].saveStatus = 'requested';
        break;
      }

      case actionTypes.EDITOR.SAVE.FAILED: {
        if (!draft[id]) break;
        draft[id].saveStatus = 'failed';
        draft[id].saveMessage = saveMessage;
        break;
      }

      case actionTypes.EDITOR.SAVE.COMPLETE: {
        if (!draft[id]) break;
        const editor = draft[id];

        editor.saveStatus = 'success';
        const ap = editor.activeProcessor;

        // to handle javascript dirty logic
        // reset the _init_code
        if (ap && editor.rule?.[ap] && editor.rule[ap]._init_code) {
          editor.rule[ap]._init_code = editor.rule[ap].code;
        } else if (editor.rule?._init_code) {
          editor.rule._init_code = editor.rule.code;
        }

        let originalRule = editor.rule;

        if (typeof originalRule === 'object') {
          originalRule = customCloneDeep(editor.rule);
        }
        editor.originalRule = originalRule;

        // reset originalData also if already exists in state
        if (editor.originalData) {
          let originalData = editor.data;

          if (typeof originalData === 'object') {
            originalData = customCloneDeep(editor.data);
          }
          editor.originalData = originalData;
        }

        // reset originalDefaultData also if already exists in state (for dirty check)
        if (editor.originalDefaultData) {
          editor.originalDefaultData = editor.defaultData;
        }

        break;
      }

      case actionTypes.EDITOR.CHAT.REQUEST: {
        draft[id].chat.status = CHAT_STATUS.PENDING;
        draft[id].chat.errors = null;

        break;
      }

      case actionTypes.EDITOR.CHAT.FAILED: {
        draft[id].chat.status = CHAT_STATUS.IDLE;
        draft[id].chat.errors = error;
        break;
      }

      case actionTypes.EDITOR.CHAT.COMPLETE: {
        draft[id].chat.status = CHAT_STATUS.IDLE;
        draft[id].chat.errors = null;
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

  return editor || emptyObj;
};

selectors.editorData = (state, id) => {
  if (!state) return;

  const editor = state[id];

  if (!editor) return;
  const mode = editor.activeProcessor || editor.rule?.activeProcessor;

  if (mode) {
    return editor.data?.[mode];
  }

  return editor.data;
};

selectors.editorResult = (state, id) => {
  if (!state) return emptyObj;

  const editor = state[id];

  return editor?.result || emptyObj;
};

selectors.editorActiveProcessor = (state, id) => {
  if (!state[id]) return;

  return state[id].activeProcessor || state[id].rule?.activeProcessor;
};

selectors.editorRule = (state, id) => {
  if (!state) return emptyObj;

  const editor = state[id];

  if (!editor) return emptyObj;
  const mode = editor.activeProcessor;

  if (mode) {
    return editor.rule?.[mode];
  }

  return editor.rule;
};

selectors.editorPreviewError = (state, id) => {
  if (!state) return emptyObj;

  const editor = state[id];

  return {
    error: editor?.error,
    errorLine: editor?.errorLine,
    errSourceProcessor: editor?.errSourceProcessor,
  };
};

selectors.editorDataVersion = (state, id) => {
  if (!state) return;

  const editor = state[id];

  return editor?.dataVersion;
};

selectors.editorLayout = (state, id) => {
  if (!state) return;

  const editor = state[id];

  return editor?.layout;
};

selectors.editorViolations = (state, id) => processorLogic.validate(state?.[id]);

selectors.isEditorDirty = (state, id) => processorLogic.isDirty(state?.[id]);

selectors.editorChatState = (state, id) => {
  if (!state) return emptyObj;

  const editor = state[id];

  return editor?.chat || emptyObj;
};
// #endregion
