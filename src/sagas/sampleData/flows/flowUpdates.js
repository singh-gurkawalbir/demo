import { put, select, call } from 'redux-saga/effects';
import { resourceData, getFlowReferencesForResource } from '../../../reducers';
import { SCOPES } from '../../resourceForm';
import actions from '../../../actions';
import { refreshResourceData } from './utils';
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

  if (resourceType === 'exports' || resourceType === 'imports') {
    // Handles on update of Export or Import on edit, Transformations, Hooks and import mappings
    yield put(
      actions.flowData.updateFlowsForResource(resourceId, resourceType)
    );
  }
}

export function* updateFlowsDataForResource({ resourceId, resourceType }) {
  // get flow ids using this resourceId
  const flowRefs = yield select(getFlowReferencesForResource, resourceId);
  // make a preview call for hooks so that the entire state of that processor updates if present
  let flowIndex = 0;

  while (flowIndex < flowRefs.length) {
    // fetch flow
    const flowId = flowRefs[flowIndex];

    // reset the state for that resourceId and subsequent state reset
    yield put(actions.flowData.reset(flowId, resourceId));
    // Fetch preview data for this resource in all used flows
    yield call(refreshResourceData, { flowId, resourceId, resourceType });

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
