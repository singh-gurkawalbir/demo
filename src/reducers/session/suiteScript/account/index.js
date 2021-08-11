import produce from 'immer';
import actionTypes from '../../../../actions/types';

export default (state = {}, action) => {
  const { type, account, hasIntegrations } = action;

  if (!account) return state;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.SUITESCRIPT.ACCOUNT.RECEIVED_HAS_INTEGRATIONS:
        draft[account.toUpperCase()] = { hasIntegrations };
        break;

      default:
    }
  });
};

export const selectors = {};

selectors.netsuiteAccountHasSuiteScriptIntegrations = (state, account) => {
  if (!(state && account && state[account.toUpperCase()])) {
    return null;
  }

  return state[account.toUpperCase()].hasIntegrations;
};
