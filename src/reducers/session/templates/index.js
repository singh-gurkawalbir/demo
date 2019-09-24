import produce from 'immer';
import actionTypes from '../../../actions/types';

export default function reducer(state = {}, action) {
  const { type, templateId, components, installSteps, connectionMap } = action;

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
