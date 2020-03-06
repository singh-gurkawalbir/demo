import { call, takeEvery, put, select } from 'redux-saga/effects';
import actionTypes from '../../actions/types';
import actions from '../../actions';
import { SCOPES } from '../resourceForm';
import * as selectors from '../../reducers';
import { commitStagedChanges } from '../resources';
import flowResourceUtil from './util';

export function* saveFlowResource({ id }) {
  const flowResourceObj = yield select(selectors.getFlowResource, id);
  const { foregroundPatch } = flowResourceUtil.getPatchSet(flowResourceObj);

  if (foregroundPatch) {
    const { patch, resourceType, resourceId } = foregroundPatch || {};

    if (!!patch && !!resourceType && !!resourceId) {
      yield put(actions.resource.patchStaged(resourceId, patch, SCOPES.VALUE));
      const error = yield call(commitStagedChanges, {
        resourceType,
        id: resourceId,
        scope: SCOPES.VALUE,
      });

      // trigger save failed in case of error
      if (error) yield put(actions.flowResource.saveFailed(id));

      // trigger save complete in case of success
      yield put(actions.flowResource.saveComplete(id));
    } else {
      // trigger save failed in case any among patch, resourceType and resourceId is missing
      yield put(actions.flowResource.saveFailed(id));
    }
  } else {
    // trigger save complete in case editor doesnt have any foreground processes
    yield put(actions.flowResource.saveComplete(id));
  }
}

export const flowResourceSagas = [
  takeEvery(actionTypes.FLOW_RESOURCE.SAVE, saveFlowResource),
];
