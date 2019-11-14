import produce from 'immer';
import actionTypes from '../../../actions/types';
import { INSTALL_STEP_TYPES } from '../../../utils/constants';

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
      case actionTypes.TEMPLATE.RECEIVED_PREVIEW:
        if (!draft[templateId]) {
          draft[templateId] = {};
        }

        draft[templateId].preview = components;
        draft[templateId].isInstallIntegration = isInstallIntegration;
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

            if (newConnectionId) {
              draft[templateId].cMap = {
                ...(draft[templateId].cMap || {}),
                [_connectionId]: newConnectionId,
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
    }
  });
}

// #region PUBLIC SELECTORS
export function template(state, templateId) {
  return (state || {})[templateId] || {};
}

export function previewTemplate(state, templateId) {
  return ((state || {})[templateId] || {}).preview || {};
}

export function isFileUploaded(state) {
  if (!state) {
    return {};
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

export function templateInstallSteps(state, templateId) {
  return ((state || {})[templateId] || {}).installSteps || [];
}

export function connectionMap(state, templateId) {
  return ((state || {})[templateId] || {}).connectionMap || {};
}
// #endregion
