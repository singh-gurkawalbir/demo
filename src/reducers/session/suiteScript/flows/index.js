import produce from 'immer';
import actionTypes from '../../../../actions/types';

export default (state = {}, action) => {
  const { type, ssLinkedConnectionId, _id, onOffInProgress } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.SUITESCRIPT.FLOW.RECEIVED_ON_OFF_ACTION_STATUS:
        draft[`${ssLinkedConnectionId}-${_id}`] = { onOffInProgress };
        break;

      default:
    }
  });
};

export function isOnOffInProgress(state, { ssLinkedConnectionId, _id }) {
  if (!(state && state[`${ssLinkedConnectionId}-${_id}`])) {
    return { onOffInProgress: false };
  }

  return { onOffInProgress: state[`${ssLinkedConnectionId}-${_id}`].onOffInProgress || false };
}
