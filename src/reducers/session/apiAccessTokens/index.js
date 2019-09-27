import produce from 'immer';
import actionTypes from '../../../actions/types';

export default (state = [], action) => {
  const { type, accessToken } = action;

  // window.state = state;
  // console.log(`accessToken -- ${JSON.stringify(accessToken)}`);

  if (!type) {
    return state;
  }

  let resourceIndex;

  return produce(state, draft => {
    resourceIndex = state.findIndex(r => r._id === accessToken._id);
    // console.log(`resourceIndex -- ${resourceIndex}`);

    if (resourceIndex === -1) {
      return;
    }

    // eslint-disable-next-line default-case
    switch (type) {
      case actionTypes.ACCESSTOKEN_TOKEN_RECEIVED:
        draft[resourceIndex].token = accessToken.token;

        break;
      case actionTypes.ACCESSTOKEN_TOKEN_MASK:
        draft[resourceIndex].token = null;

        break;
      default:
        return draft;
    }
  });
};
// #region PUBLIC SELECTORS

export function apiAccessToken(state, id) {
  if (!state) return '*****';

  return state.find(t => t._id === id) || '*****';
}

// #endregion
