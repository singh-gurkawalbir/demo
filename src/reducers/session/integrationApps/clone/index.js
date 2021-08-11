import produce from 'immer';
import actionTypes from '../../../../actions/types';

const defaultObject = { isCloned: false, integrationId: undefined };

export default (state = {}, action) => {
  const { id, isCloned, type, integrationId, sandbox } = action;

  return produce(state, draft => {
    if (!id) {
      return;
    }

    // eslint-disable-next-line default-case
    switch (type) {
      case actionTypes.INTEGRATION_APPS.CLONE.STATUS:
        draft[id] = { isCloned, integrationId, sandbox };
        break;
    }
  });
};

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.integrationClonedDetails = (state, id) => {
  if (!(state && state[id])) {
    return defaultObject;
  }

  return state[id];
};

// #endregion
