import { put, call, delay } from 'redux-saga/effects';
import actions from '../../../actions';
import { uploadRawData } from '../../uploadFile';

export function* saveSampleDataOnResource({
  resourceId,
  rawData,
  resourceType,
}) {
  if (!resourceId || !rawData) return;
  const patchSet = [
    {
      op: 'add',
      path: '/sampleData',
      value: rawData,
    },
  ];

  // Mocking delay to make sure stage is cleared for this resourceId
  yield delay(50);
  yield put(actions.resource.patchStaged(resourceId, patchSet, 'value'));
  yield put(actions.resource.commitStaged(resourceType, resourceId, 'value'));
}

export function* saveRawDataOnResource({
  resourceId,
  rawData,
  resourceType = 'exports',
}) {
  if (!resourceId || !rawData) return;
  const rawDataKey = yield call(uploadRawData, {
    file: rawData,
  });
  const patchSet = [
    {
      op: 'add',
      path: '/rawData',
      value: rawDataKey,
    },
  ];

  // Save the resource
  yield put(actions.resource.patchStaged(resourceId, patchSet, 'value'));
  yield put(actions.resource.commitStaged(resourceType, resourceId, 'value'));
}
