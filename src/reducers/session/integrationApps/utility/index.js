import produce from 'immer';
import actionTypes from '../../../../actions/types';

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
      case actionTypes.INTEGRATION_APPS.UTILITY.REQUEST_S3_KEY:
        draft[integrationId] = {status: 'requested'};
        break;
      case actionTypes.INTEGRATION_APPS.UTILITY.RECEIVED_S3_RUN_KEY:
        draft[integrationId] = {runKey, status: 'received'};
        break;
      case actionTypes.INTEGRATION_APPS.UTILITY.CLEAR_RUN_KEY:
        delete draft[integrationId];
        break;
    }
  });
};

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.integrationAppCustomTemplateRunKey = (state, id) => state && state[id]?.runKey;
selectors.integrationAppCustomTemplateRunKeyStatus = (state, id) => state && state[id]?.status;
// #endregion
