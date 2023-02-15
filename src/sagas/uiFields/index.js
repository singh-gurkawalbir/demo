import { put, takeLatest, takeEvery, select, call, take, all } from 'redux-saga/effects';
import actions from '../../actions';
import { selectors } from '../../reducers';
import actionTypes from '../../actions/types';
import { getResource } from '../resources';
import { isNewId } from '../../utils/resource';
import { flowPatchRegex } from '../../utils/flowData';
import { apiCallWithRetry } from '../index';

export function* requestFlowResources({ flowId }) {
  try {
    const flowResources = yield call(apiCallWithRetry, {
      path: `/flows/${flowId}/descendants`,
      opts: {
        method: 'GET',
      },
    });

    yield put(actions.uiFields.receivedFlowLevel(flowId, flowResources));
  } catch (error) {
    // error handling
  }
}

export function* loadResourceUIFields({ resourceId, resourceType }) {
  if (!resourceId || !resourceType) return;
  const resourceUIFields = yield select(selectors.resourceUIFields, resourceId);

  if (!resourceUIFields) {
    // ui fields are yet to be fetched for the newly added resource
    yield call(getResource, { resourceType, id: resourceId });
  }
}

export function* loadFlowResourceUIFields({ flowId }) {
  if (!flowId || isNewId(flowId)) return;
  // fetches list of all exports and imports for the flow
  const flowResourceIds = yield select(selectors.flowResourceIds, flowId);
  // returns true/false based on whether all the resources in the flow have their UI fields loaded
  const hasLoadedAllResourceUIFields = yield select(selectors.hasLoadedAllResourceUIFields, flowResourceIds);
  const flowResourcesStatus = yield select(selectors.flowResourcesStatus, flowId);

  if (!hasLoadedAllResourceUIFields && flowResourcesStatus !== 'requested') {
    // fetch all the resource UI fields for the flow if there are any resources whose UI fields are not loaded
    yield put(actions.uiFields.requestFlowLevel(flowId));
    // wait for the flow resources to be fetched
    yield take(actionTypes.UI_FIELDS.FLOW_LEVEL.RECEIVED);
  }
}

export function* onFlowUpdate({
  resourceType,
  resourceId: flowId,
  patch = [],
}) {
  if (resourceType === 'flows') {
    const anyPgOrPpPatch = patch.find(p => p.path.includes('pageGenerators') || p.path.includes('pageProcessors'));

    // the below filter tracks any patch changes to pgs/pps in the flow
    const addPatches = patch.filter(p => {
      if (!['add', 'replace'].includes(p.op)) return false;

      // go through add patches that match the flowPatchRegex
      return flowPatchRegex.newPPSequence.test(p.path) ||
        flowPatchRegex.pgSequence.test(p.path) ||
        flowPatchRegex.oldPPSequence.test(p.path) ||
        flowPatchRegex.firstPgOrPp.test(p.path) ||
        flowPatchRegex.ppAddition.test(p.path);
    });

    if (addPatches.length) {
      yield all(addPatches.map(addPatch => {
        let resourceId;
        let resourceType;

        if (flowPatchRegex.oldPPSequence.test(addPatch.path)) {
          resourceId = addPatch.value;
          resourceType = addPatch.path.includes('_importId') ? 'imports' : 'exports';
        } else {
          const { value } = addPatch;
          const resource = Array.isArray(value) ? value[0] : value;

          // fetch the resourceId just added to the flow
          resourceId = resource._exportId || resource._importId;
          resourceType = resource._exportId ? 'exports' : 'imports';
        }

        // load the UI fields for the resource if it is not loaded already
        return call(loadResourceUIFields, { resourceId, resourceType });
      }));
    }
    if (anyPgOrPpPatch) {
      // for any flow resource change patches, let us refresh resource list of the flow
      const flowResourceIds = yield select(selectors.flowResourceIds, flowId);

      yield put(actions.uiFields.updateFlowResources(flowId, flowResourceIds));
    }
  }
}

export default [
  takeLatest(actionTypes.UI_FIELDS.FLOW_LEVEL.REQUEST, requestFlowResources),
  takeEvery(actionTypes.RESOURCE.UPDATED, onFlowUpdate),
];
