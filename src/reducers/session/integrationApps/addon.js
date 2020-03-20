import produce from 'immer';
import actionTypes from '../../../actions/types';

export default (state = {}, action) => {
  const { id, installInprogress, type } = action;

  return produce(state, draft => {
    if (!id) {
      return;
    }

    // eslint-disable-next-line default-case
    switch (type) {
      case actionTypes.INTEGRATION_APPS.ADDON.RECEIVED_INSTALL_STATUS:
        draft[id] = { installInprogress };
        break;
    }
  });
};

// #region PUBLIC SELECTORS

export function isAddOnInstallInProgress(state, id) {
  if (!(state && state[id])) {
    return { installInprogress: false };
  }

  return { installInprogress: state[id].installInprogress || false };
}

// #endregion
