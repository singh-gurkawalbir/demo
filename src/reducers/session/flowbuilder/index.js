import produce from 'immer';
import { emptyList } from '../../../utils/constants';

const emptyObj = {};

export default function reducer(state = {}, action) {
  const { type } = action;

  return produce(state, draft => {
    switch (type) {
      default:
        break;
    }
  });
}

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.fbElements = (state, flowId) => (state && state[flowId] && state[flowId].elements) || emptyList;
selectors.fbElementsMap = (state, flowId) => (state && state[flowId]?.elementsMap) || emptyObj;
selectors.fbDragNodeId = (state, flowId) => state?.[flowId]?.dragNodeId;

// #endregion
