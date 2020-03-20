import produce from 'immer';
import actionTypes from '../../../actions/types';

export default (state = {}, action) => {
  const { id, installerInprogress, type } = action;

  return produce(state, draft => {
    if (!id) {
      return;
    }

    // eslint-disable-next-line default-case
    switch (type) {
      case actionTypes.INTEGRATION_APPS.RECEIVED_INSTALLER_STATUS:
        draft[id] = { installerInprogress };
        break;
    }
  });
};

// #region PUBLIC SELECTORS

export function isAddOnInstallerInProgress(state, id) {
  if (!(state && state[id])) {
    return { installerInprogress: false };
  }

  return { installerInprogress: state[id].installerInprogress || false };
}

// #endregion
