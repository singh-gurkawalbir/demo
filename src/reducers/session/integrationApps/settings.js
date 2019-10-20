import produce from 'immer';
import actionTypes from '../../../actions/types';

export default function reducer(state = {}, action) {
  const { type, integrationId, flowId, fieldMeta, formValues } = action;
  const key = `${integrationId}-${flowId}`;

  return produce(state, draft => {
    // eslint-disable-next-line default-case
    switch (type) {
      case actionTypes.INTEGRATION_APPS.SETTINGS.FORM.INIT:
        draft[key] = { initComplete: false };
        break;

      case actionTypes.INTEGRATION_APPS.SETTINGS.FORM.INIT_COMPLETE:
        draft[key] = { initComplete: true, fieldMeta };
        break;

      case actionTypes.RESOURCE_FORM.SUBMIT:
        if (!draft[key]) {
          draft[key] = {};
        }

        draft[key].submitComplete = false;
        draft[key].formValues = undefined;
        break;

      case actionTypes.RESOURCE_FORM.SUBMIT_COMPLETE:
        if (!draft[key]) {
          draft[key] = {};
        }

        draft[key].submitComplete = true;
        draft[key].formValues = formValues;
        break;

      case actionTypes.RESOURCE_FORM.CLEAR:
        draft[key] = {};
        break;
    }
  });
}

// #region PUBLIC SELECTORS
export function integrationAppSettingsFormState(state, integrationId, flowId) {
  if (!state) {
    return {};
  }

  const key = `${integrationId}-${flowId}`;

  return state[key] || {};
}
// #endregion
