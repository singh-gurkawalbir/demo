import { put, select, takeEvery } from 'redux-saga/effects';
import jsonPatch from 'fast-json-patch';
import actions from '../../actions';
import actionTypes from '../../actions/types';
import { GRAPH_ELEMENTS_TYPE, PageProcessorPathRegex } from '../../constants';
import { selectors } from '../../reducers';
import { generateId } from '../../utils/string';

export function* createNewPGStep({ flowId }) {
  const patchSet = [{
    op: 'add',
    path: '/pageGenerators/-',
    value: {application: `none-${generateId(6)}`},
  }];

  yield put(actions.resource.patchAndCommitStaged('flows', flowId, patchSet));
}

export function* deleteStep({flowId, stepId}) {
  const elementsMap = yield select(selectors.fbElementsMap, flowId);
  const flow = yield select(selectors.fbFlow, flowId);

  const step = elementsMap[stepId];
  const isPageGenerator = step.type === GRAPH_ELEMENTS_TYPE.PG_STEP;
  const {path} = step.data;
  const patchSet = [];

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
        value: {application: `none=${generateId()}`},
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
            if (branch._nextRouterId === flow.routers[routerIndex]._id) {
              patchSet.push({
                op: 'remove',
                path: `/routers/${rIndex}/branches/${bIndex}/_nextRouterId`,
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
  yield put(actions.resource.patchAndCommitStaged('flows', flowId, patchSet));
}

export function* createNewPPStep({ flowId, path: branchPath }) {
  let patchSet = [];
  const flow = yield select(selectors.resourceData, 'flows', flowId)?.merged;

  if (flow?.routers?.length) {
    patchSet = [{
      op: 'add',
      path: `${branchPath}/pageProcessors/-`,
      value: {application: `none-${generateId(6)}`},
    }];
  } else {
    patchSet = [{
      op: 'add',
      path: '/pageProcessors/-',
      value: {application: `none-${generateId(6)}`},
    }];
  }

  yield put(actions.resource.patchAndCommitStaged('flows', flowId, patchSet));
}

export default [
  takeEvery(actionTypes.FLOW.ADD_NEW_PG_STEP, createNewPGStep),
  takeEvery(actionTypes.FLOW.ADD_NEW_PP_STEP, createNewPPStep),
  takeEvery(actionTypes.FLOW.DELETE_STEP, deleteStep),
];
