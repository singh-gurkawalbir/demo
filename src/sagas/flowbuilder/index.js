import { put, select, takeEvery } from 'redux-saga/effects';
import jsonPatch from 'fast-json-patch';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { selectors } from '../../reducers';
import {
  addPageGenerators,
  addPageProcessor,
  deletePPStepForOldSchema,
  deletePGOrPPStepForRouters,
  deleteUnUsedRouters,
  mergeDragSourceWithTarget,
  getFlowAsyncKey,
  moveStepFunction,
} from '../../utils/flows/flowbuilder';
import { getChangesPatchSet } from '../../utils/json';
import { GRAPH_ELEMENTS_TYPE } from '../../constants';
import customCloneDeep from '../../utils/customCloneDeep';

export function* moveStep({flowId, stepInfo}) {
  const flow = (yield select(selectors.resourceData, 'flows', flowId))?.merged;
  const patchSet = getChangesPatchSet(moveStepFunction, flow, stepInfo);

  yield put(actions.resource.patchAndCommitStaged('flows', flowId, patchSet, {
    asyncKey: getFlowAsyncKey(flowId),
    options: {
      revertChangesOnFailure: true,
    },
  }));
}

export function* createNewPGStep({ flowId }) {
  const flow = (yield select(selectors.resourceData, 'flows', flowId))?.merged;
  const patchSet = getChangesPatchSet(addPageGenerators, flow);

  yield put(actions.resource.patchAndCommitStaged('flows', flowId, patchSet, {
    asyncKey: getFlowAsyncKey(flowId),
    options: {
      revertChangesOnFailure: true,
    },
  }));
}

export function* deleteStep({flowId, stepId}) {
  const elementsMap = yield select(selectors.fbGraphElementsMap, flowId);
  const flow = yield select(selectors.fbFlow, flowId);
  const originalFlow = (yield select(selectors.resourceData, 'flows', flowId))?.merged;
  const step = elementsMap[stepId];
  const {path} = step.data;
  const isPageGenerator = step.type === GRAPH_ELEMENTS_TYPE.PG_STEP;
  let patchSet;

  if (originalFlow.routers?.length || isPageGenerator) {
    patchSet = getChangesPatchSet(deletePGOrPPStepForRouters, flow, originalFlow, stepId, elementsMap);
  } else {
    patchSet = getChangesPatchSet(deletePPStepForOldSchema, originalFlow, path);
  }

  yield put(actions.resource.patchAndCommitStaged('flows', flowId, patchSet, {
    asyncKey: getFlowAsyncKey(flowId),
  }));
}

export function* createNewPPStep({ flowId, path: branchPath, processorIndex }) {
  const insertAtIndex = processorIndex ?? -1;
  const flow = (yield select(selectors.resourceData, 'flows', flowId))?.merged;
  const patchSet = getChangesPatchSet(addPageProcessor, flow, insertAtIndex, branchPath);

  yield put(actions.resource.patchAndCommitStaged('flows', flowId, patchSet, {
    asyncKey: getFlowAsyncKey(flowId),
    options: {
      revertChangesOnFailure: true,
    },
  }));
}

export function* mergeBranch({flowId}) {
  const flow = yield select(selectors.fbFlow, flowId);
  const elementsMap = yield select(selectors.fbGraphElementsMap, flowId);
  const mergeTargetId = yield select(selectors.fbMergeTargetId, flowId);
  const mergeTargetType = yield select(selectors.fbMergeTargetType, flowId);
  const dragStepId = yield select(selectors.fbDragStepId, flowId);
  const patchSet = [];
  const mergeTarget = elementsMap[mergeTargetId];
  const isMergable = mergeTarget?.type !== GRAPH_ELEMENTS_TYPE.MERGE || mergeTarget?.data?.mergableTerminals?.includes(dragStepId);

  // It's possible that a user releases the mouse while NOT on top of a valid merge target.
  // if this is the case, we still want to reset the drag state, just skip the merge attempt.
  if (mergeTargetId && mergeTargetType && isMergable) {
    mergeDragSourceWithTarget(flow, elementsMap, dragStepId, mergeTargetId, patchSet);
    yield put(actions.resource.patchAndCommitStaged('flows', flowId, patchSet, { asyncKey: getFlowAsyncKey(flowId) }));
  }

  // After merge is complete, we need to reset the state to remove all the transient state
  // used while dragging is being performed.
  yield put(actions.flow.dragEnd(flowId));
  yield put(actions.flow.mergeTargetClear(flowId));
}

export function* deleteEdge({ flowId, edgeId }) {
  const elementsMap = yield select(selectors.fbGraphElementsMap, flowId);

  const edge = elementsMap[edgeId];

  if (!edge) { return; }
  // remove the nextRouterId references
  const patchSet = [{
    op: 'remove',
    path: `${edge.data.path}/nextRouterId`,
  }];

  yield put(actions.resource.patchAndCommitStaged('flows', flowId, patchSet, { asyncKey: getFlowAsyncKey(flowId) }));
}

export function* deleteRouter({flowId, routerId, prePatches}) {
  const _flow = yield select(selectors.fbFlow, flowId);
  const flow = customCloneDeep(_flow);
  const {routers = []} = flow;
  const patchSet = prePatches || [];

  const router = routers.find(r => r.id === routerId);

  if (router) {
    const preceedingRouter = routers.find(r => r.branches.find(branch => branch.nextRouterId === routerId));

    if (preceedingRouter) {
      const routerIndex = routers.findIndex(r => r.id === routerId);
      const precedingRouterIndex = routers.findIndex(r => r.id === preceedingRouter.id);
      const preceedingBranchIndex = preceedingRouter.branches.findIndex(branch => branch.nextRouterId === routerId);
      const pageProcessors = jsonPatch.getValueByPointer(flow, `/routers/${precedingRouterIndex}/branches/${preceedingBranchIndex}/pageProcessors`);
      const routerPageProcessors = jsonPatch.getValueByPointer(flow, `/routers/${routerIndex}/branches/0/pageProcessors`);
      const nextRouterId = jsonPatch.getValueByPointer(flow, `/routers/${routerIndex}/branches/0/nextRouterId`);

      patchSet.push({
        op: 'replace',
        path: `/routers/${precedingRouterIndex}/branches/${preceedingBranchIndex}/pageProcessors`,
        value: [...pageProcessors, ...routerPageProcessors],
      });
      patchSet.push({
        op: 'replace',
        path: `/routers/${precedingRouterIndex}/branches/${preceedingBranchIndex}/nextRouterId`,
        value: nextRouterId,
      });
      patchSet.push({
        op: 'remove',
        path: `/routers/${routerIndex}`,
      });

      // skip first router for the check, as nothing points to first router
      const exemptRouters = [routers[0].id, routerId];
      const orphanRouter = router => {
        if (exemptRouters.includes(router.id)) return false;

        return !routers.some(r => r.branches.some(branch => branch.nextRouterId === routerId));
      };
      let orphanRouterIndex = routers.findIndex(orphanRouter);

      while (orphanRouterIndex > -1) {
        patchSet.push({
          op: 'remove',
          path: `/routers/${routerIndex}`,
        });
        exemptRouters.push(routers[routerIndex].id);
        orphanRouterIndex = routers.findIndex(orphanRouter);
      }
    } else if (routers[0].id === routerId) {
      // Observe all the changes that are being done to flow here on.
      const observer = jsonPatch.observe(flow);

      if (router.branches.length > 1) {
        router.branches.length = 1;
      }
      delete router.routeRecordsTo;
      delete router.routeRecordsUsing;
      deleteUnUsedRouters(flow);
      // generate a patch set of all the changes done to the flow
      patchSet.push(...jsonPatch.generate(observer));
    }
    yield put(actions.resource.patchAndCommitStaged('flows', flowId, patchSet, { asyncKey: getFlowAsyncKey(flowId) }));
  }
}

export default [
  takeEvery(actionTypes.FLOW.ADD_NEW_PG_STEP, createNewPGStep),
  takeEvery(actionTypes.FLOW.ADD_NEW_PP_STEP, createNewPPStep),
  takeEvery(actionTypes.FLOW.MOVE_STEP, moveStep),
  takeEvery(actionTypes.FLOW.DELETE_STEP, deleteStep),
  takeEvery(actionTypes.FLOW.MERGE_BRANCH, mergeBranch),
  takeEvery(actionTypes.FLOW.DELETE_EDGE, deleteEdge),
  takeEvery(actionTypes.FLOW.DELETE_ROUTER, deleteRouter),
];
