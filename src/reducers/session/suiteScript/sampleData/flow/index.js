import produce from 'immer';
import actionTypes from '../../../../../actions/types';

const DEFAULT_VALUE = {};

export default (state = {}, action) => {
  const { ssLinkedConnectionId, integrationId, flowId, type, previewData, error } = action;
  const id = `${ssLinkedConnectionId}-${integrationId}-${flowId}`;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.SUITESCRIPT.SAMPLEDATA.REQUEST: {
        if (!draft[id]) {
          draft[id] = {
            status: 'requested',
          };
        } else {
          draft[id].status = 'requested';
        }
        break;
      }
      case actionTypes.SUITESCRIPT.SAMPLEDATA.RECEIVED: {
        if (!draft[id]) {
          draft[id] = {};
        }
        draft[id].status = 'received';
        draft[id].data = previewData;
        break;
      }
      case actionTypes.SUITESCRIPT.SAMPLEDATA.RECEIVED_ERROR: {
        if (!draft[id]) {
          draft[id] = {};
        }
        draft[id].status = 'error';
        draft[id].data = error;
        break;
      }
      case actionTypes.SUITESCRIPT.SAMPLEDATA.RESET: {
        delete draft[id];
        break;
      }

      default:
    }
  });
};

export const selectors = {};

selectors.suiteScriptFlowSampleDataContext = (
  state,
  { ssLinkedConnectionId, integrationId, flowId }
) => {
  // returns input data for that stage to populate
  const id = `${ssLinkedConnectionId}-${integrationId}-${flowId}`;
  const flowData = state?.[id];

  return flowData || DEFAULT_VALUE;
};
