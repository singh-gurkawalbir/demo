import { put, select, call } from 'redux-saga/effects';
import {
  resourceData,
  getFlowReferencesForResource,
  getFlowReferencesForScript,
} from '../../../reducers';
import { SCOPES } from '../../resourceForm';
import actions from '../../../actions';
import { getFlowUpdatesFromPatch } from '../../../utils/flowData';

function* updateResponseMapping({ flowId, resourceIndex }) {
  const { merged: flow } = yield select(
    resourceData,
    'flows',
    flowId,
    SCOPES.VALUE
  );
  const { pageProcessors = [] } = flow;
  const updatedResource = pageProcessors[resourceIndex];

  yield put(
    actions.flowData.updateResponseMapping(
      flowId,
      resourceIndex,
      updatedResource.responseMapping
    )
  );
  const resourceToReset = pageProcessors[resourceIndex + 1];

  if (resourceToReset) {
    yield put(
      actions.flowData.reset(
        flowId,
        resourceToReset._exportId || resourceToReset._importId
      )
    );
  }
}

export function* updateFlowOnResourceUpdate({
  resourceType,
  resourceId,
  patch,
}) {
  if (resourceType === 'flows') {
    const flowUpdates = getFlowUpdatesFromPatch(patch);

    // Handles Delete PP/PG, Swap order
    if (flowUpdates.sequence) {
      yield put(actions.flowData.updateFlow(resourceId));
    }

    // Handles Response Mappings update
    if (flowUpdates.responseMapping) {
      const { resourceIndex } = flowUpdates.responseMapping;

      yield call(updateResponseMapping, { flowId: resourceId, resourceIndex });
    }
  }

  if (['exports', 'imports', 'scripts'].includes(resourceType)) {
    /* Handles on update of :
     * 1. Export or Import on edit, Transformations, Hooks and import mappings
     * 2. Scripts, there by updates state of corresponding flow states which uses
     * this script as hooks as part of their PP/PG's
     * 3. @TODO: Raghu File Definitions for ftp PP/PG's
     */
    yield put(
      actions.flowData.updateFlowsForResource(resourceId, resourceType)
    );
  }
}

// On Script resource update , handles related flows to reset their Sample data states
function* updateFlowsForScripts({ scriptId }) {
  const flowRefsWithResource = yield select(
    getFlowReferencesForScript,
    scriptId
  );
  let refIndex = 0;

  while (refIndex < flowRefsWithResource.length) {
    const { flowId, resourceId } = flowRefsWithResource[refIndex];

    if (flowId && resourceId) {
      // reset the state for that resourceId and subsequent state reset
      yield put(actions.flowData.reset(flowId, resourceId));
    }

    refIndex += 1;
  }
}

export function* updateFlowsDataForResource({ resourceId, resourceType }) {
  if (resourceType === 'scripts') {
    return yield call(updateFlowsForScripts, { scriptId: resourceId });
  }

  // get flow ids using this resourceId
  const flowRefs = yield select(getFlowReferencesForResource, resourceId);
  let flowIndex = 0;

  while (flowIndex < flowRefs.length) {
    // fetch flow
    const flowId = flowRefs[flowIndex];

    // reset the state for that resourceId and subsequent state reset
    yield put(actions.flowData.reset(flowId, resourceId));
    // Fetch preview data for this resource in all used flows
    // @TODO : fetch only for the current flow
    flowIndex += 1;
  }
}

export function* updateFlowData({ flowId }) {
  // Updates flow structure incase of Drag and change flow order
  const { merged: updatedFlow } = yield select(
    resourceData,
    'flows',
    flowId,
    SCOPES.VALUE
  );

  yield put(actions.flowData.resetFlowSequence(flowId, updatedFlow));
}
