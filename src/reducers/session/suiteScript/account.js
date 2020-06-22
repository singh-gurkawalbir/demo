import produce from 'immer';
import actionTypes from '../../../actions/types';

export default (state = {}, action) => {
  const { type, account, hasIntegrations } = action;

  return produce(state, (draft) => {
    switch (type) {
      case actionTypes.SUITESCRIPT.ACCOUNT.RECEIVED_HAS_INTEGRATIONS:
        draft[account.toUpperCase()] = { hasIntegrations };
        break;

      default:
    }
  });
};

export function hasIntegrations(state, account) {
  if (!(state && state[account.toUpperCase()])) {
    return null;
  }

  return state[account].hasIntegrations;
}
