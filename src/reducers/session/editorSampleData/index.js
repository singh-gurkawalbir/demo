import produce from 'immer';
import actionTypes from '../../../actions/types';

const emptyObj = {};

export default function reducer(state = {}, action) {
  const {
    type,
    flowId,
    resourceId,
    fieldType,
    sampleData,
    fieldEditorVersion,
  } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.EDITOR_SAMPLE_DATA.REQUEST:
        if (!draft[resourceId]) {
          draft[resourceId] = {};
        }

        if (!draft[resourceId][flowId]) {
          draft[resourceId][flowId] = {};
        }

        // draft[resourceId][flowId][fieldType] = {
        //   status: 'requested',
        // };
        if (!draft[resourceId][flowId][fieldType]) {
          draft[resourceId][flowId][fieldType] = { sampleData: 'requested' };
        } else {
          draft[resourceId][flowId][fieldType].sampleData = 'requested';
        }

        break;
      case actionTypes.EDITOR_SAMPLE_DATA.RECEIVED:
        draft[resourceId][flowId][fieldType] = {
          data: sampleData,
          fieldEditorVersion,
          status: 'received',
        };

        break;
      case actionTypes.EDITOR_SAMPLE_DATA.FAILED:
        draft[resourceId][flowId][fieldType] = {
          status: 'failed',
        };
        break;
      case actionTypes.EDITOR_SAMPLE_DATA.CLEAR:
        if (resourceId && draft[resourceId]) {
          delete draft[resourceId];
        } else if (flowId && draft[resourceId] && draft[resourceId][flowId]) {
          delete draft[resourceId][flowId];
        } else if (
          fieldType &&
          draft[resourceId] &&
          draft[resourceId][flowId] &&
          draft[resourceId][flowId][fieldType]
        ) {
          delete draft[resourceId][flowId][fieldType];
        }

        break;
      default:
    }
  });
}

// #region PUBLIC SELECTORS
export function getEditorSampleData(state, { flowId, resourceId, fieldType }) {
  if (!state) return emptyObj;

  if (
    state[resourceId] &&
    state[resourceId][flowId] &&
    state[resourceId][flowId][fieldType]
  ) {
    return state[resourceId][flowId][fieldType];
  }

  return emptyObj;
}
