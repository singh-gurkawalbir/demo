import produce from 'immer';
import actionTypes from '../../../actions/types';

export default function reducer(state = {}, action) {
  const {
    type,
    templateId,
    components,
    installSteps,
    connectionMap,
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

  return produce(state, draft => {
    // eslint-disable-next-line default-case
    switch (type) {
      case actionTypes.TEMPLATE.RECEIVED_PREVIEW:
        if (!draft[templateId]) {
          draft[templateId] = {};
        }

        draft[templateId].preview = components;
        break;
      case actionTypes.TEMPLATE.STEPS_RECEIVED:
        if (!draft[templateId]) {
          draft[templateId] = {};
        }

        draft[templateId].installSteps = installSteps;
        draft[templateId].connectionMap = connectionMap;
        break;
      case actionTypes.TEMPLATE.UPDATE_STEP:
        if (!draft[templateId]) {
          draft[templateId] = {};
        }

        currentStep = (draft[templateId].installSteps || []).find(
          s =>
            (_connectionId && s._connectionId === _connectionId) ||
            (installURL && s.installURL === installURL) ||
            (stepType === 'Stack' && s.type === 'Stack')
        );

        if (currentStep) {
          if (status === 'completed') {
            currentStep.completed = true;

            if (newConnectionId) {
              draft[templateId].cMap = {
                ...(draft[templateId].cMap || {}),
                _connectionId: newConnectionId,
              };
            } else if (stackId) {
              draft[templateId].stackId = stackId;
            }

            if (verifyBundleStep) {
              (
                (draft[templateId].installSteps || []).find(
                  s => s.application === verifyBundleStep
                ) || {}
              ).options._connectionId = newConnectionId;
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
export function previewTemplate(state, templateId) {
  return ((state || {})[templateId] || {}).preview || {};
}

export function templateInstallSteps(state, templateId) {
  return ((state || {})[templateId] || {}).installSteps || [];
}

export function connectionMap(state, templateId) {
  return ((state || {})[templateId] || {}).connectionMap || {};
}
// #endregion
