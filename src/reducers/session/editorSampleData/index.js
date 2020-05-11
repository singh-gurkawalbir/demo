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
    // formValue,
    templateVersion,
  } = action;

  return produce(state, draft => {
    if (!resourceId && !flowId) return;

    switch (type) {
      case actionTypes.EDITOR_SAMPLE_DATA.REQUEST:
        if (!draft[resourceId]) {
          draft[resourceId] = {};
        }

        if (!draft[resourceId][flowId]) {
          draft[resourceId][flowId] = {};
        }

        if (!draft[resourceId][flowId][fieldType]) {
          draft[resourceId][flowId][fieldType] = { status: 'requested' };
        } else {
          draft[resourceId][flowId][fieldType].status = 'requested';
        }

        break;
      case actionTypes.EDITOR_SAMPLE_DATA.RECEIVED:
        draft[resourceId][flowId][fieldType] = {
          data: sampleData,
          templateVersion,
          status: 'received',
        };

        break;
      case actionTypes.EDITOR_SAMPLE_DATA.FAILED:
        draft[resourceId][flowId][fieldType] = {
          status: 'failed',
        };
        break;
      case actionTypes.EDITOR_SAMPLE_DATA.CLEAR:
        if (flowId) {
          Object.keys(draft).forEach(id => {
            if (draft[id][flowId]) {
              delete draft[id][flowId];
            }
          });
        } else {
          delete draft[resourceId];
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
