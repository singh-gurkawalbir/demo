import { put, call, select } from 'redux-saga/effects';
import actions from '../../../actions';
import { uploadRawData } from '../../uploadFile';
import { selectors } from '../../../reducers';
import { SCOPES } from '../../resourceForm';

export function* saveRawDataOnResource({
  resourceId,
  rawData,
  resourceType = 'exports',
}) {
  if (!resourceId || !rawData) return;
  const runKey = yield call(uploadRawData, {
    file: rawData,
  });
  const ownerUserId = yield select(selectors.ownerUserId);
  // rawData is stored in a S3 bucket whose key is the combination of userId and runkey
  const rawDataKey = ownerUserId + runKey;
  const patchSet = [
    {
      op: 'add',
      path: '/rawData',
      value: rawDataKey,
    },
  ];

  // Save the resource
  yield put(actions.resource.patchStaged(resourceId, patchSet, SCOPES.VALUE));
  yield put(actions.resource.commitStaged(resourceType, resourceId, SCOPES.VALUE));
}
