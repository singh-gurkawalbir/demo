import produce from 'immer';
import actionTypes from '../../../../../actions/types';

const DEFAULT_VALUE = {};

export default (state = {}, action) => {
  const { ssLinkedConnectionId, integrationId, flowId, type } = action;
  const id = `${ssLinkedConnectionId}-${integrationId}-${flowId}`;
  return produce(state, draft => {
    switch (type) {
      case actionTypes.SUITESCRIPT.IMPORT_SAMPLEDATA.REQUEST: {
        if (!draft[id]) {
          draft[id] = {
            status: 'requested'
          };
        } else {
          draft[id].status = 'requested';
        }
        break;
      }
      case actionTypes.SUITESCRIPT.IMPORT_SAMPLEDATA.RECEIVED: {
        const {data} = action;
        if (!draft[id]) {
          draft[id] = {};
        }
        draft[id].status = 'received';
        draft[id].data = data;
        break;
      }
      case actionTypes.SUITESCRIPT.IMPORT_SAMPLEDATA.RECEIVED_ERROR: {
        const {error} = action;
        draft[id].status = 'error';
        draft[id].data = error;
        break;
      }

      default:
    }
  });
};

export function importSampleDataContext(
  state,
  { ssLinkedConnectionId, integrationId, flowId }
) {
  // returns input data for that stage to populate
  const id = `${ssLinkedConnectionId}-${integrationId}-${flowId}`;
  const flowData = state[id];
  return flowData || DEFAULT_VALUE;
}
