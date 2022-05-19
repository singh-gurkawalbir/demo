import { put, select, takeEvery } from 'redux-saga/effects';
import jsonPatch from 'fast-json-patch';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { GRAPH_ELEMENTS_TYPE, PageProcessorPathRegex } from '../../constants';
import { selectors } from '../../reducers';
import { mergeDragSourceWithTarget } from '../../utils/flows/flowbuilder';

export function* createNewPGStep({ flowId }) {
  const originalFlow = (yield select(selectors.resourceData, 'flows', flowId))?.merged;
  const patchSet = [];

  if (!originalFlow?.pageGenerators) {
    patchSet.push({
      op: 'add',
      path: '/pageGenerators',
      value: [],
    });
  } else if (!originalFlow.pageGenerators.length) {
    patchSet.push({
      op: 'add',
      path: '/pageGenerators/-',
      value: {setupInProgress: true},
    });
  }
  patchSet.push({
    op: 'add',
    path: '/pageGenerators/-',
    value: {setupInProgress: true},
  });

  yield put(actions.resource.patchAndCommitStaged('flows', flowId, patchSet));
}

export function* deleteStep({flowId, stepId}) {
  const elementsMap = yield select(selectors.fbGraphElementsMap, flowId);
  const flow = yield select(selectors.fbFlow, flowId);
  const originalFlow = (yield select(selectors.resourceData, 'flows', flowId))?.merged;
  const patchSet = [];

  const step = elementsMap[stepId];

  const isPageGenerator = step.type === GRAPH_ELEMENTS_TYPE.PG_STEP;

  if (originalFlow?.routers?.length) {
    const {path} = step.data;

    if (isPageGenerator) {
      // remove the node
      patchSet.push({
        op: 'remove',
        path,
      });
      // If last PG is deleted, add a new PG step
      if (flow.pageGenerators.length === 1) {
        patchSet.push({
          op: 'add',
          path,
          value: {setupInProgress: true},
        });
      }
    } else
    // Page processors
    // Typical page processor looks like /routers/:routerIndex/branches/:branchIndex/pageProcessors/:pageProcessorIndex
    if (PageProcessorPathRegex.test(path)) {
      const [, routerIndex, branchIndex, pageProcessorIndex] = PageProcessorPathRegex.exec(path);

      const pageProcessors = jsonPatch.getValueByPointer(flow, `/routers/${routerIndex}/branches/${branchIndex}/pageProcessors`);

      if (pageProcessors.length === 1) {
        const branches = jsonPatch.getValueByPointer(flow, `/routers/${routerIndex}/branches`);
        const routers = jsonPatch.getValueByPointer(flow, '/routers');

        if (branches.length === 1 && routers.length > 1) {
          patchSet.push({
            op: 'remove',
            path: `/routers/${routerIndex}`,
          });
          flow.routers.forEach((router, rIndex) => {
            router.branches.forEach((branch, bIndex) => {
              if (branch.nextRouterId === flow.routers[routerIndex].id) {
                patchSet.push({
                  op: 'remove',
                  path: `/routers/${rIndex}/branches/${bIndex}/nextRouterId`,
                });
              }
            });
          });
        } else {
          patchSet.push({
            op: 'remove',
            path: `/routers/${routerIndex}/branches/${branchIndex}/pageProcessors/${pageProcessorIndex}`,
          });
        }
      } else {
        patchSet.push({
          op: 'remove',
          path: `/routers/${routerIndex}/branches/${branchIndex}/pageProcessors/${pageProcessorIndex}`,
        });
      }
    }
  } else if (isPageGenerator) {
    const pgIndex = flow.pageGenerators.findIndex(pg => pg._exportId === stepId);

    patchSet.push({
      op: 'remove',
      path: `/pageGenerators/${pgIndex}`,
    });
    // If last PG is deleted, add a new PG step
    if (flow.pageGenerators.length === 1) {
      patchSet.push({
        op: 'add',
        path: '/pageGenerators/-',
        value: {setupInProgress: true},
      });
    }
  } else {
    const ppIndex = flow.pageGenerators.findIndex(pg => pg._importId === stepId || pg._exportId === stepId);

    patchSet.push({
      op: 'remove',
      path: `/pageProcessors/${ppIndex}`,
    });
  }

  yield put(actions.resource.patchAndCommitStaged('flows', flowId, patchSet));
}

export function* createNewPPStep({ flowId, path: branchPath }) {
  let patchSet = [];
  const flow = (yield select(selectors.resourceData, 'flows', flowId))?.merged;

  if (flow?.routers?.length) {
    patchSet = [{
      op: 'add',
      path: `${branchPath}/pageProcessors/-`,
      value: {setupInProgress: true},
    }];
  } else {
    if (!flow?.pageProcessors) {
      patchSet.push({
        op: 'add',
        path: '/pageProcessors',
        value: [],
      });
    }
    patchSet.push({
      op: 'add',
      path: '/pageProcessors/-',
      value: {setupInProgress: true},
    });
  }

  yield put(actions.resource.patchAndCommitStaged('flows', flowId, patchSet));
}

export function* mergeBranch({flowId}) {
  const flow = yield select(selectors.fbFlow, flowId);
  const elementsMap = yield select(selectors.fbGraphElementsMap, flowId);
  const mergeTargetId = yield select(selectors.fbMergeTargetId, flowId);
  const mergeTargetType = yield select(selectors.fbMergeTargetType, flowId);
  const dragStepId = yield select(selectors.fbDragStepId, flowId);
  const patchSet = [];

  // It's possible that a user releases the mouse while NOT on top of a valid merge target.
  // if this is the case, we still want to reset the drag state, just skip the merge attempt.
  if (mergeTargetId && mergeTargetType) {
    mergeDragSourceWithTarget(flow, elementsMap, dragStepId, mergeTargetId, patchSet);
  }

  yield put(actions.resource.patchAndCommitStaged('flows', flowId, patchSet));

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

  yield put(actions.resource.patchAndCommitStaged('flows', flowId, patchSet));
}

export default [
  takeEvery(actionTypes.FLOW.ADD_NEW_PG_STEP, createNewPGStep),
  takeEvery(actionTypes.FLOW.ADD_NEW_PP_STEP, createNewPPStep),
  takeEvery(actionTypes.FLOW.DELETE_STEP, deleteStep),
  takeEvery(actionTypes.FLOW.MERGE_BRANCH, mergeBranch),
  takeEvery(actionTypes.FLOW.DELETE_EDGE, deleteEdge),
];
