import { put, select, call } from 'redux-saga/effects';
import { selectors } from '../../../../reducers';
import { SCOPES, updateFlowDoc } from '../../../resourceForm';
import actions from '../../../../actions';
import {
  getFlowUpdatesFromPatch,
  getResourceStageUpdatedFromPatch,
  getSubsequentStages,
  isRawDataPatchSet,
} from '../../../../utils/flowData';
import { emptyObject } from '../../../../utils/constants';

export function* _updateResponseMapping({ flowId, resourceIndex }) {
  const flow = (yield select(
    selectors.resourceData,
    'flows',
    flowId,
    SCOPES.VALUE
  ))?.merged || emptyObject;
  const { pageProcessors = [] } = flow;
  const updatedResource = pageProcessors[resourceIndex];

  if (resourceIndex < 0 || !updatedResource) {
    return;
  }
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
  const resourceType = resourceToReset.type === 'export' ? 'exports' : 'imports';
  const stagesToReset = ['responseMapping', ...getSubsequentStages('responseMapping', resourceType)];

  if (resourceToReset) {
    yield put(
      actions.flowData.resetStages(
        flowId,
        resourceToReset._exportId || resourceToReset._importId,
        stagesToReset
      )
    );
  }
}

export function* updateFlowOnResourceUpdate({
  resourceType,
  resourceId,
  patch,
  context,
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

      yield call(_updateResponseMapping, { flowId: resourceId, resourceIndex });
    }
  }

  if (['exports', 'imports', 'scripts'].includes(resourceType)) {
    const stagesToReset = [];
    const updatedStage = getResourceStageUpdatedFromPatch(patch);

    // No need to update the resources if the patch set is a raw data patch set
    if (!isRawDataPatchSet(patch)) {
    // If there is an updatedStage -> get list of all stages to update from that stage
      if (updatedStage) {
        stagesToReset.push(updatedStage, ...getSubsequentStages(updatedStage, resourceType));
      }
      // else go ahead and update the whole resource's state as stagesToReset is []
      yield put(actions.flowData.updateFlowsForResource(resourceId, resourceType, stagesToReset));
    }
    if (context?.flowId) {
      yield call(updateFlowDoc, { flowId: context.flowId, resourceType, resourceId });
    }
  }
}

/* Handles on update of :
 * 1. Export or Import on edit, Transformations, Hooks and import mappings
 * 2. Scripts, there by updates state of corresponding flow states which uses
 * this script as hooks as part of their PP/PG's
 * 3. File Definitions , there by updates flow states using File Adapter PP/PGs using this fileDefID
 */
export function* updateFlowsDataForResource({ resourceId, resourceType, stagesToReset }) {
  /*
   * flowRefs : [{flowId, resourceId}, ..] for all the flows ( PP / PG )
   */
  const flowRefs = yield select(
    selectors.flowReferencesForResource,
    resourceType,
    resourceId
  );
  let flowIndex = 0;

  while (flowIndex < flowRefs.length) {
    // fetch flow
    const { flowId, resourceId } = flowRefs[flowIndex];

    // reset the state for that resourceId and subsequent state reset
    yield put(actions.flowData.resetStages(flowId, resourceId, stagesToReset));
    flowIndex += 1;
  }
}

export function* updateFlowData({ flowId }) {
  // Updates flow structure incase of Drag and change flow order
  const { merged: updatedFlow } = yield select(
    selectors.resourceData,
    'flows',
    flowId,
    SCOPES.VALUE
  );

  if (updatedFlow) {
    yield put(actions.flowData.resetFlowSequence(flowId, updatedFlow));
  }
}
