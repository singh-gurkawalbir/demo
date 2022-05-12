import produce from 'immer';
import { keyBy } from 'lodash';
import { emptyList, emptyObject } from '../../../constants';
import actionTypes from '../../../actions/types';
import { generateReactFlowGraph } from '../../../utils/flows/flowbuilder';

export default function reducer(state = {}, action) {
  const { type, flow, flowId, stepId, targetId, targetType } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.FLOW.INIT_FLOW_GRAPH:
        if (!draft[flowId]) {
          draft[flowId] = {};
        }
        draft[flowId].elements = generateReactFlowGraph(flow);
        draft[flowId].elementsMap = keyBy(draft[flowId].elements || [], 'id');
        draft[flowId].flow = flow;

        break;
      case actionTypes.FLOW.DRAG_START: {
        draft[flowId].dragStepId = stepId;

        break;
      }

      case actionTypes.FLOW.DRAG_END: {
        delete draft[flowId].dragStepId;

        break;
      }

      case actionTypes.FLOW.MERGE_TARGET_SET: {
        draft[flowId].mergeTargetId = targetId;
        draft[flowId].mergeTargetType = targetType;

        break;
      }

      case actionTypes.FLOW.MERGE_TARGET_CLEAR: {
        delete draft[flowId].mergeTargetId;
        delete draft[flowId].mergeTargetType;
        break;
      }
      default:
        break;
    }
  });
}

// #region PUBLIC SELECTORS
export const selectors = {};

selectors.fbGraphElements = (state, flowId) => (state && state[flowId] && state[flowId].elements) || emptyList;
selectors.fbGraphElementsMap = (state, flowId) => (state && state[flowId]?.elementsMap) || emptyObject;
selectors.fbFlow = (state, flowId) => state && state[flowId]?.flow;
selectors.fbDragStepId = (state, flowId) => state?.[flowId]?.dragStepId;
selectors.fbMergeTargetType = (state, flowId) => state?.[flowId]?.mergeTargetType;
selectors.fbMergeTargetId = (state, flowId) => state?.[flowId]?.mergeTargetId;

// #endregion
