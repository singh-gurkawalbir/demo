import produce from 'immer';
import actionTypes from '../../actions/types';
// import { response } from 'msw';

export default (state = {}, action) => {
  const { type, error, response } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.DASHBOARD.RECEIVED:
        draft.dashboardResponse = response;
        draft.status = 'received';
        break;

      case actionTypes.DASHBOARD.REQUEST:
        draft.status = 'requested';
        break;

      case actionTypes.DASHBOARD.POST_PREFERENCE:
        draft.status = 'loading';
        draft.error = null;
        break;

      case actionTypes.DASHBOARD.PREFERENCE_POSTED:
        draft.status = 'succeeded';
        draft.dashboardResponse = response;
        draft.error = null;
        break;

      case actionTypes.DASHBOARD.PREFERENCE_POST_FAILED:
        draft.status = 'failed';
        draft.error = error;
        break;
      default:
    }
  });
};

// #region PUBLIC SELECTORS
export const selectors = {};

// selectors.fetchingError = state => {
//   if (!state || state.status !== 'error') {
//     return;
//   }

//   return state.error;
// };

selectors.isAPICallComplete = state => state?.status === 'received';
// selectors.customId = state => state?.defaultAShareId;

selectors.layoutData = state => state?.dashboardResponse?.[0]?.layouts;
selectors.graphData = state => state?.dashboardResponse?.[0]?.graphTypes;
selectors.getData = state => state?.dashboardResponse?.[0];
selectors.errorMessage = state => state?.error;
// #endregion
