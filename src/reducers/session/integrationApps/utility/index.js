import produce from 'immer';
import actionTypes from '../../../../actions/types';

const emptyObject = {};

export default (state = {}, action) => {
  const {
    integrationId,
    type,
    runKey,
  } = action;

  return produce(state, draft => {
    if (!integrationId) {
      return;
    }

    // eslint-disable-next-line default-case
    switch (type) {
      case actionTypes.INTEGRATION_APPS.UTILITY.RECEIVED_S3_RUN_KEY:
        draft[integrationId] = runKey;
        break;
      case actionTypes.INTEGRATION_APPS.UTILITY.CLEAR_RUN_KEY:
        delete draft[integrationId];
        break;
    }
  });
};

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.integrationAppCustomTemplateRunKey = (state, id) => {
  if (!state || !state[id]) {
    return emptyObject;
  }

  return state[id];
};
// #endregion
