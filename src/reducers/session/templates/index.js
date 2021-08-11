import produce from 'immer';
import { createSelector } from 'reselect';
import actionTypes from '../../../actions/types';
import { INSTALL_STEP_TYPES } from '../../../utils/constants';
import { COMM_STATES as PUBLISH_STATES } from '../../comms/networkComms';

const defaultSteps = [];
const emptyObject = {};

export default function reducer(state = {}, action) {
  const {
    type,
    templateId,
    isInstallIntegration,
    components,
    installSteps,
    connectionMap,
    data,
    step = {},
  } = action;
  const {
    stackId,
    installURL,
    _connectionId,
    newConnectionId,
    status,
    verifyBundleStep,
    type: stepType,
  } = step;
  let currentStep;
  let bundleStep;

  return produce(state, draft => {
    // eslint-disable-next-line default-case
    switch (type) {
      case actionTypes.TEMPLATE.PREVIEW_REQUEST:
        if (!draft[templateId]) {
          draft[templateId] = {};
        }
        if (!draft[templateId].preview) {
          draft[templateId].preview = {};
        }
        draft[templateId].preview.status = 'requested';

        break;
      case actionTypes.TEMPLATE.RECEIVED_PREVIEW:
        if (!draft[templateId]) {
          draft[templateId] = {};
        }
        if (!draft[templateId].preview) {
          draft[templateId].preview = {};
        }

        draft[templateId].preview.components = components;
        draft[templateId].preview.status = 'success';

        if (isInstallIntegration) {
          draft[templateId].runKey = templateId;
        }

        draft[templateId].isInstallIntegration = isInstallIntegration;
        break;

      case actionTypes.TEMPLATE.FAILURE:
        if (!draft[templateId]) {
          draft[templateId] = {};
        }
        if (!draft[templateId].preview) {
          draft[templateId].preview = {};
        }
        draft[templateId].preview.status = 'failure';
        break;

      case actionTypes.TEMPLATE.CLEAR_TEMPLATE:
        delete draft[templateId];
        break;
      case actionTypes.TEMPLATE.CLEAR_UPLOADED:
        if (!draft[templateId]) {
          draft[templateId] = {};
        }

        delete draft[templateId].isInstallIntegration;
        break;
      case actionTypes.TEMPLATE.CREATED_COMPONENTS:
        if (!draft[templateId]) {
          draft[templateId] = {};
        }

        draft[templateId].createdComponents = components;
        break;
      case actionTypes.TEMPLATE.STEPS_RECEIVED:
        if (!draft[templateId]) {
          draft[templateId] = {};
        }

        draft[templateId].installSteps = installSteps;
        draft[templateId].connectionMap = connectionMap;
        draft[templateId].data = data;
        break;
      case actionTypes.TEMPLATE.UPDATE_STEP:
        if (!draft[templateId]) {
          draft[templateId] = {};
        }

        currentStep = (draft[templateId].installSteps || []).find(
          s =>
            (_connectionId && s._connectionId === _connectionId) ||
            (installURL && s.installURL === installURL && !s.completed) ||
            (stepType === INSTALL_STEP_TYPES.STACK &&
              s.type === INSTALL_STEP_TYPES.STACK)
        );

        if (currentStep) {
          if (status === 'completed') {
            currentStep.completed = true;

            if (newConnectionId) {
              draft[templateId].cMap = {
                ...draft[templateId].cMap,
                [_connectionId]: newConnectionId,
              };
            } else if (stackId) {
              draft[templateId].stackId = stackId;
            }

            if (verifyBundleStep) {
              bundleStep = (draft[templateId].installSteps || []).find(
                s => (s.application === verifyBundleStep && s.completed === false)
              );

              if (bundleStep) {
                bundleStep.options._connectionId = newConnectionId;
              }
            }
          } else if (status === 'triggered') {
            currentStep.isTriggered = true;
          } else if (status === 'verifying') {
            currentStep.isTriggered = true;
            currentStep.verifying = true;
          } else if (status === 'failed') {
            currentStep.isTriggered = false;
            currentStep.verifying = false;
          }
        }

        break;
      case actionTypes.TEMPLATE.INSTALL_FAILURE:
        if (!draft[templateId]) {
          draft[templateId] = {};
        }
        draft[templateId].isInstallFailed = true;
        break;
      case actionTypes.TEMPLATE.PUBLISH.REQUEST:
        if (!draft[templateId]) {
          draft[templateId] = {};
        }
        draft[templateId].publishStatus = PUBLISH_STATES.LOADING;
        break;
      case actionTypes.TEMPLATE.PUBLISH.SUCCESS:
        draft[templateId].publishStatus = PUBLISH_STATES.SUCCESS;
        break;
      case actionTypes.TEMPLATE.PUBLISH.ERROR:
        draft[templateId].publishStatus = PUBLISH_STATES.ERROR;
        break;
    }
  });
}

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.template = (state, templateId) => {
  if (!state || !state[templateId]) {
    return emptyObject;
  }

  return state[templateId];
};

selectors.previewTemplate = (state, templateId) => {
  if (!state || !state[templateId]) return emptyObject;

  return state[templateId].preview || emptyObject;
};

selectors.isFileUploaded = createSelector(
  state => state,
  state => {
    if (!state) {
      return emptyObject;
    }

    let uploadedZipFound;
    let id;

    Object.keys(state).forEach(key => {
      if (state[key].isInstallIntegration) {
        uploadedZipFound = true;
        id = key;
      }
    });

    return { templateId: id, isFileUploaded: uploadedZipFound };
  }
);

selectors.templateInstallSteps = (state, templateId) => {
  if (!state || !state[templateId]) {
    return defaultSteps;
  }

  return state[templateId].installSteps || defaultSteps;
};

selectors.connectionMap = (state, templateId) => {
  if (!state || !state[templateId] || !state[templateId].connectionMap) {
    return emptyObject;
  }

  return state[templateId].connectionMap;
};

selectors.templatePublishStatus = (state, templateId) => state?.[templateId]?.publishStatus || 'failed';
// #endregion
