import { put, call, delay, select } from 'redux-saga/effects';
import actions from '../../../actions';
import { uploadRawData } from '../../uploadFile';
import { userProfile, resource } from '../../../reducers';
import { EMPTY_RAW_DATA } from '../../../utils/constants';

export function* saveSampleDataOnResource({
  resourceId,
  rawData,
  resourceType,
}) {
  if (!resourceId || rawData === undefined) return;
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
  const runKey = yield call(uploadRawData, {
    file: rawData,
  });
  const profile = yield select(userProfile);
  // rawData is stored in a S3 bucket whose key is the combination of userId and runkey
  const rawDataKey = profile._id + runKey;
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

/**
 * This saga removes rawData prop on the resource if existed
 * when the resource is updated with invalid configuration
 */
export function* removeRawDataOnResource({
  resourceId,
  resourceType = 'exports'
}) {
  const resourceObj = yield select(resource, resourceType, resourceId) || {};
  if (!resourceObj.rawData || resourceObj.rawData === EMPTY_RAW_DATA) {
    return;
  }
  // TODO @Raghu Remove this EMPTY_RAW_DATA and remove rawData prop once BE Fix is done
  // As currently, we are not able to remove this prop once set. We assign EMPTY_RAW_DATA to handle that case
  const patchSet = [
    {
      op: 'replace',
      path: '/rawData',
      value: EMPTY_RAW_DATA
    },
  ];
  // Save the resource
  yield put(actions.resource.patchStaged(resourceId, patchSet, 'value'));
  yield put(actions.resource.commitStaged(resourceType, resourceId, 'value'));
}
