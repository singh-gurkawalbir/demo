import produce from 'immer';
import { createSelector } from 'reselect';
import actionTypes from '../../../actions/types';
import { INSTALL_STEP_TYPES } from '../../../utils/constants';

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
  const connMap = {};

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
        if (!draft[templateId].status) {
          draft[templateId].status = {};
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
            (installURL && s.installURL === installURL) ||
            (stepType === INSTALL_STEP_TYPES.STACK &&
              s.type === INSTALL_STEP_TYPES.STACK)
        );

        if (currentStep) {
          if (status === 'completed') {
            currentStep.completed = true;

            const { connectionMap = {} } = draft[templateId];

            if (verifyBundleStep) {
              Object.keys(connectionMap).forEach(key => {
                if (connectionMap[key].type === verifyBundleStep) {
                  connMap[connectionMap[key]._id] = newConnectionId;
                }
              });
            }

            if (newConnectionId) {
              draft[templateId].cMap = {
                ...draft[templateId].cMap,
                [_connectionId]: newConnectionId,
                ...connMap,
              };
            } else if (stackId) {
              draft[templateId].stackId = stackId;
            }

            if (verifyBundleStep) {
              bundleStep = (draft[templateId].installSteps || []).find(
                s => s.application === verifyBundleStep
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
    }
  });
}

// #region PUBLIC SELECTORS
export function template(state, templateId) {
  if (!state || !state[templateId]) {
    return emptyObject;
  }

  return state[templateId];
}

export function previewTemplate(state, templateId) {
  if (!state || !state[templateId]) return emptyObject;

  return state[templateId].preview || emptyObject;
}

export const isFileUploaded = createSelector(
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

export function templateInstallSteps(state, templateId) {
  if (!state || !state[templateId]) {
    return defaultSteps;
  }

  return state[templateId].installSteps || defaultSteps;
}

export function connectionMap(state, templateId) {
  if (!state || !state[templateId] || !state[templateId].connectionMap) {
    return emptyObject;
  }

  return state[templateId].connectionMap;
}
// #endregion
