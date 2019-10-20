import moment from 'moment';
import { put, select } from 'redux-saga/effects';
import { resourceData } from '../../../reducers';
import { SCOPES } from '../../resourceForm';
import actions from '../../../actions';

export function* fetchFlowResources({ flow, type, eliminateDataProcessors }) {
  const resourceMap = {};
  const resourceList = flow[type];

  if (flow && resourceList && resourceList.length) {
    for (let index = 0; index < resourceList.length; index += 1) {
      const resourceInfo = resourceList[index];
      const resourceType =
        resourceInfo && resourceInfo.type === 'import' ? 'imports' : 'exports';
      const resourceId =
        resourceInfo[resourceType === 'exports' ? '_exportId' : '_importId'];
      const { merged: resource } = yield select(
        resourceData,
        resourceType,
        resourceId,
        SCOPES.VALUE
      );

      if (resource) {
        const { transform, filter, hooks, ...rest } = resource;

        if (eliminateDataProcessors) {
          resourceMap[resourceId] = { doc: rest };
        } else {
          resourceMap[resourceId] = { doc: resource };
        }

        resourceMap[resourceId].options = {};

        if (resourceType === 'exports' && resource.type === 'delta') {
          resourceMap[resourceId].options.postData = {
            lastExportDateTime: moment()
              .add(-1, 'y')
              .toISOString(),
          };
        }
      }
    }
  }

  return resourceMap;
}

export function* refreshResourceData({ flowId, resourceId, resourceType }) {
  const lastStage = 'transform';
  let isPageGenerator = false;

  if (resourceType !== 'imports') {
    // find resource in pageGenerators list for the flow. If exists , then make isPageGenerator as true
    const { merged: flow } = yield select(resourceData, 'flows', flowId);
    const { pageGenerators = [] } = flow;
    const resource = pageGenerators.find(pg => pg._exportId === resourceId);

    if (resource) isPageGenerator = true;
  }

  yield put(
    actions.flowData.requestProcessorData(
      flowId,
      resourceId,
      resourceType,
      lastStage,
      isPageGenerator
    )
  );
}
