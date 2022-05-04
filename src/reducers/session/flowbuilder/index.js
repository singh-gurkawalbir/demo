import produce from 'immer';
import { keyBy } from 'lodash';
import { emptyList, emptyObject } from '../../../constants';
import actionTypes from '../../../actions/types';
import { generateReactFlowGraph } from '../../../utils/flows/flowbuilder';

export default function reducer(state = {}, action) {
  const { type, flow } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.FLOW.INIT_FLOW_GRAPH: {
        const flowId = flow?._id;

        if (!draft[flowId]) {
          draft[flowId] = {};
        }
        draft[flowId].elements = generateReactFlowGraph(flow);
        draft[flowId].elementsMap = keyBy(draft[flowId].elements || [], 'id');
        draft[flowId].flow = flow;
      }
        break;
      default:
        break;
    }
  });
}

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.fbElements = (state, flowId) => (state && state[flowId] && state[flowId].elements) || emptyList;
selectors.fbElementsMap = (state, flowId) => (state && state[flowId]?.elementsMap) || emptyObject;
selectors.fbFlow = (state, flowId) => state && state[flowId]?.flow;
selectors.fbDragNodeId = (state, flowId) => state?.[flowId]?.dragNodeId;

// #endregion
