import { put, select, call } from 'redux-saga/effects';
import { resourceData, getFlowReferencesForResource } from '../../../reducers';
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
  // Previously this used to be pageProcessors[resourceIndex+1] as we need all subsequent resources to be reset , assuming this is the last action on this resource
  // But, as we got postResponseMapHook action after responseMapping , we need to reset from current resourceIndex
  // @TODO: Raghu Add a new action that resets specific stage on a resource for a flowId, then we can just reset responseMapping state instead of resetting entire resource state
  const resourceToReset = pageProcessors[resourceIndex];

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
    yield put(
      actions.flowData.updateFlowsForResource(resourceId, resourceType)
    );
  }
}

/* Handles on update of :
 * 1. Export or Import on edit, Transformations, Hooks and import mappings
 * 2. Scripts, there by updates state of corresponding flow states which uses
 * this script as hooks as part of their PP/PG's
 * 3. File Definitions , there by updates flow states using File Adapter PP/PGs using this fileDefID
 */
export function* updateFlowsDataForResource({ resourceId, resourceType }) {
  /*
   * flowRefs : [{flowId, resourceId}, ..] for all the flows ( PP / PG )
   */
  const flowRefs = yield select(
    getFlowReferencesForResource,
    resourceId,
    resourceType
  );
  let flowIndex = 0;

  while (flowIndex < flowRefs.length) {
    // fetch flow
    const { flowId, resourceId } = flowRefs[flowIndex];

    // reset the state for that resourceId and subsequent state reset
    yield put(actions.flowData.reset(flowId, resourceId));
    // Fetch preview data for this resource in all used flows
    // TODO @Raghu: fetch only for the current flow
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
