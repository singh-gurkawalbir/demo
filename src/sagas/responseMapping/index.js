import { call, takeEvery, put, select } from 'redux-saga/effects';
import actionTypes from '../../actions/types';
import actions from '../../actions';
import { SCOPES } from '../resourceForm';
import * as selectors from '../../reducers';
import { commitStagedChanges } from '../resources';
import responseMappingUtil from '../../utils/responseMapping';

export function* saveResponseMapping({ id }) {
  const responseMappingObj = yield select(selectors.getResponseMapping, id);
  const { patch, resourceType, resourceId } = responseMappingUtil.getPatchSet(
    responseMappingObj
  );

  if (patch && resourceType && resourceId) {
    yield put(actions.resource.patchStaged(resourceId, patch, SCOPES.VALUE));
    const error = yield call(commitStagedChanges, {
      resourceType,
      id: resourceId,
      scope: SCOPES.VALUE,
    });

    // trigger save failed in case of error
    if (error) yield put(actions.responseMapping.saveFailed(id));

    // trigger save complete in case of success
    yield put(actions.responseMapping.saveComplete(id));
  } else {
    // trigger save failed in case any among patch, resourceType and resourceId is missing
    yield put(actions.responseMapping.saveFailed(id));
  }
}

export const responseMappingSagas = [
  takeEvery(actionTypes.RESPONSE_MAPPING.SAVE, saveResponseMapping),
];
