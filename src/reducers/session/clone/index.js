import produce from 'immer';
import actionTypes from '../../../actions/types';
import { INSTALL_STEP_TYPES } from '../../../utils/constants';

export default function reducer(state = {}, action) {
  const {
    type,
    resourceId,
    resourceType,
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
  let bundleStep;
  const key = `${resourceType}-${resourceId}`;

  return produce(state, draft => {
    // eslint-disable-next-line default-case
    switch (type) {
      case actionTypes.CLONE.RECEIVED_PREVIEW:
        if (!draft[key]) {
          draft[key] = {};
        }

        draft[key].preview = components;
        break;
      case actionTypes.CLONE.CLEAR_TEMPLATE:
        delete draft[key];
        break;
      case actionTypes.CLONE.CREATED_COMPONENTS:
        if (!draft[key]) {
          draft[key] = {};
        }

        draft[key].createdComponents = components;
        break;
      case actionTypes.CLONE.STEPS_RECEIVED:
        if (!draft[key]) {
          draft[key] = {};
        }

        draft[key].installSteps = installSteps;
        draft[key].connectionMap = connectionMap;
        break;
      case actionTypes.CLONE.UPDATE_STEP:
        if (!draft[key]) {
          draft[key] = {};
        }

        currentStep = (draft[key].installSteps || []).find(
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
              draft[key].cMap = {
                ...(draft[key].cMap || {}),
                [_connectionId]: newConnectionId,
              };
            } else if (stackId) {
              draft[key].stackId = stackId;
            }

            if (verifyBundleStep) {
              bundleStep = (draft[key].installSteps || []).find(
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

export function clonePreview(state, resourceType, resourceId) {
  const key = `${resourceType}-${resourceId}`;

  if (!state || !state[key]) {
    return null;
  }

  return state[key].preview;
}

export function templateInstallSteps(state, resourceType, resourceId) {
  const key = `${resourceType}-${resourceId}`;

  if (!state || !state[key]) {
    return null;
  }

  return state[key].installSteps;
}

export function connectionMap(state, resourceType, resourceId) {
  const key = `${resourceType}-${resourceId}`;

  if (!state || !state[key]) {
    return null;
  }

  return state[key].connectionMap;
}
// #endregion
