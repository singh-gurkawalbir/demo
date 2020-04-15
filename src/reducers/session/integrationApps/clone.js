import produce from 'immer';
import actionTypes from '../../../actions/types';

export default (state = {}, action) => {
  const { id, isCloned, type, integrationId } = action;

  return produce(state, draft => {
    if (!id) {
      return;
    }

    // eslint-disable-next-line default-case
    switch (type) {
      case actionTypes.INTEGRATION_APPS.CLONE.STATUS:
        draft[id] = { isCloned, integrationId };
        break;
    }
  });
};

// #region PUBLIC SELECTORS

export function integrationClonedDeatils(state, id) {
  if (!(state && state[id])) {
    return { isCloned: false, integrationId: undefined };
  }

  return state[id];
}

// #endregion
