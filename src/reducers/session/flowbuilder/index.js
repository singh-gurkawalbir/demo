import produce from 'immer';
import { keyBy } from 'lodash';
import { emptyList, emptyObject } from '../../../constants';
import actionTypes from '../../../actions/types';
import { generateReactFlowGraph } from '../../../utils/flows/flowbuilder';

export default function reducer(state = {}, action) {
  const { type, flow, flowId, subFlowProps, stepId, targetId, targetType, status, isViewMode, info, isDataLoader, view, isSubFlowView, linkedEdges } = action;

  return produce(state, draft => {
    switch (type) {
      case actionTypes.FLOW.INIT_FLOW_GRAPH:
        if (!draft[flowId]) {
          draft[flowId] = {};
        }
        draft[flowId].elements = generateReactFlowGraph(flow, isViewMode, isDataLoader);
        draft[flowId].elementsMap = keyBy(draft[flowId].elements || [], 'id');
        draft[flowId].flow = flow;
        draft[flowId].isViewMode = isViewMode;
        delete draft[flowId].dragStepId;

        break;
      case actionTypes.FLOW.DRAG_START: {
        draft[flowId].dragStepIdInProgress = stepId;

        break;
      }
      case actionTypes.FLOW.ICON_VIEW: {
        draft[flowId].iconView = view;

        break;
      }
      case actionTypes.FLOW.TOGGLE_SUBFLOW_VIEW: {
        if (!draft[flowId]) {
          draft[flowId] = {};
        }

        draft[flowId].isSubFlowActive = isSubFlowView;
        draft[flowId].subFlowProps = subFlowProps;
        break;
      }

      case actionTypes.FLOW.SET_DRAG_IN_PROGRESS: {
        draft[flowId].dragStepId = draft[flowId].dragStepIdInProgress;
        delete draft[flowId].dragStepIdInProgress;
        break;
      }
      case actionTypes.FLOW.EDGE_HOVER: {
        if (!draft[flowId]) {
          draft[flowId] = {};
        }
        draft[flowId].linkedEdges = linkedEdges;
        break;
      }
      case actionTypes.FLOW.EDGE_UNHOVER: {
        if (!draft[flowId]) {
          draft[flowId] = {};
        }
        delete draft[flowId].linkedEdges;
        break;
      }

      case actionTypes.FLOW.SET_SAVE_STATUS: {
        if (!draft[flowId]) {
          draft[flowId] = {};
        }
        draft[flowId].status = status;
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

      case actionTypes.FLOW.ADD_NEW_PP_STEP_INFO: {
        draft[flowId].info = info;
        break;
      }

      case actionTypes.FLOW.CLEAR_PP_STEP_INFO: {
        delete draft[flowId].info;
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
selectors.fbInfo = (state, flowId) => state?.[flowId]?.info || emptyObject;
selectors.fbMergeTargetType = (state, flowId) => state?.[flowId]?.mergeTargetType;
selectors.fbMergeTargetId = (state, flowId) => state?.[flowId]?.mergeTargetId;
selectors.fbIconview = (state, flowId) => state?.[flowId]?.iconView;
selectors.fbSubFlowView = (state, flowId) => state?.[flowId]?.isSubFlowActive;
selectors.fbSelectedSubFlow = (state, flowId) => state?.[flowId]?.subFlowProps;
selectors.fbDragStepIdInProgress = (state, flowId) => state?.[flowId]?.dragStepIdInProgress;
selectors.fbEdgeHovered = (state, flowId) => state?.[flowId]?.linkedEdges;

selectors.fbRouterStepsInfo = (state, flowId, routerId) => {
  let configuredCount = 0;
  let unconfiguredCount = 0;
  const visitedRouters = {};
  const flow = state && state[flowId]?.flow;

  if (flow && flow.routers && flow.routers.length) {
    const routerStepsCount = (routerId, ignoreFirstBranch, ignoreAll) => {
      const router = flow.routers.find(r => r.id === routerId);

      if (router && !visitedRouters[routerId]) {
        visitedRouters[routerId] = true;

        (router.branches || []).forEach((branch, index) => {
          const isSurvivingBranch = (ignoreFirstBranch && index === 0) || ignoreAll;

          (branch.pageProcessors || []).forEach(pp => {
            if (!isSurvivingBranch) {
              if (pp.setupInProgress || (!pp._exportId && !pp._importId)) {
                unconfiguredCount += 1;
              } else {
                configuredCount += 1;
              }
            }
          });
          if (branch.nextRouterId) {
            routerStepsCount(branch.nextRouterId, false, isSurvivingBranch);
          }
        });
      }
    };

    routerStepsCount(routerId, true, false);
  }

  return {configuredCount, unconfiguredCount};
};

// #endregion
